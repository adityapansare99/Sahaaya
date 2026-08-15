import { initializeStore, getStoreStats } from "./service/store.js";
import config from "./config.js";

const main = async () => {
  console.log(
    `[ingest] vector store: ${config.vectorStore} | collection: ${config.chromaCollection}`,
  );

  if (config.vectorStore !== "chroma") {
    console.warn(
      "[ingest] Active store is JSON. force-reingest targets Chroma; for the JSON store just delete data/vectors.json to re-index.",
    );
  }

  console.log("[ingest] Force re-ingesting knowledge base...");
  const start = Date.now();
  await initializeStore({ force: true });
  console.log(`[ingest] Done in ${Date.now() - start}ms`);
  console.log("[ingest] Stats:", getStoreStats());

  process.exit(0);
};

main().catch((err) => {
  console.error("[ingest] Failed:", err);
  process.exit(1);
});
