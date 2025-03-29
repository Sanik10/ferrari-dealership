const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');
const { carUploader, handleUploadError, getImageUrl, logRequest } = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');

// Проверяем, что директория для загрузки существует
const uploadDir = path.join(__dirname, '../uploads/cars');
if (!fs.existsSync(uploadDir)) {
  console.log('Создание директории для загрузки автомобилей:', uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Отладочный middleware для логирования запросов на добавление/изменение авто
const debugCarRequests = (req, res, next) => {
  console.log('=== Отладка запроса на создание/изменение автомобиля ===');
  console.log(`Метод: ${req.method}, URL: ${req.originalUrl}`);
  console.log(`Заголовки: ${JSON.stringify({
    'content-type': req.headers['content-type'],
    'authorization': req.headers['authorization'] ? 'Bearer ***' : 'Отсутствует'
  })}`);
  
  console.log('Тело запроса:', Object.keys(req.body).reduce((acc, key) => {
    // Не выводим большие поля целиком
    if (['description', 'history'].includes(key)) {
      acc[key] = req.body[key] ? '(текст присутствует)' : '(пусто)';
    } else {
      acc[key] = req.body[key];
    }
    return acc;
  }, {}));
  
  if (req.files) {
    console.log(`Файлы (${req.files.length}):`, 
      req.files.map(f => `${f.fieldname}: ${f.originalname} (${f.mimetype}, ${f.size} bytes)`));
  } else {
    console.log('Файлы: отсутствуют');
  }
  
  next();
};

// Маршруты для автомобилей
router.get('/search', carController.searchCars);
router.get('/rental-available', carController.getAvailableForRental);
router.get('/test-drive-available', carController.getAvailableForTestDrive);
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);

// Маршруты требующие авторизации
router.post('/', [
  authMiddleware, 
  managerMiddleware,
  logRequest,
  debugCarRequests, 
  carUploader.array('images', 10),
  handleUploadError
], carController.createCar);

router.put('/:id', [
  authMiddleware, 
  managerMiddleware,
  logRequest,
  debugCarRequests,
  carUploader.array('images', 10),
  (req, res, next) => {
    console.log('=== ПРОМЕЖУТОЧНАЯ ПРОВЕРКА ПЕРЕД КОНТРОЛЛЕРОМ ===');
    console.log(`ID автомобиля: ${req.params.id}`);
    
    if (req.files && req.files.length > 0) {
      console.log('Загруженные файлы:');
      req.files.forEach((file, index) => {
        console.log(`Файл ${index + 1}:`);
        console.log(`- Оригинальное имя: ${file.originalname}`);
        console.log(`- Сохранен как: ${file.filename}`);
        console.log(`- Путь: ${file.path}`);
        console.log(`- Размер: ${file.size} байт`);
        console.log(`- MIME тип: ${file.mimetype}`);
        
        // Проверка существования на диске
        if (fs.existsSync(file.path)) {
          console.log(`- ✅ Файл существует на диске по пути ${file.path}`);
        } else {
          console.log(`- ❌ ОШИБКА: Файл НЕ существует на диске по пути ${file.path}`);
        }
      });
    } else {
      console.log('Файлы не были загружены');
    }
    
    next();
  },
  handleUploadError
], carController.updateCar);

router.delete('/:id', [
  authMiddleware, 
  adminMiddleware
], carController.deleteCar);

// Специальный маршрут только для загрузки изображений
router.post('/:id/images', [
  authMiddleware, 
  managerMiddleware,
  debugCarRequests,
  carUploader.array('images', 10),
  handleUploadError
], carController.uploadCarImages);

router.post('/:id/main-image', [
  authMiddleware, 
  managerMiddleware
], carController.setMainImage);

module.exports = router;
