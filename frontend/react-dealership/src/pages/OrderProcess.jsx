import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  CardMedia,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  CircularProgress,
  Alert,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// Icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PaymentIcon from '@mui/icons-material/Payment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SettingsIcon from '@mui/icons-material/Settings';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import WarningIcon from '@mui/icons-material/Warning';
import PaletteIcon from '@mui/icons-material/Palette';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// API
import { carAPI, orderAPI, userAPI } from '../services/api';

// Custom styled components
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

const ColorBox = styled(Box)(({ color, selected }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: color,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  transform: selected ? 'scale(1.1)' : 'scale(1)',
  border: selected ? '2px solid #FF2800' : '2px solid transparent',
  boxShadow: selected ? '0 0 10px rgba(255, 40, 0, 0.5)' : 'none',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
  }
}));

const OrderProcess = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { carId } = useParams();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // State variables
  const [activeStep, setActiveStep] = useState(0);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderReference, setOrderReference] = useState(null);
  
  // Order form data
  const [orderData, setOrderData] = useState({
    carId: carId,
    exterior: '',
    interior: '',
    wheels: '',
    additionalOptions: [],
    deliveryMethod: 'dealership',
    deliveryAddress: '',
    paymentMethod: 'fullPayment',
    depositAmount: 0,
    financingTerm: 0,
    contactPreference: 'phone',
    comments: '',
    termsAccepted: false
  });
  
  // Options for customization
  const [options, setOptions] = useState({
    exteriorColors: [],
    interiorColors: [],
    wheelOptions: [],
    additionalOptions: []
  });
  
  // Confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Fetch car details and available options on component mount
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        // If carId is provided via params, fetch that specific car
        if (carId) {
          const response = await carAPI.getCar(carId);
          if (response && response.data) {
            setCar(response.data);
          } else if (response) {
            setCar(response);
          } else {
            console.error('Неожиданный формат ответа API при получении автомобиля');
            setError('Не удалось загрузить данные автомобиля');
          }
          
          // Set default exterior and interior
          if (response.data.exteriorColors && response.data.exteriorColors.length > 0) {
            setOrderData(prevData => ({
              ...prevData,
              exterior: response.data.exteriorColors[0].id
            }));
          }
          
          if (response.data.interiorColors && response.data.interiorColors.length > 0) {
            setOrderData(prevData => ({
              ...prevData,
              interior: response.data.interiorColors[0].id
            }));
          }
          
          // Set options for customization
          setOptions({
            exteriorColors: response.data.exteriorColors || [],
            interiorColors: response.data.interiorColors || [],
            wheelOptions: response.data.wheelOptions || [],
            additionalOptions: response.data.additionalOptions || []
          });
        } else {
          navigate('/catalog');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Не удалось загрузить данные автомобиля');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarDetails();
  }, [carId, navigate]);
  
  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    
    if (type === 'checkbox') {
      if (name === 'termsAccepted') {
        setOrderData({
          ...orderData,
          [name]: checked
        });
      } else {
        // For additional options (multiple checkboxes)
        const updatedOptions = checked
          ? [...orderData.additionalOptions, value]
          : orderData.additionalOptions.filter(option => option !== value);
        
        setOrderData({
          ...orderData,
          additionalOptions: updatedOptions
        });
      }
    } else {
      setOrderData({
        ...orderData,
        [name]: value
      });
    }
  };
  
  // Handle step navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle order submission
  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.createOrder(orderData);
      setOrderReference(response.data.orderReference);
      setOrderComplete(true);
      setActiveStep(4); // Move to final step
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setError('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже или свяжитесь с нашим консультантом.');
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };
  
  // Calculate total price including options
  const calculateTotal = () => {
    if (!car) return 0;
    
    let total = car.price || 0;
    
    // Add cost of selected exterior if applicable
    const selectedExterior = options.exteriorColors.find(color => color.id === orderData.exterior);
    if (selectedExterior && selectedExterior.additionalCost) {
      total += selectedExterior.additionalCost;
    }
    
    // Add cost of selected interior if applicable
    const selectedInterior = options.interiorColors.find(color => color.id === orderData.interior);
    if (selectedInterior && selectedInterior.additionalCost) {
      total += selectedInterior.additionalCost;
    }
    
    // Add cost of selected wheels if applicable
    const selectedWheels = options.wheelOptions.find(wheel => wheel.id === orderData.wheels);
    if (selectedWheels && selectedWheels.additionalCost) {
      total += selectedWheels.additionalCost;
    }
    
    // Add cost of additional options
    orderData.additionalOptions.forEach(optionId => {
      const option = options.additionalOptions.find(opt => opt.id === optionId);
      if (option && option.additionalCost) {
        total += option.additionalCost;
      }
    });
    
    return total;
  };
  
  // Format price with thousands separator
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };
  
  // Find the name of a selected option by its ID
  const getOptionNameById = (optionType, id) => {
    if (!id) return '';
    
    switch (optionType) {
      case 'exterior':
        return options.exteriorColors.find(color => color.id === id)?.name || '';
      case 'interior':
        return options.interiorColors.find(color => color.id === id)?.name || '';
      case 'wheels':
        return options.wheelOptions.find(wheel => wheel.id === id)?.name || '';
      default:
        return '';
    }
  };
  
  // Steps for the order process
  const steps = [
    {
      label: 'Выбор комплектации',
      description: 'Персонализируйте ваш Ferrari',
      content: (
        <Box sx={{ mt: 3 }}>
          {/* Exterior Color Selection */}
          <Box sx={{ mb: 4 }}>
		  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ColorLensIcon sx={{ color: '#FF2800', mr: 1 }} />
              Цвет экстерьера
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  {options.exteriorColors.map((color) => (
                    <ColorBox
                      key={color.id}
                      color={color.hexCode}
                      selected={orderData.exterior === color.id}
                      onClick={() => setOrderData({ ...orderData, exterior: color.id })}
                    />
                  ))}
                </Box>
                
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Выбран: <span style={{ color: 'white', fontWeight: 'bold' }}>{getOptionNameById('exterior', orderData.exterior)}</span>
                  {options.exteriorColors.find(c => c.id === orderData.exterior)?.additionalCost > 0 && (
                    <span style={{ color: '#FF2800', marginLeft: '8px' }}>
                      (+{formatPrice(options.exteriorColors.find(c => c.id === orderData.exterior)?.additionalCost)} ₽)
                    </span>
                  )}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  height: '100%' 
                }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={options.exteriorColors.find(c => c.id === orderData.exterior)?.imageUrl || car?.imageUrl || '/images/default-car.jpg'}
                    alt="Экстерьер автомобиля"
                  />
                  <CardContent>
                    <Typography variant="body2">
                      {options.exteriorColors.find(c => c.id === orderData.exterior)?.description || 'Выберите цвет экстерьера для вашего Ferrari.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          {/* Interior Color Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaletteIcon sx={{ color: '#FF2800', mr: 1 }} />
              Цвет интерьера
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  {options.interiorColors.map((color) => (
                    <ColorBox
                      key={color.id}
                      color={color.hexCode}
                      selected={orderData.interior === color.id}
                      onClick={() => setOrderData({ ...orderData, interior: color.id })}
                    />
                  ))}
                </Box>
                
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Выбран: <span style={{ color: 'white', fontWeight: 'bold' }}>{getOptionNameById('interior', orderData.interior)}</span>
                  {options.interiorColors.find(c => c.id === orderData.interior)?.additionalCost > 0 && (
                    <span style={{ color: '#FF2800', marginLeft: '8px' }}>
                      (+{formatPrice(options.interiorColors.find(c => c.id === orderData.interior)?.additionalCost)} ₽)
                    </span>
                  )}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  bgcolor: 'rgba(30,30,30,0.8)',
                  backdropFilter: 'blur(10px)',
                  height: '100%' 
                }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={options.interiorColors.find(c => c.id === orderData.interior)?.imageUrl || '/images/interior-default.jpg'}
                    alt="Интерьер автомобиля"
                  />
                  <CardContent>
                    <Typography variant="body2">
                      {options.interiorColors.find(c => c.id === orderData.interior)?.description || 'Выберите цвет интерьера для вашего Ferrari.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          {/* Wheels Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsIcon sx={{ color: '#FF2800', mr: 1 }} />
              Колесные диски
            </Typography>
            
            <Grid container spacing={3}>
              {options.wheelOptions.map((wheel) => (
                <Grid item xs={12} sm={6} md={4} key={wheel.id}>
                  <Card sx={{ 
                    bgcolor: 'rgba(30,30,30,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: orderData.wheels === wheel.id ? '2px solid #FF2800' : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 0 15px rgba(255, 40, 0, 0.3)'
                    }
                  }}>
                    <CardActionArea onClick={() => setOrderData({ ...orderData, wheels: wheel.id })}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={wheel.imageUrl || '/images/wheels-default.jpg'}
                        alt={wheel.name}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" component="div" fontWeight="bold" gutterBottom>
                          {wheel.name}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                          {wheel.description}
                        </Typography>
                        
                        {wheel.additionalCost > 0 && (
                          <Typography variant="body2" sx={{ color: '#FF2800', fontWeight: 'bold' }}>
                            +{formatPrice(wheel.additionalCost)} ₽
                          </Typography>
                        )}
                        
                        <Radio
                          checked={orderData.wheels === wheel.id}
                          onChange={() => setOrderData({ ...orderData, wheels: wheel.id })}
                          sx={{
                            color: 'rgba(255,255,255,0.5)',
                            '&.Mui-checked': {
                              color: '#FF2800',
                            },
                          }}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          {/* Additional Options */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BuildIcon sx={{ color: '#FF2800', mr: 1 }} />
              Дополнительные опции
            </Typography>
            
            <Grid container spacing={2}>
              {options.additionalOptions.map((option) => (
                <Grid item xs={12} sm={6} md={4} key={option.id}>
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(30,30,30,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: orderData.additionalOptions.includes(option.id) ? '1px solid #FF2800' : '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={orderData.additionalOptions.includes(option.id)}
                          onChange={handleInputChange}
                          name="additionalOption"
                          value={option.id}
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
                          <Typography variant="subtitle2" component="div">{option.name}</Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {option.description}
                          </Typography>
                          {option.additionalCost > 0 && (
                            <Typography variant="body2" sx={{ color: '#FF2800', fontWeight: 'bold', mt: 1 }}>
                              +{formatPrice(option.additionalCost)} ₽
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
              ))}
              
              {options.additionalOptions.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Для данной модели дополнительные опции недоступны.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      )
    },
    {
      label: 'Доставка и оплата',
      description: 'Выберите способ доставки и оплаты',
      content: (
        <Box sx={{ mt: 3 }}>
          {/* Delivery Method */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DirectionsCarIcon sx={{ color: '#FF2800', mr: 1 }} />
              Способ получения
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup
                name="deliveryMethod"
                value={orderData.deliveryMethod}
                onChange={handleInputChange}
              >
                <FormControlLabel 
                  value="dealership" 
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
                  label="Самовывоз из дилерского центра" 
                />
                <FormControlLabel 
                  value="delivery" 
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
                  label="Доставка по указанному адресу" 
                />
              </RadioGroup>
            </FormControl>
            
            {orderData.deliveryMethod === 'delivery' && (
              <TextField
                fullWidth
                margin="normal"
                name="deliveryAddress"
                label="Адрес доставки"
                value={orderData.deliveryAddress}
                onChange={handleInputChange}
                variant="outlined"
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
                sx={{ mb: 2 }}
              />
            )}
          </Box>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          {/* Payment Method */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaymentIcon sx={{ color: '#FF2800', mr: 1 }} />
              Способ оплаты
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup
                name="paymentMethod"
                value={orderData.paymentMethod}
                onChange={handleInputChange}
              >
                <FormControlLabel 
                  value="fullPayment" 
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
                  label="Полная оплата" 
                />
                <FormControlLabel 
                  value="deposit" 
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
                  label="Предоплата и финансирование" 
                />
              </RadioGroup>
            </FormControl>
            
            {orderData.paymentMethod === 'deposit' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Размер первоначального взноса
                </Typography>
                <TextField
                  type="number"
                  name="depositAmount"
                  value={orderData.depositAmount}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    endAdornment: <Typography variant="body2">₽</Typography>,
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
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="subtitle2" gutterBottom>
                  Срок финансирования
                </Typography>
                <TextField
                  select
                  name="financingTerm"
                  value={orderData.financingTerm}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
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
                >
                  <MenuItem value={12}>12 месяцев</MenuItem>
                  <MenuItem value={24}>24 месяца</MenuItem>
                  <MenuItem value={36}>36 месяцев</MenuItem>
                  <MenuItem value={48}>48 месяцев</MenuItem>
                  <MenuItem value={60}>60 месяцев</MenuItem>
                </TextField>
                
                <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}>
                  Наш финансовый консультант свяжется с вами для обсуждения деталей финансирования после оформления заказа.
                </Typography>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          {/* Contact Preference */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              Предпочтительный способ связи
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup
                name="contactPreference"
                value={orderData.contactPreference}
                onChange={handleInputChange}
              >
                <FormControlLabel 
                  value="phone" 
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
                  label="Телефон" 
                />
                <FormControlLabel 
                  value="email" 
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
                  label="Email" 
                />
                <FormControlLabel 
                  value="both" 
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
                  label="Оба варианта" 
                />
              </RadioGroup>
            </FormControl>
          </Box>
          
          {/* Additional Comments */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              Дополнительные комментарии
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              name="comments"
              value={orderData.comments}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="Укажите любую дополнительную информацию по вашему заказу..."
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
            />
          </Box>
        </Box>
      )
    },
    {
      label: 'Подтверждение заказа',
      description: 'Проверьте и подтвердите ваш заказ',
      content: (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Информация о заказе
          </Typography>
          
          <Card sx={{ 
            mb: 4, 
            bgcolor: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,40,0,0.2)',
            borderRadius: '12px'
          }}>
            <CardMedia
              component="img"
              height="200"
              image={car?.imageUrl || '/images/default-car.jpg'}
              alt={car?.model}
            />
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {car?.brand} {car?.model}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Год выпуска:
                </Typography>
                <Typography variant="body2">
                  {car?.year}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Двигатель:
                </Typography>
                <Typography variant="body2">
                  {car?.engineType}, {car?.engineVolume}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Мощность:
                </Typography>
                <Typography variant="body2">
                  {car?.horsepower} л.с.
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Максимальная скорость:
                </Typography>
                <Typography variant="body2">
                  {car?.maxSpeed} км/ч
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Разгон 0-100 км/ч:
                </Typography>
                <Typography variant="body2">
                  {car?.acceleration} сек
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Выбранные опции
          </Typography>
          
          <Paper sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: 'rgba(30,30,30,0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Цвет экстерьера
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ColorBox 
                      color={options.exteriorColors.find(c => c.id === orderData.exterior)?.hexCode}
                      selected={true}
                      sx={{ mr: 2, cursor: 'default' }}
                    />
                    <Typography variant="body2">
                      {getOptionNameById('exterior', orderData.exterior)}
                      {options.exteriorColors.find(c => c.id === orderData.exterior)?.additionalCost > 0 && (
                        <span style={{ color: '#FF2800', marginLeft: '8px' }}>
                          (+{formatPrice(options.exteriorColors.find(c => c.id === orderData.exterior)?.additionalCost)} ₽)
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Цвет интерьера
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ColorBox 
                      color={options.interiorColors.find(c => c.id === orderData.interior)?.hexCode}
                      selected={true}
                      sx={{ mr: 2, cursor: 'default' }}
                    />
                    <Typography variant="body2">
                      {getOptionNameById('interior', orderData.interior)}
                      {options.interiorColors.find(c => c.id === orderData.interior)?.additionalCost > 0 && (
                        <span style={{ color: '#FF2800', marginLeft: '8px' }}>
                          (+{formatPrice(options.interiorColors.find(c => c.id === orderData.interior)?.additionalCost)} ₽)
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Колесные диски
                  </Typography>
                  <Typography variant="body2">
                    {getOptionNameById('wheels', orderData.wheels)}
                    {options.wheelOptions.find(w => w.id === orderData.wheels)?.additionalCost > 0 && (
                      <span style={{ color: '#FF2800', marginLeft: '8px' }}>
                        (+{formatPrice(options.wheelOptions.find(w => w.id === orderData.wheels)?.additionalCost)} ₽)
                      </span>
                    )}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Дополнительные опции
                  </Typography>
                  {orderData.additionalOptions.length > 0 ? (
                    orderData.additionalOptions.map((optionId) => {
                      const option = options.additionalOptions.find(opt => opt.id === optionId);
                      return (
                        <Box key={optionId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            {option?.name}
                          </Typography>
                          {option?.additionalCost > 0 && (
                            <Typography variant="body2" sx={{ color: '#FF2800' }}>
                              +{formatPrice(option.additionalCost)} ₽
                            </Typography>
                          )}
                        </Box>
                      );
                    })
                  ) : (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Дополнительные опции не выбраны
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Способ получения
                  </Typography>
                  <Typography variant="body2">
                    {orderData.deliveryMethod === 'dealership' ? 'Самовывоз из дилерского центра' : 'Доставка по адресу'}
                  </Typography>
                  {orderData.deliveryMethod === 'delivery' && orderData.deliveryAddress && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
                      Адрес: {orderData.deliveryAddress}
                    </Typography>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Способ оплаты
                  </Typography>
                  <Typography variant="body2">
                    {orderData.paymentMethod === 'fullPayment' ? 'Полная оплата' : 'Предоплата и финансирование'}
                  </Typography>
                  {orderData.paymentMethod === 'deposit' && (
                    <>
                      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
                        Первоначальный взнос: {formatPrice(orderData.depositAmount)} ₽
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Срок финансирования: {orderData.financingTerm} мес.
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Итоговая стоимость:
            </Typography>
            <Typography variant="h4" color="#FF2800" fontWeight="bold">
              {formatPrice(calculateTotal())} ₽
            </Typography>
          </Box>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={orderData.termsAccepted}
                onChange={handleInputChange}
                name="termsAccepted"
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
                Я ознакомлен и согласен с <Link href="#" sx={{ color: '#FF2800', textDecoration: 'none' }}>условиями покупки</Link> и <Link href="#" sx={{ color: '#FF2800', textDecoration: 'none' }}>политикой конфиденциальности</Link>
              </Typography>
            }
          />
          
          {!orderData.termsAccepted && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Для оформления заказа необходимо принять условия
            </Typography>
          )}
        </Box>
      )
    },
    {
      label: 'Завершение заказа',
      description: 'Ваш Ferrari уже ждет вас',
      content: (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          {orderComplete ? (
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
                Ваш заказ успешно оформлен!
              </Typography>
              
              <Typography 
                variant="h6"
                component={motion.h6}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ mb: 4, color: 'rgba(255,255,255,0.7)' }}
              >
                Номер заказа: <span style={{ color: '#FF2800', fontWeight: 'bold' }}>{orderReference}</span>
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
                    Благодарим вас за заказ! Наш менеджер свяжется с вами в ближайшее время для подтверждения деталей вашего заказа.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    Подробная информация о заказе была отправлена на вашу электронную почту.
                  </Typography>
                  
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    С нетерпением ждем возможности передать вам ключи от вашего нового Ferrari!
                  </Typography>
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
                  startIcon={<SentimentVerySatisfiedIcon />}
                  onClick={() => navigate('/profile')}
                  sx={{
                    backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                    color: 'white',
                    py: 1.5,
                    px: 3
                  }}
                >
                  Мои заказы
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
                Оформление заказа...
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
        background: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url("/images/ferrari-configurator-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        pt: 12,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        {/* Loading and Error States */}
        {loading && !orderComplete && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#FF2800' }} />
          </Box>
        )}
        
        {error && (
          <Box sx={{ mb: 4 }}>
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
            
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/catalog')}
              sx={{
                borderColor: '#FF2800',
                color: '#FF2800',
                '&:hover': {
                  borderColor: '#FF2800',
                  backgroundColor: 'rgba(255, 40, 0, 0.1)'
                }
              }}
            >
              Вернуться в каталог
            </Button>
          </Box>
        )}
        
        {/* Order Process Content */}
        {!loading && !error && car && (
          <>
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
                ОФОРМЛЕНИЕ ЗАКАЗА
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
              
              {!isSmallScreen && (
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {car.brand} {car.model}
                </Typography>
              )}
            </Box>
            
            <Grid container spacing={4}>
              {/* Stepper */}
              <Grid item xs={12} md={3}>
                <Box 
                  sx={{ 
                    position: 'sticky', 
                    top: 100,
                    bgcolor: 'rgba(20,20,20,0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    p: 3,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StyledStepLabel>
                          <Typography variant="subtitle1" sx={{ fontSize: isSmallScreen ? '0.9rem' : '1rem' }}>
                            {step.label}
                          </Typography>
                          {index === activeStep && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {step.description}
                            </Typography>
                          )}
                        </StyledStepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  
                  {!orderComplete && activeStep < 3 && (
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        Стоимость
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Базовая цена:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatPrice(car.price)} ₽
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Дополнительные опции:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: '#FF2800' }}>
                          +{formatPrice(calculateTotal() - car.price)} ₽
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Итого:
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF2800' }}>
                          {formatPrice(calculateTotal())} ₽
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
              
              {/* Content */}
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
                  {steps[activeStep].content}
                  
                  {!orderComplete && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                          color: activeStep === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                          '&:hover': {
                            color: activeStep === 0 ? 'rgba(255,255,255,0.3)' : 'white'
                          }
                        }}
                      >
                        Назад
                      </Button>
                      
                      <Box>
                        {activeStep === steps.length - 2 ? (
                          <Button
                            variant="contained"
                            onClick={() => setConfirmDialogOpen(true)}
                            disabled={!orderData.termsAccepted}
                            endIcon={<ShoppingCartIcon />}
                            sx={{
                              backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                              color: 'white',
                              py: 1.2,
                              px: 3,
                              opacity: orderData.termsAccepted ? 1 : 0.6
                            }}
                          >
                            Оформить заказ
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                              backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                              color: 'white',
                              py: 1.2,
                              px: 3
                            }}
                          >
                            Продолжить
                          </Button>
                        )}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(30,30,30,0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle>Подтверждение заказа</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Вы собираетесь оформить заказ на Ferrari {car?.model}. После подтверждения с вами свяжется наш менеджер для дальнейшего сопровождения заказа.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Итоговая стоимость: {formatPrice(calculateTotal())} ₽
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSubmitOrder}
            variant="contained"
            sx={{
              backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
              color: 'white'
            }}
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderProcess;