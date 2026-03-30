import type { MegaMenuResponse } from "../../types/product.types";
import TopResultsList from "./TopResultsList";
import CategoryGroupList from "./CategoryGroupList";

interface MegaMenuContentProps {
  data: MegaMenuResponse;
  query: string;
}

function MegaMenuContent({ data, query }: MegaMenuContentProps) {
  const hasTopResults = data.topResults.length > 0;
  const hasCategoryGroups = data.categoryGroups.length > 0;

  return (
    <div className="grid grid-cols-1 gap-4 p-3 md:grid-cols-[1.2fr_1fr]">
      {hasTopResults && (
        <TopResultsList products={data.topResults} query={query} />
      )}
      {hasCategoryGroups && (
        <div className="border-t pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
          <CategoryGroupList groups={data.categoryGroups} query={query} />
        </div>
      )}
    </div>
  );
}

export default MegaMenuContent;
