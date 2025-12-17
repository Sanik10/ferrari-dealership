// Базовый URL API
export const API_URL = import.meta.env.PROD 
  ? 'https://ferrari-dealership-api.example.com'  
  : 'http://localhost:5001'; // Используем порт 5001 без /api в конце

// Константы для настройки приложения
export const APP_NAME = 'Ferrari Moscow';
export const CURRENCY = '₽';

// Конфигурация изображений
export const DEFAULT_AVATAR = '/images/ferrari-logo.png';
export const DEFAULT_CAR_IMAGE = '/images/car-placeholder.jpg';

// Параметры пагинации
export const ITEMS_PER_PAGE = 9;
export const ADMIN_ITEMS_PER_PAGE = 10; 