import { config } from './config.js';
import { ScrapingService } from './services/scraping.js';
import { logger } from './utils/logger.js';
import 'dotenv/config';

async function main() {
  try {
    const scraper = new ScrapingService();
    
    logger.info('Starting scraping with criteria:', config.search.defaultCriteria);
    
    const url = `https://www.kv.ee/search?${new URLSearchParams({
      deal_type: 'sale',
      county: 'harjumaa',
      parish: 'tallinn',
      price_min: config.search.defaultCriteria.minPrice,
      price_max: config.search.defaultCriteria.maxPrice,
      rooms_min: config.search.defaultCriteria.minRooms,
      rooms_max: config.search.defaultCriteria.maxRooms
    }).toString()}`;

    const listings = await scraper.scrapeListings(url);
    logger.info(`Found ${listings.length} listings`);
    
  } catch (error) {
    logger.error('Error in main process:', error);
    throw error;
  }
}

main().catch(console.error);