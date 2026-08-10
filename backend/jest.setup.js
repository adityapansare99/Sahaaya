import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

// Helper to create a valid donor
export const createTestDonor = async (overrides = {}) => {
  const Donor = (await import('./src/model/donor.model.js')).default;
  return Donor.create({
    name: 'Test Donor',
    email: `donor${Date.now()}@test.com`,
    phone: 9876543210 + Math.floor(Math.random() * 1000),
    address: '123 Test St',
    pincode: 110001,
    password: 'password123',
    ...overrides,
  });
};

// Helper to create a valid NGO
export const createTestNGO = async (overrides = {}) => {
  const NGO = (await import('./src/model/ngo.model.js')).default;
  return NGO.create({
    name: 'Test NGO',
    email: `ngo${Date.now()}@test.com`,
    phone: 9876543210 + Math.floor(Math.random() * 1000),
    address: '456 NGO Ave',
    contactPerson: 'John Doe',
    DailyCapacity: 100,
    RegistrationNumber: `REG${Date.now()}`,
    password: 'password123',
    typeofNgo: 'Food Bank',
    ...overrides,
  });
};

// Helper to create a valid delivery partner
export const createTestDelivery = async (overrides = {}) => {
  const Delivery = (await import('./src/model/delivery.model.js')).default;
  return Delivery.create({
    name: 'Test Rider',
    email: `rider${Date.now()}@test.com`,
    phone: 9876543210 + Math.floor(Math.random() * 1000),
    address: '789 Rider Rd',
    emergencyNumber: 9111111111,
    password: 'password123',
    vehicleCapacity: 100,
    licenseNumber: `LIC${Date.now()}`,
    vehicleNumber: `VEH${Date.now()}`,
    typeOfVehicle: 'Bike',
    ...overrides,
  });
};

// Helper to create a valid donation
export const createTestDonation = async (donorId, overrides = {}) => {
  const Donation = (await import('./src/model/donation.model.js')).default;
  return Donation.create({
    Donor: donorId,
    FoodType: 'Cooked Meals',
    FoodDescription: 'Test donation',
    PickupLocation: 'Test Location',
    ExpiryDate: new Date(Date.now() + 3600000),
    ExpiryTime: '14:30',
    typeOfDonor: 'Restaurant',
    ...overrides,
  });
};

// Helper to create a valid ride
export const createTestRide = async (donorId, ngoId, donationId, overrides = {}) => {
  const Ride = (await import('./src/model/ride.model.js')).default;
  return Ride.create({
    donor: donorId,
    receiver: ngoId,
    pickup: 'Test Pickup',
    destination: 'Test Destination',
    donation: donationId,
    ...overrides,
  });
};

// Generate JWT token for testing
import jwt from 'jsonwebtoken';
export const generateTestToken = (email, secret = 'test-secret', expiresIn = '1h') => {
  return jwt.sign({ email }, secret, { expiresIn });
};