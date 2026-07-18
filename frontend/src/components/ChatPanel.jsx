import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, User, ChevronDown, ChevronUp, MessageCircle, Sparkles, AlertCircle } from "lucide-react";

// ─── Simple Markdown renderer ───────────────────────────────
const renderMarkdown = (text) => {
  const lines = text.split("\n");
  const elements = [];
  let inList = false;
  let listItems = [];

  const flushList = (key) => {
    if (listItems.length === 0) return null;
    const items = listItems;
    listItems = [];
    return (
      <ul key={key} className="space-y-1.5 my-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700">
            <span className="text-red-400 mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^---/.test(trimmed)) {
      if (inList) { const el = flushList(`ul-${i}`); if (el) elements.push(el); inList = false; }
      elements.push(<hr key={i} className="border-gray-100 my-3" />);
      continue;
    }

    if (/^[•\*\-]\s/.test(trimmed)) {
      inList = true;
      const content = trimmed.replace(/^[•\*\-]\s/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      listItems.push(<span key={listItems.length} dangerouslySetInnerHTML={{ __html: content }} />);
      continue;
    }

    if (inList) { const el = flushList(`ul-${i}`); if (el) elements.push(el); inList = false; }

    if (!trimmed) {
      elements.push(<div key={i} className="h-1.5" />);
      continue;
    }

    if (/^\*\*(.+?)\*\*/.test(trimmed)) {
      const html = trimmed
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-red-600'>$1</code>");
      elements.push(
        <p key={i} className="text-sm leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: html }} />
      );
      continue;
    }

    const html = trimmed
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-red-600'>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-red-600 underline font-medium hover:text-red-700">$1</a>');
    elements.push(
      <p key={i} className="text-sm leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: html }} />
    );
  }

  if (inList) { const el = flushList(`ul-end`); if (el) elements.push(el); }
  return elements;
};

// ─── Suggestion chips ──────────────────────────────────────
const SUGGESTIONS = {
  initial: [
    "How to donate food",
    "How NGO registration works",
    "How rider points work",
    "Food safety guidelines",
  ],
  followup: [
    "What food types can be donated?",
    "How do I track my donation?",
    "How do I redeem points?",
    "Tell me about food waste in India",
  ],
};

// ─── Quick action items for empty state ─────────────────────
const QUICK_ACTIONS = [
  { icon: "🍽️", label: "Donating food", question: "How do I donate food?" },
  { icon: "🏛️", label: "NGO registration", question: "How does NGO registration work?" },
  { icon: "🚴", label: "Rider rewards", question: "How do rider points work?" },
  { icon: "🥗", label: "Food safety", question: "What are the food safety guidelines?" },
];

// ─── Source file colors ────────────────────────────────────
const SOURCE_COLORS = {
  "faq.txt": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", border: "border-blue-100" },
  "food-safety.txt": { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400", border: "border-green-100" },
  "compliance.txt": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400", border: "border-purple-100" },
  "platform-features.txt": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", border: "border-amber-100" },
  "hunger-waste.txt": { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400", border: "border-rose-100" },
};

const getSourceColor = (source) => {
  return SOURCE_COLORS[source] || { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400", border: "border-gray-100" };
};

const getSourceLabel = (source) => {
  return source.replace(".txt", "").replace(/-/g, " ");
};

// ─── Main component ────────────────────────────────────────
const ChatPanel = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [expandedSources, setExpandedSources] = useState({});
  const [llmActive, setLlmActive] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const chatbotUrl = import.meta.env.VITE_CHATBOT_URL || "http://localhost:8001";
  const sessionId = useRef(crypto.randomUUID());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingAnswer, scrollToBottom]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const toggleSource = (msgIndex, sourceIndex) => {
    setExpandedSources((prev) => ({
      ...prev,
      [`${msgIndex}-${sourceIndex}`]: !prev[`${msgIndex}-${sourceIndex}`],
    }));
  };

  // Use a ref so suggestion handlers never get stale closures
  const handleSendRef = useRef(null);

  const handleSend = useCallback(async (text) => {
    const question = (text || input).trim();
    if (!question) return;

    setInput("");
    setLoading(true);
    setStreamingAnswer("");
    setHasInteracted(true);

    const userMsg = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`${chatbotUrl}/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ question, sessionId: sessionId.current }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let botAnswer = "";
      let botSources = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          const lines = event.split("\n");
          let eventType = "";
          let eventData = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) eventType = line.slice(7).trim();
            else if (line.startsWith("data: ")) eventData = line.slice(6).trim();
          }
          if (!eventType || !eventData) continue;

          try {
            const parsed = JSON.parse(eventData);
            switch (eventType) {
              case "meta":
                botSources = parsed.sources || [];
                setLlmActive(parsed.llm_used || false);
                break;
              case "token":
                botAnswer += parsed.token || "";
                setStreamingAnswer(botAnswer);
                break;
              case "done": {
                // Capture values BEFORE clearing botAnswer — setMessages updater runs async
                // and closures capture the variable binding, not its value at creation time.
                const finalAnswer = botAnswer;
                const finalSources = [...botSources];
                setMessages((prev) => [...prev, { role: "bot", text: finalAnswer, final: true, sources: finalSources }]);
                setStreamingAnswer("");
                botAnswer = "";
                break;
              }
              case "error": {
                const errorMsg = parsed.message || "Something went wrong";
                setMessages((prev) => [...prev, { role: "bot", text: errorMsg, final: true, sources: [] }]);
                setStreamingAnswer("");
                break;
              }
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I'm having trouble connecting. Please try again.", final: true, sources: [] }]);
    } finally {
      setLoading(false);
      setStreamingAnswer("");
    }
  }, [input, chatbotUrl]);

  // Keep the ref in sync
  handleSendRef.current = handleSend;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    // Call handleSend directly through the ref — no setInput/setTimeout race
    handleSendRef.current(text);
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <>
      {/* Trigger FAB */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center group ${open ? "hidden" : ""}`}
        aria-label="Open support chat"
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-6 transition-transform" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-2xl border-2 border-red-400/40 animate-ping" />
        {/* Online dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
      </button>

      {/* Chat Panel */}
      {open && (
        <>
          {/* Backdrop — only on mobile */}
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Panel card */}
          <div className="fixed bottom-0 right-0 z-50 w-full md:bottom-6 md:right-6 md:w-[420px] md:h-[620px] md:max-h-[80vh] md:rounded-2xl md:shadow-2xl flex flex-col bg-white overflow-hidden animate-in md:border border-gray-100"
            style={{ animation: "slideUp 0.25s ease-out" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/20">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">Sahaaya Support</h3>
                      {llmActive && <Sparkles className="w-3.5 h-3.5 text-yellow-200" />}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                      <span className="text-xs text-red-100">
                        {llmActive ? "AI assistant • Online" : "Knowledge base • Online"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
              {/* Empty state */}
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                    <Bot className="w-8 h-8 text-red-500" />
                  </div>
                  <h4 className="text-gray-800 font-semibold text-lg mb-1">Hi, how can I help?</h4>
                  <p className="text-gray-400 text-sm mb-6 text-center max-w-xs">
                    Ask me anything about donating, receiving, or delivering food on Sahaaya.
                  </p>
                  <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleSuggestionClick(action.question)}
                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-sm hover:bg-red-50/30 transition-all duration-200 cursor-pointer group"
                      >
                        <span className="text-xl">{action.icon}</span>
                        <span className="text-xs text-gray-500 group-hover:text-red-600 font-medium text-center leading-tight">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message bubbles */}
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} ${idx > 0 ? "mt-4" : ""}`}>
                  <div className={`flex gap-2.5 max-w-[88%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${
                      m.role === "user"
                        ? "bg-red-100"
                        : "bg-white border border-gray-100 shadow-sm"
                    }`}>
                      {m.role === "user" ? (
                        <User className="w-4 h-4 text-red-500" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      {/* Bubble */}
                      <div className={`px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl rounded-tr-md shadow-sm"
                          : "bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-sm"
                      }`}>
                        {m.role === "bot" ? (
                          <div className="text-gray-700" style={{ whiteSpace: "pre-wrap" }}>
                            {renderMarkdown(m.text)}
                          </div>
                        ) : (
                          <span>{m.text}</span>
                        )}
                      </div>

                      {/* Source badges */}
                      {m.role === "bot" && m.sources && m.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {m.sources.map((s, si) => {
                            const colors = getSourceColor(s.source);
                            return (
                              <div key={si}>
                                <button
                                  onClick={() => toggleSource(idx, si)}
                                  className={`text-[11px] px-2.5 py-1 rounded-full border cursor-pointer transition-all duration-150 flex items-center gap-1.5 ${colors.bg} ${colors.text} ${colors.border} hover:shadow-sm`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                                  {getSourceLabel(s.source)}
                                  {expandedSources[`${idx}-${si}`] ? (
                                    <ChevronUp className="w-3 h-3 opacity-60" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3 opacity-60" />
                                  )}
                                </button>
                                {expandedSources[`${idx}-${si}`] && (
                                  <div className="mt-1.5 p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-xs text-gray-500 leading-relaxed">
                                    <div className="flex items-center gap-1.5 mb-1.5 text-gray-400 font-medium text-[11px] uppercase tracking-wider">
                                      <AlertCircle className="w-3 h-3" />
                                      Source excerpt
                                    </div>
                                    {s.text}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming answer */}
              {streamingAnswer && (
                <div className="flex justify-start mt-4">
                  <div className="flex gap-2.5 max-w-[88%]">
                    <div className="w-7 h-7 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-sm min-w-[80px]">
                      <div className="text-sm leading-relaxed text-gray-700" style={{ whiteSpace: "pre-wrap" }}>
                        {renderMarkdown(streamingAnswer)}
                        <span className="inline-block w-2 h-4 bg-red-500 ml-0.5 rounded-sm animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading dots */}
              {loading && !streamingAnswer && (
                <div className="flex justify-start mt-4">
                  <div className="flex gap-2.5 max-w-[88%]">
                    <div className="w-7 h-7 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="px-5 py-4 bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-sm">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0s", animationDuration: "1s" }} />
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.15s", animationDuration: "1s" }} />
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.3s", animationDuration: "1s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Follow-up suggestions */}
              {hasInteracted && messages.length > 0 && !loading && !streamingAnswer && (
                <div className="pt-1">
                  <p className="text-[11px] text-gray-400 mb-2 font-medium uppercase tracking-wider">Try asking</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.followup.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestionClick(s)}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50/30 transition-all duration-200 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-3 bg-white flex-shrink-0">
              <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100 transition-all duration-200 px-3 py-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-sm placeholder-gray-400 py-1 max-h-32"
                  style={{ fieldSizing: "content" }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center flex-shrink-0 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:scale-100 disabled:shadow-none cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-300 text-center mt-1.5">Press Enter to send</p>
            </div>
          </div>
        </>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default ChatPanel;
