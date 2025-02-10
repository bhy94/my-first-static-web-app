const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');
const crypto = require('crypto');

// 在頂部新增邀請碼生成器
const generateInviteCode = () => {
  const prefix = 'Bian-';
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${datePart}-${randomPart}`;
};

// 修改驗證邏輯
const storedCode = process.env.INVITE_CODE || generateInviteCode();
context.log(`當前有效邀請碼：${storedCode}`);

app.http('register', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            
            // 驗證邀請碼
            const connection = await mysql.createConnection(dbConfig);
            const [validCode] = await connection.execute(
                'SELECT id FROM invitation_codes WHERE code = ? AND used = 0',
                [body.inviteCode]
            );
            
            if (validCode.length === 0) {
                return {
                    status: 403,
                    body: JSON.stringify({
                        success: false,
                        message: '❌ 魔法咒語失效啦！快找卞卞神大人要新的吧～'
                    })
                };
            }

            // 標記邀請碼為已使用
            await connection.execute(
                'UPDATE invitation_codes SET used = 1 WHERE code = ?',
                [body.inviteCode]
            );

            // 密碼加密
            const hashedPassword = crypto
                .createHash('sha256')
                .update(body.password)
                .digest('hex');

            // 檢查用戶名是否重複
            const [existing] = await connection.execute(
                'SELECT UserID FROM user WHERE UserName = ?',
                [body.username]
            );
            
            if(existing.length > 0) {
                return {
                    status: 400,
                    body: JSON.stringify({
                        success: false,
                        message: '用戶名已被使用'
                    })
                };
            }

            // 創建新用戶
            const [result] = await connection.execute(
                'INSERT INTO user (UserName, UserPwd) VALUES (?, ?)',
                [body.username, hashedPassword]
            );
            
            // 在創建用戶後加入日誌記錄
            context.log(`新用戶註冊成功：${body.username}，使用邀請碼：${body.inviteCode}`);

            // 加入防暴力破解機制
            const MAX_ATTEMPTS = 5;
            const [attempts] = await connection.execute(
                'SELECT COUNT(*) AS count FROM failed_logins WHERE username = ? AND timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR)',
                [body.username]
            );

            if(attempts[0].count >= MAX_ATTEMPTS) {
                return {
                    status: 429,
                    body: JSON.stringify({
                        success: false,
                        message: '嘗試次數過多，請稍後再試'
                    })
                };
            }

            return {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    userId: result.insertId
                })
            };
            
        } catch (error) {
            context.log.error('註冊錯誤:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    success: false,
                    message: '註冊失敗：' + error.message
                })
            };
        }
    }
}); 