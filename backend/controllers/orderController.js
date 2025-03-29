const orderService = require('../services/orderService');

class OrderController {
  constructor() {
    this.createOrder = this.createOrder.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
    this.getMyOrders = this.getMyOrders.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
  }

  async createOrder(req, res) {
    try {
      const orderData = {
        carId: req.body.carId,
        totalAmount: req.body.totalAmount,
        paymentMethod: req.body.paymentMethod,
        orderType: req.body.orderType,
        deliveryDate: req.body.deliveryDate,
        rentalStartDate: req.body.rentalStartDate,
        rentalEndDate: req.body.rentalEndDate,
        reservationDate: req.body.reservationDate,
        includeDelivery: req.body.includeDelivery,
        deliveryAddress: req.body.deliveryAddress,
        insuranceIncluded: req.body.insuranceIncluded,
        additionalServices: req.body.additionalServices,
        specialRequests: req.body.specialRequests,
        contractNumber: req.body.contractNumber
      };
      
      // Проверяем наличие обязательных полей
      if (!orderData.carId || !orderData.totalAmount || !orderData.paymentMethod || !orderData.orderType) {
        return res.status(400).json({ 
          error: "Все обязательные поля должны быть заполнены (carId, totalAmount, paymentMethod, orderType)" 
        });
      }
      
      // Проверяем тип заказа и наличие соответствующих полей
      if (orderData.orderType === 'rental' && (!orderData.rentalStartDate || !orderData.rentalEndDate)) {
        return res.status(400).json({ 
          error: "Для аренды необходимо указать даты начала и окончания" 
        });
      }
      
      if (orderData.orderType === 'reservation' && !orderData.reservationDate) {
        return res.status(400).json({ 
          error: "Для бронирования необходимо указать дату" 
        });
      }
      
      const order = await orderService.createOrder(req.user.id, orderData);
      
      res.status(201).json({
        message: "Заказ успешно создан",
        order
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Статус не указан" });
      }
      
      const order = await orderService.updateOrderStatus(req.params.id, status);
      
      res.json({
        message: `Статус заказа изменен на ${status}`,
        order
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await orderService.getOrdersByUserId(req.user.id);
      res.json(orders);
    } catch (error) {
      console.error('Get my orders error:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders(req.query);
      res.json(orders);
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      
      // Проверяем права доступа: пользователь может видеть только свои заказы
      if (req.user.role === 'user' && order.userId != req.user.id) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Get order error:', error);
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();