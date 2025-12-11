import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Divider,
  Paper,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Link
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { testDriveAPI } from '../services/api';

const TestDriveScheduler = ({ open, onClose, car }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: null,
    time: null,
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  // Initialize form data with user info if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Validate phone number
  useEffect(() => {
    if (formData.phone && !/^\+?[0-9]{10,12}$/.test(formData.phone)) {
      setPhoneError('Пожалуйста, введите корректный номер телефона');
    } else {
      setPhoneError('');
    }
  }, [formData.phone]);
  
  // Validate email
  useEffect(() => {
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError('Пожалуйста, введите корректный email');
    } else {
      setEmailError('');
    }
  }, [formData.email]);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (formData.date && car?.id) {
      fetchAvailableTimeSlots(formData.date, car.id);
    }
  }, [formData.date, car]);

  const fetchAvailableTimeSlots = async (date, carId) => {
    try {
      setIsLoadingTimeSlots(true);
      // Format date to string
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      
      // Try to fetch time slots from API
      try {
        const response = await testDriveAPI.getAvailableTimes(formattedDate, carId);
        setAvailableTimeSlots(response.data || []);
      } catch (error) {
        console.error('Ошибка при получении доступных временных слотов:', error);
        // Fallback to default time slots
        setAvailableTimeSlots([
          '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ]);
      }
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  const steps = ['Выбор автомобиля', 'Выбор даты и времени', 'Личные данные'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
      time: null // Reset time when date changes
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !car;
    } else if (activeStep === 1) {
      return !formData.date || !formData.time;
    } else if (activeStep === 2) {
      return !formData.name || !formData.phone || phoneError || (formData.email && emailError);
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError('Для записи на тест-драйв необходимо войти в систему');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Prepare the scheduledDate by combining date and time
      const date = dayjs(formData.date);
      const time = formData.time.split(':');
      const hours = parseInt(time[0]);
      const minutes = parseInt(time[1]);
      
      const scheduledDate = date.hour(hours).minute(minutes).second(0).toDate();
      
      // Prepare the data
      const testDriveData = {
        carId: car.id,
        scheduledDate,
        duration: 60, // Default duration in minutes
        notes: formData.notes,
        // Customer information is already stored in user profile
        // and will be associated from the authenticated session
      };
      
      // Submit to API
      await testDriveAPI.createTestDrive(testDriveData);
      
      setSubmitted(true);
      
      // Reset form after 3 seconds and close dialog
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: user?.fullName || '',
          phone: user?.phone || '',
          email: user?.email || '',
          date: null,
          time: null,
          notes: ''
        });
        setActiveStep(0);
        onClose();
      }, 3000);
      
    } catch (err) {
      console.error('Ошибка при отправке заявки на тест-драйв:', err);
      setError(err.response?.data?.error || 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    onClose();
    navigate('/login', { state: { from: '/test-drive' } });
  };

  return (
    <Dialog 
      open={open} 
      onClose={submitted ? null : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: motion.div,
        layout: true,
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(to bottom, #000000, #111111)',
          color: 'white',
          border: '1px solid rgba(255, 40, 0, 0.3)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 40, 0, 0.2)',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon sx={{ mr: 1, color: '#FF2800' }} />
        <Typography variant="h5" fontWeight="bold">
            Запись на тест-драйв Ferrari
        </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'rgba(255,255,255,0.7)' }}
          disabled={submitted || loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {!isAuthenticated ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="info" sx={{ mb: 3, backgroundColor: 'rgba(13, 59, 102, 0.15)', color: 'white' }}>
              Для записи на тест-драйв необходимо войти в систему
            </Alert>
            <Button 
              variant="contained" 
              onClick={handleRedirectToLogin}
              sx={{
                backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Войти в систему
            </Button>
          </Box>
        ) : (
          <>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel
              sx={{ 
                pt: 4, 
                pb: 2,
                px: 3,
                backgroundColor: 'rgba(0,0,0,0.3)',
                '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiStepLabel-completed': { color: '#FF2800' },
                '& .MuiStepLabel-active': { color: '#FF2800' }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mx: 3, 
                  mt: 3, 
                  backgroundColor: 'rgba(211, 47, 47, 0.1)', 
                  color: 'white',
                  border: '1px solid rgba(211, 47, 47, 0.3)'
                }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}
            
            <Box sx={{ py: 4, px: 3 }}>
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Выберите автомобиль для тест-драйва
                  </Typography>
                  
                  {car ? (
                    <Paper 
                      elevation={3} 
                      sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        mt: 2
                      }}
                    >
                      {car.imageUrl && (
                        <Box sx={{ mr: { sm: 3 }, mb: { xs: 2, sm: 0 }, width: { xs: '100%', sm: '150px' } }}>
                          <img 
                            src={car.imageUrl} 
                            alt={`${car.brand} ${car.model}`} 
                            style={{ width: '100%', borderRadius: '4px' }} 
                          />
                        </Box>
                      )}
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="#FF2800">
                          {car.brand} {car.model}
                        </Typography>
                        <Typography variant="body1" color="rgba(255,255,255,0.7)">
                          {car.year} • {car.engineType} • {car.horsepower} л.с.
                        </Typography>
                  <Chip 
                          label="Выбрано" 
                    color="primary"
                          size="small"
                          icon={<CheckCircleIcon />}
                          sx={{ mt: 1 }}
                  />
                </Box>
                    </Paper>
                  ) : (
                    <Typography variant="body1" color="error">
                      Пожалуйста, выберите автомобиль для тест-драйва
                    </Typography>
                  )}
                </motion.div>
              )}
              
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Выберите удобную дату и время
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Дата тест-драйва"
                          value={formData.date}
                          onChange={handleDateChange}
                          disablePast
                          sx={{ 
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                          }}
                          // Disable weekends (for example)
                          shouldDisableDate={(date) => {
                            const day = date.day();
                            return day === 0; // Disable Sundays
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl 
                        fullWidth
                        disabled={!formData.date || isLoadingTimeSlots}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          },
                          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                        }}
                      >
                        <InputLabel id="time-select-label">Время</InputLabel>
                        <Select
                          labelId="time-select-label"
                          id="time-select"
                          value={formData.time || ''}
                          name="time"
                          onChange={handleChange}
                          label="Время"
                        >
                          {isLoadingTimeSlots ? (
                            <MenuItem value="" disabled>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Загрузка доступного времени...
                              </Box>
                            </MenuItem>
                          ) : availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="" disabled>
                              Нет доступного времени на эту дату
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)">
                      Продолжительность тест-драйва составляет 60 минут. Пожалуйста, приходите за 15 минут до назначенного времени для оформления документов.
                    </Typography>
                  </Box>
                </motion.div>
              )}
              
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Заполните личные данные
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="ФИО"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        InputProps={{
                          sx: { color: 'white' }
                        }}
                        InputLabelProps={{
                          sx: { color: 'rgba(255,255,255,0.7)' }
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Телефон"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!!phoneError}
                        helperText={phoneError}
                        InputProps={{
                          sx: { color: 'white' }
                        }}
                        InputLabelProps={{
                          sx: { color: 'rgba(255,255,255,0.7)' }
                        }}
                        FormHelperTextProps={{
                          sx: { color: 'error.main' }
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        error={!!emailError}
                        helperText={emailError}
                        InputProps={{
                          sx: { color: 'white' }
                        }}
                        InputLabelProps={{
                          sx: { color: 'rgba(255,255,255,0.7)' }
                        }}
                        FormHelperTextProps={{
                          sx: { color: 'error.main' }
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Дополнительная информация или пожелания"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={3}
                        InputProps={{
                          sx: { color: 'white' }
                        }}
                        InputLabelProps={{
                          sx: { color: 'rgba(255,255,255,0.7)' }
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#FF2800' }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 3, 
                      backgroundColor: 'rgba(13, 59, 102, 0.15)', 
                      color: 'white',
                      border: '1px solid rgba(13, 59, 102, 0.3)'
                    }}
                  >
                    Для участия в тест-драйве необходимо иметь при себе паспорт и водительское удостоверение.
                  </Alert>
                </motion.div>
              )}
              
              {submitted && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        fontSize: 60, 
                        color: '#FF2800',
                        mb: 2
                      }} 
                    />
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Ваша заявка успешно отправлена!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, maxWidth: '80%' }}>
                      Мы свяжемся с вами в ближайшее время для подтверждения записи на тест-драйв {car?.brand} {car?.model}.
                    </Typography>
                    <Chip 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">
                            {formData.date && formData.time ? 
                              `${dayjs(formData.date).format('DD.MM.YYYY')} в ${formData.time}` : 
                              'Дата будет согласована'
                            }
                          </Typography>
                        </Box>
                      }
                      sx={{ 
                        backgroundColor: 'rgba(255,40,0,0.1)', 
                        color: 'white',
                        borderColor: 'rgba(255,40,0,0.3)',
                        border: '1px solid',
                        p: 1
                      }}
                    />
                  </Box>
                </motion.div>
              )}
            </Box>
          </>
        )}
      </DialogContent>
      
      {isAuthenticated && !submitted && (
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 40, 0, 0.2)' }}>
          {activeStep > 0 && (
            <Button 
              onClick={handleBack}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
              disabled={loading}
            >
              Назад
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {activeStep < steps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={isNextDisabled()}
              sx={{
                backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Далее
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={isNextDisabled() || loading}
              sx={{
                backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                color: 'white',
                fontWeight: 'bold'
              }}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Отправка...' : 'Записаться на тест-драйв'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default TestDriveScheduler; 