export class ScraperError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'ScraperError';
  }
}

export const ErrorCodes = {
  RATE_LIMIT: 'RATE_LIMIT',
  NETWORK: 'NETWORK',
  PARSER: 'PARSER',
  CAPTCHA: 'CAPTCHA',
  AUTH: 'AUTH'
} as const;

export function isRetryableError(error: unknown): boolean {
  if (error instanceof ScraperError) {
    return error.retryable;
  }
  return true;
}