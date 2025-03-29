/**
 * Middleware для проверки прав доступа менеджера
 */
module.exports = (req, res, next) => {
  try {
    if (!req.user || (req.user.role !== 'manager' && req.user.role !== 'admin')) {
      return res.status(403).json({ 
        message: 'Доступ запрещен. Требуются права менеджера или администратора' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Manager middleware error:', error);
    res.status(403).json({ message: 'Ошибка доступа', error: error.message });
  }
}; 