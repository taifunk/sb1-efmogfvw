export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ScrapingError extends Error {
  constructor(message: string, public readonly url: string) {
    super(message);
    this.name = 'ScrapingError';
  }
}