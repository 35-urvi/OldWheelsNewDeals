<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'deals');

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed']));
}

$id = $_GET['id'];
$sql = "SELECT * FROM car_listings WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'Car not found']);
}

$conn->close();
?>
