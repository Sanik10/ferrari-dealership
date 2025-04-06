import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], adminOnly, vipOnly }) => {
  const { user, isAuthenticated } = useAuth();
  
  console.log("ProtectedRoute - Параметры:", { allowedRoles, vipOnly, adminOnly });
  console.log("ProtectedRoute - Пользователь:", user);
  
  // Получаем актуальные данные пользователя с учетом возможной вложенности
  const userData = user?.user || user;
  const userRole = userData?.role;
  
  console.log("ProtectedRoute - Роль пользователя:", userRole);
  
  // Проверяем, является ли пользователь администратором или менеджером
  const isAdminOrManager = userRole === 'admin' || userRole === 'manager';
  console.log("ProtectedRoute - Админ или менеджер:", isAdminOrManager);
  
  // Проверяем, имеет ли пользователь VIP-статус
  const isVIP = userData?.isVIP === true;
  console.log("ProtectedRoute - VIP-статус:", isVIP);

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Доступ запрещен: не авторизован");
    return <Navigate to="/login" replace />;
  }

  // Если требуется роль админа, проверяем наличие соответствующих прав
  if (adminOnly && !isAdminOrManager) {
    console.log("ProtectedRoute - Доступ запрещен: требуются права администратора");
    return <Navigate to="/" replace />;
  }

  // Если требуется VIP-статус, проверяем его наличие
  if (vipOnly && !isVIP) {
    console.log("ProtectedRoute - Доступ запрещен: требуется VIP-статус");
    return <Navigate to="/" replace />;
  }

  // Если указаны конкретные роли, проверяем наличие роли пользователя в списке
  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    console.log("ProtectedRoute - Доступ запрещен: недостаточно прав");
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute - Доступ разрешен");
  return children;
};

export default ProtectedRoute; 