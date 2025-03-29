import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';

// Создаем контекст авторизации
export const AuthContext = createContext(null);

// Хук для использования контекста авторизации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Провайдер авторизации
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Пытаемся загрузить данные текущего пользователя
          const response = await userAPI.getCurrentUser();
          setCurrentUser(response.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Error loading user:', err);
          // Если токен недействителен, очищаем локальное хранилище
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Авторизация пользователя
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Ошибка при входе. Пожалуйста, попробуйте снова.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Регистрация нового пользователя
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Ошибка при регистрации. Пожалуйста, попробуйте снова.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Выход из системы
  const logout = (callback) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Вместо прямой навигации используем callback, если он предоставлен
    if (callback && typeof callback === 'function') {
      callback();
    }
  };

  // Обновление данных пользователя
  const updateUserProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userAPI.updateUser(currentUser.id, userData);
      const updatedUser = response.data;
      
      // Обновляем данные пользователя в localStorage и состоянии
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setLoading(false);
      return { success: true, user: updatedUser };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Ошибка при обновлении профиля. Пожалуйста, попробуйте снова.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Изменение пароля
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.changePassword(passwordData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Ошибка при изменении пароля. Пожалуйста, попробуйте снова.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Проверка, является ли пользователь администратором
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  // Проверка, является ли пользователь менеджером
  const isManager = () => {
    return currentUser?.role === 'manager' || currentUser?.role === 'admin';
  };

  // Проверка, является ли пользователь VIP-клиентом
  const isVIP = () => {
    return currentUser?.vipStatus === true;
  };

  // Обновляем данные пользователя после внешних изменений (например, после изменения профиля)
  const refreshUserData = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error('Error refreshing user data:', err);
      return { success: false, error: 'Не удалось обновить данные пользователя' };
    }
  };

  // Добавление предпочтений по моделям автомобилей
  const addCarPreference = async (preference) => {
    try {
      await userAPI.addCarPreference(preference);
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
      await userAPI.removeCarPreference(preference);
      // Обновляем данные пользователя
      return await refreshUserData();
    } catch (err) {
      console.error('Error removing car preference:', err);
      return { success: false, error: 'Не удалось удалить предпочтение' };
    }
  };

  // Значение контекста, которое будет доступно потребителям
  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
    changePassword,
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