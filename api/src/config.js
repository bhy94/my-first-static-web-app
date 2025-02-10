module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '24h'
    },
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        ssl: {
            rejectUnauthorized: process.env.NODE_ENV === 'production',
            ca: process.env.DB_SSL_CA
        },
        connectionLimit: 10,
        queueLimit: 0,
        waitForConnections: true
    }
}; 