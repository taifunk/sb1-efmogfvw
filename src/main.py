import asyncio
from loguru import logger
import sys
from config import Config, SearchCriteria
from scraper import StealthScraper
from database import Database

# Configure logging
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | <cyan>{function}</cyan> - <white>{message}</white>",
    level="INFO"
)
logger.add("scraper.log", rotation="500 MB", level="DEBUG")

async def main():
    try:
        # Initialize components
        scraper = StealthScraper()
        db = Database()
        
        # Use default search criteria
        criteria = Config.DEFAULT_SEARCH
        
        logger.info(f"Starting scraping with criteria: {criteria}")
        
        # Scrape listings
        listings = await scraper.scrape_kv_ee(criteria)
        logger.info(f"Found {len(listings)} listings")
        
        # Store in database
        if listings:
            await db.insert_listings(listings)
            logger.info("Successfully stored listings in database")
        
    except Exception as e:
        logger.error(f"Error in main process: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())