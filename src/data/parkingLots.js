// Bhavnagar Smart Parking - Master Dataset
// 12 Managed Municipal Facilities across 5 Key Zones
export const POPULAR_DESTINATIONS = [
  {
    id: "central-market",
    name: "Bhavnagar Central Market",
    coords: { lat: 21.7645, lng: 72.1519 },
    zone: "Central Market",
    description: "Heart of commercial trade, MG Road & Old Vegetable Market area",
    defaultRecommendedId: "parking-a"
  },
  {
    id: "railway-station",
    name: "Bhavnagar Railway Station",
    coords: { lat: 21.7745, lng: 72.1432 },
    zone: "Railway Station",
    description: "Main rail transit terminus & Station Road interchange",
    defaultRecommendedId: "parking-b"
  },
  {
    id: "kalanala",
    name: "Kalanala",
    coords: { lat: 21.7690, lng: 72.1380 },
    zone: "Kalanala Hub",
    description: "Vibrant administrative, banking, and retail boulevard",
    defaultRecommendedId: "parking-kala-1"
  },
  {
    id: "nilambaug",
    name: "Nilambaug",
    coords: { lat: 21.7580, lng: 72.1399 },
    zone: "Nilambaug Palace",
    description: "Heritage palace perimeter, high court road, and upscale avenues",
    defaultRecommendedId: "parking-nilam-1"
  },
  {
    id: "takhteshwar",
    name: "Takhteshwar",
    coords: { lat: 21.7540, lng: 72.1465 },
    zone: "Takhteshwar Hill",
    description: "Historic hilltop temple, civic vistas, and pilgrim walkways",
    defaultRecommendedId: "parking-takh-1"
  }
];

export const PARKING_FACILITIES = [
  // --- Zone 1: Bhavnagar Central Market ---
  {
    id: "parking-a",
    tag: "Parking A",
    shortCode: "P1",
    name: "Market Multilevel Hub",
    zone: "Central Market",
    badge: "Available",
    status: "available",
    ownershipType: "public",
    address: "Plot 14, MG Road, near Old Vegetable Market, Bhavnagar 364001",
    distanceKm: {
      "Bhavnagar Central Market": 0.8,
      "Bhavnagar Railway Station": 1.6,
      "Kalanala": 1.4,
      "Nilambaug": 2.1,
      "Takhteshwar": 2.4
    },
    walkMins: {
      "Bhavnagar Central Market": 4,
      "Bhavnagar Railway Station": 12,
      "Kalanala": 10,
      "Nilambaug": 16,
      "Takhteshwar": 18
    },
    totalSpaces: 30,
    availableSpaces: 18,
    occupiedSpaces: 12,
    fourWheelerSpaces: { total: 20, available: 12 },
    twoWheelerSpaces: { total: 10, available: 6 },
    evChargingSpaces: 4,
    pricePerHour: 20,
    twoWheelerPricePerHour: 10,
    fullDayPass: 120,
    operatingHours: "24 Hours Open (BMC Multi-Deck)",
    amenities: ["CCTV 24/7", "Covered Basement", "EV Fast Charging", "FASTag Auto-Exit", "Elevator Access"],
    securityGuard: "BMC Security Guard on-site",
    demandLevel: "Medium",
    turnoverRate: "High (12 vehicles/hr)",
    coords: { lat: 21.7645, lng: 72.1519 },
    svgCoords: { x: 120, y: 210 },
    corridor: "MG Road Corridor"
  },
  {
    id: "parking-b",
    tag: "Parking B",
    shortCode: "P2",
    name: "Gandhi Smriti Plaza Lot",
    zone: "Central Market",
    badge: "Limited",
    status: "limited",
    ownershipType: "public",
    address: "Crescent Circle Road, near Gandhi Smriti Museum, Bhavnagar 364001",
    distanceKm: {
      "Bhavnagar Central Market": 1.2,
      "Bhavnagar Railway Station": 0.5,
      "Kalanala": 0.9,
      "Nilambaug": 1.5,
      "Takhteshwar": 2.0
    },
    walkMins: {
      "Bhavnagar Central Market": 6,
      "Bhavnagar Railway Station": 4,
      "Kalanala": 7,
      "Nilambaug": 11,
      "Takhteshwar": 15
    },
    totalSpaces: 25,
    availableSpaces: 5,
    occupiedSpaces: 20,
    fourWheelerSpaces: { total: 15, available: 3 },
    twoWheelerSpaces: { total: 10, available: 2 },
    evChargingSpaces: 2,
    pricePerHour: 15,
    twoWheelerPricePerHour: 10,
    fullDayPass: 100,
    operatingHours: "06:00 AM - 11:30 PM (BMC Open Lot)",
    amenities: ["Open Paved", "FASTag Exit", "Guard on Duty", "CCTV Monitoring"],
    securityGuard: "Guard on Duty",
    demandLevel: "High",
    turnoverRate: "Very High (22 vehicles/hr)",
    coords: { lat: 21.7680, lng: 72.1480 },
    svgCoords: { x: 180, y: 130 },
    corridor: "Crescent Perimeter"
  },
  {
    id: "parking-c",
    tag: "Parking C",
    shortCode: "P3",
    name: "Waghawadi Road Municipal Complex",
    zone: "Central Market",
    badge: "Full",
    status: "full",
    ownershipType: "public",
    address: "Near Sanskar Mandal, Waghawadi Road, Bhavnagar 364002",
    distanceKm: {
      "Bhavnagar Central Market": 1.5,
      "Bhavnagar Railway Station": 2.2,
      "Kalanala": 1.2,
      "Nilambaug": 1.1,
      "Takhteshwar": 1.4
    },
    walkMins: {
      "Bhavnagar Central Market": 8,
      "Bhavnagar Railway Station": 16,
      "Kalanala": 9,
      "Nilambaug": 8,
      "Takhteshwar": 10
    },
    totalSpaces: 20,
    availableSpaces: 0,
    occupiedSpaces: 20,
    fourWheelerSpaces: { total: 14, available: 0 },
    twoWheelerSpaces: { total: 6, available: 0 },
    evChargingSpaces: 2,
    pricePerHour: 20,
    twoWheelerPricePerHour: 10,
    fullDayPass: 140,
    operatingHours: "24 Hours Open (Underpass Level 1 & 2)",
    amenities: ["Multi-Elevator", "SMS Alert on Vacancy", "Covered Basement", "CCTV 24/7"],
    securityGuard: "Enforcement Wardens Active",
    demandLevel: "Critical (Saturated)",
    turnoverRate: "Slow queue (next vacancy ~12 min)",
    coords: { lat: 21.7580, lng: 72.1450 },
    svgCoords: { x: 300, y: 230 },
    corridor: "Waghawadi Spine"
  },
  {
    id: "parking-d",
    tag: "Parking D",
    shortCode: "P4",
    name: "Barton Library Civic Stand",
    zone: "Central Market",
    badge: "Available",
    status: "available",
    ownershipType: "public",
    address: "Diwanpara Road, opposite Barton Heritage Library, Bhavnagar 364001",
    distanceKm: {
      "Bhavnagar Central Market": 1.9,
      "Bhavnagar Railway Station": 1.2,
      "Kalanala": 0.7,
      "Nilambaug": 1.8,
      "Takhteshwar": 2.2
    },
    walkMins: {
      "Bhavnagar Central Market": 11,
      "Bhavnagar Railway Station": 9,
      "Kalanala": 5,
      "Nilambaug": 14,
      "Takhteshwar": 16
    },
    totalSpaces: 40,
    availableSpaces: 22,
    occupiedSpaces: 18,
    fourWheelerSpaces: { total: 20, available: 10 },
    twoWheelerSpaces: { total: 20, available: 12 },
    evChargingSpaces: 0,
    pricePerHour: 10,
    twoWheelerPricePerHour: 5,
    fullDayPass: 80,
    operatingHours: "07:00 AM - 10:00 PM (Heritage Zone Lot)",
    amenities: ["Two-Wheeler Priority", "Shaded Canopy", "UPI Direct Pay", "CCTV Monitoring"],
    securityGuard: "Civic Attendant Present",
    demandLevel: "Low-Medium",
    turnoverRate: "Steady",
    coords: { lat: 21.7690, lng: 72.1550 },
    svgCoords: { x: 380, y: 160 },
    corridor: "Diwanpara Heritage Track"
  },

  // --- Zone 2: Bhavnagar Railway Station ---
  {
    id: "parking-rail-1",
    tag: "Parking R1",
    shortCode: "R1",
    name: "Station East Terminal Bay",
    zone: "Railway Station",
    badge: "Available",
    status: "available",
    ownershipType: "public",
    address: "Station Road, Adjacent to Platform 1 Concourse, Bhavnagar 364001",
    distanceKm: {
      "Bhavnagar Central Market": 1.8,
      "Bhavnagar Railway Station": 0.2,
      "Kalanala": 1.1,
      "Nilambaug": 2.4,
      "Takhteshwar": 2.8
    },
    walkMins: {
      "Bhavnagar Central Market": 14,
      "Bhavnagar Railway Station": 2,
      "Kalanala": 8,
      "Nilambaug": 18,
      "Takhteshwar": 22
    },
    totalSpaces: 40,
    availableSpaces: 12,
    occupiedSpaces: 28,
    fourWheelerSpaces: { total: 24, available: 7 },
    twoWheelerSpaces: { total: 16, available: 5 },
    evChargingSpaces: 3,
    pricePerHour: 20,
    twoWheelerPricePerHour: 10,
    fullDayPass: 150,
    operatingHours: "24 Hours Open (Railway Transit Access)",
    amenities: ["Luggage Ramp", "FASTag Auto-Debit", "24/7 Security", "CCTV Surveillance"],
    securityGuard: "Railway Protection & BMC Staff",
    demandLevel: "High",
    turnoverRate: "Rapid express transit flow",
    coords: { lat: 21.7750, lng: 72.1435 },
    svgCoords: { x: 140, y: 80 },
    corridor: "Platform 1 Concourse"
  },
  {
    id: "parking-rail-2",
    tag: "Parking R2",
    shortCode: "R2",
    name: "Navpara Station Underbridge Parking",
    zone: "Railway Station",
    badge: "Available",
    status: "available",
    ownershipType: "public",
    address: "Navpara Underpass Loop, Near Railway Yard, Bhavnagar 364001",
    distanceKm: {
      "Bhavnagar Central Market": 1.6,
      "Bhavnagar Railway Station": 0.5,
      "Kalanala": 0.8,
      "Nilambaug": 2.0,
      "Takhteshwar": 2.5
    },
    walkMins: {
      "Bhavnagar Central Market": 12,
      "Bhavnagar Railway Station": 4,
      "Kalanala": 6,
      "Nilambaug": 15,
      "Takhteshwar": 19
    },
    totalSpaces: 65,
    availableSpaces: 32,
    occupiedSpaces: 33,
    fourWheelerSpaces: { total: 40, available: 20 },
    twoWheelerSpaces: { total: 25, available: 12 },
    evChargingSpaces: 6,
    pricePerHour: 15,
    twoWheelerPricePerHour: 5,
    fullDayPass: 100,
    operatingHours: "24 Hours Open (Shaded Flyover Lot)",
    amenities: ["Spacious Bays", "EV Charging Hub", "Covered Flyover", "ANPR Cameras"],
    securityGuard: "24/7 Gate Guard",
    demandLevel: "Moderate",
    turnoverRate: "Continuous",
    coords: { lat: 21.7730, lng: 72.1410 },
    svgCoords: { x: 90, y: 110 },
    corridor: "Navpara Flyover Span"
  },

  // --- Zone 3: Kalanala Commercial Hub ---
  {
    id: "parking-kala-1",
    tag: "Parking K1",
    shortCode: "K1",
    name: "Kalanala Circle Multi-Deck",
    zone: "Kalanala Hub",
    badge: "Available",
    status: "available",
    ownershipType: "public",
    address: "Kalanala Main Chowk, opposite SBI Zonal Office, Bhavnagar 364001",
    distanceKm: {
      "Bhavnagar Central Market": 1.3,
      "Bhavnagar Railway Station": 1.0,
      "Kalanala": 0.3,
      "Nilambaug": 1.2,
      "Takhteshwar": 1.9
    },
    walkMins: {
      "Bhavnagar Central Market": 9,
      "Bhavnagar Railway Station": 7,
      "Kalanala": 3,
      "Nilambaug": 9,
      "Takhteshwar": 14
    },
    totalSpaces: 45,
    availableSpaces: 24,
    occupiedSpaces: 21,
    fourWheelerSpaces: { total: 30, available: 16 },
    twoWheelerSpaces: { total: 15, available: 8 },
    evChargingSpaces: 4,
    pricePerHour: 20,
    twoWheelerPricePerHour: 10,
    fullDayPass: 130,
    operatingHours: "07:00 AM - Midnight",
    amenities: ["Multi-Level Automated Ramp", "FASTag Barrier", "Bank Plaza Walkway", "CCTV"],
    securityGuard: "On-site Traffic Attendant",
    demandLevel: "Medium",
    turnoverRate: "Commercial retail rhythm",
    coords: { lat: 21.7695, lng: 72.1385 },
    svgCoords: { x: 210, y: 150 },
    corridor: "Kalanala Main Chowk"
  },
  {
    id: "parking-kala-2",
    tag: "Parking K2",
    shortCode: "K2",
    name: "Panwadi Commercial Arcade Stand",
    zone: "Kalanala Hub",
    badge: "Full",
    status: "full",
    ownershipType: "private",
    address: "Panwadi Main Road, Near Diamond Market, Bhavnagar 364001",
    distanceKm: {
      "Bhavnagar Central Market": 1.1,
      "Bhavnagar Railway Station": 1.4,
      "Kalanala": 0.6,
      "Nilambaug": 1.4,
      "Takhteshwar": 1.8
    },
    walkMins: {
      "Bhavnagar Central Market": 8,
      "Bhavnagar Railway Station": 10,
      "Kalanala": 5,
      "Nilambaug": 11,
      "Takhteshwar": 13
    },
    totalSpaces: 30,
    availableSpaces: 0,
    occupiedSpaces: 30,
    fourWheelerSpaces: { total: 20, available: 0 },
    twoWheelerSpaces: { total: 10, available: 0 },
    evChargingSpaces: 2,
    pricePerHour: 25,
    twoWheelerPricePerHour: 10,
    fullDayPass: 160,
    operatingHours: "08:00 AM - 10:00 PM",
    amenities: ["Valet Assistance", "High Security", "Commercial Access"],
    securityGuard: "Private Arcade Security",
    demandLevel: "Peak Saturated",
    turnoverRate: "Low turnover (merchant reserved)",
    coords: { lat: 21.7670, lng: 72.1390 },
    svgCoords: { x: 260, y: 180 },
    corridor: "Panwadi Diamond Market"
  },

  // --- Zone 4: Nilambaug Palace Area ---
  {
    id: "parking-nilam-1",
    tag: "Parking N1",
    shortCode: "N1",
    name: "Nilambaug Palace Circle Bay",
    zone: "Nilambaug Palace",
    badge: "Available",
    status: "available",
    ownershipType: "public",
    address: "Palace Road, Near Nilambaug Gate 2, Bhavnagar 364002",
    distanceKm: {
      "Bhavnagar Central Market": 2.0,
      "Bhavnagar Railway Station": 2.3,
      "Kalanala": 1.2,
      "Nilambaug": 0.4,
      "Takhteshwar": 0.9
    },
    walkMins: {
      "Bhavnagar Central Market": 15,
      "Bhavnagar Railway Station": 17,
      "Kalanala": 9,
      "Nilambaug": 3,
      "Takhteshwar": 7
    },
    totalSpaces: 45,
    availableSpaces: 26,
    occupiedSpaces: 19,
    fourWheelerSpaces: { total: 30, available: 18 },
    twoWheelerSpaces: { total: 15, available: 8 },
    evChargingSpaces: 4,
    pricePerHour: 15,
    twoWheelerPricePerHour: 5,
    fullDayPass: 110,
    operatingHours: "06:00 AM - 11:00 PM",
    amenities: ["Shaded Tree Canopy", "Heritage Boulevard", "EV Fast Charger", "CCTV"],
    securityGuard: "BMC Civic Warden",
    demandLevel: "Moderate",
    turnoverRate: "Steady tourist & dinner flow",
    coords: { lat: 21.7585, lng: 72.1405 },
    svgCoords: { x: 280, y: 270 },
    corridor: "Palace Circle Boulevard"
  },
  {
    id: "parking-nilam-2",
    tag: "Parking N2",
    shortCode: "N2",
    name: "Court Road Heritage Compound",
    zone: "Nilambaug Palace",
    badge: "Limited",
    status: "limited",
    ownershipType: "private",
    address: "District Court Road, Bhavnagar 364002",
    distanceKm: {
      "Bhavnagar Central Market": 1.7,
      "Bhavnagar Railway Station": 2.0,
      "Kalanala": 1.0,
      "Nilambaug": 0.8,
      "Takhteshwar": 1.2
    },
    walkMins: {
      "Bhavnagar Central Market": 13,
      "Bhavnagar Railway Station": 15,
      "Kalanala": 8,
      "Nilambaug": 6,
      "Takhteshwar": 9
    },
    totalSpaces: 25,
    availableSpaces: 7,
    occupiedSpaces: 18,
    fourWheelerSpaces: { total: 15, available: 4 },
    twoWheelerSpaces: { total: 10, available: 3 },
    evChargingSpaces: 0,
    pricePerHour: 15,
    twoWheelerPricePerHour: 5,
    fullDayPass: 90,
    operatingHours: "09:00 AM - 07:00 PM",
    amenities: ["Paved Surface", "Security Kiosk", "Receipt Printer"],
    securityGuard: "Court Marshall on Duty",
    demandLevel: "High During Court Hours",
    turnoverRate: "Moderate",
    coords: { lat: 21.7610, lng: 72.1415 },
    svgCoords: { x: 230, y: 250 },
    corridor: "District Court Line"
  },

  // --- Zone 5: Takhteshwar Temple Area ---
  {
    id: "parking-takh-1",
    tag: "Parking T1",
    shortCode: "T1",
    name: "Takhteshwar Hill Base Plaza",
    zone: "Takhteshwar Hill",
    badge: "Available",
    status: "available",
    ownershipType: "public",
    address: "Hill Base Road, Foot of Takhteshwar Temple, Bhavnagar 364002",
    distanceKm: {
      "Bhavnagar Central Market": 2.3,
      "Bhavnagar Railway Station": 2.7,
      "Kalanala": 1.8,
      "Nilambaug": 0.9,
      "Takhteshwar": 0.3
    },
    walkMins: {
      "Bhavnagar Central Market": 17,
      "Bhavnagar Railway Station": 20,
      "Kalanala": 13,
      "Nilambaug": 7,
      "Takhteshwar": 2
    },
    totalSpaces: 85,
    availableSpaces: 40,
    occupiedSpaces: 45,
    fourWheelerSpaces: { total: 55, available: 26 },
    twoWheelerSpaces: { total: 30, available: 14 },
    evChargingSpaces: 6,
    pricePerHour: 10,
    twoWheelerPricePerHour: 5,
    fullDayPass: 70,
    operatingHours: "05:30 AM - 10:30 PM (Temple Hours)",
    amenities: ["Pilgrim Rest Bay", "Drinking Water Kiosk", "EV Fast Charging", "CCTV 24/7", "Bus & Car Slots"],
    securityGuard: "Temple Trust & BMC Guards",
    demandLevel: "High on Mornings & Weekends",
    turnoverRate: "Pilgrim cycle (45m average)",
    coords: { lat: 21.7545, lng: 72.1460 },
    svgCoords: { x: 340, y: 280 },
    corridor: "Hill Base Pilgrimage Plaza"
  },
  {
    id: "parking-takh-2",
    tag: "Parking T2",
    shortCode: "T2",
    name: "Hillside North Footway Lot",
    zone: "Takhteshwar Hill",
    badge: "Full",
    status: "full",
    ownershipType: "private",
    address: "North Stairs Foothill, Takhteshwar Hill, Bhavnagar 364002",
    distanceKm: {
      "Bhavnagar Central Market": 2.1,
      "Bhavnagar Railway Station": 2.5,
      "Kalanala": 1.6,
      "Nilambaug": 1.1,
      "Takhteshwar": 0.7
    },
    walkMins: {
      "Bhavnagar Central Market": 16,
      "Bhavnagar Railway Station": 19,
      "Kalanala": 12,
      "Nilambaug": 8,
      "Takhteshwar": 5
    },
    totalSpaces: 30,
    availableSpaces: 0,
    occupiedSpaces: 30,
    fourWheelerSpaces: { total: 18, available: 0 },
    twoWheelerSpaces: { total: 12, available: 0 },
    evChargingSpaces: 0,
    pricePerHour: 10,
    twoWheelerPricePerHour: 5,
    fullDayPass: 60,
    operatingHours: "06:00 AM - 09:00 PM",
    amenities: ["Staircase Access", "Shaded Trees", "Manual Token"],
    securityGuard: "Civic Attendant",
    demandLevel: "Full Capacity (Peak Aarti Rush)",
    turnoverRate: "Saturated",
    coords: { lat: 21.7560, lng: 72.1480 },
    svgCoords: { x: 390, y: 260 },
    corridor: "Takhteshwar North Stairway"
  }
];

// Citywide Summary Telemetry matching specifications:
// Total Locations: 12 | Available Spaces: 186 | Occupied Spaces: 294 | Full Locations: 3
export function getCitywideStats(facilities = PARKING_FACILITIES) {
  const safeFacilities = facilities || [];
  const totalFacilities = safeFacilities.length;
  const availableSpaces = safeFacilities.reduce((sum, f) => sum + Number(f.availableSpaces || 0), 0);
  const occupiedSpaces = safeFacilities.reduce((sum, f) => sum + Number(f.occupiedSpaces || 0), 0);
  const totalCapacity = safeFacilities.reduce((sum, f) => sum + Number(f.totalSpaces || 0), 0);
  const fullLocations = safeFacilities.filter(f => Number(f.availableSpaces || 0) === 0).length;
  const limitedLocations = safeFacilities.filter(f => {
    const total = Number(f.totalSpaces || 0);
    const avail = Number(f.availableSpaces || 0);
    return avail > 0 && total > 0 && (avail / total) < 0.35;
  }).length;
  const availableLocations = safeFacilities.filter(f => {
    const total = Number(f.totalSpaces || 0);
    const avail = Number(f.availableSpaces || 0);
    return total > 0 && (avail / total) >= 0.35;
  }).length;
  const overallOccupancyPct = totalCapacity > 0 ? Math.round((occupiedSpaces / totalCapacity) * 100) : 0;

  return {
    totalFacilities,
    availableSpaces,
    occupiedSpaces,
    totalCapacity,
    fullLocations,
    limitedLocations,
    availableLocations,
    overallOccupancyPct
  };
}
