import type { Product, ScoredProduct } from "../types/product.types.js";

const WEIGHT_TEXT_MATCH = 0.40;
const WEIGHT_NAME_MATCH = 0.30;
const WEIGHT_TAG_MATCH = 0.15;
const WEIGHT_RATING = 0.10;
const WEIGHT_STOCK = 0.05;

const IN_STOCK_SCORE = 1.0;
const OUT_OF_STOCK_SCORE = 0.2;
const MAX_RATING = 5.0;

interface ProductScoreInput {
  product: Product;
  textMatchScore: number;
  nameMatchScore: number;
  tagMatchScore: number;
}

function getStockAvailabilityScore(stock: number): number {
  return stock > 0 ? IN_STOCK_SCORE : OUT_OF_STOCK_SCORE;
}

function getRatingScore(rating: number): number {
  return rating / MAX_RATING;
}

export function calculateProductScore(input: ProductScoreInput): ScoredProduct {
  const totalScore =
    input.textMatchScore * WEIGHT_TEXT_MATCH +
    input.nameMatchScore * WEIGHT_NAME_MATCH +
    input.tagMatchScore * WEIGHT_TAG_MATCH +
    getRatingScore(input.product.rating) * WEIGHT_RATING +
    getStockAvailabilityScore(input.product.stock) * WEIGHT_STOCK;

  return {
    ...input.product,
    score: Math.round(totalScore * 1000) / 1000,
  };
}

export function sortByScore(products: ScoredProduct[]): ScoredProduct[] {
  return [...products].sort((first, second) => second.score - first.score);
}
