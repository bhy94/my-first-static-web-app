import React, { useState, useEffect, useCallback } from 'react';

// 添加全局样式
const globalStyles = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
  color: '#1d1d1f',
  backgroundColor: '#f5f5f7',
  minHeight: '100vh',
  padding: '20px',
  boxSizing: 'border-box'
};

// 登录页面样式
const loginContainerStyles = {
  maxWidth: '400px',
  width: '90%',
  margin: '50px auto',
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '@media (max-width: 480px)': {
    width: '95%',
    padding: '20px',
    margin: '20px auto'
  }
};

// 输入框样式
const inputStyles = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #d2d2d7',
  borderRadius: '12px',
  backgroundColor: '#f5f5f7',
  transition: 'all 0.3s ease',
  outline: 'none',
  '&:focus': {
    borderColor: '#0071e3',
    backgroundColor: '#fff'
  }
};

// 按钮样式
const buttonStyles = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  fontWeight: '500',
  backgroundColor: '#0071e3',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#0077ed'
  },
  '&:disabled': {
    backgroundColor: '#999',
    cursor: 'not-allowed'
  }
};

// 表格容器样式
const tableContainerStyles = {
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  overflowX: 'auto',
  '@media (max-width: 768px)': {
    padding: '10px',
    borderRadius: '15px'
  }
};

// 修改表格样式
const tableStyles = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 8px',
  '& th': {
    padding: '12px 16px',
    textAlign: 'left',
    color: '#86868b',
    fontWeight: '500',
    borderBottom: '1px solid #d2d2d7'
  },
  '& td': {
    padding: '12px 16px',
    backgroundColor: '#f5f5f7',
    '&:first-child': {
      borderTopLeftRadius: '12px',
      borderBottomLeftRadius: '12px'
    },
    '&:last-child': {
      borderTopRightRadius: '12px',
      borderBottomRightRadius: '12px'
    }
  },
  '@media (max-width: 768px)': {
    '& th, & td': {
      padding: '8px'
    }
  }
};

// 添加新记录表单样式
const formContainerStyles = {
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '@media (max-width: 768px)': {
    padding: '15px'
  }
};

// 响应式表单布局
const formStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gap: '10px'
  }
};

// 修改编辑对话框样式
const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  '@media (max-width: 480px)': {
    width: '95%',
    padding: '20px'
  }
};

// 修改导航栏样式
const navbarStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  marginBottom: '20px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gap: '10px',
    textAlign: 'center'
  }
};

function App() {
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return !!savedUser;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
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

  // 使用 useCallback 包裝 fetchExpenses 函數
  const fetchExpenses = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`/api/expenses/${currentUser.UserID}`);
      if (!response.ok) throw new Error('獲取消費記錄失敗');
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser]);

  // 登錄成功後獲取消費記錄
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchExpenses();
    }
  }, [isLoggedIn, currentUser, fetchExpenses]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        // 保存到本地存储
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setError(null);
      } else {
        setError(data.message || '登录失败');
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('登录过程中发生错误：' + err.message);
      setIsLoggedIn(false);
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
    } finally {
      setIsLoading(false);
    }
  };

  // 修改登出函数
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setExpenses([]);
    localStorage.removeItem('currentUser');
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

  return (
    <div style={globalStyles}>
      {!isLoggedIn ? (
        <div style={loginContainerStyles}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px' }}>登录</h2>
          {error && (
            <div style={{
              color: '#ff3b30',
              padding: '12px',
              backgroundColor: '#fff2f2',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ marginBottom: '8px', display: 'block' }}>用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyles}
                disabled={isLoading}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ marginBottom: '8px', display: 'block' }}>密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyles}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={buttonStyles}
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          <div style={navbarStyles}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>個人記賬系統</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentUser && (
                <span style={{ color: '#666' }}>
                  歡迎, {currentUser.UserName}
                </span>
              )}
              <button 
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ff3b30',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#ff453a'
                  }
                }}
              >
                登出
              </button>
            </div>
          </div>

          {/* 添加新消費記錄表單 */}
          <div style={formContainerStyles}>
            <h3>添加新消費記錄</h3>
            <form onSubmit={handleAddExpense} style={formStyles}>
              <input
                type="number"
                step="0.01"
                placeholder="金額"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                style={{ ...inputStyles, padding: '8px' }}
                required
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                style={{ ...inputStyles, padding: '8px' }}
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
                style={{ ...inputStyles, padding: '8px', flex: 1 }}
              />
              <button
                type="submit"
                style={buttonStyles}
              >
                添加
              </button>
            </form>
          </div>

          {/* 消費記錄列表 */}
          <div style={tableContainerStyles}>
            <table style={tableStyles}>
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
            <div style={modalStyles}>
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
                  style={buttonStyles}
                >
                  取消
                </button>
                <button
                  onClick={() => handleUpdateExpense(editingExpense.RecordID)}
                  style={buttonStyles}
                >
                  保存
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;