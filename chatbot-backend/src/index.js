import "dotenv/config";
import app from "./app.js";
import { initializeStore } from "./service/store.js";
import { checkLlmAvailability } from "./service/llm.js";
import config from "./config.js";
import fs from "fs";

const start = async () => {
  fs.mkdirSync(config.dataDir, { recursive: true });

  console.log("[chatbot] Initializing knowledge base...");
  const startTime = Date.now();
  await initializeStore();
  console.log(`[chatbot] Knowledge base ready in ${Date.now() - startTime}ms`);

  checkLlmAvailability().then((available) => {
    if (config.llmProvider === "groq") {
      console.log(
        `[chatbot] LLM (Groq: ${config.groqModel}) ${
          available
            ? "available"
            : "NOT available — set GROQ_API_KEY for AI-powered answers (falling back to retrieval-only mode)"
        }`,
      );
    } else {
      console.log(
        `[chatbot] LLM (Ollama: ${config.ollamaModel}) ${
          available
            ? "available"
            : "NOT available — using retrieval-only mode (install Ollama and run: ollama pull " +
              config.ollamaModel +
              ")"
        }`,
      );
    }
  });

  app.listen(config.port, () => {
    console.log(`[chatbot] Server running on http://localhost:${config.port}`);
    console.log(
      `[chatbot] Chat endpoint: POST http://localhost:${config.port}/chatbot/chat`,
    );
  });
};

start();
