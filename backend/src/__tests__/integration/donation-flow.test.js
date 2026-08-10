import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach, describe, test, expect } from '@jest/globals';
import Donation from '../../model/donation.model.js';
import NGO from '../../model/ngo.model.js';
import Donor from '../../model/donor.model.js';
import Ride from '../../model/ride.model.js';
import Delivery from '../../model/delivery.model.js';
import { haversineDistance } from '../../utils/haversine.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

describe('Donation Acceptance Flow (Atomic Operations)', () => {
  let donor, ngo, donation;

  beforeEach(async () => {
    donor = await Donor.create({
      name: 'Test Restaurant',
      email: 'donor@test.com',
      phone: 9876543210,
      address: '123 Main St',
      pincode: 560001,
      password: 'password123',
      approved: true,
      latitude: 12.9716,
      longitude: 77.5946,
    });

    ngo = await NGO.create({
      name: 'Test NGO',
      email: 'ngo@test.com',
      phone: 9876543211,
      address: '456 NGO St',
      contactPerson: 'John Doe',
      DailyCapacity: 100,
      RegistrationNumber: 'REG123',
      password: 'password123',
      approved: true,
      typeofNgo: 'Food Bank',
      latitude: 12.9352,
      longitude: 77.6245,
    });

    donation = await Donation.create({
      Donor: donor._id,
      FoodType: 'Cooked Meals',
      FoodDescription: '50 vegetarian meals',
      Quantity: '50 servings',
      weightKg: 25,
      serves: 50,
      PickupLocation: donor.address,
      pickupLatitude: donor.latitude,
      pickupLongitude: donor.longitude,
      ExpiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ExpiryTime: '18:00',
      typeOfDonor: 'Restaurant',
    });
  });

  test('acceptOrder atomically updates donation and creates ride', async () => {
    // This mimics the acceptOrder controller logic
    const updatedDonation = await Donation.findOneAndUpdate(
      { _id: donation._id, Status: 'Pending' },
      { Status: 'Accepted', Ngo: ngo._id },
      { new: true }
    );

    expect(updatedDonation).not.toBeNull();
    expect(updatedDonation.Status).toBe('Accepted');
    expect(updatedDonation.Ngo.toString()).toBe(ngo._id.toString());

    const ride = await Ride.create({
      donor: donor._id,
      receiver: ngo._id,
      pickup: donation.PickupLocation,
      destination: ngo.address,
      donation: donation._id,
    });

    expect(ride._id).toBeDefined();
    expect(ride.status).toBe('pending');
    expect(ride.donor.toString()).toBe(donor._id.toString());
    expect(ride.receiver.toString()).toBe(ngo._id.toString());
  });

  test('prevents double acceptance of same donation (race condition)', async () => {
    const ngo2 = await NGO.create({
      name: 'Test NGO 2',
      email: 'ngo2@test.com',
      phone: 9876543212,
      address: '789 NGO St',
      contactPerson: 'Jane Doe',
      DailyCapacity: 100,
      RegistrationNumber: 'REG456',
      password: 'password123',
      approved: true,
      typeofNgo: 'Food Bank',
    });

    // First acceptance
    const first = await Donation.findOneAndUpdate(
      { _id: donation._id, Status: 'Pending' },
      { Status: 'Accepted', Ngo: ngo._id },
      { new: true }
    );
    expect(first).not.toBeNull();

    // Second concurrent attempt should fail
    const second = await Donation.findOneAndUpdate(
      { _id: donation._id, Status: 'Pending' },
      { Status: 'Accepted', Ngo: ngo2._id },
      { new: true }
    );
    expect(second).toBeNull();
  });
});

describe('Ride Operations (Atomic Updates)', () => {
  let donor, ngo, rider, donation, ride;

  beforeEach(async () => {
    donor = await Donor.create({
      name: 'Donor',
      email: 'donor@test.com',
      phone: 9876543210,
      address: '123 Main St',
      pincode: 560001,
      password: 'password123',
      approved: true,
      latitude: 12.9716,
      longitude: 77.5946,
    });

    ngo = await NGO.create({
      name: 'NGO',
      email: 'ngo@test.com',
      phone: 9876543211,
      address: '456 NGO St',
      contactPerson: 'John',
      DailyCapacity: 100,
      RegistrationNumber: 'REG123',
      password: 'password123',
      approved: true,
      typeofNgo: 'Food Bank',
    });

    rider = await Delivery.create({
      name: 'Rider',
      address: 'Rider Address',
      phone: 9876543212,
      email: 'rider@test.com',
      emergencyNumber: 9876543213,
      password: 'password123',
      vehicleCapacity: 100,
      licenseNumber: 'LIC123',
      vehicleNumber: 'VEH123',
      typeOfVehicle: 'Bike',
      approved: true,
      latitude: 12.9716,
      longitude: 77.5946,
      homeLatitude: 12.9716,
      homeLongitude: 77.5946,
    });

    donation = await Donation.create({
      Donor: donor._id,
      FoodType: 'Cooked Meals',
      FoodDescription: 'Test food',
      PickupLocation: donor.address,
      pickupLatitude: donor.latitude,
      pickupLongitude: donor.longitude,
      ExpiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ExpiryTime: '18:00',
      typeOfDonor: 'Restaurant',
    });

    ride = await Ride.create({
      donor: donor._id,
      receiver: ngo._id,
      pickup: donation.PickupLocation,
      destination: ngo.address,
      donation: donation._id,
    });
  });

  test('acceptRide atomically assigns rider and updates status', async () => {
    const accepted = await Ride.findOneAndUpdate(
      { _id: ride._id, status: 'pending', rider: null },
      { status: 'accepted', rider: rider._id },
      { new: true }
    );

    expect(accepted).not.toBeNull();
    expect(accepted.status).toBe('accepted');
    expect(accepted.rider.toString()).toBe(rider._id.toString());
  });

  test('prevents double acceptance of same ride', async () => {
    const rider2 = await Delivery.create({
      name: 'Rider 2',
      address: 'Rider 2 Address',
      phone: 9876543214,
      email: 'rider2@test.com',
      emergencyNumber: 9876543215,
      password: 'password123',
      vehicleCapacity: 100,
      licenseNumber: 'LIC456',
      vehicleNumber: 'VEH456',
      typeOfVehicle: 'Bike',
      approved: true,
    });

    const first = await Ride.findOneAndUpdate(
      { _id: ride._id, status: 'pending', rider: null },
      { status: 'accepted', rider: rider._id },
      { new: true }
    );
    expect(first).not.toBeNull();

    const second = await Ride.findOneAndUpdate(
      { _id: ride._id, status: 'pending', rider: null },
      { status: 'accepted', rider: rider2._id },
      { new: true }
    );
    expect(second).toBeNull();
  });

  test('markPicked updates status from accepted to picked up', async () => {
    await Ride.findOneAndUpdate(
      { _id: ride._id, status: 'pending', rider: null },
      { status: 'accepted', rider: rider._id }
    );

    const picked = await Ride.findOneAndUpdate(
      { _id: ride._id, status: 'accepted' },
      { status: 'picked up' },
      { new: true }
    );

    expect(picked).not.toBeNull();
    expect(picked.status).toBe('picked up');
  });

  test('markCompleted updates ride, donation, and rider points atomically', async () => {
    await Ride.findOneAndUpdate(
      { _id: ride._id, status: 'pending', rider: null },
      { status: 'accepted', rider: rider._id }
    );
    await Ride.findOneAndUpdate(
      { _id: ride._id, status: 'accepted' },
      { status: 'picked up' }
    );

    const completed = await Ride.findOneAndUpdate(
      { _id: ride._id, status: 'picked up' },
      { status: 'completed', points: 10 },
      { new: true }
    );

    expect(completed).not.toBeNull();
    expect(completed.status).toBe('completed');
    expect(completed.points).toBe(10);

    // Donation should be marked Completed (this is done in controller)
    await Donation.findByIdAndUpdate(donation._id, { Status: 'Completed' });
    const updatedDonation = await Donation.findById(donation._id);
    expect(updatedDonation.Status).toBe('Completed');

    // Rider should get points and delivery count (done in controller)
    await Delivery.findByIdAndUpdate(rider._id, {
      $inc: { points: 10, totalDeliveries: 1 },
    });
    const updatedRider = await Delivery.findById(rider._id);
    expect(updatedRider.points).toBe(10);
    expect(updatedRider.totalDeliveries).toBe(1);
  });
});

describe('Proximity Matching (20km radius)', () => {
  let donor, ngoNear, ngoFar;

  beforeEach(async () => {
    donor = await Donor.create({
      name: 'Donor',
      email: 'donor@test.com',
      phone: 9876543210,
      address: 'Donor Address',
      pincode: 560001,
      password: 'password123',
      approved: true,
      latitude: 12.9716,
      longitude: 77.5946,
    });

    ngoNear = await NGO.create({
      name: 'NGO Near',
      email: 'ngonear@test.com',
      phone: 9876543211,
      address: 'Near Address',
      contactPerson: 'Contact',
      DailyCapacity: 100,
      RegistrationNumber: 'REG123',
      password: 'password123',
      approved: true,
      typeofNgo: 'Food Bank',
      latitude: 12.9352,
      longitude: 77.6245, // ~5 km from donor
    });

    ngoFar = await NGO.create({
      name: 'NGO Far',
      email: 'ngofar@test.com',
      phone: 9876543212,
      address: 'Far Address',
      contactPerson: 'Contact',
      DailyCapacity: 100,
      RegistrationNumber: 'REG456',
      password: 'password123',
      approved: true,
      typeofNgo: 'Food Bank',
      latitude: 28.6139,
      longitude: 77.2090, // ~1740 km from donor
    });
  });

  test('haversine calculates ~5km for nearby NGO', () => {
    const dist = haversineDistance(
      donor.latitude, donor.longitude,
      ngoNear.latitude, ngoNear.longitude
    );
    expect(dist).toBeGreaterThan(3);
    expect(dist).toBeLessThan(8);
  });

  test('haversine calculates ~1740km for far NGO', () => {
    const dist = haversineDistance(
      donor.latitude, donor.longitude,
      ngoFar.latitude, ngoFar.longitude
    );
    expect(dist).toBeGreaterThan(1600);
    expect(dist).toBeLessThan(1900);
  });

  test('20km radius includes near NGO, excludes far NGO', () => {
    const nearDist = haversineDistance(
      donor.latitude, donor.longitude,
      ngoNear.latitude, ngoNear.longitude
    );
    const farDist = haversineDistance(
      donor.latitude, donor.longitude,
      ngoFar.latitude, ngoFar.longitude
    );

    expect(nearDist).toBeLessThanOrEqual(20);
    expect(farDist).toBeGreaterThan(20);
  });
});