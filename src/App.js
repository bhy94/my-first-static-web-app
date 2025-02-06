import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: ''
  });
  const [editingExpense, setEditingExpense] = useState(null);

  // 消費類別選項
  const categories = [
    '飲食',
    '交通',
    '購物',
    '娛樂',
    '醫療',
    '教育',
    '其他'
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting login with:', { username });
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.success) {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        setError(null);
      } else {
        setError(data.message || '登錄失敗');
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('登錄過程中發生錯誤：' + err.message);
      setIsLoggedIn(false);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 獲取消費記錄
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`/api/expenses/${currentUser.UserID}`);
      if (!response.ok) throw new Error('獲取消費記錄失敗');
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // 添加消費記錄
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.UserID,
          ...newExpense
        }),
      });
      
      if (!response.ok) throw new Error('添加消費記錄失敗');
      
      await fetchExpenses();
      setNewExpense({ amount: '', category: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // 更新消費記錄
  const handleUpdateExpense = async (recordId) => {
    try {
      const response = await fetch(`/api/expenses/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingExpense),
      });
      
      if (!response.ok) throw new Error('更新消費記錄失敗');
      
      await fetchExpenses();
      setEditingExpense(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // 刪除消費記錄
  const handleDeleteExpense = async (recordId) => {
    if (!window.confirm('確定要刪除這條記錄嗎？')) return;
    
    try {
      const response = await fetch(`/api/expenses/${recordId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('刪除消費記錄失敗');
      
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  // 登錄成功後獲取消費記錄
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchExpenses();
    }
  }, [isLoggedIn, currentUser]);

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '300px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>用戶登錄</h2>
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '10px', 
            padding: '10px', 
            backgroundColor: '#ffebee', 
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>用戶名：</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              disabled={isLoading}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>密碼：</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '登錄中...' : '登錄'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <h1 style={{ margin: 0 }}>個人記賬系統</h1>
        <div>
          {currentUser && `歡迎, ${currentUser.UserName}`}
          <button 
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentUser(null);
              setExpenses([]);
            }}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            登出
          </button>
        </div>
      </div>

      {/* 添加新消費記錄表單 */}
      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>添加新消費記錄</h3>
        <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            step="0.01"
            placeholder="金額"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          >
            <option value="">選擇類別</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="描述"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            添加
          </button>
        </form>
      </div>

      {/* 消費記錄列表 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 8px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>日期</th>
              <th style={{ padding: '12px 8px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>金額</th>
              <th style={{ padding: '12px 8px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>類別</th>
              <th style={{ padding: '12px 8px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>描述</th>
              <th style={{ padding: '12px 8px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.RecordID}>
                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>
                  {new Date(expense.RecordDate).toLocaleString()}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>
                  ¥{parseFloat(expense.Amount).toFixed(2)}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>
                  {expense.Category}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>
                  {expense.Description}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>
                  <button
                    onClick={() => setEditingExpense(expense)}
                    style={{
                      marginRight: '5px',
                      padding: '4px 8px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDeleteExpense(expense.RecordID)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 編輯消費記錄對話框 */}
      {editingExpense && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '4px',
            width: '400px'
          }}>
            <h3>編輯消費記錄</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>金額：</label>
              <input
                type="number"
                step="0.01"
                value={editingExpense.Amount}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  Amount: e.target.value
                })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>類別：</label>
              <select
                value={editingExpense.Category}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  Category: e.target.value
                })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>描述：</label>
              <input
                type="text"
                value={editingExpense.Description}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  Description: e.target.value
                })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setEditingExpense(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={() => handleUpdateExpense(editingExpense.RecordID)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;