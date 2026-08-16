# Sahaaya Chatbot Backend (RAG)

A standalone Node.js/Express service that powers the **Sahaaya support chatbot** — a
retrieval-augmented-generation (RAG) assistant that answers questions about the
platform (donations, NGO/rider/partner flows, food safety, compliance, etc.) using
**only the project's own knowledge base**.

It runs on **port 8001** and streams answers to the frontend over **Server-Sent
Events (SSE)**. It is fully decoupled from the main Sahaaya backend — the only link
is an optional health-check ping for "live platform context".

---

## Highlights

- **RAG, not a chatbot-with-opinions.** Answers are grounded in the local
  knowledge base; the LLM is told to refuse anything it can't find there.
- **Local & free by default.** Embeddings run locally via
  `@xenova/transformers` (`all-MiniLM-L6-v2`). The LLM defaults to **Ollama**
  (local, keyless) for dev and **Groq** (OpenAI-compatible, fast) for prod.
- **Pluggable vector store.** Three modes, chosen by env vars:
  - **Chroma Cloud** (managed — recommended for production; connect by URL+key
    like MongoDB Atlas, **no Docker**).
  - **Self-hosted Chroma** server (`CHROMA_URL`) — local dev / private deploys.
  - **JSON file** cache (`data/vectors.json`) — zero-setup, the local default.
- **Streaming + resilient.** SSE token streaming, automatic re-ingest when the
  knowledge base changes, and client-disconnect → LLM abort (no wasted tokens).
- **Provider-pluggable LLM + store** without touching call-site code.

---

## Architecture — how the backend is put together

```
            knowledge-base/*.txt  (the only source of truth)
                       │
                       ▼  loadKnowledgeBase()  (storeUtils.js)
                 heading-aware recursive chunks (~500 chars, 50 overlap)
                       │
                       ▼  generateEmbedding()  (embeddings.js)
            @xenova/transformers → 384-dim vectors (local, cached)
                       │
                       ▼  initializeStore()  (store.js → chromaStore | vectorStore)
            ┌────────────────────┴─────────────────────┐
            ▼                                          ▼
  Chroma (Cloud or self-hosted)            JSON file (data/vectors.json)
            └────────────────────┬─────────────────────┘
                                 │
   POST /chatbot/chat            ▼   query()  (store, with MMR rerank)
   ───────────────────►  top-K relevant chunks (recomputed cosine, 0–1 score)
                                 │
                                 ▼   generateAnswer()  (llm.js)
                 Groq (prod) / Ollama (dev)  →  streamed tokens
                                 │
                                 ▼   SSE  (event: meta | token | done | error)
                              browser
```

### How the pieces fit (the build-up)

The service is deliberately layered so each concern has one home:

1. **`src/index.js`** — entry point. Loads `.env`, ensures the `data/` dir exists,
   initializes the store (embeds + indexes the KB on first boot), checks LLM
   availability in the background, then starts Express on `PORT`.
2. **`src/config.js`** — single source of truth for all settings. Resolves the
   active **vector store** (`VECTOR_STORE`, or auto-detect from `CHROMA_URL` /
   `CHROMA_API_KEY`) and the active **LLM provider** (`LLM_PROVIDER`, or auto-detect
   from `GROQ_API_KEY`). Parses CORS origins, rate limits, paths.
3. **`src/app.js`** — Express app. `trust proxy` (correct client IP behind Render),
   CORS (restricted in prod via `CORS_ORIGIN`), JSON body limit, and a per-IP rate
   limiter on the paid streaming `/chatbot/chat` endpoint. Mounts `/chatbot`.
4. **`src/route/chatbot.route.js`** — two routes: `GET /chatbot` (health/stats) and
   `POST /chatbot/chat` (the chat handler).
5. **`src/controller/chatbot.controller.js`** — the orchestration brain:
   - **Conversation memory** — in-memory per `sessionId`, trimmed + TTL-cleaned.
   - **Disconnect handling** — an `AbortController` tied to `req.on("close")` so a
     closed tab aborts the streaming LLM call (saves Groq tokens).
   - **Retrieval → generation** — queries the store, fetches best-effort live
     platform context, then either streams an LLM answer or falls back to a
     formatted-chunks answer when no LLM is available.
6. **`src/service/store.js`** — store **factory**. Picks `chromaStore` or
   `vectorStore` from config and re-exports the same
   `{ initializeStore, query, getStoreStats }` surface, so the controller never
   knows which backend is active.
7. **`src/service/chromaStore.js`** — **Chroma** backend. Two connection modes
   (Cloud via `CloudClient`, or self-hosted via `ChromaClient`). Creates/ensures a
   single **cosine-space** collection, re-ingests when the `.txt` files change or
   the collection is empty, and re-derives 0–1 cosine scores + MMR-reranks for
   parity with the JSON store.
8. **`src/service/vectorStore.js`** — **JSON file** backend (zero-setup dev). Same
   retrieve/stats contract, persisted to `data/vectors.json`.
9. **`src/service/storeUtils.js`** — **shared** store-agnostic logic: file hashing
   (cache invalidation), recursive heading-aware chunking, cosine similarity, and
   MMR reranking. Both stores build on these so retrieval behaves identically.
10. **`src/service/embeddings.js`** — wraps `@xenova/transformers` `feature-extraction`
    pipeline (`all-MiniLM-L6-v2`, 384-dim, mean-pooled + normalized). Honors
    `TRANSFORMERS_CACHE` so the ~30 MB model can live on a persistent disk.
11. **`src/service/llm.js`** — LLM abstraction. Groq (OpenAI-compatible chat/SSE)
    for production, Ollama (`/api/generate`) for local dev. One `generateAnswer()`
    entry point, shared system prompt that **forces grounding in the KB**.
12. **`src/ingest.js`** — standalone CLI (`npm run ingest`) to force-rebuild the
    active store from the `.txt` files (prime a fresh Chroma without waiting for
    boot-time indexing).
13. **`src/knowledge-base/*.txt`** — the knowledge base itself
    (`faq`, `food-safety`, `compliance`, `hunger-waste`, `platform-features`).
    **Edit these to change what the bot knows.**

---

## Quick start (local)

### 1. Install
```bash
cd chatbot-backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
The defaults need **zero external services** to run:
- No `CHROMA_*` set → **JSON file** vector store (`data/vectors.json`).
- No `GROQ_API_KEY` set → LLM provider auto-resolves to **Ollama**.

So the two real choices are **vector store** and **LLM**. Pick one of each:

#### Vector store — pick one

| Mode | When to use | What to set |
|---|---|---|
| **JSON file** (default) | Local dev, zero setup | nothing |
| **Self-hosted Chroma** | Testing the Chroma code path locally | `CHROMA_URL=http://localhost:8000` |
| **Chroma Cloud** (managed) | Production — like MongoDB Atlas, no Docker | `CHROMA_API_KEY`, `CHROMA_TENANT`, `CHROMA_DATABASE` |

To run a local Chroma server for testing:
```bash
docker run -d --name sahaaya-chroma -p 8000:8000 \
  -e IS_PERSISTENT=TRUE chromadb/chroma:1.5.9
# then in .env:  CHROMA_URL=http://localhost:8000
```

#### LLM — pick one

| Mode | When to use | What to set |
|---|---|---|
| **Ollama** (default) | Local dev, keyless | `ollama pull mistral && ollama serve` |
| **Groq** (recommended prod) | Fast, cheap, OpenAI-compatible | `GROQ_API_KEY=gsk_...` |

> If no LLM is reachable, the bot still works — it falls back to returning the raw
> retrieved chunks (retrieval-only mode). Check the boot log for
> `✅ available` / `❌ NOT available`.

### 3. Run
```bash
npm run dev        # http://localhost:8001  (same as `npm start`)
```
Health check:
```bash
curl http://localhost:8001/chatbot
# → { success, llm_available, llm_provider, vector_store, index:{chunkCount,...}, ... }
```

(Re-)build the index from the `.txt` files on demand:
```bash
npm run ingest
```

---

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8001` | HTTP port |
| `VECTOR_STORE` | auto | `chroma` \| `json` (auto: chroma if `CHROMA_URL` or `CHROMA_API_KEY` set) |
| `CHROMA_API_KEY` | — | **Chroma Cloud** API key (managed; takes precedence over `CHROMA_URL`) |
| `CHROMA_TENANT` | — | Chroma Cloud tenant (required with the API key) |
| `CHROMA_DATABASE` | — | Chroma Cloud database (required with the API key) |
| `CHROMA_URL` | — | Self-hosted Chroma server URL, e.g. `http://localhost:8000` |
| `CHROMA_AUTH_TOKEN` | — | Optional bearer token for a self-hosted server with auth |
| `CHROMA_COLLECTION` | `sahaaya_kb` | Collection name (shared by both Chroma modes) |
| `TRANSFORMERS_CACHE` | — | Persistent path for the embedding model (~30 MB) — point at a disk in prod |
| `LLM_PROVIDER` | auto | `groq` \| `ollama` (auto: groq if `GROQ_API_KEY` set) |
| `LLM_ENABLED` | `true` | Set `false` to force retrieval-only mode |
| `GROQ_API_KEY` | — | Groq API key (console.groq.com) |
| `GROQ_BASE_URL` | `https://api.groq.com/openai/v1` | OpenAI-compatible base |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Groq model id |
| `GROQ_MAX_TOKENS` | `1024` | Max generated tokens |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server |
| `LLM_MODEL` | `mistral` | Ollama model name |
| `MAIN_BACKEND_URL` | `http://localhost:8000` | Main backend health URL (live context) |
| `CORS_ORIGIN` | `*` (dev) | Comma-separated allowed origins (set in prod) |
| `CHAT_RATE_LIMIT` | `30` | Chat requests/min/IP |

---

## API

### `GET /chatbot` — health & stats
```json
{
  "success": true,
  "message": "Chatbot backend is running",
  "llm_available": true,
  "llm_provider": "groq",
  "vector_store": "chroma",
  "index": { "ready": true, "chunkCount": 131, "fileCount": 5, "vectorDim": 384 },
  "sessions_active": 2
}
```

### `POST /chatbot/chat` — ask a question
Request:
```json
{ "question": "How do I donate food?", "sessionId": "optional-uuid" }
```
- If the client sends `Accept: text/event-stream` → **SSE** reply:
  `event: meta` (sources) → many `event: token` → `event: done`.
- Otherwise → a single **JSON** `{ success, answer, sources, llm_used, session_id }`.

Streaming test:
```bash
curl -N -X POST http://localhost:8001/chatbot/chat \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"question":"How do I donate food?"}'
```

---

## Editing what the bot knows

The knowledge base is just `.txt` files in `src/knowledge-base/`. Add/edit a file,
then either restart (boot auto-detects the change via file-hash comparison and
re-indexes) or run `npm run ingest`. Markdown-ish headings (`#`, `##`) are stripped
before chunking; paragraphs under ~500 chars are kept whole, larger ones are split
with sentence/line-aware overlap.

---

## Production deployment

This service deploys on **Render** (Web Service, Node runtime, root `chatbot-backend/`).
For production set:

```
VECTOR_STORE=chroma
CHROMA_API_KEY=...           # Chroma Cloud (managed — like MongoDB Atlas)
CHROMA_TENANT=...
CHROMA_DATABASE=...
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_...
CORS_ORIGIN=https://your-frontend.netlify.app
TRANSFORMERS_CACHE=/opt/render/.cache/transformers   # persistent disk
```

- **Chroma Cloud** means **no Docker, no second service** — connect by URL+key,
  exactly like MongoDB Atlas. (Get the key/tenant/database from
  [trychroma.com](https://trychroma.com).)
- Mount a **persistent disk** at `/opt/render/.cache` and set
  `TRANSFORMERS_CACHE` to it, or the embedding model re-downloads on every cold
  boot (slow starts).
- The boot re-ingests the KB into Chroma automatically whenever the collection is
  empty or the `.txt` files changed — so ephemeral filesystems are safe.

Full multi-service deployment (frontend on Netlify, backend + this service on
Render, Chroma Cloud, MongoDB Atlas, Groq) is documented in
[`docs/deploy.md`](../docs/deploy.md).

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Answers are retrieval-only (`llm_used: false`) | LLM not available. Boot log shows `❌ NOT available`. Groq: set/fix `GROQ_API_KEY`. Ollama: `ollama serve` + `ollama pull mistral`. |
| `Could not reach Chroma Cloud (tenant=…, db=…)` | Wrong/missing `CHROMA_API_KEY`/`TENANT`/`DATABASE`, or Chroma Cloud down. Verify the key in the dashboard. |
| `chunkCount: 0` in health | Index empty. Run `npm run ingest`, or just restart (boot re-indexes when empty/changed). |
| Slow cold start (minutes) | Embedding model re-downloading — set `TRANSFORMERS_CACHE` to a persistent disk. |
| `Groq error 429` | Groq rate limit (free tier TPM/RPM). Surfaced as an SSE `error` event. Raise tier or add backoff. |
| `Groq error 404` | Model id changed — set `GROQ_MODEL` to a current one (console.groq.com/docs/models). |
| SSE blocked / CORS from frontend | Set `CORS_ORIGIN` to the frontend origin(s). |
| `ChromaQuotaExceededError: ... MetadataValueSizeBytes ... 256` | Chroma Cloud caps a single collection-metadata **value** at 256 bytes. The store already stores a 32-byte aggregate KB hash (not the full per-file dict) to stay under this — only a problem if you add large custom metadata. |
| `Cannot instantiate a collection with the DefaultEmbeddingFunction` | chromadb v3 wants an EF at collection creation. The store supplies one (our Xenova model); you should never see this. If you do, a dependency changed — check `chromadb` version. |
| Chroma client/server mismatch | For self-hosted: pin server `chromadb/chroma:1.5.9` + `chromadb` npm v3.x client. (Not applicable to Chroma Cloud.) |

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the server (`node src/index.js`) |
| `npm start` | Same (production entry) |
| `npm run ingest` | Force-rebuild the active vector store from `knowledge-base/*.txt` |
