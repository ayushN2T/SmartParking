<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

    $facilityId = $input['facility_id'] ?? 'parking-a';
    $vehiclePlate = $input['vehicle_plate'] ?? 'GJ-04-AB-1892';
    $vehicleType = $input['vehicle_type'] ?? '4w';
    $fastag = isset($input['fastag']) ? (bool)$input['fastag'] : true;

    // Fetch facility pricing & shortcode
    $stmt = $pdo->prepare("SELECT short_code, price_per_hour, two_wheeler_price_per_hour, available_spaces, total_spaces, four_wheeler_avail, two_wheeler_avail FROM parking_facilities WHERE id = :id");
    $stmt->execute([':id' => $facilityId]);
    $fac = $stmt->fetch();

    if (!$fac) {
        sendJSON(['status' => 'error', 'message' => 'Facility not found'], 404);
    }

    if ((int)$fac['available_spaces'] <= 0) {
        sendJSON(['status' => 'error', 'message' => 'Facility is currently full. Please choose another location.'], 409);
    }

    $passCode = '#BMC-PK-' . date('Y') . '-' . $fac['short_code'] . '-' . rand(100, 999);
    $bayCode = 'Bay #' . $fac['short_code'] . '-' . rand(10, 40);
    $tariff = ($vehicleType === '2w') ? (float)$fac['two_wheeler_price_per_hour'] : (float)$fac['price_per_hour'];

    // Insert pass record
    $ins = $pdo->prepare("
        INSERT INTO digital_passes (pass_code, facility_id, bay_code, vehicle_plate, vehicle_type, fastag_enabled, tariff_rate, status)
        VALUES (:code, :fid, :bay, :plate, :vtype, :fastag, :tariff, 'active')
    ");
    $ins->execute([
        ':code' => $passCode,
        ':fid' => $facilityId,
        ':bay' => $bayCode,
        ':plate' => $vehiclePlate,
        ':vtype' => $vehicleType,
        ':fastag' => $fastag ? 1 : 0,
        ':tariff' => $tariff
    ]);

    // Decrement available spaces and breakdown by vehicle type
    $newAvail = max(0, (int)$fac['available_spaces'] - 1);
    $newOcc = (int)$fac['total_spaces'] - $newAvail;
    $new4wAvail = (int)($fac['four_wheeler_avail'] ?? 0);
    $new2wAvail = (int)($fac['two_wheeler_avail'] ?? 0);
    if ($vehicleType === '2w') {
        $new2wAvail = max(0, $new2wAvail - 1);
    } else {
        $new4wAvail = max(0, $new4wAvail - 1);
    }
    // Ensure sum does not exceed available
    if ($new4wAvail > $newAvail) $new4wAvail = $newAvail;
    if ($new2wAvail > $newAvail) $new2wAvail = $newAvail;

    $newStatus = ($newAvail === 0) ? 'full' : (($newAvail / (int)$fac['total_spaces']) < 0.35 ? 'limited' : 'available');

    $updFac = $pdo->prepare("
        UPDATE parking_facilities 
        SET available_spaces = :avail, 
            occupied_spaces = :occ, 
            four_wheeler_avail = :four_avail,
            two_wheeler_avail = :two_avail,
            status = :status 
        WHERE id = :id
    ");
    $updFac->execute([
        ':avail' => $newAvail,
        ':occ' => $newOcc,
        ':four_avail' => $new4wAvail,
        ':two_avail' => $new2wAvail,
        ':status' => $newStatus,
        ':id' => $facilityId
    ]);

    sendJSON([
        'status' => 'success',
        'pass_code' => $passCode,
        'bay_code' => $bayCode,
        'tariff_rate' => $tariff,
        'vehicle_plate' => $vehiclePlate,
        'created_at' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    sendJSON(['status' => 'error', 'message' => $e->getMessage()], 500);
}
