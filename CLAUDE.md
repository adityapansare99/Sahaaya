# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Sahaaya

Food donation platform: **Donors** (restaurants/events/stores/individuals) → **NGOs** (receive & redistribute) → **Delivery Partners** (riders transport food). Third actor: **Partner** (restaurant partner, separate from Delivery — earns + redeems points).

Stack: React 19 + Vite + Tailwind 4 frontend · Express 5 + Mongoose + Socket.IO backend · MongoDB.

**Flow UI revamp COMPLETE (all 8 phases shipped)** — every page/component uses the Flow design system: mint canvas (`#e9f1eb`), forest ink (`#0e1f1a`), role-color pipeline (donor-amber → NGO-emerald → rider-teal → partner-indigo → people-rose), Space Grotesk for headings/numbers, Inter for body. See `docs/plans/2026-07-28-flow-ui-revamp.md` for the implementation plan and `docs/design/design-templates.html` for the visual reference. UI-only — no logic changed.

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
  components/
    flow/               # Shared Flow primitives: Logo, FlowRibbon, CountUp, LiveChip, FlowSelect
    SidebarD.jsx        # Donor sidebar
    SidebarR.jsx        # Rider sidebar
    SidebarP.jsx        # Partner sidebar
    Sidebar.jsx         # NGO sidebar
    DonationCard.jsx    # Shared in-flow card (tone prop: donor/ngo/rider)
    TrackOrder.jsx, ChatPanel.jsx, ApprovalPending.jsx  # Shared/cross-cutting
    ...                # Dashboard-specific: CreateDonation, MyDonations, Impact, SettingsD,
                       # FoodRequests, DonationHistory, Analytics, Settings (NGO),
                       # AvailableDeliveries, ActiveDelivery, DeliveryHistory, RewardsSection,
                       # RedeemPoints, ProfileSection (rider),
                       # PartnerOverview, PartnerRedemptions, PartnerProfile
  utils/                # formatDonation.js, haversine.js, loadGoogleMaps.js
```

**Routing:** `react-router-dom` — `/`, `/Registration-{Ngo|Donor|Rider|Partner}`, `/Login`, `/Role`, `/{Ngo|Donor|Rider|Partner}Dashboard`, `/ForgotPassword`, `/track/:rideId`.

**Context providers:** `AppContextProvider` wraps the app; `SocketProvider` reads `AppContext` for `backendurl`+`token` to conditionally connect Socket.IO.

### Chatbot / RAG System

Node.js/Express service **in this repo** at `chatbot-backend/` (port 8001). Embeddings via `@xenova/transformers` (`all-MiniLM-L6-v2`, 384-dim, local/free). LLM is **provider-pluggable**: Groq (production, `GROQ_API_KEY`) or Ollama (local fallback). Vector store is **pluggable**: Chroma (production, `CHROMA_URL`) or a JSON-file cache (`VECTOR_STORE=json`). Frontend `ChatPanel.jsx` communicates via SSE at `VITE_CHATBOT_URL`. Full docs at `docs/chatbot/chatbot-rag-system.md`; deployment guide at `docs/deploy.md`.

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

### Flow UI Design System — key patterns

**Tokens are in `index.css` `@theme` + `:root` aliases.** The `@theme` block generates Tailwind utilities (`bg-canvas`, `text-donor`, `font-display`, etc.). The `:root` block emits bare CSS variable names (`--canvas`, `--donor`, `--rider-rgb`) so inline styles in JSX can use `var(--color-ngo)` or `rgba(var(--ngo-rgb),.12)`.

**Reusable CSS classes** (defined in `index.css`, used across dashboards):
- `.fbtn` / `.fbtn-p` / `.fbtn-flow` — buttons (ink, ghost, gradient)
- `.livechip` — status indicator with pulsing dot
- `.flow-tile` — stat card with hover lift
- `.flow-panel` — large container card (no hover lift)
- `.flow-card` — role-colored left bar card (`.role-donor`, `role-ngo`, `role-rider`)
- `.flow-table` — dense table with row-hover NGO-emerald left-bar
- `.flow-bar` / `.flow-bars` — monthly trend bars (grow on mount)
- `.flow-ach` / `.flow-ach.done` / `.flow-ach.locked` — achievement badges
- `.flow-empty` — dashed empty state (`.ei` icon, `.et` title, `.ed` description)
- `.flow-skel` — skeleton shimmer placeholder
- `.flow-input` — form input with NGO focus ring
- `.flow-route-mini` — A→B micro route (pickup→NGO, hover-advances)
- `.nums` — tabular-nums on all figures

**Pipeline color usage (role colors are semantic, never decorative):**
- Donor (amber) = origin, donor-centric screens
- NGO (emerald) = destination/success, NGO-centric screens
- Rider (teal) = transport, rider-centric screens
- Partner (indigo) = restaurant partner screens
- People (rose) = "people fed" terminus
- Urgent (red, `--urgent`) = the ONLY red — urgency only

**Global type rule** (set in `index.css` base): all `h1`–`h6` + buttons → Space Grotesk (`--font-display`); body + inputs → Inter (`--font-sans`).

Flow primitives in `components/flow/`: `Logo.jsx` (brand wordmark + conic mark), `FlowRibbon.jsx` (donor→NGO→rider→people pipeline), `CountUp.jsx` (animated number, IntersectionObserver), `LiveChip.jsx` (live indicator), `FlowSelect.jsx`.

## Project conventions

- Plan/design docs go in `docs/plans/` with readable kebab-case names (e.g. `docs/plans/2026-07-15-socket-reconnect.md`). Never under `.claude/`.
- Log meaningful code changes in `docs/project.md` under the Change log table.
- Keep `docs/project.md` Status and Remaining sections current.
- Surgical edits; match existing style. Don't refactor working code or delete pre-existing dead code — flag it instead.
- Ask before touching `.env`, production DB, DNS, or anything irreversible.
- Response format: `ApiResponse(statuscode, data, message)` — `success` is `statuscode < 400`.
- Error handling: `asyncHandler` wraps route handlers; rejections forward to Express error middleware. `ApiError(statuscode, message, errors, stack)` for operational errors.
