import { PropertyListing } from './types';

interface ScraperMetrics {
  totalAttempts: number;
  successfulScrapes: number;
  failedScrapes: number;
  totalDuration: number;
  errors: Record<string, number>;
}

export class ScraperMonitoring {
  private metrics: ScraperMetrics = {
    totalAttempts: 0,
    successfulScrapes: 0,
    failedScrapes: 0,
    totalDuration: 0,
    errors: {}
  };

  startScrape(): number {
    this.metrics.totalAttempts++;
    return Date.now();
  }

  recordSuccess(startTime: number, listing: PropertyListing): void {
    this.metrics.successfulScrapes++;
    this.metrics.totalDuration += Date.now() - startTime;
  }

  recordError(error: Error): void {
    this.metrics.failedScrapes++;
    const errorType = error.name || 'Unknown';
    this.metrics.errors[errorType] = (this.metrics.errors[errorType] || 0) + 1;
  }

  getMetrics(): ScraperMetrics {
    return { ...this.metrics };
  }
}

export const monitoring = new ScraperMonitoring();