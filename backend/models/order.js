const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Car = require('./car');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'bank_transfer'),
    allowNull: false,
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  orderType: {
    type: DataTypes.ENUM('purchase', 'rental', 'reservation'),
    allowNull: false,
    defaultValue: 'purchase',
  },
  rentalStartDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rentalEndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reservationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  includeDelivery: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  insuranceIncluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  additionalServices: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contractNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Car, { foreignKey: 'carId' });

module.exports = Order;