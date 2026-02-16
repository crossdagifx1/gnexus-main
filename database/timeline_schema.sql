-- G-Nexus Platform - Company Timeline Schema
-- This table stores company milestones to be displayed on the homepage timeline section

CREATE TABLE IF NOT EXISTS company_timeline (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(50) DEFAULT 'Sparkles',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_display_order (display_order),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample timeline data for G-Nexus journey
INSERT INTO company_timeline (year, title, description, icon_name, display_order) VALUES
('2019', 'Founded', 'G-Nexus was established with a vision to digitize Ethiopian businesses through innovative technology solutions.', 'Sparkles', 1),
('2020', 'First 50 Clients', 'Reached the milestone of serving 50+ businesses across Ethiopia with web development and digital solutions.', 'Users', 2),
('2021', '3D Studio Launch', 'Expanded our services to include architectural visualization, 3D rendering, and immersive virtual tours.', 'Box', 3),
('2022', 'AI Integration', 'Introduced AI-powered tools, automation services, and intelligent business solutions to our portfolio.', 'Brain', 4),
('2023', 'G-Nexus Platform Beta', 'Launched our comprehensive business management platform designed specifically for Ethiopian SMEs.', 'Rocket', 5),
('2024', 'Nationwide Expansion', 'Scaled operations to serve businesses across all major Ethiopian cities with 24/7 support.', 'TrendingUp', 6);
