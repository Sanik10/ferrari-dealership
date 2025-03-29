import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  Divider,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';

// Иконки
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EventIcon from '@mui/icons-material/Event';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StarsIcon from '@mui/icons-material/Stars';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// API
import { userAPI, orderAPI, testDriveAPI, serviceAPI, eventAPI, authAPI } from '../services/api';

// React Router
import { useNavigate, Link } from 'react-router-dom';

// Функции для форматирования данных
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// TabPanel компонент для табов
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>{children}</Box>
      )}
    </div>
  );
}

const Profile = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Состояния для редактирования профиля
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  
  // Состояния для смены пароля
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Состояния для истории заказов и других данных
  const [orders, setOrders] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [serviceAppointments, setServiceAppointments] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [dataLoading, setDataLoading] = useState({
    orders: true,
    testDrives: true,
    service: true,
    events: true
  });
  
  // Модальное окно для просмотра деталей
  const [detailModal, setDetailModal] = useState({
    open: false,
    type: '', // 'order', 'testDrive', 'service', 'event'
    data: null
  });
  
  // Вывод информации о пользователе в консоль для отладки
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log("Пользователь из localStorage:", storedUser);
    console.log("Роль пользователя:", storedUser?.role);
    console.log("Является ли администратором или менеджером:", 
      storedUser?.role === 'admin' || storedUser?.role === 'manager');
  }, []);
  
  // Получение данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getCurrentUser();
        setUser(response.data);
        setProfileData({
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone || ''
        });
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        setError('Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  // Загрузка заказов
  const fetchOrders = async () => {
    try {
      setDataLoading(prev => ({...prev, orders: true}));
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
    } finally {
      setDataLoading(prev => ({...prev, orders: false}));
    }
  };
  
  // Загрузка тест-драйвов
  const fetchTestDrives = async () => {
    try {
      setDataLoading(prev => ({...prev, testDrives: true}));
      const response = await testDriveAPI.getMyTestDrives();
      setTestDrives(response.data);
    } catch (error) {
      console.error('Ошибка при получении тест-драйвов:', error);
    } finally {
      setDataLoading(prev => ({...prev, testDrives: false}));
    }
  };
  
  // Загрузка сервисных записей
  const fetchServiceAppointments = async () => {
    try {
      setDataLoading(prev => ({...prev, service: true}));
      const response = await serviceAPI.getMyAppointments();
      setServiceAppointments(response.data);
    } catch (error) {
      console.error('Ошибка при получении сервисных записей:', error);
    } finally {
      setDataLoading(prev => ({...prev, service: false}));
    }
  };
  
  // Загрузка регистраций на мероприятия
  const fetchEventRegistrations = async () => {
    try {
      setDataLoading(prev => ({...prev, events: true}));
      const response = await eventAPI.getMyRegistrations();
      setEventRegistrations(response.data);
    } catch (error) {
      console.error('Ошибка при получении регистраций на мероприятия:', error);
    } finally {
      setDataLoading(prev => ({...prev, events: false}));
    }
  };
  
  // Загружаем данные при переключении табов
  useEffect(() => {
    if (tabValue === 1 && orders.length === 0) {
      fetchOrders();
    } else if (tabValue === 2 && testDrives.length === 0) {
      fetchTestDrives();
    } else if (tabValue === 3 && serviceAppointments.length === 0) {
      fetchServiceAppointments();
    } else if (tabValue === 4 && eventRegistrations.length === 0) {
      fetchEventRegistrations();
    }
  }, [tabValue, orders.length, testDrives.length, serviceAppointments.length, eventRegistrations.length]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const toggleEditMode = () => {
    if (isEditing) {
      // Если пользователь отменяет редактирование, вернуть исходные данные
      setProfileData({
        username: user.username,
        email: user.email,
        phone: user.phone || ''
      });
    }
    setIsEditing(!isEditing);
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
    //   const response = await userAPI.updateUser(user.id, profileData);
      
      // Обновляем локальные данные и localStorage
      setUser({...user, ...profileData});
      const storedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({...storedUser, ...profileData}));
      
      setIsEditing(false);
      
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setError('Не удалось обновить данные профиля. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Очищаем ошибки при изменении
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: ''
      });
    }
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Введите текущий пароль';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'Введите новый пароль';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Подтвердите новый пароль';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Сбрасываем форму и показываем сообщение об успехе
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordSuccess(true);
      
      // Закрываем диалог через 2 секунды
      setTimeout(() => {
        setPasswordDialog(false);
        setPasswordSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Ошибка при смене пароля:', error);
      
      // Обработка ошибок от API
      if (error.response && error.response.data) {
        if (error.response.data.message === 'Incorrect password') {
          setPasswordErrors({...passwordErrors, currentPassword: 'Неверный текущий пароль'});
        } else {
          setPasswordErrors({...passwordErrors, general: error.response.data.message});
        }
      } else {
        setPasswordErrors({...passwordErrors, general: 'Не удалось сменить пароль. Попробуйте позже.'});
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const openDetailModal = (type, data) => {
    setDetailModal({
      open: true,
      type,
      data
    });
  };
  
  const closeDetailModal = () => {
    setDetailModal({
      open: false,
      type: '',
      data: null
    });
  };
  
  // Генерация содержимого для модального окна деталей
  const renderDetailModalContent = () => {
    const { type, data } = detailModal;
    
    if (!data) return null;
    
    switch (type) {
      case 'order':
        return (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Заказ №{data.orderNumber || data.id}</Typography>
                <IconButton onClick={closeDetailModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {data.car && data.car.imageUrl && (
                    <img 
                      src={data.car.imageUrl} 
                      alt={`${data.car.brand} ${data.car.model}`} 
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    {data.car ? `${data.car.brand} ${data.car.model}` : 'Автомобиль'}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={data.status} 
                      color={
                        data.status === 'completed' ? 'success' : 
                        data.status === 'pending' ? 'warning' : 
                        data.status === 'cancelled' ? 'error' : 'primary'
                      }
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Сумма: {data.totalAmount ? `${data.totalAmount.toLocaleString()} ₽` : 'Не указана'}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Дата заказа: {data.createdAt ? format(new Date(data.createdAt), 'dd MMMM yyyy', { locale: ru }) : 'Не указана'}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Детали заказа:
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Тип: {data.orderType === 'purchase' ? 'Покупка' : data.orderType === 'rental' ? 'Аренда' : 'Не указан'}
                  </Typography>
                  
                  {data.orderType === 'rental' && data.rentalDuration && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Срок аренды: {data.rentalDuration} {data.rentalDuration === 1 ? 'день' : 
                                  data.rentalDuration < 5 ? 'дня' : 'дней'}
                    </Typography>
                  )}
                  
                  {data.deliveryAddress && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Адрес доставки: {data.deliveryAddress}
                    </Typography>
                  )}
                  
                  {data.additionalServices && data.additionalServices.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Дополнительные услуги:
                      </Typography>
                      <List dense>
                        {data.additionalServices.map((service, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={service} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
          </>
        );
      
      case 'testDrive':
        return (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Тест-драйв</Typography>
                <IconButton onClick={closeDetailModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {data.car && data.car.imageUrl && (
                    <img 
                      src={data.car.imageUrl} 
                      alt={`${data.car.brand} ${data.car.model}`} 
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    {data.car ? `${data.car.brand} ${data.car.model}` : 'Автомобиль'}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={
                        data.status === 'scheduled' ? 'Запланирован' :
                        data.status === 'completed' ? 'Завершен' :
                        data.status === 'cancelled' ? 'Отменен' : 'В обработке'
                      } 
                      color={
                        data.status === 'completed' ? 'success' : 
                        data.status === 'scheduled' ? 'primary' : 
                        data.status === 'cancelled' ? 'error' : 'warning'
                      }
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  
                  {data.date && (
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      Дата: {format(new Date(data.date), 'dd MMMM yyyy', { locale: ru })}
                    </Typography>
                  )}
                  
                  {data.time && (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Время: {data.time}
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {data.location && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, mt: 0.3, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {data.location}
                      </Typography>
                    </Box>
                  )}
                  
                  {data.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Примечания:
                      </Typography>
                      <Typography variant="body2">
                        {data.notes}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
          </>
        );
      
      // Другие типы деталей (service, event) можно добавить по аналогии
      
      default:
        return (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Подробная информация</Typography>
                <IconButton onClick={closeDetailModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography>Информация недоступна</Typography>
            </DialogContent>
          </>
        );
    }
  };
  
  // Рендеринг содержимого скелетона для загрузки
  const renderSkeletons = (count = 3) => {
    return Array.from(new Array(count)).map((_, index) => (
      <Paper key={index} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Skeleton variant="rectangular" height={100} width="100%" />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Skeleton variant="text" height={30} width="60%" />
            <Skeleton variant="text" height={20} width="40%" />
            <Skeleton variant="text" height={20} width="30%" />
          </Grid>
        </Grid>
      </Paper>
    ));
  };
  
  // Добавляем отладку для кнопок администратора
  const handleAdminButtonClick = (route) => {
    console.log(`Нажата кнопка администратора: ${route}`);
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(`Роль пользователя при нажатии: ${user?.role}`);
  };
  
  // Если данные загружаются
  if (isLoading && !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <LinearProgress sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton variant="circular" width={150} height={150} sx={{ mb: 2 }} />
                <Skeleton variant="text" height={40} width="70%" />
                <Skeleton variant="text" height={30} width="50%" />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" height={50} width="40%" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={200} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
  
  // Если произошла ошибка
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
          <Button 
            onClick={() => navigate('/login')} 
            sx={{ ml: 2 }} 
            color="inherit"
          >
            Вернуться на страницу входа
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="warning">
          Необходимо войти в аккаунт
          <Button 
            onClick={() => navigate('/login')} 
            sx={{ ml: 2 }} 
            color="inherit"
          >
            Войти
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 10,
        px: { xs: 2, md: 0 },
        background: 'linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8)), url("/images/ferrari-dashboard.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              color: 'white', 
              '&:hover': { color: '#FF2800' }
            }}
          >
            Вернуться на главную
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {/* Левая колонка - Данные профиля */}
          <Grid item xs={12} md={4} lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={5}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: '12px',
                  background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.9), rgba(10, 10, 10, 0.9))',
                  border: '1px solid rgba(255,40,0,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: '#FF2800',
                      fontSize: '3rem',
                      mb: 2,
                      border: '4px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 1 }}>
                    {user.username}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={<VerifiedUserIcon />}
                      label={
                        user.role === 'admin' ? 'Администратор' :
                        user.role === 'manager' ? 'Менеджер' :
                        user.vip ? 'VIP Клиент' : 'Клиент'
                      }
                      color={
                        user.role === 'admin' ? 'secondary' :
                        user.role === 'manager' ? 'info' :
                        user.vip ? 'error' : 'primary'
                      }
                      sx={{
                        py: 2,
                        fontWeight: 'bold',
                        background: user.vip && !['admin', 'manager'].includes(user.role) ? 
                          'linear-gradient(45deg, #FF2800, #FF4D4D)' : undefined
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ width: '100%' }}>
                    <List>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <EmailIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={user.email}
                          primaryTypographyProps={{ 
                            sx: { color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' } 
                          }}
                        />
                      </ListItem>
                      
                      {user.phone && (
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <PhoneIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={user.phone}
                            primaryTypographyProps={{ 
                              sx: { color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' } 
                            }}
                          />
                        </ListItem>
                      )}
                      
                      {user.createdAt && (
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <EventIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={`С нами с ${format(new Date(user.createdAt), 'MMMM yyyy', { locale: ru })}`}
                            primaryTypographyProps={{ 
                              sx: { color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' } 
                            }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => setPasswordDialog(true)}
                  sx={{
                    mb: 2,
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#FF2800',
					  color: '#FF2800'
                    }
                  }}
                >
                  Сменить пароль
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#FF2800',
                      color: '#FF2800'
                    }
                  }}
                >
                  Выйти из аккаунта
                </Button>
                
                {(user.role === 'admin' || user.role === 'manager') && (
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Typography variant="subtitle2" gutterBottom sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Панель управления
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to="/admin/cars"
                      onClick={() => handleAdminButtonClick('/admin/cars')}
                      sx={{
                        mb: 1,
                        backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                        color: 'white',
                        '&:hover': {
                          backgroundImage: 'linear-gradient(45deg, #FF4D4D 30%, #FF2800 90%)',
                        }
                      }}
                    >
                      Управление автомобилями
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to="/admin/orders"
                      onClick={() => handleAdminButtonClick('/admin/orders')}
                      sx={{
                        mb: 1,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                        }
                      }}
                    >
                      Управление заказами
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to="/admin/users"
                      onClick={() => handleAdminButtonClick('/admin/users')}
                      sx={{
                        mb: 1,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                        }
                      }}
                    >
                      Управление пользователями
                    </Button>
                  </Box>
                )}
              </Paper>
            </motion.div>
            
            {user.vip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={5}
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    backgroundImage: 'linear-gradient(45deg, rgba(255,40,0,0.9), rgba(220,20,0,0.8))',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-30%',
                      right: '-20%',
                      width: '200px',
                      height: '200px',
                      backgroundImage: 'url("/images/ferrari-shield.png")',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      opacity: 0.1,
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StarsIcon sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        VIP Привилегии
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                      Используйте свой VIP-статус для получения эксклюзивных привилегий и специальных предложений
                    </Typography>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to="/vip-services"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        }
                      }}
                    >
                      Перейти к VIP-сервисам
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            )}
          </Grid>
          
          {/* Правая колонка - Вкладки с контентом */}
          <Grid item xs={12} md={8} lg={9}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper
                elevation={5}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.9), rgba(10, 10, 10, 0.9))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,40,0,0.2)',
                  color: 'white'
                }}
              >
                <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#FF2800',
                      },
                      '& .MuiTab-root': {
                        color: 'rgba(255,255,255,0.7)',
                        '&.Mui-selected': {
                          color: '#FF2800',
                        }
                      }
                    }}
                  >
                    <Tab 
                      icon={<PersonIcon />} 
                      label="Профиль" 
                      iconPosition="start"
                    />
                    <Tab 
                      icon={<HistoryIcon />} 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          Заказы
                          {orders.length > 0 && (
                            <Badge 
                              badgeContent={orders.length} 
                              color="error" 
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      } 
                      iconPosition="start"
                    />
                    <Tab 
                      icon={<DirectionsCarIcon />} 
                      label="Тест-драйвы" 
                      iconPosition="start"
                    />
                    <Tab 
                      icon={<BuildIcon />} 
                      label="Сервис" 
                      iconPosition="start"
                    />
                    <Tab 
                      icon={<EventIcon />} 
                      label="Мероприятия" 
                      iconPosition="start"
                    />
                  </Tabs>
                </Box>
                
                {/* Вкладка профиля */}
                <TabPanel value={tabValue} index={0}>
                  <form onSubmit={handleProfileSubmit}>
                    <Box sx={{ px: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                          Личные данные
                        </Typography>
                        
                        <IconButton 
                          onClick={toggleEditMode}
                          sx={{ color: isEditing ? 'primary.main' : 'rgba(255,255,255,0.7)' }}
                        >
                          {isEditing ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                      </Box>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Имя пользователя"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                              },
                              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                              },
                              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Телефон"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                              },
                              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                            }}
                          />
                        </Grid>
                      </Grid>
                      
                      {isEditing && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                          <Button
                            type="button"
                            onClick={toggleEditMode}
                            sx={{ mr: 2, color: 'rgba(255,255,255,0.7)' }}
                          >
                            Отмена
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            sx={{
                              backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                              color: 'white'
                            }}
                          >
                            Сохранить
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </form>
                </TabPanel>
                
                {/* Вкладка заказов */}
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ px: 3 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                      История заказов
                    </Typography>
                    
                    {dataLoading.orders ? (
                      renderSkeletons(3)
                    ) : orders.length > 0 ? (
                      orders.map((order) => (
                        <Paper
                          key={order.id}
                          sx={{
                            p: 2,
                            mb: 2,
                            backgroundColor: 'rgba(30,30,30,0.6)',
                            borderRadius: '8px',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                            }
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={3} md={2}>
                              {order.car && order.car.imageUrl ? (
                                <Box
                                  component="img"
                                  src={order.car.imageUrl}
                                  alt={`${order.car.brand} ${order.car.model}`}
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: '100%',
                                    minHeight: 100,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <DirectionsCarIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                              )}
                            </Grid>
                            <Grid item xs={12} sm={9} md={10}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                  {order.car 
                                    ? `${order.car.brand} ${order.car.model}` 
                                    : 'Автомобиль Ferrari'}
                                </Typography>
                                
                                <Chip 
                                  label={
                                    order.status === 'completed' ? 'Завершен' :
                                    order.status === 'processing' ? 'В обработке' :
                                    order.status === 'pending' ? 'Ожидает' :
                                    order.status === 'cancelled' ? 'Отменен' : 
                                    order.status
                                  } 
                                  size="small"
                                  color={
                                    order.status === 'completed' ? 'success' :
                                    order.status === 'processing' ? 'primary' :
                                    order.status === 'pending' ? 'warning' :
                                    order.status === 'cancelled' ? 'error' : 
                                    'default'
                                  }
                                />
                              </Box>
                              
                              <Box sx={{ my: 1 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  Заказ №{order.orderNumber || order.id} от {
                                    order.createdAt ? format(new Date(order.createdAt), 'dd.MM.yyyy', { locale: ru }) : 'N/A'
                                  }
                                </Typography>
                                
                                <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', mt: 1 }}>
                                  {order.totalAmount ? `${order.totalAmount.toLocaleString()} ₽` : 'Цена по запросу'}
                                </Typography>
                                
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                                  Тип: {
                                    order.orderType === 'purchase' ? 'Покупка' :
                                    order.orderType === 'rental' ? 'Аренда' : 
                                    'Не указан'
                                  }
                                </Typography>
                              </Box>
                              
                              <Button
                                variant="text"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => openDetailModal('order', order)}
                                sx={{ 
                                  color: '#FF2800',
                                  '&:hover': { backgroundColor: 'rgba(255,40,0,0.1)' } 
                                }}
                              >
                                Подробнее
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          У вас пока нет заказов
                        </Typography>
                        <Button
                          component={Link}
                          to="/catalog"
                          variant="contained"
                          sx={{
                            mt: 2,
                            backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                            color: 'white'
                          }}
                        >
                          Перейти в каталог
                        </Button>
                      </Box>
                    )}
                  </Box>
                </TabPanel>
                
                {/* Вкладка тест-драйвов */}
                <TabPanel value={tabValue} index={2}>
                  <Box sx={{ px: 3 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                      Тест-драйвы
                    </Typography>
                    
                    {dataLoading.testDrives ? (
                      renderSkeletons(3)
                    ) : testDrives.length > 0 ? (
                      testDrives.map((testDrive) => (
                        <Paper
                          key={testDrive.id}
                          sx={{
                            p: 2,
                            mb: 2,
                            backgroundColor: 'rgba(30,30,30,0.6)',
                            borderRadius: '8px',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                            }
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={3} md={2}>
                              {testDrive.car && testDrive.car.imageUrl ? (
                                <Box
                                  component="img"
                                  src={testDrive.car.imageUrl}
                                  alt={`${testDrive.car.brand} ${testDrive.car.model}`}
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: '100%',
                                    minHeight: 100,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <DirectionsCarIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                              )}
                            </Grid>
                            <Grid item xs={12} sm={9} md={10}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                  {testDrive.car 
                                    ? `${testDrive.car.brand} ${testDrive.car.model}` 
                                    : 'Автомобиль Ferrari'}
                                </Typography>
                                
                                <Chip 
                                  label={
                                    testDrive.status === 'scheduled' ? 'Запланирован' :
                                    testDrive.status === 'completed' ? 'Завершен' :
                                    testDrive.status === 'cancelled' ? 'Отменен' :
                                    testDrive.status === 'pending' ? 'Ожидает' : 
                                    testDrive.status
                                  } 
                                  size="small"
                                  color={
                                    testDrive.status === 'completed' ? 'success' :
                                    testDrive.status === 'scheduled' ? 'primary' :
                                    testDrive.status === 'cancelled' ? 'error' :
                                    testDrive.status === 'pending' ? 'warning' : 
                                    'default'
                                  }
                                />
                              </Box>
                              
                              <Box sx={{ my: 1 }}>
                                {testDrive.date && (
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Дата: {format(new Date(testDrive.date), 'dd MMMM yyyy', { locale: ru })}
                                    {testDrive.time && ` в ${testDrive.time}`}
                                  </Typography>
                                )}
                                
                                {testDrive.location && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'rgba(255,255,255,0.5)' }} />
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                      {testDrive.location}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                              
                              <Button
                                variant="text"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => openDetailModal('testDrive', testDrive)}
                                sx={{ 
                                  color: '#FF2800',
                                  '&:hover': { backgroundColor: 'rgba(255,40,0,0.1)' } 
                                }}
                              >
                                Подробнее
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          У вас пока нет записей на тест-драйв
                        </Typography>
                        <Button
                          component={Link}
                          to="/test-drive"
                          variant="contained"
                          sx={{
                            mt: 2,
                            backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                            color: 'white'
                          }}
                        >
                          Записаться на тест-драйв
                        </Button>
                      </Box>
                    )}
                  </Box>
                </TabPanel>
                
                {/* Вкладки для сервиса и мероприятий имеют аналогичную структуру */}
                <TabPanel value={tabValue} index={3}>
                  <Box sx={{ px: 3 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                      Сервисное обслуживание
                    </Typography>
                    
                    {dataLoading.service ? (
                      renderSkeletons(2)
                    ) : serviceAppointments.length > 0 ? (
                      <Typography>Отображение записей на сервисное обслуживание</Typography>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          У вас пока нет записей на сервисное обслуживание
                        </Typography>
                        <Button
                          component={Link}
                          to="/service-appointment"
                          variant="contained"
                          sx={{
                            mt: 2,
                            backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                            color: 'white'
                          }}
                        >
                          Записаться на сервис
                        </Button>
                      </Box>
                    )}
                  </Box>
                </TabPanel>
                
                <TabPanel value={tabValue} index={4}>
                  <Box sx={{ px: 3 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                      Мероприятия
                    </Typography>
                    
                    {dataLoading.events ? (
                      renderSkeletons(2)
                    ) : eventRegistrations.length > 0 ? (
                      <Typography>Отображение регистраций на мероприятия</Typography>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Вы пока не зарегистрированы ни на одно мероприятие
                        </Typography>
                        <Button
                          component={Link}
                          to="/events"
                          variant="contained"
                          sx={{
                            mt: 2,
                            backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                            color: 'white'
                          }}
                        >
                          Просмотреть мероприятия
                        </Button>
                      </Box>
                    )}
                  </Box>
                </TabPanel>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      
      {/* Диалог смены пароля */}
      <Dialog
        open={passwordDialog}
        onClose={() => !isLoading && !passwordSuccess && setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.95))',
            backdropFilter: 'blur(10px)',
            color: 'white'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Смена пароля</Typography>
            <IconButton 
              onClick={() => setPasswordDialog(false)}
              disabled={isLoading || passwordSuccess}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {passwordSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Пароль успешно изменен!
            </Alert>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              {passwordErrors.general && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {passwordErrors.general}
                </Alert>
              )}
              
              <TextField
                fullWidth
                label="Текущий пароль"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.currentPassword}
                helperText={passwordErrors.currentPassword}
                disabled={isLoading}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
					'& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiFormHelperText-root': { color: 'error.main' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label="Новый пароль"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword}
                disabled={isLoading}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiFormHelperText-root': { color: 'error.main' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label="Подтверждение пароля"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.confirmPassword}
                helperText={passwordErrors.confirmPassword}
                disabled={isLoading}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiFormHelperText-root': { color: 'error.main' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  )
                }}
              />
            </form>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {!passwordSuccess && (
            <>
              <Button
                onClick={() => setPasswordDialog(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                variant="contained"
                onClick={handlePasswordSubmit}
                disabled={isLoading}
                sx={{
                  backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                  color: 'white',
                  '&:hover': {
                    backgroundImage: 'linear-gradient(45deg, #FF4D4D 30%, #FF2800 90%)',
                  }
                }}
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Модальное окно с деталями */}
      <Dialog
        open={detailModal.open}
        onClose={closeDetailModal}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.95))',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255,40,0,0.2)'
          }
        }}
      >
        {renderDetailModalContent()}
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={closeDetailModal}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              '&:hover': {
                borderColor: '#FF2800',
                color: '#FF2800'
              }
            }}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;