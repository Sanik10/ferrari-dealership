const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

router.post('/init-db', async (req, res) => {
  try {
    const { adminUsername, adminPassword, adminEmail, adminFullName, securityKey } = req.body;
    
    if (securityKey !== process.env.SETUP_SECURITY_KEY) {
      return res.status(403).json({ 
        message: 'Неверный ключ безопасности' 
      });
    }
    
    const adminExists = await User.findOne({
      where: { role: 'admin' }
    });
    
    if (adminExists) {
      return res.status(403).json({ 
        message: 'Администратор уже существует' 
      });
    }
    
    if (!adminUsername || !adminPassword || !adminEmail || !adminFullName) {
      return res.status(400).json({ 
        message: 'Все поля обязательны (adminUsername, adminPassword, adminEmail, adminFullName)' 
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    const adminUser = await User.create({
      username: adminUsername,
      password: hashedPassword,
      fullName: adminFullName,
      email: adminEmail,
      role: 'admin',
      active: true
    });
    
    const userResponse = {
      id: adminUser.id,
      username: adminUser.username,
      fullName: adminUser.fullName,
      email: adminUser.email,
      role: adminUser.role
    };
    
    res.status(201).json({
      message: 'Система успешно инициализирована',
      admin: userResponse
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ message: 'Ошибка при инициализации системы', error: error.message });
  }
});

module.exports = router; 