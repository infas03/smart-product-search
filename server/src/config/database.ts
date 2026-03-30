import mongoose from "mongoose";
import environment from "./environment.js";

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(environment.mongodbUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
