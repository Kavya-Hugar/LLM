const { query } = require('../../config/database');
const bcrypt = require('bcryptjs');

const userController = {
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      
      const userQuery = `
        SELECT id, email, name, created_at, updated_at 
        FROM users 
        WHERE id = ?
      `;
      const users = await query(userQuery, [userId]);
      
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: users[0]
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { name, email } = req.body;

      const updateFields = [];
      const updateValues = [];

      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }

      if (email) {
        const existingUserQuery = 'SELECT id FROM users WHERE email = ? AND id != ?';
        const existingUsers = await query(existingUserQuery, [email, userId]);
        
        if (existingUsers.length > 0) {
          return res.status(409).json({ error: 'Email already in use' });
        }

        updateFields.push('email = ?');
        updateValues.push(email);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateFields.push('updated_at = NOW()');
      updateValues.push(userId);

      const updateQuery = `
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `;
      await query(updateQuery, updateValues);

      const userQuery = `
        SELECT id, email, name, created_at, updated_at 
        FROM users 
        WHERE id = ?
      `;
      const users = await query(userQuery, [userId]);

      res.json({
        message: 'Profile updated successfully',
        user: users[0]
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          error: 'Current password and new password are required' 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          error: 'New password must be at least 6 characters long' 
        });
      }

      const userQuery = 'SELECT password_hash FROM users WHERE id = ?';
      const users = await query(userQuery, [userId]);
      
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      
      await query(
        'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
        [newPasswordHash, userId]
      );

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  },

  async deleteAccount(req, res, next) {
    try {
      const userId = req.user.id;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ 
          error: 'Password is required to delete account' 
        });
      }

      const userQuery = 'SELECT password_hash FROM users WHERE id = ?';
      const users = await query(userQuery, [userId]);
      
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(password, users[0].password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Password is incorrect' });
      }

      await query('DELETE FROM users WHERE id = ?', [userId]);

      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
