import { normalizeText } from "./text.utils.js";

export function generateTrigrams(text: string): string[] {
  const normalized = normalizeText(text).replace(/\s+/g, "");
  const trigrams = new Set<string>();

  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.add(normalized.substring(i, i + 3));
  }

  return Array.from(trigrams);
}

export function generateProductTrigrams(name: string, tags: string[]): string[] {
  const combined = [name, ...tags].join(" ");
  return generateTrigrams(combined);
}
