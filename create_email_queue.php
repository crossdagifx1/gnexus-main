<?php
require_once __DIR__ . '/api.php';

echo "<h2>Creating email_queue Table</h2>";

try {
    $sql = "CREATE TABLE IF NOT EXISTS `email_queue` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `recipient_email` VARCHAR(255) NOT NULL,
        `recipient_name` VARCHAR(255),
        `subject` VARCHAR(500) NOT NULL,
        `body` TEXT NOT NULL,
        `template` VARCHAR(100),
        `status` ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
        `attempts` INT DEFAULT 0,
        `last_attempt` DATETIME,
        `sent_at` DATETIME,
        `error_message` TEXT,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_status` (`status`),
        INDEX `idx_created_at` (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $pdo->exec($sql);
    echo "✅ Table 'email_queue' created or already exists.<br>";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
