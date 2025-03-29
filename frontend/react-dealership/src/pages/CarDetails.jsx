import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  Paper,
  Tab,
  Tabs,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
  Stack,
  Alert,
  TextField,
  IconButton,
  Rating
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
// Используем motion, но импортируем только когда он фактически используется
import { toast, Toaster } from 'react-hot-toast';

// Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EngineIcon from '@mui/icons-material/CalendarMonth'; //@mui/icons-material/Engine
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Close from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import AddCommentIcon from '@mui/icons-material/AddComment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Services
import { carAPI, testDriveAPI, reviewAPI } from '../services/api';

// Styled components
const StyledPaper = styled(Paper)(() => ({
  backgroundColor: 'rgba(25, 25, 25, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
  }
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: alpha('#FF2800', 0.1),
  color: 'white',
  borderColor: alpha('#FF2800', 0.3),
  '&:hover': {
    backgroundColor: alpha('#FF2800', 0.2),
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: 'transparent',
  '& .MuiTableCell-root': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: theme.spacing(1.5),
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#FF2800',
  },
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 500,
}));

const MainImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 450,
  [theme.breakpoints.down('md')]: {
    height: 350,
  },
  [theme.breakpoints.down('sm')]: {
    height: 250,
  },
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  '&:hover .overlay-actions': {
    opacity: 1,
  }
}));

const ThumbsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  overflowX: 'auto',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 0),
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 40, 0, 0.5)',
    borderRadius: '10px',
  },
}));

const ThumbImage = styled(Box)(({ active }) => ({
  width: 90,
  height: 60,
  borderRadius: '8px',
  overflow: 'hidden',
  border: active === 'true' ? '2px solid #FF2800' : '2px solid transparent',
  opacity: active === 'true' ? 1 : 0.7,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    opacity: 1,
    transform: 'scale(1.05)',
  },
  flexShrink: 0,
}));

const CarIconWithText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 40, 0, 0.05)',
    border: '1px solid rgba(255, 40, 0, 0.2)',
    transform: 'translateY(-3px)',
  }
}));

// Main component
const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openFullImage, setOpenFullImage] = useState(false);
  const [openTestDriveDialog, setOpenTestDriveDialog] = useState(false);
  const [testDriveFormData, setTestDriveFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
    pros: '',
    cons: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  
  // Effects
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await carAPI.getCar(id);
        console.log("Car details retrieved:", response);
        
        // Обработка URL изображений
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
        
        if (response.data && response.data.images && Array.isArray(response.data.images)) {
          // Преобразуем URL-адреса изображений
          response.data.images = response.data.images.map(img => {
            // Проверяем, не является ли уже URL полным
            if (img.startsWith('http') || img.startsWith('blob:')) {
              return img;
            }
            
            // Корректировка пути для избежания дублирования /api
            if (img.startsWith('/api/')) {
              return `${baseUrl}${img.substring(4)}`;
            } else {
              return `${baseUrl}${img.startsWith('/') ? img : `/${img}`}`;
            }
          });
        }
        
        // Обрабатываем URL главного изображения, если оно есть
        if (response.data && response.data.mainImage) {
          const mainImg = response.data.mainImage;
          if (!mainImg.startsWith('http') && !mainImg.startsWith('blob:')) {
            if (mainImg.startsWith('/api/')) {
              response.data.mainImage = `${baseUrl}${mainImg.substring(4)}`;
            } else {
              response.data.mainImage = `${baseUrl}${mainImg.startsWith('/') ? mainImg : `/${mainImg}`}`;
            }
          }
        }
        
        setCar(response.data);
        
        // Check local storage for favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(id));
        
        // Get similar cars
        const fetchSimilarCars = async (car) => {
          try {
            if (!car || !car.category) {
              return;
            }
            
            // Получаем похожие автомобили той же категории, исключая текущий
            const similarResponse = await carAPI.getAllCars({
              category: car.category
            });
            
            console.log('Похожие автомобили (ответ API):', similarResponse);
            
            let similarCarsData = [];
            
            if (Array.isArray(similarResponse)) {
              similarCarsData = similarResponse;
            } else if (similarResponse.data && Array.isArray(similarResponse.data)) {
              similarCarsData = similarResponse.data;
            } else if (similarResponse.items && Array.isArray(similarResponse.items)) {
              similarCarsData = similarResponse.items;
            } else {
              console.error('Неожиданный формат ответа API (похожие):', similarResponse);
            }
            
            if (similarCarsData.length > 0) {
              const filtered = similarCarsData.filter(c => c.id !== car.id).slice(0, 4);
              
              // Добавляем логирование для диагностики данных похожих автомобилей
              console.log('Найдено похожих автомобилей:', filtered.length);
              
              if (filtered.length > 0) {
                console.log('Структура первого похожего автомобиля:', {
                  id: filtered[0].id,
                  brand: filtered[0].brand,
                  model: filtered[0].model,
                  mainImage: filtered[0].mainImage,
                  hasImages: filtered[0].images && filtered[0].images.length > 0,
                  firstImage: filtered[0].images && filtered[0].images.length > 0 ? filtered[0].images[0] : null
                });
              }
              
              // Обработка URL изображений для похожих автомобилей
              const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
              
              const processedCars = filtered.map(car => {
                // Копируем автомобиль
                const processedCar = {...car};
                
                // Обрабатываем URL главного изображения, если оно есть
                if (processedCar.mainImage) {
                  if (!processedCar.mainImage.startsWith('http') && !processedCar.mainImage.startsWith('blob:')) {
                    if (processedCar.mainImage.startsWith('/api/')) {
                      processedCar.mainImage = `${baseUrl}${processedCar.mainImage.substring(4)}`;
                    } else {
                      processedCar.mainImage = `${baseUrl}${processedCar.mainImage.startsWith('/') ? processedCar.mainImage : `/${processedCar.mainImage}`}`;
                    }
                  }
                }
                
                // Обрабатываем URL всех изображений
                if (processedCar.images && Array.isArray(processedCar.images) && processedCar.images.length > 0) {
                  processedCar.images = processedCar.images.map(img => {
                    if (img.startsWith('http') || img.startsWith('blob:')) {
                      return img;
                    }
                    
                    if (img.startsWith('/api/')) {
                      return `${baseUrl}${img.substring(4)}`;
                    } else {
                      return `${baseUrl}${img.startsWith('/') ? img : `/${img}`}`;
                    }
                  });
                }
                
                return processedCar;
              });
              
              // Логируем обработанные данные первого автомобиля
              if (processedCars.length > 0) {
                console.log('Обработанный первый похожий автомобиль:', {
                  id: processedCars[0].id,
                  mainImage: processedCars[0].mainImage,
                  firstImage: processedCars[0].images && processedCars[0].images.length > 0 ? processedCars[0].images[0] : null
                });
              }
              
              setSimilarCars(processedCars);
            }
          } catch (error) {
            console.error('Error fetching similar cars:', error);
          }
        };
        
        fetchSimilarCars(response.data);
        
        // Get reviews - обрабатываем возможную ошибку API отзывов
        try {
          const reviewsResponse = await reviewAPI.getReviews({
            carId: id,
            approved: true,
            limit: 5
          });
          setReviews(reviewsResponse.data.items || []);
        } catch (reviewErr) {
          console.log('Отзывы недоступны:', reviewErr.message);
          // Если API отзывов не реализовано, просто устанавливаем пустой массив
          setReviews([]);
        }
        
      } catch (err) {
        console.error('Error fetching car data:', err);
        setError('Не удалось загрузить информацию об автомобиле. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarData();
    
    // Проверяем, авторизован ли пользователь
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [id]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Navigate to previous image
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? car.images.length - 1 : prevIndex - 1
    );
  };
  
  // Navigate to next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === car.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Open test drive dialog
  const handleOpenTestDriveDialog = () => {
    setOpenTestDriveDialog(true);
    // Reset form and fetch available slots
    setTestDriveFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      notes: ''
    });
    setSubmitSuccess(null);
    fetchAvailableSlots();
  };
  
  // Close test drive dialog
  const handleCloseTestDriveDialog = () => {
    setOpenTestDriveDialog(false);
  };
  
  // Fetch available test drive slots
  const fetchAvailableSlots = async () => {
    if (!car) return;
    
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      const response = await testDriveAPI.getAvailableSlots(formattedDate, car.id);
      setAvailableSlots(response.data || []);
    } catch (err) {
      console.error('Error fetching available slots:', err);
      setAvailableSlots([]);
    }
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestDriveFormData({
      ...testDriveFormData,
      [name]: value
    });
    
    // If date changed, fetch available slots for that date
    if (name === 'preferredDate') {
      fetchAvailableSlotsForDate(value);
    }
  };
  
  // Fetch available slots for a specific date
  const fetchAvailableSlotsForDate = async (date) => {
    if (!car || !date) return;
    
    try {
      const response = await testDriveAPI.getAvailableSlots(date, car.id);
      setAvailableSlots(response.data || []);
    } catch (err) {
      console.error('Error fetching available slots for date:', err);
      setAvailableSlots([]);
    }
  };
  
  // Submit test drive request
  const handleSubmitTestDrive = async () => {
    // Validate form
    if (!testDriveFormData.firstName || !testDriveFormData.lastName || !testDriveFormData.email || 
        !testDriveFormData.phone || !testDriveFormData.preferredDate || !testDriveFormData.preferredTime) {
      setSubmitSuccess({
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля.'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      await testDriveAPI.createTestDrive({
        carId: car.id,
        ...testDriveFormData,
        scheduledDateTime: `${testDriveFormData.preferredDate}T${testDriveFormData.preferredTime}`
      });
      
      setSubmitSuccess({
        success: true,
        message: 'Заявка на тест-драйв успешно отправлена! Мы свяжемся с вами для подтверждения.'
      });
      
      // Reset form after successful submission
      setTestDriveFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
      });
      
    } catch (err) {
      console.error('Error submitting test drive request:', err);
      setSubmitSuccess({
        success: false,
        message: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Toggle favorite status
  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(carId => carId !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };
  
  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car ? `Ferrari ${car.model} - ${car.year}` : 'Ferrari',
        text: car ? `Посмотрите этот ${car.model} ${car.year} года!` : 'Посмотрите этот автомобиль Ferrari!',
        url: window.location.href
      })
      .catch(err => console.error('Ошибка при попытке поделиться:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Ссылка скопирована в буфер обмена!');
        })
        .catch(err => {
          console.error('Не удалось скопировать ссылку:', err);
        });
    }
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Обработчик отправки отзыва
  const handleReviewSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Необходимо авторизоваться для отправки отзыва');
        return;
      }
      
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          carId: id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          pros: reviewData.pros || null,
          cons: reviewData.cons || null
        })
      });
      
      if (response.ok) {
        const newReview = await response.json();
        setReviews([...reviews, newReview]);
        setReviewDialogOpen(false);
        setReviewData({
          rating: 0,
          comment: '',
          pros: '',
          cons: ''
        });
        toast.success('Отзыв успешно отправлен!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Ошибка при отправке отзыва');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Ошибка при отправке отзыва');
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.8))',
          pt: 8
        }}
      >
        <CircularProgress sx={{ color: '#FF2800' }} />
      </Box>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          pt: 12,
          pb: 8,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.8))',
        }}
      >
        <Container>
          <Alert 
            severity="error"
            sx={{
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: 'white',
              border: '1px solid rgba(211, 47, 47, 0.3)',
            }}
          >
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/catalog')}
            sx={{ 
              mt: 2,
              color: 'white',
              '&:hover': {
                color: '#FF2800'
              }
            }}
          >
            Вернуться к каталогу
          </Button>
        </Container>
      </Box>
    );
  }
  
  // No car data
  if (!car) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          pt: 12,
          pb: 8,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.8))',
        }}
      >
        <Container>
          <Alert 
            severity="info"
            sx={{
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              color: 'white',
              border: '1px solid rgba(33, 150, 243, 0.3)',
            }}
          >
            Автомобиль не найден или был удален.
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/catalog')}
            sx={{ 
              mt: 2,
              color: 'white',
              '&:hover': {
                color: '#FF2800'
              }
            }}
          >
            Вернуться к каталогу
          </Button>
        </Container>
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.8)), url("/images/ferrari-background-dark.jpg")',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        color: 'white',
        pt: 12,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#FF2800',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF5252',
                secondary: 'white',
              },
            }
          }}
        />
        
        <div>
          {/* Back button and title */}
          <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/catalog')}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    color: '#FF2800'
                  }
                }}
              >
                Вернуться к каталогу
              </Button>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  onClick={handleToggleFavorite}
                  sx={{ 
                    color: isFavorite ? '#FF2800' : 'white',
                    '&:hover': {
                      color: '#FF2800'
                    }
                  }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                
                <IconButton 
                  onClick={handleShare}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      color: '#FF2800'
                    }
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
          </div>
          
          {/* Car title and price */}
          <div>
            <Box sx={{ mb: 4 }}>
              <Typography variant="overline" sx={{ color: '#FF2800', letterSpacing: 2 }}>
                {car.condition === 'new' ? 'НОВЫЙ АВТОМОБИЛЬ' : 'С ПРОБЕГОМ'}
              </Typography>
              
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Ferrari {car.model} {car.year}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<AttachMoneyIcon />} 
                  label={formatPrice(car.price)} 
                  sx={{ 
                    backgroundColor: '#FF2800',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    height: 40,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
                
                <Chip 
                  icon={<SpeedIcon />} 
                  label={car.mileage ? `${car.mileage.toLocaleString()} км` : 'Новый'} 
                  variant="outlined" 
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                />
                
                <Chip 
                  icon={<CalendarMonthIcon />} 
                  label={car.year} 
                  variant="outlined" 
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                />
                
                <Chip 
                  icon={<ColorLensIcon />} 
                  label={car.color} 
                  variant="outlined" 
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                />
                
                <Chip 
                  icon={<EngineIcon />} 
                  label={`${car.engine} л, ${car.power} л.с.`} 
                  variant="outlined" 
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                />
              </Box>
            </Box>
          </div>
          
          {/* Car images */}
          <div>
            <Box sx={{ mb: 6 }}>
              <MainImageContainer>
                <Box
                  component="img"
                  src={car.images[currentImageIndex] || '/images/car-placeholder.jpg'}
                  alt={`Ferrari ${car.model}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  onError={(e) => {
                    console.error(`Ошибка загрузки основного изображения: ${car.images[currentImageIndex]}`);
                    e.target.src = '/images/car-placeholder.jpg';
                  }}
                />
                
                {/* Image navigation */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 2,
                  }}
                >
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 40, 0, 0.7)',
                      },
                    }}
                  >
                    <ArrowBackIosIcon />
                  </IconButton>
                  
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 40, 0, 0.7)',
                      },
                    }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Box>
                
                {/* Actions overlay */}
                <Box
                  className="overlay-actions"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <IconButton
                    onClick={() => setOpenFullImage(true)}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 40, 0, 0.7)',
                      },
                      marginLeft: 1,
                    }}
                  >
                    <FullscreenIcon />
                  </IconButton>
                </Box>
              </MainImageContainer>
              
              {/* Thumbnails */}
              {car.images && car.images.length > 1 && (
                <ThumbsContainer>
                  {car.images.map((img, index) => (
                    <ThumbImage
                      key={index}
                      active={(index === currentImageIndex).toString()}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Box
                        component="img"
                        src={img}
                        alt={`Ferrari ${car.model} thumbnail ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          console.error(`Ошибка загрузки изображения: ${img}`);
                          e.target.src = '/images/car-placeholder.jpg';
                        }}
                      />
                    </ThumbImage>
                  ))}
                </ThumbsContainer>
              )}
            </Box>
          </div>
          
          {/* Call-to-action buttons */}
          <div>
            <Grid container spacing={2} sx={{ mb: 5 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => navigate(`/order/${car.id}`)}
                  sx={{
                    backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(255, 40, 0, 0.3)'
                    }
                  }}
                >
                  Оформить заказ
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<EventAvailableIcon />}
                  onClick={handleOpenTestDriveDialog}
                  sx={{
                    borderColor: '#FF2800',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#FF2800',
                      backgroundColor: 'rgba(255, 40, 0, 0.1)'
                    }
                  }}
                >
                  Записаться на тест-драйв
                </Button>
              </Grid>
            </Grid>
          </div>
          
          {/* Tabs navigation */}
          <div>
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{
                  style: { backgroundColor: '#FF2800' }
                }}
              >
                <StyledTab label="Описание" />
                <StyledTab label="Характеристики" />
                <StyledTab label="Комплектация" />
                <StyledTab label="Отзывы" />
              </Tabs>
            </Box>
          </div>
          
          {/* Tab content */}
          <div>
            {/* Description tab */}
            {currentTab === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Ferrari {car.model} {car.year}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {car.description || `Ferrari ${car.model} — это воплощение скорости, элегантности и инженерного превосходства. 
                  Этот автомобиль создан для тех, кто ценит непревзойденное качество, итальянский стиль и высочайшие технологии в автомобилестроении.`}
                </Typography>
                
                {/* Отображаем дополнительные блоки только если есть оновное описание - это баланс между информативностью и пустотой */}
                {car.description && (
                  <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                      <StyledPaper elevation={0} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#FF2800' }}>
                          Преимущества модели
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                          {(car.features && Array.isArray(car.features) && car.features.length > 0) ? (
                            // Если есть данные о преимуществах - используем их
                            car.features.slice(0, 5).map((feature, index) => (
                              <Typography key={index} component="li" variant="body1" paragraph>
                                {feature}
                              </Typography>
                            ))
                          ) : (
                            // Иначе - показываем стандартные преимущества Ferrari
                            <>
                              <Typography component="li" variant="body1" paragraph>
                                Великолепная динамика и потрясающий звук двигателя
                              </Typography>
                              <Typography component="li" variant="body1" paragraph>
                                Эксклюзивный дизайн, приковывающий взгляды
                              </Typography>
                              <Typography component="li" variant="body1" paragraph>
                                Высочайшее качество отделки салона
                              </Typography>
                              <Typography component="li" variant="body1" paragraph>
                                Превосходная управляемость на любых скоростях
                              </Typography>
                              <Typography component="li" variant="body1" paragraph>
                                Инновационные технологии для максимального комфорта и безопасности
                              </Typography>
                            </>
                          )}
                        </Box>
                      </StyledPaper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <StyledPaper elevation={0} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#FF2800' }}>
                          {car.history ? 'История автомобиля' : 'О модели'}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {car.history || `Ferrari ${car.model} продолжает легендарную традицию итальянской марки, сочетая в себе инновационные технологии и характерный для Ferrari дизайн. Автомобиль разработан командой талантливых инженеров под руководством лучших мировых специалистов в области автомобилестроения.`}
                        </Typography>
                        {!car.history && (
                          <Typography variant="body1">
                            Каждый элемент автомобиля создан с особым вниманием к деталям, что делает Ferrari {car.model} настоящим произведением инженерного искусства.
                          </Typography>
                        )}
                      </StyledPaper>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
            
            {/* Specifications tab */}
            {currentTab === 1 && (
              <Box>
                <StyledTableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableBody>
                      {/* Базовая информация - всегда отображается */}
                      <TableRow>
                        <TableCell component="th" width="40%">Модель</TableCell>
                        <TableCell>Ferrari {car.model}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Год выпуска</TableCell>
                        <TableCell>{car.year}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">VIN</TableCell>
                        <TableCell>{car.vin}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Категория</TableCell>
                        <TableCell>
                          {(() => {
                            switch(car.category) {
                              case 'sport': return 'Спортивный';
                              case 'gt': return 'Grand Touring';
                              case 'hypercar': return 'Гиперкар';
                              case 'classic': return 'Классический';
                              case 'limited_edition': return 'Лимитированная серия';
                              default: return 'Спортивный';
                            }
                          })()}
                        </TableCell>
                      </TableRow>

                      {/* Только если доступны соответствующие поля */}
                      {car.specialSeries && (
                        <TableRow>
                          <TableCell component="th">Специальная серия</TableCell>
                          <TableCell>{car.specialSeries}</TableCell>
                        </TableRow>
                      )}
                      {car.mileage !== null && car.mileage !== undefined && (
                        <TableRow>
                          <TableCell component="th">Пробег</TableCell>
                          <TableCell>{car.mileage.toLocaleString()} км</TableCell>
                        </TableRow>
                      )}
                      {car.engine && (
                        <TableRow>
                          <TableCell component="th">Двигатель</TableCell>
                          <TableCell>{car.engine}</TableCell>
                        </TableRow>
                      )}
                      {car.horsepower && (
                        <TableRow>
                          <TableCell component="th">Мощность</TableCell>
                          <TableCell>{car.horsepower} л.с.</TableCell>
                        </TableRow>
                      )}
                      {car.acceleration && (
                        <TableRow>
                          <TableCell component="th">Разгон до 100 км/ч</TableCell>
                          <TableCell>{car.acceleration} сек.</TableCell>
                        </TableRow>
                      )}
                      {car.maxSpeed && (
                        <TableRow>
                          <TableCell component="th">Максимальная скорость</TableCell>
                          <TableCell>{car.maxSpeed} км/ч</TableCell>
                        </TableRow>
                      )}
                      {car.transmission && (
                        <TableRow>
                          <TableCell component="th">Трансмиссия</TableCell>
                          <TableCell>{car.transmission}</TableCell>
                        </TableRow>
                      )}
                      {car.driveType && (
                        <TableRow>
                          <TableCell component="th">Привод</TableCell>
                          <TableCell>{car.driveType}</TableCell>
                        </TableRow>
                      )}
                      {car.fuelConsumption && (
                        <TableRow>
                          <TableCell component="th">Расход топлива (комбинированный)</TableCell>
                          <TableCell>{car.fuelConsumption} л/100 км</TableCell>
                        </TableRow>
                      )}
                      {car.fuelType && (
                        <TableRow>
                          <TableCell component="th">Тип топлива</TableCell>
                          <TableCell>{car.fuelType}</TableCell>
                        </TableRow>
                      )}
                      {car.exteriorColor && (
                        <TableRow>
                          <TableCell component="th">Цвет кузова</TableCell>
                          <TableCell>{car.exteriorColor}</TableCell>
                        </TableRow>
                      )}
                      {car.interiorColor && (
                        <TableRow>
                          <TableCell component="th">Цвет салона</TableCell>
                          <TableCell>{car.interiorColor}</TableCell>
                        </TableRow>
                      )}
                      {car.interiorMaterial && (
                        <TableRow>
                          <TableCell component="th">Материал отделки салона</TableCell>
                          <TableCell>{car.interiorMaterial}</TableCell>
                        </TableRow>
                      )}
                      {car.wheels && (
                        <TableRow>
                          <TableCell component="th">Колесные диски</TableCell>
                          <TableCell>{car.wheels}</TableCell>
                        </TableRow>
                      )}
                      {car.carbonCeramic && (
                        <TableRow>
                          <TableCell component="th">Карбон-керамические тормоза</TableCell>
                          <TableCell>Да</TableCell>
                        </TableRow>
                      )}
                      {car.certificateOfAuthenticity && (
                        <TableRow>
                          <TableCell component="th">Сертификат подлинности</TableCell>
                          <TableCell>Да</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              </Box>
            )}
            
            {/* Features tab */}
            {currentTab === 2 && (
              <Box>
                {car.features && Array.isArray(car.features) && car.features.length > 0 ? (
                  // Если есть данные о комплектации - используем их
                  <Grid container spacing={3}>
                    {/* Группируем features на категории по 6-8 штук в каждой */}
                    <Grid item xs={12} md={6} lg={4}>
                      <StyledPaper elevation={0} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#FF2800' }}>
                          Экстерьер и шасси
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          {car.features.filter(f => 
                            f.toLowerCase().includes('фар') || 
                            f.toLowerCase().includes('диск') || 
                            f.toLowerCase().includes('шин') || 
                            f.toLowerCase().includes('карбон') ||
                            f.toLowerCase().includes('тормоз') ||
                            f.toLowerCase().includes('крыш') ||
                            f.toLowerCase().includes('аэродинам')
                          ).map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckCircleIcon sx={{ mr: 1, color: '#FF2800' }} />
                              <Typography>{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </StyledPaper>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={4}>
                      <StyledPaper elevation={0} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#FF2800' }}>
                          Интерьер и комфорт
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          {car.features.filter(f => 
                            f.toLowerCase().includes('сиден') || 
                            f.toLowerCase().includes('кож') || 
                            f.toLowerCase().includes('климат') || 
                            f.toLowerCase().includes('мультимедиа') ||
                            f.toLowerCase().includes('аудио') ||
                            f.toLowerCase().includes('подогрев') ||
                            f.toLowerCase().includes('вентиляц')
                          ).map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckCircleIcon sx={{ mr: 1, color: '#FF2800' }} />
                              <Typography>{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </StyledPaper>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={4}>
                      <StyledPaper elevation={0} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#FF2800' }}>
                          Технологии и безопасность
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          {car.features.filter(f => 
                            f.toLowerCase().includes('система') || 
                            f.toLowerCase().includes('безопасност') || 
                            f.toLowerCase().includes('датчик') || 
                            f.toLowerCase().includes('ассистент') ||
                            f.toLowerCase().includes('электр') ||
                            f.toLowerCase().includes('bluetooth') ||
                            f.toLowerCase().includes('навигац')
                          ).map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckCircleIcon sx={{ mr: 1, color: '#FF2800' }} />
                              <Typography>{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </StyledPaper>
                    </Grid>
                  </Grid>
                ) : (
                  // Иначе - показываем стандартную комплектацию для Ferrari
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                      <StyledPaper elevation={0} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#FF2800' }}>
                          Экстерьер
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          {['LED-фары', 'Аэродинамический обвес', 'Карбоновая крыша', 
                            'Спортивный диффузор', '20" легкосплавные диски',
                            'Карбон-керамические тормоза'].map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckCircleIcon sx={{ mr: 1, color: '#FF2800' }} />
                              <Typography>{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </StyledPaper>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={4}>
                      <StyledPaper elevation={0} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#FF2800' }}>
                          Интерьер
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          {['Спортивные сиденья с электрорегулировкой', 
                            'Отделка салона кожей и алькантарой', 
                            'Карбоновые вставки в интерьере', 
                            'Мультифункциональное рулевое колесо',
                            'Система бесключевого доступа',
                            'Климат-контроль'].map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckCircleIcon sx={{ mr: 1, color: '#FF2800' }} />
                              <Typography>{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </StyledPaper>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={4}>
                      <StyledPaper elevation={0} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#FF2800' }}>
                          Технологии
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          {['Система управления режимами движения', 
                            'Адаптивная подвеска', 
                            'Спортивный выхлоп с регулировкой звука', 
                            'Цифровая приборная панель',
                            'Мультимедийная система с Apple CarPlay',
                            'Премиальная аудиосистема'].map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckCircleIcon sx={{ mr: 1, color: '#FF2800' }} />
                              <Typography>{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </StyledPaper>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
            
            {/* Reviews tab */}
            {currentTab === 3 && (
              <Box>
                {reviews && reviews.length > 0 ? (
                  <Box>
                    {reviews.map((review, index) => (
                      <StyledPaper key={index} elevation={0} sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 40, 0, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2
                              }}
                            >
                              <Typography variant="h6">{review.userName?.charAt(0).toUpperCase() || 'A'}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="h6">{review.userName || 'Анонимный пользователь'}</Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                sx={{
                                  color: i < review.rating ? '#FFD700' : 'rgba(255, 255, 255, 0.3)',
                                  fontSize: '1.2rem'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                        
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                        
                        <Typography variant="body1" paragraph>
                          {review.comment}
                        </Typography>
                        
                        {review.pros && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#4CAF50', mb: 1 }}>
                              Достоинства:
                            </Typography>
                            <Typography variant="body2">
                              {review.pros}
                            </Typography>
                          </Box>
                        )}
                        
                        {review.cons && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#FF5252', mb: 1 }}>
                              Недостатки:
                            </Typography>
                            <Typography variant="body2">
                              {review.cons}
                            </Typography>
                          </Box>
                        )}
                      </StyledPaper>
                    ))}
                  </Box>
                ) : (
                  <StyledPaper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                    <RateReviewOutlinedIcon sx={{ fontSize: 60, color: 'rgba(255, 40, 0, 0.7)', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Отзывов пока нет
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                      Будьте первым, кто оставит отзыв об этом автомобиле!
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<AddCommentIcon />}
                      onClick={() => setReviewDialogOpen(true)}
                      sx={{
                        mt: 2,
                        color: '#FF2800',
                        borderColor: '#FF2800',
                        '&:hover': {
                          borderColor: '#FF2800',
                          backgroundColor: 'rgba(255, 40, 0, 0.05)',
                        }
                      }}
                    >
                      Написать отзыв
                    </Button>
                  </StyledPaper>
                )}
              </Box>
            )}
          </div>
          
          {/* Similar cars section */}
          {similarCars.length > 0 && (
            <div>
              <Box sx={{ mt: 8 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Похожие автомобили
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  {similarCars.map((similarCar) => (
                    <Grid item xs={12} sm={6} md={3} key={similarCar.id}>
                      <StyledPaper
                        elevation={0}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                          }
                        }}
                        onClick={() => navigate(`/cars/${similarCar.id}`)}
                      >
                        <Box
                          sx={{
                            height: 180,
                            overflow: 'hidden',
                            borderTopLeftRadius: '12px',
                            borderTopRightRadius: '12px',
                          }}
                        >
                          <Box
                            component="img"
                            src={similarCar.mainImage || (similarCar.images && similarCar.images.length > 0 
                              ? similarCar.images[0] 
                              : 'https://via.placeholder.com/300x200?text=Ferrari')}
                            alt={`${similarCar.brand} ${similarCar.model}`}
                            onError={(e) => {
                              console.log('Ошибка загрузки изображения:', e.target.src);
                              e.target.src = 'https://via.placeholder.com/300x200?text=Ferrari';
                            }}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              }
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            {similarCar.brand} {similarCar.model}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {similarCar.year} · {similarCar.mileage ? `${similarCar.mileage.toLocaleString()} км` : 'Новый'}
                            </Typography>
                            
                            <Typography variant="subtitle1" sx={{ color: '#FF2800', fontWeight: 'bold' }}>
                              {formatPrice(similarCar.price)}
                            </Typography>
                          </Box>
                        </Box>
                      </StyledPaper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </div>
          )}
        </div>
      </Container>
      
      {/* Full image dialog */}
      <Dialog
        open={openFullImage}
        onClose={() => setOpenFullImage(false)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Ferrari {car.model} {car.year}</Typography>
          <IconButton onClick={() => setOpenFullImage(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box
            component="img"
            src={car.images[currentImageIndex] || '/images/car-placeholder.jpg'}
            alt={`Ferrari ${car.model}`}
            sx={{
              width: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
          
          {car.images && car.images.length > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton onClick={handlePrevImage} sx={{ color: 'white' }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography sx={{ mx: 2, alignSelf: 'center' }}>
                {currentImageIndex + 1} / {car.images.length}
              </Typography>
              <IconButton onClick={handleNextImage} sx={{ color: 'white' }}>
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Test drive dialog */}
      <Dialog
        open={openTestDriveDialog}
        onClose={handleCloseTestDriveDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(25, 25, 25, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5">Запись на тест-драйв</Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
            Ferrari {car.model} {car.year}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {submitSuccess && (
            <Alert 
              severity={submitSuccess.success ? "success" : "error"}
              sx={{
                mb: 3,
                backgroundColor: submitSuccess.success 
                  ? 'rgba(76, 175, 80, 0.1)'
                  : 'rgba(211, 47, 47, 0.1)',
                color: 'white',
                border: `1px solid ${submitSuccess.success 
                  ? 'rgba(76, 175, 80, 0.3)'
                  : 'rgba(211, 47, 47, 0.3)'}`,
              }}
            >
              {submitSuccess.message}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="Имя"
                fullWidth
                required
                value={testDriveFormData.firstName}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 40, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF2800',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Фамилия"
                fullWidth
                required
                value={testDriveFormData.lastName}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 40, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF2800',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
                value={testDriveFormData.email}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 40, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF2800',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Телефон"
                fullWidth
                required
                value={testDriveFormData.phone}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 40, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF2800',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="preferredDate"
                label="Предпочтительная дата"
                type="date"
                fullWidth
                required
                value={testDriveFormData.preferredDate}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 40, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF2800',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="preferredTime"
                label="Предпочтительное время"
                select
                fullWidth
                required
                value={testDriveFormData.preferredTime}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 40, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF2800',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                  '& .MuiSelect-icon': {
                    color: 'white',
                  },
                }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="" disabled>Выберите время</option>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                  </>
                )}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Дополнительные пожелания"
                multiline
                rows={4}
                fullWidth
                value={testDriveFormData.notes}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 40, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF2800',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button 
            onClick={handleCloseTestDriveDialog}
            sx={{ 
              color: 'white',
              '&:hover': {
                color: '#FF2800'
              }
            }}
          >
            Отмена
          </Button>
          
          <Button 
            onClick={handleSubmitTestDrive}
            disabled={submitting}
            variant="contained"
            sx={{ 
              backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
              color: 'white',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(255, 40, 0, 0.3)'
              }
            }}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {submitting ? 'Отправка...' : 'Записаться'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Добавим диалог для отправки отзыва */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1a1a1a', color: 'white' }}>
          Оставить отзыв о Ferrari {car.model}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1a1a1a', color: 'white', pt: 2 }}>
          {!isLoggedIn ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <LockOutlinedIcon sx={{ fontSize: 60, color: 'rgba(255, 40, 0, 0.7)', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Необходима авторизация
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Чтобы оставить отзыв, пожалуйста, войдите в систему или зарегистрируйтесь.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/login" 
                sx={{
                  mt: 2,
                  bgcolor: '#FF2800',
                  '&:hover': {
                    bgcolor: '#CC2000',
                  }
                }}
              >
                Войти
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleReviewSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Ваша оценка
                </Typography>
                <Rating
                  name="rating"
                  value={reviewData.rating}
                  onChange={(e, newValue) => setReviewData({...reviewData, rating: newValue})}
                  precision={1}
                  size="large"
                  sx={{ 
                    color: '#FFD700',
                    '& .MuiRating-iconEmpty': {
                      color: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Комментарий"
                name="comment"
                multiline
                rows={4}
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                variant="outlined"
                required
                sx={{ mb: 3, 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Достоинства"
                name="pros"
                multiline
                rows={2}
                value={reviewData.pros}
                onChange={(e) => setReviewData({...reviewData, pros: e.target.value})}
                variant="outlined"
                sx={{ mb: 3, 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Недостатки"
                name="cons"
                multiline
                rows={2}
                value={reviewData.cons}
                onChange={(e) => setReviewData({...reviewData, cons: e.target.value})}
                variant="outlined"
                sx={{ mb: 3, 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  }
                }}
              />
            </form>
          )}
        </DialogContent>
        {isLoggedIn && (
          <DialogActions sx={{ bgcolor: '#1a1a1a', p: 3 }}>
            <Button 
              onClick={() => setReviewDialogOpen(false)}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleReviewSubmit}
              variant="contained"
              disabled={!reviewData.rating || !reviewData.comment}
              sx={{
                bgcolor: '#FF2800',
                '&:hover': {
                  bgcolor: '#CC2000',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(255, 40, 0, 0.3)',
                }
              }}
            >
              Отправить
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default CarDetails;