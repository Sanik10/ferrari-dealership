import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  Collapse,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import { ru } from 'date-fns/locale';

// Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SpeedIcon from '@mui/icons-material/Speed';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ConstructionIcon from '@mui/icons-material/Construction';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import TuneIcon from '@mui/icons-material/Tune';
import AirIcon from '@mui/icons-material/Air';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';

// API
import { serviceAPI, userAPI } from '../services/api';

// Define InfoIcon
const InfoIcon = ErrorOutlineIcon;

// Styled components
const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '.MuiStepLabel-label': {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    '&.Mui-active': {
      color: '#FF2800',
      fontWeight: 'bold'
    },
    '&.Mui-completed': {
      color: '#FF2800',
      fontWeight: 'bold'
    }
  },
  '.MuiStepIcon-root': {
    color: 'rgba(255, 255, 255, 0.3)',
    '&.Mui-active': {
      color: '#FF2800'
    },
    '&.Mui-completed': {
      color: '#FF2800'
    }
  }
}));

const ServiceAppointment = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // State variables
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointmentComplete, setAppointmentComplete] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [userCars, setUserCars] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState({
    carId: '',
    carModel: '',
    carYear: '',
    carVin: '',
    serviceType: '',
    customServices: [],
    date: null,
    timeSlot: '',
    description: '',
    contactPreference: 'phone',
    name: '',
    phone: '',
    email: '',
    notifyByEmail: true,
    notifyBySMS: false,
    terms: false
  });
  
  // Service packages
  const servicePackages = [
    {
      id: 'regular',
      name: 'Регулярное техническое обслуживание',
      description: 'Стандартное плановое обслуживание для поддержания вашего Ferrari в идеальном состоянии',
      price: '80 000',
      benefits: [
        'Замена моторного масла и фильтров',
        'Проверка всех жидкостей и уровней',
        'Диагностика электронных систем',
        'Проверка тормозной системы',
        'Проверка подвески',
        'Проверка внешнего вида и интерьера'
      ],
      recommendedInterval: 'Каждые 10,000 км или раз в год',
      icon: <TuneIcon sx={{ fontSize: 40, color: '#FF2800' }} />
    },
    {
      id: 'comprehensive',
      name: 'Комплексное обслуживание',
      description: 'Расширенный комплекс услуг для обеспечения превосходной производительности вашего Ferrari',
      price: '180 000',
      benefits: [
        'Все услуги регулярного обслуживания',
        'Замена трансмиссионной жидкости',
        'Проверка и обслуживание системы охлаждения',
        'Диагностика и настройка электроники',
        'Проверка системы кондиционирования',
        'Балансировка и регулировка колес'
      ],
      recommendedInterval: 'Каждые 20,000 км или раз в 2 года',
      icon: <BuildIcon sx={{ fontSize: 40, color: '#FF2800' }} />
    },
    {
      id: 'premium',
      name: 'Премиум обслуживание',
      description: 'Полное обслуживание с дополнительными проверками и обновлениями для максимальной надежности',
      price: '280 000',
      benefits: [
        'Все услуги комплексного обслуживания',
        'Замена топливного фильтра',
        'Проверка и регулировка клапанов',
        'Обслуживание системы сцепления',
        'Диагностика и очистка инжекторов',
        'Проверка и настройка программного обеспечения'
      ],
      recommendedInterval: 'Каждые 30,000 км или раз в 3 года',
      icon: <EngineeringIcon sx={{ fontSize: 40, color: '#FF2800' }} />
    }
  ];
  
  // Available services for custom selection
  const availableServices = [
    { id: 'oil_change', name: 'Замена масла', price: '30 000', icon: <OilBarrelIcon /> },
    { id: 'brake_service', name: 'Обслуживание тормозной системы', price: '45 000', icon: <SpeedIcon /> },
    { id: 'suspension_check', name: 'Проверка и регулировка подвески', price: '60 000', icon: <ConstructionIcon /> },
    { id: 'electronics_diagnostics', name: 'Диагностика электронных систем', price: '35 000', icon: <TuneIcon /> },
    { id: 'ac_service', name: 'Обслуживание системы кондиционирования', price: '25 000', icon: <AirIcon /> },
    { id: 'wheel_alignment', name: 'Развал-схождение', price: '40 000', icon: <DirectionsCarIcon /> },
    { id: 'full_diagnostics', name: 'Полная техническая диагностика', price: '70 000', icon: <BuildIcon /> },
    { id: 'transmission_service', name: 'Обслуживание трансмиссии', price: '85 000', icon: <EngineeringIcon /> }
  ];
  
  // Faking available time slots (in a real app, these would come from the API)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  // Fetch user's cars and available service types on component mount
  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getUserCars();
        setUserCars(response.data || []);
        
        // If user has cars, select the first one by default
        if (response.data && response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            carId: response.data[0].id,
            carModel: response.data[0].model,
            carYear: response.data[0].year,
            carVin: response.data[0].vin
          }));
        }
        
        // Get available service types - comment out unused API call
        // const serviceResponse = await serviceAPI.getServiceTypes();
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCars();
  }, []);
  
  // Handle date change to fetch available time slots
  useEffect(() => {
    if (formData.date) {
      fetchAvailableTimeSlots(formData.date);
    }
  }, [formData.date, fetchAvailableTimeSlots]);
  
  // Fetch available time slots for a given date
  const fetchAvailableTimeSlots = useCallback(async (date) => {
    try {
      setLoading(true);
      // In a real app, you would call an API to get available slots for the selected date
      // For now, we'll simulate a response
      
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Randomly remove some time slots to simulate unavailability
      const available = timeSlots.filter(() => Math.random() > 0.3);
      setAvailableSlots(available);
      
      // Clear previously selected time slot if it's no longer available
      if (formData.timeSlot && !available.includes(formData.timeSlot)) {
        setFormData(prev => ({ ...prev, timeSlot: '' }));
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setError('Не удалось загрузить доступное время. Пожалуйста, выберите другую дату.');
    } finally {
      setLoading(false);
    }
  }, [timeSlots, formData.timeSlot, setFormData, setAvailableSlots, setLoading, setError]);
  
  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    
    if (type === 'checkbox') {
      if (name === 'terms' || name === 'notifyByEmail' || name === 'notifyBySMS') {
        setFormData({
          ...formData,
          [name]: checked
        });
      } else {
        // For custom services checkboxes
        const updatedServices = checked
          ? [...formData.customServices, value]
          : formData.customServices.filter(service => service !== value);
        
        setFormData({
          ...formData,
          customServices: updatedServices
        });
      }
    } else {
      // For regular inputs
      setFormData({
        ...formData,
        [name]: value
      });
      
      // If selecting a car, update related fields
      if (name === 'carId' && value) {
        const selectedCar = userCars.find(car => car.id === value);
        if (selectedCar) {
          setFormData(prev => ({
            ...prev,
            carId: selectedCar.id,
            carModel: selectedCar.model,
            carYear: selectedCar.year,
            carVin: selectedCar.vin
          }));
        }
      }
    }
  };
  
  // Handle date change
  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate
    });
    
    // Clear selected time slot when date changes
    setFormData(prev => ({
      ...prev,
      date: newDate,
      timeSlot: ''
    }));
  };
  
  // Handle service package selection
  const handleServicePackageSelect = (packageId) => {
    setFormData({
      ...formData,
      serviceType: packageId,
      customServices: [] // Clear custom services when a package is selected
    });
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      // Reset custom services if switching to packages tab
      setFormData(prev => ({
        ...prev,
        customServices: []
      }));
    } else {
      // Reset service type if switching to custom tab
      setFormData(prev => ({
        ...prev,
        serviceType: ''
      }));
    }
  };
  
  // Handle step navigation
  const handleNext = () => {
    // Validate current step before proceeding
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Validate the current step's data
  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0: // Car selection
        if (!formData.carId && (!formData.carModel || !formData.carYear)) {
          setError('Пожалуйста, выберите автомобиль или введите информацию о нем');
          return false;
        }
        setError(null);
        return true;
        
      case 1: // Service selection
        if (!formData.serviceType && formData.customServices.length === 0) {
          setError('Пожалуйста, выберите тип обслуживания или отдельные услуги');
          return false;
        }
        setError(null);
        return true;
        
      case 2: // Date and time
        if (!formData.date || !formData.timeSlot) {
          setError('Пожалуйста, выберите дату и время');
          return false;
        }
        setError(null);
        return true;
        
      case 3: // Contact info
        if (!formData.name || !formData.phone || !formData.email) {
          setError('Пожалуйста, заполните все контактные данные');
          return false;
        }
        if (!formData.terms) {
          setError('Необходимо принять условия сервисного обслуживания');
          return false;
        }
        setError(null);
        return true;
        
      default:
        return true;
    }
  };
  
  // Submit the appointment
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would submit the form data to your backend
      const response = await serviceAPI.createAppointment(formData);
      
      // Set the reference number from the response
      setReferenceNumber(response.data.referenceNumber || 'SF-' + Math.floor(Math.random() * 10000));
      
      // Mark the appointment as complete
      setAppointmentComplete(true);
      
      // Move to the confirmation step
      setActiveStep(4);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      setError('Не удалось создать запись на сервис. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    
    // Add package price if selected
    if (formData.serviceType) {
      const selectedPackage = servicePackages.find(pkg => pkg.id === formData.serviceType);
      if (selectedPackage) {
        total += parseInt(selectedPackage.price.replace(/\s/g, ''), 10);
      }
    }
    
    // Add custom services prices
    formData.customServices.forEach(serviceId => {
      const service = availableServices.find(s => s.id === serviceId);
      if (service) {
        total += parseInt(service.price.replace(/\s/g, ''), 10);
      }
    });
    
    return total;
  };
  
  // Format number with thousand separators
  const formatNumber = (number) => {
    return new Intl.NumberFormat('ru-RU').format(number);
  };
  
  // Get selected car details
  const getSelectedCarDetails = () => {
    if (formData.carId) {
      const car = userCars.find(c => c.id === formData.carId);
      return car ? `${car.brand} ${car.model} (${car.year})` : 'Автомобиль не выбран';
    } else if (formData.carModel) {
      return `${formData.carModel} (${formData.carYear})`;
    }
    return 'Автомобиль не выбран';
  };
  
  // Get the name of a service by its ID
  const getServiceNameById = (id) => {
    const service = availableServices.find(s => s.id === id);
    return service ? service.name : '';
  };
  
  // Create the service description string
  const getServiceDescription = () => {
    if (formData.serviceType) {
      const selectedPackage = servicePackages.find(pkg => pkg.id === formData.serviceType);
      return selectedPackage ? selectedPackage.name : '';
    } else if (formData.customServices.length > 0) {
      return formData.customServices.map(id => getServiceNameById(id)).join(', ');
    }
    return 'Услуги не выбраны';
  };
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ru-RU', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Steps for the service appointment process
  const steps = [
    {
      label: 'Информация об автомобиле',
      content: (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsCarIcon sx={{ color: '#FF2800', mr: 1 }} />
            Выберите автомобиль
          </Typography>
          
          {userCars.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  name="carId"
                  value={formData.carId}
                  onChange={handleInputChange}
                >
                  <Grid container spacing={2}>
                    {userCars.map((car) => (
                      <Grid item xs={12} md={6} key={car.id}>
                        <Paper sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(30,30,30,0.8)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '8px',
                          border: formData.carId === car.id ? '2px solid #FF2800' : '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 20px rgba(255, 40, 0, 0.2)'
                          }
                        }}>
                          <FormControlLabel
                            value={car.id}
                            control={
                              <Radio 
                                sx={{
                                  color: 'rgba(255,255,255,0.5)',
                                  '&.Mui-checked': {
                                    color: '#FF2800',
                                  },
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {car.brand} {car.model}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  Год выпуска: {car.year}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  VIN: {car.vin}
                                </Typography>
                              </Box>
                            }
                            sx={{ alignItems: 'flex-start', ml: 0 }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Box>
          ) : (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3, 
                backgroundColor: 'rgba(66, 66, 255, 0.1)', 
                color: 'white',
                border: '1px solid rgba(66, 66, 255, 0.3)'
              }}
            >
              У вас еще нет зарегистрированных автомобилей. Пожалуйста, укажите информацию о вашем автомобиле ниже.
            </Alert>
          )}
          
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Или укажите информацию о вашем автомобиле
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Модель Ferrari"
                name="carModel"
                value={formData.carModel}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Например: Ferrari 488 GTB"
                margin="normal"
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF2800',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Год выпуска"
                name="carYear"
                value={formData.carYear}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Например: 2022"
                margin="normal"
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF2800',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="VIN номер (если известен)"
                name="carVin"
                value={formData.carVin}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Например: ZFF79ALA6H0223533"
                margin="normal"
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF2800',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <InfoIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#FF2800' }} />
              Указание VIN номера помогает нам лучше подготовиться к сервисному обслуживанию и точнее диагностировать потенциальные проблемы.
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      label: 'Выбор услуг',
      content: (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <BuildIcon sx={{ color: '#FF2800', mr: 1 }} />
            Выберите тип обслуживания
          </Typography>
          
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              mb: 3,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-selected': {
                  color: '#FF2800',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FF2800',
              },
            }}
          >
            <Tab label="Сервисные пакеты" />
            <Tab label="Индивидуальные услуги" />
          </Tabs>
          
          <Box role="tabpanel" hidden={selectedTab !== 0}>
            {selectedTab === 0 && (
              <Grid container spacing={3}>
                {servicePackages.map((pkg) => (
                  <Grid item xs={12} md={4} key={pkg.id}>
                    <Paper
                      sx={{ 
                        p: 3, 
                        height: '100%', 
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'rgba(30,30,30,0.8)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: formData.serviceType === pkg.id ? '2px solid #FF2800' : '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(255, 40, 0, 0.2)'
                        }
                      }}
                      onClick={() => handleServicePackageSelect(pkg.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {pkg.icon}
                        <Typography variant="h6" sx={{ ml: 2 }} fontWeight="bold">
                          {pkg.name}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                        {pkg.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                          Рекомендуемая периодичность:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {pkg.recommendedInterval}
                        </Typography>
                      </Box>
                      
					  <Box sx={{ mb: 2, flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                          Включенные услуги:
                        </Typography>
                        <List dense disablePadding>
                          {pkg.benefits.map((benefit, index) => (
                            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckIcon sx={{ color: '#FF2800', fontSize: 18 }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={benefit} 
                                primaryTypographyProps={{ 
                                  variant: 'body2', 
                                  color: 'rgba(255,255,255,0.8)'
                                }} 
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Typography variant="h6" fontWeight="bold" color="#FF2800">
                          {pkg.price} ₽
                        </Typography>
                        
                        <Radio
                          checked={formData.serviceType === pkg.id}
                          onChange={() => handleServicePackageSelect(pkg.id)}
                          sx={{
                            color: 'rgba(255,255,255,0.5)',
                            '&.Mui-checked': {
                              color: '#FF2800',
                            },
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          
          <Box role="tabpanel" hidden={selectedTab !== 1}>
            {selectedTab === 1 && (
              <Grid container spacing={2}>
                {availableServices.map((service) => (
                  <Grid item xs={12} sm={6} md={4} key={service.id}>
                    <Paper
                      sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(30,30,30,0.8)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '8px',
                        border: formData.customServices.includes(service.id) ? '2px solid #FF2800' : '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(255, 40, 0, 0.2)'
                        }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.customServices.includes(service.id)}
                            onChange={handleInputChange}
                            name="customService"
                            value={service.id}
                            sx={{
                              color: 'rgba(255,255,255,0.5)',
                              '&.Mui-checked': {
                                color: '#FF2800',
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ mr: 1, color: '#FF2800' }}>
                                {service.icon}
                              </Box>
                              <Typography variant="subtitle2">{service.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FF2800' }}>
                                {service.price} ₽
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ alignItems: 'flex-start', ml: 0 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Опишите проблему или дополнительные требования
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            variant="outlined"
            placeholder="Опишите конкретные проблемы или симптомы, которые вы заметили, или любые особые требования к сервисному обслуживанию..."
            margin="normal"
            InputProps={{
              sx: { 
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF2800',
                }
              }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <WarningIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: '#FF2800' }} />
              Чем более подробное описание вы предоставите, тем эффективнее мы сможем подготовиться к сервисному обслуживанию вашего автомобиля.
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      label: 'Выбор даты и времени',
      content: (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarMonthIcon sx={{ color: '#FF2800', mr: 1 }} />
            Выберите удобную дату и время
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Дата
              </Typography>
              
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                <DatePicker
                  disablePast
                  value={formData.date}
                  onChange={handleDateChange}
                  shouldDisableDate={(date) => {
                    // Disable weekends (Saturday and Sunday)
                    return date.getDay() === 0 || date.getDay() === 6;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        sx: { 
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF2800',
                          }
                        }
                      }}
                      InputLabelProps={{
                        sx: { color: 'rgba(255, 255, 255, 0.7)' }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
                Сервисный центр работает с понедельника по пятницу, с 9:00 до 18:00
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Время
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                {formData.date ? (
                  loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={24} sx={{ color: '#FF2800' }} />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        Загрузка доступного времени...
                      </Typography>
                    </Box>
                  ) : availableSlots.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={formData.timeSlot === slot ? "contained" : "outlined"}
                          onClick={() => setFormData({...formData, timeSlot: slot})}
                          sx={{
                            minWidth: '80px',
                            bgcolor: formData.timeSlot === slot ? '#FF2800' : 'transparent',
                            color: formData.timeSlot === slot ? 'white' : 'rgba(255,255,255,0.7)',
                            borderColor: formData.timeSlot === slot ? '#FF2800' : 'rgba(255,255,255,0.3)',
                            '&:hover': {
                              bgcolor: formData.timeSlot === slot ? '#FF2800' : 'rgba(255,40,0,0.1)',
                              borderColor: '#FF2800'
                            }
                          }}
                        >
                          {slot}
                        </Button>
                      ))}
                    </Box>
                  ) : (
                    <Alert 
                      severity="warning" 
                      sx={{ 
                        backgroundColor: 'rgba(255, 167, 38, 0.1)', 
                        color: 'white',
                        border: '1px solid rgba(255, 167, 38, 0.3)'
                      }}
                    >
                      На выбранную дату нет доступного времени. Пожалуйста, выберите другую дату.
                    </Alert>
                  )
                ) : (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Пожалуйста, сначала выберите дату
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(255,40,0,0.1)', borderRadius: '8px', border: '1px solid rgba(255,40,0,0.2)' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              <TimerIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
              Важная информация
            </Typography>
            <Typography variant="body2" paragraph>
              Пожалуйста, приезжайте за 15 минут до назначенного времени для оформления документов.
            </Typography>
            <Typography variant="body2">
              В среднем, сервисное обслуживание занимает от 1 до 4 часов в зависимости от типа выбранных услуг и модели автомобиля.
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      label: 'Подтверждение',
      content: (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Контактная информация
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ваше имя"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                required
                margin="normal"
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF2800',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Телефон"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                required
                margin="normal"
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF2800',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                required
                margin="normal"
                InputProps={{
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF2800',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Варианты уведомлений
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.notifyByEmail}
                  onChange={handleInputChange}
                  name="notifyByEmail"
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    '&.Mui-checked': {
                      color: '#FF2800',
                    },
                  }}
                />
              }
              label="Получать уведомления по Email"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.notifyBySMS}
                  onChange={handleInputChange}
                  name="notifyBySMS"
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    '&.Mui-checked': {
                      color: '#FF2800',
                    },
                  }}
                />
              }
              label="Получать SMS-уведомления"
            />
          </Box>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Сводка заявки
          </Typography>
          
          <Paper sx={{ 
            p: 3, 
            mb: 3, 
            bgcolor: 'rgba(30,30,30,0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Автомобиль:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {getSelectedCarDetails()}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Услуги:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {getServiceDescription()}
                  </Typography>
                </Box>
                
                {formData.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Описание проблемы:
                    </Typography>
                    <Typography variant="body2">
                      {formData.description}
                    </Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Дата и время:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(formData.date)}, {formData.timeSlot}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Контактная информация:
                  </Typography>
                  <Typography variant="body2">
                    {formData.name}, {formData.phone}, {formData.email}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                    Предпочтительный способ связи: {formData.contactPreference === 'phone' ? 'По телефону' : 'По email'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Предварительная стоимость:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#FF2800">
                    {formatNumber(calculateTotal())} ₽
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                    Окончательная стоимость может измениться после диагностики
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.terms}
                onChange={handleInputChange}
                name="terms"
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  '&.Mui-checked': {
                    color: '#FF2800',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2">
                Я согласен с <Link href="#" sx={{ color: '#FF2800', textDecoration: 'none' }}>условиями сервисного обслуживания</Link> и <Link href="#" sx={{ color: '#FF2800', textDecoration: 'none' }}>политикой конфиденциальности</Link>
              </Typography>
            }
          />
        </Box>
      )
    },
    {
      label: 'Готово',
      content: (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          {appointmentComplete ? (
            <>
              <Box 
                component={motion.div}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  width: 100, 
                  height: 100,
                  bgcolor: 'rgba(255,40,0,0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 4
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#FF2800' }} />
              </Box>
              
              <Typography 
                variant="h4" 
                component={motion.h4}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                gutterBottom 
                fontWeight="bold"
              >
                Ваша заявка успешно отправлена!
              </Typography>
              
              <Typography 
                variant="h6"
                component={motion.h6}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ mb: 4, color: 'rgba(255,255,255,0.7)' }}
              >
                Номер заявки: <span style={{ color: '#FF2800', fontWeight: 'bold' }}>{referenceNumber}</span>
              </Typography>
              
              <Box 
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Paper sx={{ 
                  p: 3, 
                  mb: 4, 
                  maxWidth: 600, 
                  mx: 'auto',
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,40,0,0.2)'
                }}>
                  <Typography variant="body1" paragraph>
                    Благодарим вас за запись на сервисное обслуживание. Наш менеджер свяжется с вами в ближайшее время для подтверждения деталей вашего визита.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    Вы получите подтверждение заявки на указанный email: <strong>{formData.email}</strong>
                  </Typography>
                  
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                      <CalendarMonthIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 1, color: '#FF2800' }} />
                      Детали записи:
                    </Typography>
                    <Typography variant="body2">
                      Дата: <strong>{formatDate(formData.date)}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Время: <strong>{formData.timeSlot}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Услуги: <strong>{getServiceDescription()}</strong>
                    </Typography>
                  </Box>
                </Paper>
              </Box>
              
              <Box 
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate('/profile')}
                  sx={{
                    backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                    color: 'white',
                    py: 1.5,
                    px: 3
                  }}
                >
                  Мои записи
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    py: 1.5,
                    px: 3,
                    '&:hover': {
                      borderColor: '#FF2800',
                      color: '#FF2800',
                      backgroundColor: 'rgba(255,40,0,0.05)'
                    }
                  }}
                >
                  На главную
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ py: 8 }}>
              <CircularProgress sx={{ color: '#FF2800' }} />
              <Typography variant="h6" sx={{ mt: 3 }}>
                Отправка заявки...
              </Typography>
            </Box>
          )}
        </Box>
      )
    }
  ];
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url("/images/ferrari-service-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        pt: 12,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="overline" 
            component="div" 
            sx={{ 
              color: '#FF2800', 
              fontWeight: 'bold',
              letterSpacing: 2,
              mb: 1
            }}
          >
            FERRARI MOSCOW
          </Typography>
          
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            СЕРВИСНОЕ ОБСЛУЖИВАНИЕ
          </Typography>
          
          <Divider 
            sx={{ 
              width: '80px', 
              mx: 'auto', 
              my: 3,
              borderColor: '#FF2800',
              borderWidth: 2
            }} 
          />
          
          <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', opacity: 0.9 }}>
            Доверьте ваш Ferrari профессионалам с многолетним опытом обслуживания элитных автомобилей
          </Typography>
        </Box>
        
        {/* Error message if any */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              backgroundColor: 'rgba(211, 47, 47, 0.1)', 
              color: 'white',
              border: '1px solid rgba(211, 47, 47, 0.3)'
            }}
          >
            {error}
          </Alert>
        )}
        
        <Grid container spacing={4}>
          {/* Stepper on the left */}
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              position: isSmallScreen ? 'static' : 'sticky', 
              top: 100
            }}>
              <Paper 
                sx={{ 
                  p: 3,
                  bgcolor: 'rgba(20,20,20,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step) => (
                    <Step key={step.label}>
                      <StyledStepLabel>{step.label}</StyledStepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
              
              {activeStep < 4 && !loading && (
                <Box sx={{ 
                  mt: 3, 
                  p: 3,
                  bgcolor: 'rgba(255,40,0,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,40,0,0.2)'
                }}
                >
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Наши преимущества
                  </Typography>
                  
                  <List dense>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 30, color: '#FF2800' }}>
                        <CheckIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Сертифицированные специалисты" 
                        primaryTypographyProps={{ variant: 'body2' }} 
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 30, color: '#FF2800' }}>
                        <CheckIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Оригинальные запчасти" 
                        primaryTypographyProps={{ variant: 'body2' }} 
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 30, color: '#FF2800' }}>
                        <CheckIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Гарантия на все работы" 
                        primaryTypographyProps={{ variant: 'body2' }} 
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 30, color: '#FF2800' }}>
                        <CheckIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Современное оборудование" 
                        primaryTypographyProps={{ variant: 'body2' }} 
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="subtitle2" sx={{ mt: 2, color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                    Мы используем только оригинальные запчасти и новейшее оборудование для диагностики и обслуживания вашего Ferrari.
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
          
          {/* Content area */}
          <Grid item xs={12} md={9}>
            <Paper 
              sx={{ 
                p: { xs: 2, md: 4 },
                bgcolor: 'rgba(20,20,20,0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {/* Step content */}
              {steps[activeStep].content}
              
              {/* Navigation buttons */}
              {activeStep < 4 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{
                      color: activeStep === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        color: activeStep === 0 ? 'rgba(255,255,255,0.3)' : 'white'
                      }
                    }}
                  >
                    Назад
                  </Button>
                  
                  <Button
                    variant="contained"
                    onClick={activeStep === 3 ? handleSubmit : handleNext}
                    disabled={loading}
                    sx={{
                      bgcolor: '#FF2800',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#cc2000'
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'rgba(255,40,0,0.3)',
                        color: 'rgba(255,255,255,0.5)'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                        Загрузка...
                      </>
                    ) : activeStep === 3 ? (
                      'Подтвердить запись'
                    ) : (
                      'Продолжить'
                    )}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        
        {/* Advantages section */}
        {activeStep < 4 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
              Почему выбирают наш сервисный центр?
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <EngineeringIcon sx={{ fontSize: 50, color: '#FF2800', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Экспертиза
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Наши инженеры проходят обучение на заводе Ferrari и имеют многолетний опыт обслуживания спортивных автомобилей.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <BuildIcon sx={{ fontSize: 50, color: '#FF2800', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Оригинальные запчасти
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Мы используем только оригинальные запчасти Ferrari, что гарантирует безупречную работу вашего автомобиля.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <SpeedIcon sx={{ fontSize: 50, color: '#FF2800', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Современное оборудование
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Наш сервисный центр оснащен новейшим диагностическим и ремонтным оборудованием для автомобилей Ferrari.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <LocalOfferIcon sx={{ fontSize: 50, color: '#FF2800', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Гарантия качества
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Мы предоставляем гарантию на все выполненные работы и установленные запчасти в соответствии с политикой Ferrari.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* FAQ section */}
        {activeStep < 4 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
              Часто задаваемые вопросы
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Как часто нужно обслуживать Ferrari?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Стандартное техническое обслуживание рекомендуется проводить каждые 10 000 км или раз в год, в зависимости от того, что наступит раньше. Для спортивных моделей или при интенсивной эксплуатации могут требоваться более частые проверки.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Можно ли оставить автомобиль на ночь?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Да, у нас есть охраняемая крытая парковка, где ваш автомобиль будет в полной безопасности. Если обслуживание требует более одного дня, мы предоставляем возможность оставить автомобиль в нашем сервисном центре.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Предоставляете ли вы подменный автомобиль?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Да, для клиентов, чей автомобиль находится на длительном обслуживании, мы предлагаем услугу подменного автомобиля. Данная услуга предоставляется по предварительному запросу и зависит от доступности автомобилей.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Какая гарантия на работы и запчасти?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Мы предоставляем гарантию на все проведенные работы сроком на 12 месяцев. На оригинальные запчасти Ferrari действует стандартная гарантия производителя, которая составляет 24 месяца с момента установки.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ServiceAppointment;