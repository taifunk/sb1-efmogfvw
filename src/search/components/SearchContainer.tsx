import React from 'react';
import { SearchInput } from './SearchInput';
import { FilterPanel } from './FilterPanel';
import { ResultsList } from './ResultsList';
import { useSearchState } from '../hooks/useSearchState';
import { useSearchQuery } from '../hooks/useSearchQuery';
import { SearchConfiguration, SearchResult } from '../types';

interface SearchContainerProps<T> {
  config?: Partial<SearchConfiguration>;
  onResultSelect?: (result: SearchResult<T>) => void;
}

export function SearchContainer<T>({
  config,
  onResultSelect
}: SearchContainerProps<T>) {
  const {
    state,
    updateQuery,
    updateFilters,
    updatePage,
    reset
  } = useSearchState();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useSearchQuery<T>(state);

  return (
    <div className="space-y-4">
      <SearchInput
        value={state.query}
        onChange={updateQuery}
        disabled={isLoading}
      />
      
      <FilterPanel
        filters={state.filters}
        onChange={updateFilters}
        disabled={isLoading}
      />
      
      <ResultsList<T>
        results={data?.results || []}
        isLoading={isLoading}
        error={error}
        onSelect={onResultSelect}
        page={state.page}
        totalPages={data?.totalPages || 0}
        onPageChange={updatePage}
      />
    </div>
  );
}