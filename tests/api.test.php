<?php
/**
 * Automated Integration Test Suite for Bhavnagar Smart Parking API
 * Runs inside DDEV environment: ddev exec php tests/api.test.php
 */

$baseUrl = 'http://localhost/api';
$passCount = 0;
$failCount = 0;

function assertCondition($name, $condition, $details = '') {
    global $passCount, $failCount;
    if ($condition) {
        $passCount++;
        echo "  \033[32m✔ PASS\033[0m: {$name}\n";
    } else {
        $failCount++;
        echo "  \033[31m✖ FAIL\033[0m: {$name}" . ($details ? " - {$details}" : "") . "\n";
    }
}

function request($method, $endpoint, $payload = null) {
    global $baseUrl;
    $url = $baseUrl . $endpoint;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

    if ($payload !== null) {
        $json = json_encode($payload);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($json)
        ]);
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'body' => json_decode($response, true),
        'raw'  => $response
    ];
}

echo "\n\033[1;36m=== BHAVNAGAR SMART PARKING: BACKEND INTEGRATION TEST SUITE ===\033[0m\n\n";

// --- TEST SUITE 1: /api/destinations.php ---
echo "\033[1;33m[Test Suite 1] Destinations Endpoint\033[0m\n";
$destRes = request('GET', '/destinations.php');
assertCondition("Destinations returns HTTP 200", $destRes['code'] === 200);
assertCondition("Destinations payload status is success", ($destRes['body']['status'] ?? '') === 'success');
assertCondition("Returns 5 popular Bhavnagar hubs", count($destRes['body']['data'] ?? []) === 5);
$firstDest = $destRes['body']['data'][0] ?? [];
assertCondition("Destination contains required fields (id, name, coords)", 
    isset($firstDest['id']) && isset($firstDest['name']) && isset($firstDest['coords']['lat']));

// --- TEST SUITE 2: /api/facilities.php ---
echo "\n\033[1;33m[Test Suite 2] Parking Facilities Endpoint\033[0m\n";
$facRes = request('GET', '/facilities.php');
assertCondition("Facilities returns HTTP 200", $facRes['code'] === 200);
assertCondition("Facilities status is success", ($facRes['body']['status'] ?? '') === 'success');
$facilities = $facRes['body']['data'] ?? [];
assertCondition("Returns 12 facilities from MariaDB", count($facilities) === 12);

$publicCount = 0;
$privateCount = 0;
$hasDistanceMatrix = true;
$hasAmenitiesArray = true;

foreach ($facilities as $f) {
    if (($f['ownershipType'] ?? '') === 'private') $privateCount++;
    if (($f['ownershipType'] ?? '') === 'public') $publicCount++;
    if (empty($f['distanceKm']) || !is_array($f['distanceKm'])) $hasDistanceMatrix = false;
    if (!isset($f['amenities']) || !is_array($f['amenities'])) $hasAmenitiesArray = false;
}
assertCondition("Facilities categorized into Public and Private", $publicCount > 0 && $privateCount > 0);
assertCondition("All facilities include 5-destination distance matrix", $hasDistanceMatrix);
assertCondition("All facilities include decoded amenities array", $hasAmenitiesArray);

// --- TEST SUITE 3: /api/stats.php ---
echo "\n\033[1;33m[Test Suite 3] Citywide Stats Endpoint\033[0m\n";
$statsRes = request('GET', '/stats.php');
assertCondition("Stats returns HTTP 200", $statsRes['code'] === 200);
$stats = $statsRes['body']['data'] ?? [];
assertCondition("Total facilities in stats is 12", ($stats['totalFacilities'] ?? 0) === 12);
assertCondition("Available + Occupied equals Total Capacity", 
    ($stats['availableSpaces'] + $stats['occupiedSpaces']) === $stats['totalCapacity']);
assertCondition("Status partition sums to total facilities", 
    ($stats['fullLocations'] + $stats['limitedLocations'] + $stats['availableLocations']) === 12);

// --- TEST SUITE 4: /api/book.php (4W & 2W Bookings and Tariffs) ---
echo "\n\033[1;33m[Test Suite 4] Digital Pass Booking & Tariff Validation\033[0m\n";
// Find an available facility for testing
$testFac = null;
foreach ($facilities as $f) {
    if ($f['availableSpaces'] > 3) {
        $testFac = $f;
        break;
    }
}

if ($testFac) {
    // 4-Wheeler booking
    $book4w = request('POST', '/book.php', [
        'facility_id' => $testFac['id'],
        'vehicle_plate' => 'GJ-04-TEST-4444',
        'vehicle_type' => '4w',
        'fastag' => true
    ]);
    assertCondition("4W booking returns HTTP 200", $book4w['code'] === 200);
    assertCondition("4W pass code generated (#BMC-PK-*)", strpos($book4w['body']['pass_code'] ?? '', '#BMC-PK-') === 0);
    assertCondition("4W tariff charged is 4W rate (₹{$testFac['pricePerHour']})", 
        ($book4w['body']['tariff_rate'] ?? 0) == $testFac['pricePerHour']);

    // 2-Wheeler booking
    $book2w = request('POST', '/book.php', [
        'facility_id' => $testFac['id'],
        'vehicle_plate' => 'GJ-04-TEST-2222',
        'vehicle_type' => '2w',
        'fastag' => false
    ]);
    assertCondition("2W booking returns HTTP 200", $book2w['code'] === 200);
    assertCondition("2W tariff charged is 2W rate (₹{$testFac['twoWheelerPricePerHour']})", 
        ($book2w['body']['tariff_rate'] ?? 0) == $testFac['twoWheelerPricePerHour']);
} else {
    echo "  \033[33m! SKIP: No available facility found to book\033[0m\n";
}

// --- TEST SUITE 5: /api/book.php (Capacity Rejection 409 Conflict) ---
echo "\n\033[1;33m[Test Suite 5] Booking Full Facility Capacity Guard\033[0m\n";
// Find a facility that is full
$fullFac = null;
foreach ($facilities as $f) {
    if ($f['availableSpaces'] === 0) {
        $fullFac = $f;
        break;
    }
}
if ($fullFac) {
    $fullBookRes = request('POST', '/book.php', [
        'facility_id' => $fullFac['id'],
        'vehicle_plate' => 'GJ-04-REJECT-00',
        'vehicle_type' => '4w'
    ]);
    assertCondition("Attempting to book 100% full facility returns HTTP 409 Conflict", $fullBookRes['code'] === 409);
    assertCondition("Error message explicitly states facility is full", 
        stripos($fullBookRes['body']['message'] ?? '', 'full') !== false);
} else {
    echo "  \033[33m! SKIP: No 0-space facility found in initial state\033[0m\n";
}

// --- TEST SUITE 6: /api/simulate-tick.php & Telemetry Invariants ---
echo "\n\033[1;33m[Test Suite 6] Sensor Telemetry Tick & Integrity Invariants\033[0m\n";
$tickRes = request('POST', '/simulate-tick.php');
assertCondition("Sensor tick returns HTTP 200", $tickRes['code'] === 200);
assertCondition("Sensor tick status is success", ($tickRes['body']['status'] ?? '') === 'success');
assertCondition("Tick reports timestamp and updated facility count", 
    isset($tickRes['body']['timestamp']) && ($tickRes['body']['updated_count'] ?? 0) > 0);

// Verify invariants in MariaDB after tick
$facAfterTick = request('GET', '/facilities.php')['body']['data'] ?? [];
$allInvariantsPreserved = true;
$breakdownsValid = true;

foreach ($facAfterTick as $f) {
    if (($f['availableSpaces'] + $f['occupiedSpaces']) !== $f['totalSpaces']) {
        $allInvariantsPreserved = false;
    }
    if ($f['fourWheelerSpaces']['available'] > $f['availableSpaces'] || 
        $f['twoWheelerSpaces']['available'] > $f['availableSpaces']) {
        $breakdownsValid = false;
    }
}
assertCondition("Invariant: available_spaces + occupied_spaces === total_spaces for all facilities", $allInvariantsPreserved);
assertCondition("Invariant: 4W and 2W available breakdown <= total available_spaces", $breakdownsValid);

// --- SUMMARY ---
echo "\n\033[1;36m=== TEST SUMMARY ===\033[0m\n";
echo "Total Passed: \033[32m{$passCount}\033[0m\n";
echo "Total Failed: \033[31m{$failCount}\033[0m\n";

if ($failCount > 0) {
    echo "\033[41;37m TESTS FAILED \033[0m\n\n";
    exit(1);
} else {
    echo "\033[42;30m ALL TESTS PASSED SUCCESSFULLY! \033[0m\n\n";
    exit(0);
}
