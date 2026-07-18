# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Sahaaya

Food donation platform: **Donors** (restaurants/events/stores/individuals) → **NGOs** (receive & redistribute) → **Delivery Partners** (riders transport food).

Stack: React 19 + Vite + Tailwind 4 frontend · Express 5 + Mongoose + Socket.IO backend · MongoDB.

## Commands

```bash
# Backend (./backend)
npm run dev       # nodemon + dotenv → src/index.js
npm start         # production

# Frontend (./frontend)
npm run dev       # Vite dev server
npm run build     # production build
npm run lint      # ESLint
```

## Architecture

**Three user roles** — Donor, NGO, Delivery Partner — each with JWT auth, CRUD routes, and a dashboard. A fourth `Partner` model exists for restaurant partners (separate from Delivery partners).

### Backend (`backend/src/`)

| Layer | Key files |
|---|---|
| Entry | `index.js` — HTTP server + Socket.IO init + MongoDB connect |
| Express | `app.js` — CORS, cookie-parser, JSON body, static files, route mounting |
| DB | `db/index.js` — Mongoose connect via `dblink` env var |
| Socket | `socket.js` — `join` event stores socketId on user doc, joins userType rooms; `sendMessageToSocketId` + `broadcastToUserType` for targeted emits |
| Auth | `middleware/auth.middleware.js` — `authDonor`, `authNgo`, `authPartner`, `authRestaurant` (JWT from cookie/header/body → `req.donor`/`req.Ngo`/`req.partner`) |
| Controllers | `controller/` — one per resource (Donor, ngo, Donation, Receiver, Rider, Delivery, partner, admin, forgot, healthcheck) |
| Routes | `route/` — one per resource, middleware applied per-route |
| Utils | `apiResponse.js` (standard response class), `asyncHandler.js` (promise wrapper), `apiError.js`, `cloudinary.js` |

## Key patterns

- **Auth:** Three JWT middleware variants (`authDonor`, `authNgo`, `authPartner`). Token from cookies (`refreshtoken`), `Authorization: Bearer`, or request body. Decoded email → DB lookup → user on `req.donor`/`req.Ngo`/`req.partner`.
- **Response format:** `ApiResponse(statuscode, data, message)` — `success` is `statuscode < 400`.
- **Error handling:** `asyncHandler` wraps route handlers; rejections forward to Express error middleware.
- **File upload:** Multer → `./public/temp` → Cloudinary.
- **Concurrency:** Donation acceptance and ride ops use atomic MongoDB updates (not find-then-save) to prevent race conditions.
- **Real-time:** Socket.IO — clients `join` with `{userId, userType}`, server stores socketId on user doc. `broadcastToUserType` emits to all users of a role; `sendMessageToSocketId` targets one user.

## Project conventions

- Plan/design docs go in `docs/plans/` with readable kebab-case names (e.g. `docs/plans/2026-07-15-socket-reconnect.md`). Never under `.claude/`.
- Log meaningful code changes in `docs/project.md` under the Change log table.
- Keep `docs/project.md` Status and Remaining sections current.
- Surgical edits; match existing style. Don't refactor working code or delete pre-existing dead code — flag it instead.
- Ask before touching `.env`, production DB, DNS, or anything irreversible.
