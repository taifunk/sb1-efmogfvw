import { Logger } from '../utils/logger';
import { ValidationError } from '../utils/errors';
import { ScrapedData, ScraperConfig } from '../types/scraper';
import { validateData } from '../utils/validation';
import { delay } from '../utils/helpers';

export abstract class BaseScraper {
  protected logger: Logger;
  protected config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.logger = new Logger('scraping.log');
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      delayBetweenRequests: 2000,
      maxResults: 3,
      ...config
    };
  }

  abstract scrape(url: string): Promise<ScrapedData[]>;

  protected async validateResults(data: ScrapedData[]): Promise<ScrapedData[]> {
    const validatedData = [];
    
    for (const item of data) {
      try {
        const validated = await validateData(item);
        validatedData.push(validated);
      } catch (error) {
        if (error instanceof ValidationError) {
          this.logger.error(`Validation failed for ${item.url}: ${error.message}`);
          continue;
        }
        throw error;
      }
    }

    return validatedData.slice(0, this.config.maxResults);
  }

  protected async handleRetry<T>(
    operation: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retryCount >= this.config.maxRetries) {
        throw error;
      }

      const backoffTime = Math.pow(2, retryCount) * 5000;
      this.logger.warn(`Retrying after ${backoffTime}ms. Attempt ${retryCount + 1}`);
      await delay(backoffTime);
      
      return this.handleRetry(operation, retryCount + 1);
    }
  }
}