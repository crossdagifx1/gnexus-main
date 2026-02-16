<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$creds = [
    'host' => 'localhost',
    'db'   => 'gnexusqa_chat',
    'user' => 'gnexusqa_user',
    'pass' => 'B0&^0Y6oh.ZuxY}e'
];

echo "<h2>Updating Admin Email</h2>";

try {
    $dsn = "mysql:host={$creds['host']};dbname={$creds['db']};charset=utf8mb4";
    $pdo = new PDO($dsn, $creds['user'], $creds['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    $oldEmail = 'admin@gnexuset.com';
    $newEmail = 'crossdagi@gmail.com';
    
    // Check if new email already exists
    $stmt = $pdo->prepare("SELECT id FROM cms_users WHERE email = ?");
    $stmt->execute([$newEmail]);
    if ($stmt->fetch()) {
        echo "⚠️ Email $newEmail already exists. Updating password for it instead?<br>";
        // Maybe user tried to register it? 
        // I will just update the old one to new one. If conflict, it will fail.
    }

    $stmt = $pdo->prepare("UPDATE cms_users SET email = ? WHERE email = ?");
    $stmt->execute([$newEmail, $oldEmail]);
    
    if ($stmt->rowCount() > 0) {
        echo "✅ <strong>SUCCESS!</strong><br>";
        echo "Updated email from $oldEmail to $newEmail.<br>";
    } else {
        echo "⚠️ No rows updated. Maybe $oldEmail doesn't exist or already updated?<br>";
    }

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
