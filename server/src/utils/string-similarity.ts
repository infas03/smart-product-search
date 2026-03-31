import { metaphone } from "./phonetic.utils.js";

export function countEditsRequired(firstWord: string, secondWord: string): number {
  const firstLength = firstWord.length;
  const secondLength = secondWord.length;

  if (firstLength === 0) return secondLength;
  if (secondLength === 0) return firstLength;

  const grid: number[][] = Array.from({ length: firstLength + 1 }, () =>
    new Array<number>(secondLength + 1).fill(0)
  );

  for (let row = 0; row <= firstLength; row++) {
    grid[row]![0] = row;
  }
  for (let col = 0; col <= secondLength; col++) {
    grid[0]![col] = col;
  }

  for (let row = 1; row <= firstLength; row++) {
    for (let col = 1; col <= secondLength; col++) {
      const cost = firstWord[row - 1] === secondWord[col - 1] ? 0 : 1;
      grid[row]![col] = Math.min(
        grid[row - 1]![col]! + 1,
        grid[row]![col - 1]! + 1,
        grid[row - 1]![col - 1]! + cost
      );
    }
  }

  return grid[firstLength]![secondLength]!;
}

export function calculateSimilarity(firstWord: string, secondWord: string): number {
  const longerLength = Math.max(firstWord.length, secondWord.length);
  if (longerLength === 0) return 1;

  if (secondWord.startsWith(firstWord) || firstWord.startsWith(secondWord)) {
    const prefixLength = Math.min(firstWord.length, secondWord.length);
    return 0.5 + 0.5 * (prefixLength / longerLength);
  }

  const code1 = metaphone(firstWord);
  const code2 = metaphone(secondWord);
  if (code1.length > 0 && code1 === code2) return 0.9;

  const edits = countEditsRequired(firstWord, secondWord);
  return 1 - edits / longerLength;
}
