/*
  # Real Estate Listings Schema

  1. New Tables
    - `real_estate_listings`
      - `id` (uuid, primary key)
      - `source` (text) - Source website (e.g., kv.ee, city24.ee)
      - `listing_url` (text) - Original listing URL
      - `price` (numeric) - Property price
      - `address` (text) - Property address
      - `area_m2` (numeric) - Area in square meters
      - `rooms` (integer) - Number of rooms
      - `listing_time` (timestamptz) - When the listing was posted
      - `contact_info` (text) - Contact information
      - `created_at` (timestamptz) - Record creation time
      - `updated_at` (timestamptz) - Record update time

  2. Indexes
    - On source and listing_url for efficient querying
    - On price and area for range queries
    - On address for location-based searches

  3. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE real_estate_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    listing_url TEXT NOT NULL,
    price NUMERIC NOT NULL,
    address TEXT NOT NULL,
    area_m2 NUMERIC NOT NULL,
    rooms INTEGER,
    listing_time TIMESTAMPTZ,
    contact_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_listing UNIQUE (source, listing_url)
);

-- Create indexes for efficient querying
CREATE INDEX idx_listings_source ON real_estate_listings(source);
CREATE INDEX idx_listings_price ON real_estate_listings(price);
CREATE INDEX idx_listings_area ON real_estate_listings(area_m2);
CREATE INDEX idx_listings_address ON real_estate_listings(address);

-- Enable RLS
ALTER TABLE real_estate_listings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
    ON real_estate_listings
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON real_estate_listings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_real_estate_listings_updated_at
    BEFORE UPDATE ON real_estate_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();