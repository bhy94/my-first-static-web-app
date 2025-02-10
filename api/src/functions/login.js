const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');

module.exports = async function (context, req) {
    const pool = await mysql.createPool(dbConfig);
    
    if (req.method === 'POST') {
        const { username, password } = req.body;
        
        try {
            // 查詢用戶
            const [users] = await pool.execute(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );
            
            if (users.length === 0) {
                context.res = {
                    status: 401,
                    body: { message: "用戶名或密碼錯誤" }
                };
                return;
            }
            
            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.password);
            
            if (!validPassword) {
                context.res = {
                    status: 401,
                    body: { message: "用戶名或密碼錯誤" }
                };
                return;
            }
            
            // 更新最後登錄時間
            await pool.execute(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [user.id]
            );
            
            // 生成 JWT token
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );
            
            context.res = {
                body: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username
                    }
                }
            };
            
        } catch (error) {
            context.res = {
                status: 500,
                body: { message: "登錄失敗：" + error.message }
            };
        }
    }
}; 