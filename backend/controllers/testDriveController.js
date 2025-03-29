const testDriveService = require('../services/testDriveService');

class TestDriveController {
  async createTestDrive(req, res) {
    try {
      const testDriveData = {
        userId: req.user.id,
        carId: req.body.carId,
        scheduledDate: req.body.scheduledDate,
        duration: req.body.duration,
        notes: req.body.notes,
        preferredRoute: req.body.preferredRoute
      };
      
      // Проверяем наличие обязательных полей
      if (!testDriveData.carId || !testDriveData.scheduledDate) {
        return res.status(400).json({ 
          error: "Все обязательные поля должны быть заполнены (carId, scheduledDate)" 
        });
      }
      
      const testDrive = await testDriveService.createTestDrive(testDriveData);
      
      res.status(201).json({
        message: "Тест-драйв успешно забронирован",
        testDrive
      });
    } catch (error) {
      console.error('Create test drive error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getTestDriveById(req, res) {
    try {
      const testDrive = await testDriveService.getTestDriveById(req.params.id);
      
      // Проверяем права доступа: пользователь может видеть только свои тест-драйвы
      if (req.user.role === 'user' && testDrive.userId != req.user.id) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      res.json(testDrive);
    } catch (error) {
      console.error('Get test drive error:', error);
      res.status(404).json({ error: error.message });
    }
  }
  
  async updateTestDriveStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Статус не указан" });
      }
      
      // Если это менеджер, назначаем его ответственным
      const managerId = req.user.role === 'manager' || req.user.role === 'admin' ? req.user.id : null;
      
      const testDrive = await testDriveService.updateTestDriveStatus(req.params.id, status, managerId);
      
      res.json({
        message: `Статус тест-драйва изменен на ${status}`,
        testDrive
      });
    } catch (error) {
      console.error('Update test drive status error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getMyTestDrives(req, res) {
    try {
      const testDrives = await testDriveService.getUserTestDrives(req.user.id);
      res.json(testDrives);
    } catch (error) {
      console.error('Get my test drives error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getAllTestDrives(req, res) {
    try {
      const testDrives = await testDriveService.getAllTestDrives(req.query);
      res.json(testDrives);
    } catch (error) {
      console.error('Get all test drives error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TestDriveController(); 