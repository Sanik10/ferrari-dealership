import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HistoryIcon from '@mui/icons-material/History';
import SpeedIcon from '@mui/icons-material/Speed';

// Styled Components
const StyledPaper = styled(Paper)({
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
});

const ValueCard = styled(Card)({
  backgroundColor: 'rgba(25, 25, 25, 0.8)',
  color: 'white',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  height: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
});

const StyledListItemIcon = styled(ListItemIcon)({
  color: '#FF2800',
  minWidth: '36px'
});

// Main component
const About = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                mb: 1,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              О нашем дилерском центре
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 6, 
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              Официальный дилер Ferrari в России с безупречной репутацией и высочайшим уровнем сервиса
            </Typography>
          </motion.div>
          
          {/* Main Content */}
          <motion.div variants={itemVariants}>
            <StyledPaper elevation={0} sx={{ p: 4, mb: 6 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom sx={{ color: '#FF2800' }}>
                    Наследие и опыт
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    Наш дилерский центр Ferrari — это не просто магазин роскошных автомобилей, 
                    это место, где легендарное наследие итальянского бренда встречается с 
                    безупречным сервисом и индивидуальным подходом к каждому клиенту.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    С момента открытия в 2005 году мы стремимся не просто продавать автомобили, 
                    но и передавать нашим клиентам истинный дух и философию Ferrari — 
                    стремление к совершенству, инновациям и выдающимся характеристикам.
                  </Typography>
                  
                  <List>
                    <ListItem disableGutters>
                      <StyledListItemIcon>
                        <CheckCircleIcon />
                      </StyledListItemIcon>
                      <ListItemText primary="Более 15 лет безупречной репутации" />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <StyledListItemIcon>
                        <CheckCircleIcon />
                      </StyledListItemIcon>
                      <ListItemText primary="Высококвалифицированные специалисты" />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <StyledListItemIcon>
                        <CheckCircleIcon />
                      </StyledListItemIcon>
                      <ListItemText primary="Сертифицированный сервисный центр" />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <StyledListItemIcon>
                        <CheckCircleIcon />
                      </StyledListItemIcon>
                      <ListItemText primary="Эксклюзивные модели только у нас" />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src="/images/ferrari-dealership.jpg"
                    alt="Ferrari Dealership"
                    sx={{
                      width: '100%',
                      height: '100%',
                      maxHeight: 400,
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          </motion.div>
          
          {/* Values Section */}
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              Наши ценности
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6} md={4}>
                <ValueCard>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <SpeedIcon sx={{ fontSize: 60, color: '#FF2800' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" align="center" gutterBottom>
                      Превосходство
                    </Typography>
                    <Typography variant="body2" align="center">
                      Мы стремимся к совершенству во всем: от продажи автомобилей 
                      до обслуживания клиентов.
                    </Typography>
                  </CardContent>
                </ValueCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <ValueCard>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <HandshakeIcon sx={{ fontSize: 60, color: '#FF2800' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" align="center" gutterBottom>
                      Доверие
                    </Typography>
                    <Typography variant="body2" align="center">
                      Прозрачность и честность в отношениях с клиентами — 
                      фундамент нашей работы.
                    </Typography>
                  </CardContent>
                </ValueCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <ValueCard>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <GroupsIcon sx={{ fontSize: 60, color: '#FF2800' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" align="center" gutterBottom>
                      Сообщество
                    </Typography>
                    <Typography variant="body2" align="center">
                      Мы создаем и поддерживаем сообщество энтузиастов и 
                      владельцев Ferrari.
                    </Typography>
                  </CardContent>
                </ValueCard>
              </Grid>
            </Grid>
          </motion.div>
          
          {/* CTA Section */}
          <motion.div variants={itemVariants}>
            <StyledPaper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Станьте частью легенды Ferrari
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
                Приглашаем вас посетить наш дилерский центр, чтобы лично познакомиться 
                с непревзойденными автомобилями Ferrari и узнать больше о 
                преимуществах работы с нами.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(255, 40, 0, 0.3)'
                    }
                  }}
                >
                  Записаться на консультацию
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#FF2800',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#FF2800',
                      backgroundColor: 'rgba(255, 40, 0, 0.1)'
                    }
                  }}
                >
                  Связаться с нами
                </Button>
              </Box>
            </StyledPaper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;
