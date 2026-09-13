-- Migration to make database 100% complete
-- 1. Add amenities, svg_x, svg_y columns if not present
ALTER TABLE parking_facilities ADD COLUMN IF NOT EXISTS amenities JSON AFTER turnover_rate;
ALTER TABLE parking_facilities ADD COLUMN IF NOT EXISTS svg_x INT DEFAULT 100 AFTER longitude;
ALTER TABLE parking_facilities ADD COLUMN IF NOT EXISTS svg_y INT DEFAULT 100 AFTER svg_x;

-- 2. Update amenities and SVG coordinates for all 12 facilities
UPDATE parking_facilities SET 
  amenities = '["CCTV 24/7", "Covered Basement", "EV Fast Charging", "FASTag Auto-Exit", "Elevator Access"]',
  svg_x = 120, svg_y = 210
WHERE id = 'parking-a';

UPDATE parking_facilities SET 
  amenities = '["Open Paved", "FASTag Exit", "Guard on Duty", "CCTV Monitoring"]',
  svg_x = 180, svg_y = 130
WHERE id = 'parking-b';

UPDATE parking_facilities SET 
  amenities = '["Multi-Elevator", "SMS Alert on Vacancy", "Covered Basement", "CCTV 24/7"]',
  svg_x = 300, svg_y = 230
WHERE id = 'parking-c';

UPDATE parking_facilities SET 
  amenities = '["Two-Wheeler Priority", "Shaded Canopy", "UPI Direct Pay", "CCTV Monitoring"]',
  svg_x = 380, svg_y = 160
WHERE id = 'parking-d';

UPDATE parking_facilities SET 
  amenities = '["Luggage Ramp", "FASTag Auto-Debit", "24/7 Security", "CCTV Surveillance"]',
  svg_x = 140, svg_y = 80
WHERE id = 'parking-rail-1';

UPDATE parking_facilities SET 
  amenities = '["Spacious Bays", "EV Charging Hub", "Covered Flyover", "ANPR Cameras"]',
  svg_x = 90, svg_y = 110
WHERE id = 'parking-rail-2';

UPDATE parking_facilities SET 
  amenities = '["Multi-Level Automated Ramp", "FASTag Barrier", "Bank Plaza Walkway", "CCTV"]',
  svg_x = 210, svg_y = 150
WHERE id = 'parking-kala-1';

UPDATE parking_facilities SET 
  amenities = '["Valet Assistance", "High Security", "Commercial Access"]',
  svg_x = 260, svg_y = 180
WHERE id = 'parking-kala-2';

UPDATE parking_facilities SET 
  amenities = '["Shaded Tree Canopy", "Heritage Boulevard", "EV Fast Charger", "CCTV"]',
  svg_x = 280, svg_y = 270
WHERE id = 'parking-nilam-1';

UPDATE parking_facilities SET 
  amenities = '["Paved Surface", "Security Kiosk", "Receipt Printer"]',
  svg_x = 230, svg_y = 250
WHERE id = 'parking-nilam-2';

UPDATE parking_facilities SET 
  amenities = '["Pilgrim Rest Bay", "Drinking Water Kiosk", "EV Fast Charging", "CCTV 24/7", "Bus & Car Slots"]',
  svg_x = 340, svg_y = 280
WHERE id = 'parking-takh-1';

UPDATE parking_facilities SET 
  amenities = '["Staircase Access", "Shaded Trees", "Manual Token"]',
  svg_x = 390, svg_y = 260
WHERE id = 'parking-takh-2';

-- 3. Replace parking_distances with the full 60 matrix entries (12 facilities x 5 destinations)
TRUNCATE TABLE parking_distances;

INSERT INTO parking_distances (facility_id, destination_id, distance_km, walk_mins) VALUES
-- Parking A (Market Multilevel Hub)
('parking-a', 'central-market', 0.8, 4),
('parking-a', 'railway-station', 1.6, 12),
('parking-a', 'kalanala', 1.4, 10),
('parking-a', 'nilambaug', 2.1, 16),
('parking-a', 'takhteshwar', 2.4, 18),

-- Parking B (Gandhi Smriti Plaza Lot)
('parking-b', 'central-market', 1.2, 6),
('parking-b', 'railway-station', 0.5, 4),
('parking-b', 'kalanala', 0.9, 7),
('parking-b', 'nilambaug', 1.5, 11),
('parking-b', 'takhteshwar', 2.0, 15),

-- Parking C (Waghawadi Road Municipal Complex)
('parking-c', 'central-market', 1.5, 8),
('parking-c', 'railway-station', 2.2, 16),
('parking-c', 'kalanala', 1.2, 9),
('parking-c', 'nilambaug', 1.1, 8),
('parking-c', 'takhteshwar', 1.4, 10),

-- Parking D (Barton Library Civic Stand)
('parking-d', 'central-market', 1.9, 11),
('parking-d', 'railway-station', 1.2, 9),
('parking-d', 'kalanala', 0.7, 5),
('parking-d', 'nilambaug', 1.8, 14),
('parking-d', 'takhteshwar', 2.2, 16),

-- Parking R1 (Station East Terminal Bay)
('parking-rail-1', 'central-market', 1.8, 14),
('parking-rail-1', 'railway-station', 0.2, 2),
('parking-rail-1', 'kalanala', 1.1, 8),
('parking-rail-1', 'nilambaug', 2.4, 18),
('parking-rail-1', 'takhteshwar', 2.8, 22),

-- Parking R2 (Navpara Station Underbridge Parking)
('parking-rail-2', 'central-market', 1.6, 12),
('parking-rail-2', 'railway-station', 0.5, 4),
('parking-rail-2', 'kalanala', 0.8, 6),
('parking-rail-2', 'nilambaug', 2.0, 15),
('parking-rail-2', 'takhteshwar', 2.5, 19),

-- Parking K1 (Kalanala Circle Multi-Deck)
('parking-kala-1', 'central-market', 1.3, 9),
('parking-kala-1', 'railway-station', 1.0, 7),
('parking-kala-1', 'kalanala', 0.3, 3),
('parking-kala-1', 'nilambaug', 1.2, 9),
('parking-kala-1', 'takhteshwar', 1.9, 14),

-- Parking K2 (Panwadi Commercial Arcade Stand)
('parking-kala-2', 'central-market', 1.1, 8),
('parking-kala-2', 'railway-station', 1.4, 10),
('parking-kala-2', 'kalanala', 0.6, 5),
('parking-kala-2', 'nilambaug', 1.4, 11),
('parking-kala-2', 'takhteshwar', 1.8, 13),

-- Parking N1 (Nilambaug Palace Circle Bay)
('parking-nilam-1', 'central-market', 2.0, 15),
('parking-nilam-1', 'railway-station', 2.3, 17),
('parking-nilam-1', 'kalanala', 1.2, 9),
('parking-nilam-1', 'nilambaug', 0.4, 3),
('parking-nilam-1', 'takhteshwar', 0.9, 7),

-- Parking N2 (Court Road Heritage Compound)
('parking-nilam-2', 'central-market', 1.7, 13),
('parking-nilam-2', 'railway-station', 2.0, 15),
('parking-nilam-2', 'kalanala', 1.0, 8),
('parking-nilam-2', 'nilambaug', 0.8, 6),
('parking-nilam-2', 'takhteshwar', 1.2, 9),

-- Parking T1 (Takhteshwar Hill Base Plaza)
('parking-takh-1', 'central-market', 2.3, 17),
('parking-takh-1', 'railway-station', 2.7, 20),
('parking-takh-1', 'kalanala', 1.8, 13),
('parking-takh-1', 'nilambaug', 0.9, 7),
('parking-takh-1', 'takhteshwar', 0.3, 2),

-- Parking T2 (Hillside North Footway Lot)
('parking-takh-2', 'central-market', 2.1, 16),
('parking-takh-2', 'railway-station', 2.5, 19),
('parking-takh-2', 'kalanala', 1.6, 12),
('parking-takh-2', 'nilambaug', 1.1, 8),
('parking-takh-2', 'takhteshwar', 0.7, 5);
