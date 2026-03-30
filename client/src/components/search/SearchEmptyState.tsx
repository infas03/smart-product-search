interface SearchEmptyStateProps {
  query: string;
}

function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="px-4 py-8 text-center">
      <p className="text-sm text-gray-500">
        No products found for "<span className="font-medium text-gray-700">{query}</span>"
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Try a different search term or check for typos
      </p>
    </div>
  );
}

export default SearchEmptyState;
