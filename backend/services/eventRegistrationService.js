const { EventRegistration, Event, User } = require('../models');

class EventRegistrationService {
  async registerForEvent(userId, eventId, data = {}) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error('Мероприятие не найдено');
    }
    
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      throw new Error('Регистрация на мероприятие завершена');
    }
    
    if (event.status === 'completed' || event.status === 'cancelled') {
      throw new Error('Регистрация невозможна: мероприятие завершено или отменено');
    }
    
    const registeredCount = await EventRegistration.count({
      where: { 
        eventId,
        status: ['registered', 'attended']
      }
    });
    
    const guestCount = data.guestCount || 0;
    
    if (registeredCount + guestCount + 1 > event.capacity) {
      throw new Error('Нет свободных мест на мероприятие');
    }
    
    if (event.vipOnly && !user.vipStatus) {
      throw new Error('Это мероприятие только для VIP-клиентов');
    }
    
    const existingRegistration = await EventRegistration.findOne({
      where: { userId, eventId }
    });
    
    if (existingRegistration) {
      throw new Error('Вы уже зарегистрированы на это мероприятие');
    }
    
    const registration = await EventRegistration.create({
      userId,
      eventId,
      guestCount: data.guestCount || 0,
      specialRequests: data.specialRequests,
      status: 'registered'
    });
    
    await event.update({
      registeredCount: registeredCount + 1 + guestCount
    });
    
    return registration;
  }
  
  async cancelRegistration(userId, eventId) {
    const registration = await EventRegistration.findOne({
      where: { userId, eventId }
    });
    
    if (!registration) {
      throw new Error('Регистрация не найдена');
    }
    
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error('Мероприятие не найдено');
    }
    
    const newCount = Math.max(0, event.registeredCount - (registration.guestCount + 1));
    await event.update({
      registeredCount: newCount
    });
    
    await registration.update({ status: 'cancelled' });
    
    return { success: true };
  }
  
  async getUserRegistrations(userId) {
    return await EventRegistration.findAll({
      where: { userId },
      include: [{ model: Event }],
      order: [[{ model: Event }, 'eventDate', 'ASC']]
    });
  }
  
  async updateRegistrationStatus(id, status) {
    const registration = await EventRegistration.findByPk(id);
    if (!registration) {
      throw new Error('Регистрация не найдена');
    }
    
    return await registration.update({ status });
  }
}

module.exports = new EventRegistrationService(); 