import { Page } from 'playwright';
import { PropertyListing } from './types';
import { SELECTORS } from './config';

export class PropertyExtractor {
  async extract(page: Page, url: string): Promise<PropertyListing> {
    const listing_id = this.extractListingId(url);
    
    const [
      property,
      location,
      media,
      contact
    ] = await Promise.all([
      this.extractProperty(page),
      this.extractLocation(page),
      this.extractMedia(page),
      this.extractContact(page)
    ]);

    return {
      listing_id,
      timestamp: new Date(),
      property,
      location,
      media,
      contact,
      metadata: {
        created: new Date(),
        updated: new Date()
      }
    };
  }

  private extractListingId(url: string): string {
    const match = url.match(/\/(\d+)/);
    return match ? match[1] : `kv-${Date.now()}`;
  }

  private async extractProperty(page: Page) {
    const price = await this.extractNumber(page, SELECTORS.price);
    const area = await this.extractNumber(page, SELECTORS.area);
    const rooms = await this.extractNumber(page, SELECTORS.rooms);
    const type = await this.extractText(page, SELECTORS.type);
    const features = await this.extractList(page, SELECTORS.features);
    const description = await this.extractText(page, SELECTORS.description);

    return { price, area, rooms, type, features, description };
  }

  private async extractLocation(page: Page) {
    const address = await this.extractText(page, SELECTORS.address);
    const coordsStr = await page.$eval(
      SELECTORS.coordinates,
      el => el.getAttribute('data-coordinates')
    );

    let coordinates;
    if (coordsStr) {
      const [lat, lng] = coordsStr.split(',').map(Number);
      coordinates = { lat, lng };
    }

    return { address, coordinates };
  }

  private async extractMedia(page: Page) {
    const images = await page.$$eval(
      SELECTORS.images,
      elements => elements.map(el => el.getAttribute('src')).filter(Boolean)
    );

    return { images };
  }

  private async extractContact(page: Page) {
    const agent = await this.extractText(page, SELECTORS.agent);
    const contactText = await this.extractText(page, SELECTORS.contact);
    
    const phone = this.extractPhone(contactText);
    const email = this.extractEmail(contactText);

    return { agent, phone, email };
  }

  private async extractNumber(page: Page, selector: string): Promise<number> {
    const text = await this.extractText(page, selector);
    return Number(text.replace(/[^\d.]/g, '')) || 0;
  }

  private async extractText(page: Page, selector: string): Promise<string> {
    return page.$eval(selector, el => el.textContent?.trim() || '')
      .catch(() => '');
  }

  private async extractList(page: Page, selector: string): Promise<string[]> {
    return page.$$eval(selector, elements => 
      elements.map(el => el.textContent?.trim() || '')
    ).catch(() => []);
  }

  private extractPhone(text: string): string | undefined {
    const match = text.match(/\+?\d{8,}/);
    return match ? match[0] : undefined;
  }

  private extractEmail(text: string): string | undefined {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : undefined;
  }
}