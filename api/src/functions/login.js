const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');
const crypto = require('crypto');

app.http('login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // 確保始終返回 JSON 格式
        const jsonResponse = (status, body) => ({
            status: status,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });

        try {
            const body = await request.json();
            const username = body.username;
            const password = body.password;

            // 添加日誌來幫助調試
            context.log('Login attempt:', { username });

            const connection = await mysql.createConnection(dbConfig);
            
            // 加強 SQL 查詢安全性
            const [users] = await connection.execute(
                'SELECT UserID, UserName, UserPwd FROM user WHERE UserName = ?',
                [username]
            );
            
            await connection.end();

            // 添加更多日誌
            context.log('Query result:', users);
            
            // 驗證密碼匹配
            const validUser = users.find(u => {
                // 使用 SHA-256 加密比對
                const hashedInput = crypto.createHash('sha256').update(password).digest('hex');
                return u.UserPwd === hashedInput;
            });
            if (!validUser) {
                return jsonResponse(401, { 
                    success: false,
                    message: '用戶名或密碼錯誤'
                });
            }

            return jsonResponse(200, {
                success: true,
                user: {
                    UserID: validUser.UserID,
                    UserName: validUser.UserName
                }
            });

        } catch (error) {
            context.log.error('Database Error:', error);
            return jsonResponse(500, {
                success: false,
                error: '系統錯誤',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            });
        }
    }
}); 