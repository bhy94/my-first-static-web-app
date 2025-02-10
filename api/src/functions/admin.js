const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

app.http('admin', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // 權限驗證
        const authHeader = request.headers.get('x-admin-key');
        if(authHeader !== process.env.ADMIN_KEY) {
            return { status: 401, body: 'Unauthorized' };
        }

        const pool = await mysql.createPool(config.database);
        
        try {
            switch (request.method) {
                case 'POST':
                    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
                    await pool.execute(
                        'INSERT INTO verification_codes (code) VALUES (?)',
                        [code]
                    );
                    return {
                        body: { 
                            message: "驗證碼生成成功",
                            code: code
                        }
                    };
                    
                case 'GET':
                    const [codes] = await pool.execute(
                        'SELECT code, created_at FROM verification_codes WHERE is_used = FALSE'
                    );
                    return {
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(codes)
                    };
            }
        } catch (error) {
            context.log.error('Admin Error:', error);
            return {
                status: 500,
                body: { message: error.message }
            };
        }
    }
}); 