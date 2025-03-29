const { User } = require('../models');

/**
 * Middleware для проверки VIP-доступа
 * Разрешает доступ только для VIP-клиентов, менеджеров и администраторов
 */
module.exports = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    if (req.user.role === 'manager' || req.user.role === 'admin') {
      return next();
    }

    const user = await User.findByPk(req.user.id);
    
    if (!user || !user.vipStatus) {
      return res.status(403).json({ 
        message: 'Доступ запрещен. Требуется VIP-статус' 
      });
    }
    
    next();
  } catch (error) {
    console.error('VIP access middleware error:', error);
    res.status(500).json({ message: 'Ошибка при проверке доступа', error: error.message });
  }
}; 