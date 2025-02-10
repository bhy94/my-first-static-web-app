// 小新經典音效庫 (Base64編碼內嵌)
const soundEffects = {
  buttonClick: 'data:audio/wav;base64,UklGRl9...', // 實際音效數據
  success: 'data:audio/wav;base64,UklGRkZ...',
  error: 'data:audio/wav;base64,UklGRk9...'
};

// 在組件中使用
function playSound(effect) {
  const audio = new Audio(soundEffects[effect]);
  audio.play().catch(() => {/* 自動播放處理 */});
}

// 在登錄按鈕添加音效
<button onClick={() => playSound('buttonClick')}>
  �� 點我登入動感世界
</button> 