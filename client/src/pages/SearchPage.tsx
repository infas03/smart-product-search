import { useState, useRef, useCallback } from "react";
import SearchInput from "../components/search/SearchInput";
import MegaMenu from "../components/search/MegaMenu";
import useProductSearch from "../hooks/useProductSearch";
import useClickOutside from "../hooks/useClickOutside";
import useKeyboardNavigation from "../hooks/useKeyboardNavigation";

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchResults, isSearching, debouncedQuery, hasResults } =
    useProductSearch(searchQuery);

  const shouldShowMenu =
    isMenuOpen && debouncedQuery.length >= 2 && (isSearching || hasResults);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setSearchQuery(value);
    setIsMenuOpen(true);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  useClickOutside(containerRef, closeMenu);

  useKeyboardNavigation({
    isActive: shouldShowMenu,
    onEscape: () => {
      closeMenu();
      inputRef.current?.blur();
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 pt-16">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
        Smart Product Search
      </h1>
      <div ref={containerRef} className="relative">
        <SearchInput
          ref={inputRef}
          value={searchQuery}
          onChange={handleQueryChange}
          onFocus={handleInputFocus}
        />
        <MegaMenu
          isVisible={shouldShowMenu}
          isSearching={isSearching}
          searchResults={searchResults}
          query={debouncedQuery}
        />
      </div>
    </main>
  );
}

export default SearchPage;
