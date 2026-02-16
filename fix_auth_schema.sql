-- Fix Authentication Schema to match api.php (UUIDs, not INTs)

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `cms_sessions`;
DROP TABLE IF EXISTS `login_history`;
DROP TABLE IF EXISTS `password_resets`;
DROP TABLE IF EXISTS `email_verifications`;
DROP TABLE IF EXISTS `cms_users`;
DROP TABLE IF EXISTS `cms_roles`;

-- Recreate Roles with String ID
CREATE TABLE `cms_roles` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT,
    `permissions` JSON,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recreate Users with UUID ID and role_id
CREATE TABLE `cms_users` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100),
    `role_id` VARCHAR(50),
    `avatar_url` VARCHAR(255),
    `is_verified` BOOLEAN DEFAULT FALSE,
    `last_login` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`role_id`) REFERENCES `cms_roles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recreate Sessions with String user_id
CREATE TABLE `cms_sessions` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `session_token` VARCHAR(255) UNIQUE NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `cms_users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Role (Supoer Admin)
INSERT INTO `cms_roles` (`id`, `name`, `permissions`) VALUES ('role_super_admin', 'Super Admin', '["*"]');
-- Insert User Role
INSERT INTO `cms_roles` (`id`, `name`, `permissions`) VALUES ('role_user', 'User', '[]');

SET FOREIGN_KEY_CHECKS = 1;
