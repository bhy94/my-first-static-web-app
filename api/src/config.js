module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '24h'
    },
    database: {
        host: process.env.DB_HOST || 'bhyyy.mysql.database.azure.com',
        user: process.env.DB_USER || 'bhyyy',
        password: process.env.DB_PASSWORD || 'Bian0904!',
        database: process.env.DB_NAME || 'accountbook',
        port: process.env.DB_PORT || 3306,
        ssl: {
            rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
    }
}; 