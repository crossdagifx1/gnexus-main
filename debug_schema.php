<?php
require_once __DIR__ . '/api.php';

echo "<h2>Table: cms_users</h2>";
$stmt = $pdo->query("DESCRIBE cms_users");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($users);
echo "</pre>";
?>
