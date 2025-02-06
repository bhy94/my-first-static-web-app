import React, { useState, useEffect, useCallback } from 'react';

// 蜡笔小新主题颜色
const shinChanTheme = {
  primary: '#FF6B6B',     // 小新的红色
  secondary: '#FFFFFF',   // 白色
  accent: '#4A90E2',     // 动感超人的蓝色
  yellow: '#FFD93D',     // 小白的黄色
  green: '#6BCB77',      // 美伢的绿色
  background: '#FFF4E6', // 温暖的背景色
};

// 小新表情包
const shinChanEmotions = [
  {
    image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23000000'/%3E%3Cpath d='M30 40 Q50 70 70 40' stroke='white' fill='none' stroke-width='3'/%3E%3C/svg%3E`,
    text: '我是一个快乐的小朋友~'
  },
  {
    image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23000000'/%3E%3Cpath d='M30 60 Q50 30 70 60' stroke='white' fill='none' stroke-width='3'/%3E%3C/svg%3E`,
    text: '最喜欢吃饼干了！'
  },
  {
    image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23000000'/%3E%3Cpath d='M30 50 L70 50' stroke='white' fill='none' stroke-width='3'/%3E%3C/svg%3E`,
    text: '美伢，我错了...'
  }
];

// 支出类别图标
const categoryIcons = {
  '娱乐': {
    icon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='20' y='20' width='60' height='60' fill='%234A90E2'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='40'%3E超%3C/text%3E%3C/svg%3E`,
    color: shinChanTheme.accent
  },
  '家居': {
    icon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%236BCB77'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='40'%3E家%3C/text%3E%3C/svg%3E`,
    color: shinChanTheme.green
  },
  '食品': {
    icon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23FFD93D'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='40'%3E食%3C/text%3E%3C/svg%3E`,
    color: shinChanTheme.yellow
  },
  '其他': {
    icon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23FF6B6B'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='40'%3E其%3C/text%3E%3C/svg%3E`,
    color: shinChanTheme.primary
  }
};

// 随机鼓励文字
const encouragements = [
  '今天也要开开心心哦~',
  '省钱就是赚钱，动感超人说的！',
  '记账的孩子最棒啦！',
  '美伢夸你真懂事~',
  '小白为你骄傲！'
];

// 全局样式
const globalStyles = {
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  color: '#1d1d1f',
  backgroundColor: shinChanTheme.background,
  minHeight: '100vh',
  padding: '20px',
  boxSizing: 'border-box',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 20 Q40 20 40 30 T30 40 T20 30 T30 20' fill='none' stroke='%23FF6B6B' stroke-width='2' opacity='0.1'/%3E%3C/svg%3E")`,
  backgroundSize: '60px',
  backgroundRepeat: 'repeat'
};

// 登录页面样式
const loginContainerStyles = {
  maxWidth: '400px',
  width: '90%',
  margin: '50px auto',
  padding: '30px',
  backgroundColor: shinChanTheme.secondary,
  borderRadius: '20px',
  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-80px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    height: '120px',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23000'/%3E%3Cpath d='M30 40 Q50 70 70 40' stroke='white' fill='none' stroke-width='3'/%3E%3C/svg%3E")`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  }
};

// 输入框样式
const inputStyles = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  border: `2px solid ${shinChanTheme.primary}`,
  borderRadius: '12px',
  backgroundColor: '#fff',
  transition: 'all 0.3s ease',
  outline: 'none',
  '&:focus': {
    borderColor: shinChanTheme.accent,
    boxShadow: '0 0 5px rgba(0, 160, 233, 0.3)'
  }
};

// 按钮样式
const buttonStyles = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  fontWeight: '500',
  backgroundColor: shinChanTheme.primary,
  color: shinChanTheme.secondary,
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
  backgroundColor: shinChanTheme.secondary,
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 4px 15px rgba(0, 160, 233, 0.2)',
  overflowX: 'auto',
  marginTop: '20px',
  border: `2px solid ${shinChanTheme.primary}`
};

// 表格样式
const tableStyles = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 8px',
  '& th': {
    padding: '12px 16px',
    textAlign: 'left',
    color: shinChanTheme.primary,
    fontWeight: '600',
    borderBottom: `2px solid ${shinChanTheme.primary}`
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
  backgroundColor: shinChanTheme.secondary,
  borderRadius: '20px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 4px 15px rgba(0, 160, 233, 0.2)',
  border: `2px solid ${shinChanTheme.primary}`
};

// 导航栏样式
const navbarStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: shinChanTheme.primary,
  color: shinChanTheme.secondary,
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
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23FFD93D'/%3E%3C/svg%3E")`,
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
  backgroundColor: shinChanTheme.secondary,
  padding: '30px',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 4px 15px rgba(0, 160, 233, 0.2)',
  zIndex: 1000,
  border: `2px solid ${shinChanTheme.primary}`
};

// 添加新的动画样式
const animations = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .category-icon {
    transition: all 0.3s ease;
  }
  
  .category-icon:hover {
    animation: bounce 0.5s infinite;
  }
  
  .expense-row {
    transition: all 0.3s ease;
  }
  
  .expense-row:hover {
    transform: scale(1.02);
  }
`;

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

  // 添加新状态
  const [currentEmotion, setCurrentEmotion] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementText, setEncouragementText] = useState('');
  const [signInDays, setSignInDays] = useState(0);

  // 添加提示消息组件
  const DoraemonMessage = ({ message }) => (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: shinChanTheme.primary,
      color: shinChanTheme.secondary,
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
          backgroundColor: shinChanTheme.primary,
          borderRadius: '50%',
          border: `2px solid ${shinChanTheme.secondary}`
        }}
      />
      {message}
    </div>
  );

  // 消費類別選項
  const categories = Object.keys(categoryIcons);

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

  // 随机选择表情和文字
  const getRandomEmotion = () => {
    const randomIndex = Math.floor(Math.random() * shinChanEmotions.length);
    setCurrentEmotion(randomIndex);
  };

  // 获取随机鼓励文字
  const getRandomEncouragement = () => {
    const randomIndex = Math.floor(Math.random() * encouragements.length);
    return encouragements[randomIndex];
  };

  // 处理签到
  const handleSignIn = () => {
    const lastSignIn = localStorage.getItem('lastSignIn');
    const today = new Date().toDateString();
    
    if (lastSignIn !== today) {
      const days = parseInt(localStorage.getItem('signInDays') || '0') + 1;
      setSignInDays(days);
      localStorage.setItem('signInDays', days.toString());
      localStorage.setItem('lastSignIn', today);
      
      setEncouragementText(`连续签到${days}天啦！${getRandomEncouragement()}`);
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 3000);
    }
  };

  // 处理添加支出的动画效果
  const handleExpenseAnimation = (amount) => {
    const amountNum = parseFloat(amount);
    let emotion;
    
    if (amountNum > 1000) {
      emotion = 2; // 美伢生气表情
    } else if (amountNum > 500) {
      emotion = 1; // 小新心痛表情
    } else {
      emotion = 0; // 小新开心表情
    }
    
    setCurrentEmotion(emotion);
    setEncouragementText(getRandomEncouragement());
    setShowEncouragement(true);
    setTimeout(() => setShowEncouragement(false), 3000);
  };

  // 修改添加支出函数
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
      handleExpenseAnimation(newExpense.amount);
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
        body: JSON.stringify({
          amount: editingExpense.Amount,
          category: editingExpense.Category,
          description: editingExpense.Description
        }),
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
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <img
          src={shinChanEmotions[currentEmotion].image}
          alt="Shin-chan"
          style={{
            width: '120px',
            height: '120px',
            marginBottom: '10px',
            animation: 'bounce 1s infinite'
          }}
        />
        <div style={{
          color: shinChanTheme.primary,
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {shinChanEmotions[currentEmotion].text}
        </div>
      </div>
      <h2 style={{ 
        textAlign: 'center', 
        color: shinChanTheme.primary,
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
                backgroundColor: shinChanTheme.yellow,
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
        <h1 style={{ margin: 0 }}>蜡笔小新的记账本</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleSignIn}
            style={{
              ...buttonStyles,
              width: 'auto',
              padding: '8px 16px',
              backgroundColor: shinChanTheme.yellow
            }}
          >
            签到打卡
          </button>
          <span>已连续签到 {signInDays} 天</span>
          <button
            onClick={handleLogout}
            style={{
              ...buttonStyles,
              width: 'auto',
              padding: '8px 16px',
              backgroundColor: shinChanTheme.accent
            }}
          >
            退出
          </button>
        </div>
      </nav>

      <div style={formContainerStyles}>
        <h3 style={{ color: shinChanTheme.primary, marginTop: 0 }}>添加新支出</h3>
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
          <div style={{ position: 'relative' }}>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              style={{
                ...inputStyles,
                paddingLeft: '40px'
              }}
            >
              <option value="">选择类别</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {newExpense.category && categoryIcons[newExpense.category] && (
              <img
                src={categoryIcons[newExpense.category].icon}
                alt={newExpense.category}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%'
                }}
                className="category-icon"
              />
            )}
          </div>
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            placeholder="描述"
            style={inputStyles}
          />
          <button type="submit" style={{
            ...buttonStyles,
            backgroundColor: shinChanTheme.primary
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
                <td style={{ color: shinChanTheme.accent }}>¥{parseFloat(expense.Amount).toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {categoryIcons[expense.Category] && (
                      <img
                        src={categoryIcons[expense.Category].icon}
                        alt={expense.Category}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%'
                        }}
                        className="category-icon"
                      />
                    )}
                    {expense.Category}
                  </div>
                </td>
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
                        backgroundColor: shinChanTheme.accent
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
            <h3 style={{ color: shinChanTheme.primary, marginTop: 0 }}>编辑支出记录</h3>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="number"
                value={editingExpense.Amount}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  Amount: e.target.value
                })}
                placeholder="金额"
                style={inputStyles}
              />
            </div>
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <select
                value={editingExpense.Category}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  Category: e.target.value
                })}
                style={{
                  ...inputStyles,
                  paddingLeft: '40px'
                }}
              >
                <option value="">选择类别</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {editingExpense.Category && categoryIcons[editingExpense.Category] && (
                <img
                  src={categoryIcons[editingExpense.Category].icon}
                  alt={editingExpense.Category}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%'
                  }}
                  className="category-icon"
                />
              )}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={editingExpense.Description}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  Description: e.target.value
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
                  backgroundColor: shinChanTheme.accent
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

      {showEncouragement && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: shinChanTheme.primary,
          color: shinChanTheme.secondary,
          padding: '15px 25px',
          borderRadius: '20px',
          boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)',
          animation: 'bounce 0.5s',
          zIndex: 1000
        }}>
          {encouragementText}
        </div>
      )}
    </div>
  );

  // 在组件加载时随机选择表情
  useEffect(() => {
    getRandomEmotion();
  }, []);

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
          ${animations}
          .shin-chan-icon {
            animation: bounce 1s infinite;
          }
          .encouragement {
            animation: bounce 0.5s;
          }
        `}
      </style>
    </div>
  );
}

export default App;