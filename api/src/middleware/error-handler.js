module.exports = async function (context, req, next) {
    try {
        await next();
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                success: false,
                message: error.message || '服務器內部錯誤'
            }
        };
    }
}; 