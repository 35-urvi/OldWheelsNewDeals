<?php
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

$carId = $_POST['carId'] ?? null;

if (!$carId) {
    echo json_encode(['error' => 'Car ID not provided']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, make, model, year, asking_price, front_photo FROM car_listings WHERE id = ?");
    $stmt->execute([$carId]);
    $car = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$car) {
        echo json_encode(['error' => 'Car not found']);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO cart (car_id, make, model, year, asking_price, front_photo) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $car['id'],
        $car['make'],
        $car['model'],
        $car['year'],
        $car['asking_price'],
        $car['front_photo']
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Car added to cart successfully']);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Failed to add to cart: ' . $e->getMessage()]);
}
