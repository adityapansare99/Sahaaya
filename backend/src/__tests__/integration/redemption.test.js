import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Delivery from '../../model/delivery.model.js';
import Partner from '../../model/partner.model.js';
import Redemption from '../../model/redemption.model.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Delivery.deleteMany({});
  await Partner.deleteMany({});
  await Redemption.deleteMany({});
});

describe('Rider Points & Redemption System', () => {
  let rider, partner;

  beforeEach(async () => {
    rider = await Delivery.create({
      name: 'Test Rider',
      address: 'Rider Address',
      phone: 9876543210,
      email: 'rider@test.com',
      emergencyNumber: 9876543211,
      password: 'password123',
      vehicleCapacity: 100,
      licenseNumber: 'LIC123',
      vehicleNumber: 'VEH123',
      typeOfVehicle: 'Bike',
      approved: true,
      points: 150,
      totalDeliveries: 15,
      redeemedPoints: 0,
    });

    partner = await Partner.create({
      name: 'Test Restaurant',
      email: 'partner@test.com',
      phone: 9876543212,
      address: 'Partner Address',
      password: 'password123',
      discountPercentage: 10,
      pointsRequired: 50,
      isActive: true,
      approved: true,
    });
  });

  test('rider can redeem points for partner discount', async () => {
    // Simulate the redemption logic from Rider.controller.js
    const pointsRequired = partner.pointsRequired; // 50

    const updatedRider = await Delivery.findOneAndUpdate(
      { _id: rider._id, points: { $gte: pointsRequired } },
      { $inc: { points: -pointsRequired, redeemedPoints: pointsRequired } },
      { new: true }
    );

    expect(updatedRider).not.toBeNull();
    expect(updatedRider.points).toBe(100); // 150 - 50
    expect(updatedRider.redeemedPoints).toBe(50);

    // Redemption record created
    const redemption = await Redemption.create({
      rider: rider._id,
      partner: partner._id,
      pointsUsed: pointsRequired,
      discountPercentage: partner.discountPercentage,
      bookingCode: 'SAH-TEST123',
    });

    expect(redemption._id).toBeDefined();
    expect(redemption.status).toBe('active');
    expect(redemption.pointsUsed).toBe(50);
    expect(redemption.discountPercentage).toBe(10);
  });

  test('prevents redemption with insufficient points', async () => {
    const lowPointsRider = await Delivery.create({
      name: 'Low Points Rider',
      address: 'Address',
      phone: 9876543213,
      email: 'low@test.com',
      emergencyNumber: 9876543214,
      password: 'password123',
      vehicleCapacity: 100,
      licenseNumber: 'LIC456',
      vehicleNumber: 'VEH456',
      typeOfVehicle: 'Bike',
      approved: true,
      points: 30, // Less than 50 required
      totalDeliveries: 3,
      redeemedPoints: 0,
    });

    const pointsRequired = partner.pointsRequired; // 50

    const updatedRider = await Delivery.findOneAndUpdate(
      { _id: lowPointsRider._id, points: { $gte: pointsRequired } },
      { $inc: { points: -pointsRequired, redeemedPoints: pointsRequired } },
      { new: true }
    );

    expect(updatedRider).toBeNull(); // Should fail due to points check
  });

  test('calculates milestone progress correctly', () => {
    const MILESTONES = [
      { milestone: '50 Deliveries', threshold: 50, reward: '500 Points' },
      { milestone: '100 Deliveries', threshold: 100, reward: '1000 Points' },
      { milestone: '250 Deliveries', threshold: 250, reward: '2500 Points' },
      { milestone: '500 Deliveries', threshold: 500, reward: '5000 Points' },
    ];

    let foundInProgress = false;
    const milestones = MILESTONES.map((m) => {
      if (rider.totalDeliveries >= m.threshold) {
        return { ...m, status: 'completed', progress: 100 };
      }
      if (!foundInProgress) {
        foundInProgress = true;
        const progress = Math.round((rider.totalDeliveries / m.threshold) * 100);
        return { ...m, status: 'in-progress', progress };
      }
      return { ...m, status: 'upcoming', progress: 0 };
    });

    expect(milestones[0].status).toBe('in-progress');
    expect(milestones[0].progress).toBe(30); // 15/50 = 30%
    expect(milestones[1].status).toBe('upcoming');
    expect(milestones[2].status).toBe('upcoming');
  });

  test('calculates average rating from completed rides', async () => {
    // Import Ride model
    const Ride = (await import('../../model/ride.model.js')).default;

    // Create rides with ratings
    await Ride.create({
      donor: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      pickup: 'Pickup',
      destination: 'Destination',
      donation: new mongoose.Types.ObjectId(),
      rider: rider._id,
      status: 'completed',
      riderRating: 5,
    });
    await Ride.create({
      donor: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      pickup: 'Pickup',
      destination: 'Destination',
      donation: new mongoose.Types.ObjectId(),
      rider: rider._id,
      status: 'completed',
      riderRating: 4,
    });

    const allRides = await Ride.find({
      rider: rider._id,
      riderRating: { $gt: 0 },
    });

    const totalRatings = allRides.length;
    const sumRatings = allRides.reduce((sum, r) => sum + r.riderRating, 0);
    const averageRating = Math.round((sumRatings / totalRatings) * 10) / 10;

    expect(totalRatings).toBe(2);
    expect(averageRating).toBe(4.5);
  });
});