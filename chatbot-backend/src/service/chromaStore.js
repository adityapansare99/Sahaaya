import { ChromaClient, CloudClient } from "chromadb";
import { generateEmbedding } from "./embeddings.js";
import config from "../config.js";
import {
  VERSION,
  computeFileHashes,
  aggregateHash,
  loadKnowledgeBase,
  cosineSimilarity,
  mmrRerank,
} from "./storeUtils.js";

// Cosine must be set via `configuration`; the legacy metadata form is silently ignored on some versions.
const COLLECTION_CONFIG = { hnsw: { space: "cosine" } };

// Required by chromadb v3 at collection creation; we always pass explicit embeddings.
const xenovaEmbeddingFunction = {
  name: "xenova-all-minilm-l6-v2",
  generate: async (texts) =>
    Promise.all(texts.map((t) => generateEmbedding(t))),
};

let client = null;
let collection = null;
const stats = { ready: false };

const buildClient = () => {
  if (config.chromaApiKey) {
    if (!config.chromaTenant || !config.chromaDatabase) {
      throw new Error(
        "Chroma Cloud requires CHROMA_TENANT and CHROMA_DATABASE alongside CHROMA_API_KEY",
      );
    }
    return new CloudClient({
      apiKey: config.chromaApiKey,
      tenant: config.chromaTenant,
      database: config.chromaDatabase,
    });
  }

  let parsed;
  try {
    parsed = new URL(config.chromaUrl);
  } catch {
    throw new Error(`Invalid CHROMA_URL: ${config.chromaUrl}`);
  }

  const args = {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 8000,
    ssl: parsed.protocol === "https:",
  };
  if (config.chromaAuthToken) {
    args.headers = { Authorization: `Bearer ${config.chromaAuthToken}` };
  }
  return new ChromaClient(args);
};

const getClient = () => {
  if (!client) client = buildClient();
  return client;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const resolveCollection = async () => {
  const c = getClient();
  let lastErr;
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      return await c.getOrCreateCollection({
        name: config.chromaCollection,
        configuration: COLLECTION_CONFIG,
        embeddingFunction: xenovaEmbeddingFunction,
      });
    } catch (err) {
      lastErr = err;
      console.warn(
        `[chromaStore] connect attempt ${attempt}/6 failed: ${err.message}`,
      );
      if (attempt < 6) await sleep(5000 * attempt);
    }
  }
  const target = config.chromaApiKey
    ? `Chroma Cloud (tenant=${config.chromaTenant}, db=${config.chromaDatabase})`
    : `Chroma at ${config.chromaUrl}`;
  throw new Error(`Could not reach ${target}: ${lastErr?.message}`);
};

const initializeStore = async ({ force = false } = {}) => {
  const fileHashes = computeFileHashes();
  const hashCount = Object.keys(fileHashes).length;
  if (hashCount === 0) {
    console.warn("[chromaStore] No .txt knowledge base files found!");
    stats.ready = true;
    stats.chunkCount = 0;
    stats.fileCount = 0;
    stats.vectorDim = 0;
    return stats;
  }

  collection = await resolveCollection();

  let needReingest = force;
  let currentCount = 0;
  try {
    currentCount = await collection.count();
  } catch {
    needReingest = true;
  }

  if (!needReingest) {
    const meta = collection.metadata || {};
    const storedVersion = meta.kbVersion;
    const storedHash = meta.kbHash || "";

    if (currentCount === 0) needReingest = true;
    else if (storedVersion !== VERSION) needReingest = true;
    else if (storedHash !== aggregateHash(fileHashes)) needReingest = true;
  }

  if (needReingest) {
    console.log(
      `[chromaStore] Indexing knowledge base into "${config.chromaCollection}" (count=${currentCount})...`,
    );
    const chunks = loadKnowledgeBase();

    try {
      await getClient().deleteCollection({ name: config.chromaCollection });
    } catch {
      // collection may not exist yet
    }
    collection = await getClient().getOrCreateCollection({
      name: config.chromaCollection,
      configuration: COLLECTION_CONFIG,
      embeddingFunction: xenovaEmbeddingFunction,
      metadata: {
        kbVersion: VERSION,
        kbHash: aggregateHash(fileHashes),
      },
    });

    const ids = [];
    const embeddings = [];
    const documents = [];
    const metadatas = [];

    for (let i = 0; i < chunks.length; i++) {
      const emb = await generateEmbedding(chunks[i].text);
      ids.push(`${chunks[i].source}#${i}`);
      embeddings.push(emb);
      documents.push(chunks[i].text);
      metadatas.push({
        source: chunks[i].source,
        heading: chunks[i].heading || "",
        chunkIndex: i,
      });
      if ((i + 1) % 10 === 0 || i === chunks.length - 1) {
        console.log(`[chromaStore] ${i + 1}/${chunks.length} embedded`);
      }
    }

    await collection.add({ ids, embeddings, documents, metadatas });
    currentCount = chunks.length;
    console.log(`[chromaStore] Ingested ${chunks.length} chunks`);
  } else {
    console.log(
      `[chromaStore] Collection "${config.chromaCollection}" up to date (${currentCount} chunks)`,
    );
  }

  stats.ready = true;
  stats.chunkCount = currentCount;
  stats.fileCount = hashCount;
  stats.vectorDim = 384;
  return stats;
};

const query = async (question, topK = null) => {
  if (!collection) await initializeStore();
  if (!collection || stats.chunkCount === 0) return [];

  const k = topK || config.topK;
  const questionEmbedding = await generateEmbedding(question);

  const res = await collection.query({
    queryEmbeddings: [questionEmbedding],
    nResults: Math.min(20, stats.chunkCount || 20),
    include: ["documents", "metadatas", "distances", "embeddings"],
  });

  const docs = res.documents?.[0] || [];
  const metas = res.metadatas?.[0] || [];
  const embs = res.embeddings?.[0] || [];
  if (docs.length === 0) return [];

  const candidates = docs.map((_, j) => ({
    index: j,
    score: cosineSimilarity(questionEmbedding, embs[j] || []),
    vector: embs[j] || [],
  }));

  const reranked = mmrRerank(
    questionEmbedding,
    candidates,
    config.mmrLambda,
    k,
  );

  return reranked.map((s) => ({
    text: docs[s.index],
    source: metas[s.index]?.source || "unknown",
    heading: metas[s.index]?.heading || "",
    score: Math.round(s.score * 1000) / 1000,
  }));
};

const getStoreStats = () => ({ ...stats });

export { initializeStore, query, getStoreStats };
