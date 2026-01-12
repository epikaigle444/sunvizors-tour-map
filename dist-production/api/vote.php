<?php
include_once 'db.php';
$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

if (!$data && ($method === 'POST' || $method === 'PUT')) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit();
}

if ($method === 'POST') {
    if (!isset($data->email) || !isset($data->city)) {
        http_response_code(400);
        echo json_encode(["error" => "Missing email or city"]);
        exit();
    }

    if (!empty($data->robot_check)) {
        echo json_encode(["id" => 0, "status" => "fake_success"]); 
        exit();
    }
    
    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid email format"]);
        exit();
    }

    $ip = $_SERVER['REMOTE_ADDR'];
    $limit_stmt = $conn->prepare("SELECT COUNT(*) FROM votes WHERE ip_address = ? AND created_at > (NOW() - INTERVAL 10 MINUTE)");
    $limit_stmt->execute([$ip]);
    if ($limit_stmt->fetchColumn() > 5) {
        http_response_code(429);
        echo json_encode(["error" => "Trop de votes. Veuillez patienter 10 min."]);
        exit();
    }

    $city = strip_tags($data->city);
    $check = $conn->prepare("SELECT id FROM votes WHERE email = ? AND city = ?");
    $check->execute([$email, $city]);
    if ($row = $check->fetch()) { 
        echo json_encode(["id" => $row['id'], "status" => "already_voted"]); 
        exit(); 
    }

    $stmt = $conn->prepare("INSERT INTO votes (email, city, ip_address, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$email, $city, $ip]);
    echo json_encode(["id" => $conn->lastInsertId(), "status" => "success"]);

} elseif ($method === 'PUT') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid ID"]);
        exit();
    }
    
    $intentions = "";
    if (isset($data->intentions)) {
        $intentions = is_array($data->intentions) ? implode(", ", $data->intentions) : (string)$data->intentions;
    }
    
    $stmt = $conn->prepare("UPDATE votes SET first_name=?, last_name=?, phone=?, venue_proposal=?, intentions=?, message=? WHERE id=?");
    $stmt->execute([
        isset($data->first_name) ? strip_tags($data->first_name) : null,
        isset($data->last_name) ? strip_tags($data->last_name) : null,
        isset($data->phone) ? strip_tags($data->phone) : null,
        isset($data->venue_proposal) ? strip_tags($data->venue_proposal) : null,
        strip_tags($intentions),
        isset($data->message) ? strip_tags($data->message) : null,
        $id
    ]);
    echo json_encode(["message" => "ok"]);

} elseif ($method === 'DELETE') {
    if (!isset($_GET['pass']) || $_GET['pass'] !== 'sun') {
        http_response_code(401);
        exit(json_encode(["error" => "auth"]));
    }
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $stmt = $conn->prepare("DELETE FROM votes WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "deleted"]);
}
