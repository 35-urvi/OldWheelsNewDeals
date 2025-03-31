<?php
require_once 'database.php';

try {
    $stmt = $pdo->query("SELECT id, make, model, year, asking_price, front_photo FROM car_listings");
    $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($cars);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Failed to fetch cars: ' . $e->getMessage()]);
}