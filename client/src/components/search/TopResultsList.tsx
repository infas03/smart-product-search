import type { ScoredProduct } from "../../types/product.types";
import ProductCard from "./ProductCard";

interface TopResultsListProps {
  products: ScoredProduct[];
  query: string;
}

function TopResultsList({ products, query }: TopResultsListProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Top Results
      </h3>
      <div className="space-y-0.5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} query={query} />
        ))}
      </div>
    </div>
  );
}

export default TopResultsList;
