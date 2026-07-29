import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app=express();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message: { success: false, message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 10 auth requests per windowMs
  message: { success: false, message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({ origin: "*" , credentials:true}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import healthcheckRoute from './route/healthcheck.route.js';
app.use('/', healthcheckRoute);

import donorrouter from './route/donor.route.js';
app.use('/donor', donorrouter);

import NgoRoute from './route/ngo.route.js';
app.use('/ngo', NgoRoute);

import deliveryRoute from './route/Delivery.route.js';
app.use('/delivery', deliveryRoute);

import donationRouter from './route/Donation.route.js';
app.use('/donation', donationRouter);

import receiverRouter from './route/Receiver.route.js';
app.use('/receiver', receiverRouter);

import riderRouter from './route/Rider.route.js';
app.use('/rider', riderRouter);

import partnerRoute from './route/partner.route.js';
app.use('/partner', partnerRoute);

import adminRoute from './route/admin.route.js';
app.use('/admin', adminRoute);

import forgotRoute from './route/forgot.route.js';
app.use('/forgot', forgotRoute);

import trackRoute from './route/track.route.js';
app.use('/track', trackRoute);

export default app;