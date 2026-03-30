import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSearchResults } from "../services/search.service";
import type { MegaMenuResponse } from "../types/product.types";
import useDebouncedValue from "./useDebouncedValue";

const MINIMUM_QUERY_LENGTH = 2;
const SEARCH_STALE_TIME = 60_000;

function useProductSearch(rawQuery: string) {
  const debouncedQuery = useDebouncedValue(rawQuery.trim(), 300);
  const isQueryLongEnough = debouncedQuery.length >= MINIMUM_QUERY_LENGTH;

  const { data, isLoading, isError, error } = useQuery<MegaMenuResponse>({
    queryKey: ["product-search", debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    enabled: isQueryLongEnough,
    staleTime: SEARCH_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  return {
    searchResults: data ?? null,
    isSearching: isLoading && isQueryLongEnough,
    isError,
    error,
    hasResults: isQueryLongEnough && !!data,
    debouncedQuery,
  };
}

export default useProductSearch;
