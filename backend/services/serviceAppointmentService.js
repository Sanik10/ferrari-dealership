const { ServiceAppointment, User, Car, Sequelize } = require('../models');
const { Op } = Sequelize;

class ServiceAppointmentService {
  async createAppointment(data) {
    // Проверяем пользователя
    const user = await User.findByPk(data.userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    // Проверяем автомобиль, если он указан
    if (data.carId) {
      const car = await Car.findByPk(data.carId);
      if (!car) {
        throw new Error('Автомобиль не найден');
      }
    }
    
    // Проверяем, нет ли конфликтующих заявок на сервис
    const scheduledDate = new Date(data.scheduledDate);
    const endTime = new Date(scheduledDate);
    endTime.setHours(endTime.getHours() + 3); // Примерно 3 часа на обслуживание
    
    const conflictingAppointments = await ServiceAppointment.findAll({
      where: {
        status: ['scheduled', 'in_progress'],
        scheduledDate: {
          [Op.between]: [
            scheduledDate,
            endTime
          ]
        }
      }
    });
    
    // Если слишком много записей на одно время
    if (conflictingAppointments.length >= 3) { // Предполагаем, что сервис может обслуживать 3 машины одновременно
      throw new Error('Нет свободных мест на выбранное время. Пожалуйста, выберите другое время.');
    }
    
    // Создаем запись на сервис
    return await ServiceAppointment.create({
      userId: data.userId,
      carId: data.carId,
      customerCarInfo: data.customerCarInfo,
      scheduledDate: data.scheduledDate,
      serviceType: data.serviceType,
      description: data.description,
      status: 'scheduled',
      estimatedCost: data.estimatedCost
    });
  }
  
  async getAppointmentById(id) {
    const appointment = await ServiceAppointment.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'username', 'fullName', 'email', 'phone'] },
        { model: Car }
      ]
    });
    
    if (!appointment) {
      throw new Error('Запись на сервис не найдена');
    }
    
    return appointment;
  }
  
  async updateAppointmentStatus(id, status, technicianNotes = null, finalCost = null) {
    const appointment = await ServiceAppointment.findByPk(id);
    if (!appointment) {
      throw new Error('Запись на сервис не найдена');
    }
    
    const updateData = { status };
    
    if (technicianNotes) {
      updateData.technicianNotes = technicianNotes;
    }
    
    if (finalCost) {
      updateData.finalCost = finalCost;
    }
    
    return await appointment.update(updateData);
  }
  
  async getUserAppointments(userId) {
    return await ServiceAppointment.findAll({
      where: { userId },
      include: [{ model: Car }],
      order: [['scheduledDate', 'DESC']]
    });
  }
  
  async getAllAppointments(filter = {}) {
    const options = {
      include: [
        { model: User, attributes: ['id', 'username', 'fullName', 'email', 'phone'] },
        { model: Car }
      ],
      order: [['scheduledDate', 'DESC']]
    };
    
    if (filter) {
      options.where = {};
      
      if (filter.status) {
        options.where.status = filter.status;
      }
      
      if (filter.serviceType) {
        options.where.serviceType = filter.serviceType;
      }
      
      if (filter.date) {
        const date = new Date(filter.date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        options.where.scheduledDate = {
          [Op.between]: [date, nextDay]
        };
      }
    }
    
    return await ServiceAppointment.findAll(options);
  }
  
  async updatePartsReplaced(id, partsReplaced) {
    const appointment = await ServiceAppointment.findByPk(id);
    if (!appointment) {
      throw new Error('Запись на сервис не найдена');
    }
    
    return await appointment.update({ partsReplaced });
  }
}

module.exports = new ServiceAppointmentService(); 