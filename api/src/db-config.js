const dbConfig = {
  host: 'bhyyy.mysql.database.azure.com',
  user: 'bhyyy',
  password: 'Bian0904!',
  database: 'accountbook', // 請替換為您的數據庫名稱
  port: 3306,
  ssl: {
    rejectUnauthorized: false  // 如果遇到SSL問題，可以暫時設置為false
  }
};

module.exports = dbConfig; 