const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EventRegistration = sequelize.define('EventRegistration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  registrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('registered', 'attended', 'cancelled'),
    defaultValue: 'registered',
  },
  guestCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = EventRegistration; 