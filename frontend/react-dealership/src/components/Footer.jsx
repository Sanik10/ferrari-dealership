import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link as MuiLink, 
  IconButton, 
  Button, 
  TextField, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';

// Иконки
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Лого (вам нужно добавить это изображение)
import ferrariLogo from '/images/ferrari-logo-png-transparent.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && /\S+@\S+\.\S+/.test(email)) {
      // Здесь будет логика подписки на новости
      console.log('Подписка на новости:', email);
      setSubscribeSuccess(true);
      setEmail('');
    } else {
      setSubscribeError(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const contactInfo = [
    { 
      icon: <LocationOnIcon />, 
      primary: 'Адрес', 
      secondary: 'Москва, Кутузовский проспект, 1А' 
    },
    { 
      icon: <PhoneIcon />, 
      primary: 'Телефон', 
      secondary: '+7 (495) 123-45-67' 
    },
    { 
      icon: <EmailIcon />, 
      primary: 'Email', 
      secondary: 'info@ferrari-moscow.ru' 
    },
    { 
      icon: <AccessTimeIcon />, 
      primary: 'Часы работы', 
      secondary: 'Пн-Сб: 9:00 - 20:00, Вс: 10:00 - 18:00' 
    }
  ];

  const mainLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Тест-драйв', path: '/test-drive' },
    { name: 'Услуги', path: '/services' },
    { name: 'О нас', path: '/about' },
    { name: 'Контакты', path: '/contact' }
  ];

  const legalLinks = [
    { name: 'Политика конфиденциальности', path: '/privacy' },
    { name: 'Условия использования', path: '/terms' },
    { name: 'Гарантия', path: '/warranty' }
  ];

  return (
    <Box component="footer" sx={{ bgcolor: '#000000', color: 'white', pt: 8, position: 'relative' }}>
      {/* Кнопка "Наверх" */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -25, 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 10 
        }}
      >
        <Paper 
          elevation={5}
          sx={{ 
            bgcolor: '#FF2800', 
            borderRadius: '50%', 
            width: 50, 
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}
          onClick={scrollToTop}
        >
          <KeyboardArrowUpIcon sx={{ color: 'white', fontSize: 30 }} />
        </Paper>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Колонка с логотипом и информацией */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                component="img"
                src={ferrariLogo}
                alt="Ferrari Logo"
                sx={{ height: 60, mr: 2 }}
              />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#FF2800'
                }}
              >
                FERRARI MOSCOW
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.8 }}>
              Официальный дилер Ferrari в Москве. Мы предлагаем полный спектр услуг по продаже и обслуживанию автомобилей Ferrari. Наша миссия — дарить клиентам непревзойденный опыт владения автомобилем легендарной марки.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <IconButton 
                aria-label="Facebook" 
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 40, 0, 0.2)',
                    color: '#FF2800'
                  } 
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                aria-label="Instagram" 
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 40, 0, 0.2)',
                    color: '#FF2800'
                  } 
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                aria-label="YouTube" 
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 40, 0, 0.2)',
                    color: '#FF2800'
                  } 
                }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton 
                aria-label="Twitter" 
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 40, 0, 0.2)',
                    color: '#FF2800'
                  } 
                }}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Колонка с навигацией */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#FF2800',
                  bottom: -8,
                  left: 0
                }
              }}
            >
              НАВИГАЦИЯ
            </Typography>
            <List dense sx={{ mt: 3 }}>
              {mainLinks.map((link) => (
                <ListItem 
                  key={link.path} 
                  sx={{ 
                    py: 0.5, 
                    transition: 'transform 0.2s',
                    '&:hover': { 
                      transform: 'translateX(5px)',
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Link 
                        to={link.path} 
                        style={{ 
                          color: 'white', 
                          textDecoration: 'none',
                          '&:hover': { color: '#FF2800' }
                        }}
                      >
                        {link.name}
                      </Link>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Колонка с правовой информацией */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#FF2800',
                  bottom: -8,
                  left: 0
                }
              }}
            >
              ИНФОРМАЦИЯ
            </Typography>
            <List dense sx={{ mt: 3 }}>
              {legalLinks.map((link) => (
                <ListItem 
                  key={link.path} 
                  sx={{ 
                    py: 0.5,
                    transition: 'transform 0.2s',
                    '&:hover': { 
                      transform: 'translateX(5px)',
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Link 
                        to={link.path} 
                        style={{ 
                          color: 'white', 
                          textDecoration: 'none',
                          '&:hover': { color: '#FF2800' }
                        }}
                      >
                        {link.name}
                      </Link>
                    } 
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                ПОДПИСАТЬСЯ
              </Typography>
              <form onSubmit={handleSubscribe}>
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    size="small"
                    placeholder="Ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      }
                    }}
                  />
                  <Button 
                    type="submit"
                    variant="contained"
                    sx={{ 
                      ml: 1, 
                      minWidth: 'auto',
                      bgcolor: '#FF2800',
                      '&:hover': { bgcolor: '#CC2000' }
                    }}
                  >
                    <ArrowForwardIcon />
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>
          
          {/* Колонка с контактной информацией */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#FF2800',
                  bottom: -8,
                  left: 0
                }
              }}
            >
              КОНТАКТЫ
            </Typography>
            <List sx={{ mt: 3 }}>
              {contactInfo.map((item, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: '#FF2800' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {item.primary}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {item.secondary}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Box sx={{ 
          py: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} Ferrari Moscow. Все права защищены.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Ferrari и логотип Ferrari являются зарегистрированными товарными знаками Ferrari S.p.A.
          </Typography>
        </Box>
      </Container>
      
      {/* Уведомления */}
      <Snackbar 
        open={subscribeSuccess} 
        autoHideDuration={6000} 
        onClose={() => setSubscribeSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSubscribeSuccess(false)}>
          Вы успешно подписались на новости Ferrari Moscow!
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={subscribeError} 
        autoHideDuration={6000} 
        onClose={() => setSubscribeError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setSubscribeError(false)}>
          Пожалуйста, введите корректный email.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer;
