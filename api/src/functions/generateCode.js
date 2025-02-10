const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');
const crypto = require('crypto');

app.http('generateCode', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    // 權限驗證
    const authHeader = request.headers.get('x-admin-key');
    if(authHeader !== process.env.ADMIN_KEY) {
      return { status: 401, body: 'Unauthorized' };
    }

    const generateCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for(let i=0; i<6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const connection = await mysql.createConnection(dbConfig);
    let code;
    let isUnique = false;

    while(!isUnique) {
      code = generateCode();
      const [existing] = await connection.execute(
        'SELECT id FROM invitation_codes WHERE code = ?',
        [code]
      );
      isUnique = existing.length === 0;
    }

    await connection.execute(
      'INSERT INTO invitation_codes (code) VALUES (?)',
      [code]
    );

    return {
      body: JSON.stringify({
        code: code,
        expires: new Date(Date.now() + 86400000).toISOString() // 24小時有效
      })
    };
  }
}); 