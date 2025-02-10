-- 1. 創建一個管理員用戶
INSERT INTO users (id, username, password, created_at) VALUES 
(UUID(), 'admin', '$2a$10$xPJ5SxMm6yXJoqMp0GWzIeYoWwR.yQeKi9hcPpSKqWgbO.WwZvPfy', NOW());
-- 注意：密碼是 'admin123' 的 bcrypt 哈希值

-- 2. 創建一個測試用戶
INSERT INTO users (id, username, password, created_at) VALUES 
(UUID(), 'test_user', '$2a$10$NHoZK1qTk4K0Mh/47.WIXuJwKxEPp8o9r/himYVqHNbYNqJwO9Aqm', NOW());
-- 注意：密碼是 'test123' 的 bcrypt 哈希值

-- 3. 創建一些測試用的驗證碼
INSERT INTO verification_codes (code, is_used, created_at) VALUES 
('TEST001', FALSE, NOW()),
('TEST002', FALSE, NOW()),
('TEST003', FALSE, NOW());

-- 4. 為測試用戶添加一些消費記錄
-- 首先獲取測試用戶的 ID
SET @test_user_id = (SELECT id FROM users WHERE username = 'test_user');

INSERT INTO expenses (id, user_id, amount, category, description, created_at) VALUES 
(UUID(), @test_user_id, 100.50, '飲食', '午餐', NOW()),
(UUID(), @test_user_id, 35.00, '交通', '公車', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(UUID(), @test_user_id, 299.99, '購物', '新衣服', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(UUID(), @test_user_id, 150.00, '娛樂', '電影', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(UUID(), @test_user_id, 50.00, '其他', '雜項', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- 5. 添加一些測試消息
INSERT INTO messages (id, user_id, title, content, type, is_read, created_at) VALUES 
(UUID(), @test_user_id, '歡迎使用', '歡迎使用蠟筆小新記賬本！', '系統', FALSE, NOW()),
(UUID(), @test_user_id, '消費提醒', '本月消費已超過預算的80%', '提醒', FALSE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(UUID(), @test_user_id, '新功能通知', '新增了消費統計圖表功能', '通知', FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- 更新測試用戶的密碼哈希（使用 bcrypt）
UPDATE users 
SET password = '$2a$10$NHoZK1qTk4K0Mh/47.WIXuJwKxEPp8o9r/himYVqHNbYNqJwO9Aqm'
WHERE username = 'test_user'; 