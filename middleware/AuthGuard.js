const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            success: false,
            message: 'User not authorized!',
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === '') {
        return res.json({
            success: false,
            message: 'No token in header!',
        });
    }

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.user = decodedUser;
        next();
    } 
    
    catch (error) {
        return res.json({
            success: false,
            message: 'Not authenticated'
        });
    }

};

module.exports = authGuard;