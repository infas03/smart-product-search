import mongoose, { Schema } from "mongoose";
import { PRODUCT_CATEGORIES, type Product } from "../types/product.types.js";

export type ProductDocument = Product & mongoose.Document;

const productSchema = new Schema<ProductDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: PRODUCT_CATEGORIES,
    },
    tags: { type: [String], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    rating: { type: Number, required: true },
  },
  {
    collection: "products",
    versionKey: false,
  }
);

productSchema.index(
  { name: "text", description: "text", tags: "text" },
  { weights: { name: 10, tags: 5, description: 1 }, name: "product_text_search" }
);

productSchema.index({ category: 1 }, { name: "category_index" });

const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;
