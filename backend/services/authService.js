const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  async register(userData) {
    const { username, password, fullName, email, role, phone } = userData;

    const existingUser = await User.findOne({
      where: { 
        username: username 
      }
    });

    const existingEmail = await User.findOne({
      where: { 
        email: email 
      }
    });

    if (existingUser) {
      throw new Error('Имя пользователя уже занято');
    }

    if (existingEmail) {
      throw new Error('Email уже используется');
    }

    const user = await User.create({
      username,
      password,
      fullName,
      email,
      role: role || 'user',
      phone,
      vipStatus: userData.vipStatus || false,
      address: userData.address,
      city: userData.city,
      country: userData.country,
      zipCode: userData.zipCode,
      birthDate: userData.birthDate,
      preferredContactMethod: userData.preferredContactMethod || 'email',
      carPreferences: userData.carPreferences,
      notes: userData.notes
    });

    await user.update({ lastLogin: new Date() });

    return user;
  }

  async login(username, password) {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error('Пользователь не найден');
    
    if (!user.active) {
      throw new Error('Аккаунт деактивирован');
    }
    
    const isValid = await user.comparePassword(password);
    if (!isValid) throw new Error('Неверный пароль');
    
    await user.update({ lastLogin: new Date() });
    
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        username: user.username,
        vipStatus: user.vipStatus
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    return { 
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        vipStatus: user.vipStatus,
        phone: user.phone
      }, 
      token 
    };
  }
  
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Пользователь не найден');
    
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) throw new Error('Текущий пароль неверен');
    
    await user.update({ password: newPassword });
    return { success: true };
  }
}

module.exports = new AuthService();