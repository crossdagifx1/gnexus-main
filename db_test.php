<?php
// Test both localhost and 127.0.0.1
$creds = [
    'host' => 'localhost',
    'db'   => 'gnexusqa_chat',
    'user' => 'gnexusqa_user',
    'pass' => 'B0&^0Y6oh.ZuxY}e'
];

echo "<h2>Database Connection Test</h2>";

function testConnection($host, $db, $user, $pass) {
    echo "<p>Testing host: <strong>$host</strong>... ";
    try {
        $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_TIMEOUT => 5]);
        echo "✅ <strong>SUCCESS!</strong></p>";
        return true;
    } catch (PDOException $e) {
        echo "❌ FAILED: " . $e->getMessage() . "</p>";
        return false;
    }
}

testConnection('localhost', $creds['db'], $creds['user'], $creds['pass']);
testConnection('127.0.0.1', $creds['db'], $creds['user'], $creds['pass']);
?>
