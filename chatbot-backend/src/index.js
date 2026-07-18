import "dotenv/config";
import app from "./app.js";
import { initializeStore } from "./service/vectorStore.js";
import { checkLlmAvailability } from "./service/llm.js";
import config from "./config.js";
import fs from "fs";

const start = async () => {
  // Ensure data directory exists
  fs.mkdirSync(config.dataDir, { recursive: true });

  console.log("[chatbot] Initializing knowledge base...");
  const startTime = Date.now();
  await initializeStore();
  console.log(`[chatbot] Knowledge base ready in ${Date.now() - startTime}ms`);

  // Check LLM availability in background
  checkLlmAvailability().then((available) => {
    console.log(
      `[chatbot] LLM (${config.llmModel}) ${available ? "✅ available" : "❌ NOT available — using retrieval-only mode"}` +
        (available ? "" : ` — install Ollama (ollama pull ${config.llmModel}) for AI-powered answers`)
    );
  });

  app.listen(config.port, () => {
    console.log(`[chatbot] Server running on http://localhost:${config.port}`);
    console.log(`[chatbot] Chat endpoint: POST http://localhost:${config.port}/chatbot/chat`);
  });
};

start();
