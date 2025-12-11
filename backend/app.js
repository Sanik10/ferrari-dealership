const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const sequelize = require('./db');
const { DataTypes } = require('sequelize');
const app = express();
const { User } = require('./models');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const setupRoutes = require('./routes/setupRoutes');
const indexRoutes = require('./routes/index');
const testDriveRoutes = require('./routes/testDriveRoutes');
const contactRoutes = require('./routes/contactRoutes');
const serviceAppointmentRoutes = require('./routes/serviceAppointmentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { carUploader, handleUploadError } = require('./middleware/uploadMiddleware');
const carController = require('./controllers/carController');

// Создаем папки для загрузок, если они не существуют
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads', 'cars'),
  path.join(__dirname, 'uploads', 'events'),
  path.join(__dirname, 'uploads', 'users')
];

// Простая проверка и создание директорий
console.log("Проверка директорий для загрузки файлов...");
for (const dir of uploadDirs) {
  try {
    if (!fs.existsSync(dir)) {
      console.log(`Создание директории: ${dir}`);
      fs.mkdirSync(dir, { recursive: true, mode: 0o777 });
      console.log(`✅ Директория создана: ${dir}`);
    } else {
      console.log(`Директория существует: ${dir}`);
      // Устанавливаем права 777 для обеспечения доступа
      fs.chmodSync(dir, 0o777);
      console.log(`✅ Установлены полные права для: ${dir}`);
    }
  } catch (error) {
    console.error(`❌ Ошибка при проверке/создании директории ${dir}:`, error);
  }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Промежуточный обработчик для логирования всех запросов
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  
  // Логируем тело запроса, если это не multipart
  if (!req.headers['content-type']?.includes('multipart/form-data')) {
    console.log(`Body: ${JSON.stringify(req.body)}`);
  } else {
    console.log(`Multipart request received with content-type: ${req.headers['content-type']}`);
  }
  
  // Перехватываем завершение запроса для логирования
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    console.log(`[RESPONSE] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/test-drives', testDriveRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/service', serviceAppointmentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);

app.post('/api/users/register-manager', async (req, res) => {
  try {
    const { username, password, fullName, email, phone, role } = req.body;
    
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newManager = await User.create({
      username,
      password: hashedPassword,
      fullName,
      email,
      role: role || 'manager',
      phone
    });
    
    const managerResponse = {
      id: newManager.id,
      username: newManager.username,
      fullName: newManager.fullName,
      email: newManager.email,
      role: newManager.role,
      phone: newManager.phone
    };
    
    res.status(201).json({
      message: 'Менеджер успешно создан',
      user: managerResponse
    });
  } catch (error) {
    console.error('Create manager error:', error);
    res.status(500).json({ message: 'Ошибка при создании менеджера', error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'fullName', 'email', 'role', 'phone', 'createdAt']
    });
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Ошибка при получении пользователей', error: error.message });
  }
});

// Обработка ошибок при загрузке файлов
app.use(handleUploadError);

// Обработка ошибок 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутренняя ошибка сервера';
  
  const errorResponse = {
    error: true,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  res.status(statusCode).json(errorResponse);
});

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('🔌 Подключение к базе данных успешно установлено');
    
    const { syncDatabase } = require('./models');
    
    // В разработке можно использовать force: true для пересоздания таблиц
    // В продакшене лучше использовать alter: true
    // Изменяем на false, чтобы не пересоздавать БД при каждом запуске
    const forceSync = false; // process.env.NODE_ENV === 'development';
    await syncDatabase(forceSync);
    
    console.log(`🗃️ База данных ${forceSync ? 'пересоздана' : 'синхронизирована'}`);
    
    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`🌐 Режим: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📝 API доступен по адресу: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Не удалось запустить сервер:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;