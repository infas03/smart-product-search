import { forwardRef, type ChangeEvent } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onFocus }, ref) => {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      onChange(event.target.value);
    }

    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          placeholder="Search products..."
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition-shadow placeholder:text-gray-400 focus:border-gray-400 focus:shadow-md focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

export default SearchInput;
