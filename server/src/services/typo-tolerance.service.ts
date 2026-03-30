import type { Product } from "../types/product.types.js";
import { calculateSimilarity } from "../utils/string-similarity.js";
import { splitIntoWords } from "../utils/text.utils.js";

const MATCH_THRESHOLD = 0.6;

interface TypoMatchResult {
  product: Product;
  overallScore: number;
  nameScore: number;
  tagScore: number;
}

function findClosestWord(searchWord: string, productWords: string[]): number {
  let best = 0;
  for (const word of productWords) {
    const score = calculateSimilarity(searchWord, word);
    if (score > best) best = score;
    if (score === 1) break;
  }
  return best;
}

function calculateAverageWordMatch(searchWords: string[], productWords: string[]): number {
  if (searchWords.length === 0 || productWords.length === 0) return 0;

  let total = 0;
  for (const searchWord of searchWords) {
    total += findClosestWord(searchWord, productWords);
  }
  return total / searchWords.length;
}

export function findProductsWithTypoTolerance(
  query: string,
  products: Product[]
): TypoMatchResult[] {
  const searchWords = splitIntoWords(query);
  if (searchWords.length === 0) return [];

  const matched: TypoMatchResult[] = [];

  for (const product of products) {
    const nameWords = splitIntoWords(product.name);
    const tagWords = product.tags.map((tag) => tag.toLowerCase().replace(/-/g, ""));
    const descriptionWords = splitIntoWords(product.description);
    const allWords = [...nameWords, ...tagWords, ...descriptionWords];

    const nameScore = calculateAverageWordMatch(searchWords, nameWords);
    const tagScore = calculateAverageWordMatch(searchWords, tagWords);
    const overallScore = calculateAverageWordMatch(searchWords, allWords);

    const hasMatch = searchWords.some((searchWord) =>
      allWords.some(
        (word) => calculateSimilarity(searchWord, word) >= MATCH_THRESHOLD
      )
    );

    if (hasMatch) {
      matched.push({ product, overallScore, nameScore, tagScore });
    }
  }

  return matched;
}
