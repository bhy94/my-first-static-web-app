import React, { useState } from 'react';

export default function RegisterForm({ onSuccess, onCancel }) {
  // 包含邀請碼、用戶名、密碼輸入欄位
  // 與後端 /api/register 對接
  // 包含表單驗證邏輯

  // 新增表單狀態管理
  const [formData, setFormData] = useState({
    inviteCode: '',
    username: '',
    password: ''
  });

  // 新增基礎樣式定義
  const baseStyles = {
    colors: {
      primary: '#0071e3',
      secondary: '#34c759'
    },
    fonts: {
      title: '"SF Pro Display", "Helvetica Neue", sans-serif'
    }
  };

  // 新增表單提交處理
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error(await response.text());
      
      onSuccess(); // 註冊成功回調
    } catch (err) {
      alert('註冊失敗: ' + err.message);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      border: `3px solid ${baseStyles.colors.primary}`,
      borderRadius: '15px'
    }}>
      <h2 style={{ 
        fontFamily: baseStyles.fonts.title,
        color: baseStyles.colors.secondary
      }}>
        �� 新用戶註冊
      </h2>
      
      <input 
        type="text" 
        placeholder="邀請碼 (找卞卞神大人領取)"
        style={{
          width: '100%',
          padding: '10px',
          margin: '10px 0',
          border: `2px dashed ${baseStyles.colors.primary}`
        }}
      />
      
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        placeholder="用戶名 (4-20位英數)"
      />
      
      {/* 其他表單欄位... */}
      
      <button
        style={{
          backgroundColor: baseStyles.colors.secondary,
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        🎈 立即加入動感幼稚園
      </button>

      <button 
        type="button"
        onClick={onCancel}
        style={{
          backgroundColor: baseStyles.colors.secondary,
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        返回登錄
      </button>
    </div>
  );
} 