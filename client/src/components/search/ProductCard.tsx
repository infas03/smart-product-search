import type { ScoredProduct } from "../../types/product.types";
import HighlightedText from "./HighlightedText";

interface ProductCardProps {
  product: ScoredProduct;
  query: string;
}

function ProductCard({ product, query }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 ${
        isOutOfStock ? "opacity-60 line-through" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          <HighlightedText text={product.name} query={query} />
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
          <span>{product.category}</span>
          <span>·</span>
          <span className="font-medium text-gray-700">
            ${product.price.toFixed(2)}
          </span>
          <span>·</span>
          <span className="flex items-center gap-0.5">
            <StarIcon />
            {product.rating}
          </span>
        </div>
        {isOutOfStock && (
          <span className="mt-0.5 inline-block text-xs font-medium text-red-500">
            Out of stock
          </span>
        )}
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg
      className="h-3 w-3 text-amber-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default ProductCard;
