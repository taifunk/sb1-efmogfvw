// Core search types
export type SearchMode = 'FILTER' | 'REALTIME';

export interface SearchConfiguration {
  mode: SearchMode;
  debounceTimeout: number;
  cacheExpiration: number;
  resultsLimit: number;
  enableAnalytics: boolean;
  accessibility: {
    ariaLabels: Record<string, string>;
    announcements: boolean;
  };
}

export interface SearchState {
  query: string;
  filters: Record<string, unknown>;
  page: number;
  resultsPerPage: number;
}

export interface SearchResult<T> {
  id: string;
  data: T;
  score: number;
  highlight?: Record<string, string[]>;
}

export interface SearchResponse<T> {
  results: SearchResult<T>[];
  total: number;
  page: number;
  totalPages: number;
  timing: {
    took: number;
    parseTime: number;
    fetchTime: number;
  };
}

export interface SearchError {
  code: string;
  message: string;
  details?: unknown;
}

// Analytics types
export interface SearchAnalytics {
  queryCount: number;
  averageResponseTime: number;
  errorRate: number;
  popularQueries: Array<{
    query: string;
    count: number;
  }>;
  userSessions: number;
}