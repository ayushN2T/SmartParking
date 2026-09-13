import test from 'node:test';
import assert from 'node:assert/strict';
import { getCitywideStats, PARKING_FACILITIES } from '../src/data/parkingLots.js';

test('getCitywideStats - computes correct stats for default PARKING_FACILITIES', () => {
  const stats = getCitywideStats(PARKING_FACILITIES);
  assert.equal(stats.totalFacilities, 12, 'Should have 12 facilities');
  assert.equal(typeof stats.availableSpaces, 'number');
  assert.equal(typeof stats.occupiedSpaces, 'number');
  assert.equal(typeof stats.totalCapacity, 'number');
  assert.equal(stats.availableSpaces + stats.occupiedSpaces, stats.totalCapacity, 'Spaces must add up to capacity');
  assert.ok(stats.overallOccupancyPct >= 0 && stats.overallOccupancyPct <= 100, 'Occupancy pct must be between 0 and 100');
  assert.equal(
    stats.fullLocations + stats.limitedLocations + stats.availableLocations,
    stats.totalFacilities,
    'Sum of full, limited, and available locations must equal totalFacilities'
  );
});

test('getCitywideStats - safely handles empty list without NaN', () => {
  const stats = getCitywideStats([]);
  assert.equal(stats.totalFacilities, 0);
  assert.equal(stats.availableSpaces, 0);
  assert.equal(stats.occupiedSpaces, 0);
  assert.equal(stats.totalCapacity, 0);
  assert.equal(stats.overallOccupancyPct, 0, 'Overall occupancy pct should be 0 when capacity is 0, not NaN');
});

test('getCitywideStats - handles string numbers from database PDO', () => {
  const mockFromDb = [
    { availableSpaces: '10', occupiedSpaces: '15', totalSpaces: '25' },
    { availableSpaces: '0', occupiedSpaces: '20', totalSpaces: '20' }
  ];

  const stats = getCitywideStats(mockFromDb);
  assert.equal(stats.totalFacilities, 2);
  assert.equal(stats.availableSpaces, 10);
  assert.equal(stats.occupiedSpaces, 35);
  assert.equal(stats.totalCapacity, 45);
  assert.equal(stats.fullLocations, 1);
  assert.ok(!Number.isNaN(stats.overallOccupancyPct), 'Occupancy pct must not be NaN');
});
