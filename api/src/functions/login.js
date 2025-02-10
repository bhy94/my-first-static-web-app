const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

app.http('login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { username, password } = await request.json();
            const pool = await mysql.createPool(config.database);
            
            // 查詢用戶
            const [users] = await pool.execute(
                'SELECT id, username, password FROM users WHERE username = ?',
                [username]
            );
            
            if (users.length === 0) {
                return {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: false,
                        message: "用戶名或密碼錯誤"
                    })
                };
            }
            
            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.password);
            
            if (!validPassword) {
                return {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: false,
                        message: "用戶名或密碼錯誤"
                    })
                };
            }
            
            // 更新最後登錄時間
            await pool.execute(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [user.id]
            );
            
            // 生成 JWT token
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                config.jwt.secret,
                { expiresIn: config.jwt.expiresIn }
            );
            
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        username: user.username
                    }
                })
            };
            
        } catch (error) {
            context.log.error('Login Error:', error);
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    message: "登錄失敗：" + error.message
                })
            };
        }
    }
}); 