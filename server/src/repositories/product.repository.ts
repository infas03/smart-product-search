import ProductModel from "../models/product.model.js";
import type { Product } from "../types/product.types.js";

interface TextSearchResult extends Product {
  textScore: number;
}

export async function findByTextSearch(query: string): Promise<TextSearchResult[]> {
  const results = await ProductModel.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" }, _id: 0 }
  )
    .sort({ score: { $meta: "textScore" } })
    .lean<(Product & { score: number })[]>();

  return results.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    tags: product.tags,
    price: product.price,
    stock: product.stock,
    rating: product.rating,
    textScore: product.score,
  }));
}

export async function findAllProducts(): Promise<Product[]> {
  return ProductModel.find({}, { _id: 0, __v: 0 }).lean<Product[]>();
}
