import { useState } from 'react';

const initialFilters = {
  minPrice: null,
  maxPrice: null,
  minArea: null,
  maxArea: null,
  location: ''
};

export function useListingsFilters() {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    filters,
    updateFilter
  };
}