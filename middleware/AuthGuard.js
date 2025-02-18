const jwt = require("jsonwebtoken");
const { createError } = require("./../error");
const dotenv = require("dotenv");
dotenv.config();

const authGuard = async (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'User not authorized!',
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token || token === '') {
            return res.status(401).json({
                success: false,
                message: 'No token in header!',
            });
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedUser;

        return next();
    }

    catch (error) {
        next();
    }

};

module.exports = { authGuard };
