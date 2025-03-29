import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [], vipOnly, adminOnly }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Отладочная информация
  console.log("ProtectedRoute - Параметры:", { allowedRoles, vipOnly, adminOnly });
  console.log("ProtectedRoute - Пользователь:", user);
  console.log("ProtectedRoute - Роль пользователя:", user?.role);
  console.log("ProtectedRoute - Админ или менеджер:", user?.role === 'admin' || user?.role === 'manager');
  
  // Если пользователь не авторизован
  if (!user) {
    console.log("ProtectedRoute - Перенаправление: пользователь не авторизован");
    return <Navigate to="/" replace />;
  }
  
  // Проверка роли, если указаны разрешенные роли
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log("ProtectedRoute - Перенаправление: роль не соответствует разрешенным");
    return <Navigate to="/" replace />;
  }
  
  // Проверка для VIP маршрутов
  if (vipOnly && !user.vipStatus) {
    console.log("ProtectedRoute - Перенаправление: требуется VIP статус");
    return <Navigate to="/" replace />;
  }
  
  // Проверка для админ маршрутов
  if (adminOnly && user.role !== 'admin' && user.role !== 'manager') {
    console.log("ProtectedRoute - Перенаправление: требуются права администратора или менеджера");
    return <Navigate to="/" replace />;
  }
  
  console.log("ProtectedRoute - Доступ разрешен");
  
  // Для случая, когда children передается явно
  if (children) {
    return children;
  }
  
  // Для вложенных маршрутов, использующих Outlet
  return <Outlet />;
};

export default ProtectedRoute; 