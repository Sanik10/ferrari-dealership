const eventService = require('../services/eventService');
const { eventUploader } = require('../middleware/uploadMiddleware');

class EventController {
  async createEvent(req, res) {
    try {
      const eventData = {
        name: req.body.name,
        description: req.body.description,
        eventDate: req.body.eventDate,
        location: req.body.location,
        capacity: req.body.capacity,
        eventType: req.body.eventType,
        image: req.body.image,
        vipOnly: req.body.vipOnly === 'true' || req.body.vipOnly === true,
        registrationDeadline: req.body.registrationDeadline
      };
      
      // Проверяем наличие обязательных полей
      if (!eventData.name || !eventData.description || !eventData.eventDate || 
          !eventData.location || !eventData.capacity || !eventData.eventType) {
        return res.status(400).json({ 
          error: "Все обязательные поля должны быть заполнены (name, description, eventDate, location, capacity, eventType)" 
        });
      }
      
      const event = await eventService.createEvent(eventData);
      
      res.status(201).json({
        message: "Мероприятие успешно создано",
        event
      });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getEventById(req, res) {
    try {
      const event = await eventService.getEventById(req.params.id);
      res.json(event);
    } catch (error) {
      console.error('Get event error:', error);
      res.status(404).json({ error: error.message });
    }
  }
  
  async updateEvent(req, res) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);
      
      res.json({
        message: "Мероприятие успешно обновлено",
        event
      });
    } catch (error) {
      console.error('Update event error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async deleteEvent(req, res) {
    try {
      await eventService.deleteEvent(req.params.id);
      
      res.json({
        message: "Мероприятие успешно удалено"
      });
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async updateEventStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Статус не указан" });
      }
      
      const event = await eventService.updateEventStatus(req.params.id, status);
      
      res.json({
        message: `Статус мероприятия изменен на ${status}`,
        event
      });
    } catch (error) {
      console.error('Update event status error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getAllEvents(req, res) {
    try {
      const events = await eventService.getAllEvents(req.query);
      res.json(events);
    } catch (error) {
      console.error('Get all events error:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async getEventRegistrations(req, res) {
    try {
      const registrations = await eventService.getEventRegistrations(req.params.id);
      res.json(registrations);
    } catch (error) {
      console.error('Get event registrations error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async uploadEventImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Файл не загружен" });
      }
      
      const eventId = req.params.id;
      const imagePath = `/uploads/events/${req.file.filename}`;
      
      // Обновляем информацию о мероприятии с новым изображением
      const event = await eventService.updateEvent(eventId, { image: imagePath });
      
      res.json({
        message: "Изображение успешно загружено",
        event
      });
    } catch (error) {
      console.error('Error uploading event image:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new EventController(); 