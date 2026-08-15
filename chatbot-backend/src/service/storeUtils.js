import fs from "fs";
import path from "path";
import crypto from "crypto";
import config from "../config.js";

const VERSION = 3;

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

const aggregateHash = (fileHashes) =>
  crypto
    .createHash("md5")
    .update(
      Object.keys(fileHashes)
        .sort()
        .map((k) => `${k}:${fileHashes[k]}`)
        .join("\n"),
    )
    .digest("hex");

const splitRecursive = (text, heading = "", targetSize = 500, overlap = 50) => {
  const clean = text.replace(/^#.*$/gm, "").trim();
  if (!clean || clean.length < 20) return [];

  const chunks = [];

  const paragraphs = clean.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  for (const para of paragraphs) {
    if (para.length <= targetSize) {
      chunks.push(para.trim());
      continue;
    }

    const lines = para.split("\n").filter((l) => l.trim().length > 0);
    let buffer = [];

    for (const line of lines) {
      const combined = [...buffer, line.trim()].join(" ").trim();
      if (combined.length > targetSize && buffer.length > 0) {
        chunks.push(buffer.join(" ").trim());
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

  const finalChunks = [];
  for (const chunk of chunks) {
    if (chunk.length <= targetSize + 100) {
      finalChunks.push(chunk);
      continue;
    }
    const sentences = chunk.match(/[^.!?\n]+[.!?\n]*/g) || [chunk];
    let sentBuffer = [];
    let sentLen = 0;
    for (const s of sentences) {
      if (sentLen + s.length > targetSize && sentBuffer.length > 0) {
        finalChunks.push(sentBuffer.join(" ").trim());
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

export {
  VERSION,
  computeFileHashes,
  hashesEqual,
  aggregateHash,
  splitRecursive,
  loadKnowledgeBase,
  cosineSimilarity,
  mmrRerank,
};
