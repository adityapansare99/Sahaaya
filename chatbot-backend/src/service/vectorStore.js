import fs from "fs";
import path from "path";
import { generateEmbedding } from "./embeddings.js";
import config from "../config.js";
import {
  VERSION,
  computeFileHashes,
  hashesEqual,
  loadKnowledgeBase,
  cosineSimilarity,
  mmrRerank,
} from "./storeUtils.js";

const VECTORS_FILE = path.join(config.dataDir, "vectors.json");

let store = null;

const initializeStore = async () => {
  if (store) return store;

  fs.mkdirSync(config.dataDir, { recursive: true });

  const fileHashes = computeFileHashes();
  const hashCount = Object.keys(fileHashes).length;
  if (hashCount === 0) {
    console.warn("[vectorStore] No .txt knowledge base files found!");
    store = { chunks: [], vectors: [] };
    return store;
  }

  let loaded = false;
  if (fs.existsSync(VECTORS_FILE)) {
    try {
      const saved = JSON.parse(fs.readFileSync(VECTORS_FILE, "utf-8"));
      if (
        saved.version === VERSION &&
        hashesEqual(saved.fileHashes || {}, fileHashes)
      ) {
        store = { chunks: saved.chunks, vectors: saved.vectors };
        console.log(
          `[vectorStore] Loaded ${saved.chunks.length} chunks from cache (${Object.keys(fileHashes).length} files)`,
        );
        loaded = true;
      } else {
        console.log("[vectorStore] Knowledge base changed, re-indexing...");
      }
    } catch (err) {
      console.log("[vectorStore] Cache corrupted, re-indexing...");
    }
  }

  if (!loaded) {
    console.log("[vectorStore] Indexing knowledge base...");
    const chunks = loadKnowledgeBase();
    console.log(`[vectorStore] Generating ${chunks.length} embeddings...`);

    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
      const emb = await generateEmbedding(chunks[i].text);
      vectors.push(emb);
      if ((i + 1) % 10 === 0 || i === chunks.length - 1) {
        console.log(`[vectorStore] ${i + 1}/${chunks.length} embedded`);
      }
    }

    store = { chunks, vectors };

    try {
      fs.writeFileSync(
        VECTORS_FILE,
        JSON.stringify({
          version: VERSION,
          fileHashes,
          chunks,
          vectors,
        }),
      );
      console.log(`[vectorStore] Saved ${chunks.length} vectors to cache`);
    } catch (err) {
      console.error("[vectorStore] Failed to save cache:", err.message);
    }
  }

  return store;
};

const query = async (question, topK = null) => {
  if (!store) await initializeStore();
  if (!store.chunks.length) return [];

  const k = topK || config.topK;
  const questionEmbedding = await generateEmbedding(question);

  const scored = store.vectors.map((vec, i) => ({
    index: i,
    score: cosineSimilarity(questionEmbedding, vec),
    vector: vec,
  }));
  scored.sort((a, b) => b.score - a.score);

  const candidates = scored.slice(0, Math.min(20, scored.length));
  const reranked = mmrRerank(
    questionEmbedding,
    candidates,
    config.mmrLambda,
    k,
  );

  return reranked.map((s) => ({
    text: store.chunks[s.index].text,
    source: store.chunks[s.index].source,
    heading: store.chunks[s.index].heading,
    score: Math.round(s.score * 1000) / 1000,
  }));
};

const getStoreStats = () => {
  if (!store) return { ready: false };
  return {
    ready: true,
    chunkCount: store.chunks.length,
    fileCount: new Set(store.chunks.map((c) => c.source)).size,
    vectorDim: store.vectors.length > 0 ? store.vectors[0].length : 0,
  };
};

export { initializeStore, query, getStoreStats };
