const sequelize = require('../db');
const { Car, Order, User, Event, TestDrive } = require('../models');

// Получение общей статистики
exports.getStats = async (req, res) => {
  try {
    // Получаем количество автомобилей
    const carsCount = await Car.count();
    
    // Получаем количество заказов
    const ordersCount = await Order.count();
    
    // Получаем количество пользователей
    const usersCount = await User.count();
    
    // Получаем количество событий
    const eventsCount = await Event.count();
    
    // Получаем количество тест-драйвов
    const testDrivesCount = await TestDrive.count();

    res.json({
      success: true,
      data: {
        cars: carsCount,
        orders: ordersCount,
        users: usersCount,
        events: eventsCount,
        testDrives: testDrivesCount
      }
    });
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении статистики',
      error: error.message
    });
  }
}; 