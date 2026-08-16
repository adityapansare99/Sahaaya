# ⚡ Sahaaya Core Express 5 & Socket.IO Real-Time Backend (`backend`)

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.x-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=flat-square&logo=socketdotio)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-green.style=flat-square)](#license)

> **Enterprise Real-Time REST API, WebSocket Engine & Database Architecture** powering the Sahaaya Real-Time Surplus Food Redistribution Ecosystem. Features atomic concurrency lock protection, sub-100ms real-time notification dispatch, Haversine geospatial rider matching, and security hardening.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Technology Stack](#-technology-stack)
- [Directory Structure](#-directory-structure)
- [Verified Database Schemas & Data Models](#-verified-database-schemas--data-models)
- [Exhaustive REST API Specification (All 74 Routes)](#-exhaustive-rest-api-specification-all-74-routes)
  - [1. System & Health Check Module (`/`)](#1-system--health-check-module-)
  - [2. Food Donor Module (`/donor`)](#2-food-donor-module-donor)
  - [3. NGO (Receiver) Module (`/ngo`)](#3-ngo-receiver-module-ngo)
  - [4. Delivery Partner Profile Module (`/delivery`)](#4-delivery-partner-profile-module-delivery)
  - [5. Restaurant Partner Module (`/partner`)](#5-restaurant-partner-module-partner)
  - [6. Food Donation Management Module (`/donation`)](#6-food-donation-management-module-donation)
  - [7. NGO Receiver Claims Module (`/receiver`)](#7-ngo-receiver-claims-module-receiver)
  - [8. Delivery Rider Logistics & Rides Module (`/rider`)](#8-delivery-rider-logistics--rides-module-rider)
  - [9. Live Tracking Module (`/track`)](#9-live-tracking-module-track)
  - [10. Admin Governance Module (`/admin`)](#10-admin-governance-module-admin)
  - [11. Password Recovery OTP Module (`/forgot`)](#11-password-recovery-otp-module-forgot)
- [WebSocket Real-Time Event Architecture](#-websocket-real-time-event-architecture)
- [Concurrency & Algorithmic Protections](#-concurrency--algorithmic-protections)
- [Security Architecture & Middlewares](#-security-architecture--middlewares)
- [Environment Variables](#-environment-variables)
- [Setup & Development Guide](#-setup--development-guide)

---

## 🔍 Overview

The **Sahaaya Backend** (`backend`) acts as the central API gateway, database abstraction layer, and WebSocket broker for all Sahaaya client applications ([frontend](file:///c:/Projects/Sahaaya/frontend) and [admin-frontend](file:///c:/Projects/Sahaaya/admin-frontend)).

It enforces core business logic:
1. **Low-Latency Push Alerts**: Notifies nearby verified NGO sockets (`event: newDonation`) when food is posted.
2. **Atomic Concurrency Protection**: Uses single-document MongoDB atomic locks (`findOneAndUpdate({ _id, Status: "Pending" })`) during NGO claims to eliminate race conditions.
3. **Haversine Distance Filtering**: Calculates 20km great-circle spatial radii to deliver relevant donation alerts and available ride listings.

---

## 🏗️ Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime Environment** | Node.js | `18.x+` | Asynchronous non-blocking I/O event loop engine |
| **Web Framework** | Express | `5.1.0` | HTTP web server framework with native async error handling |
| **Database Management** | MongoDB Atlas | Cloud Cluster | NoSQL document database |
| **Object Data Mapper** | Mongoose | `8.x` | Schema definition, validation, and atomic query execution |
| **Real-Time Push Engine** | Socket.IO | `4.8.1` | Event-driven WebSocket server with room isolation |
| **Cloud Storage** | Cloudinary | `^2.0.0` | CDN hosting for uploaded user avatars and logos |
| **Multipart Parsing** | Multer | `^1.4.5` | Disk storage buffer for incoming multipart file uploads |
| **Security Hardening** | Helmet | `^8.0.0` | HTTP security headers (CSP, HSTS, X-Frame-Options) |
| **Rate Limiting** | express-rate-limit | `^7.5.0` | Rate limiting protection on auth & global endpoints |
| **Authentication** | JWT & Bcrypt | `jwt / bcrypt` | Session tokens (`refreshtoken`, `admintoken`) and password hashing |

---

## 📁 Directory Structure

```
backend/
├── public/                     # Static file staging
│   └── temp/                   # Multer temporary file upload scratch directory
├── src/
│   ├── app.js                  # Express middleware setup, CORS, Helmet, router mounts
│   ├── index.js                # HTTP server & Socket.IO server startup
│   ├── socket.js               # Socket.IO connection manager & event emitters
│   ├── constant.js             # System constants
│   ├── controller/             # 11 Business Logic Controllers
│   │   ├── Delivery.controller.js  # Delivery partner profile & auth
│   │   ├── Donation.controller.js  # Food donation creation & management
│   │   ├── Donor.controller.js     # Donor registration, auth & impact
│   │   ├── Receiver.controller.js  # NGO atomic donation acceptance & claims
│   │   ├── Rider.controller.js     # Ride matching, pickup, completion & points
│   │   ├── admin.controller.js     # Admin verification & governance
│   │   ├── forgot.controller.js    # Password reset OTP generation & validation
│   │   ├── healthcheck.controller.js # Healthcheck & public stats
│   │   ├── ngo.controller.js       # NGO registration & auth
│   │   ├── partner.controller.js   # Restaurant partner rewards & redemptions
│   │   └── track.controller.js     # Live tracking snapshot builder
│   ├── db/
│   │   └── index.js            # Mongoose MongoDB connection handler
│   ├── middleware/             # Security & Request Processing Middlewares
│   │   ├── adminAuth.middleware.js # Admin JWT validation
│   │   ├── auth.middleware.js      # authDonor, authNgo, authPartner, authRestaurant, authAnyParty
│   │   ├── multer.middleware.js    # Disk storage engine configuration
│   │   └── rateLimiters.js        # Auth rate limiters
│   ├── model/                  # 8 Mongoose Schemas
│   │   ├── delivery.model.js   # Delivery Partner schema
│   │   ├── donation.model.js   # Food Donation schema
│   │   ├── donor.model.js      # Donor schema
│   │   ├── ngo.model.js        # NGO schema
│   │   ├── otp.model.js        # Password reset OTP schema
│   │   ├── partner.model.js    # Restaurant Partner schema
│   │   ├── redemption.model.js # Reward Redemption audit schema
│   │   └── ride.model.js       # Delivery Ride transaction schema
│   ├── route/                  # 11 Express Router Definition Files
│   └── utils/                  # System Utilities & Helpers
│       ├── apiError.js         # Operational error helper
│       ├── apiResponse.js      # Standardized API response formatter ({ statuscode, data, message, success })
│       ├── asyncHandler.js     # Async Promise wrapper middleware
│       ├── cloudinary.js       # Cloudinary asset uploader
│       ├── expiryCleanup.js    # Expired donation cleanup cron
│       └── haversine.js        # Great-circle distance calculator (km)
├── .env                        # Environment variables
└── package.json                # Project manifest and scripts
```

---

## 🗄️ Verified Database Schemas & Data Models

### 1. `Donor` (`donor.model.js`)
- `name`: `String` (Required)
- `email`: `String` (Required, Unique)
- `phone`: `Number` (Required, Unique)
- `address`: `String` (Required)
- `pincode`: `Number` (Required)
- `password`: `String` (Required, Hashed via bcrypt)
- `approved`: `Boolean` (Default: `false`)
- `image`: `String` (Default: `""`)
- `socketId`: `String`
- `latitude`: `Number` (Default: `null`)
- `longitude`: `Number` (Default: `null`)

### 2. `NGO` (`ngo.model.js`)
- `name`: `String` (Required)
- `email`: `String` (Required, Unique)
- `phone`: `Number` (Required, Unique)
- `contactPerson`: `String` (Required)
- `address`: `String` (Required)
- `DailyCapacity`: `Number` (Required)
- `RegistrationNumber`: `String` (Required, Unique)
- `password`: `String` (Required, Hashed)
- `approved`: `Boolean` (Default: `false`)
- `image`: `String` (Default: `""`)
- `typeofNgo`: `String` (Required)
- `Description`: `String` (Default preset description)
- `socketId`: `String`
- `latitude`: `Number` (Default: `null`)
- `longitude`: `Number` (Default: `null`)

### 3. `Delivery` (`delivery.model.js`)
- `name`: `String` (Required)
- `address`: `String` (Required)
- `phone`: `Number` (Required, Unique)
- `email`: `String` (Required, Unique)
- `emergencyNumber`: `Number` (Required)
- `password`: `String` (Required, Hashed)
- `vehicleCapacity`: `Number` (Required)
- `licenseNumber`: `String` (Required, Unique)
- `vehicleNumber`: `String` (Required, Unique)
- `approved`: `Boolean` (Default: `false`)
- `image`: `String` (Default: `""`)
- `typeOfVehicle`: `String` (Required)
- `rating`: `Number` (Default: `0`)
- `totalDeliveries`: `Number` (Default: `0`)
- `points`: `Number` (Default: `0`)
- `redeemedPoints`: `Number` (Default: `0`)
- `socketId`: `String`
- `latitude`: `Number` (Default: `null`)
- `longitude`: `Number` (Default: `null`)
- `homeLatitude`: `Number` (Default: `null`)
- `homeLongitude`: `Number` (Default: `null`)
- `lastActiveAt`: `Date` (Default: `null`)

### 4. `Partner` (`partner.model.js`)
- `name`: `String` (Required)
- `email`: `String` (Required, Unique)
- `phone`: `Number` (Required, Unique)
- `address`: `String` (Required)
- `password`: `String` (Required, Hashed)
- `discountPercentage`: `Number` (Required, Default: `10`)
- `pointsRequired`: `Number` (Required, Default: `50`)
- `logo`: `String` (Default: `""`)
- `description`: `String` (Default: `""`)
- `isActive`: `Boolean` (Default: `true`)
- `approved`: `Boolean` (Default: `false`)
- `latitude`: `Number` (Default: `null`)
- `longitude`: `Number` (Default: `null`)

### 5. `Donation` (`donation.model.js`)
- `Donor`: `ObjectId` (Ref: `Donor`)
- `Ngo`: `ObjectId` (Ref: `NGO`)
- `FoodType`: `String` (Enum: `["Cooked Meals", "Fresh Vegetables", "Fruits", "Packaged Food", "Dairy Products", "Bakery Items", "Beverages", "Other"]`)
- `FoodDescription`: `String` (Required)
- `Quantity`: `String` (Default: `""`)
- `weightKg`: `Number` (Default: `0`, Min: `0`)
- `serves`: `Number` (Default: `0`, Min: `0`)
- `PickupLocation`: `String` (Required)
- `pickupLatitude`: `Number` (Default: `null`)
- `pickupLongitude`: `Number` (Default: `null`)
- `ExpiryDate`: `Date` (Required)
- `ExpiryTime`: `String` (Required)
- `Status`: `String` (Enum: `["Cancelled", "Accepted", "Completed", "Pending"]`, Default: `"Pending"`)
- `typeOfDonor`: `String` (Enum: `["Restaurant", "Event", "Store", "Individual"]`, Required)

### 6. `Ride` (`ride.model.js`)
- `donor`: `ObjectId` (Ref: `Donor`, Required)
- `receiver`: `ObjectId` (Ref: `NGO`, Required)
- `pickup`: `String` (Required)
- `destination`: `String` (Required)
- `status`: `String` (Enum: `["pending", "accepted", "picked up", "completed"]`, Default: `"pending"`)
- `duration`: `Number`
- `distance`: `Number`
- `donation`: `ObjectId` (Ref: `Donation`, Required)
- `rider`: `ObjectId` (Ref: `Delivery`)
- `points`: `Number` (Default: `0`)
- `riderRating`: `Number` (Default: `0`, Min: `0`, Max: `5`)

### 7. `Redemption` (`redemption.model.js`)
- `rider`: `ObjectId` (Ref: `Delivery`, Required)
- `partner`: `ObjectId` (Ref: `Partner`, Required)
- `pointsUsed`: `Number` (Required)
- `discountPercentage`: `Number` (Required)
- `bookingCode`: `String` (Required, Unique)
- `status`: `String` (Enum: `["active", "used", "expired"]`, Default: `"active"`)

### 8. `Otp` (`otp.model.js`)
- `email`: `String` (Required)
- `userType`: `String` (Enum: `["donor", "ngo", "delivery", "partner"]`, Required)
- `otp`: `String` (Required)
- `expiresAt`: `Date` (Required, TTL index: `expireAfterSeconds: 0`)
- `used`: `Boolean` (Default: `false`)

---

## 🌐 Exhaustive REST API Specification (All 74 Routes)

Every endpoint returns a standardized JSON object created by the `ApiResponse` utility:
```json
{
  "statuscode": 200,
  "data": { ... },
  "message": "Human readable description",
  "success": true
}
```

---

### 1. System & Health Check Module (`/`)

#### `GET /healthcheck`
Checks system operational status.
- **Middleware**: None
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": null,
  "message": "Server is working fine",
  "success": true
}
```

#### `GET /public-stats`
Fetches aggregate platform counters for public display on landing page.
- **Middleware**: None
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {
    "totalDonations": 45,
    "completedDonations": 32,
    "totalMealsServed": 1280
  },
  "message": "successful",
  "success": true
}
```

#### `POST /logout`
Clears session cookies (`refreshtoken`, `admintoken`).
- **Middleware**: None
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {},
  "message": "Logged out successfully",
  "success": true
}
```

---

### 2. Food Donor Module (`/donor`)

#### `POST /donor/register`
Registers a new food donor profile.
- **Middleware**: `authLimiter`, `upload.single("image")`
- **Request Format**: `multipart/form-data`
  - `data`: Stringified JSON string containing `{ name, email, phone, address, pincode, password, latitude, longitude }`
  - `image`: *(Optional file upload)*
- **Sample Request Data**:
```json
{
  "data": "{\"name\":\"Grand Palace Hotel\",\"email\":\"contact@grandpalace.com\",\"phone\":9876543210,\"address\":\"123 MG Road, Mumbai\",\"pincode\":400001,\"password\":\"SecurePassword123\",\"latitude\":19.0760,\"longitude\":72.8777}"
}
```
- **Response (`201 Created`)**:
```json
{
  "statuscode": 201,
  "data": {
    "finaldonor": {
      "_id": "65cb8f1e9f1a2b3c4d5e6f7a",
      "name": "Grand Palace Hotel",
      "email": "contact@grandpalace.com",
      "phone": 9876543210,
      "address": "123 MG Road, Mumbai",
      "pincode": 400001,
      "approved": false,
      "image": "https://res.cloudinary.com/demo/image/upload/v1234/donor.jpg",
      "latitude": 19.0760,
      "longitude": 72.8777,
      "createdAt": "2026-08-16T10:00:00.000Z",
      "updatedAt": "2026-08-16T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Donor registered successfully",
  "success": true
}
```
- **Response (`400 Bad Request`)**:
```json
{
  "statuscode": 400,
  "data": {},
  "message": "Email already registered",
  "success": false
}
```

#### `POST /donor/login`
Authenticates a donor and returns JWT session token.
- **Middleware**: `authLimiter`
- **Request Body**:
```json
{
  "email": "contact@grandpalace.com",
  "password": "SecurePassword123"
}
```
- **Response (`200 OK`)**: Sets `refreshtoken` HTTP-only cookie.
```json
{
  "statuscode": 200,
  "data": {
    "donor": {
      "_id": "65cb8f1e9f1a2b3c4d5e6f7a",
      "name": "Grand Palace Hotel",
      "email": "contact@grandpalace.com"
    },
    "token": "eyJhbGciOiJI..."
  },
  "message": "Login successful",
  "success": true
}
```

#### `GET /donor/profile`
Fetches authenticated donor's profile.
- **Middleware**: `authDonor`
- **Headers**: `Authorization: Bearer <token>` or `refreshtoken` cookie
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {
    "_id": "65cb8f1e9f1a2b3c4d5e6f7a",
    "name": "Grand Palace Hotel",
    "email": "contact@grandpalace.com",
    "phone": 9876543210,
    "address": "123 MG Road, Mumbai",
    "pincode": 400001
  },
  "message": "Donor profile fetched successfully",
  "success": true
}
```

#### `POST /donor/updateprofile`
Updates donor profile attributes.
- **Middleware**: `authDonor`
- **Request Body**:
```json
{
  "name": "Grand Palace Resort",
  "phone": 9876543210,
  "address": "456 Beach Road, Mumbai",
  "pincode": 400002,
  "latitude": 19.0800,
  "longitude": 72.8800
}
```
- **Response (`200 OK`)**: Returns updated donor document.

#### `POST /donor/updatepassword`
Updates donor account password.
- **Middleware**: `authDonor`
- **Request Body**:
```json
{
  "oldpassword": "SecurePassword123",
  "newpassword": "NewSecurePassword456"
}
```
- **Response (`200 OK`)**: Returns updated donor document.

#### `DELETE /donor/deleteaccount`
Deletes authenticated donor account.
- **Middleware**: `authDonor`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {},
  "message": "Account deleted successfully",
  "success": true
}
```

#### `GET /donor/impact`
Calculates environmental and social impact analytics for the donor.
- **Middleware**: `authDonor`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {
    "totalDonations": 12,
    "completed": 8,
    "accepted": 2,
    "pending": 2,
    "ngosConnected": 4,
    "totalMealsDonated": 450,
    "wasteReduced": 225,
    "peopleServed": 450,
    "recentActivity": [
      {
        "foodType": "Cooked Meals",
        "weightKg": 25,
        "serves": 50,
        "status": "Completed",
        "ngo": "Hope Foundation",
        "createdAt": "2026-08-15T14:30:00.000Z"
      }
    ],
    "monthlyTrend": [
      { "month": "Mar", "donations": 1 },
      { "month": "Apr", "donations": 2 },
      { "month": "May", "donations": 3 },
      { "month": "Jun", "donations": 2 },
      { "month": "Jul", "donations": 2 },
      { "month": "Aug", "donations": 2 }
    ]
  },
  "message": "Impact fetched successfully",
  "success": true
}
```

---

### 3. NGO (Receiver) Module (`/ngo`)

#### `POST /ngo/register`
- **Middleware**: `authLimiter`, `upload.single("image")`
- **Request Format**: `multipart/form-data`
  - `data`: Stringified JSON string containing `{ name, email, phone, address, contactPerson, DailyCapacity, password, RegistrationNumber, typeofNgo, latitude, longitude }`
  - `image`: *(Optional file upload)*
- **Response (`201 Created`)**:
```json
{
  "statuscode": 201,
  "data": {
    "finalNgo": {
      "_id": "65ca11223344556677889900",
      "name": "Hope Shelter NGO",
      "email": "contact@hopeshelter.org",
      "RegistrationNumber": "NGO-MH-8891",
      "approved": false
    },
    "token": "eyJhbGciOi..."
  },
  "message": "Ngo registered successfully",
  "success": true
}
```

#### `POST /ngo/login`
- **Middleware**: `authLimiter`
- **Request Body**: `{"email": "contact@hopeshelter.org", "password": "SecurePassword123"}`
- **Response (`200 OK`)**: Returns `{ Ngo, token }`.

#### `GET /ngo/profile`
- **Middleware**: `authNgo`
- **Response (`200 OK`)**: Returns NGO profile object.

#### `POST /ngo/updateprofile`
- **Middleware**: `authNgo`
- **Request Body**: `{ "name", "phone", "address", "typeofNgo", "RegistrationNumber", "contactPerson", "DailyCapacity", "Description", "latitude", "longitude" }`
- **Response (`200 OK`)**: Returns updated NGO document.

#### `POST /ngo/updatepassword`
- **Middleware**: `authNgo`
- **Request Body**: `{ "oldpassword", "newpassword" }`

#### `DELETE /ngo/deleteaccount`
- **Middleware**: `authNgo`
- **Response (`200 OK`)**: Returns `{}`.

#### `GET /ngo/analytics`
- **Middleware**: `authNgo`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {
    "total": 15,
    "completed": 10,
    "accepted": 3,
    "cancelled": 1,
    "pending": 1,
    "topDonors": [
      { "name": "Grand Palace Hotel", "donations": 6 }
    ],
    "monthlyTrend": [
      { "month": "Mar", "donations": 2 },
      { "month": "Aug", "donations": 5 }
    ],
    "peopleServed": 600,
    "wasteReduced": 300,
    "avgServes": 60,
    "avgWeight": 30,
    "momChange": 25
  },
  "message": "Analytics fetched successfully",
  "success": true
}
```

---

### 4. Delivery Partner Profile Module (`/delivery`)

#### `POST /delivery/register`
- **Middleware**: `authLimiter`, `upload.single("image")`
- **Request Format**: `multipart/form-data`
  - `data`: Stringified JSON string containing `{ name, address, phone, email, emergencyNumber, password, vehicleCapacity, licenseNumber, vehicleNumber, typeOfVehicle, latitude, longitude }`
  - `image`: *(Optional file upload)*
- **Response (`201 Created`)**: Returns `{ finalpartner, token }`.

#### `POST /delivery/login`
- **Middleware**: `authLimiter`
- **Request Body**: `{"email": "rider@express.com", "password": "RiderPassword123"}`
- **Response (`200 OK`)**: Returns `{ partner, token }`.

#### `GET /delivery/profile`
- **Middleware**: `authPartner`
- **Response (`200 OK`)**: Returns delivery partner document.

#### `POST /delivery/updateprofile`
- **Middleware**: `authPartner`, `upload.single("image")`
- **Request Body**: JSON or `multipart/form-data` with `data` stringified JSON.
- **Response (`200 OK`)**: Returns updated delivery partner document.

#### `POST /delivery/updatepassword`
- **Middleware**: `authPartner`
- **Request Body**: `{ "oldpassword", "newpassword" }`

#### `DELETE /delivery/deleteaccount`
- **Middleware**: `authPartner`
- **Response (`200 OK`)**: Returns `{}`.

---

### 5. Restaurant Partner Module (`/partner`)

#### `POST /partner/register`
- **Middleware**: `authLimiter`, `upload.single("image")`
- **Request Body**: `{ "name", "email", "phone", "address", "password", "discountPercentage", "pointsRequired", "description", "latitude", "longitude" }` + optional file `image`.
- **Response (`201 Created`)**: Returns `{ finalPartner, token }`.

#### `POST /partner/login`
- **Middleware**: `authLimiter`
- **Request Body**: `{"email": "cafe@partner.com", "password": "PartnerPassword123"}`
- **Response (`200 OK`)**: Returns `{ partner, token }`.

#### `GET /partner/list`
- **Middleware**: None
- **Response (`200 OK`)**: Returns array of active restaurant partners (`isActive: true`).

#### `GET /partner/top`
- **Middleware**: None
- **Response (`200 OK`)**: Returns top 5 aggregated restaurant partners sorted by total rider redemptions.

#### `GET /partner/profile`
- **Middleware**: `authRestaurant`
- **Response (`200 OK`)**: Returns restaurant partner profile.

#### `POST /partner/updateprofile`
- **Middleware**: `authRestaurant`, `upload.single("image")`
- **Request Body**: JSON or `multipart/form-data` with `data` stringified JSON.

#### `POST /partner/updatepassword`
- **Middleware**: `authRestaurant`
- **Request Body**: `{ "oldpassword", "newpassword" }`

#### `DELETE /partner/deleteaccount`
- **Middleware**: `authRestaurant`
- **Response (`200 OK`)**: Returns `{}`.

#### `GET /partner/redemptions`
- **Middleware**: `authRestaurant`
- **Response (`200 OK`)**: Returns all redemptions created for this partner populated with rider information.

---

### 6. Food Donation Management Module (`/donation`)

#### `POST /donation/createDonation`
Posts a food donation to the network and triggers WebSocket alert.
- **Middleware**: `authDonor`
- **Request Body**:
```json
{
  "donorType": "Restaurant",
  "foodType": "Cooked Meals",
  "description": "50 fresh packed meal boxes",
  "pickup": "123 MG Road, Mumbai",
  "expiryDate": "2026-08-17",
  "expiryTime": "20:00",
  "weightKg": 25,
  "serves": 50,
  "pickupLatitude": 19.0760,
  "pickupLongitude": 72.8777
}
```
- **Response (`201 Created`)**:
```json
{
  "statuscode": 201,
  "data": {
    "_id": "65cb8f1e9f1a2b3c4d5e6f7a",
    "FoodType": "Cooked Meals",
    "FoodDescription": "50 fresh packed meal boxes",
    "weightKg": 25,
    "serves": 50,
    "PickupLocation": "123 MG Road, Mumbai",
    "ExpiryDate": "2026-08-17T00:00:00.000Z",
    "ExpiryTime": "20:00",
    "Status": "Pending",
    "typeOfDonor": "Restaurant",
    "Donor": { "_id": "65cb...", "name": "Grand Palace Hotel" }
  },
  "message": "Donation created successfully",
  "success": true
}
```

#### `GET /donation/getAllDonations`
Retrieves all donations created by the authenticated donor.
- **Middleware**: `authDonor`
- **Response (`200 OK`)**: Returns array of donation documents populated with `Ngo` and `Donor`.

#### `PUT /donation/editDonation`
Updates an unaccepted pending donation.
- **Middleware**: `authDonor`
- **Request Body**:
```json
{
  "donationId": "65cb8f1e9f1a2b3c4d5e6f7a",
  "foodType": "Cooked Meals",
  "description": "60 fresh packed meal boxes",
  "pickup": "123 MG Road, Mumbai",
  "expiryDate": "2026-08-17",
  "expiryTime": "21:00",
  "weightKg": 30,
  "serves": 60
}
```
- **Response (`200 OK`)**: Returns updated donation document.

#### `DELETE /donation/deleteDonation`
Deletes a donation document.
- **Middleware**: `authDonor`
- **Request Body**: `{"donationId": "65cb8f1e9f1a2b3c4d5e6f7a"}`
- **Response (`200 OK`)**: Returns deleted donation document.

#### `POST /donation/cancelDonation`
Cancels a pending donation.
- **Middleware**: `authDonor`
- **Request Body**: `{"donationId": "65cb8f1e9f1a2b3c4d5e6f7a"}`
- **Response (`200 OK`)**: Returns updated donation with `Status: "Cancelled"`.
- **Response (`409 Conflict`)**: Returned if donation is already accepted or completed.

---

### 7. NGO Receiver Claims Module (`/receiver`)

#### `GET /receiver/donations`
Fetches pending donations within 20km of the authenticated NGO.
- **Middleware**: `authNgo`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": [
    {
      "_id": "65cb8f1e9f1a2b3c4d5e6f7a",
      "FoodType": "Cooked Meals",
      "weightKg": 25,
      "serves": 50,
      "Status": "Pending",
      "timeLeft": "3:45",
      "distanceKm": 4.2,
      "Donor": { "name": "Grand Palace Hotel" }
    }
  ],
  "message": "Donations fetched successfully",
  "success": true
}
```

#### `PUT /receiver/acceptOrder`
**ATOMIC CONCURRENCY LOCK ENFORCED**. Claims a pending donation and generates a delivery ride.
- **Middleware**: `authNgo`
- **Request Body**: `{"donationId": "65cb8f1e9f1a2b3c4d5e6f7a"}`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {
    "_id": "65cc11112222333344445555",
    "pickup": "123 MG Road, Mumbai",
    "destination": "45 Worli Sea Face, Mumbai",
    "status": "pending",
    "distance": 4.2,
    "donor": { "_id": "65cb...", "name": "Grand Palace Hotel" },
    "receiver": { "_id": "65ca...", "name": "Hope Shelter NGO" },
    "donation": { "_id": "65cb...", "FoodType": "Cooked Meals" }
  },
  "message": "Donation accepted successfully",
  "success": true
}
```
- **Response (`409 Conflict`)**: If another NGO claimed the donation first (`Status` no longer `"Pending"`).
```json
{
  "statuscode": 409,
  "data": {},
  "message": "Donation already accepted by another NGO or not found",
  "success": false
}
```

#### `GET /receiver/receivedDonations`
Fetches all donations claimed or received by this NGO.
- **Middleware**: `authNgo`
- **Response (`200 OK`)**: Returns `{ response, total, completed, pending }`.

#### `GET /receiver/completedDeliveries`
Fetches completed delivery rides for this NGO.
- **Middleware**: `authNgo`
- **Response (`200 OK`)**: Array of completed ride documents populated with donor, rider, donation.

#### `POST /receiver/rateDelivery`
Rates the delivery partner (1 to 5 stars) for a completed ride.
- **Middleware**: `authNgo`
- **Request Body**: `{"rideId": "65cc11112222333344445555", "rating": 5}`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {
    "rating": 5,
    "averageRating": 4.8
  },
  "message": "Rating submitted successfully",
  "success": true
}
```

---

### 8. Delivery Rider Logistics & Rides Module (`/rider`)

#### `GET /rider/allRides`
Fetches available pending delivery rides within 20km.
- **Middleware**: `authPartner`
- **Response (`200 OK`)**: Array of pending rides with `timeLeft` and `distanceKm`.

#### `PUT /rider/acceptRide`
Accepts a pending delivery ride.
- **Middleware**: `authPartner`
- **Request Body**: `{"rideId": "65cc11112222333344445555"}`
- **Response (`200 OK`)**: Returns updated ride document (`status: "accepted"`, `rider: riderId`).
- **Response (`409 Conflict`)**: If ride was claimed by another rider.

#### `GET /rider/getRides`
Fetches active rides for the logged-in rider (`status != 'completed'`).
- **Middleware**: `authPartner`
- **Response (`200 OK`)**: Array of active ride documents.

#### `PUT /rider/markPicked`
Marks ride status as `"picked up"`.
- **Middleware**: `authPartner`
- **Request Body**: `{"rideId": "65cc11112222333344445555"}`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {},
  "message": "Ride picked up successfully",
  "success": true
}
```

#### `PUT /rider/markCompeted` (or `PUT /rider/markCompleted`)
Completes delivery ride, marks donation as `"Completed"`, and awards +10 points to rider.
- **Middleware**: `authPartner`
- **Request Body**: `{"rideId": "65cc11112222333344445555"}`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {},
  "message": "Ride completed successfully",
  "success": true
}
```

#### `GET /rider/getAllRides`
Fetches master history of all rides assigned to rider.
- **Middleware**: `authPartner`

#### `GET /rider/rewards`
Fetches rider point balance, total deliveries, average rating, and milestone progress.
- **Middleware**: `authPartner`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {
    "points": 120,
    "redeemedPoints": 50,
    "totalDeliveries": 12,
    "rating": 4.8,
    "milestones": [
      { "milestone": "25 Deliveries", "threshold": 25, "reward": "500 Points", "status": "in-progress", "progress": 48 }
    ]
  },
  "message": "Rewards fetched successfully",
  "success": true
}
```

#### `POST /rider/redeemPoints`
Redeems points for a partner reward receipt.
- **Middleware**: `authPartner`
- **Request Body**: `{"partnerId": "65dd77778888999900001111"}`
- **Response (`201 Created`)**:
```json
{
  "statuscode": 201,
  "data": {
    "bookingCode": "SAH-A1B2C3",
    "partner": "Subway Eats",
    "discountPercentage": 15,
    "pointsUsed": 50,
    "remainingPoints": 70,
    "receiptSent": true
  },
  "message": "Points redeemed successfully",
  "success": true
}
```

#### `GET /rider/myRedemptions`
Fetches last 5 reward redemptions claimed by rider.
- **Middleware**: `authPartner`

#### `PUT /rider/updateLocation`
Updates rider's live coordinates and emits `riderLocation` event to socket room `ride:<rideId>`.
- **Middleware**: `authPartner`
- **Request Body**: `{"latitude": 19.05, "longitude": 72.83}`
- **Response (`200 OK`)**: Returns `{ "message": "Location updated" }`.

---

### 9. Live Tracking Module (`/track`)

#### `GET /track/:rideId`
Fetches complete tracking details for a ride (validated for donor, NGO, or rider).
- **Middleware**: `authAnyParty`
- **URL Parameter**: `rideId`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {
    "status": "accepted",
    "pickup": {
      "lat": 19.076,
      "lng": 72.877,
      "label": "123 MG Road, Mumbai"
    },
    "destination": {
      "lat": 19.01,
      "lng": 72.81,
      "label": "45 Worli Sea Face, Mumbai"
    },
    "rider": {
      "lat": 19.05,
      "lng": 72.83,
      "name": "Rahul Sharma",
      "lastActiveAt": "2026-08-16T15:00:00.000Z"
    },
    "riderId": "65ee...",
    "rideId": "65cc11112222333344445555",
    "viewerRole": "donor",
    "viewerIsRider": false
  },
  "message": "Track data fetched successfully",
  "success": true
}
```

#### `GET /track/by-donation/:donationId`
Resolves active ride ID for a given donation.
- **Middleware**: `authAnyParty`
- **URL Parameter**: `donationId`
- **Response (`200 OK`)**: Returns `{ "rideId": "65cc11112222333344445555" }`.

---

### 10. Admin Governance Module (`/admin`)

#### `POST /admin/login`
Authenticates system administrator using constant-time credentials comparison.
- **Middleware**: `authLimiter`
- **Request Body**: `{"email": "admin@sahaaya.org", "password": "SuperAdminPassword123"}`
- **Response (`200 OK`)**: Sets `admintoken` cookie. Returns `{ token }`.

#### `GET /admin/dashboard`
Fetches aggregate KPI counts across all platform entities.
- **Middleware**: `adminAuth`
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {
    "ngos": { "total": 12, "approved": 10, "pending": 2 },
    "donors": { "total": 25, "approved": 25 },
    "delivery": { "total": 18, "approved": 15, "pending": 3 },
    "partners": { "total": 8, "approved": 8 },
    "donations": { "total": 60, "Pending": 5, "Accepted": 10, "Completed": 40, "Cancelled": 5 },
    "rides": { "total": 50 },
    "recentDonations": [ ... ]
  },
  "message": "successful",
  "success": true
}
```

#### `GET /admin/ngos`
- **Middleware**: `adminAuth`
- **Query Parameter**: `?search=term`
- **Response (`200 OK`)**: Array of NGO documents.

#### `PUT /admin/ngos/:id/approve`
Toggles NGO approval status.
- **Middleware**: `adminAuth`
- **Response (`200 OK`)**: Returns updated NGO document.

#### `DELETE /admin/ngos/:id`
Deletes NGO record.
- **Middleware**: `adminAuth`
- **Response (`200 OK`)**: Returns `{}`.

#### `GET /admin/donors`
- **Middleware**: `adminAuth`
- **Query Parameter**: `?search=term`

#### `PUT /admin/donors/:id/approve`
- **Middleware**: `adminAuth`

#### `DELETE /admin/donors/:id`
- **Middleware**: `adminAuth`

#### `GET /admin/delivery`
- **Middleware**: `adminAuth`
- **Query Parameter**: `?search=term`

#### `PUT /admin/delivery/:id/approve`
- **Middleware**: `adminAuth`

#### `DELETE /admin/delivery/:id`
- **Middleware**: `adminAuth`

#### `GET /admin/partners`
- **Middleware**: `adminAuth`
- **Query Parameter**: `?search=term`

#### `PUT /admin/partners/:id/approve`
- **Middleware**: `adminAuth`

#### `DELETE /admin/partners/:id`
- **Middleware**: `adminAuth`

#### `GET /admin/donations`
- **Middleware**: `adminAuth`
- **Query Parameter**: `?status=all|Pending|Accepted|Completed|Cancelled`

#### `GET /admin/rides`
- **Middleware**: `adminAuth`
- **Response (`200 OK`)**: Returns full ride audit ledger populated with donor, receiver, donation, rider.

---

### 11. Password Recovery OTP Module (`/forgot`)

#### `POST /forgot/send-otp`
Sends a 6-digit OTP to user email.
- **Middleware**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "userType": "donor"
}
```
*(UserType Enum: `"donor" | "ngo" | "delivery" | "partner"`)*
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {},
  "message": "OTP sent to your email",
  "success": true
}
```

#### `POST /forgot/verify-otp`
Verifies OTP code and issues temporary password reset token.
- **Middleware**: None
- **Request Body**: `{"email": "user@example.com", "otp": "123456"}`
- **Response (`200 OK`)**: Returns `{ resetToken }`.

#### `POST /forgot/reset-password`
Resets user password using valid reset token.
- **Middleware**: None
- **Request Body**:
```json
{
  "resetToken": "eyJhbGciOi...",
  "newPassword": "NewSecurePassword123"
}
```
- **Response (`200 OK`)**:
```json
{
  "statuscode": 200,
  "data": {},
  "message": "Password reset successfully",
  "success": true
}
```

---

## ⚡ WebSocket Real-Time Event Architecture

Engineered with **Socket.IO 4.8.1**:

```
Client Handshake: auth.token or Authorization Header
  │
  ├─► Client emits "join" ──────────────► Joins room "ngo" | "donor" | "delivery" & saves socketId in DB
  ├─► Client emits "joinRide" { rideId } ► Joins room "ride:<rideId>"
  ├─► Client emits "updateRiderLocation"► Emits "riderLocation" to room "ride:<rideId>"
```

### Event Matrix

| Event Name | Direction | Payload | Room / Recipient |
|---|---|---|---|
| `join` | Client $\rightarrow$ Server | None | Authenticated socket |
| `joined` | Server $\rightarrow$ Client | `{ success: true }` | Emitted socket |
| `joinRide` | Client $\rightarrow$ Server | `{ rideId }` | Room `ride:<rideId>` |
| `leaveRide` | Client $\rightarrow$ Server | `{ rideId }` | Room `ride:<rideId>` |
| `updateRiderLocation` | Client $\rightarrow$ Server | `{ latitude, longitude }` | Room `ride:<rideId>` |
| `riderLocation` | Server $\rightarrow$ Client | `{ rideId, latitude, longitude, lastActiveAt }` | Room `ride:<rideId>` |
| `newDonation` | Server $\rightarrow$ Client | `{ donation, distanceKm }` | Room `ngo` / Socket ID |
| `donationAccepted` | Server $\rightarrow$ Client | `{ donation }` | Donor Socket ID |
| `rideCreated` | Server $\rightarrow$ Client | `{ ride, distanceKm }` | Room `delivery` / Socket ID |
| `statusUpdate` | Server $\rightarrow$ Client | `{ ride, status }` | Donor, NGO, & Room `ride:<rideId>` |
| `pointsAwarded` | Server $\rightarrow$ Client | `{ points }` | Rider Socket ID |
| `riderRated` | Server $\rightarrow$ Client | `{ rating, averageRating }` | Rider Socket ID |

---

## 🛡️ Concurrency & Algorithmic Protections

### 1. Single-Document Atomic Concurrency Lock
To eliminate double-claiming during simultaneous NGO claim attempts:
```javascript
const response = await Donation.findOneAndUpdate(
  { _id: donationId, Status: "Pending" },
  { Status: "Accepted", Ngo: Ngo._id },
  { new: true }
);
if (!response) {
  return res.status(409).json(new ApiResponse(409, {}, "Donation already accepted by another NGO or not found"));
}
```

### 2. Haversine Spatial Filtering (20km Radius)
Used to calculate spatial distances between pickup coordinates and NGO/Rider locations:
$$d = 2r \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)} \right)$$

---

## 🔒 Security Architecture & Middlewares

1. **Helmet Middleware**: Enforces HTTP security headers.
2. **Rate Limiting**: Restricts requests to 1000 per 15 minutes globally, and 10 requests per 15 minutes on auth endpoints.
3. **Password Security**: Passwords salted and hashed with `bcrypt` (10 rounds).
4. **JWT Auth Middlewares**: Validates session tokens (`refreshtoken`, `admintoken`). Rejects reset tokens used as session tokens.

---

## ⚙️ Environment Variables

Create `.env` inside `backend/`:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sahaaya
refreshtoken=your_super_secret_jwt_key_here
refreshtime=7d

# Admin Auth Credentials
ADMIN_EMAIL=admin@sahaaya.org
ADMIN_PASSWORD=SuperAdminPassword123!
ADMIN_JWT_SECRET=your_admin_jwt_secret_here

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS & Sockets
FRONTEND_URL=http://localhost:5173,http://localhost:5174

# Email SMTP Credentials (for OTP & Redemption Receipts)
email_user=your_email@gmail.com
email_pass=your_gmail_app_password
email_host=smtp.gmail.com
email_port=587
email_from=Sahaaya Platform <noreply@sahaaya.org>
```

---

## 🚀 Setup & Development Guide

### Prerequisites
- **Node.js**: `v18.x+`
- **MongoDB Atlas** or Local MongoDB instance

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```

Server starts on `http://localhost:8000`.

---
