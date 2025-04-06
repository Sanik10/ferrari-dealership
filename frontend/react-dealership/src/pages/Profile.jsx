import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Badge,
  Skeleton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
  ShoppingCart as ShoppingCartIcon,
  DirectionsCar as DirectionsCarIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  LocalOffer as LocalOfferIcon,
  LockReset as LockResetIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccessTime as AccessTimeIcon,
  AccessAlarm as AccessAlarmIcon,
  PhotoCamera as PhotoCameraIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import { API_URL } from '../config';

// Стилизованный TabPanel компонент
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
      sx={{ p: { xs: 0, sm: 2 } }}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

// Хелпер для создания props табов
function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

// Стилизованный компонент аватара
const StyledAvatar = styled(Avatar)(() => ({
  width: 120,
  height: 120,
  border: '4px solid rgba(255, 40, 0, 0.7)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
  },
}));

// Стилизованный Tab
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: 16,
  color: 'rgba(255, 255, 255, 0.7)',
  padding: '12px 20px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&.Mui-selected': {
    color: 'white',
    background: 'rgba(255, 40, 0, 0.1)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  },
  '&:hover': {
    color: 'white',
    opacity: 1,
    background: 'rgba(255, 255, 255, 0.05)',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: 14,
    minWidth: 'auto',
  },
}));

// Основной компонент профиля
const Profile = () => {
  // Хуки и состояния
  const { user, updateUserProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Состояния для данных профиля
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    fullName: '',
  });
  
  // Состояния для данных пароля
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Состояния для видимости паролей
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Состояния для заказов и тест-драйвов
  const [orders, setOrders] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  
  // Эффект для загрузки данных пользователя
  useEffect(() => {
    if (user) {
      console.log("Полученные данные пользователя:", user);
      
      // Проверяем структуру данных пользователя
      const userData = user.user || user;
      
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        fullName: userData.fullName || ''
      });
      
      if (userData.avatarUrl) {
        setAvatarPreview(userData.avatarUrl);
      }
      
      // Загрузка заказов
      fetchUserOrders();
      
      // Загрузка тест-драйвов
      fetchUserTestDrives();
    }
  }, [user]);
  
  // Функция для получения заказов пользователя
  const fetchUserOrders = async () => {
    try {
      // Попытка загрузить реальные данные
      setOrders([]);
      console.log('Заказы не найдены');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };
  
  // Функция для получения тест-драйвов пользователя
  const fetchUserTestDrives = async () => {
    try {
      // Попытка загрузить реальные данные
      setTestDrives([]);
      console.log('Тест-драйвы не найдены');
    } catch (error) {
      console.error('Error fetching test drives:', error);
      setTestDrives([]);
    }
  };
  
  // Обработчик переключения вкладок
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Обработчик загрузки аватара
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Обработчик переключения режима редактирования
  const toggleEditMode = () => {
    if (isEditing) {
      // Если выходим из режима редактирования, сбрасываем данные
      setProfileData({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        fullName: user?.fullName || '',
      });
      setAvatarPreview(user?.avatarUrl || '');
      setAvatarImage(null);
    }
    setIsEditing(!isEditing);
  };
  
  // Обработчик изменения данных профиля
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Обработчик изменения данных пароля
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Обработчик отправки формы профиля
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', profileData.username);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);
      
      if (avatarImage) {
        formData.append('avatar', avatarImage);
      }
      
      await updateUserProfile(formData);
      setIsEditing(false);
      showSnackbar('Профиль успешно обновлен', 'success');
    // eslint-disable-next-line no-unused-vars
    } catch (_err) {
      showSnackbar('Ошибка при обновлении профиля', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик смены пароля
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Проверка совпадения паролей
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSnackbar('Новые пароли не совпадают', 'error');
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(
        `${API_URL}/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      showSnackbar('Пароль успешно изменен', 'success');
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Ошибка при смене пароля', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик переключения видимости пароля
  const handleTogglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Проверка на наличие админских прав и отображение админ-панели
  const renderAdminPanel = () => {
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      return (
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/admin" 
          sx={{ 
            mt: 2, 
            mb: 2,
            backgroundColor: '#e10600',
            '&:hover': {
              backgroundColor: '#b30500',
            }
          }}
        >
          {user.role === 'admin' ? 'Панель администратора' : 'Панель менеджера'}
        </Button>
      );
    }
    return null;
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(to bottom, #121212, #1E1E1E)',
        pt: 8,
        pb: 10
      }}
    >
      <Container maxWidth="lg">
        <div>
          {/* Верхняя часть профиля с аватаром и информацией */}
          <div>
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                mb: 5,
                p: 0,
                borderRadius: '20px',
                backgroundColor: 'transparent',
              }}
            >
              {/* Фоновый градиент */}
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(18, 18, 18, 0.7)',
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(255,40,0,0.1))',
                  zIndex: 0,
                }}
              />
              
              {/* Декоративные элементы */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,40,0,0.2) 0%, rgba(255,40,0,0) 70%)',
                  zIndex: 0,
                }}
              />
              
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -50,
                  left: '40%',
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,40,0,0.1) 0%, rgba(255,40,0,0) 70%)',
                  zIndex: 0,
                }}
              />
              
              {/* Содержимое профиля */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  p: { xs: 3, md: 5 },
                }}
              >
                {/* Аватар */}
                <Box
                  sx={{
                    position: 'relative',
                    mr: { xs: 0, md: 4 },
                    mb: { xs: 3, md: 0 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      isEditing && (
                        <label htmlFor="avatar-upload">
                          <IconButton
                            component="span"
                            sx={{
                              bgcolor: '#FF2800',
                              color: 'white',
                              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                              '&:hover': {
                                bgcolor: '#FF4D4D',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <PhotoCameraIcon />
                          </IconButton>
                        </label>
                      )
                    }
                  >
                    <StyledAvatar
                      src={avatarPreview || '/images/default-avatar.png'}
                      alt={profileData.username}
                    />
                  </Badge>
                  
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  
                  {!isEditing && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 1, 
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center' 
                      }}
                    >
                      Последний вход: {format(new Date(), 'dd.MM.yyyy', { locale: ru })}
                    </Typography>
                  )}
                </Box>
                
                {/* Информация о пользователе */}
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      mb: 1,
                      textAlign: { xs: 'center', md: 'left' },
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}
                  >
                    {profileData.username || 'Пользователь Ferrari'}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'center', sm: 'flex-start' },
                      gap: 2,
                      mb: 3,
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      <EmailIcon sx={{ mr: 1, color: '#FF2800' }} />
                      <Typography>{profileData.email || 'Нет email'}</Typography>
                    </Box>
                    
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      <PhoneIcon sx={{ mr: 1, color: '#FF2800' }} />
                      <Typography>{profileData.phone || 'Нет телефона'}</Typography>
                    </Box>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: 2,
                      flexWrap: 'wrap',
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      width: '100%'
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 2,
                        borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        minWidth: { xs: '100%', sm: '160px' },
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.08)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <ShoppingCartIcon sx={{ color: '#FF2800', mr: 1 }} />
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {orders.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {orders.length === 1 
                            ? 'Заказ' 
                            : orders.length > 1 && orders.length < 5 
                              ? 'Заказа' 
                              : 'Заказов'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 2,
                        borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        minWidth: { xs: '100%', sm: '160px' },
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.08)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <DirectionsCarIcon sx={{ color: '#FF2800', mr: 1 }} />
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {testDrives.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {testDrives.length === 1 
                            ? 'Тест-драйв' 
                            : testDrives.length > 1 && testDrives.length < 5 
                              ? 'Тест-драйва' 
                              : 'Тест-драйвов'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 2,
                        borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        minWidth: { xs: '100%', sm: '160px' },
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.08)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <VerifiedUserIcon sx={{ color: '#FF2800', mr: 1 }} />
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          VIP
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          Статус
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </div>
          
          {/* Навигация по вкладкам */}
          <div>
            <Paper
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: '16px',
                overflow: 'hidden',
                p: 1,
                backgroundColor: 'rgba(18, 18, 18, 0.6)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="profile tabs"
                sx={{
                  '& .MuiTabs-indicator': {
                    display: 'none',
                  },
                  '& .MuiTabs-flexContainer': {
                    gap: 1,
                  },
                }}
              >
                <StyledTab
                  label="Профиль"
                  icon={<PersonIcon />}
                  iconPosition="start"
                  {...a11yProps(0)}
                />
                <StyledTab
                  label="Заказы"
                  icon={<ShoppingCartIcon />}
                  iconPosition="start"
                  {...a11yProps(1)}
                />
                <StyledTab
                  label="Тест-драйвы"
                  icon={<DirectionsCarIcon />}
                  iconPosition="start"
                  {...a11yProps(2)}
                />
                <StyledTab
                  label="Сменить пароль"
                  icon={<LockIcon />}
                  iconPosition="start"
                  {...a11yProps(3)}
                />
              </Tabs>
            </Paper>
          </div>
          
          {/* Контейнер для содержимого вкладок */}
          <div>
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
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(/images/pattern-bg.png)',
                  backgroundSize: '500px',
                  backgroundRepeat: 'repeat',
                  opacity: 0.03,
                  zIndex: 0,
                }}
              />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Вкладка профиля */}
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ px: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                        Мой профиль
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                        onClick={isEditing ? handleProfileSubmit : toggleEditMode}
                        sx={{
                          borderColor: 'rgba(255,40,0,0.5)',
                          color: '#FF2800',
                          '&:hover': {
                            borderColor: '#FF2800',
                            backgroundColor: 'rgba(255,40,0,0.05)'
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? 
                          'Сохранение...' : 
                          isEditing ? 'Сохранить' : 'Редактировать'}
                      </Button>
                    </Box>
                    
                    {isEditing ? (
                      <form onSubmit={handleProfileSubmit}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Имя пользователя"
                              name="username"
                              value={profileData.username}
                              onChange={handleProfileChange}
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  color: 'white',
                                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                  '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                '& .MuiInputBase-input': { color: 'white' }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Email"
                              name="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  color: 'white',
                                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                  '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                '& .MuiInputBase-input': { color: 'white' }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Телефон"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  color: 'white',
                                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                  '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                '& .MuiInputBase-input': { color: 'white' }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </form>
                    ) : (
                      <Box>
                        <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                          Здесь вы можете просматривать и редактировать ваши персональные данные. 
                          Нажмите кнопку "Редактировать" для изменения информации.
                        </Typography>
                        
                        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ color: '#FF2800', mr: 2 }} />
                            <Box>
                              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                Имя пользователя
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {profileData.username || '—'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ color: '#FF2800', mr: 2 }} />
                            <Box>
                              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                Полное имя
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {profileData.fullName || '—'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ color: '#FF2800', mr: 2 }} />
                            <Box>
                              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                Email
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {profileData.email || '—'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ color: '#FF2800', mr: 2 }} />
                            <Box>
                              <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                Телефон
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {profileData.phone || '—'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </TabPanel>
                
                {/* Вкладка заказов */}
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ px: 3 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: 'white' }}>
                      Мои заказы
                    </Typography>
                    
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress sx={{ color: '#FF2800' }} />
                      </Box>
                    ) : orders.length > 0 ? (
                      <List sx={{ width: '100%' }}>
                        {orders.map((order, index) => (
                          <React.Fragment key={order.id || index}>
                            <ListItem
                              sx={{
                                borderRadius: '10px',
                                mb: 2,
                                bgcolor: 'rgba(255,255,255,0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'rgba(255,255,255,0.08)',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              <ListItemIcon>
                                <ShoppingCartIcon sx={{ color: '#FF2800' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="h6" sx={{ color: 'white' }}>
                                    Заказ #{order.id} - {order.car?.brand} {order.car?.model}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                      <Chip
                                        size="small"
                                        label={`Статус: ${order.status || 'В обработке'}`}
                                        sx={{
                                          bgcolor: order.status === 'Выполнен' 
                                            ? 'rgba(76, 175, 80, 0.2)' 
                                            : order.status === 'Отменен'
                                              ? 'rgba(211, 47, 47, 0.2)'
                                              : 'rgba(255, 152, 0, 0.2)',
                                          color: order.status === 'Выполнен' 
                                            ? '#4CAF50' 
                                            : order.status === 'Отменен'
                                              ? '#D32F2F'
                                              : '#FF9800',
                                        }}
                                      />
                                      <Chip
                                        size="small"
                                        label={`Сумма: ${order.totalAmount || '0'} ₽`}
                                        sx={{ bgcolor: 'rgba(255, 40, 0, 0.1)', color: '#FF2800' }}
                                      />
                                      {order.createdAt && (
                                        <Chip
                                          size="small"
                                          icon={<CalendarTodayIcon />}
                                          label={format(new Date(order.createdAt), 'dd.MM.yyyy', { locale: ru })}
                                          sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
                                        />
                                      )}
                                    </Box>
                                    <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                      {order.additionalInfo || 'Без дополнительной информации'}
                                    </Typography>
                                  </Box>
                                }
                              />
                              <Button
                                component={Link}
                                to={`/order/${order.id}`}
                                variant="outlined"
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                  ml: 2,
                                  borderColor: 'rgba(255,40,0,0.5)',
                                  color: '#FF2800',
                                  '&:hover': {
                                    borderColor: '#FF2800',
                                    backgroundColor: 'rgba(255,40,0,0.05)'
                                  }
                                }}
                              >
                                Детали
                              </Button>
                            </ListItem>
                            {index < orders.length - 1 && (
                              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
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
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: 'white' }}>
                      Мои тест-драйвы
                    </Typography>
                    
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress sx={{ color: '#FF2800' }} />
                      </Box>
                    ) : testDrives.length > 0 ? (
                      <List sx={{ width: '100%' }}>
                        {testDrives.map((testDrive, index) => (
                          <React.Fragment key={testDrive.id || index}>
                            <ListItem
                              sx={{
                                borderRadius: '10px',
                                mb: 2,
                                bgcolor: 'rgba(255,255,255,0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'rgba(255,255,255,0.08)',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              <ListItemIcon>
                                <DirectionsCarIcon sx={{ color: '#FF2800' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="h6" sx={{ color: 'white' }}>
                                    {testDrive.car?.brand} {testDrive.car?.model}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                      <Chip
                                        size="small"
                                        label={`Статус: ${testDrive.status || 'Запланирован'}`}
                                        sx={{
                                          bgcolor: testDrive.status === 'Завершен' 
                                            ? 'rgba(76, 175, 80, 0.2)' 
                                            : testDrive.status === 'Отменен'
                                              ? 'rgba(211, 47, 47, 0.2)'
                                              : 'rgba(255, 152, 0, 0.2)',
                                          color: testDrive.status === 'Завершен' 
                                            ? '#4CAF50' 
                                            : testDrive.status === 'Отменен'
                                              ? '#D32F2F'
                                              : '#FF9800',
                                        }}
                                      />
                                      {testDrive.date && (
                                        <Chip
                                          size="small"
                                          icon={<CalendarTodayIcon />}
                                          label={format(new Date(testDrive.date), 'dd.MM.yyyy', { locale: ru })}
                                          sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
                                        />
                                      )}
                                      {testDrive.time && (
                                        <Chip
                                          size="small"
                                          icon={<AccessTimeIcon />}
                                          label={testDrive.time}
                                          sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
                                        />
                                      )}
                                    </Box>
                                    {testDrive.notes && (
                                      <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                        {testDrive.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < testDrives.length - 1 && (
                              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
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
                
                {/* Вкладка смены пароля */}
                <TabPanel value={tabValue} index={3}>
                  <Box sx={{ px: 3 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: 'white' }}>
                      Изменение пароля
                    </Typography>
                    
                    <form onSubmit={handlePasswordSubmit}>
                      <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                        <TextField
                          fullWidth
                          label="Текущий пароль"
                          name="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          margin="normal"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleTogglePasswordVisibility('current')}
                                  edge="end"
                                  sx={{ color: 'rgba(255,255,255,0.5)' }}
                                >
                                  {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            '& .MuiInputBase-input': { color: 'white' }
                          }}
                          required
                        />
                        
                        <TextField
                          fullWidth
                          label="Новый пароль"
                          name="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          margin="normal"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockResetIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleTogglePasswordVisibility('new')}
                                  edge="end"
                                  sx={{ color: 'rgba(255,255,255,0.5)' }}
                                >
                                  {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            '& .MuiInputBase-input': { color: 'white' }
                          }}
                          required
                        />
                        
                        <TextField
                          fullWidth
                          label="Подтверждение пароля"
                          name="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          margin="normal"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <VpnKeyIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleTogglePasswordVisibility('confirm')}
                                  edge="end"
                                  sx={{ color: 'rgba(255,255,255,0.5)' }}
                                >
                                  {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            '& .MuiInputBase-input': { color: 'white' }
                          }}
                          required
                        />
                        
                        <Typography 
                          variant="body2" 
                          sx={{ mt: 2, mb: 3, color: 'rgba(255,255,255,0.7)' }}
                        >
                          Пароль должен содержать не менее 8 символов, включая цифры, 
                          строчные и заглавные буквы.
                        </Typography>
                        
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                            color: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(255, 40, 0, 0.25)',
                            '&:hover': {
                              backgroundImage: 'linear-gradient(45deg, #FF4D4D 30%, #FF2800 90%)',
                              boxShadow: '0 6px 15px rgba(255, 40, 0, 0.3)',
                            }
                          }}
                        >
                          {loading ? 'Сохранение...' : 'Изменить пароль'}
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </TabPanel>
              </Box>
            </Paper>
          </div>
        </div>
      </Container>
      {renderAdminPanel()}
    </Box>
  );
};

export default Profile;