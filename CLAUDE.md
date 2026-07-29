# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Sahaaya

Food donation platform: **Donors** (restaurants/events/stores/individuals) → **NGOs** (receive & redistribute) → **Delivery Partners** (riders transport food). Third actor: **Partner** (restaurant partner, separate from Delivery — earns + redeems points).

Stack: React 19 + Vite + Tailwind 4 frontend · Express 5 + Mongoose + Socket.IO backend · MongoDB.

**Flow UI direction chosen** — kinetic donor→NGO→rider pipeline (see `docs/plans/2026-07-28-flow-ui-revamp.md`). Phased UI-only rollout in progress.

## Commands

```bash
# Backend (./backend)
npm run dev             # nodemon + dotenv → src/index.js
npm start               # production
npm test                # Jest (--runInBand --detectOpenHandles --forceExit)
npm run test:watch      # Jest watch mode
npm run backfill:partners  # geocode partner coords (dry-run; add -- --write to persist)

# Frontend (./frontend)
npm run dev             # Vite dev server
npm run build           # production build
npm run lint            # ESLint
npm run preview         # Vite preview
```

## Architecture

### Donation Lifecycle

1. **Donor** creates donation → status=`Pending`, socket `newDonation`→NGO room
2. **NGO** accepts → status=`Accepted`, atomic update (concurrency-safe), socket `donationAccepted`→donor
3. **Rider** accepts delivery → `Ride` created (status=`pending`), socket `rideCreated`→delivery room
4. **Rider** picks up → ride status=`picked up`, socket `statusUpdate`→donor+ngo+ride room
5. **Rider** completes delivery → ride status=`completed`, donation status=`Completed`, socket `statusUpdate` + `pointsAwarded`→rider
6. Donor cancels → status=`Cancelled`

### Backend (`backend/src/`)

| Layer | Key files |
|---|---|
| Entry | `index.js` — HTTP server + Socket.IO init + MongoDB connect |
| Express | `app.js` — helmet, rate-limit, CORS (origin `*`), cookie-parser, JSON body, route mounting |
| DB | `db/index.js` — Mongoose connect via `dblink` env var |
| Socket | `socket.js` — `join` (stores socketId per role), `joinRide`/`leaveRide` (per-ride rooms), `updateRiderLocation` relay; `sendMessageToSocketId` (targeted), `broadcastToUserType` (role broadcast), `broadcastToRide` (ride room) |
| Auth | `middleware/auth.middleware.js` — `authDonor`, `authNgo`, `authPartner` (delivery), `authRestaurant` (Partner model), `authAnyParty` (resolves any role from email JWT) |
| Controllers | `controller/` — Donor, ngo, Donation, Receiver (NGO accept flow), Rider, Delivery, partner, admin, forgot, healthcheck, **track** (ride snapshots) |
| Routes | `route/` — one per resource, middleware per-route. **Track:** `GET /track/:rideId` (snapshot), `GET /track/by-donation/:donationId` (ride lookup — declared before `:rideId`) |
| Models | `model/` — donor, ngo, donation, delivery, ride, partner, redemption, otp |

**Key models:**
- **Donation** — links `Donor`+`NGO`, FoodType (enum: Cooked Meals/Fresh Vegetables/...), Quantity/weightKg/serves, PickupLocation+lat/lng, ExpiryDate+Time, Status (Pending/Accepted/Completed/Cancelled), typeOfDonor (Restaurant/Event/Store/Individual)
- **Ride** — links Donor+NGO+Donation+Rider, pickup+destination, status (pending/accepted/picked up/completed), distance+duration, points, riderRating (0-5)
- **Delivery** (delivery partner / rider) — email, password, phone, address, lat/lng + homeLatitude/homeLongitude (separate to avoid GPS overwrite), socketId, role, points, earnings, totalDeliveries, vehicleType
- **Partner** (restaurant partner) — separate from Delivery, earns points redeemable for rewards
- **Redemption** — partnerId, points used, reward claimed
- **OTP** — email, otp, expiresAt, used flag

### Frontend (`frontend/src/`)

```
src/
  main.jsx             # ReactDOM root + AppContextProvider + SocketProvider wrapping App
  App.jsx              # Routes + ToastContainer + ScrollToTop + ChatPanel (persistent)
  context/
    AppContext.jsx      # Role, token, backendurl state (from localStorage + env var)
    SocketContext.jsx   # Socket.IO client connection (auto-connects when token present)
  pages/                # 15 pages — Home, 4 Registers, Login, Role, 4 Dashboards, ForgotPassword, TrackOrder
  components/           # Dashboard components + Navbar/Footer + ChatPanel + flow/ (design primitives)
  utils/                # formatDonation.js, haversine.js (coordinate distance), loadGoogleMaps.js
```

**Routing:** `react-router-dom` — `/`, `/Registration-{Ngo|Donor|Rider|Partner}`, `/Login`, `/Role`, `/{Ngo|Donor|Rider|Partner}Dashboard`, `/ForgotPassword`, `/track/:rideId`.

**Context providers:** `AppContextProvider` wraps the app; `SocketProvider` reads `AppContext` for `backendurl`+`token` to conditionally connect Socket.IO.

### Chatbot / RAG System

Separate Python/FastAPI service (not in this repo — runs on port 8001). Frontend `ChatPanel.jsx` communicates via SSE at `VITE_CHATBOT_URL`. Full docs at `docs/chatbot-rag-system.md`.

### Real-time Features

**Socket.IO rooms:** `donor`, `ngo`, `delivery` (role rooms) + `ride:<rideId>` (per-ride). Events: `newDonation` (→ngo), `donationAccepted` (→donor), `rideCreated` (→delivery room, filtered by 20 km), `statusUpdate` (→donor+ngo+ride room), `pointsAwarded` (→rider), `riderLocation` (→ride room, 8s GPS emit).

**Live tracking:** `/track/:rideId` page shows pickup (A) + destination (B) pins, Google Directions route + ETA, live-moving rider marker. Rider emits GPS every 8s via socket, DB write every ~32s. RAF-based marker smoothing on viewer.

### Points & Earnings System

- **Delivery partners:** earn points + earnings per delivery. Tracked on `Delivery` doc (points, earnings, totalDeliveries, rating)
- **Restaurant partners (Partner model):** earn points, redeem via `Redemption` model (partnerId, points, reward)
- Points awarded on ride completion via socket `pointsAwarded`

### Concurrency

Donation acceptance and ride operations use atomic MongoDB updates (not find-then-save) to prevent race conditions — a single donation being accepted by multiple NGOs simultaneously.

### File Upload

Multer → `./public/temp` → Cloudinary (via `cloudinary.js` util).

### Security

- Helmet security headers
- Rate limiting: 100 req/15min global, 10 req/15min auth endpoints
- CORS origin `*` with credentials
- JWT from cookies (`refreshtoken`), `Authorization: Bearer`, or request body

### Payments

RazorPay SDK installed (`razorpay` npm package, env vars present). Integration status: verify before assuming active.

### Flow UI Design System

Color tokens in `index.css` `@theme`: `canvas` (#f0f3ee mint), `ink` (#0b1e1a forest), `surface` (#fafcf9), `line` (#dce5dd), `mute` (#8fa89b) + role tokens (donor-amber, NGO-emerald, rider-teal, partner-indigo, people, urgent). Fonts: Inter (body), Space Grotesk (display). Flow primitives in `components/flow/`: `Logo.jsx`, `FlowRibbon.jsx`, `CountUp.jsx`, `LiveChip.jsx`.

## Project conventions

- Plan/design docs go in `docs/plans/` with readable kebab-case names (e.g. `docs/plans/2026-07-15-socket-reconnect.md`). Never under `.claude/`.
- Log meaningful code changes in `docs/project.md` under the Change log table.
- Keep `docs/project.md` Status and Remaining sections current.
- Surgical edits; match existing style. Don't refactor working code or delete pre-existing dead code — flag it instead.
- Ask before touching `.env`, production DB, DNS, or anything irreversible.
- Response format: `ApiResponse(statuscode, data, message)` — `success` is `statuscode < 400`.
- Error handling: `asyncHandler` wraps route handlers; rejections forward to Express error middleware. `ApiError(statuscode, message, errors, stack)` for operational errors.
