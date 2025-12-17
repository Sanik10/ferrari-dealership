import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Добавление токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Обработка истечения срока JWT
    if (error.response && error.response.status === 401) {
      // Перенаправление на страницу логина, если токен истек
      if (error.response.data.message === 'Срок действия токена истек') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Создание FormData из объекта
const createFormData = (data) => {
    const formData = new FormData();
    
    // Обрабатываем обычные поля
    Object.keys(data).forEach(key => {
        if (
            key !== 'images' && 
            key !== 'features' && 
            key !== 'existingImages' && 
            key !== 'carPreferences' &&
            key !== 'additionalServices'
        ) {
            // Проверяем тип данных и преобразуем его в строку при необходимости
            if (data[key] !== undefined && data[key] !== null) {
                if (typeof data[key] === 'boolean') {
                    formData.append(key, data[key].toString());
                } else if (typeof data[key] === 'number') {
                    formData.append(key, data[key].toString());
                } else if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                    // Для объектов преобразуем в JSON-строку
                    formData.append(key, JSON.stringify(data[key]));
                } else {
        formData.append(key, data[key]);
                }
            }
        }
    });
    
    // Обрабатываем массивы строк
    ['features', 'existingImages', 'carPreferences', 'additionalServices'].forEach(arrayField => {
        if (data[arrayField] && Array.isArray(data[arrayField]) && data[arrayField].length > 0) {
            data[arrayField].forEach(item => {
                formData.append(arrayField, item);
            });
        }
    });
  
    // Обрабатываем файлы
    if (data.images && data.images.length > 0) {
        // Проверяем, что это реальные файлы, а не строки URL
      data.images.forEach(image => {
            if (image instanceof File || image instanceof Blob) {
        formData.append('images', image);
            }
        });
    }
    
    // Логируем состав FormData для отладки
    console.log("FormData содержит поля:");
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${typeof pair[1] === 'object' ? 'File/Blob' : pair[1]}`);
    }
    
    return formData;
};

// Экспортируем api и вспомогательные методы
export const coreAPI = api;
export const apiUtils = {
  createFormData,
  API_URL
};

// Аутентификация
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// Пользователи
export const userAPI = {
  getCurrentUser: () => api.get('/users/profile'),
  getUserById: (id) => api.get(`/users/${id}`),
  getUsers: (params) => api.get('/users', { params }),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  addUser: (userData) => api.post('/users', userData),
  toggleVipStatus: (id) => api.post(`/users/${id}/toggle-vip`),
  getOrderHistory: (id) => api.get(`/users/${id}/orders`),
  getServiceHistory: (id) => api.get(`/users/${id}/services`),
  getUserEvents: (id) => api.get(`/users/${id}/events`),
  addCarPreference: (preference) => api.post('/users/preferences', { preference }),
  removeCarPreference: (preference) => api.delete('/users/preferences', { data: { preference } }),
  updateNotificationSettings: (settings) => api.put('/users/notification-settings', settings),
  getUserCars: () => api.get('/users/cars'),
};

// Автомобили
export const carAPI = {
  getAllCars: (params) => api.get('/cars', { params }),
  getCar: (id) => api.get(`/cars/${id}`),
  
  createCar: (data) => {
    console.log("=== 🚗 НАЧАЛО API: createCar ===");
    console.log("Тип данных:", data instanceof FormData ? "FormData" : typeof data);
    
    // Если данные не в формате FormData, создаем его
    const formData = data instanceof FormData ? data : createFormData(data);
    
    // Проверяем содержимое FormData перед отправкой
    console.log("Содержимое FormData:");
    
    let hasFiles = false;
    const entries = [];
    
    // Логируем содержимое FormData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        hasFiles = true;
        entries.push(`${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        entries.push(`${key}: ${value}`);
      }
    }
    
    // Выводим в консоль содержимое FormData
    console.log("Данные для отправки:");
    entries.forEach(entry => console.log(entry));
    console.log(`FormData содержит файлы: ${hasFiles}`);
    
    // Настройка запроса с отслеживанием прогресса загрузки
    const config = {
      headers: {
        // Не указываем Content-Type для FormData с файлами
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Прогресс загрузки: ${percentCompleted}%`);
      }
    };
    
    // Отправка запроса
    console.log("Отправка запроса на: POST /api/cars");
    return api.post('/cars', formData, config)
      .then(response => {
        console.log("✅ Успешный ответ, статус:", response.status);
        console.log("=== 🚗 КОНЕЦ API: createCar ===");
        return response.data;
      })
      .catch(error => {
        console.error("❌ ОШИБКА в createCar:", error);
        console.error("Статус:", error.response?.status);
        console.error("Данные ошибки:", error.response?.data);
        console.log("=== ❌ ОШИБКА API: createCar ===");
        throw error;
      });
  },
  
  updateCar: (id, data) => {
    console.log(`=== 🔄 НАЧАЛО API: updateCar(${id}) ===`);
    console.log("Тип данных:", data instanceof FormData ? "FormData" : typeof data);
    
    // Если данные не в формате FormData, создаем его
    const formData = data instanceof FormData ? data : createFormData(data);
    
    // Проверяем содержимое FormData перед отправкой
    console.log(`updateCar(${id}) данные для отправки:`);
    let hasFiles = false;
    const entries = [];
    
    // Логируем содержимое FormData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        hasFiles = true;
        entries.push(`${key}: File(${value.name}, ${value.type || value.mimetype}, ${value.size} bytes)`);
      } else {
        entries.push(`${key}: ${value}`);
      }
    }
    
    console.log("Содержимое FormData:");
    entries.forEach(entry => console.log(entry));
    console.log(`updateCar(${id}) содержит файлы: ${hasFiles}`);
    
    // Настройка запроса с отслеживанием прогресса загрузки
    const config = {
      headers: {
        // Не указываем Content-Type для FormData с файлами
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Прогресс загрузки: ${percentCompleted}%`);
      }
    };
    
    // Отправка запроса
    console.log(`Отправка запроса на: PUT /api/cars/${id}`);
    return api.put(`/cars/${id}`, formData, config)
      .then(response => {
        console.log("✅ Успешный ответ, статус:", response.status);
        console.log(`=== 🔄 КОНЕЦ API: updateCar(${id}) ===`);
        return response.data;
      })
      .catch(error => {
        console.error(`❌ ОШИБКА в updateCar(${id}):`, error);
        console.error("Статус:", error.response?.status);
        console.error("Данные ошибки:", error.response?.data);
        console.log(`=== ❌ ОШИБКА API: updateCar(${id}) ===`);
        throw error;
      });
  },
  
  deleteCar: (id) => api.delete(`/cars/${id}`),
  
  uploadImages: (id, images) => {
    console.log(`=== 📷 НАЧАЛО API: uploadImages(${id}) ===`);
    console.log(`Загрузка ${images instanceof FormData ? 'FormData с изображениями' : images.length + ' изображений'}`);
    
    // Если передан не FormData, а массив файлов, создаем FormData
    let formData;
    if (images instanceof FormData) {
      formData = images;
      
      // Логируем содержимое FormData
      console.log("Содержимое FormData:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`Добавлен файл[${key}]: ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    } else {
      formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
        console.log(`Добавлен файл[images]: ${image.name} (${image.size} bytes, ${image.type})`);
      });
    }
    
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Прогресс загрузки: ${percentCompleted}%`);
      }
    };
    
    return api.post(`/cars/${id}/images`, formData, config)
      .then(response => {
        console.log("✅ Успешный ответ, статус:", response.status);
        console.log(`=== 📷 КОНЕЦ API: uploadImages(${id}) ===`);
        return response.data;
      })
      .catch(error => {
        console.error(`❌ ОШИБКА в uploadImages(${id}):`, error);
        console.error("Статус:", error.response?.status);
        console.error("Данные ошибки:", error.response?.data);
        console.log(`=== ❌ ОШИБКА API: uploadImages(${id}) ===`);
        throw error;
      });
  },
  
  searchCars: (query) => api.get('/cars/search', { params: { q: query } }),
  getRentalCars: () => api.get('/cars/rental-available'),
  getTestDriveCars: () => api.get('/cars/test-drive-available'),
  getCarByModel: (model) => api.get(`/cars/model/${model}`),
  deleteImage: (id, imageUrl) => api.delete(`/cars/${id}/images`, { data: { imageUrl } }),
  setMainImage: (id, mainImage) => api.post(`/cars/${id}/main-image`, { mainImage }),
  getCarFeatures: () => api.get('/cars/features'),
  getCarColors: () => api.get('/cars/colors'),
};

// Заказы
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params) => api.get('/orders', { params }),
  getUserOrders: (userId) => api.get(`/users/${userId}/orders`),
  getMyOrders: () => api.get('/orders/my'),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  getOrderStatuses: () => api.get('/orders/statuses'),
  getPaymentMethods: () => api.get('/orders/payment-methods'),
  addPayment: (orderId, paymentData) => api.post(`/orders/${orderId}/payments`, paymentData),
  getOrderPayments: (orderId) => api.get(`/orders/${orderId}/payments`),
};

// Тест-драйвы
export const testDriveAPI = {
  createTestDrive: (data) => api.post('/test-drives', data),
  getTestDrives: (params) => api.get('/test-drives', { params }),
  getMyTestDrives: () => api.get('/test-drives/my'),
  getTestDrive: (id) => api.get(`/test-drives/${id}`),
  updateTestDrive: (id, data) => api.put(`/test-drives/${id}`, data),
  updateTestDriveStatus: (id, status) => api.put(`/test-drives/${id}/status`, { status }),
  deleteTestDrive: (id) => api.delete(`/test-drives/${id}`),
  getAvailableTimes: (date, carId) => api.get('/test-drives/available-times', { params: { date, carId } }),
  getEventAttendees: (id) => api.get(`/test-drives/${id}/attendees`),
  addFeedback: (id, feedbackData) => api.post(`/test-drives/${id}/feedback`, feedbackData),
  getFeedback: (id) => api.get(`/test-drives/${id}/feedback`),
};

// Контакты (обратная связь)
export const contactAPI = {
  createContact: (data) => api.post('/contacts', data),
  getContacts: (params) => api.get('/contacts', { params }),
  getContact: (id) => api.get(`/contacts/${id}`),
  updateContact: (id, data) => api.put(`/contacts/${id}`, data),
  updateContactStatus: (id, status) => api.put(`/contacts/${id}/status`, { status }),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
  respondToContact: (id, response) => api.post(`/contacts/${id}/respond`, { response }),
};

// Сервисное обслуживание
export const serviceAPI = {
  createAppointment: (data) => api.post('/service', data),
  getAppointments: (params) => api.get('/service', { params }),
  getUserServices: (userId) => api.get(`/users/${userId}/services`),
  getMyAppointments: () => api.get('/service/my'),
  getAppointment: (id) => api.get(`/service/${id}`),
  updateAppointment: (id, data) => api.put(`/service/${id}`, data),
  updateAppointmentStatus: (id, status) => api.put(`/service/${id}/status`, { status }),
  deleteAppointment: (id) => api.delete(`/service/${id}`),
  getAvailableSlots: (date) => api.get('/service/available-slots', { params: { date } }),
  getServiceTypes: () => api.get('/service/types'),
  updatePartsReplaced: (id, partsReplaced) => api.put(`/service/${id}/parts`, { partsReplaced }),
  addServiceNote: (id, note) => api.post(`/service/${id}/notes`, { note }),
  getServiceNotes: (id) => api.get(`/service/${id}/notes`),
};

// Мероприятия
export const eventAPI = {
  getEvents: (params) => api.get('/events', { params }),
  getVipEvents: () => api.get('/events/vip'),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => {
    const formData = data instanceof FormData ? data : createFormData(data);
    return api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateEvent: (id, data) => {
    const formData = data instanceof FormData ? data : createFormData(data);
    return api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteEvent: (id) => api.delete(`/events/${id}`),
  updateEventStatus: (id, status) => api.put(`/events/${id}/status`, { status }),
  getEventRegistrations: (id) => api.get(`/events/${id}/registrations`),
  getEventAttendees: (id) => api.get(`/events/${id}/attendees`),
  uploadEventImage: (id, image) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.post(`/events/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Регистрация на мероприятия
  registerForEvent: (eventId, data) => api.post(`/events/${eventId}/register`, data),
  cancelRegistration: (eventId) => api.post(`/events/${eventId}/cancel`),
  getMyRegistrations: () => api.get('/events/registrations/my'),
  updateRegistrationStatus: (id, status) => api.put(`/events/registrations/${id}/status`, { status }),
  
  // Типы мероприятий
  getEventTypes: () => api.get('/events/types'),
};

// Статистика
export const statsAPI = {
  getSalesStats: (period) => api.get('/stats/sales', { params: { period } }),
  getTestDriveStats: (period) => api.get('/stats/test-drives', { params: { period } }),
  getServiceStats: (period) => api.get('/stats/service', { params: { period } }),
  getUserStats: () => api.get('/stats/users'),
  getPopularModels: () => api.get('/stats/popular-models'),
  getDashboardSummary: () => api.get('/stats/dashboard'),
};

// Отзывы
export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getReviews: (params) => api.get('/reviews', { params }),
  getReview: (id) => api.get(`/reviews/${id}`),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  approveReview: (id) => api.put(`/reviews/${id}/approve`),
  rejectReview: (id) => api.put(`/reviews/${id}/reject`),
  getMyReviews: () => api.get('/reviews/my'),
};

// Уведомления
export const notificationAPI = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// VIP услуги
export const vipAPI = {
  getVipServices: () => api.get('/vip/services'),
  submitVipRequest: (requestData) => api.post('/vip/requests', requestData),
  getUserVipStatus: (userId) => api.get(`/vip/status/${userId}`),
  updateVipStatus: (userId, statusData) => api.put(`/vip/status/${userId}`, statusData),
  getVipEvents: () => api.get('/vip/events'),
  registerForVipEvent: (eventId, registrationData) => api.post(`/vip/events/${eventId}/register`, registrationData),
};

// Объединенный объект всех API
const combinedAPI = {
  coreAPI,
  apiUtils,
  authAPI,
  userAPI,
  carAPI,
  orderAPI,
  testDriveAPI,
  contactAPI,
  serviceAPI,
  eventAPI,
  statsAPI,
  reviewAPI,
  notificationAPI,
  vipAPI
};

// Экспортируем объединенный объект по умолчанию
export default combinedAPI; 