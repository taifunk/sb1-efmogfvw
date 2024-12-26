import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { BaseScraper } from './base';
import { ScrapedData } from '../types/scraper';
import { cleanText, parseDate } from '../utils/text';
import { getUserAgent } from '../utils/user-agents';

export class SeleniumScraper extends BaseScraper {
  private driver: WebDriver | null = null;

  async scrape(url: string): Promise<ScrapedData[]> {
    try {
      await this.initDriver();
      return await this.handleRetry(async () => {
        const results = await this.extractData(url);
        return this.validateResults(results);
      });
    } finally {
      await this.cleanup();
    }
  }

  private async initDriver(): Promise<void> {
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions({
        'args': ['--headless', '--disable-gpu', '--no-sandbox'],
        'userAgent': getUserAgent()
      })
      .build();
  }

  private async extractData(url: string): Promise<ScrapedData[]> {
    if (!this.driver) throw new Error('Driver not initialized');

    await this.driver.get(url);
    await this.driver.wait(until.elementLocated(By.css('body')), this.config.timeout);

    const elements = await this.driver.findElements(By.css('.listing-item'));
    const results: ScrapedData[] = [];

    for (const element of elements.slice(0, this.config.maxResults)) {
      const title = await element.findElement(By.css('.title')).getText();
      const link = await element.findElement(By.css('a')).getAttribute('href');
      const timestamp = await element.findElement(By.css('.date')).getText();
      const content = await element.findElement(By.css('.description')).getText();

      results.push({
        title: cleanText(title),
        url: link,
        timestamp: parseDate(timestamp),
        content: cleanText(content)
      });

      await delay(this.config.delayBetweenRequests);
    }

    return results;
  }

  private async cleanup(): Promise<void> {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }
}