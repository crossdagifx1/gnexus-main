<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$creds = [
    'host' => 'localhost',
    'db'   => 'gnexusqa_chat',
    'user' => 'gnexusqa_user',
    'pass' => 'B0&^0Y6oh.ZuxY}e'
];

echo "<h2>Creating Super Admin User</h2>";

function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

try {
    $dsn = "mysql:host={$creds['host']};dbname={$creds['db']};charset=utf8mb4";
    $pdo = new PDO($dsn, $creds['user'], $creds['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // Check if user exists
    $email = 'admin@gnexuset.com';
    $password = 'NexusAdmin2026!';
    $fullName = 'Super Admin';
    
    $stmt = $pdo->prepare("SELECT id FROM cms_users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        die("❌ User already exists: $email");
    }
    
    // Create Role if missing (just in case)
    $pdo->exec("INSERT IGNORE INTO cms_roles (id, name, permissions) VALUES ('role_super_admin', 'Super Admin', '[\"*\"]')");
    
    // Create User
    $id = generateUUID();
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO cms_users (id, email, password_hash, full_name, role_id, is_verified) VALUES (?, ?, ?, ?, 'role_super_admin', 1)");
    $stmt->execute([$id, $email, $hash, $fullName]);
    
    echo "✅ <strong>SUCCESS!</strong><br>";
    echo "User: $email<br>";
    echo "Pass: $password<br>";

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
