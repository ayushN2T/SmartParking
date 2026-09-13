<?php
header('Content-Type: application/json');
try {
    $pdo = new PDO('mysql:host=db;dbname=db;charset=utf8mb4', 'db', 'db', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM parking_facilities');
    $res = $stmt->fetch();
    echo json_encode(['status' => 'success', 'database' => 'connected', 'facilities_count' => (int)$res['count']]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
