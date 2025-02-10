const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const dbConfig = require('../db-config');
const mysql = require('mysql2/promise');

module.exports = async function (context, req) {
    const pool = await mysql.createPool(dbConfig);
    
    if (req.method === 'POST') {
        const { username, password, code } = req.body;
        
        try {
            // 驗證碼檢查邏輯
            const [codes] = await pool.execute(
                'SELECT * FROM verification_codes WHERE code = ? AND is_used = FALSE',
                [code]
            );
            
            if (codes.length === 0) {
                context.res = {
                    status: 400,
                    body: { message: "無效的驗證碼" }
                };
                return;
            }
            
            // 創建新用戶
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = uuidv4();
            
            await pool.execute(
                'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
                [userId, username, hashedPassword]
            );
            
            // 標記驗證碼為已使用
            await pool.execute(
                'UPDATE verification_codes SET is_used = TRUE, used_by = ? WHERE code = ?',
                [userId, code]
            );
            
            context.res = {
                body: { message: "註冊成功" }
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: { message: "註冊失敗：" + error.message }
            };
        }
    }
}; 