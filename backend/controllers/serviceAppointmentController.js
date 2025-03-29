const serviceAppointmentService = require('../services/serviceAppointmentService');

class ServiceAppointmentController {
  async createAppointment(req, res) {
    try {
      const appointmentData = {
        userId: req.user.id,
        carId: req.body.carId,
        customerCarInfo: req.body.customerCarInfo,
        scheduledDate: req.body.scheduledDate,
        serviceType: req.body.serviceType,
        description: req.body.description,
        estimatedCost: req.body.estimatedCost
      };
      
      // Проверяем наличие обязательных полей
      if (!appointmentData.scheduledDate || !appointmentData.serviceType) {
        return res.status(400).json({ 
          error: "Все обязательные поля должны быть заполнены (scheduledDate, serviceType)" 
        });
      }
      
      // Если не указан carId, должна быть информация о машине клиента
      if (!appointmentData.carId && !appointmentData.customerCarInfo) {
        return res.status(400).json({ 
          error: "Необходимо указать либо carId, либо customerCarInfo" 
        });
      }
      
      const appointment = await serviceAppointmentService.createAppointment(appointmentData);
      
      res.status(201).json({
        message: "Запись на сервис успешно создана",
        appointment
      });
    } catch (error) {
      console.error('Create service appointment error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getAppointmentById(req, res) {
    try {
      const appointment = await serviceAppointmentService.getAppointmentById(req.params.id);
      
      // Проверяем права доступа: пользователь может видеть только свои записи
      if (req.user.role === 'user' && appointment.userId != req.user.id) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      res.json(appointment);
    } catch (error) {
      console.error('Get service appointment error:', error);
      res.status(404).json({ error: error.message });
    }
  }
  
  async updateAppointmentStatus(req, res) {
    try {
      const { status, technicianNotes, finalCost } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Статус не указан" });
      }
      
      const appointment = await serviceAppointmentService.updateAppointmentStatus(
        req.params.id, 
        status, 
        technicianNotes, 
        finalCost
      );
      
      res.json({
        message: `Статус записи на сервис изменен на ${status}`,
        appointment
      });
    } catch (error) {
      console.error('Update service appointment status error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async updatePartsReplaced(req, res) {
    try {
      const { partsReplaced } = req.body;
      
      if (!partsReplaced || !Array.isArray(partsReplaced)) {
        return res.status(400).json({ error: "Список замененных деталей не указан или имеет неверный формат" });
      }
      
      const appointment = await serviceAppointmentService.updatePartsReplaced(req.params.id, partsReplaced);
      
      res.json({
        message: "Список замененных деталей обновлен",
        appointment
      });
    } catch (error) {
      console.error('Update parts replaced error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getMyAppointments(req, res) {
    try {
      const appointments = await serviceAppointmentService.getUserAppointments(req.user.id);
      res.json(appointments);
    } catch (error) {
      console.error('Get my service appointments error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getAllAppointments(req, res) {
    try {
      const appointments = await serviceAppointmentService.getAllAppointments(req.query);
      res.json(appointments);
    } catch (error) {
      console.error('Get all service appointments error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ServiceAppointmentController(); 