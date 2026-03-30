# Smart Product Search

Search 50 products across 6 categories with typo tolerance, relevance ranking, and a mega menu dropdown. No Algolia, no Elasticsearch. Just MongoDB text search and a custom similarity matcher.

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

This inserts 50 products into MongoDB and creates a weighted text index (name: 10, tags: 5, description: 1) plus a category index.

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

I use a two phase approach that runs in parallel:

1. **MongoDB text search** handles exact and stemmed matches ("running" finds "run"). Fast because it uses an index. Doesn't handle typos at all.

2. **Edit distance matching** compares each query word against every product's name, tags, and description. If two words are more than 60% similar, it counts as a match. This is what makes "samsng" find "Samsung" and "wirelss" find "wireless".

Both run at the same time via `Promise.all`, results get merged and deduplicated.

Why both? Text search alone can't handle typos. Edit distance alone means scanning every product on every request.

For 50 products this scan takes under a millisecond, so there's no reason to add complexity. But if the dataset grew to 50,000+, I'd add a **trigram index**. The idea is to pre compute 3 letter slices for each product (e.g. "samsung" becomes ["sam", "ams", "msu", "sun", "ung"]) and store them as an indexed array field in MongoDB. At search time, generate trigrams from the query, use `$in` to pull only the candidates that share trigrams, and then run edit distance on that small subset instead of the full collection. The code is already structured so that swapping `findAllProducts()` for a `findByTrigrams()` query is a one line change in the search service. I just didn't add it here because it would be over engineering for 50 records.

## Ranking

Every matched product gets a score from 0 to 1:

| Signal | Weight | Why |
|--------|--------|-----|
| Text match | 40% | Core relevance, how well the query matches this product |
| Name match | 30% | If someone types "airpods", the product named AirPods should win |
| Tag match | 15% | Tags are curated, so a tag hit is a strong signal |
| Rating | 10% | Higher rated products edge out lower rated ones |
| Stock | 5% | In stock gets 1.0, out of stock gets 0.2. Still shown, just demoted |

## Typo tolerance

Uses Levenshtein edit distance. It counts how many character changes turn one word into another.

```
similarity = 1 - (edits / longer word length)
```

Threshold is 0.6. Some examples:
- "samsng" to "samsung" = 1 edit, 0.86 similarity
- "wirelss" to "wireless" = 1 edit, 0.88 similarity
- "mernio" to "merino" = 2 edits, 0.67 similarity

All pass the 0.6 threshold.

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

## What I'd do differently with more time

- The edit distance scan works at 50 products but won't scale. I'd add trigram indexes or move to a proper search engine at scale.
- Edit distance is character based, so "fone" won't find "phone". Phonetic matching (Soundex/Metaphone) would help.
- Ranking weights are hand tuned. In a real product I'd use search analytics and click through data to calibrate them.
- Would add server side result caching and an autocomplete endpoint.

## Tech stack

**Frontend:** React 19, TypeScript, Tailwind v4, TanStack Query, Axios
**Backend:** Express, TypeScript, Mongoose
**Database:** MongoDB with text indexes
