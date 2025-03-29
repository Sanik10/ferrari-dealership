import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useMediaQuery
} from '@mui/material';
import { useTheme, styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DiamondIcon from '@mui/icons-material/Diamond';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FlightIcon from '@mui/icons-material/Flight';
import SpaIcon from '@mui/icons-material/Spa';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import EventSeatIcon from '@mui/icons-material/EventSeat';

// API
import { userAPI } from '../services/api';
import vipAPI from '../services/vipService';

// Styled components
const GradientDivider = styled(Divider)(({ theme }) => ({
  background: 'linear-gradient(90deg, transparent, #FF2800, transparent)',
  height: '2px',
  border: 'none',
  margin: theme.spacing(5, 0),
}));

const VipServiceCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(25, 25, 25, 0.8)',
  borderRadius: '12px',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)'
  }
}));

const VipChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha('#FF2800', 0.9),
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '4px',
  position: 'absolute',
  top: '16px',
  right: '16px',
  zIndex: 1
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'rgba(25, 25, 25, 0.7)',
  color: 'white',
  borderRadius: '8px !important',
  marginBottom: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&::before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `0 0 ${theme.spacing(2)}px 0`,
  }
}));

// Main VipServices component
const VipServices = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVipStatus, setUserVipStatus] = useState(null);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [vipServices, setVipServices] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'email'
  });
  const [contactStatus, setContactStatus] = useState(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  
  // Fetch user VIP status and services on component mount
  useEffect(() => {
    const fetchVipData = async () => {
      try {
        setLoading(true);
        
        // Get user status (if logged in)
        const userResponse = await userAPI.getCurrentUser();
        if (userResponse.data) {
          setUserVipStatus(userResponse.data.vipStatus || null);
          
          // Pre-fill form if user is logged in
          setContactForm(prevState => ({
            ...prevState,
            name: `${userResponse.data.firstName} ${userResponse.data.lastName}`,
            email: userResponse.data.email,
            phone: userResponse.data.phone || ''
          }));
        }
        
        try {
          // Пытаемся получить VIP-услуги с сервера
          const vipServicesResponse = await vipAPI.getVipServices();
          if (vipServicesResponse.data) {
            setVipServices(vipServicesResponse.data);
          } else {
            // Если сервер вернул пустые данные, используем фиктивные
            setVipServices(vipServiceCategories.flatMap(category => 
              category.services.map(service => ({
                ...service,
                categoryId: category.title,
                categoryIcon: category.icon
              }))
            ));
          }
        } catch (error) {
          console.error('Error fetching VIP services:', error);
          // Если API не доступно, используем фиктивные данные
          setVipServices(vipServiceCategories.flatMap(category => 
            category.services.map(service => ({
              ...service,
              categoryId: category.title,
              categoryIcon: category.icon
            }))
          ));
        }
        
      } catch (error) {
        console.error('Error fetching VIP data:', error);
        setError('Не удалось загрузить информацию о VIP-услугах.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVipData();
  }, []);
  
  // Handle contact form open
  const handleOpenContactDialog = () => {
    setOpenContactDialog(true);
    setContactStatus(null);
  };
  
  // Handle contact form close
  const handleCloseContactDialog = () => {
    setOpenContactDialog(false);
  };
  
  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setContactForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Handle contact form submission
  const handleSubmitContact = async () => {
    // Validate form
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля.'
      });
      return;
    }
    
    try {
      setContactSubmitting(true);
      
      // Вместо вызова vipAPI.submitVipRequest используем contactAPI или создаем заглушку
      // await vipAPI.submitVipRequest(contactForm);
      
      // Симулируем отправку запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set success status
      setContactStatus({
        success: true,
        message: 'Ваш запрос успешно отправлен. Наш VIP-консультант свяжется с вами в ближайшее время.'
      });
      
      // Clear form after success (but keep user details)
      setContactForm(prevState => ({
        ...prevState,
        message: '',
        preferredContact: 'email'
      }));
      
    } catch (error) {
      console.error('Error submitting VIP request:', error);
      setContactStatus({
        success: false,
        message: 'Произошла ошибка при отправке запроса. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.'
      });
    } finally {
      setContactSubmitting(false);
    }
  };
  
  // Animation variants
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
  
  // VIP Services data
  const vipServiceCategories = [
    {
      title: "Персональное обслуживание",
      icon: <PersonIcon sx={{ color: '#FF2800' }} />,
      services: [
        {
          title: "Персональный менеджер",
          description: "Выделенный специалист, доступный 24/7 для решения любых вопросов, связанных с вашим Ferrari.",
          icon: <PersonIcon />
        },
        {
          title: "Приоритетная запись на сервис",
          description: "Возможность обслуживания вашего автомобиля вне очереди и в удобное для вас время.",
          icon: <ScheduleIcon />
        },
        {
          title: "VIP-зона ожидания",
          description: "Эксклюзивная лаунж-зона с премиальными напитками, закусками и развлечениями на время обслуживания вашего автомобиля.",
          icon: <SpaIcon />
        }
      ]
    },
    {
      title: "Транспортные услуги",
      icon: <TimeToLeaveIcon sx={{ color: '#FF2800' }} />,
      services: [
        {
          title: "Трансфер автомобиля",
          description: "Доставка вашего Ferrari к месту обслуживания и обратно на специализированном транспорте.",
          icon: <LocalShippingIcon />
        },
        {
          title: "Замена на время сервиса",
          description: "Предоставление автомобиля Ferrari на время обслуживания вашего автомобиля.",
          icon: <TimeToLeaveIcon />
        },
        {
          title: "VIP-трансфер",
          description: "Персональный водитель для трансфера из/в аэропорт, на мероприятия и по другим направлениям.",
          icon: <AirportShuttleIcon />
        }
      ]
    },
    {
      title: "Эксклюзивные возможности",
      icon: <DiamondIcon sx={{ color: '#FF2800' }} />,
      services: [
        {
          title: "Приоритетный доступ к новым моделям",
          description: "Возможность заказа лимитированных серий и эксклюзивных моделей Ferrari вне общей очереди.",
          icon: <VpnKeyIcon />
        },
        {
          title: "Поездка на фабрику в Маранелло",
          description: "Организация индивидуального тура на завод Ferrari с экскурсией по закрытым для обычных посетителей зонам.",
          icon: <FlightIcon />
        },
        {
          title: "Участие в закрытых мероприятиях",
          description: "Приглашения на эксклюзивные события Ferrari, недоступные для широкой публики.",
          icon: <EventSeatIcon />
        }
      ]
    },
    {
      title: "Бизнес-привилегии",
      icon: <BusinessCenterIcon sx={{ color: '#FF2800' }} />,
      services: [
        {
          title: "Консьерж-сервис",
          description: "Помощь в организации поездок, бронировании отелей, ресторанов и других услуг по всему миру.",
          icon: <BusinessCenterIcon />
        },
        {
          title: "Программа лояльности Ferrari",
          description: "Накопление баллов за каждую покупку и обслуживание с возможностью их обмена на эксклюзивные предложения.",
          icon: <StarIcon />
        },
        {
          title: "Корпоративные мероприятия",
          description: "Организация корпоративных мероприятий с использованием автомобилей Ferrari и инфраструктуры дилерского центра.",
          icon: <SportsMartialArtsIcon />
        }
      ]
    }
  ];
  
  // FAQ data
  const faqData = [
    {
      question: "Как получить VIP-статус?",
      answer: "VIP-статус предоставляется клиентам Ferrari при покупке нового автомобиля, а также может быть присвоен постоянным клиентам по решению руководства дилерского центра. Для получения дополнительной информации свяжитесь с нами."
    },
    {
      question: "Каков срок действия VIP-статуса?",
      answer: "VIP-статус действует в течение 3 лет с момента покупки нового автомобиля Ferrari. По истечении этого срока статус может быть продлен при соответствии определенным критериям."
    },
    {
      question: "Могу ли я передать свои VIP-привилегии другому лицу?",
      answer: "VIP-статус является персональным и не может быть передан третьим лицам. Однако вы можете добавить одного члена семьи в качестве дополнительного пользователя некоторых VIP-услуг."
    },
    {
      question: "Доступны ли VIP-услуги в других дилерских центрах Ferrari?",
      answer: "Ваш VIP-статус действителен во всех официальных дилерских центрах Ferrari в России. При посещении дилерских центров за рубежом некоторые привилегии могут быть доступны по предварительному согласованию."
    },
    {
      question: "Как забронировать VIP-услугу?",
      answer: "Для бронирования услуги свяжитесь с вашим персональным менеджером или воспользуйтесь формой обратной связи на этой странице. Рекомендуем бронировать услуги заранее, особенно в высокий сезон."
    }
  ];
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95)), url("/images/ferrari-vip-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        pt: 12,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
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
              FERRARI PRIVILEGE CLUB
            </Typography>
            
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              VIP УСЛУГИ
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
              Эксклюзивные привилегии для владельцев Ferrari.
              Персональное обслуживание высочайшего уровня.
            </Typography>
          </motion.div>
        </Box>
        
        {/* Loading state */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress sx={{ color: '#FF2800' }} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              my: 4, 
              backgroundColor: 'rgba(211, 47, 47, 0.1)', 
              color: 'white',
              border: '1px solid rgba(211, 47, 47, 0.3)'
            }}
          >
            {error}
          </Alert>
        ) : (
          <>
            {/* VIP Status Banner */}
            <Box sx={{ mb: 6 }}>
              <Paper
                sx={{
                  p: { xs: 4, md: 6 },
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(40,40,40,0.8)), url("/images/ferrari-vip-card-bg.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 40, 0, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ mb: { xs: 4, md: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DiamondIcon sx={{ color: '#FF2800', fontSize: 32, mr: 2 }} />
                    <Typography variant="h4" fontWeight="bold">
                      Ferrari Privilege Club
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px' }}>
                    Эксклюзивная программа привилегий для владельцев Ferrari. 
                    Персональное обслуживание, приоритетный доступ к новым моделям и закрытым мероприятиям, 
                    специальные условия обслуживания и многое другое.
                  </Typography>
                  
                  {userVipStatus ? (
                    <Box 
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'rgba(255, 40, 0, 0.1)',
                        border: '1px solid rgba(255, 40, 0, 0.3)',
                        borderRadius: '8px',
                        p: 2,
                        mt: 2
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#FF2800', mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          У вас активирован VIP-статус
                        </Typography>
                        <Typography variant="body2">
                          Уровень: {userVipStatus.level} • Действует до: {new Date(userVipStatus.expiresAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleOpenContactDialog}
                      sx={{
                        backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          boxShadow: '0 8px 16px rgba(255, 40, 0, 0.3)'
                        }
                      }}
                    >
                      Узнать о получении VIP-статуса
                    </Button>
                  )}
                </Box>
                
                <Box
                  sx={{
                    width: { xs: '100%', md: '280px' },
                    height: { xs: '180px', md: '180px' },
                    backgroundImage: 'url("/images/ferrari-vip-card.png")',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </Paper>
            </Box>
            
            {/* VIP Services */}
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ color: '#FF2800', mr: 2 }} />
              Каталог VIP-услуг
            </Typography>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {vipServiceCategories.map((category, categoryIndex) => (
                <Box key={categoryIndex} sx={{ mb: 6 }}>
                  <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    {category.icon}
                    <Box component="span" sx={{ ml: 2 }}>{category.title}</Box>
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {category.services.map((service, serviceIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={serviceIndex}>
                        <motion.div variants={itemVariants}>
                          <VipServiceCard>
                            {/* If service is marked as premium */}
                            {service.premium && (
                              <VipChip 
                                label="PREMIUM"
                                icon={<DiamondIcon />}
                              />
                            )}
                            
                            <CardMedia
                              component="img"
                              height="140"
                              image={service.image || `/images/vip-service-${categoryIndex + 1}-${serviceIndex + 1}.jpg`}
                              alt={service.title}
                            />
                            
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box 
                                  sx={{ 
                                    bgcolor: 'rgba(255, 40, 0, 0.1)', 
                                    p: 1, 
                                    borderRadius: '50%',
                                    mr: 2
                                  }}
                                >
                                  {service.icon || category.icon}
                                </Box>
                                <Typography variant="h6" component="h3" fontWeight="bold">
                                  {service.title}
                                </Typography>
                              </Box>
                              
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                                {service.description}
                              </Typography>
                              
                              {userVipStatus ? (
                                <Button
                                  variant="outlined"
                                  fullWidth
                                  onClick={handleOpenContactDialog}
                                  sx={{
                                    borderColor: '#FF2800',
                                    color: 'white',
                                    '&:hover': {
                                      borderColor: '#FF2800',
                                      backgroundColor: 'rgba(255, 40, 0, 0.1)'
                                    }
                                  }}
                                >
                                  Заказать услугу
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  fullWidth
                                  onClick={handleOpenContactDialog}
                                  sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                      borderColor: '#FF2800',
                                      color: 'white',
                                      backgroundColor: 'rgba(255, 40, 0, 0.1)'
                                    }
                                  }}
                                >
                                  Подробнее
                                </Button>
                              )}
                            </CardContent>
                          </VipServiceCard>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </motion.div>
            
            <GradientDivider />
            
            {/* Benefits Section */}
            <Box sx={{ mb: 8 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
                Преимущества VIP-статуса
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      bgcolor: 'rgba(25, 25, 25, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ color: '#FF2800', mr: 2 }} /> 
                      Персонализация
                    </Typography>
                    
                    <List sx={{ mb: 2 }}>
                      {[
                        "Персональный менеджер, доступный 24/7",
                        "Индивидуальный подход к вашим запросам",
                        "Персонализированные предложения и рекомендации",
                        "Особые условия обслуживания и приобретения автомобилей"
                      ].map((item, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: '36px' }}>
                            <StarIcon sx={{ color: '#FF2800', fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}>
                      Мы стремимся превзойти ваши ожидания, предлагая не только высочайший уровень обслуживания, 
                      но и персональный подход к каждому клиенту. Ваш персональный менеджер всегда 
                      готов выполнить любой запрос, связанный с вашим Ferrari.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      bgcolor: 'rgba(25, 25, 25, 0.7)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ color: '#FF2800', mr: 2 }} /> 
                      Приоритет
                    </Typography>
                    
                    <List sx={{ mb: 2 }}>
                      {[
                        "Приоритетная запись на сервисное обслуживание",
                        "Первоочередной доступ к новым моделям Ferrari",
                        "Приглашения на закрытые мероприятия и презентации",
                        "Расширенная гарантия и особые условия страхования"
                      ].map((item, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: '36px' }}>
                            <StarIcon sx={{ color: '#FF2800', fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}>
                      Статус VIP-клиента Ferrari даёт вам доступ к эксклюзивным привилегиям, 
                      включая возможность первыми знакомиться с новейшими моделями Ferrari 
                      и получать приоритетное обслуживание в любое удобное для вас время.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            
            {/* FAQ Section */}
            <Box sx={{ mb: 8 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
                Часто задаваемые вопросы
              </Typography>
              
              <Box>
                {faqData.map((item, index) => (
                  <StyledAccordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#FF2800' }} />}
                      aria-controls={`faq-panel-${index}-content`}
                      id={`faq-panel-${index}-header`}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {item.answer}
                      </Typography>
                    </AccordionDetails>
                  </StyledAccordion>
                ))}
              </Box>
            </Box>
            
            {/* Contact Section */}
            <Box sx={{ mb: 6 }}>
              <Paper
                sx={{
                  p: { xs: 4, md: 6 },
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(40,40,40,0.7)), url("/images/ferrari-contact-bg.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  fontWeight="bold"
                  sx={{ 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Заинтересованы в VIP-услугах?
                </Typography>
                
                <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
                  Наши VIP-консультанты готовы ответить на ваши вопросы и помочь с подбором 
                  оптимального пакета услуг, соответствующего вашим потребностям.
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleOpenContactDialog}
                  sx={{
                    backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      boxShadow: '0 8px 16px rgba(255, 40, 0, 0.3)'
                    }
                  }}
                >
                  Связаться с VIP-консультантом
                </Button>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ color: '#FF2800', mr: 1 }} />
                    <Typography variant="body2">
                      +7 (495) 123-45-67
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ color: '#FF2800', mr: 1 }} />
                    <Typography variant="body2">
                      vip@ferrari-moscow.ru
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LockIcon sx={{ color: '#FF2800', mr: 1 }} />
                    <Typography variant="body2">
                      Конфиденциальность гарантирована
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
            
            {/* VIP Levels */}
            <Box sx={{ mb: 8 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
                Уровни VIP-программы
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      bgcolor: 'rgba(25, 25, 25, 0.8)',
                      height: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: 'rgba(255, 40, 0, 0.7)',
                        py: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        Classico
                      </Typography>
                    </Box>
                    
                    <CardContent>
                      <Typography variant="body2" sx={{ textAlign: 'center', mb: 3 }}>
                        Базовый уровень VIP-привилегий для владельцев Ferrari
                      </Typography>
                      
                      <List>
                        {[
                          "Персональный менеджер",
                          "Приоритетная запись на сервис",
                          "Доступ в VIP-зону ожидания",
                          "Трансфер автомобиля к месту обслуживания",
                          "Специальные условия страхования"
                        ].map((item, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: '36px' }}>
                              <CheckCircleIcon sx={{ color: '#FF2800', fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      bgcolor: 'rgba(25, 25, 25, 0.8)',
                      height: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 40, 0, 0.3)',
                      boxShadow: '0 8px 24px rgba(255, 40, 0, 0.15)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(255, 40, 0, 0.2)'
                      },
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <Box 
                      sx={{ 
                        background: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                        py: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        Sportivo
                      </Typography>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        right: 20, 
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        border: '2px solid #FF2800',
                        borderRadius: '12px',
                        px: 2,
                        py: 0.5
                      }}
                    >
                      <Typography variant="caption" fontWeight="bold">
                        РЕКОМЕНДУЕМЫЙ
                      </Typography>
                    </Box>
                    
                    <CardContent>
                      <Typography variant="body2" sx={{ textAlign: 'center', mb: 3 }}>
                        Расширенные привилегии для активных клиентов
                      </Typography>
                      
                      <List>
                        {[
                          "Все преимущества уровня Classico",
                          "Автомобиль на замену на время сервиса",
                          "Доступ на закрытые мероприятия",
                          "Приоритетный доступ к новым моделям",
                          "VIP-трансфер на мероприятия",
                          "Программа лояльности с повышенными бонусами"
                        ].map((item, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: '36px' }}>
                              <CheckCircleIcon sx={{ color: '#FF2800', fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      bgcolor: 'rgba(25, 25, 25, 0.8)',
                      height: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(255, 215, 0, 0.2)'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        background: 'linear-gradient(45deg, #B8860B 30%, #FFD700 90%)',
                        py: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold" sx={{ color: 'black' }}>
                        Leggendario
                      </Typography>
                    </Box>
                    
                    <CardContent>
                      <Typography variant="body2" sx={{ textAlign: 'center', mb: 3 }}>
                        Эксклюзивный статус для самых преданных клиентов Ferrari
                      </Typography>
                      
                      <List>
                        {[
                          "Все преимущества уровня Sportivo",
                          "Индивидуальный тур на фабрику в Маранелло",
                          "Приоритетный доступ к лимитированным сериям",
                          "Персональный консьерж-сервис 24/7",
                          "Индивидуальные трек-дни с инструктором",
                          "Эксклюзивные предложения от партнеров",
                          "Индивидуальные условия обслуживания и покупки"
                        ].map((item, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: '36px' }}>
                              <CheckCircleIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleOpenContactDialog}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      borderColor: '#FF2800',
                      backgroundColor: 'rgba(255, 40, 0, 0.1)'
                    }
                  }}
                >
                  Подробнее о программе VIP-привилегий
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Container>
      
      {/* Contact Dialog */}
      <Dialog 
        open={openContactDialog} 
        onClose={handleCloseContactDialog}
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DiamondIcon sx={{ color: '#FF2800', mr: 2 }} />
            <Typography variant="h6">
              Запрос на VIP-обслуживание
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" paragraph>
            Пожалуйста, заполните форму, и наш VIP-консультант свяжется с вами в ближайшее время 
            для обсуждения всех интересующих вас вопросов о VIP-программе Ferrari.
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="Имя и фамилия"
                value={contactForm.name}
                onChange={handleInputChange}
                required
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
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="email"
                label="Email"
                type="email"
                value={contactForm.email}
                onChange={handleInputChange}
                required
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
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="phone"
                label="Телефон"
                value={contactForm.phone}
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
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="message"
                label="Сообщение"
                value={contactForm.message}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
                variant="outlined"
                placeholder="Укажите, какие VIP-услуги вас интересуют, и удобное время для связи"
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
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Предпочтительный способ связи:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={contactForm.preferredContact === 'phone' ? 'contained' : 'outlined'}
                  startIcon={<PhoneIcon />}
                  onClick={() => setContactForm({ ...contactForm, preferredContact: 'phone' })}
                  sx={{
                    color: contactForm.preferredContact === 'phone' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    bgcolor: contactForm.preferredContact === 'phone' ? '#FF2800' : 'transparent',
                    borderColor: contactForm.preferredContact === 'phone' ? '#FF2800' : 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      bgcolor: contactForm.preferredContact === 'phone' ? '#FF2800' : 'rgba(255, 40, 0, 0.1)',
                      borderColor: '#FF2800'
                    }
                  }}
                >
                  Телефон
                </Button>
              </Grid>
              
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={contactForm.preferredContact === 'email' ? 'contained' : 'outlined'}
                  startIcon={<EmailIcon />}
                  onClick={() => setContactForm({ ...contactForm, preferredContact: 'email' })}
                  sx={{
                    color: contactForm.preferredContact === 'email' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    bgcolor: contactForm.preferredContact === 'email' ? '#FF2800' : 'transparent',
                    borderColor: contactForm.preferredContact === 'email' ? '#FF2800' : 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      bgcolor: contactForm.preferredContact === 'email' ? '#FF2800' : 'rgba(255, 40, 0, 0.1)',
                      borderColor: '#FF2800'
                    }
                  }}
                >
                  Email
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {contactStatus && (
            <Alert 
              severity={contactStatus.success ? "success" : "error"} 
              sx={{ 
                mt: 3,
                backgroundColor: contactStatus.success ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)', 
                color: 'white',
                border: contactStatus.success ? '1px solid rgba(46, 125, 50, 0.3)' : '1px solid rgba(211, 47, 47, 0.3)'
              }}
            >
              {contactStatus.message}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', py: 2, px: 3 }}>
          <Button onClick={handleCloseContactDialog} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Отмена
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitContact}
            disabled={contactSubmitting}
            sx={{
              backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
              color: 'white'
            }}
          >
            {contactSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                Отправка...
              </>
            ) : (
              'Отправить запрос'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VipServices;