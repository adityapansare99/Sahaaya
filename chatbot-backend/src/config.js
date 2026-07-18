import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env before anything else reads process.env
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

export default {
  // Server
  port: process.env.PORT || 8001,

  // Knowledge base
  kbDir: path.resolve(__dirname, "knowledge-base"),
  dataDir: path.resolve(__dirname, "..", "data"),

  // Chunking
  chunkSize: 500,
  chunkOverlap: 50,

  // Retrieval
  topK: 5,
  mmrLambda: 0.6, // 0 = pure diversity, 1 = pure relevance

  // LLM
  llmEnabled: process.env.LLM_ENABLED !== "false",
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  llmModel: process.env.LLM_MODEL || "mistral",

  // Conversation
  maxHistory: 10,
  sessionTtlMs: 30 * 60 * 1000, // 30 min

  // Dynamic context
  mainBackendUrl: process.env.MAIN_BACKEND_URL || "http://localhost:8000",
};
