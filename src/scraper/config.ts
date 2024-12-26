import { ScraperConfig } from './types';

export const scraperConfig: ScraperConfig = {
  maxConcurrentSessions: 5,
  minDelay: 3000,
  maxDelay: 7000,
  requestsPerSecondPerIP: 1,
  sessionRotationInterval: 900000 // 15 minutes
};

export const USER_AGENT = 'RealEstateAnalytics/1.0 (https://example.com; contact@example.com)';

export const SELECTORS = {
  price: '.price-primary',
  area: '.property-size',
  rooms: '.rooms-count',
  type: '.property-type',
  features: '.features-list li',
  description: '.property-description',
  address: '.property-address',
  coordinates: '[data-coordinates]',
  images: '.property-images img',
  agent: '.agent-name',
  contact: '.contact-details'
};