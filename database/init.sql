-- 在线租房系统数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS houserent DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE houserent;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  real_name VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  avatar VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 房源表
CREATE TABLE IF NOT EXISTS houses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  landlord_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  address VARCHAR(200),
  price DECIMAL(10, 2) NOT NULL,
  area INT NOT NULL,
  bedroom INT NOT NULL,
  living_room INT DEFAULT 0,
  bathroom INT DEFAULT 1,
  orientation VARCHAR(20),
  floor VARCHAR(50),
  decoration VARCHAR(20),
  house_type VARCHAR(20),
  images TEXT,
  facilities TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_landlord_id (landlord_id),
  INDEX idx_city (city),
  INDEX idx_district (district),
  INDEX idx_status (status),
  INDEX idx_price (price),
  FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 预约表
CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  house_id BIGINT NOT NULL,
  tenant_id BIGINT NOT NULL,
  landlord_id BIGINT NOT NULL,
  visit_date DATE NOT NULL,
  visit_time VARCHAR(20) NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_house_id (house_id),
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_landlord_id (landlord_id),
  INDEX idx_status (status),
  INDEX idx_visit_date (visit_date),
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  house_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_house (user_id, house_id),
  INDEX idx_user_id (user_id),
  INDEX idx_house_id (house_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入测试数据（可选）
-- 测试房东用户 (密码: 123456, 使用BCrypt加密)
-- INSERT INTO users (username, password, role, real_name, phone) VALUES 
-- ('landlord1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'LANDLORD', '张先生', '13800138001');

-- 测试租客用户 (密码: 123456)
-- INSERT INTO users (username, password, role, real_name, phone) VALUES 
-- ('tenant1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'TENANT', '李女士', '13800138002');
