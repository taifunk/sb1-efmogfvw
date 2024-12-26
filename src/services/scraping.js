import { SeleniumScraper } from '../scrapers/selenium';
import { BeautifulSoupScraper } from '../scrapers/beautiful-soup';
import { logger } from '../utils/logger';
import { supabase } from '../lib/supabaseClient';

const config = {
  timeout: 30000,
  maxRetries: 3,
  delayBetweenRequests: 2000,
  maxResults: 3
};

export class ScrapingService {
  constructor() {
    this.seleniumScraper = new SeleniumScraper(config);
    this.bsScraper = new BeautifulSoupScraper(config);
  }

  async scrapeListings(url) {
    try {
      // Try Selenium first
      try {
        const results = await this.seleniumScraper.scrape(url);
        if (results.length > 0) {
          await this.saveResults(results);
          return results;
        }
      } catch (error) {
        logger.error('Selenium scraping failed:', error);
      }

      // Fallback to BeautifulSoup
      const results = await this.bsScraper.scrape(url);
      await this.saveResults(results);
      return results;

    } catch (error) {
      logger.error('All scraping methods failed:', error);
      throw error;
    }
  }

  private async saveResults(results) {
    const { error } = await supabase
      .from('real_estate_listings')
      .upsert(
        results.map(result => ({
          source: 'kv.ee',
          listing_url: result.url,
          price: this.extractPrice(result.content),
          address: result.title,
          area_m2: this.extractArea(result.content),
          listing_time: result.timestamp,
          contact_info: result.content
        })),
        { onConflict: 'listing_url' }
      );

    if (error) {
      logger.error('Error saving results:', error);
      throw error;
    }
  }

  private extractPrice(content) {
    const match = content.match(/€\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  }

  private extractArea(content) {
    const match = content.match(/(\d+(?:\.\d+)?)\s*m²/);
    return match ? parseFloat(match[1]) : 0;
  }
}