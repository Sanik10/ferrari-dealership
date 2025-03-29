const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Константы для конфигурации
const UPLOAD_PATH = path.join(__dirname, '..', 'uploads');
const CARS_PATH = path.join(UPLOAD_PATH, 'cars');
const EVENTS_PATH = path.join(UPLOAD_PATH, 'events');
const USERS_PATH = path.join(UPLOAD_PATH, 'users');

console.log("=== ИНИЦИАЛИЗАЦИЯ UPLOAD MIDDLEWARE ===");
console.log(`UPLOAD_PATH: ${UPLOAD_PATH}`);
console.log(`CARS_PATH: ${CARS_PATH}`);

// Самая простая конфигурация для multer - автомобили
const carStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log(`Получен запрос на загрузку файла автомобиля: ${file.originalname} (${file.mimetype}, ${file.size} байт)`);
    
    // Проверяем и создаем директорию uploads/cars
    if (!fs.existsSync(CARS_PATH)) {
      console.log(`Директория не существует: ${CARS_PATH}. Создаём...`);
      try {
        fs.mkdirSync(CARS_PATH, { recursive: true, mode: 0o777 });
        console.log(`✅ Успешно создана директория: ${CARS_PATH}`);
      } catch (err) {
        console.error(`❌ ОШИБКА при создании директории ${CARS_PATH}:`, err);
      }
    } else {
      console.log(`Директория существует: ${CARS_PATH}`);
      
      // Проверим права доступа
      try {
        const stats = fs.statSync(CARS_PATH);
        console.log(`Права доступа к ${CARS_PATH}: ${stats.mode.toString(8)}`);
        
        // Проверим возможность записи
        const testFilePath = path.join(CARS_PATH, 'test-write.txt');
        fs.writeFileSync(testFilePath, 'test');
        fs.unlinkSync(testFilePath);
        console.log(`✅ Проверка записи в ${CARS_PATH} прошла успешно`);
      } catch (err) {
        console.error(`❌ ОШИБКА при проверке прав доступа к ${CARS_PATH}:`, err);
      }
    }
    
    console.log(`Сохраняем файл в директорию: ${CARS_PATH}`);
    cb(null, CARS_PATH);
  },
  filename: function(req, file, cb) {
    // Простое имя файла - timestamp + оригинальное имя с заменой пробелов на подчеркивания
    const cleanedName = file.originalname.replace(/\s+/g, '_');
    const filename = Date.now() + '-' + cleanedName;
    console.log(`Генерируем имя файла: ${filename}`);
    
    // Проверим полный путь, куда будет сохранен файл
    const fullPath = path.join(CARS_PATH, filename);
    console.log(`Полный путь для сохранения: ${fullPath}`);
    
    cb(null, filename);
  }
});

// Простая конфигурация для событий
const eventStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Проверяем и создаем директорию uploads/events
    if (!fs.existsSync(EVENTS_PATH)) {
      fs.mkdirSync(EVENTS_PATH, { recursive: true, mode: 0o777 });
      console.log(`Создана директория: ${EVENTS_PATH}`);
    }
    cb(null, EVENTS_PATH);
  },
  filename: function(req, file, cb) {
    // Простое имя файла - timestamp + оригинальное имя
    const filename = Date.now() + '-' + file.originalname;
    console.log(`Сохраняем файл как: ${filename}`);
    cb(null, filename);
  }
});

// Простая конфигурация для пользователей
const userStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Проверяем и создаем директорию uploads/users
    if (!fs.existsSync(USERS_PATH)) {
      fs.mkdirSync(USERS_PATH, { recursive: true, mode: 0o777 });
      console.log(`Создана директория: ${USERS_PATH}`);
    }
    cb(null, USERS_PATH);
  },
  filename: function(req, file, cb) {
    // Простое имя файла - timestamp + оригинальное имя
    const filename = Date.now() + '-' + file.originalname;
    console.log(`Сохраняем файл как: ${filename}`);
    cb(null, filename);
  }
});

// Простые загрузчики без сложных проверок
const carUploader = multer({ 
  storage: carStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 МБ максимальный размер файла
  }
});

const eventUploader = multer({
  storage: eventStorage
});

const userUploader = multer({
  storage: userStorage
});

// Простая функция для получения URL изображения
const getImageUrl = (filename, type = 'cars') => {
  const folder = type === 'cars' ? 'cars' : (type === 'events' ? 'events' : 'users');
  const url = `/uploads/${folder}/${filename}`;
  console.log(`Сгенерирован URL для изображения: ${url}`);
  return url;
};

// Простой обработчик ошибок
const handleUploadError = (err, req, res, next) => {
  console.error('❌ ОШИБКА при загрузке файла:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `Файл слишком большой. Максимальный размер: 10 МБ` });
    }
  }
  return res.status(500).json({ error: `Ошибка загрузки: ${err.message}` });
};

// Упрощенный middleware для logRequest
const logRequest = (req, res, next) => {
  console.log('=== ДЕТАЛИ ЗАПРОСА ЗАГРУЗКИ ===');
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Метод: ${req.method}`);
  console.log('Заголовки:');
  Object.keys(req.headers).forEach(key => {
    console.log(`  ${key}: ${req.headers[key]}`);
  });
  
  if (req.body) {
    console.log('Тело запроса:');
    console.log(req.body);
  }
  
  next();
};

module.exports = {
  carUploader,
  eventUploader,
  userUploader,
  handleUploadError,
  getImageUrl,
  logRequest,
  CARS_PATH,
  EVENTS_PATH,
  USERS_PATH,
  UPLOAD_PATH
}; 