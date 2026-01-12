<?php
include_once 'db.php';

// --- EMPÊCHER LE CACHE ---
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');

if (isset($_GET['city'])) {
    if (!isset($_GET['pass']) || $_GET['pass'] !== 'sun') { 
        http_response_code(401);
        exit(json_encode(["error" => "auth"])); 
    }
    $stmt = $conn->prepare("SELECT * FROM votes WHERE city = ? ORDER BY created_at DESC");
    $stmt->execute([$_GET['city']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} else {
    $query = "SELECT city, COUNT(*) as votes FROM votes GROUP BY city ORDER BY votes DESC";
    $stmt = $conn->query($query);
    $stats = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($stats as &$row) {
        $row['votes'] = (int)$row['votes'];
    }
    
    echo json_encode($stats);
}