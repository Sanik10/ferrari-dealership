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
            bgcolor: 'rgba(40, 40, 40, 0.7)',
            color: 'white',
            '&:hover': { 
              bgcolor: 'rgba(255, 40, 0, 0.8)',
              transform: 'scale(1.1)'
            },
            opacity: hovered ? 1 : 0,
            transition: 'all 0.3s ease',
            zIndex: 30,
            pointerEvents: 'auto', // Восстанавливаем обработку кликов для кнопки
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)'
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
            bgcolor: 'rgba(40, 40, 40, 0.7)',
            color: 'white',
            '&:hover': { 
              bgcolor: 'rgba(255, 40, 0, 0.8)',
              transform: 'scale(1.1)'
            },
            opacity: hovered ? 1 : 0,
            transition: 'all 0.3s ease',
            zIndex: 30,
            pointerEvents: 'auto', // Восстанавливаем обработку кликов для кнопки
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)'
          }}
          size="small"
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>
    );
  };

  // Иконка Ferrari
  const FerrariLogo = () => (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: '40px',
        height: '40px',
        opacity: 0.1,
        filter: 'drop-shadow(0 0 8px rgba(255, 40, 0, 0.5))',
        zIndex: 10,
        transition: 'opacity 0.3s ease',
        ...(hovered && { opacity: 0.3 })
      }}
    >
      <img 
        src="/images/ferrari-logo-small.png" 
        alt="Ferrari" 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </Box>
  );

  // Компонент скорости для визуализации мощности
  const PowerMeter = () => {
    if (!car.horsepower) return null;
    
    // Расчет процента мощности (до 1000 л.с. считается 100%)
    const powerPercent = Math.min(car.horsepower / 1000 * 100, 100);
    
    return (
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          left: 16, 
          zIndex: 10,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          opacity: 0,
          transform: 'translateY(10px)',
          transition: 'all 0.3s ease',
          ...(hovered && { 
            opacity: 1,
            transform: 'translateY(0)'
          })
        }}
      >
        <Box 
          sx={{ 
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `conic-gradient(#FF2800 ${powerPercent}%, transparent ${powerPercent}%, transparent 100%)`,
              transform: 'rotate(-90deg)',
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <Typography variant="caption" sx={{ color: 'white', fontSize: '10px', lineHeight: 1 }}>HP</Typography>
            <Typography variant="body2" sx={{ color: '#FF2800', fontWeight: 'bold', lineHeight: 1 }}>
              {car.horsepower}
            </Typography>
          </Box>
        </Box>
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
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: 'rgba(25, 25, 30, 0.9)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(255, 40, 0, 0.15), 0 0 20px rgba(255, 40, 0, 0.1)',
            border: '1px solid rgba(255, 40, 0, 0.2)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(to right, #FF2800, #FF5F40)',
            zIndex: 10
          }
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Box sx={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              ...(hovered && { transform: 'scale(1.07)' })
            }}
            image={imageUrls[currentImageIndex]}
            alt={`${car.brand} ${car.model}`}
            onError={(e) => {
              console.error(`Ошибка загрузки изображения: ${imageUrls[currentImageIndex]}`);
              e.target.src = '/images/car-placeholder.jpg';
            }}
          />
          
          {/* Кнопки навигации между фото */}
          <ImageNavigationButtons />
          
          {/* Индикатор мощности */}
          <PowerMeter />
          
          {/* Водяной знак Ferrari */}
          <FerrariLogo />
          
          {car.available === false && (
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
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
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
              height: '50%',
              zIndex: 5
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              zIndex: 15
            }}
          >
            <Chip
              label={car.year}
              sx={{
                bgcolor: 'rgba(255, 40, 0, 0.9)',
                color: 'white',
                fontWeight: 'bold',
                height: '28px',
                borderRadius: '4px'
              }}
              size="small"
            />
            
            {car.category && (
              <Chip
                label={car.category.replace('_', ' ').toUpperCase()}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  fontWeight: 'bold',
                  height: '28px',
                  borderRadius: '4px'
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
                    bgcolor: 'rgba(25, 118, 210, 0.9)',
                    color: 'white',
                    fontWeight: 'bold',
                    height: '28px',
                    '& .MuiChip-icon': { color: 'white' },
                    borderRadius: '4px'
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
                    bgcolor: 'rgba(76, 175, 80, 0.9)',
                    color: 'white',
                    fontWeight: 'bold',
                    height: '28px',
                    '& .MuiChip-icon': { color: 'white' },
                    borderRadius: '4px'
                  }}
                  size="small"
                />
              </Tooltip>
            )}
          </Box>
        </Box>
        
        <CardContent sx={{ 
          flexGrow: 1, 
          px: 3, 
          py: 2.5, 
          display: 'flex', 
          flexDirection: 'column', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Диагональная линия */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150%',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(255, 40, 0, 0.7))',
              transform: 'rotate(-8deg) translateY(15px)',
              transformOrigin: 'top right'
            }}
          />
          
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
                WebkitLineClamp: 2,
                color: '#fff'
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
                  <SpeedIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    {formatNumber(car.mileage)} км
                  </Typography>
                </Box>
              </Tooltip>
            )}
            
            {car.horsepower && (
              <Tooltip title="Мощность">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ElectricCarIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    {car.horsepower} л.с.
                  </Typography>
                </Box>
              </Tooltip>
            )}
            
            {car.acceleration && (
              <Tooltip title="Разгон 0-100 км/ч">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeToLeaveIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
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
                sx={{ 
                  height: 24, 
                  borderRadius: '4px',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }} 
              />
            )}
            {car.transmission && (
              <Chip 
                label={car.transmission} 
                size="small" 
                variant="outlined" 
                sx={{ 
                  height: 24, 
                  borderRadius: '4px',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }} 
              />
            )}
            {car.engine && (
              <Chip 
                label={car.engine} 
                size="small" 
                variant="outlined" 
                sx={{ 
                  height: 24, 
                  borderRadius: '4px',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }} 
              />
            )}
          </Box>
          
          <Divider sx={{ my: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF2800', textShadow: '0 0 10px rgba(255, 40, 0, 0.3)' }}>
              {formatPrice(car.price)}
              {car.rentalAvailable && car.rentalPricePerDay && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'rgba(255, 255, 255, 0.7)' }}>
                  Аренда от {formatPrice(car.rentalPricePerDay)}/день
                </Typography>
              )}
            </Typography>
            
            <IconButton
              onClick={handleFavoriteClick}
              size="medium"
              sx={{ 
                ml: 'auto',
                color: favorite ? "#FF2800" : "rgba(255, 255, 255, 0.6)",
                '&:hover': {
                  color: favorite ? "#FF5F40" : "#FF2800"
                }
              }}
            >
              {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          
          <Button 
            variant="contained" 
            component={Link}
            to={`/car/${car.id}`}
            fullWidth 
            sx={{ 
              mt: 2,
              background: 'linear-gradient(45deg, #CC2000, #FF2800)',
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF2800, #FF5F40)',
                boxShadow: '0 4px 15px rgba(255, 40, 0, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Подробнее
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CarCard;
