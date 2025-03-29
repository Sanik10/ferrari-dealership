const { User, Order, Car, Sequelize } = require('../models');
const { Op } = Sequelize;

class UserService {
  async getAllUsers(query = {}) {
    const options = {
      attributes: { exclude: ['password'] }
    };
    
    // Фильтрация
    if (query) {
      options.where = {};
      
      // Фильтр по роли
      if (query.role) {
        options.where.role = query.role;
      }
      
      // Фильтр по статусу VIP
      if (query.vipStatus !== undefined) {
        options.where.vipStatus = (query.vipStatus === 'true');
      }
      
      // Фильтр по активности
      if (query.active !== undefined) {
        options.where.active = (query.active === 'true');
      }
      
      // Поиск по имени или email
      if (query.search) {
        options.where[Op.or] = [
          { username: { [Op.iLike]: `%${query.search}%` } },
          { fullName: { [Op.iLike]: `%${query.search}%` } },
          { email: { [Op.iLike]: `%${query.search}%` } }
        ];
      }
    }
    
    return await User.findAll(options);
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) throw new Error('Пользователь не найден');
    return user;
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Пользователь не найден');
    
    // Запрещаем обновление роли, если нет проверки прав на уровне контроллера
    if (data.role && user.role !== data.role) {
      throw new Error('Изменение роли запрещено');
    }
    
    return await user.update(data);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Пользователь не найден');
    await user.destroy();
    return { success: true };
  }
  
  async toggleVipStatus(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Пользователь не найден');
    
    await user.update({ vipStatus: !user.vipStatus });
    return user;
  }
  
  async getUserOrderHistory(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Пользователь не найден');
    
    const orders = await Order.findAll({
      where: { userId: id },
      include: [{ model: Car }],
      order: [['createdAt', 'DESC']]
    });
    
    return orders;
  }
  
  async addCarPreference(userId, preference) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Пользователь не найден');
    
    let preferences = user.carPreferences || [];
    if (!preferences.includes(preference)) {
      preferences.push(preference);
      await user.update({ carPreferences: preferences });
    }
    
    return user;
  }
  
  async removeCarPreference(userId, preference) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Пользователь не найден');
    
    let preferences = user.carPreferences || [];
    preferences = preferences.filter(pref => pref !== preference);
    await user.update({ carPreferences: preferences });
    
    return user;
  }
}

module.exports = new UserService();