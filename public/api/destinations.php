<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();
    $stmt = $pdo->query("SELECT id, name, zone, latitude, longitude, description FROM destinations ORDER BY id");
    $destinations = [];
    while ($row = $stmt->fetch()) {
        $destinations[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'zone' => $row['zone'],
            'coords' => [
                'lat' => (float)$row['latitude'],
                'lng' => (float)$row['longitude']
            ],
            'description' => $row['description']
        ];
    }
    sendJSON(['status' => 'success', 'data' => $destinations]);
} catch (Exception $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
