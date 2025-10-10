import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import healthcheckRoute from './route/healtcheck.route.js';
app.use('/', healthcheckRoute);

import donorrouter from './route/donor.route.js';
app.use('/donor', donorrouter);

import NgoRoute from './route/ngo.route.js';
app.use('/ngo', NgoRoute);

import deliveryRoute from './route/Delivery.route.js';
app.use('/delivery', deliveryRoute);

import donationRouter from './route/Donation.route.js';
app.use('/donation', donationRouter);

export default app;