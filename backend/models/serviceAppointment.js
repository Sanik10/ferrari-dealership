const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ServiceAppointment = sequelize.define('ServiceAppointment', {
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
    allowNull: true,
  },
  customerCarInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "For customers bringing their own Ferrari"
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  serviceType: {
    type: DataTypes.ENUM('regular_maintenance', 'repair', 'warranty', 'inspection', 'detailing', 'customization'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  finalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  technicianNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  partsReplaced: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = ServiceAppointment; 