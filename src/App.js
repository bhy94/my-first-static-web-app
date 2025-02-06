import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
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
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('登錄過程中發生錯誤');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUsers = async () => {
        try {
          const response = await fetch('/api/message');
          if (!response.ok) {
            throw new Error('網絡請求失敗');
          }
          const data = await response.json();
          setUsers(data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchUsers();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '300px', margin: '50px auto', padding: '20px' }}>
        <h2>用戶登錄</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>用戶名：</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>密碼：</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            登錄
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <h1>用戶列表</h1>
        <div>
          歡迎, {currentUser.UserName}！
          <button 
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentUser(null);
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
      {error ? (
        <div>錯誤: {error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {users[0] && Object.keys(users[0]).map(key => (
                <th key={key} style={{ border: '1px solid #ddd', padding: '8px' }}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                {Object.values(user).map((value, i) => (
                  <td key={i} style={{ border: '1px solid #ddd', padding: '8px' }}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;