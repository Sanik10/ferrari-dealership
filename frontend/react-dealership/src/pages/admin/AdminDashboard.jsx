import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsCar as CarsIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Event as EventsIcon,
  TimeToLeave as TestDrivesIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Стили для активного элемента навигации
const activeNavItemStyle = {
  backgroundColor: 'rgba(255, 40, 0, 0.1)',
  borderLeft: '4px solid #FF2800',
  '&:hover': {
    backgroundColor: 'rgba(255, 40, 0, 0.15)',
  }
};

// Основной компонент админ-панели
const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({
    cars: 0,
    orders: 0,
    users: 0,
    events: 0,
    testDrives: 0
  });

  // Загрузка реальных данных статистики
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return; // Не загружаем данные, если нет прав
    }
    
    const loadStats = async () => {
      try {
        // Здесь в будущем можно добавить реальные запросы к API
        // const response = await axios.get(`${API_URL}/admin/stats`);
        // setStats(response.data);
        
        // Временно загружаем тестовые данные из localStorage или используем нули
        const storedStats = localStorage.getItem('adminStats');
        if (storedStats) {
          try {
            setStats(JSON.parse(storedStats));
          } catch (e) {
            console.error('Ошибка парсинга данных статистики:', e);
            // Если не удалось разобрать данные, устанавливаем нули
            setStats({
              cars: 0,
              orders: 0,
              users: 0,
              events: 0,
              testDrives: 0
            });
          }
        }
        
        console.log('Статистика загружена');
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
    };
    
    loadStats();
  }, [user, setStats]);

  // Проверка активного раздела
  const isActive = (path) => location.pathname === path;

  // Проверяем права доступа
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(to bottom, #121212, #1E1E1E)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            color: 'white',
            fontWeight: 'bold',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}
        >
          Панель администратора Ferrari Moscow
        </Typography>

        <Grid container spacing={3}>
          {/* Боковая панель навигации */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'rgba(18, 18, 18, 0.6)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                position: 'relative',
              }}
            >
              <List component="nav" aria-label="admin navigation">
                <ListItem
                  button
                  component={Link}
                  to="/admin/cars"
                  sx={isActive('/admin/cars') ? activeNavItemStyle : {}}
                >
                  <ListItemIcon>
                    <CarsIcon sx={{ color: '#FF2800' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Автомобили"
                    primaryTypographyProps={{ sx: { color: 'white' } }}
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />

                <ListItem
                  button
                  component={Link}
                  to="/admin/orders"
                  sx={isActive('/admin/orders') ? activeNavItemStyle : {}}
                >
                  <ListItemIcon>
                    <OrdersIcon sx={{ color: '#FF2800' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Заказы"
                    primaryTypographyProps={{ sx: { color: 'white' } }}
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />

                <ListItem
                  button
                  component={Link}
                  to="/admin/users"
                  sx={isActive('/admin/users') ? activeNavItemStyle : {}}
                >
                  <ListItemIcon>
                    <UsersIcon sx={{ color: '#FF2800' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Пользователи"
                    primaryTypographyProps={{ sx: { color: 'white' } }}
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />

                <ListItem
                  button
                  component={Link}
                  to="/admin/events"
                  sx={isActive('/admin/events') ? activeNavItemStyle : {}}
                >
                  <ListItemIcon>
                    <EventsIcon sx={{ color: '#FF2800' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="События"
                    primaryTypographyProps={{ sx: { color: 'white' } }}
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />

                <ListItem
                  button
                  component={Link}
                  to="/admin/test-drives"
                  sx={isActive('/admin/test-drives') ? activeNavItemStyle : {}}
                >
                  <ListItemIcon>
                    <TestDrivesIcon sx={{ color: '#FF2800' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Тест-драйвы"
                    primaryTypographyProps={{ sx: { color: 'white' } }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Основное содержимое - статистика и ярлыки */}
          <Grid item xs={12} md={9}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '16px',
                p: 3,
                backgroundColor: 'rgba(18, 18, 18, 0.6)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                minHeight: '500px'
              }}
            >
              <Typography variant="h5" sx={{ mb: 4, color: 'white', fontWeight: 'bold' }}>
                Обзор системы
              </Typography>

              {/* Статистические карточки */}
              <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CarsIcon sx={{ color: '#FF2800', mr: 1, fontSize: 32 }} />
                        <Typography variant="h6" sx={{ color: 'white' }}>Автомобили</Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {stats.cars}
                      </Typography>
                      <Button 
                        component={Link} 
                        to="/admin/cars"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          mt: 2, 
                          color: '#FF2800',
                          '&:hover': { backgroundColor: 'rgba(255, 40, 0, 0.05)' }
                        }}
                      >
                        Управление
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <OrdersIcon sx={{ color: '#FF2800', mr: 1, fontSize: 32 }} />
                        <Typography variant="h6" sx={{ color: 'white' }}>Заказы</Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {stats.orders}
                      </Typography>
                      <Button 
                        component={Link} 
                        to="/admin/orders"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          mt: 2, 
                          color: '#FF2800',
                          '&:hover': { backgroundColor: 'rgba(255, 40, 0, 0.05)' }
                        }}
                      >
                        Управление
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <UsersIcon sx={{ color: '#FF2800', mr: 1, fontSize: 32 }} />
                        <Typography variant="h6" sx={{ color: 'white' }}>Пользователи</Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {stats.users}
                      </Typography>
                      <Button 
                        component={Link} 
                        to="/admin/users"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          mt: 2, 
                          color: '#FF2800',
                          '&:hover': { backgroundColor: 'rgba(255, 40, 0, 0.05)' }
                        }}
                      >
                        Управление
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Card 
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EventsIcon sx={{ color: '#FF2800', mr: 1, fontSize: 32 }} />
                        <Typography variant="h6" sx={{ color: 'white' }}>События</Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {stats.events}
                      </Typography>
                      <Button 
                        component={Link} 
                        to="/admin/events"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          mt: 2, 
                          color: '#FF2800',
                          '&:hover': { backgroundColor: 'rgba(255, 40, 0, 0.05)' }
                        }}
                      >
                        Управление
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Card 
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TestDrivesIcon sx={{ color: '#FF2800', mr: 1, fontSize: 32 }} />
                        <Typography variant="h6" sx={{ color: 'white' }}>Тест-драйвы</Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {stats.testDrives}
                      </Typography>
                      <Button 
                        component={Link} 
                        to="/admin/test-drives"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          mt: 2, 
                          color: '#FF2800',
                          '&:hover': { backgroundColor: 'rgba(255, 40, 0, 0.05)' }
                        }}
                      >
                        Управление
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Информация о системе */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Добро пожаловать в панель управления
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Используйте меню слева для навигации между разделами админ-панели. 
                  Здесь вы можете управлять автомобилями, заказами, пользователями, 
                  событиями и тест-драйвами Ferrari Moscow.
                </Typography>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 