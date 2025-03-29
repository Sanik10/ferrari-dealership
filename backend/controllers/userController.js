const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const userService = require('../services/userService');

// Создание JWT токена
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Регистрация нового пользователя
exports.register = async (req, res) => {
  try {
    const { username, password, fullName, email, role, phone } = req.body;
    
    // Проверяем, существует ли пользователь с таким именем или email
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Пользователь с таким именем или email уже существует' 
      });
    }
    
    // Проверяем роль: только админ может создать другого админа или менеджера
    const requestingUserRole = req.user?.role;
    
    if ((role === 'admin' || role === 'manager') && requestingUserRole !== 'admin') {
      return res.status(403).json({ 
        message: 'Только администраторы могут создавать администраторов и менеджеров' 
      });
    }
    
    // Создаем пользователя
    const newUser = await User.create({
      username,
      password,
      fullName,
      email,
      role: role || 'user', // Если роль не указана, по умолчанию 'user'
      phone
    });
    
    // Не возвращаем пароль в ответе
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone
    };
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Ошибка при регистрации пользователя', error: error.message });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Находим пользователя
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }
    
    // Проверяем активен ли пользователь
    if (!user.active) {
      return res.status(403).json({ message: 'Аккаунт деактивирован' });
    }
    
    // Проверяем пароль
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }
    
    // Обновляем время последнего входа
    user.lastLogin = new Date();
    await user.save();
    
    // Создаем токен
    const token = generateToken(user);
    
    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка при входе в систему', error: error.message });
  }
};

// Получить профиль текущего пользователя
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получить всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получить пользователя по ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(404).json({ error: error.message });
  }
};

// Обновить пользователя
exports.updateUser = async (req, res) => {
  try {
    // Если обычный пользователь, то он может обновить только свой профиль
    if (req.user.role === 'user' && req.params.id != req.user.id) {
      return res.status(403).json({ error: "Доступ запрещен" });
    }
    
    // Запрещаем обновление роли, если пользователь не админ
    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Только администраторы могут изменять роли пользователей" });
    }
    
    const user = await userService.updateUser(req.params.id, req.body);
    
    res.json({
      message: "Пользователь успешно обновлен",
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error: error.message });
  }
};

// Обновить пароль
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    
    // Проверяем, существует ли пользователь
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Проверяем права: пользователь может обновить только свой пароль
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    // Проверяем текущий пароль
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Текущий пароль неверный' });
    }
    
    // Обновляем пароль
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Ошибка при обновлении пароля', error: error.message });
  }
};

// Создать менеджера (только для администраторов)
exports.createManager = async (req, res) => {
  try {
    // Проверяем, является ли пользователь администратором
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Только администраторы могут создавать менеджеров' });
    }
    
    const { username, password, fullName, email, phone } = req.body;
    
    // Проверяем, существует ли пользователь с таким именем или email
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Пользователь с таким именем или email уже существует' 
      });
    }
    
    // Создаем менеджера
    const newManager = await User.create({
      username,
      password,
      fullName,
      email,
      role: 'manager',
      phone
    });
    
    // Не возвращаем пароль в ответе
    const managerResponse = {
      id: newManager.id,
      username: newManager.username,
      fullName: newManager.fullName,
      email: newManager.email,
      role: newManager.role,
      phone: newManager.phone
    };
    
    res.status(201).json(managerResponse);
  } catch (error) {
    console.error('Create manager error:', error);
    res.status(500).json({ message: 'Ошибка при создании менеджера', error: error.message });
  }
};

// Удалить пользователя
exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "Пользователь успешно удален" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(400).json({ error: error.message });
  }
};

// Обновить VIP статус
exports.toggleVipStatus = async (req, res) => {
  try {
    const user = await userService.toggleVipStatus(req.params.id);
    res.json({
      message: `VIP статус ${user.vipStatus ? 'включен' : 'отключен'}`,
      user
    });
  } catch (error) {
    console.error('Error toggling VIP status:', error);
    res.status(400).json({ error: error.message });
  }
};

// Получить историю заказов пользователя
exports.getUserOrderHistory = async (req, res) => {
  try {
    const orders = await userService.getUserOrderHistory(req.params.id);
    res.json(orders);
  } catch (error) {
    console.error('Error getting user order history:', error);
    res.status(400).json({ error: error.message });
  }
};

// Добавить предпочтение пользователя
exports.addCarPreference = async (req, res) => {
  try {
    const { preference } = req.body;
    
    if (!preference) {
      return res.status(400).json({ error: "Предпочтение не указано" });
    }
    
    const user = await userService.addCarPreference(req.user.id, preference);
    
    res.json({
      message: "Предпочтение успешно добавлено",
      preferences: user.carPreferences
    });
  } catch (error) {
    console.error('Error adding car preference:', error);
    res.status(400).json({ error: error.message });
  }
};

// Удалить предпочтение пользователя
exports.removeCarPreference = async (req, res) => {
  try {
    const { preference } = req.body;
    
    if (!preference) {
      return res.status(400).json({ error: "Предпочтение не указано" });
    }
    
    const user = await userService.removeCarPreference(req.user.id, preference);
    
    res.json({
      message: "Предпочтение успешно удалено",
      preferences: user.carPreferences
    });
  } catch (error) {
    console.error('Error removing car preference:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = exports;