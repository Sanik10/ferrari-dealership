import { Card, CardMedia, CardContent, Typography, Box, IconButton, Button, Chip, Divider, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SpeedIcon from '@mui/icons-material/Speed';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, formatNumber } from '../utils/formatters';

const CarCard = ({ car, onFavoriteToggle, isFavorite = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const [manuallyChanged, setManuallyChanged] = useState(false);
  const navigate = useNavigate();

  // Обновляем favorite при изменении isFavorite prop
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);
  
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

  // Обработка изображений
  let imageUrls = ['/images/car-placeholder.jpg']; // Задаем плейсхолдер по умолчанию

  if (car.images && Array.isArray(car.images) && car.images.length > 0) {
    console.log('Обработка массива изображений:', car.images);
    
    // Преобразуем URL-адреса изображений
    imageUrls = car.images.map(image => {
      // Проверяем наличие изображения
      if (!image) {
        console.error('Обнаружен null или undefined в массиве изображений');
        return '/images/car-placeholder.jpg';
      }
      
      // Проверяем, не является ли уже URL полным
      if (typeof image === 'string') {
        if (image.startsWith('http') || image.startsWith('blob:')) {
          return image;
        }
        
        // Если путь начинается с /uploads, добавляем baseUrl
        if (image.startsWith('/uploads/')) {
          return `${baseUrl}${image}`;
        }
        
        // Корректировка пути для избежания дублирования /api
        if (image.startsWith('/api/')) {
          return `${baseUrl}${image.substring(4)}`;
        }
        
        // Во всех остальных случаях
        return `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`;
      } else {
        console.error(`Некорректный формат пути к изображению:`, image);
        return '/images/car-placeholder.jpg';
      }
    });
  } else if (car.mainImage) {
    console.log('Обработка главного изображения:', car.mainImage);
    
    // Если есть только mainImage, но нет массива images
    if (typeof car.mainImage === 'string') {
      if (car.mainImage.startsWith('http') || car.mainImage.startsWith('blob:')) {
        imageUrls = [car.mainImage];
      } else if (car.mainImage.startsWith('/uploads/')) {
        imageUrls = [`${baseUrl}${car.mainImage}`];
      } else if (car.mainImage.startsWith('/api/')) {
        imageUrls = [`${baseUrl}${car.mainImage.substring(4)}`];
      } else {
        imageUrls = [`${baseUrl}${car.mainImage.startsWith('/') ? car.mainImage : `/${car.mainImage}`}`];
      }
    } else {
      console.error(`Некорректный формат пути к главному изображению:`, car.mainImage);
    }
  }

  // Логирование для отладки
  console.log('Обработка изображений в CarCard:', {
    baseUrl,
    carImages: car.images,
    carMainImage: car.mainImage,
    processedUrls: imageUrls
  });

  // Используем главное изображение первым, но только если изображение не было изменено вручную
  useEffect(() => {
    // Если изображение было изменено вручную - не сбрасываем его на главное
    if (manuallyChanged) return;
    
    if (car.mainImage && car.images && Array.isArray(car.images)) {
      const mainImageUrl = car.mainImage.startsWith('http') || car.mainImage.startsWith('blob:') 
        ? car.mainImage 
        : car.mainImage.startsWith('/api/')
          ? `${baseUrl}${car.mainImage.substring(4)}`
          : `${baseUrl}${car.mainImage.startsWith('/') ? car.mainImage : `/${car.mainImage}`}`;
      
      const mainImageIndex = imageUrls.findIndex(url => {
        // Удаляем baseUrl из обоих URL для более точного сравнения
        const cleanUrl = url.replace(baseUrl, '');
        const cleanMainUrl = mainImageUrl.replace(baseUrl, '');
        
        return url === mainImageUrl || cleanUrl.includes(cleanMainUrl.split('/').pop());
      });
      
      if (mainImageIndex !== -1) {
        console.log('Найдено главное изображение:', mainImageIndex, mainImageUrl);
        setCurrentImageIndex(mainImageIndex);
      }
    }
  }, [car.mainImage, imageUrls, baseUrl, car.images, manuallyChanged]);

  console.log('Изображения карточки:', {
    mainImage: car.mainImage,
    images: car.images,
    processedUrls: imageUrls,
    currentIndex: currentImageIndex
  });

  // Отдельная функция для перелистывания изображений вперед
  const nextImage = (e) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Переключение на следующее изображение', {
      текущий: currentImageIndex,
      всего: imageUrls.length
    });
    
    if (imageUrls.length > 1) {
      const newIndex = currentImageIndex === imageUrls.length - 1 ? 0 : currentImageIndex + 1;
      console.log('Новый индекс:', newIndex);
      
      // Устанавливаем флаг, что изображение было изменено вручную
      setManuallyChanged(true);
      setCurrentImageIndex(newIndex);
    }
  };

  // Отдельная функция для перелистывания изображений назад
  const prevImage = (e) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Переключение на предыдущее изображение', {
      текущий: currentImageIndex,
      всего: imageUrls.length
    });
    
    if (imageUrls.length > 1) {
      const newIndex = currentImageIndex === 0 ? imageUrls.length - 1 : currentImageIndex - 1;
      console.log('Новый индекс:', newIndex);
      
      // Устанавливаем флаг, что изображение было изменено вручную
      setManuallyChanged(true);
      setCurrentImageIndex(newIndex);
    }
  };
  
  // Сбрасываем флаг при изменении автомобиля
  useEffect(() => {
    setManuallyChanged(false);
  }, [car.id]);
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !favorite;
    setFavorite(newValue);
    if (onFavoriteToggle) {
      onFavoriteToggle(car.id, newValue);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/car/${car.id}`);
  };

  // Компонент для кнопок навигации
  const ImageNavigationButtons = () => {
    if (imageUrls.length <= 1) return null;
    
    return (
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1,
          pointerEvents: 'none' // Важно! Делаем контейнер "прозрачным" для кликов
        }}
      >
        <IconButton
          onClick={prevImage}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          sx={{
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 30,
            pointerEvents: 'auto' // Восстанавливаем обработку кликов для кнопки
          }}
          size="small"
        >
          <NavigateBeforeIcon />
        </IconButton>
        
        <IconButton
          onClick={nextImage}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          sx={{
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 30,
            pointerEvents: 'auto' // Восстанавливаем обработку кликов для кнопки
          }}
          size="small"
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="car-card"
    >
      <Card 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: 'white',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          }
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Box sx={{ position: 'relative', paddingTop: '60%' }}>
          <CardMedia
            component="img"
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              ...(hovered && { transform: 'scale(1.05)' })
            }}
            image={imageUrls[currentImageIndex]}
            alt={`${car.brand} ${car.model}`}
            onError={(e) => {
              console.error(`Ошибка загрузки изображения: ${imageUrls[currentImageIndex]}`);
              e.target.src = '/images/car-placeholder.jpg';
            }}
          />
          
          {/* Компонент с кнопками навигации */}
          <ImageNavigationButtons />
          
          {car.available === false && (
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>
                ПРОДАНО
              </Typography>
            </Box>
          )}
          
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              zIndex: 2
            }}
          >
            <Chip
              label={car.year}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                height: '28px'
              }}
              size="small"
            />
            
            {car.category && (
              <Chip
                label={car.category.replace('_', ' ').toUpperCase()}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  fontWeight: 'bold',
                  height: '28px'
                }}
                size="small"
              />
            )}
            
            {car.rentalAvailable && (
              <Tooltip title="Доступен для аренды">
                <Chip
                  icon={<TimeToLeaveIcon sx={{ color: 'white !important', fontSize: '16px' }} />}
                  label="АРЕНДА"
                  sx={{
                    bgcolor: 'rgba(25, 118, 210, 0.8)',
                    color: 'white',
                    fontWeight: 'bold',
                    height: '28px',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                  size="small"
                />
              </Tooltip>
            )}
            
            {car.testDriveAvailable && (
              <Tooltip title="Доступен тест-драйв">
                <Chip
                  icon={<DirectionsCarIcon sx={{ color: 'white !important', fontSize: '16px' }} />}
                  label="ТЕСТ-ДРАЙВ"
                  sx={{
                    bgcolor: 'rgba(76, 175, 80, 0.8)',
                    color: 'white',
                    fontWeight: 'bold',
                    height: '28px',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                  size="small"
                />
              </Tooltip>
            )}
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, px: 3, py: 2.5, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 1 }}>
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                fontWeight: "bold", 
                mb: 0.5, 
                lineHeight: 1.2,
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2
              }}
            >
              {car.brand} {car.model}
              {car.specialSeries && ` ${car.specialSeries}`}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {car.mileage !== undefined && (
              <Tooltip title="Пробег">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SpeedIcon sx={{ color: 'text.secondary', mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(car.mileage)} км
                  </Typography>
                </Box>
              </Tooltip>
            )}
            
            {car.horsepower && (
              <Tooltip title="Мощность">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ElectricCarIcon sx={{ color: 'text.secondary', mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {car.horsepower} л.с.
                  </Typography>
                </Box>
              </Tooltip>
            )}
            
            {car.acceleration && (
              <Tooltip title="Разгон 0-100 км/ч">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeToLeaveIcon sx={{ color: 'text.secondary', mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {car.acceleration} сек
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {car.exteriorColor && (
              <Chip 
                label={car.exteriorColor} 
                size="small" 
                variant="outlined" 
                sx={{ height: 24, borderRadius: '4px' }} 
              />
            )}
            {car.transmission && (
              <Chip 
                label={car.transmission} 
                size="small" 
                variant="outlined" 
                sx={{ height: 24, borderRadius: '4px' }} 
              />
            )}
            {car.engine && (
              <Chip 
                label={car.engine} 
                size="small" 
                variant="outlined" 
                sx={{ height: 24, borderRadius: '4px' }} 
              />
            )}
          </Box>
          
          <Divider sx={{ my: 1.5 }} />
          
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {formatPrice(car.price)}
              {car.rentalAvailable && car.rentalPricePerDay && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  Аренда от {formatPrice(car.rentalPricePerDay)}/день
                </Typography>
              )}
            </Typography>
            
            <IconButton
              onClick={handleFavoriteClick}
              size="medium"
              color={favorite ? "error" : "default"}
              sx={{ ml: 'auto' }}
            >
              {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          
          <Button 
            variant="contained" 
            component={Link}
            to={`/car/${car.id}`}
            fullWidth 
            sx={{ mt: 2 }}
          >
            Подробнее
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CarCard;
