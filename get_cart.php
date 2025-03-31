<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'deals');

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed']));
}

$sql = "SELECT * FROM cart ORDER BY added_at DESC";
$result = $conn->query($sql);
$cars = [];

while($row = $result->fetch_assoc()) {
    $cars[] = $row;
}

echo json_encode($cars);
$conn->close();
?>
