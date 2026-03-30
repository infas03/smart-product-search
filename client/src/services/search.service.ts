import apiClient from "../lib/api-client";
import type { MegaMenuResponse } from "../types/product.types";

export async function fetchSearchResults(query: string): Promise<MegaMenuResponse> {
  const response = await apiClient.get<MegaMenuResponse>("/search", {
    params: { q: query },
  });
  return response.data;
}
