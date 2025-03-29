const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TestDrive = sequelize.define('TestDrive', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  carId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: "Duration in minutes"
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preferredRoute: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  assignedManager: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
}, {
  timestamps: true,
});

module.exports = TestDrive;