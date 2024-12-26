import { createClient } from '@supabase/supabase-js';
import { logger } from './utils/logger.js';

export class Database {
  constructor() {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      throw new Error('Missing Supabase credentials');
    }
    
    this.client = createClient(url, key);
  }

  async insertListings(listings) {
    try {
      const { data, error } = await this.client
        .from('real_estate_listings')
        .insert(listings.map(l => ({
          source: l.source,
          listing_url: l.listingUrl,
          price: l.price,
          address: l.address,
          area_m2: l.areaM2,
          rooms: l.rooms,
          listing_time: l.listingTime,
          contact_info: l.contactInfo
        })));

      if (error) throw error;
      
      logger.info(`Successfully inserted ${listings.length} listings`);
      return data;
    } catch (error) {
      logger.error('Error inserting listings:', error);
      throw error;
    }
  }
}