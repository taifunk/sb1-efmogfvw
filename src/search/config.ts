import { SearchConfiguration } from './types';

export const DEFAULT_CONFIG: SearchConfiguration = {
  mode: 'FILTER',
  debounceTimeout: 300,
  cacheExpiration: 300000, // 5 minutes
  resultsLimit: 100,
  enableAnalytics: true,
  accessibility: {
    ariaLabels: {
      searchInput: 'Search input',
      searchButton: 'Search button',
      filterPanel: 'Search filters',
      resultsList: 'Search results',
      loadingState: 'Loading results',
      errorState: 'Error occurred'
    },
    announcements: true
  }
};

export const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000 // 1 minute
};

export const CACHE_CONFIG = {
  maxSize: 100,
  maxAge: 300000 // 5 minutes
};