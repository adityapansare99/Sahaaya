import { pipeline, env } from "@xenova/transformers";

if (process.env.TRANSFORMERS_CACHE) {
  env.cacheDir = process.env.TRANSFORMERS_CACHE;
}

let embedder = null;

const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
};

const generateEmbedding = async (text) => {
  const model = await getEmbedder();
  const result = await model(text, { pooling: "mean", normalize: true });
  return Array.from(result.data);
};

export { generateEmbedding };
