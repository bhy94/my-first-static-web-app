import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch('/api/message');
        const result = await response.json();
        setData(result.text);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData('Error loading message');
      }
    })();
  }, []); // 添加空數組作為依賴，確保 useEffect 只運行一次

  return <div>{data}</div>;
}

export default App;