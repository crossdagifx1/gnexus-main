<?php
require_once __DIR__ . '/api.php';

echo "<h2>Adding email_verification_token column</h2>";

try {
    // Check if column exists first
    $stmt = $pdo->query("SHOW COLUMNS FROM cms_users LIKE 'email_verification_token'");
    if ($stmt->fetch()) {
        echo "Column 'email_verification_token' already exists.<br>";
    } else {
        $pdo->exec("ALTER TABLE cms_users ADD COLUMN email_verification_token VARCHAR(255) DEFAULT NULL AFTER email_verified");
        echo "✅ Column 'email_verification_token' added successfully.<br>";
    }
    
    // Check if email_verified exists, if not, create it
    $stmt = $pdo->query("SHOW COLUMNS FROM cms_users LIKE 'email_verified'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE cms_users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE");
        echo "✅ Column 'email_verified' added successfully.<br>";
    }
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
