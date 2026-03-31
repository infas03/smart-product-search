import type {
  Product,
  ScoredProduct,
  CategoryGroup,
  MegaMenuResponse,
} from "../types/product.types.js";
import { findByTextSearch, findByTrigrams } from "../repositories/product.repository.js";
import { generateTrigrams } from "../utils/trigram.utils.js";
import { normalizeText } from "../utils/text.utils.js";
import { findProductsWithTypoTolerance } from "./typo-tolerance.service.js";
import { getCached, setCached } from "./search-cache.service.js";
import { calculateProductScore, sortByScore } from "./ranking.service.js";

const TOP_RESULTS_COUNT = 4;
const MAX_PER_CATEGORY = 4;

function scaleToRange(rawScore: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  return Math.min(rawScore / maxScore, 1);
}

function removeDuplicateProducts(products: ScoredProduct[]): ScoredProduct[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

function buildCategoryGroups(
  products: ScoredProduct[],
  excludeIds: Set<string>
): CategoryGroup[] {
  const groupedByCategory = new Map<string, ScoredProduct[]>();

  for (const product of products) {
    if (excludeIds.has(product.id)) continue;

    const existing = groupedByCategory.get(product.category) || [];
    if (existing.length < MAX_PER_CATEGORY) {
      existing.push(product);
      groupedByCategory.set(product.category, existing);
    }
  }

  return Array.from(groupedByCategory.entries())
    .map(([category, groupProducts]) => ({
      category: category as CategoryGroup["category"],
      products: groupProducts,
    }))
    .sort((first, second) => {
      const firstTopScore = first.products[0]?.score ?? 0;
      const secondTopScore = second.products[0]?.score ?? 0;
      return secondTopScore - firstTopScore;
    });
}

export async function searchProducts(query: string): Promise<MegaMenuResponse> {
  const cacheKey = normalizeText(query);
  const cached = getCached<MegaMenuResponse>(cacheKey);
  if (cached) return cached;

  const queryTrigrams = generateTrigrams(query);

  const [textSearchResults, trigramCandidates] = await Promise.all([
    findByTextSearch(query),
    queryTrigrams.length > 0 ? findByTrigrams(queryTrigrams) : Promise.resolve([]),
  ]);

  const scoredFromTextSearch = processTextSearchResults(textSearchResults);
  const scoredFromTypoTolerance = processTypoTolerantResults(query, trigramCandidates);

  const mergedResults = sortByScore(
    removeDuplicateProducts([...scoredFromTextSearch, ...scoredFromTypoTolerance])
  );

  const topResults = mergedResults.slice(0, TOP_RESULTS_COUNT);
  const topResultIds = new Set(topResults.map((product) => product.id));
  const categoryGroups = buildCategoryGroups(mergedResults, topResultIds);

  const response: MegaMenuResponse = {
    query,
    topResults,
    categoryGroups,
    totalResults: mergedResults.length,
  };

  setCached(cacheKey, response);
  return response;
}

function processTextSearchResults(
  results: Awaited<ReturnType<typeof findByTextSearch>>
): ScoredProduct[] {
  if (results.length === 0) return [];

  const highestScore = Math.max(...results.map((result) => result.textScore));

  return results.map((result) => {
    const { textScore, ...product } = result;
    const scaledScore = scaleToRange(textScore, highestScore);

    return calculateProductScore({
      product,
      textMatchScore: scaledScore,
      nameMatchScore: scaledScore * 0.8,
      tagMatchScore: scaledScore * 0.5,
    });
  });
}

function processTypoTolerantResults(query: string, allProducts: Product[]): ScoredProduct[] {
  const typoTolerantMatches = findProductsWithTypoTolerance(query, allProducts);

  return typoTolerantMatches.map((match) =>
    calculateProductScore({
      product: match.product,
      textMatchScore: match.overallScore,
      nameMatchScore: match.nameScore,
      tagMatchScore: match.tagScore,
    })
  );
}
