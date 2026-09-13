<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();

    // Fetch all facilities
    $stmt = $pdo->query("SELECT * FROM parking_facilities ORDER BY id");
    $facilities = [];
    $facMap = [];

    while ($row = $stmt->fetch()) {
        $id = $row['id'];
        $facMap[$id] = [
            'id' => $row['id'],
            'tag' => $row['tag'],
            'shortCode' => $row['short_code'],
            'name' => $row['name'],
            'zone' => $row['zone'],
            'status' => $row['status'],
            'ownershipType' => $row['ownership_type'] ?? 'public',
            'address' => $row['address'],
            'corridor' => $row['corridor'],
            'totalSpaces' => (int)$row['total_spaces'],
            'availableSpaces' => (int)$row['available_spaces'],
            'occupiedSpaces' => (int)$row['occupied_spaces'],
            'fourWheelerSpaces' => [
                'total' => (int)$row['four_wheeler_total'],
                'available' => (int)$row['four_wheeler_avail']
            ],
            'twoWheelerSpaces' => [
                'total' => (int)$row['two_wheeler_total'],
                'available' => (int)$row['two_wheeler_avail']
            ],
            'evChargingSpaces' => (int)$row['ev_charging_spaces'],
            'pricePerHour' => (float)$row['price_per_hour'],
            'twoWheelerPricePerHour' => (float)$row['two_wheeler_price_per_hour'],
            'fullDayPass' => (float)$row['full_day_pass'],
            'operatingHours' => $row['operating_hours'],
            'securityGuard' => $row['security_guard'],
            'demandLevel' => $row['demand_level'],
            'turnoverRate' => $row['turnover_rate'],
            'coords' => [
                'lat' => (float)$row['latitude'],
                'lng' => (float)$row['longitude']
            ],
            'svgCoords' => [
                'x' => (int)($row['svg_x'] ?? 100),
                'y' => (int)($row['svg_y'] ?? 100)
            ],
            'amenities' => !empty($row['amenities']) ? json_decode($row['amenities'], true) : [
                'CCTV Surveillance',
                'FASTag Exit',
                'Security on Duty'
            ],
            'distanceKm' => [],
            'walkMins' => []
        ];
    }

    // Fetch distance and walk mappings
    $distStmt = $pdo->query("
        SELECT pd.facility_id, d.name as dest_name, pd.distance_km, pd.walk_mins
        FROM parking_distances pd
        JOIN destinations d ON pd.destination_id = d.id
    ");

    while ($dRow = $distStmt->fetch()) {
        $fId = $dRow['facility_id'];
        $destName = $dRow['dest_name'];
        if (isset($facMap[$fId])) {
            $facMap[$fId]['distanceKm'][$destName] = (float)$dRow['distance_km'];
            $facMap[$fId]['walkMins'][$destName] = (int)$dRow['walk_mins'];
        }
    }

    // Ensure fallback distance for any unmapped pairs
    foreach ($facMap as $fId => &$fData) {
        $destinations = ['Bhavnagar Central Market', 'Bhavnagar Railway Station', 'Kalanala', 'Nilambaug', 'Takhteshwar'];
        foreach ($destinations as $dName) {
            if (!isset($fData['distanceKm'][$dName])) {
                $fData['distanceKm'][$dName] = 1.5;
                $fData['walkMins'][$dName] = 8;
            }
        }
    }

    sendJSON(['status' => 'success', 'data' => array_values($facMap)]);
} catch (Exception $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
