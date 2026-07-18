import fs from "fs";
import path from "path";
import crypto from "crypto";
import { generateEmbedding } from "./embeddings.js";
import config from "../config.js";

const VECTORS_FILE = path.join(config.dataDir, "vectors.json");
const VERSION = 2;

// ─── File hashing ───────────────────────────────────────────
const computeFileHashes = () => {
  const files = fs
    .readdirSync(config.kbDir)
    .filter((f) => f.endsWith(".txt"))
    .sort();
  const hashes = {};
  for (const file of files) {
    const content = fs.readFileSync(path.join(config.kbDir, file), "utf-8");
    hashes[file] = crypto.createHash("md5").update(content).digest("hex");
  }
  return hashes;
};

const hashesEqual = (a, b) => {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => a[k] === b[k]);
};

// ─── Recursive chunking (heading-aware) ─────────────────────
const extractHeadings = (text, baseHeading = "") => {
  const lines = text.split("\n");
  const content = [];
  let currentHeading = baseHeading;

  for (const line of lines) {
    const hMatch = line.match(/^##\s+(.+)/);
    if (hMatch) {
      currentHeading = hMatch[1].trim();
    } else {
      content.push({ text: line, heading: currentHeading });
    }
  }

  return content;
};

const splitRecursive = (text, heading = "", targetSize = 500, overlap = 50) => {
  const clean = text.replace(/^#.*$/gm, "").trim();
  if (!clean || clean.length < 20) return [];

  const chunks = [];

  // 1. Try splitting on double newlines (paragraphs)
  const paragraphs = clean.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  for (const para of paragraphs) {
    if (para.length <= targetSize) {
      chunks.push(para.trim());
      continue;
    }

    // 2. Paragraph too big -> split on single newlines
    const lines = para.split("\n").filter((l) => l.trim().length > 0);
    let buffer = [];

    for (const line of lines) {
      const combined = [...buffer, line.trim()].join(" ").trim();
      if (combined.length > targetSize && buffer.length > 0) {
        chunks.push(buffer.join(" ").trim());
        // Keep overlap sentences
        const overlapText = [];
        let overlapLen = 0;
        for (let i = buffer.length - 1; i >= 0; i--) {
          overlapText.unshift(buffer[i]);
          overlapLen += buffer[i].length;
          if (overlapLen >= overlap) break;
        }
        buffer = overlapText;
      }
      buffer.push(line.trim());
    }

    if (buffer.length > 0) {
      chunks.push(buffer.join(" ").trim());
    }
  }

  // 3. If any chunk is still too big, split on sentences
  const finalChunks = [];
  for (const chunk of chunks) {
    if (chunk.length <= targetSize + 100) {
      finalChunks.push(chunk);
      continue;
    }
    // Sentence-split oversized chunks
    const sentences = chunk.match(/[^.!?\n]+[.!?\n]*/g) || [chunk];
    let sentBuffer = [];
    let sentLen = 0;
    for (const s of sentences) {
      if (sentLen + s.length > targetSize && sentBuffer.length > 0) {
        finalChunks.push(sentBuffer.join(" ").trim());
        // overlap
        const overlapSents = [];
        let oLen = 0;
        for (let i = sentBuffer.length - 1; i >= 0; i--) {
          overlapSents.unshift(sentBuffer[i]);
          oLen += sentBuffer[i].length;
          if (oLen >= overlap) break;
        }
        sentBuffer = overlapSents;
        sentLen = oLen;
      }
      sentBuffer.push(s.trim());
      sentLen += s.length;
    }
    if (sentBuffer.length > 0) {
      finalChunks.push(sentBuffer.join(" ").trim());
    }
  }

  // Final cleanup: merge very small chunks with their neighbor
  const merged = [];
  for (let i = 0; i < finalChunks.length; i++) {
    if (finalChunks[i].length < 80 && i > 0) {
      merged[merged.length - 1] += " " + finalChunks[i];
    } else {
      merged.push(finalChunks[i]);
    }
  }

  return merged.filter((c) => c.length >= 20);
};

const loadKnowledgeBase = () => {
  const files = fs
    .readdirSync(config.kbDir)
    .filter((f) => f.endsWith(".txt"))
    .sort();
  const allChunks = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(config.kbDir, file), "utf-8");
    const clean = content.replace(/^#.*$/gm, "").trim();
    const fileChunks = splitRecursive(clean);

    for (const chunkText of fileChunks) {
      // Extract heading from chunk (first line that looks like a topic)
      let heading = "";
      for (const line of chunkText.split("\n")) {
        const hMatch = line.match(/^(.+?)(?::| -| –)/);
        if (hMatch && line.length < 80) {
          heading = hMatch[1].trim();
          break;
        }
      }

      allChunks.push({
        text: chunkText,
        source: file,
        heading,
      });
    }
  }

  return allChunks;
};

// ─── MMR reranking ──────────────────────────────────────────
const cosineSimilarity = (a, b) => {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const mmrRerank = (queryVec, candidates, lambda, topK) => {
  // candidates: [{index, score, vector}]
  const selected = [];
  const remaining = [...candidates];

  for (let k = 0; k < Math.min(topK, remaining.length); k++) {
    let bestIdx = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const relevance = remaining[i].score;
      let diversityPenalty = 0;
      if (selected.length > 0) {
        let maxSim = -Infinity;
        for (const sel of selected) {
          const sim = cosineSimilarity(remaining[i].vector, sel.vector);
          if (sim > maxSim) maxSim = sim;
        }
        diversityPenalty = maxSim;
      }
      const mmrScore = lambda * relevance - (1 - lambda) * diversityPenalty;
      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestIdx = i;
      }
    }

    if (bestIdx >= 0) {
      selected.push(remaining[bestIdx]);
      remaining.splice(bestIdx, 1);
    }
  }

  return selected;
};

// ─── Store persistence ──────────────────────────────────────
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

  // Try loading from disk
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
          `[vectorStore] Loaded ${saved.chunks.length} chunks from cache (${Object.keys(fileHashes).length} files)`
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

    // Persist to disk
    try {
      fs.writeFileSync(
        VECTORS_FILE,
        JSON.stringify({
          version: VERSION,
          fileHashes,
          chunks,
          vectors,
        })
      );
      console.log(`[vectorStore] Saved ${chunks.length} vectors to cache`);
    } catch (err) {
      console.error("[vectorStore] Failed to save cache:", err.message);
    }
  }

  return store;
};

// ─── Query ──────────────────────────────────────────────────
const query = async (question, topK = null) => {
  if (!store) await initializeStore();
  if (!store.chunks.length) return [];

  const k = topK || config.topK;
  const questionEmbedding = await generateEmbedding(question);

  // Score all chunks
  const scored = store.vectors.map((vec, i) => ({
    index: i,
    score: cosineSimilarity(questionEmbedding, vec),
    vector: vec,
  }));
  scored.sort((a, b) => b.score - a.score);

  // MMR rerank top-20 down to topK
  const candidates = scored.slice(0, Math.min(20, scored.length));
  const reranked = mmrRerank(questionEmbedding, candidates, config.mmrLambda, k);

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
