<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();

    // Query citywide aggregate stats directly from MariaDB
    $sql = "
        SELECT 
            COUNT(*) as total_facilities,
            COALESCE(SUM(available_spaces), 0) as available_spaces,
            COALESCE(SUM(occupied_spaces), 0) as occupied_spaces,
            COALESCE(SUM(total_spaces), 0) as total_capacity,
            COALESCE(SUM(CASE WHEN available_spaces = 0 THEN 1 ELSE 0 END), 0) as full_locations,
            COALESCE(SUM(CASE WHEN available_spaces > 0 AND (available_spaces / total_spaces) < 0.35 THEN 1 ELSE 0 END), 0) as limited_locations,
            COALESCE(SUM(CASE WHEN (available_spaces / total_spaces) >= 0.35 THEN 1 ELSE 0 END), 0) as available_locations
        FROM parking_facilities
    ";

    $stmt = $pdo->query($sql);
    $row = $stmt->fetch();

    $totalCapacity = (int)$row['total_capacity'];
    $occupiedSpaces = (int)$row['occupied_spaces'];
    $occupancyPct = $totalCapacity > 0 ? round(($occupiedSpaces / $totalCapacity) * 100) : 0;

    $stats = [
        'totalFacilities' => (int)$row['total_facilities'],
        'availableSpaces' => (int)$row['available_spaces'],
        'occupiedSpaces' => $occupiedSpaces,
        'totalCapacity' => $totalCapacity,
        'fullLocations' => (int)$row['full_locations'],
        'limitedLocations' => (int)$row['limited_locations'],
        'availableLocations' => (int)$row['available_locations'],
        'overallOccupancyPct' => $occupancyPct
    ];

    sendJSON(['status' => 'success', 'data' => $stats]);
} catch (Exception $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
