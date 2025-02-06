const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');

app.http('login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const username = body.username;
            const password = body.password;

            // 添加日誌來幫助調試
            context.log('Login attempt:', { username });

            const connection = await mysql.createConnection(dbConfig);
            
            // 修改 SQL 查詢以匹配數據庫表結構
            const [users] = await connection.execute(
                'SELECT UserID, UserName FROM user WHERE UserName = ? AND UserPwd = ?',
                [username, password]
            );
            
            await connection.end();

            // 添加更多日誌
            context.log('Query result:', users);
            
            if (users && users.length > 0) {
                return {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: true,
                        user: {
                            UserID: users[0].UserID,
                            UserName: users[0].UserName
                        }
                    })
                };
            } else {
                return {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    message: '登錄過程中發生錯誤：' + error.message
                })
            };
        }
    }
}); 