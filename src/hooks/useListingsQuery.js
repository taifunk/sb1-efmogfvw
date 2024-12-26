import { useQuery } from 'react-query';
import { supabase } from '../lib/supabaseClient';

export function useListingsQuery(filters) {
  // Create a stable query key by only including primitive values
  const queryKey = ['listings', JSON.stringify({
    minPrice: filters.minPrice ? Number(filters.minPrice) : null,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
    minArea: filters.minArea ? Number(filters.minArea) : null,
    maxArea: filters.maxArea ? Number(filters.maxArea) : null,
    location: filters.location || null
  })];

  return useQuery(
    queryKey,
    async () => {
      let query = supabase.from('real_estate_listings').select('*');

      // Apply filters only if they have valid values
      if (filters.minPrice) {
        query = query.gte('price', Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', Number(filters.maxPrice));
      }
      if (filters.minArea) {
        query = query.gte('area_m2', Number(filters.minArea));
      }
      if (filters.maxArea) {
        query = query.lte('area_m2', Number(filters.maxArea));
      }
      if (filters.location) {
        query = query.ilike('address', `%${filters.location}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
      retry: 2
    }
  );
}