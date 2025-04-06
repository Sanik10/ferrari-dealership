import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

// Создаем контекст авторизации
const AuthContext = createContext(null);

// Хук для использования контекста авторизации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

// Провайдер авторизации
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // Используем данные из localStorage вместо запроса к API
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
          console.log('Данные пользователя загружены из localStorage:', JSON.parse(userData));
        } catch (error) {
          console.error('Ошибка при обработке данных пользователя:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Функция авторизации
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Используем существующий маршрут для входа
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      
      // Сохраняем токен и информацию о пользователе
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Устанавливаем состояние пользователя
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      setError(error.response?.data?.message || 'Ошибка входа');
      return { success: false, error: error.response?.data?.message || 'Ошибка входа' };
    } finally {
      setLoading(false);
    }
  };

  // Функция регистрации
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      setError(error.response?.data?.message || 'Ошибка регистрации');
      return { success: false, error: error.response?.data?.message || 'Ошибка регистрации' };
    } finally {
      setLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Обновление данных пользователя
  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/profile`, userData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      // Обновляем данные пользователя
      const updatedUser = response.data.user || response.data;
      
      // Сохраняем обновленные данные в localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Обновляем состояние
      setUser(updatedUser);
      
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Ошибка обновления профиля' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Проверка, является ли пользователь администратором
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Проверка, является ли пользователь менеджером
  const isManager = () => {
    return user?.role === 'manager' || user?.role === 'admin';
  };

  // Проверка, является ли пользователь VIP-клиентом
  const isVIP = () => {
    return user?.vipStatus === true;
  };

  // Обновляем данные пользователя после внешних изменений (например, после изменения профиля)
  const refreshUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error('Error refreshing user data:', err);
      return { success: false, error: 'Не удалось обновить данные пользователя' };
    }
  };

  // Добавление предпочтений по моделям автомобилей
  const addCarPreference = async (preference) => {
    try {
      await axios.post(`${API_URL}/users/preferences`, { preference }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Обновляем данные пользователя
      return await refreshUserData();
    } catch (err) {
      console.error('Error adding car preference:', err);
      return { success: false, error: 'Не удалось добавить предпочтение' };
    }
  };

  // Удаление предпочтений по моделям автомобилей
  const removeCarPreference = async (preference) => {
    try {
      await axios.delete(`${API_URL}/users/preferences/${preference}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Обновляем данные пользователя
      return await refreshUserData();
    } catch (err) {
      console.error('Error removing car preference:', err);
      return { success: false, error: 'Не удалось удалить предпочтение' };
    }
  };

  // Значение контекста, которое будет доступно потребителям
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    isAdmin,
    isManager,
    isVIP,
    refreshUserData,
    addCarPreference,
    removeCarPreference
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;