const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

class AuthController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  async register(req, res) {
    try {
      const userData = {
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullName,
        email: req.body.email,
        role: req.body.role,
        phone: req.body.phone,
        vipStatus: req.body.vipStatus,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        zipCode: req.body.zipCode,
        birthDate: req.body.birthDate,
        preferredContactMethod: req.body.preferredContactMethod,
        carPreferences: req.body.carPreferences,
        notes: req.body.notes
      };
      
      // Проверяем наличие обязательных полей
      if (!userData.username || !userData.password || !userData.fullName || !userData.email) {
        return res.status(400).json({ 
          error: "Все обязательные поля должны быть заполнены (username, password, fullName, email)" 
        });
      }
      
      // Проверяем права: только админ может создать другого админа или менеджера
      if ((userData.role === 'admin' || userData.role === 'manager') && 
          (!req.user || req.user.role !== 'admin')) {
        return res.status(403).json({ 
          error: "Только администраторы могут создавать администраторов и менеджеров"
        });
      }

      const user = await authService.register(userData);
      
      // Генерируем JWT токен для нового пользователя
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
      
      res.status(201).json({
        message: "Пользователь успешно зарегистрирован",
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
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          error: "Имя пользователя и пароль обязательны" 
        });
      }
      
      const { user, token } = await authService.login(username, password);
      
      res.json({
        message: "Вход выполнен успешно",
        user,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: error.message });
    }
  }
  
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          error: "Текущий и новый пароли обязательны" 
        });
      }
      
      await authService.changePassword(userId, currentPassword, newPassword);
      
      res.json({ message: "Пароль успешно изменен" });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();