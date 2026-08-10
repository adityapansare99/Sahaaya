import config from "../config.js";
import * as jsonStore from "./vectorStore.js";
import * as chromaStore from "./chromaStore.js";

const active = config.vectorStore === "chroma" ? chromaStore : jsonStore;

console.log(
  `[store] Active vector store: ${config.vectorStore === "chroma" ? "Chroma" : "JSON file"}`
);

const initializeStore = (...args) => active.initializeStore(...args);
const query = (...args) => active.query(...args);
const getStoreStats = (...args) => active.getStoreStats(...args);

export { initializeStore, query, getStoreStats };
