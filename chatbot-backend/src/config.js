import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Must load .env before process.env is read below.
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const parseList = (value) =>
  (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const resolveVectorStore = () => {
  const explicit = (process.env.VECTOR_STORE || "").trim().toLowerCase();
  if (explicit === "chroma" || explicit === "json") return explicit;
  return process.env.CHROMA_URL || process.env.CHROMA_API_KEY ? "chroma" : "json";
};

const resolveLlmProvider = () => {
  const explicit = (process.env.LLM_PROVIDER || "").trim().toLowerCase();
  if (explicit === "groq" || explicit === "ollama") return explicit;
  return process.env.GROQ_API_KEY ? "groq" : "ollama";
};

const llmProvider = resolveLlmProvider();

export default {
  port: process.env.PORT || 8001,
  kbDir: path.resolve(__dirname, "knowledge-base"),
  dataDir: path.resolve(__dirname, "..", "data"),
  chunkSize: 500,
  chunkOverlap: 50,
  topK: 5,
  mmrLambda: 0.6,
  vectorStore: resolveVectorStore(),
  chromaUrl: process.env.CHROMA_URL || "",
  chromaCollection: process.env.CHROMA_COLLECTION || "sahaaya_kb",
  chromaAuthToken: process.env.CHROMA_AUTH_TOKEN || "",
  chromaApiKey: process.env.CHROMA_API_KEY || "",
  chromaTenant: process.env.CHROMA_TENANT || "",
  chromaDatabase: process.env.CHROMA_DATABASE || "",
  llmEnabled: process.env.LLM_ENABLED !== "false",
  llmProvider,
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqBaseUrl:
    process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  groqMaxTokens: Number(process.env.GROQ_MAX_TOKENS || 1024),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  ollamaModel: process.env.LLM_MODEL || "mistral",
  llmModel:
    llmProvider === "groq"
      ? process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
      : process.env.LLM_MODEL || "mistral",
  maxHistory: 10,
  sessionTtlMs: 30 * 60 * 1000,
  mainBackendUrl: process.env.MAIN_BACKEND_URL || "http://localhost:8000",
  corsOrigin: parseList(process.env.CORS_ORIGIN),
  chatRateLimitPerMinute: Number(process.env.CHAT_RATE_LIMIT || 30),
};
