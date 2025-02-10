const jwt = require('jsonwebtoken');

module.exports = async function (context, req, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        context.res = {
            status: 401,
            body: { message: "未授權訪問" }
        };
        return;
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        await next();
    } catch (error) {
        context.res = {
            status: 401,
            body: { message: "無效的token" }
        };
    }
}; 