# 🌐 Sahaaya Primary User Web Application (`frontend`)

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO_Client-4.8.1-010101?style=flat-square&logo=socketdotio)](https://socket.io/)
[![Google Maps](https://img.shields.io/badge/Google_Maps_API-v3-4285F4?style=flat-square&logo=googlemaps)](https://developers.google.com/maps)
[![License](https://img.shields.io/badge/License-MIT-green.style=flat-square)](#license)

> **Multi-Role Real-Time Web Application** for Donors, NGOs, Delivery Partners, and Restaurant Partners. Integrates live WebSocket notifications, sub-100ms atomic donation matching, Google Maps GPS route tracking, gamified impact rewards, and an embedded RAG AI Assistant.

---

## 📋 Table of Contents

- [Overview & User Roles](#-overview--user-roles)
- [Key Features & Role Workflows](#-key-features--role-workflows)
- [Technology Stack](#-technology-stack)
- [Directory Structure](#-directory-structure)
- [State Management Architecture](#-state-management-architecture)
- [Verified Pages Taxonomy & Routing](#-verified-pages-taxonomy--routing)
- [Reusable UI Components Taxonomy](#-reusable-ui-components-taxonomy)
- [Flow Design System & Styling](#-flow-design-system--styling)
- [Live Route Tracking & Map Engine](#-live-route-tracking--map-engine)
- [Environment Variables Master Matrix](#-environment-variables-master-matrix)
- [Setup & Installation Guide](#-setup--installation-guide)

---

## 🔍 Overview & User Roles

The **Sahaaya User Web Application** (`frontend`) is the primary client interface connecting four distinct actors in the food surplus redistribution ecosystem:

```
                          ┌────────────────────────┐
                          │    Sahaaya Web App     │
                          └───────────┬────────────┘
                                      │
          ┌───────────────────┬───────┴───────────┬───────────────────┐
          ▼                   ▼                   ▼                   ▼
  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
  │ 🏢 Food Donor │   │ 🏛️ NGO / Shelter│   │ 🛵 Delivery   │   │ 🍽️ Restaurant │
  │ (Restaurants, │   │ (Claimers &   │   │   Partner     │   │   Partner     │
  │ Caterers, etc)│   │ Distributors) │   │(Food Couriers)│   │(Reward Stores)│
  └───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘
```

---

## ✨ Key Features & Role Workflows

### 1. 🏢 Food Donors
- Post surplus food listings (food type, weight in kg, serving capacity, expiry time, pickup location).
- Receive instant WebSocket audio/visual notifications when an NGO accepts their donation.
- Track delivery partners in real-time on interactive Google Maps.
- View cumulative environmental impact metrics (total donations, completed meals, waste reduced).

### 2. 🏛️ NGOs & Food Shelters
- Real-time push alerts (`newDonation`) whenever food is posted within a 20km radius.
- One-click atomic donation claim (`PUT /receiver/acceptOrder`).
- View claimed orders, track incoming couriers, or mark deliveries received and rate riders (1–5 stars).

### 3. 🛵 Delivery Partners (Couriers)
- Geospatial Haversine filtering: View available rides within a **20km radius** of current or home location.
- Accept rides, mark status (`accepted` $\rightarrow$ `picked up` $\rightarrow$ `completed`).
- Live GPS coordinate streaming during active deliveries (`updateRiderLocation`).
- Earn +10 points per completed delivery and redeem points for partner discount vouchers.

### 4. 🍽️ Restaurant Partners
- Listed on the platform catalog to offer discount rewards to active delivery riders.
- Redeem points, track redemption histories, and view top-performing partner leaderboards.

---

## 🏗️ Technology Stack

| Module | Technology | Selected Version | Purpose |
|---|---|---|---|
| **UI Library** | React | `19.0.0` | Frontend component framework with concurrent rendering |
| **Build Tooling** | Vite | `6.0.0` | Fast HMR engine and production code bundler |
| **CSS System** | Tailwind CSS | `4.0.0` | Utility-first CSS directives and semantic color pipeline |
| **Real-Time Client** | Socket.IO Client | `4.8.1` | Maintains WebSocket persistent connection and event handlers |
| **Mapping Engine** | Google Maps JS API | Native Loader | Interactive map rendering, marker updates & directions |
| **Icons** | Lucide React | `0.475.0` | Accessible vector icon library |
| **Effects** | Canvas Confetti | `1.9.4` | Particle celebration animations upon delivery completion |

---

## 📁 Directory Structure

```
frontend/
├── index.html                  # Main Web Application entrypoint HTML
├── package.json                # Dependencies and execution scripts
├── vite.config.js              # Vite compiler configuration
├── public/                     # Static public images & assets
└── src/
    ├── App.jsx                 # Main application routes & Toast container
    ├── main.jsx                # React 19 root mounting entrypoint
    ├── index.css               # Custom styling and Tailwind rules
    ├── context/                # Global State Providers
    │   ├── AppContext.jsx      # Auth tokens (`token`), role state (`Role`), backendurl
    │   └── SocketContext.jsx   # Socket.IO connection lifecycle (`io(backendurl, { auth: { token } })`)
    ├── pages/                  # 13 Primary Page Views
    │   ├── Home.jsx            # Landing page with interactive hero & metrics
    │   ├── Role.jsx            # Role selection portal
    │   ├── Login.jsx           # Unified multi-role login view
    │   ├── DonorRegistration.jsx   # Food Donor onboarding form
    │   ├── NgoRegistration.jsx     # NGO document upload onboarding
    │   ├── RiderRegistration.jsx   # Delivery Partner onboarding
    │   ├── PartnerRegistration.jsx # Restaurant Partner onboarding
    │   ├── DonorDashboard.jsx      # Donor management hub & post form
    │   ├── NgoDashboard.jsx        # NGO real-time claim feed
    │   ├── RiderDashboard.jsx      # Rider ride dispatcher & tracking
    │   ├── PartnerDashboard.jsx    # Restaurant points & rewards store
    │   ├── TrackOrder.jsx          # Live Google Maps delivery tracker
    │   └── ForgotPassword.jsx      # 3-Step OTP password recovery flow
    ├── components/             # Reusable UI & Flow Components
    │   ├── flow/               # Flow UI design primitives
    │   ├── ActiveDelivery.jsx  # Active delivery tracking card
    │   ├── ChatPanel.jsx       # Floating persistent RAG Chatbot UI
    │   ├── CreateDonation.jsx  # Food donation creation modal
    │   ├── DonationCard.jsx    # Role-aware semantic donation tile
    │   ├── Impact.jsx          # Environmental impact visualization panel
    │   ├── RedeemPoints.jsx    # Partner reward redemption grid
    │   └── SidebarR.jsx        # Responsive navigation sidebar
    └── utils/                  # Utility helpers & Haversine distance calculator
```

---

## 🧠 State Management Architecture

### 1. `AppContext.jsx` ([AppContext.jsx](file:///c:/Projects/Sahaaya/frontend/src/context/AppContext.jsx))
- `token`: Stored in `localStorage("token")`. Passed via `Authorization: Bearer <token>` header or `refreshtoken` cookie.
- `Role`: Active user role stored in `localStorage("role")` (`"Donor" | "Ngo" | "Rider" | "Partner"`).
- `backendurl`: Configured via `import.meta.env.VITE_BACKEND_URL` (default `http://localhost:8000/`).
- `logout()`: Calls `POST ${backendurl}logout` to clear server cookies, then removes local tokens.

### 2. `SocketContext.jsx` ([SocketContext.jsx](file:///c:/Projects/Sahaaya/frontend/src/context/SocketContext.jsx))
- Instantiates Socket.IO connection: `io(backendurl, { auth: { token } })`.
- Handles connection events (`connect`, `disconnect`, `connect_error`).
- Automatically logs out if server emits `unauthorized` error.

---

## 🖥️ Verified Pages Taxonomy & Routing

| Page Component | Path | Access | Role | Description |
|---|---|---|---|---|
| `Home.jsx` | `/` | Public | All | Hero landing page, public stats, mission overview |
| `Role.jsx` | `/role` | Public | All | Role selection hub (Donor / NGO / Rider / Partner) |
| `Login.jsx` | `/login` | Public | All | Login screen for all user roles |
| `DonorRegistration.jsx` | `/register/donor` | Public | Donor | Donor registration with location fields & optional image |
| `NgoRegistration.jsx` | `/register/ngo` | Public | NGO | NGO registration with DailyCapacity & registration details |
| `RiderRegistration.jsx` | `/register/rider` | Public | Rider | Delivery partner registration with vehicle details |
| `PartnerRegistration.jsx` | `/register/partner` | Public | Partner | Restaurant partner onboarding form |
| `DonorDashboard.jsx` | `/donor/dashboard` | Private | Donor | Manage donations, view impact, post new donations |
| `NgoDashboard.jsx` | `/ngo/dashboard` | Private | NGO | Claim pending donations within 20km, view received orders |
| `RiderDashboard.jsx` | `/rider/dashboard` | Private | Rider | View available rides within 20km, manage active deliveries, view rewards |
| `PartnerDashboard.jsx` | `/partner/dashboard` | Private | Partner | Manage partner profile, view redemptions |
| `TrackOrder.jsx` | `/track/:rideId` | Private | Any Party | Live Google Maps route & rider tracking page |
| `ForgotPassword.jsx` | `/forgot-password` | Public | All | 3-step OTP password reset flow |

---

## 🧩 Reusable UI Components Taxonomy

- **`CreateDonation.jsx`**: Modal form to submit donation details (`donorType`, `foodType`, `description`, `pickup`, `expiryDate`, `expiryTime`, `weightKg`, `serves`, `pickupLatitude`, `pickupLongitude`).
- **`DonationCard.jsx`**: Adaptive card displaying food details, remaining expiry time, distance in km, and action buttons.
- **`ActiveDelivery.jsx`**: Persistent tracking card displaying current ride status (`accepted` $\rightarrow$ `picked up` $\rightarrow$ `completed`).
- **`ChatPanel.jsx`**: Floating chat panel connecting to `chatbot-backend` (`VITE_CHATBOT_API_URL` or `http://localhost:8001/chat`). Sends `{ question, sessionId }` and renders SSE text stream tokens.
- **`RedeemPoints.jsx`**: Reward catalog for riders to redeem points for partner discount vouchers.
- **`Impact.jsx`**: Impact visualization panel displaying total meals donated, food waste reduced (kg), and active NGO connections.

---

## 🎨 Flow Design System & Styling

Sahaaya uses semantic color indicators across roles:

| Role | Color Theme |
|---|---|
| **🏢 Food Donor** | Amber / Orange |
| **🏛️ NGO / Shelter** | Emerald / Green |
| **🛵 Delivery Partner** | Electric Blue |
| **🍽️ Restaurant Partner** | Deep Violet |

---

## 🗺️ Live Route Tracking & Map Engine

Implemented in `TrackOrder.jsx`:
1. Fetches tracking snapshot from `GET /track/:rideId`.
2. Connects to socket room `ride:<rideId>` by emitting `joinRide`.
3. Receives real-time `riderLocation` socket broadcasts containing updated `{ latitude, longitude }`.
4. Renders interactive markers for pickup, destination, and live rider position on Google Maps.

---

## ⚙️ Environment Variables Master Matrix

Create a `.env` file in the root of `frontend/`:

```env
# Core Backend Base URL (ending without trailing slash)
VITE_BACKEND_URL=http://localhost:8000

# RAG AI Chatbot Microservice Base URL
VITE_CHATBOT_API_URL=http://localhost:8001

# Google Maps API Key for Live Tracking
VITE_GOOGLE_MAPS_API_KEY=AIzaSyYourGoogleMapsApiKeyHere
```

---

## 🚀 Setup & Installation Guide

### Prerequisites
- **Node.js**: `v18.x+`
- **npm**: `v9.x+`

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
App starts on `http://localhost:5173`.

### 3. Build Production Bundle
```bash
npm run build
```

---
