const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');

app.http('login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { username, password } = await request.json();
            const connection = await mysql.createConnection(dbConfig);
            
            const [users] = await connection.execute(
                'SELECT UserID, UserName FROM user WHERE UserName = ? AND UserPwd = ?',
                [username, password]
            );
            
            await connection.end();
            
            if (users.length > 0) {
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: true,
                        user: users[0]
                    })
                };
            } else {
                return {
                    status: 401,
                    body: JSON.stringify({
                        success: false,
                        message: '用戶名或密碼錯誤'
                    })
                };
            }
        } catch (error) {
            context.log.error('Login Error:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    success: false,
                    message: '登錄過程中發生錯誤'
                })
            };
        }
    }
}); 