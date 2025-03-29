const { Car, Sequelize } = require('../models');
const { Op } = Sequelize;

class CarService {
  async getAllCars(query = {}) {
    // Фильтрация и сортировка
    const options = {
      where: {}
    };
    
    // Фильтрация по категории
    if (query.category) {
      options.where.category = query.category;
    }
    
    // Фильтрация по цене
    if (query.minPrice || query.maxPrice) {
      options.where.price = {};
      if (query.minPrice) options.where.price[Op.gte] = parseFloat(query.minPrice);
      if (query.maxPrice) options.where.price[Op.lte] = parseFloat(query.maxPrice);
    }
    
    // Фильтрация по доступности для аренды
    if (query.rentalAvailable) {
      options.where.rentalAvailable = true;
    }
    
    // Фильтрация по доступности для тест-драйва
    if (query.testDriveAvailable) {
      options.where.testDriveAvailable = true;
    }
    
    // Фильтрация по наличию
    if (query.available !== undefined) {
      options.where.available = (query.available === 'true');
    }
    
    // Фильтрация по году выпуска
    if (query.minYear || query.maxYear) {
      options.where.year = {};
      if (query.minYear) options.where.year[Op.gte] = parseInt(query.minYear);
      if (query.maxYear) options.where.year[Op.lte] = parseInt(query.maxYear);
    }
    
    // Сортировка
    if (query.sortBy && ['price', 'year', 'horsepower'].includes(query.sortBy)) {
      options.order = [[query.sortBy, query.sortOrder === 'desc' ? 'DESC' : 'ASC']];
    }
    
    // Пагинация
    if (query.limit) {
      options.limit = parseInt(query.limit);
      if (query.page) {
        options.offset = (parseInt(query.page) - 1) * options.limit;
      }
    }
    
    return await Car.findAll(options);
  }

  async getCarById(id) {
    const car = await Car.findByPk(id);
    if (!car) throw new Error('Автомобиль не найден');
    return car;
  }

  async createCar(data) {
    try {
      console.log("[CarService] ===== НАЧАЛО СОЗДАНИЯ АВТОМОБИЛЯ =====");
      console.log("[CarService] createCar вызван с данными:", {
        brand: data.brand,
        model: data.model,
        year: data.year,
        vin: data.vin,
        price: data.price,
        category: data.category,
        hasImages: Array.isArray(data.images) ? `Да (${data.images.length} шт.)` : `Нет (тип: ${typeof data.images})`,
        featuresCount: Array.isArray(data.features) ? data.features.length : 0,
        dataKeys: Object.keys(data)
      });
      
      // Клонируем объект данных для обработки
      const processedData = { ...data };
      
      // Обрабатываем числовые поля
      const numericFields = ['price', 'year', 'mileage', 'horsepower', 'acceleration', 'maxSpeed', 'fuelConsumption', 'rentalPricePerDay'];
      
      numericFields.forEach(field => {
        if (data[field] !== undefined && data[field] !== null) {
          try {
            const numValue = Number(data[field]);
            if (!isNaN(numValue)) {
              processedData[field] = numValue;
              console.log(`[CarService] ${field} преобразован в число: ${numValue}`);
            } else {
              console.error(`[CarService] ${field} не удалось преобразовать в число, значение: ${data[field]}`);
              throw new Error(`${field} должен быть числом`);
            }
          } catch (e) {
            console.error(`[CarService] Ошибка при преобразовании ${field}:`, e);
            throw new Error(`Ошибка при преобразовании поля ${field}: ${e.message}`);
          }
        }
      });
      
      // Обрабатываем булевы поля
      const booleanFields = ['rentalAvailable', 'testDriveAvailable', 'available', 'carbonCeramic', 'certificateOfAuthenticity'];
      
      booleanFields.forEach(field => {
        if (data[field] !== undefined) {
          if (typeof data[field] === 'string') {
            processedData[field] = data[field] === 'true';
            console.log(`[CarService] ${field} преобразован из строки в булево: ${processedData[field]}`);
          }
        }
      });
      
      // ВАЖНО: Проверяем формат изображений
      if (data.images !== undefined) {
        console.log(`[CarService] Изображения до обработки:`, data.images);
        
        // Убедимся, что images всегда является массивом
        if (!Array.isArray(data.images)) {
          if (typeof data.images === 'string') {
            try {
              // Попытка распарсить как JSON, если это JSON-строка
              const parsedImages = JSON.parse(data.images);
              processedData.images = Array.isArray(parsedImages) ? parsedImages : [data.images];
              console.log(`[CarService] Изображения распарсены из JSON-строки, элементов: ${processedData.images.length}`);
            } catch (e) {
              // Если не JSON, то используем как одиночную строку
              processedData.images = [data.images];
              console.log(`[CarService] Изображения преобразованы из строки в массив с одним элементом`);
            }
          } else {
            processedData.images = [];
            console.log(`[CarService] Изображения установлены как пустой массив, исходный тип: ${typeof data.images}`);
          }
        }
        
        // Убедимся, что в массиве нет пустых элементов
        if (Array.isArray(processedData.images)) {
          processedData.images = processedData.images.filter(img => img);
          console.log(`[CarService] Отфильтрованные изображения, элементов: ${processedData.images.length}`);
          
          if (processedData.images.length > 0) {
            console.log(`[CarService] Содержимое массива изображений:`, processedData.images);
          }
        }
      }
      
      // Обработка особенностей (features)
      if (data.features !== undefined) {
        if (!Array.isArray(data.features)) {
          if (typeof data.features === 'string') {
            try {
              // Попытка распарсить как JSON, если это JSON-строка
              const parsedFeatures = JSON.parse(data.features);
              processedData.features = Array.isArray(parsedFeatures) ? parsedFeatures : [data.features];
            } catch (e) {
              // Если не JSON, то используем как одиночную строку
              processedData.features = [data.features];
            }
          } else {
            processedData.features = [];
          }
        }
      }
      
      // Создаем автомобиль с обработанными данными
      console.log(`[CarService] Создаем автомобиль с обработанными данными:`, {
        imagesCount: processedData.images ? processedData.images.length : 0,
        featuresCount: processedData.features ? processedData.features.length : 0,
        mainImage: processedData.mainImage || 'не задано'
      });
      
      // ВАЖНО: Убедимся, что ничего не сериализуется в JSON перед сохранением
      // Sequelize должен сохранять массивы как массивы
      
      const car = await Car.create(processedData);
      
      console.log(`[CarService] Автомобиль успешно создан с ID: ${car.id}`);
      console.log(`[CarService] Данные созданного автомобиля:`, {
        id: car.id,
        images: car.images,
        imagesCount: car.images ? car.images.length : 0,
        mainImage: car.mainImage,
        featuresCount: car.features ? car.features.length : 0
      });
      console.log("[CarService] ===== ЗАВЕРШЕНО СОЗДАНИЕ АВТОМОБИЛЯ =====");
      
      return car;
    } catch (error) {
      console.error(`[CarService] Ошибка при создании автомобиля:`, error);
      throw error;
    }
  }

  async updateCar(id, data) {
    try {
    const car = await Car.findByPk(id);
    if (!car) throw new Error('Автомобиль не найден');
      
      console.log(`[CarService] ===== НАЧАЛО ОБНОВЛЕНИЯ АВТОМОБИЛЯ ${id} =====`);
      console.log(`[CarService] Текущие данные:`, {
        imagesCount: car.images ? (Array.isArray(car.images) ? car.images.length : 'не массив') : 0,
        mainImage: car.mainImage || 'не задано',
        imagesType: typeof car.images
      });
      
      // Клонируем объект данных, чтобы не модифицировать исходный
      const processedData = { ...data };
      
      // Явное логирование данных об изображениях и главном изображении
      console.log(`[CarService] Данные изображений перед обработкой:`, {
        images: data.images ? `${Array.isArray(data.images) ? data.images.length : 'не массив'} элементов` : 'отсутствуют',
        mainImage: data.mainImage || 'отсутствует'
      });
      
      // ОЧЕНЬ ВАЖНО: Обрабатываем изображения, но НЕ сериализуем их в JSON
      if (data.images !== undefined) {
        // Убедимся, что images всегда является массивом
        if (!Array.isArray(data.images)) {
          if (typeof data.images === 'string') {
            try {
              // Попытка распарсить как JSON, если это JSON-строка
              const parsedImages = JSON.parse(data.images);
              processedData.images = Array.isArray(parsedImages) ? parsedImages : [data.images];
              console.log(`[CarService] Изображения распарсены из JSON-строки, элементов: ${processedData.images.length}`);
            } catch (e) {
              // Если не JSON, то используем как одиночную строку
              processedData.images = [data.images];
              console.log(`[CarService] Изображения преобразованы из строки в массив с одним элементом`);
            }
          } else {
            // Если это не массив и не строка, устанавливаем пустой массив
            processedData.images = [];
            console.log(`[CarService] Изображения установлены как пустой массив, исходный тип: ${typeof data.images}`);
          }
        } else {
          // Убедимся, что в массиве нет пустых элементов
          processedData.images = data.images.filter(img => img);
          console.log(`[CarService] Отфильтрованные изображения, элементов: ${processedData.images.length}`);
        }
        
        // Выведем содержимое массива для диагностики
        if (processedData.images.length > 0) {
          console.log(`[CarService] Содержимое массива изображений:`, processedData.images);
        }
        
        // УДАЛЕНО: НЕ сериализуем массив в JSON-строку
        // Оставляем массив как есть для Sequelize
      }
      
      // Проверка mainImage
      if (data.mainImage !== undefined) {
        console.log(`[CarService] Главное изображение передано:`, data.mainImage);
        
        // Проверяем, что mainImage существует в массиве images
        const imagesArray = processedData.images || [];
        
        if (imagesArray.length > 0 && data.mainImage) {
          const mainImageExists = imagesArray.includes(data.mainImage);
          console.log(`[CarService] Главное изображение ${mainImageExists ? 'найдено' : 'НЕ найдено'} в массиве images`);
          
          if (!mainImageExists) {
            console.warn(`[CarService] Главное изображение не найдено в списке images, используем первое изображение`);
            processedData.mainImage = imagesArray[0];
          }
        } else if (imagesArray.length === 0 && data.mainImage) {
          console.warn(`[CarService] Установлено главное изображение, но массив images пуст!`);
          processedData.mainImage = null;
        }
      }
      
      // Обрабатываем features
      if (data.features !== undefined) {
        if (!Array.isArray(data.features)) {
          if (typeof data.features === 'string') {
            try {
              // Попытка распарсить как JSON, если это JSON-строка
              const parsedFeatures = JSON.parse(data.features);
              processedData.features = Array.isArray(parsedFeatures) ? parsedFeatures : [data.features];
              console.log(`[CarService] Features распарсены из JSON-строки, элементов: ${processedData.features.length}`);
            } catch (e) {
              // Если не JSON, то используем как одиночную строку
              processedData.features = [data.features];
              console.log(`[CarService] Features преобразованы из строки в массив с одним элементом`);
            }
          } else {
            processedData.features = [];
            console.log(`[CarService] Features установлены как пустой массив, исходный тип: ${typeof data.features}`);
          }
        }
      }
      
      // ВАЖНО: Не сериализуем массивы в JSON-строки!
      
      // Обновляем автомобиль
      console.log(`[CarService] Обновляем автомобиль с данными:`, {
        id: id,
        imagesCount: processedData.images ? processedData.images.length : 0,
        mainImage: processedData.mainImage || 'не задано',
        featuresCount: processedData.features ? processedData.features.length : 0
      });
      
      // Применяем обновление
      await car.update(processedData);
      
      // Получаем обновленные данные
      const updatedCar = await Car.findByPk(id);
      
      console.log(`[CarService] Автомобиль успешно обновлен:`, {
        id: updatedCar.id,
        images: updatedCar.images,
        imagesCount: updatedCar.images ? (Array.isArray(updatedCar.images) ? updatedCar.images.length : 'не массив') : 0,
        mainImage: updatedCar.mainImage || 'не задано',
        imagesType: typeof updatedCar.images
      });
      console.log(`[CarService] ===== ЗАВЕРШЕНО ОБНОВЛЕНИЕ АВТОМОБИЛЯ ${id} =====`);
      
      return updatedCar;
    } catch (error) {
      console.error(`[CarService] Ошибка при обновлении автомобиля:`, error);
      throw error;
    }
  }

  async deleteCar(id) {
    const car = await Car.findByPk(id);
    if (!car) throw new Error('Автомобиль не найден');
    await car.destroy();
    return { success: true };
  }
  
  async updateCarImages(id, images, mainImage = null, mainImageIndex = null) {
    const car = await Car.findByPk(id);
    if (!car) throw new Error('Автомобиль не найден');
    
    console.log(`[CarService] === НАЧАЛО ОБНОВЛЕНИЯ ИЗОБРАЖЕНИЙ ДЛЯ АВТОМОБИЛЯ ${id} ===`);
    console.log(`[CarService] Количество изображений: ${images.length}`);
    console.log(`[CarService] Содержимое изображений:`, images);
    console.log(`[CarService] Переданный mainImage: ${mainImage}`);
    console.log(`[CarService] Переданный mainImageIndex: ${mainImageIndex}`);
    
    // Создаем объект для обновления
    const updateData = { images };
    
    // Определяем главное изображение
    if (mainImage) {
      // Если напрямую передан путь к главному изображению
      updateData.mainImage = mainImage;
      console.log(`[CarService] Установлено главное изображение по прямому указанию: ${mainImage}`);
    } else if (mainImageIndex !== null && !isNaN(parseInt(mainImageIndex)) && images.length > 0) {
      // Если передан индекс главного изображения
      const index = parseInt(mainImageIndex);
      if (index >= 0 && index < images.length) {
        updateData.mainImage = images[index];
        console.log(`[CarService] Установлено главное изображение по индексу ${index}: ${updateData.mainImage}`);
      } else {
        console.log(`[CarService] Индекс ${index} вне диапазона (0-${images.length-1}), используем первое изображение`);
        updateData.mainImage = images[0];
      }
    } else if (images.length > 0 && !car.mainImage) {
      // Если нет указаний, но есть изображения и нет текущего главного
      updateData.mainImage = images[0];
      console.log(`[CarService] Не указано главное изображение, используем первое: ${updateData.mainImage}`);
    }
    
    console.log(`[CarService] Итоговые данные обновления:`, updateData);
    
    // Обновляем запись
    const result = await car.update(updateData);
    
    // Получаем обновленные данные
    const updatedCar = await Car.findByPk(id);
    console.log(`[CarService] Результат обновления:`, {
      id: updatedCar.id,
      imagesCount: updatedCar.images ? updatedCar.images.length : 0,
      mainImage: updatedCar.mainImage
    });
    
    console.log(`[CarService] === КОНЕЦ ОБНОВЛЕНИЯ ИЗОБРАЖЕНИЙ ДЛЯ АВТОМОБИЛЯ ${id} ===`);
    
    return updatedCar;
  }
  
  async searchCars(searchTerm) {
    return await Car.findAll({
      where: {
        [Op.or]: [
          { brand: { [Op.iLike]: `%${searchTerm}%` } },
          { model: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      }
    });
  }
  
  async getAvailableForRental() {
    return await Car.findAll({
      where: {
        rentalAvailable: true,
        available: true
      }
    });
  }
  
  async getAvailableForTestDrive() {
    return await Car.findAll({
      where: {
        testDriveAvailable: true,
        available: true
      }
    });
  }
}

module.exports = new CarService();