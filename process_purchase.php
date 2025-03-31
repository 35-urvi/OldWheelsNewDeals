<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'deals');

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$carId = $data['carId'];
$offerPrice = $data['offerPrice'];

// Get minimum price
$sql = "SELECT minimum_price FROM car_listings WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $carId);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($offerPrice >= $row['minimum_price']) {
    // Delete from both tables
    $conn->begin_transaction();
    
    try {
        $sql1 = "DELETE FROM cart WHERE car_id = ?";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->bind_param("i", $carId);
        $stmt1->execute();

        $sql2 = "DELETE FROM car_listings WHERE id = ?";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->bind_param("i", $carId);
        $stmt2->execute();

        $conn->commit();
        echo json_encode([
            'success' => true,
            'message' => 'You successfully bought the car!'
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => 'Transaction failed'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, your value is not matching the expected price'
    ]);
}

$conn->close();
?>