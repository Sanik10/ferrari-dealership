import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Divider,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  useMediaQuery,
  IconButton,
  Rating,
  List,
  ListItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

// Импорт компонента для записи на тест-драйв
import TestDriveScheduler from '../components/TestDriveScheduler';

// Иконки
import SpeedIcon from '@mui/icons-material/Speed';
import SettingsIcon from '@mui/icons-material/Settings';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VerifiedIcon from '@mui/icons-material/Verified';

// API
import { carAPI } from '../services/api';

const TestDrive = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Загрузка доступных для тест-драйва автомобилей
  useEffect(() => {
    const fetchTestDriveCars = async () => {
      try {
        setLoading(true);
        const response = await carAPI.getTestDriveCars();
        setCars(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке автомобилей для тест-драйва:', error);
        setError('Не удалось загрузить доступные автомобили. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestDriveCars();
  }, []);
  
  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setSchedulerOpen(true);
  };
  
  const handleSchedulerClose = () => {
    setSchedulerOpen(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Правила тест-драйва
  const testDriveRules = [
    'Водительский стаж не менее 3 лет',
    'Наличие действующего водительского удостоверения',
    'Возраст от 25 лет',
    'Отсутствие алкогольного или наркотического опьянения',
    'Для тест-драйва некоторых моделей может потребоваться подтверждение опыта вождения спортивных автомобилей'
  ];
  
  // Часто задаваемые вопросы
  const faqs = [
    {
      question: 'Сколько длится тест-драйв?',
      answer: 'Стандартный тест-драйв длится от 30 до 60 минут в зависимости от выбранной модели и условий.'
    },
    {
      question: 'Можно ли выбрать маршрут для тест-драйва?',
      answer: 'Маршруты тест-драйва определяются нашими специалистами, но мы стараемся учитывать ваши пожелания.'
    },
    {
      question: 'Какие документы нужно иметь при себе?',
      answer: 'Для тест-драйва необходимо иметь при себе паспорт и водительское удостоверение с опытом вождения не менее 3 лет.'
    },
    {
      question: 'Нужно ли платить за тест-драйв?',
      answer: 'Нет, тест-драйв проводится бесплатно для потенциальных клиентов. Для некоторых эксклюзивных моделей может понадобиться предварительное подтверждение.'
    }
  ];
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8)), url("/images/ferrari-test-drive-bg.jpg")',
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              ТЕСТ-ДРАЙВ
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
              Испытайте непревзойденную мощь и элегантность Ferrari на дороге.
              Запишитесь на эксклюзивный тест-драйв сегодня.
            </Typography>
          </motion.div>
        </Box>
        
        {/* Процесс тест-драйва */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 8, 
              borderRadius: '12px',
              background: 'linear-gradient(to right, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.8))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,40,0,0.2)'
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <CircleStep number="1" />
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    Выберите модель
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Просмотрите наш модельный ряд и выберите Ferrari, который хотите испытать
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <CircleStep number="2" />
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    Запланируйте дату
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Выберите удобное для вас время и дату для проведения тест-драйва
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <CircleStep number="3" />
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    Наслаждайтесь опытом
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Получите незабываемые впечатления от вождения легендарного автомобиля
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
        
        {/* Доступные автомобили */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Доступные модели
            </Typography>
            
            <Button 
              component={Link}
              to="/catalog"
              endIcon={<ChevronRightIcon />}
              sx={{
                color: '#FF2800',
                '&:hover': { backgroundColor: 'rgba(255,40,0,0.1)' }
              }}
            >
              Все модели
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#FF2800' }} />
            </Box>
          ) : error ? (
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
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={3}>
                {cars.length > 0 ? (
                  cars.map((car) => (
                    <Grid item xs={12} sm={6} md={4} key={car.id}>
                      <motion.div variants={itemVariants}>
                        <Card 
                          elevation={5}
                          sx={{ 
                            borderRadius: '12px',
                            backgroundColor: 'rgba(30,30,30,0.8)',
                            backdropFilter: 'blur(5px)',
                            overflow: 'hidden',
                            transition: 'transform 0.3s',
                            '&:hover': {
                              transform: 'translateY(-8px)'
                            }
                          }}
                        >
                          <CardActionArea onClick={() => handleCarSelect(car)}>
                            <CardMedia
                              component="img"
                              height="160"
                              image={car.imageUrl || '/images/default-car.jpg'}
                              alt={`${car.brand} ${car.model}`}
                            />
                            <CardContent sx={{ color: 'white' }}>
                              <Typography variant="h6" component="div" fontWeight="bold">
                                {car.brand} {car.model}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', my: 1 }}>
                                <Rating value={4.5} precision={0.5} readOnly size="small" />
                                <Chip 
                                  label="Доступно сейчас" 
                                  size="small" 
                                  sx={{ 
                                    ml: 1, 
                                    backgroundColor: 'rgba(255,40,0,0.2)', 
                                    color: '#FF2800',
                                    fontWeight: 'bold',
                                    fontSize: '0.7rem'
                                  }} 
                                />
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                {car.year} • {car.engineType}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <SpeedIcon sx={{ mr: 1, fontSize: '1rem', color: '#FF2800' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                  {car.horsepower} л.с. • {car.maxSpeed} км/ч
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <SettingsIcon sx={{ mr: 1, fontSize: '1rem', color: '#FF2800' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                  {car.transmission} • 0-100 км/ч: {car.acceleration}с
                                </Typography>
                              </Box>
                              
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<EventAvailableIcon />}
                                sx={{
                                  mt: 2,
                                  backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                                  color: 'white',
                                  py: 1
                                }}
                              >
                                Записаться на тест-драйв
                              </Button>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <DirectionsCarIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                      <Typography variant="h6">
                        В данный момент нет доступных автомобилей для тест-драйва
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          mt: 2,
                          borderColor: '#FF2800',
                          color: '#FF2800',
                          '&:hover': {
                            borderColor: '#FF2800',
                            backgroundColor: 'rgba(255,40,0,0.1)'
                          }
                        }}
                        component={Link}
                        to="/contact"
                      >
                        Связаться с нами
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </motion.div>
          )}
        </Box>
        
        {/* Правила и FAQ */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Paper
                elevation={3}
                sx={{ 
                  p: 4, 
                  borderRadius: '12px',
                  background: 'linear-gradient(to right, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.8))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,40,0,0.2)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VerifiedIcon sx={{ color: '#FF2800', mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Правила тест-драйва
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <Box>
                  {testDriveRules.map((rule, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box 
                        sx={{ 
                          minWidth: 28, 
                          height: 28, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255,40,0,0.1)', 
                          color: '#FF2800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          mt: 0.5,
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body1">{rule}</Typography>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Button
                  variant="outlined"
                  sx={{
                    mt: 3,
                    alignSelf: 'flex-start',
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#FF2800',
                      color: '#FF2800'
                    }
                  }}
                  onClick={() => setInfoDialogOpen(true)}
                  startIcon={<HelpOutlineIcon />}
                >
                  Подробнее о правилах
                </Button>
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Paper
                elevation={3}
                sx={{ 
                  p: 4, 
                  borderRadius: '12px',
                  background: 'linear-gradient(to right, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.8))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,40,0,0.2)',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HelpOutlineIcon sx={{ color: '#FF2800', mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Часто задаваемые вопросы
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <Box>
                  {faqs.map((faq, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          component="span" 
                          sx={{ 
                            color: '#FF2800', 
                            mr: 1,
                            fontSize: '1.2rem'
                          }}
                        >
                          Q:
                        </Box>
                        {faq.question}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 4 }}>
                        {faq.answer}
                      </Typography>
                      {index < faqs.length - 1 && (
                        <Divider sx={{ mt: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
        
        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Paper
              elevation={5}
              sx={{ 
                p: { xs: 4, md: 6 }, 
                borderRadius: '12px',
                backgroundImage: 'linear-gradient(to right, rgba(255,40,0,0.9), rgba(200,20,0,0.8))',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-100px',
                  right: '-100px',
                  width: '300px',
                  height: '300px',
                  backgroundImage: 'url("/images/ferrari-logo-white.png")',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.1,
                  zIndex: 0,
                  transform: 'rotate(15deg)'
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" gutterBottom fontWeight="bold">
                  Готовы ощутить мощь Ferrari?
                </Typography>
                <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', mb: 4, fontWeight: 300 }}>
                  Запишитесь на тест-драйв сегодня и испытайте непревзойденное удовольствие от вождения легендарных автомобилей
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: '#FF2800',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Записаться сейчас
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Box>
        
        {/* Отзывы о тест-драйве */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
            Отзывы о тест-драйве
          </Typography>
          
          <Grid container spacing={3}>
            {[
              {
                name: 'Александр Петров',
                text: 'Невероятные ощущения! Тест-драйв Ferrari Roma превзошел все мои ожидания. Отличный сервис и профессиональный подход персонала.',
                date: '15 октября 2023',
                car: 'Ferrari Roma',
                rating: 5
              },
              {
                name: 'Екатерина Соколова',
                text: 'Спасибо Ferrari Moscow за потрясающую возможность. Тест-драйв SF90 Stradale - это незабываемый опыт, который нужно испытать каждому любителю спортивных автомобилей.',
                date: '3 сентября 2023',
                car: 'Ferrari SF90 Stradale',
                rating: 5
              },
              {
                name: 'Михаил Васильев',
                text: 'Профессиональный инструктор, детальное объяснение всех возможностей автомобиля и, конечно, само вождение - все на высшем уровне! Очень доволен.',
                date: '22 ноября 2023',
                car: 'Ferrari F8 Tributo',
                rating: 4.5
              }
            ].map((review, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Paper
                    elevation={3}
                    sx={{ 
                      p: 3, 
                      borderRadius: '12px',
                      background: 'linear-gradient(to right, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.8))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,40,0,0.2)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {review.name}
                      </Typography>
                      <Rating value={review.rating} precision={0.5} readOnly size="small" />
                    </Box>
                    
                    <Chip 
                      label={review.car} 
                      size="small" 
                      sx={{ 
                        alignSelf: 'flex-start',
                        mb: 2,
                        backgroundColor: 'rgba(255,40,0,0.1)', 
                        color: '#FF2800',
                        borderColor: 'rgba(255,40,0,0.3)',
                        border: '1px solid'
                      }} 
                    />
                    
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, flexGrow: 1 }}>
                      "{review.text}"
                    </Typography>
                    
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
                      {review.date}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
      {/* Компонент записи на тест-драйв */}
      <TestDriveScheduler
        open={schedulerOpen}
        onClose={handleSchedulerClose}
        car={selectedCar}
      />
      
      {/* Информационный диалог */}
      <Dialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.95))',
            backdropFilter: 'blur(10px)',
            color: 'white'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedIcon sx={{ color: '#FF2800', mr: 2 }} />
            <Typography variant="h6">Правила проведения тест-драйва</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            Для обеспечения вашей безопасности и комфорта во время тест-драйва, пожалуйста, ознакомьтесь с правилами проведения тест-драйва автомобилей Ferrari:
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: '#FF2800' }}>
                  Требования к водителю:
                </Typography>
                <List>
                  <ListItem>
                    <Typography variant="body2">• Возраст не менее 25 лет</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Водительский стаж не менее 3 лет</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Наличие действующего водительского удостоверения соответствующей категории</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Наличие паспорта</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Отсутствие алкогольного или наркотического опьянения</Typography>
                  </ListItem>
                </List>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: '#FF2800' }}>
                  Правила тест-драйва:
                </Typography>
                <List>
                  <ListItem>
                    <Typography variant="body2">• Продолжительность тест-драйва составляет 30-60 минут</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Тест-драйв проводится только по установленным маршрутам</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Во время тест-драйва присутствует наш специалист</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Необходимо соблюдать ПДД и следовать указаниям инструктора</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Превышение скорости и опасное вождение запрещены</Typography>
                  </ListItem>
                </List>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: '#FF2800' }}>
                  Дополнительные условия:
                </Typography>
                <List>
                  <ListItem>
                    <Typography variant="body2">• Для тест-драйва определенных моделей может потребоваться подтверждение опыта вождения спортивных автомобилей</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Ferrari Moscow оставляет за собой право отказать в проведении тест-драйва без объяснения причин</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• В случае нарушения правил тест-драйв может быть прекращен в любой момент</Typography>
                  </ListItem>
                </List>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: '#FF2800' }}>
                  Ответственность:
                </Typography>
                <List>
                  <ListItem>
                    <Typography variant="body2">• Водитель несет ответственность за любые нарушения ПДД во время тест-драйва</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Водитель несет ответственность за ущерб, причиненный автомобилю по его вине</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="body2">• Перед тест-драйвом необходимо подписать соглашение о проведении тест-драйва</Typography>
                  </ListItem>
                </List>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, bgcolor: 'rgba(255,40,0,0.1)', p: 2, borderRadius: '8px' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
              Ferrari Moscow стремится обеспечить максимальный комфорт и безопасность во время тест-драйва. Если у вас есть вопросы по правилам проведения тест-драйва, пожалуйста, свяжитесь с нашими специалистами.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setInfoDialogOpen(false)} 
            sx={{ 
              color: '#FF2800',
              '&:hover': { backgroundColor: 'rgba(255,40,0,0.1)' }
            }}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Компонент CircleStep для шагов процесса
const CircleStep = ({ number }) => {
  return (
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        boxShadow: '0 4px 20px rgba(255,40,0,0.3)'
      }}
    >
      {number}
    </Box>
  );
};

export default TestDrive;