const { Contact, User } = require('../models');

class ContactService {
  async createContact(data) {
    return await Contact.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      interestedInModel: data.interestedInModel,
      status: 'new'
    });
  }
  
  async getContactById(id) {
    const contact = await Contact.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'assignedToUser', 
          attributes: ['id', 'username', 'fullName'] 
        }
      ]
    });
    
    if (!contact) {
      throw new Error('Сообщение не найдено');
    }
    
    return contact;
  }
  
  async updateContactStatus(id, status, assignedTo = null) {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      throw new Error('Сообщение не найдено');
    }
    
    const updateData = { status };
    
    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }
    
    if (status === 'responded') {
      updateData.responseDate = new Date();
    }
    
    return await contact.update(updateData);
  }
  
  async respondToContact(id, response, managerId) {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      throw new Error('Сообщение не найдено');
    }
    
    return await contact.update({
      response,
      assignedTo: managerId,
      responseDate: new Date(),
      status: 'responded'
    });
  }
  
  async getAllContacts(filter = {}) {
    const options = {
      include: [
        { 
          model: User, 
          as: 'assignedToUser', 
          attributes: ['id', 'username', 'fullName'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    };
    
    if (filter) {
      options.where = {};
      
      if (filter.status) {
        options.where.status = filter.status;
      }
      
      if (filter.subject) {
        options.where.subject = filter.subject;
      }
    }
    
    return await Contact.findAll(options);
  }
}

module.exports = new ContactService(); 