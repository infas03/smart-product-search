import express from "express";
import cors from "cors";
import environment from "./config/environment.js";
import { connectDatabase } from "./config/database.js";
import { errorHandler } from "./middleware/error-handler.js";
import searchRouter from "./routes/search.routes.js";

const app = express();

app.use(cors({ origin: environment.corsOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/search", searchRouter);

app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(environment.port, () => {
    console.log(`Server running on port ${environment.port}`);
  });
}

startServer();
