

module.exports = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Доступ запрещен. Требуются права администратора' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(403).json({ message: 'Ошибка доступа', error: error.message });
  }
};