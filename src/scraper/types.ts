export interface PropertyDetails {
  price: number;
  area: number;
  rooms: number;
  type: string;
  features: string[];
  description: string;
}

export interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Media {
  images: string[];
}

export interface Contact {
  agent: string;
  phone?: string;
  email?: string;
}

export interface Metadata {
  created: Date;
  updated: Date;
}

export interface PropertyListing {
  listing_id: string;
  timestamp: Date;
  property: PropertyDetails;
  location: Location;
  media: Media;
  contact: Contact;
  metadata: Metadata;
}

export interface ScraperConfig {
  maxConcurrentSessions: number;
  minDelay: number;
  maxDelay: number;
  requestsPerSecondPerIP: number;
  sessionRotationInterval: number;
}