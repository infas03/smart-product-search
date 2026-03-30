function SearchLoadingState() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse space-y-1.5">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export default SearchLoadingState;
