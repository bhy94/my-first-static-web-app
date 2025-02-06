# React with Azure MySQL Database

這是一個使用Azure Static Web Apps和Azure MySQL Database的示例項目。

## 功能特點
- 用戶登錄功能
- 從Azure MySQL數據庫讀取用戶數據
- 在網頁上以表格形式展示用戶信息
- 使用React框架構建的響應式界面

## 技術棧
- Frontend: React
- Backend: Azure Functions
- Database: Azure MySQL
- Hosting: Azure Static Web Apps

## 用戶功能說明
1. 登錄功能
   - 用戶需要使用正確的用戶名和密碼登錄
   - 登錄成功後可以查看用戶列表
   - 可以隨時登出系統

2. 數據展示
   - 登錄後可查看所有用戶信息
   - 數據以表格形式展示

## 本地開發
1. 克隆項目
2. 在api目錄下運行 `npm install`
3. 在根目錄運行 `npm install`
4. 配置數據庫連接信息
5. 運行 `npm start` 啟動開發服務器

## 注意事項
- 確保數據庫連接信息安全
- 在生產環境中使用環境變量存儲敏感信息
- 密碼存儲應該使用加密方式（當前為演示使用明文）
