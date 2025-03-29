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
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { authAPI } from '../services/api';

import ferrariLogo from '/images/ferrari-logo-png-transparent.png';

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const steps = [
    'Личная информация',
    'Учетные данные',
    'Завершение'
  ];
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'termsAccepted' ? checked : value
    });
    
    // Очищаем ошибки при изменении
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.username) {
        newErrors.username = 'Введите ваше имя';
      }
      
      if (!formData.email) {
        newErrors.email = 'Введите email';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Введите корректный email';
      }
      
      if (!formData.phone) {
        newErrors.phone = 'Введите номер телефона';
      } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone)) {
        newErrors.phone = 'Введите корректный номер телефона';
      }
    }
    
    if (step === 1) {
      if (!formData.password) {
        newErrors.password = 'Введите пароль';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Пароль должен содержать минимум 6 символов';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Подтвердите пароль';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
      
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'Необходимо принять условия';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }
    
    setIsLoading(true);
    setApiError('');

    try {
      // Отправляем данные регистрации через API
      const userData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };
      
      const response = await authAPI.register(userData);
      console.log('Регистрация успешна', response.data);
      
      setRegistrationComplete(true);
      setActiveStep(2);
      
      // Если регистрация успешна и сервер возвращает токен, можно автоматически выполнить вход
      // В этом случае мы ожидаем, что API возвращает token и user
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      
      // Обработка ошибок от API
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || 'Произошла ошибка при регистрации');
      } else {
        setApiError('Не удалось подключиться к серверу. Пожалуйста, попробуйте позже.');
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToHome = () => {
    navigate('/');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              variant="outlined"
              label="Ваше имя"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
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
                    <PersonIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
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
                    <EmailIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              fullWidth
              variant="outlined"
              label="Телефон"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="+7 (___) ___-__-__"
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
                    <PhoneIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        );
        
      case 1:
        return (
          <Box>
            {apiError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {apiError}
              </Alert>
            )}
            
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
            
            <TextField
              fullWidth
              variant="outlined"
              label="Подтверждение пароля"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
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
                )
              }}
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  name="termsAccepted"
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    '&.Mui-checked': { color: '#FF2800' }
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Я принимаю <MuiLink href="/terms" color="#FF2800">условия использования</MuiLink> и{' '}
                  <MuiLink href="/privacy" color="#FF2800">политику конфиденциальности</MuiLink>
                </Typography>
              }
            />
            {errors.termsAccepted && (
              <FormHelperText error>{errors.termsAccepted}</FormHelperText>
            )}
          </Box>
        );
        
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {registrationComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircleIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 3 }} />
                <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                  Регистрация успешна!
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
                  Поздравляем! Ваш аккаунт успешно создан и вы можете войти, чтобы получить доступ к эксклюзивным предложениям и услугам Ferrari Moscow.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={goToLogin}
                    sx={{
                      backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                      color: 'white',
                      '&:hover': {
                        backgroundImage: 'linear-gradient(45deg, #FF4D4D 30%, #FF2800 90%)',
                      }
                    }}
                  >
                    Войти в аккаунт
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={goToHome}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      '&:hover': {
                        borderColor: '#FF2800',
                        color: '#FF2800'
                      }
                    }}
                  >
                    На главную
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Пожалуйста, проверьте введенные данные перед отправкой.
              </Typography>
            )}
          </Box>
        );
        
      default:
        return null;
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
                background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url("/images/ferrari-side.jpg")',
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
                src={ferrariLogo}
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
                  Уже есть аккаунт?
                </Typography>
                <Button
                  component={Link}
                  to="/login"
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
                  Войти
                </Button>
              </Box>
            </Grid>
            
            {/* Правая сторона - Форма регистрации */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: { xs: 4, md: 5 } }}>
                <Box 
                  component="img"
                  src={ferrariLogo}
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
                  Регистрация
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    mb: 4,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Создайте аккаунт, чтобы получить доступ к эксклюзивным предложениям
                </Typography>
                
                <Stepper 
                  activeStep={activeStep} 
                  alternativeLabel
                  sx={{ 
                    mb: 4,
                    '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiStepLabel-active': { color: 'white' },
                    '& .MuiStepLabel-completed': { color: '#FF2800' },
                    '& .MuiStepIcon-root.Mui-active': { color: '#FF2800' },
                    '& .MuiStepIcon-root.Mui-completed': { color: '#FF2800' }
                  }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                <form onSubmit={handleSubmit}>
                  {renderStepContent(activeStep)}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0 || registrationComplete}
                      sx={{
                        color: 'white',
                        '&:hover': { color: '#FF2800' },
                        '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' }
                      }}
                    >
                      Назад
                    </Button>
                    
                    {activeStep === steps.length - 1 ? (
                      !registrationComplete && (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
						  disabled={isLoading}
                          sx={{
                            backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                            color: 'white',
                            px: 4,
                            '&:hover': {
                              backgroundImage: 'linear-gradient(45deg, #FF4D4D 30%, #FF2800 90%)',
                            },
                            '&.Mui-disabled': { 
                              opacity: 0.6,
                              color: 'white' 
                            }
                          }}
                        >
                          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={isLoading || registrationComplete}
                        sx={{
                          backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                          color: 'white',
                          '&:hover': {
                            backgroundImage: 'linear-gradient(45deg, #FF4D4D 30%, #FF2800 90%)',
                          },
                          '&.Mui-disabled': { 
                            opacity: 0.6,
                            color: 'white' 
                          }
                        }}
                      >
                        Далее
                      </Button>
                    )}
                  </Box>
                </form>
                
                {activeStep === 0 && (
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                      Уже есть аккаунт?
                    </Typography>
                    <Button
                      component={Link}
                      to="/login"
                      variant="outlined"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        '&:hover': {
                          borderColor: '#FF2800',
                          color: '#FF2800'
                        }
                      }}
                    >
                      Войти
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;