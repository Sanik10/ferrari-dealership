const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    message: 'Ferrari Moscow API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      cars: '/api/cars',
      orders: '/api/orders',
      testDrives: '/api/test-drives',
      contacts: '/api/contacts',
      serviceAppointments: '/api/service',
      events: '/api/events',
      reviews: '/api/reviews'
    }
  });
});

module.exports = router;