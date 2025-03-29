import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  useMediaQuery,
  Skeleton,
  Snackbar,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PaidIcon from '@mui/icons-material/Paid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EastIcon from '@mui/icons-material/East';
import FilterListIcon from '@mui/icons-material/FilterList';

// API
import { eventAPI } from '../services/api';

// Custom styled components
const StyledEventCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(30, 30, 30, 0.8)',
  backdropFilter: 'blur(10px)',
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

const StyledEventBanner = styled(Paper)(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.01)'
  }
}));

const StyledChip = styled(Chip)(({ isPast, theme }) => ({
  backgroundColor: isPast ? 'rgba(100, 100, 100, 0.8)' : 'rgba(255, 40, 0, 0.8)',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '4px',
  backdropFilter: 'blur(5px)'
}));

// Event types with icons
const eventTypes = [
  { type: 'all', label: 'Все мероприятия', icon: <EventAvailableIcon /> },
  { type: 'presentation', label: 'Презентации', icon: <DirectionsCarIcon /> },
  { type: 'race', label: 'Гонки', icon: <SportsScoreIcon /> },
  { type: 'testdrive', label: 'Тест-драйвы', icon: <DriveEtaIcon /> },
  { type: 'social', label: 'Светские события', icon: <LocalBarIcon /> },
  { type: 'exclusive', label: 'VIP мероприятия', icon: <EmojiEventsIcon /> }
];

const Events = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // State variables
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  
  // Form data for registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comments: '',
    carOwner: false,
    carModel: '',
    agreedToTerms: false
  });
  
  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventAPI.getEvents();
        
        if (response.data) {
          // Get current date for separating future and past events
          const now = new Date();
          
          // Filter events by date
          const futureEvents = response.data.filter(event => new Date(event.date) >= now);
          const past = response.data.filter(event => new Date(event.date) < now);
          
          // Get featured events (either marked as featured or take first 2)
          const featured = futureEvents.filter(event => event.featured) || futureEvents.slice(0, 2);
          
          setEvents(futureEvents);
          setFeaturedEvents(featured);
          setPastEvents(past);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Не удалось загрузить мероприятия. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Filter events based on selected type and search query
  const filteredEvents = events.filter(event => {
    // First filter by type
    const typeMatches = selectedType === 'all' || event.type === selectedType;
    
    // Then by search query
    const searchMatches = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatches && searchMatches;
  });
  
  // Handle tab change
  const handleTypeChange = (event, newValue) => {
    setSelectedType(newValue);
  };
  
  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle dialog open for event registration
  const handleOpenRegistration = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      comments: '',
      carOwner: false,
      carModel: '',
      agreedToTerms: false
    });
    setRegistrationStatus(null);
  };
  
  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle registration submission
  const handleSubmitRegistration = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      setRegistrationStatus({
        success: false,
        message: 'Пожалуйста, заполните все обязательные поля.'
      });
      return;
    }
    
    if (!formData.agreedToTerms) {
      setRegistrationStatus({
        success: false,
        message: 'Необходимо согласиться с условиями участия.'
      });
      return;
    }
    
    try {
      setRegistrationLoading(true);
      
      // Submit registration
    //   const response = await eventAPI.registerForEvent(selectedEvent.id, formData);
      
      // Set success status
      setRegistrationStatus({
        success: true,
        message: 'Регистрация успешно завершена! Мы отправили подтверждение на ваш email.'
      });
      
      // After successful registration, close dialog after a delay
      setTimeout(() => {
        handleCloseDialog();
        setNotificationOpen(true);
      }, 2000);
      
    } catch (error) {
      console.error('Error registering for event:', error);
      setRegistrationStatus({
        success: false,
        message: 'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.'
      });
    } finally {
      setRegistrationLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Get icon based on event type
  const getEventTypeIcon = (type) => {
    const eventType = eventTypes.find(et => et.type === type);
    return eventType ? eventType.icon : <EventAvailableIcon />;
  };
  
  // Get label based on event type
  const getEventTypeLabel = (type) => {
    const eventType = eventTypes.find(et => et.type === type);
    return eventType ? eventType.label : 'Мероприятие';
  };
  
  // Check if event is in the past
  const isEventPast = (dateString) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate < now;
  };
  
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url("/images/ferrari-events-bg.jpg")',
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
            МЕРОПРИЯТИЯ
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
            Эксклюзивные мероприятия и события для владельцев и поклонников Ferrari.
            Станьте частью легендарного сообщества.
          </Typography>
        </Box>
        
        {/* Featured Events Banner */}
        {!loading && featuredEvents.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3}>
              {featuredEvents.map((event, index) => (
                <Grid item xs={12} md={index === 0 ? 8 : 4} key={event.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <StyledEventBanner
                      sx={{
                        height: { xs: 240, md: index === 0 ? 400 : 400 },
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%), url(${event.imageUrl})`
                      }}
                    >
                      <Box sx={{ p: 3, position: 'absolute', bottom: 0, width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <StyledChip 
                            label={getEventTypeLabel(event.type)}
                            size="small"
                            icon={getEventTypeIcon(event.type)}
                            isPast={isEventPast(event.date)}
                          />
                          <Typography variant="caption" sx={{ ml: 1, color: 'rgba(255,255,255,0.7)' }}>
                            {formatDate(event.date)}
                          </Typography>
                        </Box>
                        
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          {event.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: '#FF2800' }} />
                          <Typography variant="body2" sx={{ mr: 2 }}>
                            {event.location}
                          </Typography>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#FF2800' }} />
                          <Typography variant="body2">
                            {event.time}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="contained"
                          onClick={() => handleOpenRegistration(event)}
                          sx={{
                            mt: 1,
                            backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                            color: 'white',
                            '&:hover': {
                              backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                              boxShadow: '0 8px 16px rgba(255, 40, 0, 0.3)'
                            }
                          }}
                        >
                          Регистрация
                        </Button>
                      </Box>
                    </StyledEventBanner>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Search and Filter */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Поиск мероприятий..."
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterListIcon sx={{ mr: 2, color: '#FF2800' }} />
                <Tabs
                  value={selectedType}
                  onChange={handleTypeChange}
                  variant={isSmallScreen ? "scrollable" : "standard"}
                  scrollButtons="auto"
                  sx={{
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
                  {eventTypes.map((type) => (
                    <Tab 
                      key={type.type} 
                      value={type.type} 
                      label={isSmallScreen ? '' : type.label} 
                      icon={type.icon}
                      iconPosition={isSmallScreen ? "top" : "start"}
                      sx={{ minWidth: isSmallScreen ? 'auto' : '120px' }}
                    />
                  ))}
                </Tabs>
              </Box>
            </Grid>
          </Grid>
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
        
        {/* Loading state */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card sx={{ bgcolor: 'rgba(30, 30, 30, 0.8)', height: '100%' }}>
                  <Skeleton variant="rectangular" height={180} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                  <CardContent>
                    <Skeleton width="60%" height={30} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                    <Skeleton width="40%" height={20} sx={{ mt: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                    <Skeleton width="100%" height={60} sx={{ mt: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Skeleton width={120} height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {/* Upcoming Events */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CalendarMonthIcon sx={{ mr: 1, color: '#FF2800' }} />
              Предстоящие мероприятия
            </Typography>
            
            {filteredEvents.length === 0 ? (
              <Paper 
                sx={{ 
                  p: 3, 
                  mb: 6, 
                  bgcolor: 'rgba(30, 30, 30, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {searchQuery || selectedType !== 'all' ? 
                    'По заданным параметрам мероприятий не найдено' : 
                    'В настоящее время нет предстоящих мероприятий'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {searchQuery || selectedType !== 'all' ? 
                    'Попробуйте изменить параметры поиска или фильтрации' : 
                    'Следите за обновлениями, новые мероприятия будут объявлены в ближайшее время'}
                </Typography>
              </Paper>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={3}>
                  {filteredEvents.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      <motion.div variants={itemVariants}>
                        <StyledEventCard>
                          <CardMedia
                            component="img"
                            height="200"
                            image={event.imageUrl || '/images/default-event.jpg'}
                            alt={event.title}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <StyledChip 
                                label={getEventTypeLabel(event.type)}
                                size="small"
                                variant="outlined"
                                isPast={isEventPast(event.date)}
                              />
                            </Box>
                            
                            <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
                              {event.title}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5, color: '#FF2800' }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {formatDate(event.date)}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: '#FF2800' }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {event.location}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#FF2800' }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mr: 2 }}>
                                {event.time}
                              </Typography>
                              {event.capacity && (
                                <>
                                  <GroupIcon sx={{ fontSize: 16, mr: 0.5, color: '#FF2800' }} />
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {event.participants}/{event.capacity}
                                  </Typography>
                                </>
                              )}
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {event.description}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ p: 2 }}>
                            <Button 
                              variant="contained" 
                              onClick={() => handleOpenRegistration(event)}
                              fullWidth
                              sx={{
                                backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                                color: 'white'
                              }}
                            >
                              Регистрация
                            </Button>
                          </CardActions>
                        </StyledEventCard>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
            
            {/* Past Events */}
            {pastEvents.length > 0 && (
              <Box sx={{ mt: 8 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <EmojiEventsIcon sx={{ mr: 1, color: '#FF2800' }} />
                  Прошедшие мероприятия
                </Typography>
                
                <Grid container spacing={3}>
                  {pastEvents.slice(0, 3).map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      <Card 
                        sx={{ 
                          bgcolor: 'rgba(30, 30, 30, 0.8)', 
                          height: '100%',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="160"
                          image={event.imageUrl || '/images/default-event.jpg'}
                          alt={event.title}
                          sx={{ filter: 'grayscale(0.5)' }}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                            {event.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5, color: 'rgba(255,255,255,0.5)' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              {formatDate(event.date)}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {event.shortDescription || event.description.substring(0, 100) + '...'}
                          </Typography>
                        </CardContent>
                        {event.galleryUrl && (
                          <CardActions>
                            <Button 
                              size="small" 
                              onClick={() => window.open(event.galleryUrl, '_blank')}
                              sx={{ color: '#FF2800' }}
                              endIcon={<EastIcon />}
                            >
                              Смотреть фотоотчет
                            </Button>
                          </CardActions>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {pastEvents.length > 3 && (
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => navigate('/events/archive')}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: '#FF2800',
                          backgroundColor: 'rgba(255, 40, 0, 0.1)'
                        }
                      }}
                    >
                      Смотреть все прошедшие мероприятия
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
        
        {/* About Our Events Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
            Наши мероприятия
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{ 
                  p: 4, 
                  bgcolor: 'rgba(30, 30, 30, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DirectionsCarIcon sx={{ color: '#FF2800', fontSize: 30, mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Презентации и премьеры
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Эксклюзивные презентации новых моделей Ferrari. Будьте первыми, кто увидит и оценит революционный дизайн и инновационные технические решения.
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Наши презентации — это не просто демонстрация автомобилей, а настоящее шоу с участием специальных гостей, прямыми включениями с Маранелло и персональным знакомством с каждой деталью новой модели.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper
                sx={{ 
                  p: 4, 
                  bgcolor: 'rgba(30, 30, 30, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SportsScoreIcon sx={{ color: '#FF2800', fontSize: 30, mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Гоночные события
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Специальные мероприятия для поклонников гоночного наследия Ferrari. Посещение гонок, встречи с пилотами команды, трансляции этапов Formula 1 в атмосфере единомышленников.
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Для владельцев Ferrari мы организуем трек-дни на лучших гоночных трассах России, где можно испытать свой автомобиль в безопасных условиях под руководством профессиональных инструкторов.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper
                sx={{ 
                  p: 4, 
                  bgcolor: 'rgba(30, 30, 30, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalBarIcon sx={{ color: '#FF2800', fontSize: 30, mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Светские события
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Эксклюзивные вечера для клиентов и партнеров Ferrari Moscow в лучших ресторанах и локациях города. Гастрономические ужины от звездных шеф-поваров, винные дегустации и светские рауты.
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Наши мероприятия создают уникальную возможность для общения в кругу Ferrari Family — людей, объединенных страстью к скорости, роскоши и стилю жизни.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper
                sx={{ 
                  p: 4, 
                  bgcolor: 'rgba(30, 30, 30, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmojiEventsIcon sx={{ color: '#FF2800', fontSize: 30, mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold">
                    VIP мероприятия
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Закрытые мероприятия для владельцев Ferrari и членов клуба Ferrari. Приватные презентации, эксклюзивные тест-драйвы новых моделей и специальные поездки на фабрику в Маранелло.
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  VIP-клиенты Ferrari Moscow получают приоритетный доступ к лимитированным сериям автомобилей и персональные приглашения на мировые премьеры новых моделей.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        {/* Join Ferrari Family CTA */}
        <Box sx={{ mt: 8 }}>
          <Paper
            sx={{ 
              p: { xs: 4, md: 6 }, 
              backgroundImage: 'linear-gradient(to right, rgba(255,40,0,0.7), rgba(150,20,0,0.9)), url("/images/ferrari-family-bg.jpg")',
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
              Станьте частью Ferrari Family
            </Typography>
            
            <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
              Эксклюзивное сообщество для тех, кто ценит скорость, роскошь и итальянский стиль
            </Typography>
            
            <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    p: 3,
                    borderRadius: '12px',
                    height: '100%'
                  }}
                >
                  <SportsScoreIcon sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Приоритетный доступ
                  </Typography>
                  <Typography variant="body2">
                    К мероприятиям и новым моделям Ferrari
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    p: 3,
                    borderRadius: '12px',
                    height: '100%'
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Сообщество
                  </Typography>
                  <Typography variant="body2">
                    Общение с единомышленниками и владельцами Ferrari
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    p: 3,
                    borderRadius: '12px',
                    height: '100%'
                  }}
                >
                  <DriveEtaIcon sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Трек-дни
                  </Typography>
                  <Typography variant="body2">
                    Возможность испытать свой автомобиль на лучших трассах
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    p: 3,
                    borderRadius: '12px',
                    height: '100%'
                  }}
                >
                  <PaidIcon sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Привилегии
                  </Typography>
                  <Typography variant="body2">
                    Специальные условия обслуживания и приобретения Ferrari
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
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
                  bgcolor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }
              }}
              onClick={() => navigate('/ferrari-club')}
            >
              Узнать больше
            </Button>
          </Paper>
        </Box>
      </Container>
      
      {/* Registration Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
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
          {selectedEvent && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getEventTypeIcon(selectedEvent.type)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                Регистрация на мероприятие: {selectedEvent.title}
              </Typography>
            </Box>
          )}
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          {selectedEvent && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                    Дата и время:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(selectedEvent.date)}, {selectedEvent.time}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                    Место проведения:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedEvent.location}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                    Описание:
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.description}
                  </Typography>
                </Box>
                
                {selectedEvent.additionalInfo && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                      Дополнительная информация:
                    </Typography>
                    <Typography variant="body2">
                      {selectedEvent.additionalInfo}
                    </Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Персональные данные
                </Typography>
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="name"
                  label="Имя и фамилия"
                  value={formData.name}
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
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
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
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="phone"
                  label="Телефон"
                  value={formData.phone}
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
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.carOwner}
                      onChange={handleInputChange}
                      name="carOwner"
                      sx={{
                        color: 'rgba(255,255,255,0.5)',
                        '&.Mui-checked': {
                          color: '#FF2800',
                        },
                      }}
                    />
                  }
                  label="Я владелец Ferrari"
                  sx={{ mt: 2 }}
                />
                
                {formData.carOwner && (
                  <TextField
                    fullWidth
                    margin="normal"
                    name="carModel"
                    label="Модель Ferrari"
                    value={formData.carModel}
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
                )}
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="comments"
                  label="Комментарии или вопросы"
                  value={formData.comments}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
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
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreedToTerms}
                      onChange={handleInputChange}
                      name="agreedToTerms"
                      required
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
                      Я согласен с <a href="#" style={{ color: '#FF2800', textDecoration: 'none' }}>условиями участия</a> и <a href="#" style={{ color: '#FF2800', textDecoration: 'none' }}>политикой конфиденциальности</a>
                    </Typography>
                  }
                  sx={{ mt: 2 }}
                />
                
                {registrationStatus && (
                  <Alert 
                    severity={registrationStatus.success ? "success" : "error"} 
                    sx={{ 
                      mt: 2,
                      backgroundColor: registrationStatus.success ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)', 
                      color: 'white',
                      border: registrationStatus.success ? '1px solid rgba(46, 125, 50, 0.3)' : '1px solid rgba(211, 47, 47, 0.3)'
                    }}
                  >
                    {registrationStatus.message}
                  </Alert>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', py: 2, px: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Отмена
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitRegistration}
            disabled={registrationLoading}
            sx={{
              backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
              color: 'white'
            }}
          >
            {registrationLoading ? (
              <>
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                Регистрация...
              </>
            ) : (
              'Подтвердить регистрацию'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Notification */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={() => setNotificationOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotificationOpen(false)} 
          severity="success"
          icon={<CheckCircleOutlineIcon />}
          sx={{ 
            width: '100%',
            backgroundColor: 'rgba(46, 125, 50, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          Вы успешно зарегистрированы на мероприятие!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Events;