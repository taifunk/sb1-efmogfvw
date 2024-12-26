import { useState, useCallback } from 'react';
import { SearchState } from '../types';

const initialState: SearchState = {
  query: '',
  filters: {},
  page: 1,
  resultsPerPage: 20
};

export function useSearchState() {
  const [state, setState] = useState<SearchState>(initialState);

  const updateQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query, page: 1 }));
  }, []);

  const updateFilters = useCallback((filters: Record<string, unknown>) => {
    setState(prev => ({ ...prev, filters, page: 1 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    updateQuery,
    updateFilters,
    updatePage,
    reset
  };
}