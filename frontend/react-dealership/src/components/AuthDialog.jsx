import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, Typography, IconButton, Alert, Stepper, Step, StepLabel } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { authAPI } from '../services/api';

const AuthDialog = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    preferredContactMethod: 'email',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = isLogin
        ? await authAPI.login({ username: formData.username, password: formData.password })
        : await authAPI.register(formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Закрываем диалог
      onClose();
      
      // Перезагружаем страницу после успешного входа/регистрации
      window.location.reload();
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      const errorMessage = err.response?.data?.error || 'Произошла ошибка';
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Шаги регистрации
  const steps = ['Основная информация', 'Контактные данные'];
  
  // Валидация шага
  const isStepValid = (step) => {
    if (step === 0) {
      return formData.username && formData.password && formData.fullName && formData.email;
    }
    return true; // Необязательные поля на втором шаге
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        component: motion.div,
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        sx: { 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white',
          borderRadius: '16px',
          minWidth: '400px'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, color: 'white' }}>
        {isLogin ? 'Вход' : 'Регистрация'}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {!isLogin && (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ color: 'white', '& .MuiStepLabel-label': { color: 'white' } }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Имя пользователя"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Пароль"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`register-step-${activeStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {activeStep === 0 ? (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Имя пользователя"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Полное имя"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Пароль"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Телефон"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Адрес"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Город"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Страна"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {isLogin ? (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Войти
            </Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
              {activeStep > 0 && (
                <Button 
                  onClick={handleBackStep}
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Назад
                </Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button 
                  onClick={handleNextStep}
                  variant="contained"
                  disabled={!isStepValid(activeStep)}
                  sx={{ ml: 'auto' }}
                >
                  Далее
                </Button>
              ) : (
                <Button 
                  type="submit"
                  variant="contained"
                  disabled={!isStepValid(activeStep)}
                  sx={{ ml: 'auto' }}
                >
                  Зарегистрироваться
                </Button>
              )}
            </Box>
          )}
          
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ cursor: 'pointer', color: 'primary.main' }}
            onClick={() => {
              setIsLogin(!isLogin);
              setActiveStep(0);
            }}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog; 