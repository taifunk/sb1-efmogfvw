import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base';
import { ScrapedData } from '../types/scraper';
import { cleanText, parseDate } from '../utils/text';
import { getUserAgent } from '../utils/user-agents';

export class BeautifulSoupScraper extends BaseScraper {
  async scrape(url: string): Promise<ScrapedData[]> {
    return this.handleRetry(async () => {
      const html = await this.fetchPage(url);
      const results = this.parseHtml(html);
      return this.validateResults(results);
    });
  }

  private async fetchPage(url: string): Promise<string> {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': getUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: this.config.timeout
    });

    return response.data;
  }

  private parseHtml(html: string): ScrapedData[] {
    const $ = cheerio.load(html);
    const results: ScrapedData[] = [];

    $('.listing-item').slice(0, this.config.maxResults).each((_, element) => {
      results.push({
        title: cleanText($(element).find('.title').text()),
        url: $(element).find('a').attr('href') || '',
        timestamp: parseDate($(element).find('.date').text()),
        content: cleanText($(element).find('.description').text())
      });
    });

    return results;
  }
}