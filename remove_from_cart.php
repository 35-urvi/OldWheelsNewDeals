<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'deals');

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$carId = $data['carId'];

$sql = "DELETE FROM cart WHERE car_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}

$conn->close();
?>