import { SearchState, SearchResponse, SearchError } from '../types';
import { DEFAULT_CONFIG, RATE_LIMIT } from '../config';
import { supabase } from '../../lib/supabaseClient';
import { PropertyListing } from '../../scraper/types';

class SearchService {
  private requestCount = 0;
  private lastRequestTime = Date.now();
  private cache = new Map<string, {data: SearchResponse<any>, timestamp: number}>();

  async search<T>(state: SearchState): Promise<SearchResponse<T>> {
    await this.checkRateLimit();
    
    const cacheKey = this.getCacheKey(state);
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) return cached;
    
    const startTime = performance.now();
    
    try {
      const response = await this.performSearch<T>(state);
      const endTime = performance.now();
      
      const result = {
        ...response,
        timing: {
          took: endTime - startTime,
          parseTime: response.timing.parseTime,
          fetchTime: response.timing.fetchTime
        }
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async performSearch<T>(state: SearchState): Promise<SearchResponse<T>> {
    const parseStart = performance.now();
    
    let query = supabase
      .from('real_estate_listings')
      .select('*', { count: 'exact' });

    // Apply full-text search if query exists
    if (state.query) {
      query = query.textSearch('address', state.query, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Apply filters
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === 'object') {
          const { min, max } = value as { min?: number; max?: number };
          if (min !== undefined) query = query.gte(key, min);
          if (max !== undefined) query = query.lte(key, max);
        } else {
          query = query.eq(key, value);
        }
      }
    });

    const parseEnd = performance.now();
    const fetchStart = performance.now();

    // Execute query with pagination
    const { data, error, count } = await query
      .range(
        (state.page - 1) * state.resultsPerPage,
        state.page * state.resultsPerPage - 1
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    const fetchEnd = performance.now();

    return {
      results: (data || []).map(item => ({
        id: item.id,
        data: item as T,
        score: 1
      })),
      total: count || 0,
      page: state.page,
      totalPages: Math.ceil((count || 0) / state.resultsPerPage),
      timing: {
        took: 0,
        parseTime: parseEnd - parseStart,
        fetchTime: fetchEnd - fetchStart
      }
    };
  }

  private getCacheKey(state: SearchState): string {
    return JSON.stringify({
      query: state.query,
      filters: state.filters,
      page: state.page,
      resultsPerPage: state.resultsPerPage
    });
  }

  private getFromCache<T>(key: string): SearchResponse<T> | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > DEFAULT_CONFIG.cacheExpiration) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setCache(key: string, data: SearchResponse<any>): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Cleanup old cache entries
    if (this.cache.size > CACHE_CONFIG.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    if (now - this.lastRequestTime > RATE_LIMIT.windowMs) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    if (this.requestCount >= RATE_LIMIT.maxRequests) {
      throw new Error('Rate limit exceeded');
    }

    this.requestCount++;
  }

  private handleError(error: unknown): SearchError {
    if (error instanceof Error) {
      return {
        code: 'SEARCH_ERROR',
        message: error.message
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred'
    };
  }
}

export const searchService = new SearchService();