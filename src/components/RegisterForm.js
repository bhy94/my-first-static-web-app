export default function RegisterForm({ onSuccess }) {
  // 包含邀請碼、用戶名、密碼輸入欄位
  // 與後端 /api/register 對接
  // 包含表單驗證邏輯
  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      border: `3px solid ${crayonStyles.colors.primary}`,
      borderRadius: '15px'
    }}>
      <h2 style={{ 
        fontFamily: crayonStyles.fonts.title,
        color: crayonStyles.colors.secondary
      }}>
        🎉 新用戶註冊
      </h2>
      
      <input 
        type="text" 
        placeholder="邀請碼 (找卞卞神大人領取)"
        style={{
          width: '100%',
          padding: '10px',
          margin: '10px 0',
          border: `2px dashed ${crayonStyles.colors.primary}`
        }}
      />
      
      {/* 其他表單欄位... */}
      
      <button
        style={{
          backgroundColor: crayonStyles.colors.secondary,
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        🎈 立即加入動感幼稚園
      </button>
    </div>
  );
} 