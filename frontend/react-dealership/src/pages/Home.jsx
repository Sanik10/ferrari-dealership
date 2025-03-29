import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Container, Grid, Divider, Paper, Chip, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Иконки
import SpeedIcon from '@mui/icons-material/Speed';
import BuildIcon from '@mui/icons-material/Build';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// API сервисы
import { carAPI } from '../services/api';

// Импортируйте TestDriveScheduler компонент
import TestDriveScheduler from '../components/TestDriveScheduler';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const featuredRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  // Настройки для карусели
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    adaptiveHeight: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const testimonials = [
    {
      id: 1,
      name: 'Александр Петров',
      role: 'Предприниматель',
      avatar: '/images/client1.jpg',
      text: 'Ferrari не просто автомобиль — это произведение искусства. Сервис в Ferrari Moscow превзошел все мои ожидания.',
    },
    {
      id: 2,
      name: 'Екатерина Соколова',
      role: 'Генеральный директор',
      avatar: '/images/client2.jpg',
      text: 'Тест-драйв Ferrari F8 Tributo стал одним из самых ярких впечатлений в моей жизни. Команда Ferrari Moscow создала незабываемый опыт.',
    },
    {
      id: 3,
      name: 'Михаил Васильев',
      role: 'Коллекционер',
      avatar: '/images/client3.jpg',
      text: 'Мой третий Ferrari, и каждая покупка в этом салоне — воплощение превосходства в каждой детали и индивидуального подхода.',
    }
  ];

  // Причины выбрать Ferrari Moscow
  const reasons = [
    {
      icon: <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 40 }} />,
      title: 'Эксклюзивность',
      description: 'Уникальные модели и индивидуальная настройка под ваши предпочтения',
    },
    {
      icon: <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 40 }} />,
      title: 'Официальный дилер',
      description: 'Полная заводская гарантия и оригинальные комплектующие',
    },
    {
      icon: <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 40 }} />,
      title: 'Премиальный сервис',
      description: 'Персональный менеджер и ВИП-обслуживание 24/7',
    },
    {
      icon: <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 40 }} />,
      title: 'Клубные привилегии',
      description: 'Доступ к эксклюзивным мероприятиям и закрытому сообществу Ferrari',
    }
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Загрузка автомобилей из API
    const fetchCars = async () => {
      setLoading(true);
      try {
        // Получаем автомобили премиум-класса для карусели
        const response = await carAPI.getAllCars({
          limit: 5,
          sort: 'price:desc' // Сортируем по убыванию цены, чтобы показать самые дорогие
        });
        
        let carsData = [];
        
        if (Array.isArray(response)) {
          carsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          carsData = response.data;
        } else if (response.items && Array.isArray(response.items)) {
          carsData = response.items;
        } else {
          console.error('Неожиданный формат ответа API:', response);
        }
        
        // Обрабатываем URL изображений
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
        
        const processedCars = carsData.map(car => {
          // Определяем URL изображения для карусели
          let mainImage = car.mainImage;
          
          // Если главного изображения нет, берем первое из массива изображений
          if (!mainImage && car.images && car.images.length > 0) {
            mainImage = car.images[0];
          }
          
          // Обрабатываем URL изображения
          if (mainImage) {
            if (!mainImage.startsWith('http') && !mainImage.startsWith('blob:')) {
              if (mainImage.startsWith('/api/')) {
                mainImage = `${baseUrl}${mainImage.substring(4)}`;
              } else {
                mainImage = `${baseUrl}${mainImage.startsWith('/') ? mainImage : `/${mainImage}`}`;
              }
            }
          }
          
          return {
            id: car.id,
            name: `${car.brand} ${car.model}`,
            image: mainImage || 'https://via.placeholder.com/800x400?text=Ferrari',
            description: car.description || `Эксклюзивный ${car.brand} ${car.model} ${car.year} года с двигателем ${car.engine || ''}. ${car.transmission ? `Трансмиссия: ${car.transmission}.` : ''} ${car.horsepower ? `Мощность: ${car.horsepower} л.с.` : ''}`,
            price: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(car.price)
          };
        });
        
        setFeaturedCars(processedCars);
      } catch (error) {
        console.error('Ошибка при загрузке автомобилей:', error);
        // В случае ошибки показываем заглушки
        setFeaturedCars([
          { 
            id: 1, 
            name: 'Ferrari SF90 Stradale', 
            image: 'https://via.placeholder.com/800x400?text=Ferrari+SF90+Stradale',
            description: 'Гибридный суперкар мощностью 1000 л.с. Разгон до 100 км/ч всего за 2,5 секунды.',
            price: '₽29 900 000'
          },
          { 
            id: 2, 
            name: 'Ferrari Roma', 
            image: 'https://via.placeholder.com/800x400?text=Ferrari+Roma',
            description: 'Элегантность и мощь в одном автомобиле. 620 л.с. и утонченный итальянский дизайн.',
            price: '₽21 500 000'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    const featuresSection = document.getElementById('featuresSection');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openTestDrive = (car) => {
    setSelectedCar(car);
    setTestDriveOpen(true);
  };

  return (
    <>
      {/* Hero Section с улучшенной анимацией */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        sx={{
          height: '100vh',
          background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          color: 'white',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(255,40,0,0.1) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1, type: 'spring', stiffness: 50 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: { xs: 2, md: 3 },
                mb: 4,
                borderBottom: '1px solid rgba(255,40,0,0.3)',
                borderTop: '1px solid rgba(255,40,0,0.3)',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50px',
                  height: '2px',
                  backgroundColor: '#FF2800',
                }
              }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '3.5rem', sm: '4rem', md: '5.5rem' },
                  textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                  color: '#FF2800',
                  fontWeight: 700,
                  letterSpacing: '3px'
                }}
              >
                FERRARI
              </Typography>
            </Box>
            
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                mb: 3, 
                textAlign: 'center',
                fontWeight: 300,
                textTransform: 'uppercase',
                letterSpacing: '8px'
              }}
            >
              Безупречность в движении
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 5, 
                textAlign: 'center',
                fontWeight: 300,
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.9,
                lineHeight: 1.9,
                letterSpacing: '1px'
              }}
            >
              Испытайте настоящий итальянский темперамент и инженерное совершенство. 
              Ferrari — это не просто автомобиль, это искусство, возведенное в движение.
            </Typography>
            
            <Box sx={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              justifyContent: 'center',
              mt: 6
            }}>
              <Button
                component={Link}
                to="/catalog"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #FF2800 30%, #FF0000 90%)',
                  color: 'white',
                  padding: '15px 35px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 20px rgba(255,40,0,0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(255,40,0,0.5)',
                    background: 'linear-gradient(45deg, #FF0000 30%, #FF2800 90%)',
                    transition: 'all 0.3s',
                  }
                }}
              >
                Каталог моделей
              </Button>
              
              <Button
                onClick={() => openTestDrive(null)}
                variant="outlined"
                size="large"
                startIcon={<EventAvailableIcon />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: '2px',
                  padding: '15px 35px',
                  fontSize: '1.1rem',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  '&:hover': {
                    borderColor: '#FF2800',
                    color: '#FF2800',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Записаться на тест-драйв
              </Button>
            </Box>
          </motion.div>
        </Container>
        
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: 'pointer',
            zIndex: 10,
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0) translateX(-50%)' },
              '40%': { transform: 'translateY(-20px) translateX(-50%)' },
              '60%': { transform: 'translateY(-10px) translateX(-50%)' },
            }
          }}
          onClick={scrollToContent}
        >
          <KeyboardArrowDownIcon 
            sx={{ 
              fontSize: 45,
              color: 'white',
              opacity: scrolled ? 0 : 0.9,
              transition: 'opacity 0.3s',
              filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))'
            }} 
          />
        </Box>
      </Box>

      {/* Карусель с моделями Ferrari */}
      <Box 
        ref={featuredRef}
        component={motion.div}
        style={{ opacity }}
        sx={{ 
          py: 10, 
          background: 'linear-gradient(to bottom, #000000, #111111)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '200px',
            background: 'linear-gradient(to top, #000000, transparent)',
            pointerEvents: 'none',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                textTransform: 'uppercase',
                fontWeight: 300,
                letterSpacing: '3px',
                mb: 1
              }}
              data-aos="fade-up"
            >
              Эксклюзивная коллекция
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#FF2800',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                mb: 4
              }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Новые поступления
            </Typography>
            <Divider sx={{ 
              width: '120px', 
              mx: 'auto', 
              mb: 6, 
              borderColor: 'rgba(255,40,0,0.5)', 
              borderWidth: '2px' 
            }}/>
          </Box>

          <Box sx={{ px: { xs: 0, md: 5 }, mb: 8 }} data-aos="fade-up" data-aos-delay="200">
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 300,
                opacity: 0.7 
              }}>
                <Typography variant="h5">Загрузка эксклюзивных моделей...</Typography>
              </Box>
            ) : featuredCars.length > 0 ? (
              <Slider {...sliderSettings}>
                {featuredCars.map((car) => (
                  <Box key={car.id} sx={{ px: 2 }}>
                    <Paper 
                      elevation={10}
                      sx={{ 
                        borderRadius: '12px',
                        overflow: 'hidden',
                        bgcolor: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,40,0,0.2)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 15px 35px rgba(255, 40, 0, 0.15)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        position: 'relative',
                        height: { xs: '250px', sm: '350px', md: '500px' },
                      }}>
                        <Box
                          component="img"
                          src={car.image}
                          alt={car.name}
                          onError={(e) => {
                            console.error(`Ошибка загрузки изображения: ${car.image}`);
                            e.target.src = 'https://via.placeholder.com/800x400?text=Ferrari';
                          }}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            transition: 'transform 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 20%, transparent 70%)',
                          }}
                        />
                        <Box sx={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          left: 0, 
                          width: '100%',
                          p: { xs: 3, md: 4 },
                          zIndex: 2
                        }}>
                          <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
                            {car.name}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                            {car.horsepower}
                          </Typography>
                          <Typography variant="h5" sx={{ mb: 3, color: '#FF2800', fontWeight: 'bold' }}>
                            {car.price}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                              variant="contained"
                              sx={{
                                backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                                color: 'white',
                                '&:hover': {
                                  backgroundImage: 'linear-gradient(45deg, #FF4D4D 30%, #FF2800 90%)',
                                }
                              }}
                              onClick={() => navigate(`/cars/${car.id}`)}
                            >
                              Подробнее
                            </Button>
                            <Button 
                              variant="outlined"
                              sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': {
                                  borderColor: '#FF2800',
                                  color: '#FF2800',
                                }
                              }}
                              onClick={() => openTestDrive(car)}
                            >
                              Тест-драйв
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                ))}
              </Slider>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 300,
                opacity: 0.7 
              }}>
                <Typography variant="h5">Нет доступных моделей</Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }} data-aos="fade-up" data-aos-delay="300">
            <Button
              component={Link}
              to="/catalog"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              size="large"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#FF2800',
                  color: '#FF2800',
                }
              }}
            >
              Смотреть весь модельный ряд
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Ferrari Heritage Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: '#0A0A0A', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          right: '-100px',
          width: '500px',
          height: '500px',
          backgroundImage: 'url("/images/ferrari-logo-outline.png")',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          opacity: 0.05,
          transform: 'translateY(-50%)',
          zIndex: 1,
          pointerEvents: 'none'
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Box 
                component="img" 
                src="/images/ferrari-heritage.jpg" 
                alt="Ferrari Heritage"
                sx={{
                  width: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,40,0,0.2)'
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-left">
              <DirectionsCarIcon sx={{ fontSize: 60, color: '#FF2800', mb: 2 }} />
              <Typography 
                variant="overline" 
                sx={{ 
                  color: '#FF2800', 
                  letterSpacing: '3px', 
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                С 1947 года
              </Typography>
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ fontWeight: 700, fontSize: { xs: '2.2rem', md: '3rem' } }}
              >
                НАСЛЕДИЕ FERRARI
              </Typography>
              <Divider sx={{ 
                width: '80px', 
                my: 3, 
                borderColor: '#FF2800', 
                borderWidth: '3px' 
              }}/>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 300,
                  lineHeight: 1.9,
                  letterSpacing: '0.5px',
                  fontSize: '1.1rem',
                  opacity: 0.9,
                  mb: 4
                }}
              >
                Марка Ferrari олицетворяет итальянское совершенство, скорость и страсть к автомобилям. 
                Основанная Энцо Феррари в 1947 году, компания произвела революцию в мире спортивных автомобилей, 
                создав непревзойденное сочетание инновационных технологий, скорости и элегантного дизайна.
                <br/><br/>
                Каждый Ferrari — это не просто автомобиль, это произведение искусства, 
                которое отражает страсть к совершенству и стремление к высочайшим стандартам.
              </Typography>
              <Button
                component={Link}
                to="/about"
                variant="outlined"
                sx={{
                  borderColor: '#FF2800',
                  color: '#FF2800',
                  borderWidth: '2px',
                  px: 4,
                  '&:hover': {
                    borderWidth: '2px',
                    backgroundColor: 'rgba(255,40,0,0.1)',
                  }
                }}
              >
                Узнать больше о нас
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="featuresSection" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#000000' }}>
        <Container>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              mb: 8,
              color: 'white',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '3px',
                backgroundColor: '#FF2800',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)'
              }
            }}
            data-aos="fade-up"
          >
            СОВЕРШЕНСТВО В ДЕТАЛЯХ
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} data-aos="fade-up">
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 4,
                  height: '100%',
                  transition: 'transform 0.3s',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    backgroundColor: 'rgba(255,40,0,0.05)',
                  }
                }}
              >
                <SpeedIcon sx={{ fontSize: 70, color: '#FF2800', mb: 3 }} />
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 500,
                    letterSpacing: '1px',
                    mb: 2,
                    color: 'white'
                  }}
                >
                  МОЩНОСТЬ
                </Typography>
                <Typography sx={{ fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
                  Непревзойденная производительность и скорость в каждом автомобиле — воплощение инженерного совершенства на дороге.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="200">
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 4,
                  height: '100%',
                  transition: 'transform 0.3s',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    backgroundColor: 'rgba(255,40,0,0.05)',
                  }
                }}
              >
                <BuildIcon sx={{ fontSize: 70, color: '#FF2800', mb: 3 }} />
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 500,
                    letterSpacing: '1px',
                    mb: 2,
                    color: 'white'
                  }}
                >
                  КАЧЕСТВО
                </Typography>
                <Typography sx={{ fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
                  Премиальные материалы и безупречное исполнение в каждой детали создают непревзойденный комфорт и роскошь.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="400">
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 4,
                  height: '100%',
                  transition: 'transform 0.3s',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    backgroundColor: 'rgba(255,40,0,0.05)',
                  }
                }}
              >
                <StarIcon sx={{ fontSize: 70, color: '#FF2800', mb: 3 }} />
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 500,
                    letterSpacing: '1px',
                    mb: 2,
                    color: 'white'
                  }}
                >
                  ПРЕСТИЖ
                </Typography>
                <Typography sx={{ fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
                  Эксклюзивность и статус в каждой модели — символ достижений и признание вашего безупречного вкуса.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Почему выбирают Ferrari Moscow */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url("/images/ferrari-showroom.jpg")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }} data-aos="fade-up">
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                color: 'white',
                fontWeight: 300,
                letterSpacing: '2px'
              }}
            >
              ПОЧЕМУ ВЫБИРАЮТ
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#FF2800',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            >
              Ferrari Moscow
            </Typography>
            <Divider sx={{ 
              width: '100px', 
              mx: 'auto', 
              my: 3, 
              borderColor: 'rgba(255,40,0,0.5)', 
              borderWidth: '2px' 
            }}/>
          </Box>
          
          <Grid container spacing={4}>
            {reasons.map((reason, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'rgba(15,15,15,0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      backgroundColor: 'rgba(255,40,0,0.05)',
                      boxShadow: '0 10px 30px rgba(255, 40, 0, 0.2)'
                    }
                  }}
                >
                  <Box sx={{ mb: 3 }}>{reason.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: 'white', textAlign: 'center' }}>
                    {reason.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                    {reason.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box 
            sx={{ 
              textAlign: 'center', 
              mt: 8, 
              p: 4,
              bgcolor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255,40,0,0.2)'
            }} 
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              Готовы ощутить легендарную мощь Ferrari?
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PhoneIcon />}
              sx={{
                mt: 2,
                backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundImage: 'linear-gradient(45deg, #FF4D4D 30%, #FF2800 90%)',
                }
              }}
              component={Link}
              to="/contact"
            >
              Связаться с нами
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#0A0A0A' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }} data-aos="fade-up">
            <FormatQuoteIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7, mb: 2 }} />
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                color: 'white',
                fontWeight: 300
              }}
            >
              ЧТО ГОВОРЯТ НАШИ КЛИЕНТЫ
            </Typography>
            <Divider sx={{ 
              width: '80px', 
              mx: 'auto', 
              my: 3, 
              borderColor: 'rgba(255,40,0,0.4)', 
              borderWidth: '2px' 
            }}/>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={testimonial.id} data-aos="fade-up" data-aos-delay={index * 100}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      width: 30,
                      height: 30,
                      backgroundImage: 'url("/images/quote.svg")',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      opacity: 0.2
                    }
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      mb: 4,
                      fontStyle: 'italic',
                      fontSize: '1.1rem',
                      lineHeight: 1.7,
                      flex: 1
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      sx={{ width: 56, height: 56, mr: 2, border: '2px solid #FF2800' }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Компонент записи на тест-драйв */}
      <TestDriveScheduler 
        open={testDriveOpen} 
        onClose={() => setTestDriveOpen(false)} 
        car={selectedCar} 
      />
    </>
  );
};

export default Home;