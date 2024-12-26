import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';
import { config } from './config.js';
import { RealEstateListing } from './models.js';
import { logger } from './utils/logger.js';
import { sleep, randomInt } from './utils/helpers.js';

export class StealthScraper {
  async setupBrowser() {
    const userAgent = new UserAgent();
    
    return await puppeteer.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        `--user-agent=${userAgent.toString()}`
      ]
    });
  }

  async simulateHumanBehavior(page) {
    // Random scroll
    await page.evaluate(() => {
      window.scrollTo({
        top: Math.random() * document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
    
    await sleep(randomInt(500, 1500));

    // Random mouse movements
    for (let i = 0; i < randomInt(2, 5); i++) {
      await page.mouse.move(
        randomInt(0, 800),
        randomInt(0, 600)
      );
      await sleep(randomInt(100, 300));
    }
  }

  async scrapeKvEe(criteria) {
    const browser = await this.setupBrowser();
    const listings = [];
    
    try {
      const page = await browser.newPage();
      
      // Set custom headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'et-EE,et;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      });

      const url = this.buildSearchUrl(criteria);
      await page.goto(url);
      await this.simulateHumanBehavior(page);

      while (true) {
        const pageListings = await this.extractPageListings(page);
        listings.push(...pageListings);
        
        const nextButton = await page.$('.pagination__next');
        if (!nextButton) break;
        
        await sleep(randomInt(config.scraping.minDelay, config.scraping.maxDelay));
        await nextButton.click();
        await page.waitForNavigation();
        await this.simulateHumanBehavior(page);
      }
    } finally {
      await browser.close();
    }
    
    return listings;
  }

  buildSearchUrl(criteria) {
    const params = new URLSearchParams({
      city: criteria.location,
      type: criteria.propertyType,
      price_min: criteria.minPrice,
      price_max: criteria.maxPrice
    });
    
    return `${config.urls.kvEeBase}/search?${params.toString()}`;
  }

  async extractPageListings(page) {
    const listings = [];
    const elements = await page.$$('.real-estate-item');
    
    for (const element of elements) {
      try {
        const listing = new RealEstateListing({
          source: 'kv.ee',
          listingUrl: await this.extractAttribute(element, 'href'),
          price: await this.extractPrice(element),
          address: await this.extractAddress(element),
          areaM2: await this.extractArea(element),
          rooms: await this.extractRooms(element),
          listingTime: new Date(),
          contactInfo: await this.extractContact(element)
        });
        
        listings.push(listing);
      } catch (error) {
        logger.error('Error extracting listing:', error);
      }
    }
    
    return listings;
  }

  // Helper methods to be implemented based on actual HTML structure
  async extractAttribute(element, attr) {
    return await element.evaluate((el, attr) => el.getAttribute(attr), attr);
  }

  async extractPrice(element) {
    // Implementation needed
    return 0;
  }

  async extractAddress(element) {
    // Implementation needed
    return '';
  }

  async extractArea(element) {
    // Implementation needed
    return 0;
  }

  async extractRooms(element) {
    // Implementation needed
    return null;
  }

  async extractContact(element) {
    // Implementation needed
    return null;
  }
}