<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$creds = [
    'host' => 'localhost',
    'db'   => 'gnexusqa_chat',
    'user' => 'gnexusqa_user',
    'pass' => 'B0&^0Y6oh.ZuxY}e'
];

echo "<h2>Database Setup / Migration</h2>";

function runSqlFile($pdo, $filename) {
    echo "<h3>Executing $filename...</h3>";
    if (!file_exists($filename)) {
        echo "❌ File not found: $filename<br>";
        return;
    }
    
    $sql = file_get_contents($filename);
    
    try {
        // Enable multi-statement execution if needed, but PDO->exec usually handles it 
        // if the driver supports it. 
        // If not, we might need to split by ';'. 
        // Let's try raw exec first.
        $pdo->exec($sql);
        echo "✅ Successfully executed $filename.<br>";
    } catch (PDOException $e) {
        echo "❌ Error executing $filename: " . $e->getMessage() . "<br>";
        // Fallback: Try splitting by semicolon if syntax error
        echo "⚠️ Attempting split-execution fallback...<br>";
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        foreach ($statements as $stmt) {
            if (empty($stmt)) continue;
            try {
                $pdo->exec($stmt);
            } catch (PDOException $e2) {
                echo "⚠️ Failed statement: " . htmlspecialchars(substr($stmt, 0, 50)) . "... <br>";
                echo "Error: " . $e2->getMessage() . "<br>";
            }
        }
    }
}

try {
    $dsn = "mysql:host={$creds['host']};dbname={$creds['db']};charset=utf8mb4";
    $pdo = new PDO($dsn, $creds['user'], $creds['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 60,
        PDO::MYSQL_ATTR_MULTI_STATEMENTS => false // Try splitting manually or false to force single
    ]);
    
    // Actually, to run multi-query strings, we SHOULD enable MYSQL_ATTR_MULTI_STATEMENTS = true
    // But basic-ftp doesn't let me change php.ini. 
    // I will try to use the split approach by default in runSqlFile if needed.
    // Let's re-connect with correct options if possible.
    
    echo "✅ Connected to Database.<br>";
    
    runSqlFile($pdo, 'master_database_setup.sql');
    runSqlFile($pdo, 'nexus_core_schema_ai_chat.sql');
    
    echo "<hr><h3>Verification</h3>";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "Current Tables: " . count($tables) . "<br>";
    echo "<ul>";
    foreach ($tables as $t) echo "<li>$t</li>";
    echo "</ul>";

} catch (PDOException $e) {
    echo "❌ Database Connection Failed: " . $e->getMessage();
}
?>
