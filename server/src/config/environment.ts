import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../.env") });

interface EnvironmentConfig {
  mongodbUri: string;
  port: number;
  corsOrigin: string;
}

const environment: Readonly<EnvironmentConfig> = Object.freeze({
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/smart-product-search",
  port: parseInt(process.env.PORT || "8085", 10),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
});

export default environment;
