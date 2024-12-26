import React from 'react';
import { Card, TextInput } from '@tremor/react';

export default function ListingsFilters({ filters, onFilterChange }) {
  const handleNumberChange = (key, value) => {
    // Ensure we only pass numbers or null
    const numValue = value === '' ? null : Number(value);
    onFilterChange(key, numValue);
  };

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <TextInput
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            placeholder="Search by location..."
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Min Price
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filters.minPrice || ''}
              onChange={(e) => handleNumberChange('minPrice', e.target.value)}
              placeholder="€"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Price
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filters.maxPrice || ''}
              onChange={(e) => handleNumberChange('maxPrice', e.target.value)}
              placeholder="€"
              min={0}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Min Area
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filters.minArea || ''}
              onChange={(e) => handleNumberChange('minArea', e.target.value)}
              placeholder="m²"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Area
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filters.maxArea || ''}
              onChange={(e) => handleNumberChange('maxArea', e.target.value)}
              placeholder="m²"
              min={0}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}