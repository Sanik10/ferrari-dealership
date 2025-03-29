const carService = require('../services/carService');
const { carUploader, getImageUrl } = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');
const Car = require('../models/car');

class CarController {
  async getAllCars(req, res) {
    try {
      const cars = await carService.getAllCars(req.query);
      res.json(cars);
    } catch (error) {
      console.error('❌ Ошибка при получении автомобилей:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getCarById(req, res) {
    try {
      const car = await carService.getCarById(req.params.id);
      res.json(car);
    } catch (error) {
      console.error('❌ Ошибка при получении автомобиля:', error);
      res.status(404).json({ error: error.message });
    }
  }

  async createCar(req, res) {
    console.log("=== СУПЕР ПРОСТОЕ СОЗДАНИЕ АВТОМОБИЛЯ ===");
    console.log("Заголовки запроса:", {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length']
    });
    
    try {
      // Проверка базовых полей
      if (!req.body.brand || !req.body.model || !req.body.year || !req.body.price || !req.body.vin) {
        return res.status(400).json({ error: "Не все обязательные поля заполнены" });
      }
      
      // Базовые данные автомобиля
      const carData = {
        // Базовые поля
        brand: req.body.brand,
        model: req.body.model,
        year: parseInt(req.body.year),
        price: parseFloat(req.body.price),
        vin: req.body.vin,
        category: req.body.category || 'sport',
        mileage: req.body.mileage ? parseInt(req.body.mileage) : 0,
        available: req.body.available !== undefined ? (req.body.available === 'true') : true,
        
        // Технические характеристики
        engine: req.body.engine || null,
        transmission: req.body.transmission || null,
        horsepower: req.body.horsepower ? parseInt(req.body.horsepower) : null,
        acceleration: req.body.acceleration ? parseFloat(req.body.acceleration) : null,
        maxSpeed: req.body.maxSpeed ? parseInt(req.body.maxSpeed) : null,
        fuelType: req.body.fuelType || null,
        fuelConsumption: req.body.fuelConsumption ? parseFloat(req.body.fuelConsumption) : null,
        driveType: req.body.driveType || null,
        
        // Внешний вид
        specialSeries: req.body.specialSeries || null,
        exteriorColor: req.body.exteriorColor || null,
        interiorColor: req.body.interiorColor || null,
        interiorMaterial: req.body.interiorMaterial || null,
        wheels: req.body.wheels || null,
        
        // Дополнительные опции
        rentalAvailable: req.body.rentalAvailable !== undefined ? (req.body.rentalAvailable === 'true') : false,
        rentalPricePerDay: req.body.rentalPricePerDay ? parseFloat(req.body.rentalPricePerDay) : null,
        testDriveAvailable: req.body.testDriveAvailable !== undefined ? (req.body.testDriveAvailable === 'true') : false,
        carbonCeramic: req.body.carbonCeramic !== undefined ? (req.body.carbonCeramic === 'true') : false,
        carLocation: req.body.carLocation || null,
        certificateOfAuthenticity: req.body.certificateOfAuthenticity !== undefined ? (req.body.certificateOfAuthenticity === 'true') : false,
        
        // Описание и прочее
        description: req.body.description || null,
        history: req.body.history || null
      };
      
      console.log("Данные для создания автомобиля:");
      console.log(JSON.stringify(carData, null, 2));
      
      // Проверка наличия файлов
      console.log("Проверка файлов...");
      console.log("req.files:", req.files);
      console.log("Тип req.files:", typeof req.files);
      console.log("req.files instanceof Array:", req.files instanceof Array);
      
      if (req.files && req.files.length > 0) {
        console.log(`Обнаружено ${req.files.length} файлов`);
        console.log("Подробная информация о файлах:");
        req.files.forEach((file, index) => {
          console.log(`Файл ${index + 1}:`);
          console.log(`- Оригинальное имя: ${file.originalname}`);
          console.log(`- Сохранен как: ${file.filename}`);
          console.log(`- Путь: ${file.path}`);
          console.log(`- Размер: ${file.size} байт`);
          console.log(`- MIME тип: ${file.mimetype}`);
        });
        
        // Сохраняем все пути к файлам
        const imagePaths = [];
        
        // Проверяем каждый файл
        for (const file of req.files) {
          if (!fs.existsSync(file.path)) {
            console.log(`ФАЙЛ НЕ СУЩЕСТВУЕТ на диске: ${file.path}`);
            continue;
          }
          
          // Путь для сохранения в БД
          const relativePath = `/uploads/cars/${file.filename}`;
          imagePaths.push(relativePath);
          
          console.log(`Файл ${file.originalname} добавлен: ${relativePath}`);
        }
        
        console.log(`Итоговый список путей изображений (${imagePaths.length}):`, imagePaths);
        
        // Важно: сначала сохраняем автомобиль без изображений
        console.log("Сохраняем автомобиль без изображений...");
        const newCar = await Car.create(carData);
        console.log(`Автомобиль создан с ID: ${newCar.id}`);
        
        // Если есть изображения, обновляем отдельным запросом
        if (imagePaths.length > 0) {
          console.log(`Добавляем ${imagePaths.length} изображений отдельным запросом...`);
          console.log("Пути изображений:", imagePaths);
          
          // Устанавливаем главное изображение
          const mainImage = imagePaths[0];
          console.log(`Главное изображение: ${mainImage}`);
          
          // Используем метод сервиса вместо прямого обновления
          console.log("Используем carService.updateCarImages для сохранения изображений");
          
          // Получаем обновленный автомобиль с изображениями
          const updatedCar = await carService.updateCarImages(newCar.id, imagePaths);
          
          // Устанавливаем главное изображение
          await carService.updateCar(newCar.id, { mainImage });
          
          // Получаем финальную версию автомобиля
          const finalCar = await carService.getCarById(newCar.id);
          
          console.log("Данные автомобиля после обновления:");
          console.log(`- ID: ${finalCar.id}`);
          console.log(`- Изображения (тип): ${typeof finalCar.images}`);
          console.log(`- Изображения (массив): ${Array.isArray(finalCar.images)}`);
          console.log(`- Изображения (длина): ${finalCar.images ? finalCar.images.length : 0}`);
          console.log(`- Изображения (содержимое): ${JSON.stringify(finalCar.images)}`);
          console.log(`- Главное изображение: ${finalCar.mainImage}`);
          
          return res.status(201).json({
            message: "Автомобиль успешно создан с изображениями",
            car: finalCar
          });
        } else {
          console.log("Нет изображений для добавления");
          return res.status(201).json({
            message: "Автомобиль успешно создан без изображений",
            car: newCar
          });
        }
      } else {
        // Если нет файлов, просто создаем автомобиль
        console.log("Файлы не найдены, создаем автомобиль без изображений");
        const car = await Car.create(carData);
        
        return res.status(201).json({
          message: "Автомобиль успешно создан без изображений",
          car
        });
      }
    } catch (error) {
      console.error("ОШИБКА при создании автомобиля:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateCar(req, res) {
    console.log("=== СУПЕР ПРОСТОЕ ОБНОВЛЕНИЕ АВТОМОБИЛЯ ===");
    
    try {
      const { id } = req.params;
      console.log(`ID автомобиля: ${id}`);
      
      // Проверяем существование автомобиля
      const currentCar = await Car.findByPk(id);
      if (!currentCar) {
        return res.status(404).json({ error: "Автомобиль не найден" });
      }
      
      console.log("Текущие данные автомобиля:");
      console.log(`- ID: ${currentCar.id}`);
      console.log(`- Бренд/Модель: ${currentCar.brand} ${currentCar.model}`);
      console.log(`- Изображения: ${JSON.stringify(currentCar.images)}`);
      
      // Создаем данные для обновления
      const updateData = {
        // Базовые поля
        brand: req.body.brand || currentCar.brand,
        model: req.body.model || currentCar.model,
        year: req.body.year ? parseInt(req.body.year) : currentCar.year,
        price: req.body.price ? parseFloat(req.body.price) : currentCar.price,
        vin: req.body.vin || currentCar.vin,
        category: req.body.category || currentCar.category,
        mileage: req.body.mileage ? parseInt(req.body.mileage) : currentCar.mileage,
        available: req.body.available !== undefined ? (req.body.available === 'true') : currentCar.available,
        
        // Технические характеристики
        engine: req.body.engine || currentCar.engine,
        transmission: req.body.transmission || currentCar.transmission,
        horsepower: req.body.horsepower ? parseInt(req.body.horsepower) : currentCar.horsepower,
        acceleration: req.body.acceleration ? parseFloat(req.body.acceleration) : currentCar.acceleration,
        maxSpeed: req.body.maxSpeed ? parseInt(req.body.maxSpeed) : currentCar.maxSpeed,
        fuelType: req.body.fuelType || currentCar.fuelType,
        fuelConsumption: req.body.fuelConsumption ? parseFloat(req.body.fuelConsumption) : currentCar.fuelConsumption,
        driveType: req.body.driveType || currentCar.driveType,
        
        // Внешний вид
        specialSeries: req.body.specialSeries || currentCar.specialSeries,
        exteriorColor: req.body.exteriorColor || currentCar.exteriorColor,
        interiorColor: req.body.interiorColor || currentCar.interiorColor,
        interiorMaterial: req.body.interiorMaterial || currentCar.interiorMaterial,
        wheels: req.body.wheels || currentCar.wheels,
        
        // Дополнительные опции
        rentalAvailable: req.body.rentalAvailable !== undefined ? (req.body.rentalAvailable === 'true') : currentCar.rentalAvailable,
        rentalPricePerDay: req.body.rentalPricePerDay ? parseFloat(req.body.rentalPricePerDay) : currentCar.rentalPricePerDay,
        testDriveAvailable: req.body.testDriveAvailable !== undefined ? (req.body.testDriveAvailable === 'true') : currentCar.testDriveAvailable,
        carbonCeramic: req.body.carbonCeramic !== undefined ? (req.body.carbonCeramic === 'true') : currentCar.carbonCeramic,
        carLocation: req.body.carLocation || currentCar.carLocation,
        certificateOfAuthenticity: req.body.certificateOfAuthenticity !== undefined ? (req.body.certificateOfAuthenticity === 'true') : currentCar.certificateOfAuthenticity,
        
        // Описание и прочее
        description: req.body.description || currentCar.description,
        history: req.body.history || currentCar.history
      };
      
      // Логирование данных обновления
      console.log("Данные для обновления:");
      console.log(JSON.stringify(updateData, null, 2));
      
      // Обработка файлов изображений
      console.log("Проверка файлов...");
      
      // Начнем с текущих изображений
      let imagePaths = Array.isArray(currentCar.images) ? [...currentCar.images] : [];
      console.log(`Текущие изображения (${imagePaths.length}):`, imagePaths);
      
      // Обрабатываем новые файлы
      if (req.files && req.files.length > 0) {
        console.log(`Обнаружено ${req.files.length} новых файлов`);
        
        // Проходим по каждому файлу и проверяем его
        for (const file of req.files) {
          if (!fs.existsSync(file.path)) {
            console.log(`ФАЙЛ НЕ СУЩЕСТВУЕТ на диске: ${file.path}`);
            continue;
          }
          
          // Добавляем путь для сохранения в БД
          const relativePath = `/uploads/cars/${file.filename}`;
          imagePaths.push(relativePath);
          
          console.log(`Файл ${file.originalname} добавлен: ${relativePath}`);
        }
      }
      
      // Обрабатываем главное изображение
      let mainImage = currentCar.mainImage;
      
      if (imagePaths.length > 0) {
        // Если есть индекс главного изображения и он валидный
        if (req.body.mainImageIndex !== undefined) {
          const index = parseInt(req.body.mainImageIndex);
          if (!isNaN(index) && index >= 0 && index < imagePaths.length) {
            mainImage = imagePaths[index];
            console.log(`Установлено главное изображение по индексу ${index}: ${mainImage}`);
          } else {
            // Если индекс невалидный, но есть изображения
            mainImage = imagePaths[0];
            console.log(`Невалидный индекс, используем первое изображение: ${mainImage}`);
          }
        } else if (!mainImage) {
          // Если главное изображение не указано, используем первое
          mainImage = imagePaths[0];
          console.log(`Главное изображение не указано, используем первое: ${mainImage}`);
        }
      } else {
        // Если изображений нет
        mainImage = null;
        console.log("Изображений нет, главное изображение не установлено");
      }
      
      // Прямое обновление автомобиля через модель
      console.log("Обновляем данные автомобиля...");
      
      // Сначала обновляем базовые данные
      await carService.updateCar(id, updateData);
      
      // Затем отдельно обновляем изображения
      console.log(`Обновляем ${imagePaths.length} изображений...`);
      
      // Используем сервис для обновления изображений
      if (imagePaths.length > 0) {
        // Получаем индекс главного изображения из запроса
        const mainImageIndex = req.body.mainImageIndex !== undefined ? 
          parseInt(req.body.mainImageIndex) : null;
        
        console.log(`Индекс главного изображения из запроса: ${mainImageIndex}`);
        
        // Передаем индекс в сервис для установки главного изображения
        await carService.updateCarImages(id, imagePaths, null, mainImageIndex);
      }
      
      // Получаем обновленные данные
      const updatedCar = await carService.getCarById(id);
      
      console.log("Данные автомобиля после обновления:");
      console.log(`- ID: ${updatedCar.id}`);
      console.log(`- Изображения: ${JSON.stringify(updatedCar.images)}`);
      console.log(`- Главное изображение: ${updatedCar.mainImage}`);
      
      return res.json({
        message: "Автомобиль успешно обновлен",
        car: updatedCar
      });
    } catch (error) {
      console.error("ОШИБКА при обновлении автомобиля:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteCar(req, res) {
    try {
      await carService.deleteCar(req.params.id);
      res.json({ message: "Автомобиль успешно удален" });
    } catch (error) {
      console.error('❌ Ошибка при удалении автомобиля:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async uploadCarImages(req, res) {
    try {
      const carId = req.params.id;
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Файлы не загружены" });
      }
      
      // Получаем текущий автомобиль
      const car = await carService.getCarById(carId);
      
      // Получаем текущие изображения
      const currentImages = car.images || [];
      
      // Обрабатываем новые изображения
      const newImages = [];
      for (const file of req.files) {
        if (fs.existsSync(file.path)) {
          const imageUrl = getImageUrl(file.filename);
          newImages.push(imageUrl);
        }
      }
      
      // Объединяем с существующими
      const allImages = [...currentImages, ...newImages];
      
      // Получаем индекс главного изображения из запроса
      const mainImageIndex = req.body.mainImageIndex !== undefined ? 
        parseInt(req.body.mainImageIndex) : null;
      
      console.log(`Индекс главного изображения из запроса: ${mainImageIndex}`);
      
      // Обновляем автомобиль с изображениями и главным изображением
      const updatedCar = await carService.updateCarImages(carId, allImages, null, mainImageIndex);
      
      res.json({
        message: "Изображения успешно загружены",
        car: updatedCar
      });
    } catch (error) {
      console.error('❌ Ошибка при загрузке изображений:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async setMainImage(req, res) {
    try {
      const carId = req.params.id;
      const { mainImage } = req.body;
      
      if (!mainImage) {
        return res.status(400).json({ error: "Не указано главное изображение" });
      }
      
      const car = await carService.getCarById(carId);
      
      // Проверяем, что выбранное изображение есть в списке
      if (!car.images.includes(mainImage)) {
        return res.status(400).json({ error: "Указанное изображение не найдено в списке" });
      }
      
      // Обновляем главное изображение
      await carService.updateCar(carId, { mainImage });
      
      res.json({
        message: "Главное изображение успешно обновлено",
        mainImage
      });
    } catch (error) {
      console.error('❌ Ошибка при установке главного изображения:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async searchCars(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: "Поисковый запрос не указан" });
      }
      
      const cars = await carService.searchCars(q);
      
      res.json(cars);
    } catch (error) {
      console.error('Error searching cars:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async getAvailableForRental(req, res) {
    try {
      const cars = await carService.getAvailableForRental();
      res.json(cars);
    } catch (error) {
      console.error('Error getting rental cars:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async getAvailableForTestDrive(req, res) {
    try {
      const cars = await carService.getAvailableForTestDrive();
      res.json(cars);
    } catch (error) {
      console.error('Error getting test drive cars:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CarController(); 
