import { Browser, chromium } from 'playwright';
import { scraperConfig, USER_AGENT } from './config';

export class BrowserPool {
  private browsers: Browser[] = [];
  private lastRotation: number = Date.now();

  async initialize() {
    const { maxConcurrentSessions } = scraperConfig;
    
    for (let i = 0; i < maxConcurrentSessions; i++) {
      const browser = await this.createBrowser();
      this.browsers.push(browser);
    }
  }

  async getBrowser(): Promise<Browser> {
    await this.checkRotation();
    const browser = this.browsers.find(b => !b.isConnected());
    return browser || this.browsers[0];
  }

  private async createBrowser(): Promise<Browser> {
    return chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage'
      ],
      userAgent: USER_AGENT
    });
  }

  private async checkRotation() {
    const now = Date.now();
    if (now - this.lastRotation >= scraperConfig.sessionRotationInterval) {
      await this.rotateSessions();
      this.lastRotation = now;
    }
  }

  private async rotateSessions() {
    const newBrowsers = await Promise.all(
      this.browsers.map(() => this.createBrowser())
    );
    
    await Promise.all(this.browsers.map(b => b.close()));
    this.browsers = newBrowsers;
  }

  async cleanup() {
    await Promise.all(this.browsers.map(b => b.close()));
    this.browsers = [];
  }
}