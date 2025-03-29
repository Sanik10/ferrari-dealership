import { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Divider, 
  InputAdornment, 
  IconButton,
  Alert,
  Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { authAPI } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  // Проверяем, был ли пользователь перенаправлен из-за истекшего токена
  const wasTokenExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Очищаем ошибки при изменении
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setLoginError('Пожалуйста, заполните все поля');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      // Вызываем API для авторизации
      const response = await authAPI.login(formData);
      
      // Сохраняем данные пользователя и токен в localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Перенаправляем пользователя
      navigate(from, { replace: true });
      
    } catch (error) {
      console.error('Ошибка входа:', error);
      
      // Обработка ошибок от API
      if (error.response && error.response.data) {
        setLoginError(error.response.data.message || 'Неверный email или пароль');
      } else {
        setLoginError('Не удалось подключиться к серверу. Пожалуйста, попробуйте позже.');
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 10,
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url("/images/ferrari-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Container maxWidth="md">
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            color: 'white', 
            mb: 4, 
            '&:hover': { color: '#FF2800' }
          }}
        >
          Вернуться на главную
        </Button>
        
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={10}
          sx={{
            overflow: 'hidden',
            borderRadius: '12px',
            bgcolor: 'rgba(15, 15, 15, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 40, 0, 0.2)'
          }}
        >
          <Grid container>
            {/* Левая сторона - Логотип и изображение */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url("/images/ferrari-interior.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 5,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,40,0,0.2) 0%, rgba(0,0,0,0) 60%)',
                }
              }}
            >
              <Box
                component="img"
                src="/images/ferrari-logo.png"
                alt="Ferrari Logo"
                sx={{
                  width: '120px',
                  mb: 4,
                  filter: 'drop-shadow(0 0 10px rgba(255,40,0,0.5))',
                  zIndex: 2
                }}
              />
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ 
                  color: 'white', 
                  textAlign: 'center',
                  textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                  zIndex: 2
                }}
              >
                FERRARI
              </Typography>
              <Typography
                variant="h6"
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  textAlign: 'center',
                  fontWeight: 300,
                  textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                  zIndex: 2
                }}
              >
                MOSCOW
              </Typography>
              
              <Box sx={{ mt: 6, zIndex: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
                  Впервые у нас?
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  sx={{
                    mt: 1,
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: '#FF2800',
                      color: '#FF2800'
                    }
                  }}
                >
                  Зарегистрироваться
                </Button>
              </Box>
            </Grid>
            
            {/* Правая сторона - Форма входа */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: { xs: 4, md: 5 } }}>
                <Box 
                  component="img"
                  src="/images/ferrari-logo.png"
                  alt="Ferrari Logo"
                  sx={{
                    width: '80px',
                    mb: 2,
                    display: { xs: 'block', md: 'none' },
                    mx: 'auto'
                  }}
                />
                
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Вход в аккаунт
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    mb: 4,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Войдите в личный кабинет для доступа к эксклюзивным предложениям
                </Typography>
                
                {wasTokenExpired && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    Срок действия вашей сессии истек. Пожалуйста, войдите снова.
                  </Alert>
                )}
                
                {loginError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {loginError}
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                  <Grid item xs={12}>
                    <TextField
                      label="Имя пользователя *"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!loginError}
                      helperText={loginError}
                    />
                  </Grid>
                  
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Пароль"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
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
                          <LockIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255,255,255,0.5)' }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <MuiLink 
                      component={Link} 
                      to="/forgot-password"
                      sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        '&:hover': { color: '#FF2800' }
                      }}
                    >
                      Забыли пароль?
                    </MuiLink>
                  </Box>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                      color: 'white',
                      py: 1.5,
                      '&:hover': {
                        backgroundImage: 'linear-gradient(45deg, #FF4D4D 30%, #FF2800 90%)',
                      },
                      '&.Mui-disabled': { 
                        opacity: 0.6,
                        color: 'white' 
                      }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Войти'
                    )}
                  </Button>
                </form>
                
                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                    Ещё нет аккаунта?
                  </Typography>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      py: 1.2,
                      '&:hover': {
                        borderColor: '#FF2800',
                        color: '#FF2800'
                      }
                    }}
                  >
                    Зарегистрироваться
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;