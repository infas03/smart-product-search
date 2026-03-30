import type { Request, Response, NextFunction } from "express";

export function validateSearchQuery(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const query = req.query.q;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    res.status(400).json({ error: "Search query parameter 'q' is required" });
    return;
  }

  req.query.q = query.trim().substring(0, 100);
  next();
}
