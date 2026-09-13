import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateParkingOptions } from '../src/services/aiRecommender.js';

test('AI Recommender - basic recommendation for Bhavnagar Central Market', () => {
  const mockFacilities = [
    {
      id: 'p1',
      tag: 'P1',
      name: 'Market Multilevel Hub',
      availableSpaces: 18,
      totalSpaces: 30,
      pricePerHour: 20,
      twoWheelerPricePerHour: 10,
      demandLevel: 'Medium',
      distanceKm: { 'Bhavnagar Central Market': 0.8 },
      walkMins: { 'Bhavnagar Central Market': 4 }
    },
    {
      id: 'p2',
      tag: 'P2',
      name: 'Darbargadh Civic Lot',
      availableSpaces: 2,
      totalSpaces: 20,
      pricePerHour: 15,
      twoWheelerPricePerHour: 10,
      demandLevel: 'High',
      distanceKm: { 'Bhavnagar Central Market': 0.4 },
      walkMins: { 'Bhavnagar Central Market': 2 }
    }
  ];

  const result = evaluateParkingOptions(mockFacilities, 'Bhavnagar Central Market', '4w');
  assert.ok(result, 'Result should not be null');
  assert.equal(result.bestOption.id, 'p1', 'P1 should be recommended because P2 has critically low spaces (2 left)');
  assert.ok(result.bestOption.aiScore > 0, 'Score should be positive');
  assert.ok(result.rationale.includes('Market Multilevel Hub'), 'Rationale should mention facility name');
});

test('AI Recommender - EV filter only selects facilities with EV charging', () => {
  const mockFacilities = [
    {
      id: 'p1',
      name: 'No EV Lot',
      evChargingSpaces: 0,
      availableSpaces: 25,
      totalSpaces: 30,
      pricePerHour: 15,
      distanceKm: { 'Kalanala': 0.2 },
      walkMins: { 'Kalanala': 2 }
    },
    {
      id: 'p2',
      name: 'EV Superhub',
      evChargingSpaces: 6,
      availableSpaces: 10,
      totalSpaces: 20,
      pricePerHour: 20,
      distanceKm: { 'Kalanala': 0.6 },
      walkMins: { 'Kalanala': 5 }
    }
  ];

  const result = evaluateParkingOptions(mockFacilities, 'Kalanala', 'ev');
  assert.equal(result.bestOption.id, 'p2', 'EV filter should select EV Superhub even if it is slightly further away');
});

test('AI Recommender - 2W rate applies twoWheelerPricePerHour', () => {
  const mockFacilities = [
    {
      id: 'p1',
      name: 'Bike Friendly Lot',
      availableSpaces: 15,
      totalSpaces: 30,
      pricePerHour: 25,
      twoWheelerPricePerHour: 10,
      distanceKm: { 'Nilambaug': 0.5 },
      walkMins: { 'Nilambaug': 3 }
    }
  ];

  const result = evaluateParkingOptions(mockFacilities, 'Nilambaug', '2w');
  assert.equal(result.bestOption.calcPrice, 10, 'Calc price should be two wheeler price (10)');
});

test('AI Recommender - Handles 100% full capacity gracefully', () => {
  const mockFacilities = [
    {
      id: 'p1',
      name: 'Full Facility',
      availableSpaces: 0,
      totalSpaces: 30,
      pricePerHour: 20,
      demandLevel: 'Saturated',
      distanceKm: { 'Takhteshwar': 0.3 },
      walkMins: { 'Takhteshwar': 2 }
    }
  ];

  const result = evaluateParkingOptions(mockFacilities, 'Takhteshwar', '4w');
  assert.equal(result.bestOption.aiScore, 0, 'Full facility should have AI score of 0');
  assert.ok(result.rationale.includes('at capacity') || result.rationale.includes('diversion'), 'Rationale should mention diversion');
});

test('AI Recommender - Handles string numerical values from database PDO', () => {
  const mockFacilities = [
    {
      id: 'p1',
      name: 'DB String Values',
      availableSpaces: '14',
      totalSpaces: '35',
      pricePerHour: '20',
      twoWheelerPricePerHour: '10',
      demandLevel: null,
      distanceKm: { 'Bhavnagar Railway Station': '1.2' },
      walkMins: { 'Bhavnagar Railway Station': '8' }
    }
  ];

  const result = evaluateParkingOptions(mockFacilities, 'Bhavnagar Railway Station', '4w');
  assert.ok(result.bestOption, 'Should handle null demandLevel and string numbers without error');
  assert.equal(typeof result.bestOption.aiScore, 'number');
  assert.ok(!Number.isNaN(result.bestOption.aiScore), 'aiScore should not be NaN');
});

test('AI Recommender - Null or empty facilities returns null', () => {
  assert.equal(evaluateParkingOptions([], 'Kalanala'), null);
  assert.equal(evaluateParkingOptions(null, 'Kalanala'), null);
});
