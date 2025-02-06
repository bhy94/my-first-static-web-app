const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');

app.http('message', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            // 創建數據庫連接
            const connection = await mysql.createConnection(dbConfig);
            
            // 執行查詢
            const [rows] = await connection.execute('SELECT * FROM user');
            
            // 關閉連接
            await connection.end();
            
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rows)
            };
        } catch (error) {
            context.log.error('Database Error:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    error: '數據庫連接錯誤'
                })
            };
        }
    }
});