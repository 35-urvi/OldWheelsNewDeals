<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $conn = new mysqli('localhost', 'root', '', 'deals');

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Sanitize inputs
    $email = trim($_POST['email']);
    $new_password = trim($_POST['new_password']);

    if (empty($email) || empty($new_password)) {
        throw new Exception("Email and new password are required");
    }

    // Hash the new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    // Prepare and execute the update query
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ss", $hashed_password, $email);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Password reset successful! Redirecting to login...'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Password reset failed. Please try again.'
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