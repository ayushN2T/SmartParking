<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();

    // Pick 3 random facilities to adjust
    $stmt = $pdo->query("SELECT id, total_spaces, available_spaces, four_wheeler_total, two_wheeler_total FROM parking_facilities ORDER BY RAND() LIMIT 3");
    $updated = [];

    $updateStmt = $pdo->prepare("
        UPDATE parking_facilities 
        SET available_spaces = :avail, 
            occupied_spaces = :occ, 
            four_wheeler_avail = :four_avail,
            two_wheeler_avail = :two_avail,
            status = :status,
            updated_at = NOW()
        WHERE id = :id
    ");

    $logStmt = $pdo->prepare("
        INSERT INTO sensor_telemetry (facility_id, bay_number, vehicle_type, event_type, vehicle_plate)
        VALUES (:fid, :bay, '4w', :event, :plate)
    ");

    while ($row = $stmt->fetch()) {
        $id = $row['id'];
        $total = (int)$row['total_spaces'];
        $currAvail = (int)$row['available_spaces'];
        $fourTotal = (int)$row['four_wheeler_total'];
        $twoTotal = (int)$row['two_wheeler_total'];

        // Random delta (-1, 0, +1)
        $delta = rand(-1, 1);
        $newAvail = max(0, min($total, $currAvail + $delta));
        $newOcc = $total - $newAvail;

        // Proportional breakdown for 4W and 2W
        $fourRatio = $total > 0 ? ($fourTotal / $total) : 0.67;
        $new4wAvail = min($fourTotal, (int)round($newAvail * $fourRatio));
        $new2wAvail = max(0, min($twoTotal, $newAvail - $new4wAvail));

        $newStatus = 'available';
        if ($newAvail === 0) {
            $newStatus = 'full';
        } else if (($newAvail / $total) < 0.35) {
            $newStatus = 'limited';
        }

        $updateStmt->execute([
            ':avail' => $newAvail,
            ':occ' => $newOcc,
            ':four_avail' => $new4wAvail,
            ':two_avail' => $new2wAvail,
            ':status' => $newStatus,
            ':id' => $id
        ]);

        // Insert log in sensor_telemetry table
        $eventType = $delta < 0 ? 'entry' : ($delta > 0 ? 'exit' : 'occupied');
        $samplePlate = 'GJ-04-' . chr(rand(65, 90)) . chr(rand(65, 90)) . '-' . rand(1000, 9999);
        $logStmt->execute([
            ':fid' => $id,
            ':bay' => 'Bay #' . rand(1, $total),
            ':event' => $eventType,
            ':plate' => $samplePlate
        ]);

        $updated[] = [
            'id' => $id,
            'availableSpaces' => $newAvail,
            'occupiedSpaces' => $newOcc,
            'status' => $newStatus
        ];
    }

    sendJSON([
        'status' => 'success',
        'message' => 'Sensor telemetry synchronized with MariaDB',
        'updated_facilities' => $updated,
        'updated_count' => count($updated),
        'timestamp' => date('h:i:s A')
    ]);
} catch (Exception $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
