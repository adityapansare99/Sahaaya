// Pure function test — no MongoDB needed
import { haversineDistance, filterWithinRadius } from '../../utils/haversine.js';

describe('haversineDistance', () => {
  test('returns null if any coordinate is null/undefined', () => {
    expect(haversineDistance(null, 77, 12, 77)).toBeNull();
    expect(haversineDistance(12, null, 12, 77)).toBeNull();
    expect(haversineDistance(12, 77, null, 77)).toBeNull();
    expect(haversineDistance(12, 77, 12, null)).toBeNull();
  });

  test('calculates distance between two known points', () => {
    // Bangalore (12.9716, 77.5946) to Delhi (28.6139, 77.2090) ≈ 1740 km
    const dist = haversineDistance(12.9716, 77.5946, 28.6139, 77.2090);
    expect(dist).toBeGreaterThan(1600);
    expect(dist).toBeLessThan(1900);
  });

  test('returns 0 for same point', () => {
    const dist = haversineDistance(12.9716, 77.5946, 12.9716, 77.5946);
    expect(dist).toBeCloseTo(0, 5);
  });

  test('is symmetric', () => {
    const d1 = haversineDistance(12.9716, 77.5946, 28.6139, 77.2090);
    const d2 = haversineDistance(28.6139, 77.2090, 12.9716, 77.5946);
    expect(d1).toBeCloseTo(d2, 5);
  });

  test('small distance within same city', () => {
    // Bangalore (12.9716, 77.5946) to Indiranagar (12.9783, 77.6408) ≈ 5 km
    const dist = haversineDistance(12.9716, 77.5946, 12.9783, 77.6408);
    expect(dist).toBeGreaterThan(3);
    expect(dist).toBeLessThan(8);
  });
});

describe('filterWithinRadius', () => {
  const items = [
    { id: 1, latitude: 12.9716, longitude: 77.5946 }, // reference point
    { id: 2, latitude: 13.0827, longitude: 80.2707 }, // Chennai ~350 km
    { id: 3, latitude: 12.9352, longitude: 77.6245 }, // nearby ~5 km
    { id: 4, latitude: null, longitude: 77.5946 },     // missing coords
  ];

  test('filters items within radius and sorts by distance', () => {
    const result = filterWithinRadius(items, 12.9716, 77.5946, 10);
    expect(result).toHaveLength(2); // id=1 (0km) and id=3 (~5km)
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(3);
  });

  test('excludes items with null coordinates', () => {
    const result = filterWithinRadius(items, 12.9716, 77.5946, 500);
    expect(result.find(r => r.id === 4)).toBeUndefined();
  });

  test('returns only zero-distance item when radius is tiny', () => {
    const result = filterWithinRadius(items, 12.9716, 77.5946, 0.001); // tiny radius
    expect(result).toHaveLength(1); // only id=1 (itself, 0km)
    expect(result[0].id).toBe(1);
  });

  test('sorts by distance ascending', () => {
    const result = filterWithinRadius(items, 12.9716, 77.5946, 500);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].distanceKm).toBeLessThanOrEqual(result[i].distanceKm);
    }
  });
});
