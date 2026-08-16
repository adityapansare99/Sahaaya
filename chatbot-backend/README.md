# 🤖 Sahaaya RAG AI Chatbot Microservice (`chatbot-backend`)

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Xenova Transformers](https://img.shields.io/badge/@xenova/transformers-2.17.2-FF6F00?style=flat-square)](https://huggingface.co/docs/transformers.js/index)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![SSE](https://img.shields.io/badge/Streaming-Server--Sent_Events-009688?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
[![License](https://img.shields.io/badge/License-MIT-green.style=flat-square)](#license)

> **In-House Retrieval-Augmented Generation (RAG) Microservice** providing real-time compliance, food safety guidance, and platform assistance for Sahaaya. Features local neural embeddings, multi-provider vector storage (Chroma Cloud / Self-hosted Chroma / Local JSON), Maximal Marginal Relevance (MMR) reranking, and Server-Sent Events (SSE) streaming.

---

## 📋 Table of Contents

- [Overview & Highlights](#-overview--highlights)
- [System Architecture & RAG Pipeline](#-system-architecture--rag-pipeline)
- [Algorithmic & Mathematical Rationale](#-algorithmic--mathematical-rationale)
- [Directory Structure](#-directory-structure)
- [Code-Verified API Reference & Event Contracts](#-code-verified-api-reference--event-contracts)
- [Vector Store Options](#-vector-store-options)
- [Knowledge Base Management](#-knowledge-base-management)
- [Environment Variables Master Schema](#-environment-variables-master-schema)
- [Getting Started & Installation](#-getting-started--installation)

---

## 🔍 Overview & Highlights

The **Sahaaya Chatbot Backend** is a standalone microservice running on **Port 8001** that delivers grounded assistance to donors, NGOs, riders, and admins.

It enforces grounding in the project's internal knowledge base (`knowledge-base/*.txt`).

### Key Highlights

- **🔒 Grounded RAG Architecture**: Answers strictly from project documentation. If context is absent, it falls back to explicit domain guidance or formatted chunk extracts.
- **⚡ Zero-Cost Local Embeddings**: Uses `@xenova/transformers` (`all-MiniLM-L6-v2`) executing locally inside Node.js memory, generating 384-dimensional dense vectors with zero third-party vector API costs.
- **🌊 Resilient SSE Streaming**: Streams responses token-by-token over Server-Sent Events. Includes client-disconnect detection (`req.on("close")`) via `AbortController` to abort LLM generation if a tab is closed.
- **🔌 Multi-Provider Vector Store**:
  - **Chroma Cloud**: Fully managed production mode.
  - **Self-Hosted Chroma**: Local Docker / private server mode.
  - **JSON Storage**: Local single-file cache (`data/vectors.json`) with zero setup overhead.
- **🧠 Flexible LLM Drivers**: Configurable between **Groq API** (production default `llama-3.3-70b-versatile`) and **Ollama** (`mistral` local offline dev).

---

## 🏗️ System Architecture & RAG Pipeline

```
                               ┌─────────────────────────┐
                               │  knowledge-base/*.txt   │
                               └────────────┬────────────┘
                                            │
                                            ▼  Heading-Aware Recursive Chunking (~500 chars)
                               ┌─────────────────────────┐
                               │ Document Chunks Cache   │
                               └────────────┬────────────┘
                                            │
                                            ▼  @xenova/transformers (all-MiniLM-L6-v2)
                               ┌─────────────────────────┐
                               │  384-Dim Vector Embeds  │
                               └────────────┬────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
     ┌───────────────────┐                                     ┌───────────────────┐
     │ Chroma Vector DB  │                                     │ JSON Vector Cache │
     │ (Cloud / Private) │                                     │(data/vectors.json)│
     └─────────┬─────────┘                                     └─────────┬─────────┘
               └────────────────────────────┬────────────────────────────┘
                                            │
     POST /chat                             ▼ Cosine Similarity & MMR Reranking
   ──────────────────────────> ┌─────────────────────────┐
                               │ Top-K Grounded Chunks   │
                               └────────────┬────────────┘
                                            │
                                            ▼ Prompt Construction & Context Binding
                               ┌─────────────────────────┐
                               │   LLM Inference Engine  │
                               │     (Groq / Ollama)     │
                               └────────────┬────────────┘
                                            │
                                            ▼ Server-Sent Events (SSE Stream)
                               ┌─────────────────────────┐
                               │ React 19 Floating Chat  │
                               └─────────────────────────┘
```

---

## 📐 Algorithmic & Mathematical Rationale

### 1. Vector Embedding Formulation
Text chunks are mapped into a 384-dimensional vector space using the `all-MiniLM-L6-v2` ONNX model:
$$\vec{v} = \text{Embed}(T) \in \mathbb{R}^{384}, \quad \|\vec{v}\|_2 = 1$$

### 2. Cosine Similarity Retrieval
The query vector $\vec{q}$ is compared against chunk embedding vectors $\vec{d}_i$ via normalized dot product:
$$\text{Sim}(\vec{q}, \vec{d}_i) = \frac{\vec{q} \cdot \vec{d}_i}{\|\vec{q}\|_2 \|\vec{d}_i\|_2} = \vec{q} \cdot \vec{d}_i$$

### 3. Maximal Marginal Relevance (MMR) Reranking
To prevent redundant information in top results, MMR balances relevance to query $\vec{q}$ with diversity among selected documents $S$:
$$\text{MMR} = \arg\max_{d_i \in R \setminus S} \left[ \lambda \cdot \text{Sim}(d_i, q) - (1 - \lambda) \max_{d_j \in S} \text{Sim}(d_i, d_j) \right]$$

---

## 📁 Directory Structure

```
chatbot-backend/
├── data/                       # Local vector cache storage
│   └── vectors.json            # Generated 384-dim JSON vector index
├── knowledge-base/             # Domain knowledge documents (.txt)
│   ├── faq.txt                 # Frequently asked platform questions
│   ├── food-safety.txt         # Shelf life & food handling guidelines
│   ├── logistics.txt           # Rider delivery & distance matching rules
│   └── partner-rewards.txt     # Restaurant points & redemption terms
├── src/
│   ├── app.js                  # Express setup, CORS & rate limiters (mounted at /)
│   ├── config.js               # Service configuration & provider resolver
│   ├── index.js                # Server entrypoint & vector initializer
│   ├── controller/
│   │   └── chatbot.controller.js # SSE streaming controller & session memory
│   ├── route/
│   │   └── chatbot.route.js      # Endpoint routerdefinitions
│   └── service/
│       ├── embeddings.js       # Xenova transformer ONNX pipeline wrapper
│       ├── llm.js              # Groq & Ollama LLM drivers with stream abort
│       ├── store.js            # Vector store factory interface
│       ├── storeUtils.js       # File hashing, chunking, Cosine & MMR math
│       ├── chromaStore.js      # Chroma Cloud / Self-Hosted driver
│       └── vectorStore.js      # Single-file JSON vector persistence driver
├── .env                        # Local environment variables
├── README_OLD.md               # Archived previous README documentation
└── package.json                # Service dependencies and scripts
```

---

## 🌐 Code-Verified API Reference & Event Contracts

Mounted at root `/`:

### 1. Health & Store Status Endpoint
#### `GET /`
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Chatbot backend is running",
  "llm_available": true,
  "llm_provider": "groq",
  "vector_store": "json",
  "index": {
    "chunks": 48,
    "hashes": { "faq.txt": "a1b2c3..." }
  },
  "sessions_active": 2
}
```

---

### 2. Chat Endpoint (Streaming & Non-Streaming)
#### `POST /chat`
- **Request Body**:
```json
{
  "question": "How long can cooked food be safely redistributed?",
  "sessionId": "sess_987654321"
}
```

#### Streaming SSE Mode (When `Accept: text/event-stream` header present)
- **Response Headers**:
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache`
  - `Connection: keep-alive`

##### Stream Event Flow:

1. **`event: meta`**
```http
event: meta
data: {"sources":[{"text":"Cooked meals should be collected within 4 hours...","source":"food-safety.txt","score":0.892}],"llm_used":true,"session_id":"sess_987654321"}
```

2. **`event: token`** (Emitted repeatedly)
```http
event: token
data: {"token":"Cooked "}

event: token
data: {"token":"meals "}
```

3. **`event: done`**
```http
event: done
data: {}
```

4. **`event: error`** (If an unhandled exception occurs mid-stream)
```http
event: error
data: {"message":"Something went wrong"}
```

#### Non-Streaming Mode (Standard JSON)
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "answer": "Cooked meals must be redistributed within 4 hours of preparation to ensure safety.",
  "sources": [
    {
      "text": "Cooked meals should be collected within 4 hours...",
      "source": "food-safety.txt",
      "score": 0.892
    }
  ],
  "llm_used": true,
  "session_id": "sess_987654321"
}
```

---

## 🗄️ Vector Store Options

| Store Type | Environment Setting | Description |
|---|---|---|
| **JSON Store** (Default) | `VECTOR_STORE=json` | Local single-file persistence (`data/vectors.json`) |
| **Chroma Cloud** | `VECTOR_STORE=chroma`, `CHROMA_API_KEY=...` | Production hosted Chroma database |
| **Chroma Self-Hosted** | `VECTOR_STORE=chroma`, `CHROMA_URL=http://...` | Docker / local Chroma instance |

---

## 📄 Knowledge Base Management

1. Place domain text files (`.txt`) in `chatbot-backend/knowledge-base/`.
2. Format sections with heading tags (`# Heading`, `## Subheading`).
3. On microservice boot, `storeUtils.js` compares MD5 hashes and automatically re-indexes changed files.

---

## ⚙️ Environment Variables Master Schema

Create `.env` inside `chatbot-backend/`:

```env
PORT=8001

# LLM Provider Options: 'groq' | 'ollama'
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Ollama Settings (if LLM_PROVIDER=ollama)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral

# Vector Store Options: 'json' | 'chroma'
VECTOR_STORE=json

# Chroma Credentials (if VECTOR_STORE=chroma)
CHROMA_URL=https://api.trychroma.com
CHROMA_API_KEY=your_chroma_api_key

# Core Backend Ping Check
MAIN_BACKEND_URL=http://localhost:8000

# CORS Allowed Origin
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Getting Started & Installation

### 1. Install Dependencies
```bash
cd chatbot-backend
npm install
```

### 2. Start Microservice
```bash
npm start
```
Starts server on `http://localhost:8001`.

---
