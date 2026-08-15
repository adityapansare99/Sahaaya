import config from "../config.js";

let available = false;

const SYSTEM_PROMPT = `You are Sahaaya Support — a smart assistant for a food donation platform that connects Donors, NGOs, and Delivery Riders.

## Instructions
- Answer the user's question based ONLY on the context below.
- If the context doesn't contain the answer, say "I don't have information about that in my knowledge base."
- Keep answers specific and helpful. Use bullet points when listing multiple items.
- Cite source files naturally (e.g., "According to the FAQ...").`;

const checkLlmAvailability = async () => {
  if (!config.llmEnabled) {
    available = false;
    return false;
  }

  if (config.llmProvider === "groq") {
    available = !!config.groqApiKey;
    return available;
  }

  try {
    const res = await fetch(`${config.ollamaBaseUrl}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    available = res.ok;
    return available;
  } catch {
    available = false;
    return false;
  }
};

const isAvailable = () => available;

const formatSources = (sources) =>
  sources
    .map((s) => `[${s.source.replace(".txt", "")}] ${s.text}`)
    .join("\n\n");

const generatePrompt = (context, history, sources, question) => {
  const formattedSource = formatSources(sources);

  let prompt = SYSTEM_PROMPT;

  if (context) {
    prompt += `\n\n## Live Platform Context\n${JSON.stringify(context, null, 2)}`;
  }

  prompt += `\n\n## Knowledge Base\n${formattedSource}`;

  if (history.length > 0) {
    const formattedHistory = history
      .slice(-config.maxHistory)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");
    prompt += `\n\n## Conversation History\n${formattedHistory}`;
  }

  prompt += `\n\n## Current Question\nUser: ${question}\n\nAssistant:`;

  return prompt;
};

const generate = async (prompt, { onToken, signal } = {}) => {
  if (!available) throw new Error("LLM not available");

  const res = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.ollamaModel,
      prompt,
      stream: !!onToken,
      options: {
        temperature: 0.3,
        top_p: 0.9,
        num_predict: 1024,
      },
    }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }

  if (onToken) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            fullText += parsed.response;
            onToken(parsed.response);
          }
          if (parsed.done) break;
        } catch {}
      }
    }

    return fullText;
  }

  const data = await res.json();
  return data.response || "";
};

const buildMessages = (context, history, sources, question) => {
  const messages = [{ role: "system", content: SYSTEM_PROMPT }];

  if (context) {
    messages.push({
      role: "system",
      content: `## Live Platform Context\n${JSON.stringify(context, null, 2)}`,
    });
  }

  for (const m of history.slice(-config.maxHistory)) {
    messages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    });
  }

  messages.push({
    role: "user",
    content: `Answer the question using ONLY the knowledge base below.\n\n## Knowledge Base\n${formatSources(sources)}\n\n## Current Question\n${question}`,
  });

  return messages;
};

const generateGroq = async ({
  context,
  history,
  sources,
  question,
  onToken,
  signal,
}) => {
  const res = await fetch(`${config.groqBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.groqApiKey}`,
    },
    body: JSON.stringify({
      model: config.groqModel,
      messages: buildMessages(context, history, sources, question),
      stream: !!onToken,
      temperature: 0.3,
      top_p: 0.9,
      max_tokens: config.groqMaxTokens,
    }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq error ${res.status}: ${text}`);
  }

  if (onToken) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") {
          streamDone = true;
          break;
        }
        try {
          const json = JSON.parse(payload);
          const token = json.choices?.[0]?.delta?.content;
          if (token) {
            fullText += token;
            onToken(token);
          }
        } catch {}
      }
    }

    return fullText;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
};

const generateAnswer = async ({
  context,
  history,
  sources,
  question,
  onToken,
  signal,
}) => {
  if (!available) throw new Error("LLM not available");

  if (config.llmProvider === "groq") {
    return generateGroq({
      context,
      history,
      sources,
      question,
      onToken,
      signal,
    });
  }

  const prompt = generatePrompt(context, history, sources, question);
  return generate(prompt, { onToken, signal });
};

export {
  checkLlmAvailability,
  isAvailable,
  generate,
  generatePrompt,
  generateAnswer,
};
