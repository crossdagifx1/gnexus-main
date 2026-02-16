<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$creds = [
    'host' => 'localhost',
    'db'   => 'gnexusqa_chat',
    'user' => 'gnexusqa_user',
    'pass' => 'B0&^0Y6oh.ZuxY}e'
];

echo "<h2>Fixing Auth Schema</h2>";

function runSqlFile($pdo, $filename) {
    if (!file_exists($filename)) {
        echo "❌ File not found: $filename<br>";
        return;
    }
    $sql = file_get_contents($filename);
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    foreach ($statements as $stmt) {
        if (empty($stmt)) continue;
        try {
            $pdo->exec($stmt);
            echo "✅ Executed statement.<br>";
        } catch (PDOException $e) {
            echo "❌ Error: " . $e->getMessage() . "<br>Statement: " . substr($stmt, 0, 50) . "...<br>";
        }
    }
}

try {
    $dsn = "mysql:host={$creds['host']};dbname={$creds['db']};charset=utf8mb4";
    $pdo = new PDO($dsn, $creds['user'], $creds['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    echo "✅ Connected.<br>";
    runSqlFile($pdo, 'fix_auth_schema.sql');
    echo "✅ Schema Fix Complete.<br>";

} catch (PDOException $e) {
    echo "❌ DB Connection Failed: " . $e->getMessage();
}
?>
