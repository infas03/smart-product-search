import type { MegaMenuResponse } from "../../types/product.types";
import MegaMenuContent from "./MegaMenuContent";
import SearchEmptyState from "./SearchEmptyState";
import SearchLoadingState from "./SearchLoadingState";

interface MegaMenuProps {
  isVisible: boolean;
  isSearching: boolean;
  searchResults: MegaMenuResponse | null;
  query: string;
}

function MegaMenu({ isVisible, isSearching, searchResults, query }: MegaMenuProps) {
  if (!isVisible) return null;

  const hasNoResults = searchResults && searchResults.totalResults === 0;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
      {isSearching && <SearchLoadingState />}
      {!isSearching && hasNoResults && <SearchEmptyState query={query} />}
      {!isSearching && searchResults && searchResults.totalResults > 0 && (
        <MegaMenuContent data={searchResults} query={query} />
      )}
    </div>
  );
}

export default MegaMenu;
