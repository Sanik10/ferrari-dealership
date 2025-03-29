const contactService = require('../services/contactService');

class ContactController {
  async createContact(req, res) {
    try {
      const contactData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        message: req.body.message,
        interestedInModel: req.body.interestedInModel
      };
      
      // Проверяем наличие обязательных полей
      if (!contactData.fullName || !contactData.email || !contactData.subject || !contactData.message) {
        return res.status(400).json({ 
          error: "Все обязательные поля должны быть заполнены (fullName, email, subject, message)" 
        });
      }
      
      const contact = await contactService.createContact(contactData);
      
      res.status(201).json({
        message: "Сообщение успешно отправлено",
        contact
      });
    } catch (error) {
      console.error('Create contact error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getContactById(req, res) {
    try {
      const contact = await contactService.getContactById(req.params.id);
      res.json(contact);
    } catch (error) {
      console.error('Get contact error:', error);
      res.status(404).json({ error: error.message });
    }
  }
  
  async updateContactStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Статус не указан" });
      }
      
      const contact = await contactService.updateContactStatus(req.params.id, status, req.user.id);
      
      res.json({
        message: `Статус сообщения изменен на ${status}`,
        contact
      });
    } catch (error) {
      console.error('Update contact status error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async respondToContact(req, res) {
    try {
      const { response } = req.body;
      
      if (!response) {
        return res.status(400).json({ error: "Ответ не указан" });
      }
      
      const contact = await contactService.respondToContact(req.params.id, response, req.user.id);
      
      res.json({
        message: "Ответ успешно отправлен",
        contact
      });
    } catch (error) {
      console.error('Respond to contact error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getAllContacts(req, res) {
    try {
      const contacts = await contactService.getAllContacts(req.query);
      res.json(contacts);
    } catch (error) {
      console.error('Get all contacts error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ContactController(); 