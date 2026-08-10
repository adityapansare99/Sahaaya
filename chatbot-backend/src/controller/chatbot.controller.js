import crypto from "crypto";
import { query, getStoreStats } from "../service/store.js";
import {
  isAvailable as llmAvailable,
  generateAnswer,
} from "../service/llm.js";
import config from "../config.js";

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
  if (session.messages.length > config.maxHistory * 2) {
    session.messages = session.messages.slice(-config.maxHistory * 2);
  }
};

const CLEANUP_INTERVAL = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActive > config.sessionTtlMs) {
      sessions.delete(id);
    }
  }
}, CLEANUP_INTERVAL).unref();

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

const formatChunksAsAnswer = (chunks) => {
  if (chunks.length === 0) {
    return "I'm not sure about that. Try asking about donations, NGO registration, rider points, food safety, or how the platform works.";
  }

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

const trackDisconnect = (req) => {
  const ac = new AbortController();
  const onClose = () => ac.abort();
  req.on("close", onClose);
  return { signal: ac.signal, cleanup: () => req.off("close", onClose) };
};

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
  const { signal, cleanup } = trackDisconnect(req);

  try {
    const chunks = await query(q);

    const platformContext = await fetchPlatformContext();

    const wantsStreaming =
      req.accepts("json") !== "json" ||
      req.headers.accept?.includes("text/event-stream");

    const llmReady = llmAvailable();

    if (wantsStreaming) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });

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
        answer = await generateAnswer({
          context: platformContext,
          history: history.messages,
          sources: chunks,
          question: q,
          onToken: (token) =>
            res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`),
          signal,
        });
      } else if (chunks.length > 0) {
        answer = formatChunksAsAnswer(chunks);
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

      res.write(`event: done\ndata: {}\n\n`);
      res.end();

      saveToHistory(history, q, answer);
    } else {
      let answer;

      if (llmReady && chunks.length > 0) {
        answer = await generateAnswer({
          context: platformContext,
          history: history.messages,
          sources: chunks,
          question: q,
          signal,
        });
      } else if (chunks.length > 0) {
        answer = formatChunksAsAnswer(chunks);
      } else {
        answer =
          "I'm not sure about that. Try asking about donations, NGO registration, rider points, food safety, or how the platform works.";
      }

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
    if (error?.name === "AbortError") {
      return;
    }

    console.error("[chatbot] Error:", error);

    if (res.headersSent) {
      try {
        res.write(`event: error\ndata: ${JSON.stringify({ message: "Something went wrong" })}\n\n`);
        res.end();
      } catch {
        // client already gone
      }
    } else {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  } finally {
    cleanup();
  }
};

const health = async (req, res) => {
  const stats = getStoreStats();
  res.json({
    success: true,
    message: "Chatbot backend is running",
    llm_available: llmAvailable(),
    llm_provider: config.llmProvider,
    vector_store: config.vectorStore,
    index: stats,
    sessions_active: sessions.size,
  });
};

export { chat, health };
