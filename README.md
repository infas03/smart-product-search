# Smart Product Search

Search products across 6 categories with typo tolerance, prefix matching, phonetic matching, relevance ranking, and a mega menu dropdown. Built to handle 100K+ products. No Algolia, no Elasticsearch. Just MongoDB, trigram indexing, and a custom similarity engine.

**Query speed at 100K products:** ~30-80ms (cold) | <1ms (cached)

## Setup

You need Node 18+ and MongoDB running locally.

```bash
# server
cd server
npm install
cp .env.example .env

# client
cd ../client
npm install
```

## Seed the database

```bash
cd server
npm run seed
```

This inserts products into MongoDB and creates three indexes:
- **Text index** with weights: name(10), tags(5), description(1)
- **Category index** for grouping
- **Trigram index** for fuzzy candidate retrieval

## Run it

```bash
# terminal 1
cd server
npm run dev    # runs on port 8085

# terminal 2
cd client
npm run dev    # runs on port 5173
```

Go to http://localhost:5173

## How search works

The search runs two parallel paths via `Promise.all`:

**Path 1 — MongoDB text search** handles exact and stemmed matches ("running" finds "run"). Uses the weighted text index. Capped at 50 results. Doesn't handle typos.

**Path 2 — Trigram + fuzzy matching** handles typos, partial words, and phonetic misspellings. Works in three stages:

1. **Trigram candidate retrieval** — Each product stores pre-computed 3-letter slices of its name and tags (e.g. "samsung" → ["sam", "ams", "msu", "sun", "ung"]). At search time, the query is also split into trigrams and MongoDB uses `$in` on the indexed trigram field to pull only products that share slices with the query. This narrows 100K products down to ~200 candidates.

2. **Similarity scoring** — Each candidate is compared word-by-word against the query using three strategies in order:
   - **Prefix matching** — If the search word is the start of a product word (e.g. "sams" → "samsung"), it gets a boosted score: `0.5 + 0.5 * (prefix length / word length)`.
   - **Phonetic matching (Metaphone)** — Both words are converted to phonetic codes. If they sound the same (e.g. "fone" → FN, "phone" → FN), it scores 0.9.
   - **Levenshtein edit distance** — Counts character edits needed to transform one word into another. Score: `1 - (edits / longer word length)`.

3. **Threshold filter** — Any product where at least one word pair scores 0.6 or higher passes through.

Results from both paths are merged, deduplicated, scored, and sorted.

## Performance

The trigram index is what makes this scale. Instead of loading every product into memory and running edit distance on all of them, the database does the heavy lifting — returning only relevant candidates.

**At 100K products:**

| Metric | Without trigrams | With trigrams |
|--------|-----------------|---------------|
| Products loaded into memory | 100,000 | ~200 |
| Levenshtein comparisons per query | ~3,000,000 | ~6,000 |
| Cold query response time | 5–15 seconds | 30–80ms |
| Cached query response time | N/A | <1ms |

**Server-side caching** — An in-memory LRU cache stores results for 60 seconds. The cache key is the normalized query, so "Samsung", "samsung", and " SAMSUNG " all share the same entry. Max 500 entries (~2.5MB). Repeat queries skip the database entirely.

## Ranking

Every matched product gets a score from 0 to 1:

| Signal | Weight | Why |
|--------|--------|-----|
| Text match | 40% | Core relevance, how well the query matches this product |
| Name match | 30% | If someone types "airpods", the product named AirPods should win |
| Tag match | 15% | Tags are curated, so a tag hit is a strong signal |
| Rating | 10% | Higher rated products edge out lower rated ones |
| Stock | 5% | In stock gets 1.0, out of stock gets 0.2. Still shown, just demoted |

## Typo tolerance, prefix matching, and phonetic matching

The similarity engine uses three strategies. Each query word is checked in this order — the first match wins:

**1. Prefix matching** — "sams" is the start of "samsung", so instead of penalizing 3 missing letters, it gets a boosted score.
- "sams" → "samsung" = 0.786
- "head" → "headphones" = 0.70
- "wire" → "wireless" = 0.75

**2. Phonetic matching (Metaphone)** — Words are converted to sound codes. Same code = same pronunciation = 0.9 score.
- "fone" → FN, "phone" → FN = match
- "foto" → FT, "photo" → FT = match
- "blutooth" → BLT0, "bluetooth" → BLT0 = match

**3. Levenshtein edit distance** — Counts how many character insertions, deletions, or replacements are needed.
- "samsng" → "samsung" = 1 edit, 0.86 similarity
- "wireles" → "wireless" = 1 edit, 0.88 similarity
- "cofee" → "coffee" = 1 edit, 0.83 similarity

Threshold is 0.6. Anything below is filtered out.

## Auto trigram generation

Trigrams are generated automatically via a Mongoose `pre('save')` hook. When a product is created or its name/tags are updated, trigrams are recomputed before saving. No manual step needed.

For bulk inserts (`insertMany`), the seed script computes trigrams explicitly since Mongoose hooks don't fire on bulk operations. Both paths use the same `generateProductTrigrams()` function.

## Test cases

1. **"wireless"** → Finds Sony WH-1000XM5, Bose QC45, AirPods Pro. Exact word match, nothing missing.
2. **"samsng"** → Finds Samsung 27" 4K Monitor. Missing "u", still works.
3. **"sams"** → Finds Samsung 27" 4K Monitor. Missing "ung", still works (prefix match).
4. **"fone"** → Finds phone products. Spelled with "f" instead of "ph", still works (sounds the same).
5. **"foto"** → Finds photo products. Spelled with "f" instead of "ph", still works (sounds the same).
6. **"wireles"** → Finds wireless products. Missing "s", still works.
7. **"cofee"** → Finds Coffee Set, French Press, Cold Brew Maker. Missing "f", still works.
8. **"yoga mat"** → Finds Yoga Mat Premium Non-Slip. Nothing missing, exact match.
9. **"runing shoes"** → Finds Trail Running Shoes (Men & Women). Missing "n" in running, still works.
10. **"hiking jackt"** → Finds Waterproof Hiking Jacket. "jacket" spelled as "jackt", missing "e", still works.

## Mega menu API shape

The server returns data already grouped so the frontend just renders it:

```json
{
  "query": "wireless",
  "topResults": [ "... top 4 across all categories" ],
  "categoryGroups": [
    { "category": "Electronics", "products": [ "..." ] }
  ],
  "totalResults": 12
}
```

Top 4 go on the left. Category groups go on the right. Max 4 per category. Categories without matches are excluded.

## Tech stack

**Frontend:** React 19, TypeScript, Tailwind v4, TanStack Query, Axios
**Backend:** Express, TypeScript, Mongoose
**Database:** MongoDB with text, category, and trigram indexes
