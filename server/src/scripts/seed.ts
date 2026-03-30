import mongoose from "mongoose";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(__dirname, "../../.env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/smart-product-search";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Home", "Sports", "Beauty", "Books"],
    },
    tags: { type: [String], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    rating: { type: Number, required: true },
  },
  { collection: "products" }
);

const Product = mongoose.model("Product", productSchema);

async function seed(): Promise<void> {
  const connection = await mongoose.connect(MONGODB_URI);
  const databaseName = connection.connection.db?.databaseName;
  console.log(`Connected to MongoDB: ${databaseName}`);

  await Product.collection.drop().catch(() => {
    console.log("No existing products collection to drop");
  });

  const filePath = resolve(__dirname, "../../data/products.json");
  const rawData = readFileSync(filePath, "utf-8");
  const products = JSON.parse(rawData);

  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);

  await Product.collection.createIndex(
    { name: "text", description: "text", tags: "text" },
    { weights: { name: 10, tags: 5, description: 1 }, name: "product_text_search" }
  );
  console.log("Created text index with weights: name(10), tags(5), description(1)");

  await Product.collection.createIndex({ category: 1 }, { name: "category_index" });
  console.log("Created category index");

  await mongoose.disconnect();
  console.log("Seed completed successfully");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
