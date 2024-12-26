import { ScrapedData } from '../types/scraper';
import { ValidationError } from './errors';

export async function validateData(data: ScrapedData): Promise<ScrapedData> {
  // Validate title
  if (!data.title?.trim()) {
    throw new ValidationError('Title is required');
  }

  // Validate URL
  try {
    new URL(data.url);
  } catch {
    throw new ValidationError('Invalid URL format');
  }

  // Validate timestamp
  if (!(data.timestamp instanceof Date) || isNaN(data.timestamp.getTime())) {
    throw new ValidationError('Invalid timestamp format');
  }

  // Validate content
  if (!data.content?.trim()) {
    throw new ValidationError('Content is required');
  }

  return data;
}