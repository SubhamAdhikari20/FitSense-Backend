const jwt = require('jsonwebtoken');
// Load env file
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (userID) => {
    if (!userID) {
        throw new Error('User ID is required to generate a token');
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    if (!process.env.JWT_SIGNUP_EXPIRES_IN) {
        throw new Error('JWT_SIGNUP_EXPIRES_IN is not defined in the environment variables');
    }

    return jwt.sign({ id: parseInt(userID, 10) }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SIGNUP_EXPIRES_IN });
};

module.exports = { generateToken };