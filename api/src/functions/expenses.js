const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const config = require('../config');

module.exports = async function (context, req) {
    const pool = await mysql.createPool(config.database);
    
    switch (req.method) {
        case 'GET':
            try {
                const userId = req.headers['x-user-id'];
                const [rows] = await pool.execute(
                    'SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC',
                    [userId]
                );
                
                context.res = {
                    body: rows
                };
            } catch (error) {
                context.res = {
                    status: 500,
                    body: { message: "獲取記錄失敗：" + error.message }
                };
            }
            break;
            
        case 'POST':
            try {
                const { amount, category, description } = req.body;
                const userId = req.headers['x-user-id'];
                const expenseId = uuidv4();
                
                await pool.execute(
                    'INSERT INTO expenses (id, user_id, amount, category, description) VALUES (?, ?, ?, ?, ?)',
                    [expenseId, userId, amount, category, description]
                );
                
                context.res = {
                    body: { message: "添加成功" }
                };
            } catch (error) {
                context.res = {
                    status: 500,
                    body: { message: "添加失敗：" + error.message }
                };
            }
            break;

        case 'PUT':
            try {
                const { id, amount, category, description } = req.body;
                const userId = req.headers['x-user-id'];
                
                // 驗證記錄所有權
                const [existing] = await pool.execute(
                    'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
                    [id, userId]
                );
                
                if (existing.length === 0) {
                    context.res = {
                        status: 404,
                        body: { message: "記錄不存在或無權限修改" }
                    };
                    return;
                }
                
                await pool.execute(
                    'UPDATE expenses SET amount = ?, category = ?, description = ? WHERE id = ?',
                    [amount, category, description, id]
                );
                
                context.res = {
                    body: { message: "更新成功" }
                };
            } catch (error) {
                context.res = {
                    status: 500,
                    body: { message: "更新失敗：" + error.message }
                };
            }
            break;

        case 'DELETE':
            try {
                const id = req.query.id;
                const userId = req.headers['x-user-id'];
                
                // 驗證記錄所有權
                const [existing] = await pool.execute(
                    'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
                    [id, userId]
                );
                
                if (existing.length === 0) {
                    context.res = {
                        status: 404,
                        body: { message: "記錄不存在或無權限刪除" }
                    };
                    return;
                }
                
                await pool.execute(
                    'DELETE FROM expenses WHERE id = ?',
                    [id]
                );
                
                context.res = {
                    body: { message: "刪除成功" }
                };
            } catch (error) {
                context.res = {
                    status: 500,
                    body: { message: "刪除失敗：" + error.message }
                };
            }
            break;
    }
}; 