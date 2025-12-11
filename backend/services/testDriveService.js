const { TestDrive, User, Car } = require('../models');
const { Op } = require('sequelize');

class TestDriveService {
  async createTestDrive(data) {
    // Проверяем, существует ли пользователь
    const user = await User.findByPk(data.userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    // Проверяем, существует ли автомобиль и доступен ли он для тест-драйва
    const car = await Car.findByPk(data.carId);
    if (!car) {
      throw new Error('Автомобиль не найден');
    }
    
    if (!car.testDriveAvailable) {
      throw new Error('Автомобиль недоступен для тест-драйва');
    }
    
    // Проверяем, нет ли конфликтующих тест-драйвов
    const scheduledDate = new Date(data.scheduledDate);
    const endTime = new Date(scheduledDate);
    endTime.setMinutes(endTime.getMinutes() + (data.duration || 60));
    
    const conflictingTestDrives = await TestDrive.findAll({
      where: {
        carId: data.carId,
        status: ['pending', 'confirmed'],
        scheduledDate: {
          [Op.between]: [
            new Date(scheduledDate.getTime() - 60 * 60 * 1000), // за 1 час до
            new Date(endTime.getTime() + 60 * 60 * 1000) // через 1 час после
          ]
        }
      }
    });
    
    if (conflictingTestDrives.length > 0) {
      throw new Error('Этот автомобиль уже забронирован на выбранное время');
    }
    
    // Создаем тест-драйв
    return await TestDrive.create({
      userId: data.userId,
      carId: data.carId,
      scheduledDate: data.scheduledDate,
      duration: data.duration || 60,
      status: 'pending',
      notes: data.notes,
      preferredRoute: data.preferredRoute,
      assignedManager: data.assignedManager
    });
  }
  
  async getTestDriveById(id) {
    const testDrive = await TestDrive.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'username', 'fullName', 'email', 'phone'] },
        { model: Car }
      ]
    });
    
    if (!testDrive) {
      throw new Error('Тест-драйв не найден');
    }
    
    return testDrive;
  }
  
  async updateTestDriveStatus(id, status, managerId = null) {
    const testDrive = await TestDrive.findByPk(id);
    if (!testDrive) {
      throw new Error('Тест-драйв не найден');
    }
    
    const updateData = { status };
    if (managerId) {
      updateData.assignedManager = managerId;
    }
    
    return await testDrive.update(updateData);
  }
  
  async getUserTestDrives(userId) {
    return await TestDrive.findAll({
      where: { userId },
      include: [{ model: Car }],
      order: [['scheduledDate', 'DESC']]
    });
  }
  
  async getAllTestDrives(filter = {}) {
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
      
      if (filter.date) {
        const date = new Date(filter.date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        options.where.scheduledDate = {
          [Op.between]: [date, nextDay]
        };
      }
    }
    
    return await TestDrive.findAll(options);
  }
  
  async getAvailableTimes(date, carId) {
    // All possible time slots (10:00 to 18:00 with 1-hour intervals)
    const allTimeSlots = [
      '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];
    
    // Parse the date
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
    
    // Get all test drives for this car on the selected date
    const existingTestDrives = await TestDrive.findAll({
      where: {
        carId,
        status: ['pending', 'confirmed'], // Only consider pending or confirmed test drives
        scheduledDate: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      attributes: ['scheduledDate', 'duration']
    });
    
    // Create a set of unavailable time slots
    const unavailableTimeSlots = new Set();
    
    // Mark time slots as unavailable if they conflict with existing test drives
    existingTestDrives.forEach(testDrive => {
      const testDriveHour = new Date(testDrive.scheduledDate).getHours();
      const duration = testDrive.duration || 60; // Default to 60 minutes if not specified
      
      // Mark the slot of the test drive as unavailable
      unavailableTimeSlots.add(`${testDriveHour}:00`);
      
      // Also mark the next slot as unavailable if the test drive extends into it
      if (duration > 60) {
        unavailableTimeSlots.add(`${testDriveHour + 1}:00`);
      }
    });
    
    // Check if the date is today
    const today = new Date();
    const isToday = today.toDateString() === selectedDate.toDateString();
    
    let availableTimeSlots = allTimeSlots.filter(timeSlot => {
      const [hours] = timeSlot.split(':').map(Number);
      
      // If the date is today, only show future time slots
      if (isToday && hours <= today.getHours()) {
        return false;
      }
      
      // Filter out unavailable time slots
      return !unavailableTimeSlots.has(`${hours}:00`);
    });
    
    return availableTimeSlots;
  }
}

module.exports = new TestDriveService(); 