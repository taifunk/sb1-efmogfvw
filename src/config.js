export const config = {
  scraping: {
    minDelay: 2000,  // ms
    maxDelay: 5000,  // ms
    retryAttempts: 3,
    retryDelay: 5000 // ms
  },
  
  search: {
    defaultCriteria: {
      location: "Tallinn",
      propertyType: "apartment",
      minPrice: 100000,
      maxPrice: 150000,
      minRooms: 2,
      maxRooms: 2
    }
  },
  
  urls: {
    kvEeBase: "https://www.kv.ee"
  },
  
  database: {
    listingsTable: "real_estate_listings"
  }
};