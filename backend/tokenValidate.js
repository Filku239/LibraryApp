const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const validateToken = (request) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (err) {
        return null;
    }
};

module.exports = validateToken;
