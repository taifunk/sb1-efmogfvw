import { z } from 'zod';

export const ListingSchema = z.object({
  id: z.string().uuid().optional(),
  source: z.string(),
  listingUrl: z.string().url(),
  price: z.number().positive(),
  address: z.string(),
  areaM2: z.number().positive(),
  rooms: z.number().int().positive().optional(),
  listingTime: z.date().optional(),
  contactInfo: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export class RealEstateListing {
  constructor(data) {
    const validated = ListingSchema.parse(data);
    Object.assign(this, validated);
  }
}