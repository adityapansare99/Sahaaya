# 🛡️ Sahaaya Admin Management Console (`admin-frontend`)

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.style=flat-square)](#license)

> **Enterprise Administrative Dashboard & Moderation Engine** for the Sahaaya Real-Time Surplus Food Redistribution Platform. Provides system administrators and operations teams with auditability, NGO verification workflows, platform-wide metrics, and multi-entity governance tools.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Directory Structure](#-directory-structure)
- [Pages & Routing Map](#-pages--routing-map)
- [Verified API Integration Matrix](#-verified-api-integration-matrix)
- [Environment Variables](#-environment-variables)
- [Getting Started & Installation](#-getting-started--installation)
- [Security & Authentication Flow](#-security--authentication-flow)

---

## 🔍 Overview

The **Sahaaya Admin Management Console** (`admin-frontend`) is a lightweight, high-performance web dashboard built specifically for system operators to govern and monitor the Sahaaya food redistribution ecosystem.

While the primary user portal handles donor, NGO, rider, and partner workflows, the Admin Console handles **platform oversight**:
1. **Verification Governance**: Reviewing official document registrations for non-profit entities before granting platform broadcast access.
2. **User Moderation**: Granting, restricting, or revoking accounts across Donors, NGOs, Delivery Partners, and Restaurant Partners.
3. **Logistics Oversight**: Monitoring active and historic food donations and delivery rides with real-time status tracking.
4. **Analytics & Impact Audit**: Real-time aggregate dashboards showing total surplus food rescued, meals served, active rides, and user engagement metrics.

---

## ✨ Key Features

- **🔐 Secured Admin Authentication**: Dedicated JWT admin session management with protected router guards.
- **📄 NGO Certificate Verification**: Inspect submitted credentials and registration numbers for non-governmental organizations before approving their platform status (`approved`).
- **📊 Real-Time Metrics & Analytics**: Platform health overview showing active user counts, total rescued food (in kg), completed rides, and system throughput.
- **👥 Multi-Entity Governance**:
  - **NGO Management**: Approve, suspend, or delete registered shelters and food banks.
  - **Donor Management**: Overview of registered restaurants, caterers, grocery chains, and individual donors.
  - **Delivery Partner Management**: Review active riders, vehicle details, ratings, total deliveries, and points.
  - **Restaurant Partner Management**: Monitor food business partners earning and redeeming impact rewards.
- **📦 Donation & Ride Monitoring**: Filterable tabular views of all donations (`Pending`, `Accepted`, `Completed`, `Cancelled`) and delivery rides (`pending`, `accepted`, `picked up`, `completed`) with full metadata inspection.

---

## 🏗️ System Architecture & Tech Stack

### Core Technologies

| Module | Technology | Version | Purpose |
|---|---|---|---|
| **UI Library** | React | `19.0.0` | Declarative, component-based user interface |
| **Build Engine** | Vite | `6.0.0` | Ultra-fast development HMR and optimized ES module bundler |
| **Styling** | Tailwind CSS | `4.0.0` | Utility-first CSS framework with custom design tokens |
| **Routing** | React Router DOM | `7.1.5` | Client-side routing and protected route management |
| **Icons** | Lucide React | `0.475.0` | Consistent, accessible iconography |
| **HTTP Client** | Fetch API | Native | Asynchronous REST communication with backend gateway |

---

## 📁 Directory Structure

```
admin-frontend/
├── index.html              # HTML5 entrypoint template
├── package.json            # Dependencies & build scripts
├── vite.config.js          # Vite compiler configuration
├── public/                 # Static public assets & icons
└── src/
    ├── App.jsx             # Top-level routing & protected route wrappers
    ├── main.jsx            # React 19 root mounting file
    ├── index.css           # Custom Tailwind styles and utility classes
    ├── context/            # Admin Auth & Global State
    │   └── AdminContext.jsx # Admin JWT token (`admintoken`) & session state
    ├── components/         # Reusable Admin UI components
    │   ├── Sidebar.jsx     # Navigation sidebar component
    │   ├── Navbar.jsx      # Top navigation header with profile actions
    │   └── StatCard.jsx    # Metric display tile component
    └── pages/              # Primary Admin Page Views
        ├── Login.jsx       # Admin Login view (`/`)
        ├── Dashboard.jsx   # Main KPI & analytics overview (`/home`)
        ├── NGOs.jsx        # NGO verification & approval portal (`/ngos`)
        ├── Donors.jsx      # Donor management list (`/donors`)
        ├── DeliveryPartners.jsx # Rider approval & fleet view (`/delivery`)
        ├── RestaurantPartners.jsx # Partner point audit view (`/partners`)
        ├── Donations.jsx   # Master donation ledger (`/donations`)
        └── Rides.jsx       # Delivery ride transaction ledger (`/rides`)
```

---

## 🖥️ Pages & Routing Map

| Route Path | Component | Protected | Description |
|---|---|---|---|
| `/` | `Login.jsx` | No | Login portal for system administrators |
| `/home` | `Dashboard.jsx` | Yes | System KPI metrics, entity totals, and recent donation activity |
| `/ngos` | `NGOs.jsx` | Yes | View, search, toggle approval, or delete registered NGOs |
| `/donors` | `Donors.jsx` | Yes | View, search, toggle approval, or delete food donors |
| `/delivery` | `DeliveryPartners.jsx` | Yes | View, search, toggle approval, or delete delivery partners |
| `/partners` | `RestaurantPartners.jsx` | Yes | View, search, toggle approval, or delete restaurant partners |
| `/donations` | `Donations.jsx` | Yes | Full platform donation ledger filterable by status |
| `/rides` | `Rides.jsx` | Yes | Master delivery ride transaction ledger |

---

## 🔗 Verified API Integration Matrix

All endpoints map directly to backend routes configured in `backend/src/app.js`:

| UI View | Target Endpoint | HTTP Method | Auth Required | Action / Description |
|---|---|---|---|---|
| `Login.jsx` | `/admin/login` | `POST` | No | Validates admin email & password against `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| `Dashboard.jsx` | `/admin/dashboard` | `GET` | `adminAuth` | Returns aggregate counts for NGOs, Donors, Delivery, Partners, Donations, Rides |
| `NGOs.jsx` | `/admin/ngos` | `GET` | `adminAuth` | Fetches NGO list. Supports `?search=term` query parameter |
| `NGOs.jsx` | `/admin/ngos/:id/approve` | `PUT` | `adminAuth` | Toggles NGO `approved` boolean status |
| `NGOs.jsx` | `/admin/ngos/:id` | `DELETE` | `adminAuth` | Permanently deletes NGO record |
| `Donors.jsx` | `/admin/donors` | `GET` | `adminAuth` | Fetches Donor list. Supports `?search=term` query parameter |
| `Donors.jsx` | `/admin/donors/:id/approve` | `PUT` | `adminAuth` | Toggles Donor `approved` boolean status |
| `Donors.jsx` | `/admin/donors/:id` | `DELETE` | `adminAuth` | Permanently deletes Donor record |
| `DeliveryPartners.jsx` | `/admin/delivery` | `GET` | `adminAuth` | Fetches Delivery Partner list. Supports `?search=term` query parameter |
| `DeliveryPartners.jsx` | `/admin/delivery/:id/approve` | `PUT` | `adminAuth` | Toggles Delivery Partner `approved` boolean status |
| `DeliveryPartners.jsx` | `/admin/delivery/:id` | `DELETE` | `adminAuth` | Permanently deletes Delivery Partner record |
| `RestaurantPartners.jsx` | `/admin/partners` | `GET` | `adminAuth` | Fetches Restaurant Partner list. Supports `?search=term` query parameter |
| `RestaurantPartners.jsx` | `/admin/partners/:id/approve` | `PUT` | `adminAuth` | Toggles Restaurant Partner `approved` boolean status |
| `RestaurantPartners.jsx` | `/admin/partners/:id` | `DELETE` | `adminAuth` | Permanently deletes Restaurant Partner record |
| `Donations.jsx` | `/admin/donations` | `GET` | `adminAuth` | Fetches donations. Supports `?status=all|Pending|Accepted|Completed|Cancelled` |
| `Rides.jsx` | `/admin/rides` | `GET` | `adminAuth` | Fetches master delivery rides populated with donor, receiver, donation, rider |

---

## ⚙️ Environment Variables

Create a `.env` file in the root of `admin-frontend/`:

```env
# Core Backend Base URL (ending without trailing slash)
VITE_BACKEND_URL=http://localhost:8000
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Core Backend**: Running instance of `backend` on port `8000`

### 1. Install Dependencies

```bash
cd admin-frontend
npm install
```

### 2. Launch Local Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5174` (or next available port).

### 3. Build for Production

```bash
npm run build
```

Compiles optimized static bundle into the `dist/` directory.

---

## 🔒 Security & Authentication Flow

```
┌───────────────┐        POST /admin/login         ┌─────────────────┐
│  Admin Login  │ ───────────────────────────────> │ Express Backend │
└───────┬───────┘                                  └────────┬────────┘
        │                                                   │
        │ <────── Returns { token } & sets cookie ──────────┘
        ▼
┌───────────────────────────┐
│ Store token in Context &  │
│ localStorage("admintoken")│
└───────┬───────────────────┘
        │
        │ Authorization: Bearer <admintoken> or cookie admintoken
        ▼
┌───────────────────────────┐                      ┌─────────────────┐
│ GET /admin/dashboard      │ ───────────────────> │ adminAuth       │
└───────────────────────────┘                      │ Middleware      │
                                                   └─────────────────┘
```

1. **Token Persistence**: Admin JWT token is stored in `localStorage` under key `"admintoken"` and passed via `Authorization: Bearer <token>` header or `admintoken` cookie.
2. **Route Authorization**: `<ProtectedRoute>` wrapper checks `AdminContext` token state and redirects unauthenticated users to `/`.
3. **Session Expiry**: Expired admin tokens result in HTTP `401` response from `adminAuth` middleware.

---