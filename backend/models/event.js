const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  registeredCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  eventType: {
    type: DataTypes.ENUM('car_launch', 'track_day', 'gala_dinner', 'exhibition', 'vip_tour', 'driving_experience'),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vipOnly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  registrationDeadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'upcoming',
  },
}, {
  timestamps: true,
});

module.exports = Event; 