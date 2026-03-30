import type { CategoryGroup } from "../../types/product.types";
import ProductCard from "./ProductCard";

interface CategoryGroupListProps {
  groups: CategoryGroup[];
  query: string;
}

function CategoryGroupList({ groups, query }: CategoryGroupListProps) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            More in {group.category}
          </h3>
          <div className="space-y-0.5">
            {group.products.map((product) => (
              <ProductCard key={product.id} product={product} query={query} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CategoryGroupList;
