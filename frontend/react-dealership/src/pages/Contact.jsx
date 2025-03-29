import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Divider,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

// API
import { contactAPI } from '../services/api';

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

const InfoCard = styled(Card)({
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

const StyledTextField = styled(TextField)({
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
    '& .MuiInputBase-input': {
      color: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#FF2800',
  },
});

// Main component
const Contact = () => {
  // State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.message) {
      setSnackbarMessage('Пожалуйста, заполните все обязательные поля');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    
    try {
      // API call to submit contact form
      await contactAPI.createContact(formData);
      
      // Success feedback
      setSnackbarMessage('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSnackbarMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
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
              Связаться с нами
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 6, 
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              Мы готовы ответить на все ваши вопросы и помочь выбрать идеальный Ferrari
            </Typography>
          </motion.div>
          
          {/* Contact Information Cards */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <IconButton sx={{ color: '#FF2800', mb: 1 }}>
                      <LocationOnIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>Адрес</Typography>
                    <Typography variant="body2">
                      г. Москва, Рублёво-Успенское шоссе, 8-й километр, 114, стр. 5, д. Барвиха
                    </Typography>
                  </CardContent>
                </InfoCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <IconButton sx={{ color: '#FF2800', mb: 1 }}>
                      <PhoneIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>Телефон</Typography>
                    <Typography variant="body2">
                      +7 (495) 933-33-77
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      +7 (495) 933-33-78
                    </Typography>
                  </CardContent>
                </InfoCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <IconButton sx={{ color: '#FF2800', mb: 1 }}>
                      <EmailIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>Email</Typography>
                    <Typography variant="body2">
                      info@ferrari-moscow.ru
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      sales@ferrari-moscow.ru
                    </Typography>
                  </CardContent>
                </InfoCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <IconButton sx={{ color: '#FF2800', mb: 1 }}>
                      <AccessTimeIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>Часы работы</Typography>
                    <Typography variant="body2">
                      Пн-Пт: 10:00 - 20:00
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Сб-Вс: 11:00 - 18:00
                    </Typography>
                  </CardContent>
                </InfoCard>
              </Grid>
            </Grid>
          </motion.div>
          
          {/* Contact Form and Map */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={4}>
              {/* Form */}
              <Grid item xs={12} md={6}>
                <StyledPaper elevation={0} sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ color: '#FF2800' }}>
                    Отправить сообщение
                  </Typography>
                  
                  <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
                          label="Ваше имя *"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
                          label="Телефон *"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <StyledTextField
                          label="Email *"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <StyledTextField
                          label="Тема"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <StyledTextField
                          label="Сообщение *"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          multiline
                          rows={4}
                          fullWidth
                          required
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          startIcon={<SendIcon />}
                          sx={{
                            mt: 2,
                            px: 4,
                            py: 1.5,
                            backgroundImage: 'linear-gradient(45deg, #FF2800 30%, #FF4D4D 90%)',
                            color: 'white',
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(255, 40, 0, 0.3)'
                            }
                          }}
                        >
                          {loading ? 'Отправка...' : 'Отправить'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </StyledPaper>
              </Grid>
              
              {/* Map */}
              <Grid item xs={12} md={6}>
                <StyledPaper elevation={0} sx={{ p: 0, overflow: 'hidden', height: '100%', minHeight: 450 }}>
                  <Box
                    component="iframe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2240.7979878146404!2d37.276259076938665!3d55.75289997258063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54aee4f6c7069%3A0x86f11cc7bfc39c46!2z0KDRg9Cx0LvRkdCy0L4t0KPRgdC_0LXQvdGB0LrQvtC1INGILiwg0JzQvtGB0LrQstCw!5e0!3m2!1sru!2sru!4v1682509726851!5m2!1sru!2sru"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </StyledPaper>
              </Grid>
            </Grid>
          </motion.div>
        </motion.div>
      </Container>
      
      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            backgroundColor: snackbarSeverity === 'success' 
              ? 'rgba(76, 175, 80, 0.9)' 
              : 'rgba(211, 47, 47, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;