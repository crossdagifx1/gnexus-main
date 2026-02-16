<?php
$host = 'localhost';
$db   = 'gnexusqa_chat';
$user = 'gnexusqa_user';
$pass = 'B0&^0Y6oh.ZuxY}e';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

echo "<h2>Table: cms_users</h2>";
$stmt = $pdo->query("DESCRIBE cms_users");
$columns = $stmt->fetchAll();

echo "<table border='1'><tr><th>Field</th><th>Type</th><th>Default</th></tr>";
foreach ($columns as $col) {
    echo "<tr>";
    echo "<td>" . $col['Field'] . "</td>";
    echo "<td>" . $col['Type'] . "</td>";
    echo "<td>" . ($col['Default'] ?? 'NULL') . "</td>";
    echo "</tr>";
}
echo "</table>";

echo "<h2>Super Admin Data</h2>";
$stmt = $pdo->query("SELECT * FROM cms_users WHERE email LIKE '%crossdagi%' OR email LIKE '%admin%'");
$users = $stmt->fetchAll();
echo "<pre>";
print_r($users);
echo "</pre>";
?>
