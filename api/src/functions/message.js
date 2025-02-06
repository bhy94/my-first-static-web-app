const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');

app.http('message', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            // 測試連接
            const connection = await mysql.createConnection(dbConfig);
            context.log('Database connected!');
            
            // 測試查詢
            const [rows] = await connection.execute('SELECT 1');
            context.log('Query successful!');
            
            // 實際查詢
            const [users] = await connection.execute('SELECT * FROM user');
            
            await connection.end();
            
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(users)
            };
        } catch (error) {
            context.log.error('Database Error:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    error: '數據庫連接錯誤',
                    details: error.message
                })
            };
        }
    }
});