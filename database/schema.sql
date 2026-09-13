-- ========================================================
-- Bhavnagar Smart Parking Database Schema (MariaDB / MySQL)
-- DDEV Database: `db`
-- ========================================================

DROP TABLE IF EXISTS digital_passes;
DROP TABLE IF EXISTS sensor_telemetry;
DROP TABLE IF EXISTS parking_distances;
DROP TABLE IF EXISTS parking_facilities;
DROP TABLE IF EXISTS destinations;

-- 1. Popular Destinations Table
CREATE TABLE destinations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Parking Facilities Master Table
CREATE TABLE parking_facilities (
    id VARCHAR(50) PRIMARY KEY,
    tag VARCHAR(20) NOT NULL,
    short_code VARCHAR(10) NOT NULL,
    name VARCHAR(150) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    status ENUM('available', 'limited', 'full') DEFAULT 'available',
    ownership_type ENUM('public', 'private') DEFAULT 'public',
    address TEXT NOT NULL,
    corridor VARCHAR(100),
    total_spaces INT NOT NULL,
    available_spaces INT NOT NULL,
    occupied_spaces INT NOT NULL,
    four_wheeler_total INT NOT NULL,
    four_wheeler_avail INT NOT NULL,
    two_wheeler_total INT NOT NULL,
    two_wheeler_avail INT NOT NULL,
    ev_charging_spaces INT DEFAULT 0,
    price_per_hour DECIMAL(8, 2) NOT NULL,
    two_wheeler_price_per_hour DECIMAL(8, 2) NOT NULL,
    full_day_pass DECIMAL(8, 2) NOT NULL,
    operating_hours VARCHAR(100),
    security_guard VARCHAR(100),
    demand_level VARCHAR(50),
    turnover_rate VARCHAR(100),
    amenities JSON,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    svg_x INT DEFAULT 100,
    svg_y INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Precomputed Distance & Walking Times to Destinations
CREATE TABLE parking_distances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facility_id VARCHAR(50) NOT NULL,
    destination_id VARCHAR(50) NOT NULL,
    distance_km DECIMAL(4, 2) NOT NULL,
    walk_mins INT NOT NULL,
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- 4. Real-Time Sensor Telemetry Logs
CREATE TABLE sensor_telemetry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_id VARCHAR(50) NOT NULL,
    bay_number VARCHAR(20) NOT NULL,
    vehicle_type ENUM('4w', '2w', 'ev') DEFAULT '4w',
    event_type ENUM('entry', 'exit', 'occupied', 'vacant') NOT NULL,
    vehicle_plate VARCHAR(20),
    rfid_tag_id VARCHAR(50),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id) ON DELETE CASCADE
);

-- 5. Digital Passes & FASTag Gate Check-ins
CREATE TABLE digital_passes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pass_code VARCHAR(50) UNIQUE NOT NULL,
    facility_id VARCHAR(50) NOT NULL,
    bay_code VARCHAR(20) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    vehicle_type ENUM('4w', '2w', 'ev') DEFAULT '4w',
    fastag_enabled BOOLEAN DEFAULT TRUE,
    tariff_rate DECIMAL(8, 2) NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grace_period_mins INT DEFAULT 25,
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id) ON DELETE CASCADE
);

-- ========================================================
-- DATA SEEDING: 5 Popular Destinations
-- ========================================================
INSERT INTO destinations (id, name, zone, latitude, longitude, description) VALUES
('central-market', 'Bhavnagar Central Market', 'Central Market', 21.764500, 72.151900, 'Heart of commercial trade, MG Road & Old Vegetable Market area'),
('railway-station', 'Bhavnagar Railway Station', 'Railway Station', 21.774500, 72.143200, 'Main rail transit terminus & Station Road interchange'),
('kalanala', 'Kalanala', 'Kalanala Hub', 21.769000, 72.138000, 'Vibrant administrative, banking, and retail boulevard'),
('nilambaug', 'Nilambaug', 'Nilambaug Palace', 21.758000, 72.139900, 'Heritage palace perimeter, high court road, and upscale avenues'),
('takhteshwar', 'Takhteshwar', 'Takhteshwar Hill', 21.754000, 72.146500, 'Historic hilltop temple, civic vistas, and pilgrim walkways');

-- ========================================================
-- DATA SEEDING: 12 Managed Municipal Parking Facilities
-- Telemetry totals: 12 facilities, 186 available, 294 occupied, 3 full
-- ========================================================
INSERT INTO parking_facilities 
(id, tag, short_code, name, zone, status, ownership_type, address, corridor, total_spaces, available_spaces, occupied_spaces, four_wheeler_total, four_wheeler_avail, two_wheeler_total, two_wheeler_avail, ev_charging_spaces, price_per_hour, two_wheeler_price_per_hour, full_day_pass, operating_hours, security_guard, demand_level, turnover_rate, amenities, latitude, longitude, svg_x, svg_y)
VALUES
('parking-a', 'Parking A', 'P1', 'Market Multilevel Hub', 'Central Market', 'available', 'public', 'Plot 14, MG Road, near Old Vegetable Market, Bhavnagar 364001', 'MG Road Corridor', 30, 18, 12, 20, 12, 10, 6, 4, 20.00, 10.00, 120.00, '24 Hours Open (BMC Multi-Deck)', 'BMC Security Guard on-site', 'Medium', 'High (12 vehicles/hr)', '["CCTV 24/7", "Covered Basement", "EV Fast Charging", "FASTag Auto-Exit", "Elevator Access"]', 21.764500, 72.151900, 120, 210),
('parking-b', 'Parking B', 'P2', 'Gandhi Smriti Plaza Lot', 'Central Market', 'limited', 'public', 'Crescent Circle Road, near Gandhi Smriti Museum, Bhavnagar 364001', 'Crescent Perimeter', 25, 5, 20, 15, 3, 10, 2, 2, 15.00, 10.00, 100.00, '06:00 AM - 11:30 PM (BMC Open Lot)', 'Guard on Duty', 'High', 'Very High (22 vehicles/hr)', '["Open Paved", "FASTag Exit", "Guard on Duty", "CCTV Monitoring"]', 21.768000, 72.148000, 180, 130),
('parking-c', 'Parking C', 'P3', 'Waghawadi Road Municipal Complex', 'Central Market', 'full', 'public', 'Near Sanskar Mandal, Waghawadi Road, Bhavnagar 364002', 'Waghawadi Spine', 20, 0, 20, 14, 0, 6, 0, 2, 20.00, 10.00, 140.00, '24 Hours Open (Underpass Level 1 & 2)', 'Enforcement Wardens Active', 'Critical (Saturated)', 'Slow queue (next vacancy ~12 min)', '["Multi-Elevator", "SMS Alert on Vacancy", "Covered Basement", "CCTV 24/7"]', 21.758000, 72.145000, 300, 230),
('parking-d', 'Parking D', 'P4', 'Barton Library Civic Stand', 'Central Market', 'available', 'public', 'Diwanpara Road, opposite Barton Heritage Library, Bhavnagar 364001', 'Diwanpara Heritage Track', 40, 22, 18, 20, 10, 20, 12, 0, 10.00, 5.00, 80.00, '07:00 AM - 10:00 PM (Heritage Zone Lot)', 'Civic Attendant Present', 'Low-Medium', 'Steady', '["Two-Wheeler Priority", "Shaded Canopy", "UPI Direct Pay", "CCTV Monitoring"]', 21.769000, 72.155000, 380, 160),
('parking-rail-1', 'Parking R1', 'R1', 'Station East Terminal Bay', 'Railway Station', 'available', 'public', 'Station Road, Adjacent to Platform 1 Concourse, Bhavnagar 364001', 'Platform 1 Concourse', 40, 12, 28, 24, 7, 16, 5, 3, 20.00, 10.00, 150.00, '24 Hours Open (Railway Transit Access)', 'Railway Protection & BMC Staff', 'High', 'Rapid express transit flow', '["Luggage Ramp", "FASTag Auto-Debit", "24/7 Security", "CCTV Surveillance"]', 21.775000, 72.143500, 140, 80),
('parking-rail-2', 'Parking R2', 'R2', 'Navpara Station Underbridge Parking', 'Railway Station', 'available', 'public', 'Navpara Underpass Loop, Near Railway Yard, Bhavnagar 364001', 'Navpara Flyover Span', 65, 32, 33, 40, 20, 25, 12, 6, 15.00, 5.00, 100.00, '24 Hours Open (Shaded Flyover Lot)', '24/7 Gate Guard', 'Moderate', 'Continuous', '["Spacious Bays", "EV Charging Hub", "Covered Flyover", "ANPR Cameras"]', 21.773000, 72.141000, 90, 110),
('parking-kala-1', 'Parking K1', 'K1', 'Kalanala Circle Multi-Deck', 'Kalanala Hub', 'available', 'public', 'Kalanala Main Chowk, opposite SBI Zonal Office, Bhavnagar 364001', 'Kalanala Main Chowk', 45, 24, 21, 30, 16, 15, 8, 4, 20.00, 10.00, 130.00, '07:00 AM - Midnight', 'On-site Traffic Attendant', 'Medium', 'Commercial retail rhythm', '["Multi-Level Automated Ramp", "FASTag Barrier", "Bank Plaza Walkway", "CCTV"]', 21.769500, 72.138500, 210, 150),
('parking-kala-2', 'Parking K2', 'K2', 'Panwadi Commercial Arcade Stand', 'Kalanala Hub', 'full', 'private', 'Panwadi Main Road, Near Diamond Market, Bhavnagar 364001', 'Panwadi Diamond Market', 30, 0, 30, 20, 0, 10, 0, 2, 25.00, 10.00, 160.00, '08:00 AM - 10:00 PM', 'Private Arcade Security', 'Peak Saturated', 'Low turnover (merchant reserved)', '["Valet Assistance", "High Security", "Commercial Access"]', 21.767000, 72.139000, 260, 180),
('parking-nilam-1', 'Parking N1', 'N1', 'Nilambaug Palace Circle Bay', 'Nilambaug Palace', 'available', 'public', 'Palace Road, Near Nilambaug Gate 2, Bhavnagar 364002', 'Palace Circle Boulevard', 45, 26, 19, 30, 18, 15, 8, 4, 15.00, 5.00, 110.00, '06:00 AM - 11:00 PM', 'BMC Civic Warden', 'Moderate', 'Steady tourist & dinner flow', '["Shaded Tree Canopy", "Heritage Boulevard", "EV Fast Charger", "CCTV"]', 21.758500, 72.140500, 280, 270),
('parking-nilam-2', 'Parking N2', 'N2', 'Court Road Heritage Compound', 'Nilambaug Palace', 'limited', 'private', 'District Court Road, Bhavnagar 364002', 'District Court Line', 25, 7, 18, 15, 4, 10, 3, 0, 15.00, 5.00, 90.00, '09:00 AM - 07:00 PM', 'Court Marshall on Duty', 'High During Court Hours', 'Moderate', '["Paved Surface", "Security Kiosk", "Receipt Printer"]', 21.761000, 72.141500, 230, 250),
('parking-takh-1', 'Parking T1', 'T1', 'Takhteshwar Hill Base Plaza', 'Takhteshwar Hill', 'available', 'public', 'Hill Base Road, Foot of Takhteshwar Temple, Bhavnagar 364002', 'Hill Base Pilgrimage Plaza', 85, 40, 45, 55, 26, 30, 14, 6, 10.00, 5.00, 70.00, '05:30 AM - 10:30 PM (Temple Hours)', 'Temple Trust & BMC Guards', 'High on Mornings & Weekends', 'Pilgrim cycle (45m average)', '["Pilgrim Rest Bay", "Drinking Water Kiosk", "EV Fast Charging", "CCTV 24/7", "Bus & Car Slots"]', 21.754500, 72.146000, 340, 280),
('parking-takh-2', 'Parking T2', 'T2', 'Hillside North Footway Lot', 'Takhteshwar Hill', 'full', 'private', 'North Stairs Foothill, Takhteshwar Hill, Bhavnagar 364002', 'Takhteshwar North Stairway', 30, 0, 30, 18, 0, 12, 0, 0, 10.00, 5.00, 60.00, '06:00 AM - 09:00 PM', 'Civic Attendant', 'Full Capacity (Peak Aarti Rush)', 'Saturated', '["Staircase Access", "Shaded Trees", "Manual Token"]', 21.756000, 72.148000, 390, 260);

-- ========================================================
-- DATA SEEDING: Complete 60-Pair Distances & Walking Matrix
-- ========================================================
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

-- ========================================================
-- DATA SEEDING: Initial Sample Digital Pass
-- ========================================================
INSERT INTO digital_passes (pass_code, facility_id, bay_code, vehicle_plate, vehicle_type, fastag_enabled, tariff_rate, status)
VALUES ('BMC-BHV-8492-P1', 'parking-a', 'Bay #P1-14', 'GJ-04-AB-1892', '4w', TRUE, 20.00, 'active');
