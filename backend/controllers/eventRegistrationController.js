const eventRegistrationService = require('../services/eventRegistrationService');

class EventRegistrationController {
  async registerForEvent(req, res) {
    try {
      const registrationData = {
        guestCount: req.body.guestCount,
        specialRequests: req.body.specialRequests
      };
      
      const registration = await eventRegistrationService.registerForEvent(
        req.user.id,
        req.params.eventId,
        registrationData
      );
      
      res.status(201).json({
        message: "Вы успешно зарегистрированы на мероприятие",
        registration
      });
    } catch (error) {
      console.error('Register for event error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async cancelRegistration(req, res) {
    try {
      await eventRegistrationService.cancelRegistration(req.user.id, req.params.eventId);
      
      res.json({
        message: "Регистрация успешно отменена"
      });
    } catch (error) {
      console.error('Cancel registration error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getMyRegistrations(req, res) {
    try {
      const registrations = await eventRegistrationService.getUserRegistrations(req.user.id);
      res.json(registrations);
    } catch (error) {
      console.error('Get my registrations error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async updateRegistrationStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Статус не указан" });
      }
      
      const registration = await eventRegistrationService.updateRegistrationStatus(req.params.id, status);
      
      res.json({
        message: `Статус регистрации изменен на ${status}`,
        registration
      });
    } catch (error) {
      console.error('Update registration status error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new EventRegistrationController(); 