const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const config = require('../config');

app.http('message', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const pool = await mysql.createPool(config.database);
            
            switch (request.method) {
                case 'GET':
                    const userId = request.headers['x-user-id'];
                    const [messages] = await pool.execute(
                        `SELECT * FROM messages 
                         WHERE user_id = ? 
                         ORDER BY created_at DESC 
                         LIMIT 50`,
                        [userId]
                    );
                    
                    return {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(messages)
                    };
                    
                case 'POST':
                    const { title, content, type } = request.body;
                    const userId = request.headers['x-user-id'];
                    
                    await pool.execute(
                        `INSERT INTO messages (user_id, title, content, type) 
                         VALUES (?, ?, ?, ?)`,
                        [userId, title, content, type]
                    );
                    
                    return {
                        body: { message: "消息發送成功" }
                    };
            }
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