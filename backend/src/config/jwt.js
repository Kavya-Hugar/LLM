const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

module.exports = {
  generateAccessToken(payload) {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  },
  
  generateRefreshToken(payload) {
    return jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
  },
  
  verifyAccessToken(token) {
    return jwt.verify(token, jwtConfig.secret);
  },
  
  verifyRefreshToken(token) {
    return jwt.verify(token, jwtConfig.refreshSecret);
  },
  
  jwtConfig
};
