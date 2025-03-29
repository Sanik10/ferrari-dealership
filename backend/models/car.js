const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  mileage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  images: {
    type: DataTypes.TEXT,
    get() {
      console.log("[Car.images] ВЫЗВАН ГЕТТЕР ДЛЯ IMAGES");
      const rawValue = this.getDataValue('images');
      console.log("[Car.images] Исходное значение:", rawValue);
      
      if (!rawValue) {
        console.log("[Car.images] Пустое значение, возвращаем []");
        return [];
      }
      
      try {
        const parsed = JSON.parse(rawValue);
        console.log("[Car.images] Успешно распарсили JSON:", parsed);
        return parsed;
      } catch (error) {
        console.error("[Car.images] ОШИБКА при разборе JSON images:", error);
        
        if (typeof rawValue === 'string' && 
            (rawValue.includes('/uploads/') || rawValue.startsWith('http'))) {
          console.log("[Car.images] Обнаружен единичный URL, возвращаем как массив");
          return [rawValue];
        }
        
        console.log("[Car.images] Возвращаем пустой массив из-за ошибки");
        return [];
      }
    },
    set(value) {
      console.log("[Car.images] ВЫЗВАН СЕТТЕР ДЛЯ IMAGES");
      console.log("[Car.images] Тип value:", typeof value);
      console.log("[Car.images] Значение:", value);
      
      if (value === null || value === undefined) {
        console.log("[Car.images] Null/undefined значение, сохраняем пустой массив");
        this.setDataValue('images', JSON.stringify([]));
        return;
      }
      
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          console.log("[Car.images] Значение уже JSON-строка, сохраняем как есть:", value);
          console.log("[Car.images] Распарсенное значение:", parsed);
          this.setDataValue('images', value);
        } catch (e) {
          if (value.includes('/uploads/') || value.startsWith('http')) {
            console.log("[Car.images] Значение - одиночный URL, преобразуем в JSON-массив:", value);
            this.setDataValue('images', JSON.stringify([value]));
          } else {
            console.log("[Car.images] Значение не JSON и не URL, сохраняем пустой массив");
            this.setDataValue('images', JSON.stringify([]));
          }
        }
      } else if (Array.isArray(value)) {
        console.log("[Car.images] Значение - массив длиной", value.length, "преобразуем в JSON");
        this.setDataValue('images', JSON.stringify(value));
      } else {
        console.log("[Car.images] Значение необрабатываемого типа, сохраняем пустой массив");
        this.setDataValue('images', JSON.stringify([]));
      }
    }
  },
  mainImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  history: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  engine: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transmission: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  horsepower: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  acceleration: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: "0-100 km/h in seconds"
  },
  fuelType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fuelConsumption: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  features: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    get() {
      const value = this.getDataValue('features');
      if (!value) return [];
      
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error('Ошибка при разборе JSON features:', error);
        return [];
      }
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('features', JSON.stringify(value));
      } else if (typeof value === 'string') {
        // Проверка, является ли значение уже JSON-строкой
        try {
          JSON.parse(value);
          this.setDataValue('features', value);
        } catch (e) {
          // Если нет, преобразуем в JSON-строку
          this.setDataValue('features', JSON.stringify([value]));
        }
      } else {
        this.setDataValue('features', JSON.stringify([]));
      }
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'sport',
  },
  maxSpeed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Maximum speed in km/h"
  },
  specialSeries: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Special edition name"
  },
  exteriorColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interiorColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interiorMaterial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  wheels: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rentalAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rentalPricePerDay: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  testDriveAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  driveType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  carbonCeramic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  carLocation: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Where car is physically located"
  },
  certificateOfAuthenticity: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'available',
  }
}, {
  timestamps: true,
  hooks: {
    beforeValidate: (car) => {
      if (!car.images) {
        car.images = [];
      } else if (typeof car.images === 'string') {
        try {
          car.images = JSON.parse(car.images);
          if (!Array.isArray(car.images)) {
            car.images = [car.images];
          }
        } catch (e) {
          car.images = [car.images];
        }
      } else if (!Array.isArray(car.images)) {
        car.images = [];
      }
      
      if (!car.features) {
        car.features = [];
      } else if (typeof car.features === 'string') {
        try {
          car.features = JSON.parse(car.features);
          if (!Array.isArray(car.features)) {
            car.features = [car.features];
          }
        } catch (e) {
          car.features = [car.features];
        }
      } else if (!Array.isArray(car.features)) {
        car.features = [];
      }
    }
  }
});

module.exports = Car;