import config from "../config.js";

let available = false;

const checkLlmAvailability = async () => {
  if (!config.llmEnabled) {
    available = false;
    return false;
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

const generatePrompt = (context, history, sources, question) => {
  const formattedSource = sources
    .map(
      (s) =>
        `[${s.source.replace(".txt", "")}] ${s.text}`,
    )
    .join("\n\n");

  let prompt = `You are Sahaaya Support — a smart assistant for a food donation platform that connects Donors, NGOs, and Delivery Riders.

## Instructions
- Answer the user's question based ONLY on the context below.
- If the context doesn't contain the answer, say "I don't have information about that in my knowledge base."
- Keep answers specific and helpful. Use bullet points when listing multiple items.
- Cite source files naturally (e.g., "According to the FAQ...").`;

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
      model: config.llmModel,
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
        } catch {
          // skip malformed lines
        }
      }
    }

    return fullText;
  }

  // Non-streaming: wait for full response
  const data = await res.json();
  return data.response || "";
};

export { checkLlmAvailability, isAvailable, generate, generatePrompt };
