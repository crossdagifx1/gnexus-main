<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$creds = [
    'host' => 'localhost',
    'db'   => 'gnexusqa_chat',
    'user' => 'gnexusqa_user',
    'pass' => 'B0&^0Y6oh.ZuxY}e'
];

echo "<h2>Database Query Debugger</h2>";

try {
    $dsn = "mysql:host={$creds['host']};dbname={$creds['db']};charset=utf8mb4";
    $pdo = new PDO($dsn, $creds['user'], $creds['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5
    ]);
    echo "✅ Connected.<br>";

    // 1. List Tables
    echo "<h3>Tables in Database:</h3>";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    if (empty($tables)) {
        echo "❌ NO TABLES FOUND! Database is empty.<br>";
    } else {
        echo "<ul>";
        foreach ($tables as $t) echo "<li>$t</li>";
        echo "</ul>";
    }

    // 2. Run the get_models query
    echo "<h3>Testing get_models Query:</h3>";
    $sql = "SELECT m.*, p.name as provider_name, p.slug as provider_slug 
            FROM ai_models m 
            JOIN ai_providers p ON m.provider_id = p.id 
            WHERE 1=1 ORDER BY p.priority ASC, m.display_name ASC";
    
    $start = microtime(true);
    $stmt = $pdo->query($sql);
    $models = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $duration = microtime(true) - $start;

    echo "✅ Query executed in " . number_format($duration, 4) . " seconds.<br>";
    echo "Found " . count($models) . " models.<br>";
    
    // Dump first result to check structure
    if (count($models) > 0) {
        echo "<pre>";
        print_r($models[0]);
        echo "</pre>";
    }

} catch (PDOException $e) {
    echo "❌ ERROR: " . $e->getMessage();
}
?>
