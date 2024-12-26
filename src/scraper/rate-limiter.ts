export class RateLimiter {
  private lastRequestTime: Map<string, number> = new Map();
  private requestsThisSecond: Map<string, number> = new Map();

  async waitForSlot(ip: string, requestsPerSecond: number): Promise<void> {
    const now = Date.now();
    const lastRequest = this.lastRequestTime.get(ip) || 0;
    const requests = this.requestsThisSecond.get(ip) || 0;

    // Reset counter if we're in a new second
    if (now - lastRequest >= 1000) {
      this.requestsThisSecond.set(ip, 0);
    }

    // Wait if we've hit the rate limit
    if (requests >= requestsPerSecond) {
      await new Promise(resolve => setTimeout(resolve, 1000 - (now - lastRequest)));
    }

    this.lastRequestTime.set(ip, now);
    this.requestsThisSecond.set(ip, requests + 1);
  }
}