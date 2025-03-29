const sequelize = require('../db');
const { Sequelize, Op } = require('sequelize');
const User = require('./user');
const Car = require('./car');
const Order = require('./order');
const TestDrive = require('./testDrive');
const Contact = require('./contact');
const ServiceAppointment = require('./serviceAppointment');
const Event = require('./event');
const EventRegistration = require('./eventRegistration');


const createEnumTypes = async () => {
  try {
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
          CREATE TYPE "enum_users_role" AS ENUM ('user', 'manager', 'admin');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_orders_status') THEN
          CREATE TYPE "enum_orders_status" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_orders_paymentmethod') THEN
          CREATE TYPE "enum_orders_paymentmethod" AS ENUM ('cash', 'card', 'bank_transfer');
        END IF;
        
        // Новые ENUM типы
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_orders_ordertype') THEN
          CREATE TYPE "enum_orders_ordertype" AS ENUM ('purchase', 'rental', 'reservation');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cars_category') THEN
          CREATE TYPE "enum_cars_category" AS ENUM ('sport', 'gt', 'hypercar', 'classic', 'limited_edition');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_preferredcontactmethod') THEN
          CREATE TYPE "enum_users_preferredcontactmethod" AS ENUM ('email', 'phone', 'whatsapp', 'telegram');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_testdrives_status') THEN
          CREATE TYPE "enum_testdrives_status" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_contacts_status') THEN
          CREATE TYPE "enum_contacts_status" AS ENUM ('new', 'in_progress', 'responded', 'closed');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_serviceappointments_servicetype') THEN
          CREATE TYPE "enum_serviceappointments_servicetype" AS ENUM ('regular_maintenance', 'repair', 'warranty', 'inspection', 'detailing', 'customization');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_serviceappointments_status') THEN
          CREATE TYPE "enum_serviceappointments_status" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_events_eventtype') THEN
          CREATE TYPE "enum_events_eventtype" AS ENUM ('car_launch', 'track_day', 'gala_dinner', 'exhibition', 'vip_tour', 'driving_experience');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_events_status') THEN
          CREATE TYPE "enum_events_status" AS ENUM ('upcoming', 'in_progress', 'completed', 'cancelled');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_eventregistrations_status') THEN
          CREATE TYPE "enum_eventregistrations_status" AS ENUM ('registered', 'attended', 'cancelled');
        END IF;
      END
      $$;
    `);
    console.log('PostgreSQL enum types created or already exist');
  } catch (error) {
    console.error('Error creating enum types:', error);
  }
};


const syncDatabase = async (force = false) => {
  try {
    // await createEnumTypes();
    
    // force: true - удаляет все таблицы и создает их заново
    // alter: true - вносит изменения в таблицы, сохраняя данные
    // При force: true мы полностью пересоздаем базу данных
    const options = { force: false };
    
    await sequelize.sync(options);
    
    console.log('Database reset and recreated successfully');
    
    return true;
  } catch (error) {
    console.error('Error synchronizing database:', error);
    return false;
  }
};

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Car.hasMany(Order, { foreignKey: 'carId' });
Order.belongsTo(Car, { foreignKey: 'carId' });

User.hasMany(TestDrive, { foreignKey: 'userId' });
TestDrive.belongsTo(User, { foreignKey: 'userId' });

Car.hasMany(TestDrive, { foreignKey: 'carId' });
TestDrive.belongsTo(Car, { foreignKey: 'carId' });

User.hasMany(ServiceAppointment, { foreignKey: 'userId' });
ServiceAppointment.belongsTo(User, { foreignKey: 'userId' });

Car.hasMany(ServiceAppointment, { foreignKey: 'carId' });
ServiceAppointment.belongsTo(Car, { foreignKey: 'carId' });

User.hasMany(EventRegistration, { foreignKey: 'userId' });
EventRegistration.belongsTo(User, { foreignKey: 'userId' });

Event.hasMany(EventRegistration, { foreignKey: 'eventId' });
EventRegistration.belongsTo(Event, { foreignKey: 'eventId' });

// Синхронизируем с базой данных
console.log("Синхронизация моделей с базой данных...");
// Для разработки можно использовать { force: true } чтобы пересоздать таблицы,
// но для продакшена нужно использовать { alter: true } или просто sync()
// Убираем автоматическую синхронизацию, так как она выполняется в app.js
/*
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Все модели успешно синхронизированы с базой данных.");
  })
  .catch(err => {
    console.error("Ошибка при синхронизации с базой данных:", err);
  });
*/

module.exports = {
  sequelize,
  Sequelize,
  Op,
  syncDatabase,
  User,
  Car,
  Order,
  TestDrive,
  Contact,
  ServiceAppointment,
  Event,
  EventRegistration
};