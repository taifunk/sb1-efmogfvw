import { SearchAnalytics } from '../types';

class SearchAnalyticsService {
  private metrics = {
    queryCount: 0,
    totalResponseTime: 0,
    errorCount: 0,
    queries: new Map<string, number>(),
    sessions: new Set<string>()
  };

  trackQuery(query: string, responseTime: number, sessionId: string): void {
    this.metrics.queryCount++;
    this.metrics.totalResponseTime += responseTime;
    this.metrics.queries.set(query, (this.metrics.queries.get(query) || 0) + 1);
    this.metrics.sessions.add(sessionId);
  }

  trackError(): void {
    this.metrics.errorCount++;
  }

  getAnalytics(): SearchAnalytics {
    const sortedQueries = Array.from(this.metrics.queries.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    return {
      queryCount: this.metrics.queryCount,
      averageResponseTime: this.metrics.queryCount ? 
        this.metrics.totalResponseTime / this.metrics.queryCount : 0,
      errorRate: this.metrics.queryCount ? 
        this.metrics.errorCount / this.metrics.queryCount : 0,
      popularQueries: sortedQueries,
      userSessions: this.metrics.sessions.size
    };
  }
}

export const searchAnalytics = new SearchAnalyticsService();