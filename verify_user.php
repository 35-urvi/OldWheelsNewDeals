<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $conn = new mysqli('localhost', 'root', '', 'deals');

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Sanitize inputs
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);

    if (empty($name) || empty($email)) {
        throw new Exception("Name and email are required");
    }

    // Prepare and execute the query
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND name = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ss", $email, $name);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'User verified successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No account found with these credentials'
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
