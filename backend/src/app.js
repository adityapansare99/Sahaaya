import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors({ origin: "*", credentials: true }));

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

import receiverRouter from './route/Receiver.route.js';
app.use('/receiver', receiverRouter);

import riderRouter from './route/Rider.route.js';
app.use('/rider', riderRouter);

import partnerRoute from './route/partner.route.js';
app.use('/partner', partnerRoute);

export default app;