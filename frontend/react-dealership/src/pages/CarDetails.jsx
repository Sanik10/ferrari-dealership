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
import { styled } from '@mui/material/styles';
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
  backgroundColor: 'rgba(25, 25, 25, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '8px', // Унифицируем радиус скругления
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(255, 40, 0, 0.15)'
  }
}));

const FerrariButton = styled(Button)(() => ({
  backgroundColor: '#FF2800',
  color: 'white',
  borderRadius: '6px', // Унифицируем радиус скругления
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '10px 20px',
  boxShadow: '0 4px 8px rgba(255, 40, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#CC2000',
    boxShadow: '0 6px 12px rgba(255, 40, 0, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: 'rgba(40, 40, 40, 0.8)',
  color: 'white',
  borderColor: 'rgba(255, 40, 0, 0.3)',
  borderRadius: '6px', // Унифицируем радиус скругления
  '&:hover': {
    backgroundColor: 'rgba(255, 40, 0, 0.1)',
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: 'transparent',
  borderRadius: '8px', // Унифицируем радиус скругления
  overflow: 'hidden',
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
  borderRadius: '6px', // Унифицируем радиус скругления
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
  borderRadius: '8px', // Унифицируем радиус скругления
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
    borderRadius: '6px', // Унифицируем радиус скругления
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 40, 0, 0.5)',
    borderRadius: '6px', // Унифицируем радиус скругления
  },
}));

const ThumbImage = styled(Box)(({ active }) => ({
  width: 90,
  height: 60,
  borderRadius: '6px', // Унифицируем радиус скругления
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

const CarIconWithText = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  borderRadius: '8px', // Унифицируем радиус скругления
  backgroundColor: 'rgba(25, 25, 30, 0.8)',
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
        
        if (!response || !response.data) {
          setError('Не удалось загрузить информацию об автомобиле');
          return;
        }
        
        // Обработка URL изображений
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
        
        if (response.data && response.data.images && Array.isArray(response.data.images)) {
          // Преобразуем URL-адреса изображений
          response.data.images = response.data.images.map(img => {
            if (!img) return null;
            
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
          }).filter(Boolean); // Удаляем null значения
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
        
        // Get similar cars - обновляем подход с учетом реальных данных API
        const fetchSimilarCars = async (car) => {
          try {
            if (!car || !car.category) return;
            
            // Получаем похожие автомобили той же категории, исключая текущий
            const similarResponse = await carAPI.getAllCars();
            
            let similarCarsData = [];
            
            if (Array.isArray(similarResponse)) {
              similarCarsData = similarResponse;
            } else if (similarResponse.data && Array.isArray(similarResponse.data)) {
              similarCarsData = similarResponse.data;
            } else {
              console.error('Неожиданный формат ответа API (похожие):', similarResponse);
              return;
            }
            
            // Фильтруем по категории и исключаем текущий автомобиль
            const filtered = similarCarsData
              .filter(c => c.id !== car.id && c.category === car.category)
              .slice(0, 4);
            
            if (filtered.length === 0) {
              // Если нет автомобилей той же категории, просто берем любые другие
              const otherCars = similarCarsData
                .filter(c => c.id !== car.id)
                .slice(0, 4);
              
              const processedCars = processCarImages(otherCars, baseUrl);
              setSimilarCars(processedCars);
              return;
            }
            
            const processedCars = processCarImages(filtered, baseUrl);
            setSimilarCars(processedCars);
          } catch (error) {
            console.error('Error fetching similar cars:', error);
          }
        };
        
        // Вспомогательная функция для обработки изображений в автомобилях
        const processCarImages = (cars, baseUrl) => {
          return cars.map(car => {
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
                if (!img) return null;
                
                if (img.startsWith('http') || img.startsWith('blob:')) {
                  return img;
                }
                
                if (img.startsWith('/api/')) {
                  return `${baseUrl}${img.substring(4)}`;
                } else {
                  return `${baseUrl}${img.startsWith('/') ? img : `/${img}`}`;
                }
              }).filter(Boolean); // Удаляем null значения
            }
            
            return processedCar;
          });
        };
        
        fetchSimilarCars(response.data);
        
        // Get reviews - обрабатываем возможную ошибку API отзывов
        try {
          const reviewsResponse = await reviewAPI.getReviews({
            carId: id
          });
          
          const reviewsData = reviewsResponse.data?.items || reviewsResponse.items || [];
          setReviews(reviewsData);
        } catch (reviewErr) {
          console.log('Отзывы недоступны:', reviewErr.message);
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
  };
  
  // Close test drive dialog
  const handleCloseTestDriveDialog = () => {
    setOpenTestDriveDialog(false);
  };
  
  // Функция для генерации временных слотов
  const generateTimeSlots = (startHour = 10) => {
    const slots = [];
    const endHour = 19; // Рабочие часы до 19:00
    
    for (let hour = startHour; hour <= endHour; hour++) {
      // Не добавляем слот на обед
      if (hour !== 13) {
        slots.push(`${hour}:00`);
      }
    }
    
    return slots;
  };

  // Константа с дефолтными временными слотами
  const DEFAULT_TIME_SLOTS = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  
  // Состояние загрузки слотов
  const [slotLoading, setSlotLoading] = useState(false);
  
  // Функция для получения доступных слотов для тест-драйва
  const fetchAvailableSlots = async (date) => {
    // В реальной ситуации это был бы API запрос
    // Но для демонстрации мы создадим имитацию
    try {
      if (!date) return;
      
      setSlotLoading(true);
      
      // Попытка получить слоты через API
      try {
        const response = await testDriveAPI.getAvailableSlots({
          carId: id,
          date: date
        });

        if (response && response.data && Array.isArray(response.data.slots)) {
          setAvailableSlots(response.data.slots);
          return;
        }
      } catch (apiError) {
        console.warn("API error when fetching slots, using fallback:", apiError);
      }
      
      // Имитация API запроса со случайной задержкой от 300 до 800 мс
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
      
      const currentDate = new Date();
      const selectedDate = new Date(date);
      
      // Если выбранная дата сегодня, учитываем текущее время
      if (selectedDate.toDateString() === currentDate.toDateString()) {
        const currentHour = currentDate.getHours();
        
        // Генерируем доступные слоты после текущего часа
        const slots = generateTimeSlots(currentHour + 1);
        setAvailableSlots(slots);
      } else {
        // Иначе возвращаем все стандартные слоты
        const slots = generateTimeSlots();
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots(DEFAULT_TIME_SLOTS);
    } finally {
      setSlotLoading(false);
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
      fetchAvailableSlots(value);
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
  
  // Функция для рендеринга технических характеристик в виде таблицы
  const renderSpecifications = () => {
    // Группы характеристик
    const specGroups = [
      {
        title: "Двигатель и Производительность",
        specs: [
          { name: "Двигатель", value: car.engine },
          { name: "Мощность", value: car.horsepower ? `${car.horsepower} л.с.` : null },
          { name: "Крутящий момент", value: car.torque ? `${car.torque} Нм` : null },
          { name: "Разгон 0-100 км/ч", value: car.acceleration ? `${car.acceleration} сек` : null },
          { name: "Максимальная скорость", value: car.maxSpeed ? `${car.maxSpeed} км/ч` : null },
        ]
      },
      {
        title: "Трансмиссия и Шасси",
        specs: [
          { name: "Трансмиссия", value: car.transmission },
          { name: "Привод", value: car.driveType },
          { name: "Керамические тормоза", value: car.carbonCeramic ? "Да" : "Нет" },
          { name: "Колесная база", value: car.wheelbase ? `${car.wheelbase} мм` : null },
        ]
      },
      {
        title: "Расход и Экологичность",
        specs: [
          { name: "Тип топлива", value: car.fuelType },
          { name: "Расход топлива", value: car.fuelConsumption ? `${car.fuelConsumption} л/100км` : null },
          { name: "Объем бака", value: car.fuelTankCapacity ? `${car.fuelTankCapacity} л` : null },
        ]
      },
      {
        title: "Габариты и Вес",
        specs: [
          { name: "Длина", value: car.length ? `${car.length} мм` : null },
          { name: "Ширина", value: car.width ? `${car.width} мм` : null },
          { name: "Высота", value: car.height ? `${car.height} мм` : null },
          { name: "Снаряженная масса", value: car.weight ? `${car.weight} кг` : null },
        ]
      },
      {
        title: "Дополнительная информация",
        specs: [
          { name: "Пробег", value: car.mileage !== undefined ? `${car.mileage.toLocaleString()} км` : null },
          { name: "Год выпуска", value: car.year },
          { name: "Особая серия", value: car.specialSeries },
          { name: "Сертификат подлинности", value: car.certificateOfAuthenticity ? "Есть" : "Нет" },
        ]
      }
    ];

    return (
      <>
        {specGroups.map((group, groupIndex) => {
          // Фильтруем только те характеристики, у которых есть значения
          const validSpecs = group.specs.filter(spec => spec.value !== null && spec.value !== undefined);
          
          if (validSpecs.length === 0) {
            return null; // Не отображаем группу, если все значения отсутствуют
          }
          
          return (
            <Box key={groupIndex} sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
              <Typography variant="h6" gutterBottom>
                {group.title}
              </Typography>
              <TableContainer component={Paper} sx={{ 
                bgcolor: 'transparent', 
                boxShadow: 'none', 
                '& .MuiTableCell-root': { 
                  borderColor: 'rgba(255,255,255,0.1)' 
                }
              }}>
                <Table size="small">
                  <TableBody>
                    {validSpecs.map((spec, index) => (
                      <TableRow key={index} sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:nth-of-type(odd)': { bgcolor: 'rgba(255,255,255,0.03)' }
                      }}>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', width: '50%' }}>
                          {spec.name}
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'medium' }}>
                          {spec.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );
        })}
        
        {/* Если нет данных ни в одной группе */}
        {specGroups.every(group => 
          group.specs.every(spec => spec.value === null || spec.value === undefined)
        ) && (
          <Typography variant="body1" sx={{ opacity: 0.7, fontStyle: 'italic', textAlign: 'center', py: 4 }}>
            Подробные технические характеристики отсутствуют
          </Typography>
        )}
      </>
    );
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
              borderRadius: '6px', // Унифицируем радиус скругления
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
        
        {/* Back button and title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/catalog')}
            sx={{ 
              color: 'white',
              borderRadius: '6px', // Унифицируем радиус скругления
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
              aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
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
              aria-label="Поделиться"
            >
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* Car title and price */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: '#FF2800', letterSpacing: 2 }}>
            {car.brand}
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
            {car.model} {car.specialSeries ? `${car.specialSeries}` : ''}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={formatPrice(car.price)} 
              sx={{ 
                backgroundColor: '#FF2800',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                height: 40,
                borderRadius: '6px', // Унифицируем радиус скругления
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
            
            {car.mileage !== undefined && (
              <Chip 
                icon={<SpeedIcon />} 
                label={`${car.mileage.toLocaleString()} км`} 
                variant="outlined" 
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  borderRadius: '6px', // Унифицируем радиус скругления
                }}
              />
            )}
            
            <Chip 
              icon={<CalendarMonthIcon />} 
              label={car.year} 
              variant="outlined" 
              sx={{ 
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '6px', // Унифицируем радиус скругления
              }}
            />
            
            {car.category && (
              <Chip 
                label={car.category === 'sport' ? 'Sport' : 
                      car.category === 'gt' ? 'GT' : 
                      car.category === 'hypercar' ? 'Hypercar' : 
                      car.category === 'classic' ? 'Classic' : 
                      car.category === 'limited_edition' ? 'Limited Edition' : 
                      car.category} 
                variant="outlined" 
                sx={{ 
                  backgroundColor: 'rgba(255,40,0,0.1)',
                  borderColor: 'rgba(255,40,0,0.3)',
                  color: 'white',
                  borderRadius: '6px', // Унифицируем радиус скругления
                }}
              />
            )}
          </Box>
        </Box>
        
        {/* Image gallery */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ position: 'relative' }}>
              <MainImageContainer>
                {car.images && car.images.length > 0 ? (
                  <img 
                    src={car.images[currentImageIndex]} 
                    alt={`${car.brand} ${car.model}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.src = '/images/car-placeholder.jpg';
                    }}
                  />
                ) : (
                  <img 
                    src="/images/car-placeholder.jpg" 
                    alt={`${car.brand} ${car.model}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                    }}
                  />
                )}
                
                {/* Overlay for image navigation - improved UI */}
                <Box
                  className="overlay-actions"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 15%, rgba(0,0,0,0) 85%, rgba(0,0,0,0.3) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {car.images && car.images.length > 1 && (
                    <>
                      <IconButton
                        onClick={handlePrevImage}
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255,40,0,0.7)',
                          },
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                        aria-label="Предыдущее изображение"
                      >
                        <ArrowBackIosIcon />
                      </IconButton>
                      
                      <IconButton
                        onClick={handleNextImage}
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255,40,0,0.7)',
                          },
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                        aria-label="Следующее изображение"
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
                
                {/* Fullscreen button */}
                <IconButton
                  onClick={() => setOpenFullImage(true)}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,40,0,0.7)',
                    },
                  }}
                >
                  <FullscreenIcon />
                </IconButton>
                
                {/* Image counter */}
                {car.images && car.images.length > 1 && (
                  <Chip
                    label={`${currentImageIndex + 1} / ${car.images.length}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      borderRadius: '6px', // Унифицируем радиус скругления
                    }}
                  />
                )}
              </MainImageContainer>
              
              {/* Thumbnails */}
              {car.images && car.images.length > 1 && (
                <ThumbsContainer>
                  {car.images.map((image, index) => (
                    <ThumbImage
                      key={index}
                      active={(index === currentImageIndex).toString()}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index+1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/images/car-placeholder.jpg';
                        }}
                      />
                    </ThumbImage>
                  ))}
                </ThumbsContainer>
              )}
            </Box>
          </Grid>
          
          {/* Quick info and actions */}
          <Grid item xs={12} md={4}>
            <StyledPaper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ключевые характеристики
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Grid container spacing={2}>
                  {car.engine && (
                    <Grid item xs={6}>
                      <CarIconWithText>
                        <EngineIcon color="primary" sx={{ mb: 1, fontSize: 30 }} />
                        <Typography variant="body2" color="text.secondary" align="center">
                          Двигатель
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" align="center">
                          {car.engine}
                        </Typography>
                      </CarIconWithText>
                    </Grid>
                  )}
                  
                  {car.horsepower && (
                    <Grid item xs={6}>
                      <CarIconWithText>
                        <SpeedIcon color="primary" sx={{ mb: 1, fontSize: 30 }} />
                        <Typography variant="body2" color="text.secondary" align="center">
                          Мощность
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" align="center">
                          {car.horsepower} л.с.
                        </Typography>
                      </CarIconWithText>
                    </Grid>
                  )}
                  
                  {car.acceleration && (
                    <Grid item xs={6}>
                      <CarIconWithText>
                        <DirectionsCarIcon color="primary" sx={{ mb: 1, fontSize: 30 }} />
                        <Typography variant="body2" color="text.secondary" align="center">
                          Разгон
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" align="center">
                          {car.acceleration} сек
                        </Typography>
                      </CarIconWithText>
                    </Grid>
                  )}
                  
                  {car.maxSpeed && (
                    <Grid item xs={6}>
                      <CarIconWithText>
                        <SpeedIcon color="primary" sx={{ mb: 1, fontSize: 30 }} />
                        <Typography variant="body2" color="text.secondary" align="center">
                          Макс. скорость
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" align="center">
                          {car.maxSpeed} км/ч
                        </Typography>
                      </CarIconWithText>
                    </Grid>
                  )}
                </Grid>
              </Box>
              
              <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              
              {/* Actions buttons */}
              <Stack spacing={2}>
                <FerrariButton
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => window.location.href = `mailto:sales@ld-dealership.com?subject=Запрос на покупку ${car.brand} ${car.model}&body=Здравствуйте! Я заинтересован в покупке ${car.brand} ${car.model} (ID: ${car.id}). Пожалуйста, свяжитесь со мной для уточнения деталей.`}
                >
                  Запросить покупку
                </FerrariButton>
                
                {car.testDriveAvailable && (
                  <FerrariButton
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<EventAvailableIcon />}
                    onClick={handleOpenTestDriveDialog}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,40,0,0.7)',
                      '&:hover': {
                        borderColor: '#FF2800',
                        backgroundColor: 'rgba(255,40,0,0.1)',
                      },
                    }}
                  >
                    Записаться на тест-драйв
                  </FerrariButton>
                )}
                
                <Button
                  fullWidth
                  variant="text"
                  size="large"
                  onClick={() => setReviewDialogOpen(true)}
                  startIcon={<RateReviewOutlinedIcon />}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#FF2800',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    },
                    borderRadius: '6px', // Унифицируем радиус скругления
                  }}
                >
                  Оставить отзыв
                </Button>
              </Stack>
              
              {car.availableCount !== undefined && car.availableCount > 0 && (
                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
                  <Typography variant="body2" color="#4CAF50">
                    В наличии: {car.availableCount} шт.
                  </Typography>
                </Box>
              )}
              
              {car.rentalAvailable && car.rentalPricePerDay && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,40,0,0.1)', borderRadius: '6px', border: '1px dashed rgba(255,40,0,0.3)' }}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Доступна аренда
                  </Typography>
                  <Typography variant="h6" color="#FF2800" fontWeight="bold" align="center">
                    от {formatPrice(car.rentalPricePerDay)}/день
                  </Typography>
                </Box>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
        
        {/* Detailed info tabs */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ 
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FF2800',
                }
              }}
            >
              <StyledTab label="Описание" />
              <StyledTab label="Характеристики" />
              <StyledTab label="Комплектация" />
              <StyledTab label="Отзывы" />
            </Tabs>
          </Box>
          
          {/* Description tab */}
          {currentTab === 0 && (
            <Box sx={{ p: 3 }}>
              <StyledPaper sx={{ p: 3 }}>
                {car.description ? (
                  <>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {car.description}
                    </Typography>
                    
                    {car.history && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                          История автомобиля
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {car.history}
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography variant="body1" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
                    Подробное описание данного автомобиля отсутствует.
                  </Typography>
                )}
              </StyledPaper>
            </Box>
          )}
          
          {/* Specifications tab */}
          {currentTab === 1 && (
            <Box sx={{ p: 3 }}>
              <StyledPaper sx={{ p: 3 }}>
                {renderSpecifications()}
              </StyledPaper>
            </Box>
          )}
          
          {/* Features tab */}
          {currentTab === 2 && (
            <Box sx={{ p: 3 }}>
              <StyledPaper sx={{ p: 3 }}>
                {car.exteriorColor && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Экстерьер
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ColorLensIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.6)' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            Цвет кузова: {car.exteriorColor}
                          </Typography>
                        </Box>
                      </Grid>
                      {car.wheels && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DirectionsCarIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                              Колеса: {car.wheels}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
                
                {(car.interiorColor || car.interiorMaterial) && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Интерьер
                    </Typography>
                    <Grid container spacing={2}>
                      {car.interiorColor && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ColorLensIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                              Цвет салона: {car.interiorColor}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      {car.interiorMaterial && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ColorLensIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                              Материал отделки: {car.interiorMaterial}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
                
                {car.features && car.features.length > 0 ? (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Опции и особенности
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {car.features.map((feature, index) => (
                        <FeatureChip 
                          key={index} 
                          label={feature} 
                          icon={<CheckCircleIcon />}
                        />
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
                    Информация о комплектации отсутствует.
                  </Typography>
                )}
              </StyledPaper>
            </Box>
          )}
          
          {/* Reviews tab */}
          {currentTab === 3 && (
            <Box sx={{ p: 3 }}>
              <StyledPaper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Отзывы клиентов
                  </Typography>
                  <Button
                    startIcon={<AddCommentIcon />}
                    onClick={() => setReviewDialogOpen(true)}
                    sx={{
                      color: 'white',
                      borderRadius: '6px', // Унифицируем радиус скругления
                      '&:hover': {
                        color: '#FF2800',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                      },
                    }}
                  >
                    Оставить отзыв
                  </Button>
                </Box>
                
                {reviews.length > 0 ? (
                  <Stack spacing={3}>
                    {reviews.map((review, index) => (
                      <Box key={index} sx={{ 
                        p: 2, 
                        borderRadius: '8px', 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)' 
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {review.userName || 'Клиент'}
                          </Typography>
                          <Rating 
                            value={review.rating} 
                            readOnly 
                            size="small"
                            sx={{ color: '#FFD700' }}
                          />
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                          {review.comment}
                        </Typography>
                        
                        {(review.pros || review.cons) && (
                          <Grid container spacing={2}>
                            {review.pros && (
                              <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="#4CAF50" gutterBottom>
                                  Достоинства:
                                </Typography>
                                <Typography variant="body2">
                                  {review.pros}
                                </Typography>
                              </Grid>
                            )}
                            
                            {review.cons && (
                              <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="#FF5252" gutterBottom>
                                  Недостатки:
                                </Typography>
                                <Typography variant="body2">
                                  {review.cons}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        )}
                        
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <RateReviewOutlinedIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Отзывов пока нет. Будьте первым, кто оставит отзыв!
                    </Typography>
                  </Box>
                )}
              </StyledPaper>
            </Box>
          )}
        </Box>
        
        {/* Similar cars section */}
        {similarCars.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Похожие автомобили
            </Typography>
            <Grid container spacing={3}>
              {similarCars.map((similarCar) => (
                <Grid item xs={12} sm={6} md={3} key={similarCar.id}>
                  <StyledPaper 
                    component={Link} 
                    to={`/car/${similarCar.id}`}
                    sx={{ 
                      p: 0, 
                      display: 'block', 
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                      <Box 
                        component="img"
                        src={similarCar.mainImage || (similarCar.images && similarCar.images.length > 0 ? similarCar.images[0] : '/images/car-placeholder.jpg')}
                        alt={`${similarCar.brand} ${similarCar.model}`}
                        onError={(e) => {
                          e.target.src = '/images/car-placeholder.jpg';
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {similarCar.brand} {similarCar.model}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {similarCar.year} • {similarCar.mileage ? `${similarCar.mileage.toLocaleString()} км` : 'Новый'}
                        </Typography>
                        <Typography variant="subtitle2" color="#FF2800" fontWeight="bold">
                          {formatPrice(similarCar.price)}
                        </Typography>
                      </Box>
                    </Box>
                  </StyledPaper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
      
      {/* Full-size image viewer dialog */}
      <Dialog
        open={openFullImage}
        onClose={() => setOpenFullImage(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent 
          sx={{ 
            p: 0, 
            bgcolor: 'black',
            position: 'relative', 
            height: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          {car.images && car.images.length > 0 && (
            <img
              src={car.images[currentImageIndex]}
              alt={`${car.brand} ${car.model} - фото ${currentImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.src = '/images/car-placeholder.jpg';
              }}
            />
          )}
          
          <IconButton
            onClick={() => setOpenFullImage(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(255,40,0,0.7)',
              },
            }}
          >
            <Close />
          </IconButton>
          
          {car.images && car.images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 16,
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(255,40,0,0.7)',
                  },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 16,
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(255,40,0,0.7)',
                  },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
              
              <Chip
                label={`${currentImageIndex + 1} / ${car.images.length}`}
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  borderRadius: '6px', // Унифицируем радиус скругления
                }}
              />
            </>
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
            bgcolor: '#1a1a1a',
            color: 'white',
            borderRadius: '8px', // Унифицируем радиус скругления
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5">Запись на тест-драйв</Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
            {car.brand} {car.model} {car.year}
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
                disabled={slotLoading}
              >
                <option value="" disabled>
                  {slotLoading ? 'Загрузка доступных слотов...' : 'Выберите время'}
                </option>
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
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                  </>
                )}
              </TextField>
              {slotLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CircularProgress size={16} sx={{ color: '#FF2800', mr: 1 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Загрузка доступных слотов...
                  </Typography>
                </Box>
              )}
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
            disabled={submitting || slotLoading}
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
      
      {/* Review dialog */}
      <Dialog 
        open={reviewDialogOpen} 
        onClose={() => setReviewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
            borderRadius: '8px', // Унифицируем радиус скругления
          }
        }}
      >
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