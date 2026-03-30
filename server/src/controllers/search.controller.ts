import type { Request, Response, NextFunction } from "express";
import { searchProducts } from "../services/search.service.js";

export async function handleSearchRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query.q as string;
    const results = await searchProducts(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
}
