const { Order, Car, User, Sequelize } = require('../models');
const { Op } = Sequelize;

class OrderService {
  async createOrder(userId, orderData) {
    const car = await Car.findByPk(orderData.carId);
    if (!car) {
      throw new Error('Автомобиль не найден');
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    // Проверяем доступность в зависимости от типа заказа
    if (orderData.orderType === 'purchase') {
      // Для покупки автомобиль должен быть доступен
      if (!car.available) {
        throw new Error('Автомобиль недоступен для покупки');
      }
      // Обновляем статус автомобиля на недоступен
      await car.update({ available: false });
    } else if (orderData.orderType === 'rental') {
      // Для аренды автомобиль должен быть доступен для аренды
      if (!car.rentalAvailable || !car.available) {
        throw new Error('Автомобиль недоступен для аренды');
      }
      
      // Проверяем, что указаны даты аренды
      if (!orderData.rentalStartDate || !orderData.rentalEndDate) {
        throw new Error('Необходимо указать даты начала и окончания аренды');
      }
      
      // Проверяем, что автомобиль не забронирован на эти даты
      const conflictingOrders = await Order.findAll({
        where: {
          carId: car.id,
          status: { [Op.in]: ['pending', 'confirmed'] },
          orderType: 'rental',
          [Op.or]: [
            {
              rentalStartDate: {
                [Op.between]: [orderData.rentalStartDate, orderData.rentalEndDate]
              }
            },
            {
              rentalEndDate: {
                [Op.between]: [orderData.rentalStartDate, orderData.rentalEndDate]
              }
            }
          ]
        }
      });
      
      if (conflictingOrders.length > 0) {
        throw new Error('Автомобиль уже забронирован на выбранные даты');
      }
    } else if (orderData.orderType === 'reservation') {
      // Для бронирования проверяем, что автомобиль не забронирован на эту дату
      if (!orderData.reservationDate) {
        throw new Error('Необходимо указать дату бронирования');
      }
      
      const conflictingReservations = await Order.findAll({
        where: {
          carId: car.id,
          status: { [Op.in]: ['pending', 'confirmed'] },
          orderType: 'reservation',
          reservationDate: orderData.reservationDate
        }
      });
      
      if (conflictingReservations.length > 0) {
        throw new Error('Автомобиль уже забронирован на выбранную дату');
      }
    }
    
    // Создаем заказ
    return await Order.create({
      userId,
      carId: orderData.carId,
      orderType: orderData.orderType,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      deliveryDate: orderData.deliveryDate,
      rentalStartDate: orderData.rentalStartDate,
      rentalEndDate: orderData.rentalEndDate,
      reservationDate: orderData.reservationDate,
      includeDelivery: orderData.includeDelivery,
      deliveryAddress: orderData.deliveryAddress,
      insuranceIncluded: orderData.insuranceIncluded,
      additionalServices: orderData.additionalServices,
      specialRequests: orderData.specialRequests,
      contractNumber: orderData.contractNumber || null
    });
  }

  async updateOrderStatus(orderId, newStatus) {
    const order = await Order.findByPk(orderId, {
      include: [Car]
    });
    
    if (!order) {
      throw new Error('Заказ не найден');
    }

    if (newStatus === 'cancelled') {
      // Если заказ отменен, освобождаем автомобиль
      if (order.orderType === 'purchase' && order.Car) {
        await order.Car.update({ available: true });
      }
    } else if (newStatus === 'completed') {
      // Если это аренда или бронирование и заказ завершен, освобождаем автомобиль
      if (order.orderType !== 'purchase' && order.Car) {
        await order.Car.update({ available: true });
      }
    }

    return await order.update({ status: newStatus });
  }

  async getOrdersByUserId(userId) {
    return await Order.findAll({
      where: { userId },
      include: [
        { model: Car },
        { model: User, attributes: ['id', 'username', 'fullName', 'email', 'vipStatus'] }
      ],
      order: [['createdAt', 'DESC']]
    });
  }
  
  async getAllOrders(query = {}) {
    const options = {
      include: [
        { model: Car },
        { model: User, attributes: ['id', 'username', 'fullName', 'email', 'vipStatus'] }
      ],
      order: [['createdAt', 'DESC']]
    };
    
    // Добавляем фильтры
    if (query) {
      options.where = {};
      
      if (query.status) {
        options.where.status = query.status;
      }
      
      if (query.orderType) {
        options.where.orderType = query.orderType;
      }
      
      // Фильтр по диапазону дат
      if (query.startDate || query.endDate) {
        options.where.createdAt = {};
        if (query.startDate) {
          options.where.createdAt[Op.gte] = new Date(query.startDate);
        }
        if (query.endDate) {
          options.where.createdAt[Op.lte] = new Date(query.endDate);
        }
      }
    }
    
    return await Order.findAll(options);
  }
  
  async getOrderById(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        { model: Car },
        { model: User, attributes: ['id', 'username', 'fullName', 'email', 'vipStatus', 'phone'] }
      ]
    });
    
    if (!order) {
      throw new Error('Заказ не найден');
    }
    
    return order;
  }
}

module.exports = new OrderService();