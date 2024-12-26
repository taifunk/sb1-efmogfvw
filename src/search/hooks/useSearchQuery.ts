import { useQuery, UseQueryOptions } from 'react-query';
import { SearchState, SearchResponse, SearchError } from '../types';
import { searchService } from '../services/searchService';

interface UseSearchQueryOptions<T> extends Omit<UseQueryOptions<SearchResponse<T>, SearchError>, 'queryKey' | 'queryFn'> {
  enabled?: boolean;
}

export function useSearchQuery<T>(
  state: SearchState,
  options?: UseSearchQueryOptions<T>
) {
  return useQuery<SearchResponse<T>, SearchError>(
    ['search', state],
    () => searchService.search<T>(state),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options
    }
  );
}