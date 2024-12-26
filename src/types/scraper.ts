export interface ScrapedData {
  title: string;
  url: string;
  timestamp: Date;
  content: string;
}

export interface ScraperConfig {
  timeout: number;
  maxRetries: number;
  delayBetweenRequests: number;
  maxResults: number;
}