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
  StepLabel
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

const TestDriveScheduler = ({ open, onClose, car }) => {
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
  const [availableTimeSlots, setAvailableTimeSlots] = useState([
    '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

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
      date
    });
  };

  const handleTimeChange = (time) => {
    setFormData({
      ...formData,
      time
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

  const handleSubmit = () => {
    // Here we would handle the actual API call
    console.log('Submitting test drive request:', {
      ...formData,
      carId: car?.id,
      carName: `${car?.brand} ${car?.model}`
    });
    setSubmitted(true);
    
    // Reset form after 3 seconds and close dialog
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: null,
        time: null,
        notes: ''
      });
      setActiveStep(0);
      onClose();
    }, 3000);
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
          disabled={submitted}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
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
                  Пожалуйста, выберите автомобиль из каталога
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
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Время</InputLabel>
                    <Select
                      value={formData.time ? formData.time.format('HH:mm') : ''}
                      onChange={(e) => handleTimeChange(dayjs(e.target.value, 'HH:mm'))}
                      sx={{ 
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                        '& .MuiSvgIcon-root': { color: 'white' }
                      }}
                    >
                      {availableTimeSlots.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Paper
                elevation={2}
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  backgroundColor: 'rgba(255, 40, 0, 0.1)',
                  border: '1px solid rgba(255, 40, 0, 0.2)',
                  borderRadius: '4px' 
                }}
              >
                <Typography variant="body2" color="rgba(255,255,255,0.9)">
                  <CalendarMonthIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 1 }} />
                  Тест-драйв длится около 30 минут. Просим прибыть за 15 минут до назначенного времени.
                </Typography>
              </Paper>
            </motion.div>
          )}
          
          {activeStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom>
                Укажите ваши контактные данные
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ваше имя"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
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
                required
                    error={!!phoneError}
                    helperText={phoneError}
                    placeholder="+7 (___) ___-__-__"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiFormHelperText-root': { color: 'error.main' }
                }}
              />
            </Grid>
                <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                    error={!!emailError}
                    helperText={emailError}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiFormHelperText-root': { color: 'error.main' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Дополнительная информация"
                name="notes"
                multiline
                    rows={3}
                value={formData.notes}
                onChange={handleChange}
                    placeholder="Укажите ваши пожелания или вопросы"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
          </Grid>
              
              <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ display: 'block', mt: 2 }}>
                Нажимая кнопку "Записаться", вы соглашаетесь с нашей <Box component="span" sx={{ color: '#FF2800', textDecoration: 'underline' }}>политикой конфиденциальности</Box>.
              </Typography>
            </motion.div>
          )}
          
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Заявка успешно отправлена!
                </Typography>
                <Typography variant="body1" color="rgba(255,255,255,0.7)" sx={{ maxWidth: '80%', mx: 'auto' }}>
                  Спасибо за ваш интерес к Ferrari. Наш менеджер свяжется с вами в ближайшее время для подтверждения записи.
                </Typography>
              </Box>
            </motion.div>
          )}
        </Box>
      </DialogContent>
      
      {!submitted && (
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 40, 0, 0.2)' }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} variant="outlined" color="inherit">
              Назад
            </Button>
          )}
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext} 
              variant="contained"
              disabled={isNextDisabled()}
              sx={{
                backgroundImage: 'linear-gradient(45deg, #FF2800, #FF4D4D)',
                color: 'white',
                '&:hover': {
                  backgroundImage: 'linear-gradient(45deg, #FF4D4D, #FF2800)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(255, 40, 0, 0.3)',
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Далее
        </Button>
          ) : (
        <Button 
          onClick={handleSubmit} 
          variant="contained"
              disabled={isNextDisabled()}
              sx={{
                backgroundImage: 'linear-gradient(45deg, #FF2800, #FF4D4D)',
                color: 'white',
                px: 4,
                '&:hover': {
                  backgroundImage: 'linear-gradient(45deg, #FF4D4D, #FF2800)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(255, 40, 0, 0.3)',
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }}
        >
          Записаться
        </Button>
          )}
      </DialogActions>
      )}
    </Dialog>
  );
};

export default TestDriveScheduler; 