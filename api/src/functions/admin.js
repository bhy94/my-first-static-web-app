const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');

app.http('listCodes', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    // 權限驗證
    const authHeader = request.headers.get('x-admin-key');
    if(authHeader !== process.env.ADMIN_KEY) {
      return { status: 401, body: 'Unauthorized' };
    }

    const connection = await mysql.createConnection(dbConfig);
    const [codes] = await connection.execute(
      'SELECT code, used, created_at FROM invitation_codes ORDER BY created_at DESC LIMIT 50'
    );

    return {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(codes)
    };
  }
}); 