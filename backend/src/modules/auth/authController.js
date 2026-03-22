const bcrypt = require('bcryptjs');
const { query } = require('../../config/database');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../config/jwt');
const { hashToken } = require('../../utils/helpers');

const authController = {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      const existingUserQuery = 'SELECT id FROM users WHERE email = ?';
      const existingUsers = await query(existingUserQuery, [email]);
      
      if (existingUsers.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      
      const insertUserQuery = `
        INSERT INTO users (email, password_hash, name) 
        VALUES (?, ?, ?)
      `;
      const result = await query(insertUserQuery, [email, passwordHash, name]);

      const userQuery = 'SELECT id, email, name, created_at FROM users WHERE id = ?';
      const users = await query(userQuery, [result.insertId]);
      const user = users[0];

      const payload = { userId: user.id, email: user.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      const refreshTokenHash = hashToken(refreshToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const insertTokenQuery = `
        INSERT INTO refresh_tokens (user_id, token_hash, expires_at) 
        VALUES (?, ?, ?)
      `;
      await query(insertTokenQuery, [user.id, refreshTokenHash, expiresAt]);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          created_at: user.created_at
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const userQuery = 'SELECT id, email, name, password_hash FROM users WHERE email = ?';
      const users = await query(userQuery, [email]);
      
      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const payload = { userId: user.id, email: user.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      const refreshTokenHash = hashToken(refreshToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const insertTokenQuery = `
        INSERT INTO refresh_tokens (user_id, token_hash, expires_at) 
        VALUES (?, ?, ?)
      `;
      await query(insertTokenQuery, [user.id, refreshTokenHash, expiresAt]);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }

      const decoded = verifyRefreshToken(refreshToken);
      const refreshTokenHash = hashToken(refreshToken);

      const tokenQuery = `
        SELECT rt.user_id, rt.expires_at, rt.revoked_at
        FROM refresh_tokens rt
        WHERE rt.token_hash = ? AND rt.user_id = ?
      `;
      const tokens = await query(tokenQuery, [refreshTokenHash, decoded.userId]);

      if (tokens.length === 0) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const token = tokens[0];
      
      if (token.revoked_at) {
        return res.status(401).json({ error: 'Refresh token revoked' });
      }

      if (new Date(token.expires_at) < new Date()) {
        return res.status(401).json({ error: 'Refresh token expired' });
      }

      const userQuery = 'SELECT id, email, name FROM users WHERE id = ?';
      const users = await query(userQuery, [decoded.userId]);
      
      if (users.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      const user = users[0];
      const payload = { userId: user.id, email: user.email };
      const newAccessToken = generateAccessToken(payload);

      await query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?',
        [refreshTokenHash]
      );

      const newRefreshToken = generateRefreshToken(payload);
      const newRefreshTokenHash = hashToken(newRefreshToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      await query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
        [user.id, newRefreshTokenHash, expiresAt]
      );

      res.json({
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        const refreshTokenHash = hashToken(refreshToken);
        await query(
          'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?',
          [refreshTokenHash]
        );
      }

      res.json({ message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
