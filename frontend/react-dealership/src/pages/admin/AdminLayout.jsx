import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import AdminNavbar from '../../components/AdminNavbar';

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Проверяем авторизацию и права доступа
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Проверяем права администратора
  if (user.role !== 'admin' && user.role !== 'manager') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(to bottom, #121212, #1E1E1E)',
      }}
    >
      <AdminNavbar />
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default AdminLayout; 