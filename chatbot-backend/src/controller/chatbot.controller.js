import crypto from "crypto";
import { query, getStoreStats } from "../service/vectorStore.js";
import {
  isAvailable as llmAvailable,
  generate,
  generatePrompt,
} from "../service/llm.js";
import config from "../config.js";

// ─── Conversation memory ────────────────────────────────────
const sessions = new Map();

const getOrCreateSession = (sessionId) => {
  let session = sessions.get(sessionId);
  if (!session) {
    session = { messages: [], lastActive: Date.now() };
    sessions.set(sessionId, session);
  }
  session.lastActive = Date.now();
  return session;
};

const saveToHistory = (session, userText, assistantText) => {
  session.messages.push(
    { role: "user", text: userText },
    { role: "assistant", text: assistantText }
  );
  // Trim to max history
  if (session.messages.length > config.maxHistory * 2) {
    session.messages = session.messages.slice(-config.maxHistory * 2);
  }
};

// Cleanup stale sessions every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActive > config.sessionTtlMs) {
      sessions.delete(id);
    }
  }
}, CLEANUP_INTERVAL).unref();

// ─── Dynamic platform context ───────────────────────────────
const fetchPlatformContext = async () => {
  try {
    const res = await fetch(`${config.mainBackendUrl}/`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    return { platform: "Sahaaya", status: "online", timestamp: new Date().toISOString() };
  } catch {
    return null;
  }
};

// ─── Fallback: format chunks as readable answer ─────────────
const formatChunksAsAnswer = (chunks) => {
  if (chunks.length === 0) {
    return "I'm not sure about that. Try asking about donations, NGO registration, rider points, food safety, or how the platform works.";
  }

  // Group by source
  const groups = {};
  for (const c of chunks) {
    const key = c.source.replace(".txt", "");
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  }

  let answer = "Here's what I found:\n\n";
  for (const [source, groupChunks] of Object.entries(groups)) {
    answer += `**From ${source.replace(/-/g, " ")}:**\n`;
    for (const c of groupChunks) {
      answer += `• ${c.text}\n`;
    }
    answer += "\n";
  }

  answer += "---\n*Sources: " + [...new Set(chunks.map((c) => c.source))].join(", ") + "*";
  return answer.trim();
};

// ─── Chat handler ───────────────────────────────────────────
const chat = async (req, res) => {
  const { question, sessionId } = req.body || {};

  if (!question || String(question).trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Question is required" });
  }

  const q = question.trim();
  const sid = sessionId || crypto.randomUUID();
  const history = getOrCreateSession(sid);

  try {
    // 1. Vector search
    const chunks = await query(q);

    // 2. Dynamic platform context (best-effort, non-blocking)
    const platformContext = await fetchPlatformContext();

    // 3. Check if client wants SSE
    const wantsStreaming =
      req.accepts("json") !== "json" ||
      req.headers.accept?.includes("text/event-stream");

    const llmReady = llmAvailable();

    if (wantsStreaming) {
      // ── SSE response ──
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });

      // Send metadata first
      res.write(
        `event: meta\ndata: ${JSON.stringify({
          sources: chunks.map((c) => ({
            text: c.text.slice(0, 120) + (c.text.length > 120 ? "..." : ""),
            source: c.source,
            score: c.score,
          })),
          llm_used: llmReady,
          session_id: sid,
        })}\n\n`
      );

      let answer;

      if (llmReady && chunks.length > 0) {
        // ── LLM-synthesized streaming answer ──
        const prompt = generatePrompt(platformContext, history.messages, chunks, q);

        let fullText = "";
        let tokenCount = 0;

        await generate(prompt, {
          onToken: (token) => {
            fullText += token;
            tokenCount++;
            // Flush every token for smooth streaming
            res.write(
              `event: token\ndata: ${JSON.stringify({ token })}\n\n`
            );
          },
          signal: req.signal,
        });

        answer = fullText;
      } else if (chunks.length > 0) {
        // ── Fallback: formatted chunks ──
        answer = formatChunksAsAnswer(chunks);
        // Send as one token
        res.write(
          `event: token\ndata: ${JSON.stringify({ token: answer })}\n\n`
        );
      } else {
        answer =
          "I'm not sure about that. Try asking about donations, NGO registration, rider points, food safety, or how the platform works.";
        res.write(
          `event: token\ndata: ${JSON.stringify({ token: answer })}\n\n`
        );
      }

      // Done event
      res.write(`event: done\ndata: {}\n\n`);
      res.end();

      // Save to history
      saveToHistory(history, q, answer);
    } else {
      // ── JSON response ──
      let answer;

      if (llmReady && chunks.length > 0) {
        const prompt = generatePrompt(platformContext, history.messages, chunks, q);
        answer = await generate(prompt);
      } else if (chunks.length > 0) {
        answer = formatChunksAsAnswer(chunks);
      } else {
        answer =
          "I'm not sure about that. Try asking about donations, NGO registration, rider points, food safety, or how the platform works.";
      }

      // Save to history
      saveToHistory(history, q, answer);

      res.json({
        success: true,
        answer,
        sources: chunks.map((c) => ({
          text: c.text.slice(0, 200) + (c.text.length > 200 ? "..." : ""),
          source: c.source,
          score: c.score,
        })),
        llm_used: llmReady,
        session_id: sid,
      });
    }
  } catch (error) {
    console.error("[chatbot] Error:", error);

    // If headers already sent (SSE), try sending error event
    if (res.headersSent) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: "Something went wrong" })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
};

// ─── Health / stats ─────────────────────────────────────────
const health = async (req, res) => {
  const stats = getStoreStats();
  res.json({
    success: true,
    message: "Chatbot backend is running",
    llm_available: llmAvailable(),
    index: stats,
    sessions_active: sessions.size,
  });
};

export { chat, health };
