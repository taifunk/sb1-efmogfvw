import { parse } from 'date-fns';

export function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s-.,]/g, '') // Remove special characters except basic punctuation
    .trim();
}

export function parseDate(dateStr: string): Date {
  try {
    // Try common date formats
    const formats = [
      'yyyy-MM-dd',
      'dd.MM.yyyy',
      'MM/dd/yyyy',
      'yyyy-MM-dd HH:mm:ss'
    ];

    for (const format of formats) {
      const date = parse(dateStr, format, new Date());
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    throw new Error('Unable to parse date');
  } catch (error) {
    return new Date();
  }
}