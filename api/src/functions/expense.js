const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const dbConfig = require('../db-config');

// 獲取用戶的所有消費記錄
app.http('getExpenses', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'expenses/{userId}',
    handler: async (request, context) => {
        try {
            const userId = request.params.userId;
            const connection = await mysql.createConnection(dbConfig);
            
            const [rows] = await connection.execute(
                `SELECT RecordID, Amount, Category, Description, 
                DATE_FORMAT(RecordDate, '%Y-%m-%d %H:%i:%s') AS FormattedDate 
                FROM expense_records WHERE UserID = ?`,
                [userId]
            );
            
            await connection.end();
            
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rows)
            };
        } catch (error) {
            context.log.error('Get Expenses Error:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    success: false,
                    message: '獲取消費記錄失敗：' + error.message
                })
            };
        }
    }
});

// 添加新的消費記錄
app.http('addExpense', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'expenses',
    handler: async (request, context) => {
        try {
            const { userId, amount, category, description } = await request.json();
            const connection = await mysql.createConnection(dbConfig);
            
            const [result] = await connection.execute(
                'INSERT INTO expense_records (UserID, Amount, Category, Description) VALUES (?, ?, ?, ?)',
                [userId, amount, category, description]
            );
            
            await connection.end();
            
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    recordId: result.insertId
                })
            };
        } catch (error) {
            context.log.error('Add Expense Error:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    success: false,
                    message: '添加消費記錄失敗：' + error.message
                })
            };
        }
    }
});

// 修改消費記錄
app.http('updateExpense', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'expenses/{recordId}',
    handler: async (request, context) => {
        try {
            const recordId = request.params.recordId;
            const { amount, category, description } = await request.json();
            const connection = await mysql.createConnection(dbConfig);
            
            await connection.execute(
                'UPDATE expense_records SET Amount = ?, Category = ?, Description = ? WHERE RecordID = ?',
                [amount, category, description, recordId]
            );
            
            await connection.end();
            
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true
                })
            };
        } catch (error) {
            context.log.error('Update Expense Error:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    success: false,
                    message: '更新消費記錄失敗：' + error.message
                })
            };
        }
    }
});

// 刪除消費記錄
app.http('deleteExpense', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'expenses/{recordId}',
    handler: async (request, context) => {
        try {
            const recordId = request.params.recordId;
            const connection = await mysql.createConnection(dbConfig);
            
            await connection.execute(
                'DELETE FROM expense_records WHERE RecordID = ?',
                [recordId]
            );
            
            await connection.end();
            
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true
                })
            };
        } catch (error) {
            context.log.error('Delete Expense Error:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    success: false,
                    message: '刪除消費記錄失敗：' + error.message
                })
            };
        }
    }
}); 