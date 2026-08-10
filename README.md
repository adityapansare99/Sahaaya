# Sahaaya (सहाय्य) — Zero Food Waste & Real-Time Logistics Ecosystem

> **Sahaaya** is a production-grade, full-stack real-time food surplus redistribution platform. It bridges the gap between **Donors** (restaurants, caterers, grocery stores, events, individuals), **NGOs** (shelters, food banks), **Delivery Partners** (riders who transport food), and **Restaurant Partners** (who earn and redeem impact points).
>
> The repository incorporates an Express 5 REST API, a Socket.IO WebSocket real-time engine, a MongoDB database layer with atomic concurrency protection, a React 19 + Tailwind CSS 4 frontend using the Flow design system, and an **in-house RAG (Retrieval-Augmented Generation) Chatbot microservice** powered by local ONNX neural embeddings (`@xenova/transformers`), Maximal Marginal Relevance (MMR) vector search, and Server-Sent Events (SSE) streaming.

---

## 📋 Table of Contents

1. [Ecosystem Architecture & System Overview](#1-ecosystem-architecture--system-overview)
2. [Database Schemas & Data Model ERD](#2-database-schemas--data-model-erd)
3. [End-to-End Core Workflows](#3-end-to-end-core-workflows)
4. [Exhaustive Backend Service Deep Dive (`backend/`)](#4-exhaustive-backend-service-deep-dive-backend)
   - [4.1 Server Entrypoint & App Configuration](#41-server-entrypoint--app-configuration)
   - [4.2 Authentication & Authorization Middlewares](#42-authentication--authorization-middlewares)
   - [4.3 Database Models Breakdown](#43-database-models-breakdown)
   - [4.4 Complete Controller Layer Breakdown](#44-complete-controller-layer-breakdown)
   - [4.5 REST API Routes Matrix](#45-rest-api-routes-matrix)
   - [4.6 Socket.IO Real-Time Engine & Live Tracking](#46-socketio-real-time-engine--live-tracking)
   - [4.7 Backend Utility & Helper Modules](#47-backend-utility--helper-modules)
5. [Exhaustive Frontend Architecture (`frontend/`)](#5-exhaustive-frontend-architecture-frontend)
   - [5.1 Context Providers & State Management](#51-context-providers--state-management)
   - [5.2 Flow Design System & Color Pipelines](#52-flow-design-system--color-pipelines)
   - [5.3 Pages & Component Hierarchy](#53-pages--component-hierarchy)
6. [Chatbot Backend: RAG Microservice (`chatbot-backend/`)](#6-chatbot-backend-rag-microservice-chatbot-backend)
7. [52 Technical Interview Questions & Exhaustive Solutions](#7-52-technical-interview-questions--exhaustive-solutions)
   - [Section A: Express 5, Node.js & REST API Design (Q1 - Q10)](#section-a-express-5-nodejs--rest-api-design-q1---q10)
   - [Section B: MongoDB, Mongoose & Concurrency Protection (Q11 - Q20)](#section-b-mongodb-mongoose--concurrency-protection-q11---q20)
   - [Section C: Socket.IO WebSockets & Live GPS Engine (Q21 - Q30)](#section-c-socketio-websockets--live-gps-engine-q21---q30)
   - [Section D: React 19, Context & Flow UI Architecture (Q31 - Q40)](#section-d-react-19-context--flow-ui-architecture-q31---q40)
   - [Section E: AI, Vector Math, RAG & LLM Streaming (Q41 - Q52)](#section-e-ai-vector-math-rag--llm-streaming-q41---q52)
8. [Setup, Execution & Environment Variables](#8-setup-execution--environment-variables)

---

## 1. Ecosystem Architecture & System Overview

The Sahaaya platform consists of four distinct micro-applications:

```
                                  ┌─────────────────────────┐
                                  │    React 19 Frontend    │
                                  │ (Donor/NGO/Rider/Ptnr)  │
                                  └────────────┬────────────┘
                                               │
                   ┌───────────────────────────┼───────────────────────────┐
                   │ REST API (JWT)            │ SSE Stream                │ WebSockets (Socket.IO)
                   ▼                           ▼                           ▼
      ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
      │     Express 5 Server    │ │     Chatbot Backend     │ │   Live Tracking Rooms   │
      │    (Main API Gateway)   │ │  (Local ONNX RAG Engine)│ │  (Rider Location Relay) │
      └────────────┬────────────┘ └────────────┬────────────┘ └────────────┬────────────┘
                   │                           │                           │
                   ▼                           ▼                           ▼
          ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
          │  MongoDB Atlas  │         │ Persistent JSON │         │ Viewer Clients  │
          │ (Mongoose DB)   │         │ (vectors.json)  │         │ (Live Maps)     │
          └─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## 2. Database Schemas & Data Model ERD

```
┌──────────────────┐       1:N       ┌──────────────────┐       1:N       ┌──────────────────┐
│      Donor       │───────────────>│     Donation     │<───────────────│       NGO        │
│  (Restaurant/    │                 │ status: Pending/ │                 │ (Receiver)       │
│   Individual)    │                 │ Accepted/Complete│                 │                  │
└──────────────────┘                 └────────┬─────────┘                 └──────────────────┘
                                              │ 1:1
                                              ▼
┌──────────────────┐       1:N       ┌──────────────────┐
│     Delivery     │<───────────────│       Ride       │
│  (Rider User)    │                 │ status: accepted/│
│  points/earnings │                 │ picked up/done   │
└──────────────────┘                 └──────────────────┘

┌──────────────────┐       1:N       ┌──────────────────┐
│     Partner      │───────────────>│    Redemption    │
│ (Restaurant Ptnr)│                 │ reward claimed/  │
│  points balance  │                 │ points deducted  │
└──────────────────┘                 └──────────────────┘
```

---

## 3. End-to-End Core Workflows

### Workflow 1: Donation Creation & NGO Broadcast
1. **Donor** creates a food donation via `POST /donation/create`.
2. Backend saves `Donation` doc with `status: "Pending"`.
3. Backend calls `broadcastToUserType('ngo', { event: 'newDonation', data: donation })`.
4. Socket.IO emits real-time notification to all connected NGO dashboards.

### Workflow 2: Atomic NGO Acceptance & Concurrency Control
1. **NGO** accepts a donation via `POST /receiver/accept-donation`.
2. Backend executes `Donation.findOneAndUpdate({ _id: donationId, status: "Pending" }, { status: "Accepted", acceptedBy: ngoId })`.
3. If another NGO claimed it first, the atomic update fails and returns HTTP 400.
4. If successful, socket notifies Donor (`donationAccepted`) and Delivery Riders (`rideCreated`).

### Workflow 3: Rider Assignment, Live GPS & Completion
1. **Rider** accepts ride via `POST /rider/accept-ride`, creating a `Ride` document (`status: "accepted"`).
2. Rider emits `updateRiderLocation` every 8s via Socket.IO.
3. Socket server relays coordinates to viewers in room `ride:<rideId>`.
4. Frontend map uses `requestAnimationFrame` (RAF) for smooth marker movement.
5. On pickup $\rightarrow$ `status: "picked up"`. On completion $\rightarrow$ `status: "completed"`, `Donation.status: "Completed"`, points awarded to rider & restaurant partner via socket event `pointsAwarded`.

---

## 4. Exhaustive Backend Service Deep Dive (`backend/`)

### 4.1 Server Entrypoint & App Configuration

#### 📄 `backend/src/index.js`
- Imports `dotenv/config` to load environment variables.
- Connects to MongoDB Atlas using `connectDB()` from `db/index.js`.
- Creates Node `http.createServer(app)`.
- Attaches Socket.IO via `initializeSocket(server)`.
- Listens on `PORT` (default `8000`).

#### 📄 `backend/src/app.js`
- **Security Headers**: Mounts `helmet()` to enforce CSP, HSTS, and anti-clickjacking headers.
- **Rate Limiting**:
  - Global Limiter: 1000 requests per 15 minutes per IP (`express-rate-limit`).
  - Auth Limiter: 1000 requests per 15 minutes on login/registration endpoints.
- **CORS**: `cors({ origin: "*", credentials: true })`.
- **Body Parsers**: `express.json({ limit: "16kb" })` and `express.urlencoded({ extended: true })`.
- **Cookie Parser**: `cookieParser()` for extracting JWT refresh tokens.
- **Static Assets**: Serves static files from `public/`.

---

### 4.2 Authentication & Authorization Middlewares

#### 📄 `backend/src/middleware/auth.middleware.js`
Extracts JWT token from cookies (`refreshtoken`) or header `Authorization: Bearer <token>`, verifies signature using `process.env.JWT_SECRET`, and attaches user document to `req.user`.

- `authDonor`: Verifies donor JWT token and binds `Donor` model instance to `req.donor`.
- `authNgo`: Verifies NGO JWT token and binds `NGO` model instance to `req.ngo`.
- `authPartner`: Verifies Delivery Rider JWT token and binds `Delivery` model instance to `req.partner`.
- `authRestaurant`: Verifies Restaurant Partner JWT token and binds `Partner` model instance to `req.restaurant`.
- `authAnyParty`: Polymorphic auth middleware. Resolves user from `Donor`, `NGO`, `Delivery`, or `Partner` models using JWT payload `email`.

#### 📄 `backend/src/middleware/adminAuth.middleware.js`
Verifies admin JWT token or admin header credentials before granting access to `/admin` endpoints.

#### 📄 `backend/src/middleware/multer.middleware.js`
Uses `multer.diskStorage` to temporarily save uploaded files (e.g., NGO registration documents) into `./public/temp` before Cloudinary upload.

---

### 4.3 Database Models Breakdown

1. **`donor.model.js`**: `name`, `email`, `password`, `phone`, `address`, `location` ({lat, lng}), `socketId`, `role` ("donor"), `typeOfDonor` ("Restaurant" | "Event" | "Store" | "Individual").
2. **`ngo.model.js`**: `name`, `email`, `password`, `phone`, `address`, `location` ({lat, lng}), `registrationNumber`, `certificateUrl`, `isApproved` (Boolean, defaults `false`), `socketId`, `role` ("ngo").
3. **`delivery.model.js`**: `name`, `email`, `password`, `phone`, `address`, `latitude`, `longitude`, `homeLatitude`, `homeLongitude` (prevents GPS overwrite of static home base), `vehicleType`, `points`, `earnings`, `totalDeliveries`, `rating`, `socketId`, `role` ("delivery").
4. **`partner.model.js`**: `restaurantName`, `email`, `password`, `phone`, `address`, `latitude`, `longitude`, `points`, `role` ("partner").
5. **`donation.model.js`**: `donorId`, `foodType`, `quantity`, `weightKg`, `servesPeople`, `pickupLocation`, `latitude`, `longitude`, `expiryDate`, `expiryTime`, `status` ("Pending" | "Accepted" | "Completed" | "Cancelled"), `acceptedBy` (NGO ID).
6. **`ride.model.js`**: `donationId`, `donorId`, `ngoId`, `riderId`, `pickupLocation`, `deliveryLocation`, `status` ("accepted" | "picked up" | "completed"), `distanceKm`, `durationMin`, `pointsEarned`, `riderRating`.
7. **`redemption.model.js`**: `partnerId`, `rewardName`, `pointsSpent`, `status` ("Redeemed").
8. **`otp.model.js`**: `email`, `otp` (hashed), `expiresAt`, `used` (Boolean).

---

### 4.4 Complete Controller Layer Breakdown

- **`Donor.controller.js`**: Donor signup, login, profile management, stats overview.
- **`ngo.controller.js`**: NGO registration with document upload, authentication, approval status check.
- **`Donation.controller.js`**: Create donation, view active donations, cancel donation.
- **`Receiver.controller.js`**: Atomic donation acceptance (`findOneAndUpdate`), view claimed donations, mark received.
- **`Rider.controller.js`**: Delivery signup, login, view available rides (filtered by 20km Haversine distance), accept ride, update delivery status (picked up / completed), view earnings & points.
- **`Delivery.controller.js`**: Rider profile updates, vehicle details, location management.
- **`partner.controller.js`**: Restaurant partner auth, points overview, redeem points for rewards via `Redemption` model.
- **`admin.controller.js`**: Admin dashboard analytics, list pending NGOs, approve/reject NGO verification.
- **`forgot.controller.js`**: Request password reset OTP, verify OTP, update password.
- **`healthcheck.controller.js`**: Returns system status, DB state, and uptime.
- **`track.controller.js`**: `getTrackSnapshot(rideId)` returns ride details, donor location, NGO location, current rider coordinates for live map view.

---

### 4.5 REST API Routes Matrix

| Endpoint | Method | Middleware | Description |
|---|---|---|---|
| `/healthcheck` | `GET` | None | API health status check |
| `/donor/register` | `POST` | AuthLimiter | Register a new Donor |
| `/donor/login` | `POST` | AuthLimiter | Login Donor & issue JWT |
| `/ngo/register` | `POST` | `upload.single('certificate')` | Register NGO with PDF upload |
| `/ngo/login` | `POST` | AuthLimiter | Login NGO |
| `/donation/create` | `POST` | `authDonor` | Post food donation |
| `/donation/my-donations` | `GET` | `authDonor` | Fetch donor's created donations |
| `/receiver/accept-donation` | `POST` | `authNgo` | Atomic donation acceptance |
| `/rider/available-rides` | `GET` | `authPartner` | Fetch available rides within 20km |
| `/rider/accept-ride` | `POST` | `authPartner` | Accept a delivery ride |
| `/rider/complete-ride` | `POST` | `authPartner` | Complete ride & award points |
| `/partner/redeem` | `POST` | `authRestaurant` | Redeem earned partner points |
| `/admin/approve-ngo/:id` | `POST` | `adminAuth` | Admin approves NGO registration |
| `/track/:rideId` | `GET` | None | Get live ride tracking snapshot |

---

### 4.6 Socket.IO Real-Time Engine & Live Tracking

#### 📄 `backend/src/socket.js`
- **Connection Setup**: Configures CORS for `process.env.FRONTEND_URL`.
- **`join` Event**: Binds `socket.id` to user document in DB and joins room (`donor`, `ngo`, or `delivery`).
- **`joinRide` / `leaveRide`**: Joins/leaves per-ride tracking room (`ride:<rideId>`).
- **`updateRiderLocation`**: Receives rider GPS coordinates `{ latitude, longitude }`, queries active ride, and relays coordinates to room `ride:<rideId>` as `riderLocation` event.
- **Helper Broadcast Methods**:
  - `sendMessageToSocketId(socketId, message)`
  - `broadcastToUserType(userType, message)`
  - `broadcastToRide(rideId, message)`

---

### 4.7 Backend Utility & Helper Modules

- **`haversine.js`**: Computes standard great-circle distance between two GPS coordinates $(\text{lat}_1, \text{lng}_1)$ and $(\text{lat}_2, \text{lng}_2)$ in kilometers:
  $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lng}}{2}\right)}\right)$$
- **`expiryCleanup.js`**: Background cron script that automatically marks unaccepted donations as `Cancelled` once `expiryDate` passes.
- **`cloudinary.js`**: Uploads local temp files from `./public/temp` to Cloudinary storage and removes local temp file.
- **`apiError.js` & `apiResponse.js`**: Standardized JSON response format (`ApiResponse(statusCode, data, message)`) and operational error handler (`ApiError`).

---

## 5. Exhaustive Frontend Architecture (`frontend/`)

### 5.1 Context Providers & State Management
- **`AppContext.jsx`**: Global authentication state (`user`, `token`, `role`, `backendurl`). Persists JWT in `localStorage`.
- **`SocketContext.jsx`**: Manages real-time Socket.IO client instance. Automatically connects when `token` is present in `AppContext` and emits `join` event.

### 5.2 Flow Design System & Color Pipelines
Defined in `src/index.css` via Tailwind 4 `@theme` tokens:
- 🟡 **Donor (Amber)**: `#f59e0b` (`--color-donor`)
- 🟢 **NGO (Emerald)**: `#10b981` (`--color-ngo`)
- 🔵 **Rider (Teal)**: `#14b8a6` (`--color-rider`)
- 🟣 **Partner (Indigo)**: `#6366f1` (`--color-partner`)
- 🔴 **Urgent (Red)**: `#ef4444` (`--color-urgent`)

---

## 6. Chatbot Backend: RAG Microservice (`chatbot-backend/`)

*(See complete 50-page deep-dive report at [docs/chatbot/chatbot-backend-report.md](file:///c:/Projects/Sahaaya/docs/chatbot/chatbot-backend-report.md))*

- **Embeddings**: Uses `@xenova/transformers` ONNX execution for 384-dimensional `all-MiniLM-L6-v2` dense vectors.
- **Chunking**: Heading-aware recursive text splitter ($500$ chars + $50$ overlap).
- **Reranking**: Maximal Marginal Relevance (MMR) equation balancing relevance ($\lambda = 0.6$) against diversity.
- **Streaming**: Server-Sent Events (`text/event-stream`) streaming tokens from Ollama Mistral LLM.

---

## 7. 52 Technical Interview Questions & Exhaustive Solutions

---

### Section A: Express 5, Node.js & REST API Design (Q1 - Q10)

#### Q1: What are the main breaking changes in Express 5 compared to Express 4, and how does Sahaaya benefit from them?
**Answer:**
Express 5 automatically handles rejected promises in asynchronous route handlers. In Express 4, unhandled promise rejections inside `async` route handlers would hang the request or crash the process unless explicitly wrapped in `try/catch` or passed to `next(err)`. In Express 5, rejected promises automatically forward to Express's central error middleware. Sahaaya uses `asyncHandler` alongside Express 5's native promise handling for clean error management.

#### Q2: Explain the architecture of custom middleware chaining in `auth.middleware.js`.
**Answer:**
```javascript
export const authDonor = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshtoken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Unauthorized request");
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const donor = await Donor.findById(decodedToken?._id).select("-password");
  if (!donor) throw new ApiError(401, "Invalid Access Token");
  req.donor = donor;
  next();
});
```
It extracts JWT from cookies or headers, verifies the signature, queries MongoDB for the donor (excluding the password hash via `.select("-password")`), attaches the donor instance to `req.donor`, and calls `next()` to yield control to the downstream controller.

#### Q3: How does `asyncHandler` in `utils/asyncHandler.js` prevent unhandled promise rejections?
**Answer:**
```javascript
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
```
It wraps any asynchronous request handler function in a `Promise.resolve()`. If the handler throws an error or rejects a promise, `.catch((err) => next(err))` catches it and passes it directly to Express's error handling middleware.

#### Q4: Why is `express.json({ limit: "16kb" })` configured in `app.js`?
**Answer:**
Setting a strict body size limit (16 Kilobytes) prevents malicious clients from launching Denial of Service (DoS) memory exhaustion attacks by transmitting megabyte-sized JSON strings to standard REST endpoints.

#### Q5: Explain the difference between `req.params`, `req.query`, and `req.body` in Express.
**Answer:**
- `req.params`: Captures route parameters declared in the path pattern (e.g., `/track/:rideId` $\rightarrow$ `req.params.rideId`).
- `req.query`: Captures URL query string parameters (e.g., `/rider/available-rides?lat=19.07&lng=72.87` $\rightarrow$ `req.query.lat`).
- `req.body`: Captures the parsed JSON or URL-encoded payload sent in the HTTP request body.

#### Q6: How does `helmet()` protect Express 5 applications?
**Answer:**
`helmet()` sets critical HTTP security headers:
- `X-DNS-Prefetch-Control`: Disables browser DNS prefetching.
- `X-Frame-Options`: Sets `SAMEORIGIN` to prevent clickjacking in `iframe` elements.
- `Strict-Transport-Security` (HSTS): Forces HTTPS connections.
- `X-Content-Type-Options`: Prevents MIME-type sniffing.

#### Q7: What is the purpose of `cookieParser()` middleware in Sahaaya?
**Answer:**
`cookieParser()` parses HTTP `Cookie` request headers and populates `req.cookies` with an object keyed by cookie names. This allows the backend to securely extract HTTP-only JWT refresh tokens (`refreshtoken`).

#### Q8: How does rate limiting work in `app.js` using `express-rate-limit`?
**Answer:**
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
});
```
It maintains an in-memory counter of requests per client IP address over a sliding 15-minute window (`windowMs`). If an IP exceeds 1,000 requests, it returns HTTP 429 ("Too Many Requests").

#### Q9: How does `expiryCleanup.js` maintain database hygiene for expired donations?
**Answer:**
`expiryCleanup.js` runs a periodic background job that executes a bulk update:
```javascript
await Donation.updateMany(
  { status: "Pending", expiryDate: { $lt: new Date() } },
  { $set: { status: "Cancelled" } }
);
```
This automatically transitions unaccepted donations past their shelf-life to `Cancelled`.

#### Q10: How does Multer handle file uploads before Cloudinary processing in `multer.middleware.js`?
**Answer:**
Multer intercepts `multipart/form-data` requests, streams incoming binary file streams onto the local disk at `./public/temp`, and attaches file metadata to `req.file`. Once saved, `cloudinary.js` uploads the local file to Cloudinary and deletes the temporary local file via `fs.unlinkSync()`.

---

### Section B: MongoDB, Mongoose & Concurrency Protection (Q11 - Q20)

#### Q11: Explain how Sahaaya prevents double-claiming race conditions during donation acceptance.
**Answer:**
Sahaaya uses single-document atomic update operations in Mongoose (`findOneAndUpdate`):
```javascript
const updatedDonation = await Donation.findOneAndUpdate(
  { _id: donationId, status: "Pending" }, // Filter guarantees status hasn't changed
  { status: "Accepted", acceptedBy: ngoId },
  { new: true }
);

if (!updatedDonation) {
  throw new ApiError(400, "Donation has already been accepted by another NGO");
}
```
MongoDB acquires an exclusive write lock on the document. If two NGOs hit the endpoint simultaneously, MongoDB processes writes sequentially. The second request fails the `{ status: "Pending" }` filter and returns `null`.

#### Q12: Why is `.lean()` used in read-heavy queries like `track.controller.js`?
**Answer:**
By default, Mongoose queries return full Mongoose Document instances complete with internal state, change tracking, and virtual getters/setters. Calling `.lean()` instructs Mongoose to return plain JavaScript objects, reducing CPU overhead and memory footprint by up to 10x.

#### Q13: Explain the difference between `homeLatitude` and `latitude` in `delivery.model.js`.
**Answer:**
`homeLatitude` stores the permanent home base coordinates of the delivery rider. `latitude` stores the dynamic, live-updated GPS coordinate transmitted during active rides. Separating these fields prevents live GPS updates from overwriting the rider's home address record.

#### Q14: How are Mongoose Schema Indexes used to optimize location-based spatial queries?
**Answer:**
Spatial queries (e.g., finding riders near a pickup point) use 2DSphere indexes:
```javascript
location: {
  type: { type: String, default: "Point" },
  coordinates: [Number] // [longitude, latitude]
}
donorSchema.index({ location: "2dsphere" });
```
This enables $O(\log N)$ spatial indexing via B-Trees/R-Trees using Mongoose `$near` or `$geoWithin` operators.

#### Q15: What is the purpose of `.select("-password")` in Mongoose queries?
**Answer:**
It explicitly excludes the bcrypt password hash field from the returned projection, preventing accidental leakage of sensitive credentials in API JSON responses.

#### Q16: How does Mongoose handle schema validation for Enum fields in `donation.model.js`?
**Answer:**
```javascript
status: {
  type: String,
  enum: ["Pending", "Accepted", "Completed", "Cancelled"],
  default: "Pending"
}
```
Mongoose validates input strings before persisting write operations. If a client attempts to save `status: "Invalid"`, Mongoose throws a `ValidationError`.

#### Q17: What are Mongoose Virtuals and how could they be used for distance calculations?
**Answer:**
Virtuals are document properties that can be get/set but are not persisted to MongoDB. For example, a virtual `fullName` can concatenate `firstName + " " + lastName` dynamically at runtime without taking up database storage.

#### Q18: How does Mongoose manage connection pooling in `db/index.js`?
**Answer:**
`mongoose.connect()` initializes an internal driver connection pool (defaulting to 10 max sockets). Concurrent database operations reuse existing open TCP sockets from the connection pool rather than opening new connections per HTTP request.

#### Q19: Explain the structural difference between embedding documents vs referencing documents in Mongoose.
**Answer:**
- **Embedding**: Storing child data directly inside parent document arrays (e.g., storing delivery updates directly inside a `Ride` document). Fast read performance, but document size is capped at 16MB.
- **Referencing**: Storing `ObjectId` references (e.g., `donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" }`). Normalizes data and uses `.populate()` to join documents.

#### Q20: What is the purpose of `{ timestamps: true }` in Mongoose schemas?
**Answer:**
Passing `{ timestamps: true }` into a Mongoose Schema automatically creates and updates two `Date` fields: `createdAt` (set once on creation) and `updatedAt` (updated on every document write).

---

### Section C: Socket.IO WebSockets & Live GPS Engine (Q21 - Q30)

#### Q21: Explain how Socket.IO Rooms are used in Sahaaya to isolate event broadcasting.
**Answer:**
Socket.IO rooms are server-side channels. When users authenticate, they call `socket.join("ngo")` or `socket.join("ride:RIDE_ID")`. When broadcasting, the server targets specific rooms:
```javascript
io.to(`ride:${rideId}`).emit("riderLocation", data);
```
This ensures location coordinates are delivered exclusively to clients viewing that specific ride, avoiding global socket spam.

#### Q22: What is the difference between `socket.emit`, `io.to().emit`, and `socket.broadcast.emit`?
**Answer:**
- `socket.emit`: Sends message back exclusively to the individual connected socket client.
- `io.to(room).emit`: Sends message to ALL sockets joined inside a specified room (including sender if present).
- `socket.broadcast.emit`: Sends message to all connected sockets EXCEPT the socket originating the event.

#### Q23: How does Sahaaya achieve smooth marker movement on live map tracking views?
**Answer:**
Instead of snapping the marker instantly when a GPS event arrives every 8s, the frontend uses `requestAnimationFrame` (RAF) linear interpolation (LERP):

$$\text{pos}_{\text{new}} = \text{pos}_{\text{current}} + (\text{pos}_{\text{target}} - \text{pos}_{\text{current}}) \times \alpha$$

This smoothly animates the rider marker across intermediate map coordinates between socket updates.

#### Q24: How does `socket.js` store and maintain socket mappings in MongoDB?
**Answer:**
When a client joins (`socket.on("join")`), the server updates the respective user document with the socket's unique identifier (`socket.id`):
```javascript
await Delivery.findByIdAndUpdate(userId, { socketId: socket.id });
```
This enables targeted direct messaging via `sendMessageToSocketId(socketId, message)`.

#### Q25: How does Socket.IO handle automatic transport fallback (WebSockets vs Long Polling)?
**Answer:**
Socket.IO begins connections using HTTP Long Polling to establish immediate compatibility across restrictive firewalls and proxies. Once connected, it attempts an inline upgrade to a full-duplex WebSocket connection over the same TCP socket.

#### Q26: What happens to Socket.IO rooms when a socket disconnects?
**Answer:**
When a client disconnects, Socket.IO automatically removes the `socket.id` from all joined rooms (`donor`, `ngo`, `delivery`, `ride:<rideId>`) and fires the server-side `"disconnect"` event handler.

#### Q27: How does `haversine.js` filter delivery rides within a 20km radius for riders?
**Answer:**
When a rider requests available deliveries (`GET /rider/available-rides`), the controller fetches `Pending` donations, calculates the Haversine distance between the rider's home/current coordinates and the pickup location, and filters out donations exceeding 20 kilometers:
```javascript
const distance = haversineDistance(riderLat, riderLng, donationLat, donationLng);
if (distance <= 20) eligibleRides.push(donation);
```

#### Q28: How does `broadcastToUserType` emit real-time donation alerts to NGOs?
**Answer:**
NGO clients join room `"ngo"` upon login. When a donor posts a donation, the server calls:
```javascript
broadcastToUserType("ngo", { event: "newDonation", data: newDonation });
```
This broadcasts the payload to every socket in room `"ngo"`, triggering live toast notifications on NGO dashboards without requiring page reloads.

#### Q29: What is Socket.IO heartbeating and ping/pong timing?
**Answer:**
Socket.IO maintains connection state by periodically sending `ping` packets from server to client. The client responds with `pong`. If the server fails to receive a `pong` within `pingTimeout` (default 20s), it assumes network failure and closes the socket connection.

#### Q30: How does Sahaaya prevent memory leaks in Socket.IO listeners on the React frontend?
**Answer:**
In React components (e.g., `TrackOrder.jsx`), socket listeners are bound inside `useEffect` and cleaned up in the return teardown function:
```javascript
useEffect(() => {
  socket.on("riderLocation", handleLocationUpdate);
  return () => {
    socket.off("riderLocation", handleLocationUpdate);
  };
}, [socket]);
```
This unbinds listeners when components unmount, preventing duplicate event triggers.

---

### Section D: React 19, Context & Flow UI Architecture (Q31 - Q40)

#### Q31: How does `AppContext.jsx` manage persistent authentication state?
**Answer:**
`AppContext.jsx` initializes `token` and `user` state from `localStorage`. It exposes setter functions that sync updates to both React state and `localStorage`, ensuring auth sessions persist across browser refreshes.

#### Q32: What is the Flow UI Design System color pipeline hierarchy?
**Answer:**
Role colors are semantic pipeline indicators:
- Donor = Amber (`#f59e0b`): Pickup origin.
- NGO = Emerald (`#10b981`): Receipt & redistribution destination.
- Rider = Teal (`#14b8a6`): Logistics transport.
- Partner = Indigo (`#6366f1`): Restaurant rewards ecosystem.
- Urgent = Red (`#ef4444`): Imminent food expiration.

#### Q33: How does `SocketContext.jsx` conditionally initialize socket connections?
**Answer:**
`SocketContext.jsx` consumes `token` and `backendurl` from `AppContext`. It initializes the `io(backendurl)` connection only when `token` is non-null, passing JWT headers for connection handshake security.

#### Q34: What is the purpose of `CountUp.jsx` in the Flow UI component library?
**Answer:**
`CountUp.jsx` uses an `IntersectionObserver` to detect when a stat card scrolls into the browser viewport. It then uses `requestAnimationFrame` to animate counter numbers smoothly from 0 to the target value.

#### Q35: Explain how `DonationCard.jsx` adapts styling dynamically based on the `tone` prop.
**Answer:**
`DonationCard.jsx` accepts a `tone` prop ("donor" | "ngo" | "rider"). It dynamically maps CSS class names (`role-donor`, `role-ngo`, `role-rider`), setting the left accent border color and action buttons to match the role design system.

#### Q36: How does `react-router-dom` handle dynamic URL parameters in `TrackOrder.jsx`?
**Answer:**
`TrackOrder.jsx` uses the `useParams()` hook (`const { rideId } = useParams()`) to extract `rideId` from the route path `/track/:rideId`, triggering an API fetch for ride tracking metadata.

#### Q37: What is the advantage of using Tailwind CSS 4 `@theme` configuration in `index.css`?
**Answer:**
Tailwind CSS 4 `@theme` directives compile design tokens into standard CSS variables (e.g., `--color-donor: #f59e0b`) at build time. This provides auto-generated utility classes (`bg-donor`, `text-ngo`) while making CSS variables accessible for inline JSX style calculations.

#### Q38: How does `loadGoogleMaps.js` prevent duplicate Google Maps script tag injections?
**Answer:**
`loadGoogleMaps.js` maintains a global loading Promise reference. If `window.google` already exists or the script tag is present in document head, it returns the existing Promise rather than appending duplicate `<script>` tags.

#### Q39: What is React 19's Server Components / Actions model and how does Sahaaya structure client state?
**Answer:**
Sahaaya operates as a Single-Page Application (SPA) powered by Vite and React 19 client components. Global application state is managed via React Context (`AppContext`, `SocketContext`), and server communication is handled via `fetch`/`axios` REST calls.

#### Q40: How does `SidebarD.jsx` enforce navigation state and active tab indicators?
**Answer:**
It uses `react-router-dom`'s `useLocation()` hook to read current URL path string, applying active Flow UI styling (`.flow-tile-active`) to the corresponding sidebar navigation item.

---

### Section E: AI, Vector Math, RAG & LLM Streaming (Q41 - Q52)

*(Detailed coverage of Q41 - Q52 is documented in [docs/chatbot/chatbot-backend-report.md](file:///c:/Projects/Sahaaya/docs/chatbot/chatbot-backend-report.md))*

#### Q41: What is a Dense Vector Embedding and what do its 384 dimensions represent?
**Answer:** An array of 384 floats representing text in a continuous latent semantic feature space generated by `all-MiniLM-L6-v2`.

#### Q42: Why does L2 Normalization reduce Cosine Similarity to a Dot Product?
**Answer:** Because $\|\vec{A}\| = 1$ and $\|\vec{B}\| = 1$, eliminating square root denominators in $\frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|}$.

#### Q43: What is the Maximal Marginal Relevance (MMR) equation?
**Answer:** $\text{MMR} = \arg\max \left[ \lambda \text{Sim}_1(D_i, Q) - (1 - \lambda) \max \text{Sim}_2(D_i, D_j) \right]$. It balances relevance against candidate redundancy.

#### Q44: How does `vectorStore.js` execute heading-aware text chunking?
**Answer:** It splits text recursively by markdown headers, paragraphs, lines, and sentences while attaching section title metadata to child chunks.

#### Q45: How does `vectorStore.js` verify cache validity on server boot?
**Answer:** MD5 hashes of all `.txt` knowledge files are verified against cached hashes stored in `data/vectors.json`.

#### Q46: How does `llm.js` decode streaming JSON chunks from local Ollama LLM?
**Answer:** Uses `ReadableStream` reader with `TextDecoder` to parse incoming JSON buffer chunks line-by-line.

#### Q47: How does `chatbot.controller.js` stream responses over Server-Sent Events (SSE)?
**Answer:** Writes HTTP headers `200 text/event-stream`, emitting `event: meta`, `event: token`, and `event: done` streams.

#### Q48: How does the chatbot handle offline LLM services gracefully?
**Answer:** Falls back to `formatChunksAsAnswer(chunks)`, formatting retrieved vector chunks into structured markdown bullet points with document citations.

#### Q49: How does `sessionTtlMs` prevent memory leaks in the chatbot session Map?
**Answer:** A background interval runs every 5 minutes, purging sessions inactive for longer than 30 minutes.

#### Q50: What is the difference between RAG and Model Fine-Tuning?
**Answer:** RAG provides dynamic context retrieval at runtime without modifying model weights. Fine-tuning updates weight matrices permanently but cannot keep up with real-time data changes.

#### Q51: What is HyDE (Hypothetical Document Embeddings)?
**Answer:** Generates a synthetic answer using LLM first, embeds the answer, and performs vector search against the document index.

#### Q52: What are the 4 metrics of the RAGAS framework?
**Answer:** Faithfulness, Answer Relevance, Context Precision, and Context Recall.

---

## 8. Setup, Execution & Environment Variables

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB or MongoDB Atlas Cluster
- **Ollama (Optional)**: Install from [ollama.ai](https://ollama.ai) (`ollama pull mistral`)

### 2. Running Services

```bash
# Terminal 1: Core REST API & Socket Backend
cd backend
npm install
npm run dev

# Terminal 2: Chatbot RAG Microservice
cd chatbot-backend
npm install
npm run dev

# Terminal 3: Main React Frontend
cd frontend
npm install
npm run dev
```

---
*Maintained by Team Sahaaya.*
