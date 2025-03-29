import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Icons
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url("/images/ferrari-logo-png-transparent.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        pt: 8,
        pb: 8
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              backgroundColor: 'rgba(25, 25, 25, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              textAlign: 'center'
            }}
          >
            <Box
              component="img"
              src="/images/ferrari-logo.png"
              alt="Ferrari Logo"
              sx={{
                width: '120px',
                height: 'auto',
                mb: 4
              }}
            />

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '4rem', md: '6rem' },
                  fontWeight: 700,
                  color: '#FF2800'
                }}
              >
                404
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <ErrorOutlineIcon sx={{ color: '#FF2800', fontSize: 30, mr: 2 }} />
              <Typography 
                variant="h4" 
                component="div"
                sx={{ 
                  fontWeight: 600
                }}
              >
                Страница не найдена
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Похоже, Вы пытались обогнать GPS-навигацию и свернули не туда.
            </Typography>

            <Typography variant="body1" sx={{ mb: 6, maxWidth: '600px', mx: 'auto', color: 'rgba(255, 255, 255, 0.7)' }}>
              Запрашиваемая Вами страница не существует или была перемещена.
              Пожалуйста, вернитесь на главную страницу или воспользуйтесь одной из ссылок ниже.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
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
                На главную
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<DirectionsCarIcon />}
                onClick={() => navigate('/models')}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#FF2800',
                    backgroundColor: 'rgba(255, 40, 0, 0.1)'
                  }
                }}
              >
                Модельный ряд
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#FF2800',
                    backgroundColor: 'rgba(255, 40, 0, 0.1)'
                  }
                }}
              >
                Назад
              </Button>
            </Box>
          </Paper>

          <Box sx={{ textAlign: 'center', mt: 4, color: 'rgba(255, 255, 255, 0.6)' }}>
            <Typography variant="body2">
              Ferrari Moscow | Официальный дилер Ferrari в России
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Если Вам нужна помощь, свяжитесь с нами по телефону: +7 (495) 123-45-67
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFound;