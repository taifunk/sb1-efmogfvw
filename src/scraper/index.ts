import { Browser, Page } from 'playwright';
import { BrowserPool } from './browser-pool';
import { RateLimiter } from './rate-limiter';
import { PropertyExtractor } from './property-extractor';
import { PropertyListing } from './types';
import { scraperConfig } from './config';
import { supabase } from '../lib/supabaseClient';

export class KvEeScraper {
  private browserPool: BrowserPool;
  private rateLimiter: RateLimiter;
  private extractor: PropertyExtractor;

  constructor() {
    this.browserPool = new BrowserPool();
    this.rateLimiter = new RateLimiter();
    this.extractor = new PropertyExtractor();
  }

  async initialize() {
    await this.browserPool.initialize();
  }

  async scrapeListings(urls: string[]): Promise<PropertyListing[]> {
    const listings: PropertyListing[] = [];
    const browser = await this.browserPool.getBrowser();
    
    for (const url of urls) {
      try {
        await this.rateLimiter.waitForSlot('default', scraperConfig.requestsPerSecondPerIP);
        const listing = await this.scrapeListing(browser, url);
        if (listing) {
          listings.push(listing);
          await this.saveListing(listing);
        }
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }

    return listings;
  }

  private async scrapeListing(browser: Browser, url: string): Promise<PropertyListing | null> {
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await this.randomDelay();
      
      return await this.extractor.extract(page, url);
    } catch (error) {
      console.error(`Failed to extract listing from ${url}:`, error);
      return null;
    } finally {
      await page.close();
    }
  }

  private async saveListing(listing: PropertyListing) {
    const { error } = await supabase
      .from('real_estate_listings')
      .upsert({
        id: listing.listing_id,
        source: 'kv.ee',
        listing_url: `https://www.kv.ee/${listing.listing_id}`,
        price: listing.property.price,
        address: listing.location.address,
        area_m2: listing.property.area,
        rooms: listing.property.rooms,
        listing_time: listing.timestamp.toISOString(),
        contact_info: JSON.stringify(listing.contact)
      });

    if (error) {
      console.error('Error saving listing:', error);
    }
  }

  private async randomDelay() {
    const delay = Math.random() * (scraperConfig.maxDelay - scraperConfig.minDelay) + scraperConfig.minDelay;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async cleanup() {
    await this.browserPool.cleanup();
  }
}