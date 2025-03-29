const { Event, EventRegistration, User, Sequelize } = require('../models');
const { Op } = Sequelize;

class EventService {
  async createEvent(eventData) {
    return await Event.create({
      name: eventData.name,
      description: eventData.description,
      eventDate: eventData.eventDate,
      location: eventData.location,
      capacity: eventData.capacity,
      eventType: eventData.eventType,
      image: eventData.image,
      vipOnly: eventData.vipOnly || false,
      registrationDeadline: eventData.registrationDeadline,
      status: 'upcoming'
    });
  }
  
  async getEventById(id) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error('Мероприятие не найдено');
    }
    return event;
  }
  
  async updateEvent(id, eventData) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error('Мероприятие не найдено');
    }
    
    return await event.update(eventData);
  }
  
  async deleteEvent(id) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error('Мероприятие не найдено');
    }
    
    // Проверяем, есть ли уже зарегистрированные пользователи
    const registrations = await EventRegistration.count({
      where: { eventId: id }
    });
    
    if (registrations > 0) {
      throw new Error('Невозможно удалить мероприятие с зарегистрированными участниками');
    }
    
    await event.destroy();
    return { success: true };
  }
  
  async getAllEvents(filter = {}) {
    const options = {
      order: [['eventDate', 'ASC']]
    };
    
    if (filter) {
      options.where = {};
      
      if (filter.status) {
        options.where.status = filter.status;
      }
      
      if (filter.vipOnly !== undefined) {
        options.where.vipOnly = (filter.vipOnly === 'true');
      }
      
      if (filter.eventType) {
        options.where.eventType = filter.eventType;
      }
      
      if (filter.upcoming === 'true') {
        options.where.eventDate = {
          [Op.gte]: new Date()
        };
      }
    }
    
    return await Event.findAll(options);
  }
  
  async updateEventStatus(id, status) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error('Мероприятие не найдено');
    }
    
    return await event.update({ status });
  }
  
  async getEventRegistrations(eventId) {
    return await EventRegistration.findAll({
      where: { eventId },
      include: [
        { 
          model: User, 
          attributes: ['id', 'username', 'fullName', 'email', 'phone', 'vipStatus'] 
        }
      ]
    });
  }
}

module.exports = new EventService(); 