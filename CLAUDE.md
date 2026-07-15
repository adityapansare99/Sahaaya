# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sahaaya is a food donation platform connecting three user types: **Donors** (restaurants/events/stores/individuals), **NGOs** (receiver/redistribution), and **Delivery Partners** (riders who transport food). Built with a React frontend and Express/MongoDB backend with Socket.IO for real-time updates.

## Commands

### Backend (`./backend`)
```bash
npm run dev      # Start dev server with nodemon + dotenv (uses src/index.js)
npm start        # Start production server
```

### Frontend (`./frontend`)
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

### Backend (`backend/src/`)

- **`app.js`** — Express application setup: CORS, cookie-parser, JSON body parser, static files, route mounting
- **`index.js`** — Entry point: creates HTTP server, initializes Socket.IO, connects to MongoDB, starts listening
- **`db/index.js`** — Mongoose connection using `dblink` env var + database name from `constant.js`
- **`socket.js`** — Socket.IO server: handles `join` events (associates socket IDs with user records by `userType`), exposes `sendMessageToSocketId` for targeted real-time emits
- **`constant.js`** — Database name constant

### Key Patterns

- **Auth**: JWT-based with three middleware variants (`authDonor`, `authNgo`, `authPartner`). Tokens extracted from cookies (`refreshtoken`), Authorization header, or request body. User object attached to `req.donor` / `req.Ngo` / `req.partner`.
- **Error/Response**: `ApiResponse` class (statuscode, data, message, success) and `asyncHandler` wrapper (catches promise rejections and forwards to Express error middleware).
- **File Upload**: Multer saves to `./public/temp`, then Cloudinary upload with `uploadoncloudinary`. Local temp file cleaned up on failure.
- **Routes**: Defined in `route/` files, middleware applied per-route (auth guards + multer where needed).

### API Endpoints

| Prefix | Auth | Key Routes |
|---|---|---|
| `/` | None | Healthcheck |
| `/donor` | `authDonor` | register, login, profile CRUD, password update, account delete |
| `/ngo` | `authNgo` | register (with image upload), login, profile CRUD, password update, account delete |
| `/delivery` | `authPartner` | register, login, profile |
| `/donation` | `authDonor` | CRUD operations |
| `/receiver` | — | NGO-facing donation operations |
| `/rider` | — | Delivery partner ride operations |

### Data Models (`backend/src/model/`)

- **Donor** — name, email, phone, address, pincode, hashed password, approval status, image, socketId
- **NGO** — name, email, phone, contactPerson, address, DailyCapacity, RegistrationNumber, typeofNgo, Description, hashed password, approval status, image, socketId
- **Delivery** — name, address, phone, email, emergencyNumber, vehicleCapacity/licenseNumber/vehicleNumber/typeOfVehicle, rating, totalDeliveries, hashed password, approval status, image, socketId
- **Donation** — Donor ref, Ngo ref, FoodType (enum: Cooked Meals/Fresh Vegetables/Fruits/etc.), FoodDescription, Quantity, PickupLocation, ExpiryDate/Time, Status (Pending/Accepted/Completed/Cancelled), typeOfDonor (Restaurant/Event/Store/Individual)
- **Ride** — donor ref, receiver ref, pickup, destination, status, duration, distance, donation ref, rider ref

All user models hash passwords via `bcrypt` pre-save hook and expose `isPasswordCorrect` instance method.

### Frontend (`frontend/src/`)

- **`main.jsx`** — Entry: wraps App in `AppContextProvider` > `SocketProvider` > `BrowserRouter`
- **`App.jsx`** — Route definitions (Home, 3 registration pages, Login, Role selection, 3 dashboards)
- **`context/AppContext.jsx`** — Global state: `Role`, `token`, `backendurl` (from `VITE_BACKEND_URL` env var)
- **`context/SocketContext.jsx`** — Socket.IO client connection, managed via ref
- **`pages/`** — Page-level components per route
- **`components/`** — Reusable UI: Navbar, Footer, Sidebar variants (D/R), Settings, Analytics, Donation/History components, FoodRequests, ProfileSection, RewardsSection, Impact, Partner, ScrollToTop

### Environment

**Backend** (`backend/.env`):
```
PORT=8002
dblink=mongodb+srv://...
refreshtoken=<jwt-secret>
refreshtime=10d
domain=*
RazorPayKey, RazorPaySecretKey, Currency
cloud_name, api_key, api_secret  (Cloudinary)
```

**Frontend** (`frontend/.env`):
```
VITE_BACKEND_URL="http://localhost:8000/"
```

## Real-Time Architecture

Socket.IO used for delivering real-time notifications. On connect, each user type emits `join` with their `userId` and `userType`. The server stores the socket ID on the user's DB record. Targeted messages sent via `sendMessageToSocketId(socketId, { event, data })`.
