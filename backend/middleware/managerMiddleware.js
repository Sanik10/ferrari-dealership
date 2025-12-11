/**
 * Middleware для проверки, является ли пользователь менеджером или администратором
 */
module.exports = (req, res, next) => {
  // Пользователь должен быть аутентифицирован и иметь роль 'manager' или 'admin'
  if (!req.user) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Доступ запрещен. Требуются права менеджера или администратора' 
    });
  }

  next();
}; 