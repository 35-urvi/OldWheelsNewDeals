<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "deals";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to handle file upload
function uploadFile($file, $type) {
    $target_dir = "uploads/";
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $filename = uniqid() . "_" . $type . "." . $extension;
    $target_file = $target_dir . $filename;
    
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        return $target_file;
    }
    return false;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Handle file uploads
    $front_photo = uploadFile($_FILES["front_photo"], "front");
    $rear_photo = uploadFile($_FILES["rear_photo"], "rear");
    $left_photo = uploadFile($_FILES["left_photo"], "left");
    $right_photo = uploadFile($_FILES["right_photo"], "right");
    $dashboard_photo = uploadFile($_FILES["dashboard_photo"], "dashboard");

    if (!$front_photo || !$rear_photo || !$left_photo || !$right_photo || !$dashboard_photo) {
        die("Error uploading files");
    }

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO car_listings (make, model, year, fuel_type, transmission, 
        registration_place, registration_number, ownership, car_condition, color, 
        front_photo, rear_photo, left_photo, right_photo, dashboard_photo,
        seller_name, seller_phone, asking_price, minimum_price) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("ssissssssssssssssdd", 
        $_POST["make"], 
        $_POST["model"],
        $_POST["year"],
        $_POST["fuel_type"],
        $_POST["transmission"],
        $_POST["registration_place"],
        $_POST["registration_number"],
        $_POST["ownership"],
        $_POST["condition"],
        $_POST["color"],
        $front_photo,
        $rear_photo,
        $left_photo,
        $right_photo,
        $dashboard_photo,
        $_POST["seller_name"],
        $_POST["seller_phone"],
        $_POST["asking_price"],
        $_POST["minimum_price"]
    );

    if ($stmt->execute()) {
        echo "<script>alert('Car listing submitted successfully!'); window.location.href='sell.html';</script>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>