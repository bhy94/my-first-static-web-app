import React, { useState, useEffect, useCallback } from 'react';

// 哆啦A梦主题颜色
const doraemonTheme = {
  primary: '#00A0E9', // 哆啦A梦的蓝色
  secondary: '#FFFFFF', // 白色
  accent: '#FF0000', // 红色（项圈）
  yellow: '#FFD700', // 铃铛黄色
  background: '#F0F8FF', // 淡蓝色背景
};

// 全局样式
const globalStyles = {
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  color: '#1d1d1f',
  backgroundColor: doraemonTheme.background,
  minHeight: '100vh',
  padding: '20px',
  boxSizing: 'border-box',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300A0E9' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
  backgroundSize: '40px',
  backgroundRepeat: 'repeat'
};

// 登录页面样式
const loginContainerStyles = {
  maxWidth: '400px',
  width: '90%',
  margin: '50px auto',
  padding: '30px',
  backgroundColor: doraemonTheme.secondary,
  borderRadius: '20px',
  boxShadow: '0 4px 15px rgba(0, 160, 233, 0.2)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-60px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '100px',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%2300A0E9'/%3E%3Ccircle cx='50' cy='50' r='40' fill='white'/%3E%3Ccircle cx='50' cy='55' r='30' fill='%23FF0000'/%3E%3Ccircle cx='35' cy='40' r='8' fill='white'/%3E%3Ccircle cx='65' cy='40' r='8' fill='white'/%3E%3Ccircle cx='37' cy='40' r='4' fill='black'/%3E%3Ccircle cx='67' cy='40' r='4' fill='black'/%3E%3C/svg%3E")`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  }
};

// 输入框样式
const inputStyles = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  border: `2px solid ${doraemonTheme.primary}`,
  borderRadius: '12px',
  backgroundColor: '#fff',
  transition: 'all 0.3s ease',
  outline: 'none',
  '&:focus': {
    borderColor: doraemonTheme.accent,
    boxShadow: '0 0 5px rgba(0, 160, 233, 0.3)'
  }
};

// 按钮样式
const buttonStyles = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  fontWeight: '500',
  backgroundColor: doraemonTheme.primary,
  color: doraemonTheme.secondary,
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: '#0088cc',
    transform: 'translateY(-2px)'
  },
  '&:disabled': {
    backgroundColor: '#999',
    cursor: 'not-allowed'
  }
};

// 表格容器样式
const tableContainerStyles = {
  backgroundColor: doraemonTheme.secondary,
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 4px 15px rgba(0, 160, 233, 0.2)',
  overflowX: 'auto',
  marginTop: '20px',
  border: `2px solid ${doraemonTheme.primary}`
};

// 表格样式
const tableStyles = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 8px',
  '& th': {
    padding: '12px 16px',
    textAlign: 'left',
    color: doraemonTheme.primary,
    fontWeight: '600',
    borderBottom: `2px solid ${doraemonTheme.primary}`
  },
  '& td': {
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 160, 233, 0.05)',
    '&:first-child': {
      borderTopLeftRadius: '12px',
      borderBottomLeftRadius: '12px'
    },
    '&:last-child': {
      borderTopRightRadius: '12px',
      borderBottomRightRadius: '12px'
    }
  }
};

// 表单容器样式
const formContainerStyles = {
  backgroundColor: doraemonTheme.secondary,
  borderRadius: '20px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 4px 15px rgba(0, 160, 233, 0.2)',
  border: `2px solid ${doraemonTheme.primary}`
};

// 导航栏样式
const navbarStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: doraemonTheme.primary,
  color: doraemonTheme.secondary,
  borderRadius: '20px',
  marginBottom: '20px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '50px',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23FFD700'/%3E%3C/svg%3E")`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  }
};

// 添加模态框样式
const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: doraemonTheme.secondary,
  padding: '30px',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 4px 15px rgba(0, 160, 233, 0.2)',
  zIndex: 1000,
  border: `2px solid ${doraemonTheme.primary}`
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

  // 添加动画效果状态
  const [isHovering, setIsHovering] = useState(false);

  // 添加提示消息组件
  const DoraemonMessage = ({ message }) => (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: doraemonTheme.primary,
      color: doraemonTheme.secondary,
      padding: '10px 20px',
      borderRadius: '20px',
      boxShadow: '0 4px 15px rgba(0, 160, 233, 0.2)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div 
        style={{ 
          width: '30px', 
          height: '30px',
          backgroundColor: doraemonTheme.primary,
          borderRadius: '50%',
          border: `2px solid ${doraemonTheme.secondary}`
        }}
      />
      {message}
    </div>
  );

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

  // 登录页面
  const renderLoginPage = () => (
    <div style={loginContainerStyles}>
      <h2 style={{ 
        textAlign: 'center', 
        color: doraemonTheme.primary,
        marginBottom: '30px'
      }}>
        欢迎使用哆啦A梦记账本
      </h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="输入用户名"
            style={inputStyles}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入密码"
            style={inputStyles}
          />
        </div>
        <button
          type="submit"
          style={buttonStyles}
          disabled={isLoading}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isLoading ? '登录中...' : '登录'}
          {isHovering && (
            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                backgroundColor: doraemonTheme.yellow,
                borderRadius: '50%',
                animation: 'swing 1s infinite'
              }}
            />
          )}
        </button>
      </form>
      {error && <DoraemonMessage message={error} />}
    </div>
  );

  // 记账界面
  const renderExpenseTracker = () => (
    <div>
      <nav style={navbarStyles}>
        <h1 style={{ margin: 0 }}>哆啦A梦的记账本</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>欢迎回来, {currentUser?.username}</span>
          <button
            onClick={handleLogout}
            style={{
              ...buttonStyles,
              width: 'auto',
              padding: '8px 16px',
              backgroundColor: doraemonTheme.accent
            }}
          >
            退出
          </button>
        </div>
      </nav>

      <div style={formContainerStyles}>
        <h3 style={{ color: doraemonTheme.primary, marginTop: 0 }}>添加新支出</h3>
        <form onSubmit={handleAddExpense} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            placeholder="金额"
            style={inputStyles}
          />
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            style={inputStyles}
          >
            <option value="">选择类别</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            placeholder="描述"
            style={inputStyles}
          />
          <button type="submit" style={{
            ...buttonStyles,
            backgroundColor: doraemonTheme.primary
          }}>
            添加支出
          </button>
        </form>
      </div>

      <div style={tableContainerStyles}>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th>日期</th>
              <th>金额</th>
              <th>类别</th>
              <th>描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.RecordID}>
                <td>{new Date(expense.RecordDate).toLocaleDateString('zh-CN')}</td>
                <td style={{ color: doraemonTheme.accent }}>¥{parseFloat(expense.Amount).toFixed(2)}</td>
                <td>{expense.Category}</td>
                <td>{expense.Description}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setEditingExpense(expense)}
                      style={{
                        ...buttonStyles,
                        width: 'auto',
                        padding: '4px 8px',
                        fontSize: '14px'
                      }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.RecordID)}
                      style={{
                        ...buttonStyles,
                        width: 'auto',
                        padding: '4px 8px',
                        fontSize: '14px',
                        backgroundColor: doraemonTheme.accent
                      }}
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 添加编辑对话框 */}
      {editingExpense && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }}>
          <div style={modalStyles}>
            <h3 style={{ color: doraemonTheme.primary, marginTop: 0 }}>编辑支出记录</h3>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="number"
                value={editingExpense.amount}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  amount: e.target.value
                })}
                placeholder="金额"
                style={inputStyles}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <select
                value={editingExpense.category}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  category: e.target.value
                })}
                style={inputStyles}
              >
                <option value="">选择类别</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={editingExpense.description}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  description: e.target.value
                })}
                placeholder="描述"
                style={inputStyles}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingExpense(null)}
                style={{
                  ...buttonStyles,
                  width: 'auto',
                  padding: '8px 16px',
                  backgroundColor: doraemonTheme.accent
                }}
              >
                取消
              </button>
              <button
                onClick={() => handleUpdateExpense(editingExpense.RecordID)}
                style={{
                  ...buttonStyles,
                  width: 'auto',
                  padding: '8px 16px'
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

  return (
    <div style={globalStyles}>
      {!isLoggedIn ? renderLoginPage() : renderExpenseTracker()}
      <style>
        {`
          @keyframes swing {
            0% { transform: translateY(-50%) rotate(0deg); }
            25% { transform: translateY(-50%) rotate(15deg); }
            75% { transform: translateY(-50%) rotate(-15deg); }
            100% { transform: translateY(-50%) rotate(0deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;