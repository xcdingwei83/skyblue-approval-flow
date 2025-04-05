
-- 资料审批系统数据库设置脚本

-- 创建用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` ENUM('admin', 'approver', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建资料表
CREATE TABLE IF NOT EXISTS `materials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `preview_url` VARCHAR(500) NOT NULL,
  `original_url` VARCHAR(500) NOT NULL,
  `upload_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `uploader_id` INT,
  `approver_id` INT,
  `status` ENUM('pending', 'approved', 'rejected', 'published') DEFAULT 'pending',
  `approval_date` TIMESTAMP NULL,
  FOREIGN KEY (`uploader_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`approver_id`) REFERENCES `users`(`id`)
);

-- 插入默认管理员用户
INSERT INTO `users` (`username`, `password`, `name`, `role`) VALUES
('admin', '$2y$10$ZIyi.GvIhChpJa/PH.Wh3.8CAQX3iH9vOlgQKUNPeUgMZ7MQJ3LHi', '管理员', 'admin');

-- 插入默认审批员用户
INSERT INTO `users` (`username`, `password`, `name`, `role`) VALUES
('approver', '$2y$10$FPkNLFvWj9qL71ygsZhKJeJ8WrOvJfnHhz9z4XKvvLepmU5RYZjWi', '审批人', 'approver');

-- 插入默认普通用户
INSERT INTO `users` (`username`, `password`, `name`, `role`) VALUES
('user', '$2y$10$03gHNxPUEwknCKWlwx7v9OYqzO/1jgGrO8hN63tCsLGA6utQvFp3G', '普通用户', 'user');

-- 说明：
-- admin 用户密码是 admin123
-- approver 用户密码是 approve123
-- user 用户密码是 user123
-- 密码使用 bcrypt 进行加密
