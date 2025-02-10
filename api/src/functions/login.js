const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

app.http('login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'api/login',
    handler: async (request, context) => {
        context.log('Login request received');
        
        try {
            const body = await request.json();
            const { username, password } = body;
            
            context.log('Attempting login for user:', username);
            
            const pool = await mysql.createPool(config.database);
            
            // 查詢用戶
            const [users] = await pool.execute(
                'SELECT id, username, password FROM users WHERE username = ?',
                [username]
            );
            
            if (users.length === 0) {
                context.log('User not found:', username);
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
                context.log('Invalid password for user:', username);
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
            
            // 生成 JWT token
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    username: user.username 
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );
            
            // 更新最後登錄時間
            await pool.execute(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [user.id]
            );
            
            context.log('Login successful for user:', username);
            
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

module.exports = app; 