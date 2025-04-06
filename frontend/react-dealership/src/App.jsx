import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Contact from './pages/Contact';
import About from './pages/About';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import TestDrive from './pages/TestDrive';
import OrderProcess from './pages/OrderProcess';
import ServiceAppointment from './pages/ServiceAppointment';
import Events from './pages/Events';
import VipServices from './pages/VipServices';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminCars from './pages/admin/AdminCars';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminTestDrives from './pages/admin/AdminTestDrives';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import './styles/App.css';

// Добавляем отладочную информацию для маршрутов
console.log("App.jsx загружен - настройка маршрутов");

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF2800', // Ferrari Red
      light: '#FF4D4D',
      dark: '#CC2000',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    h1: {
      fontFamily: "'Racing Sans One', sans-serif",
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
    h2: {
      fontFamily: "'Racing Sans One', sans-serif", 
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
    h3: {
      fontFamily: "'Racing Sans One', sans-serif",
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
    h4: {
      fontWeight: 300,
    },
    h5: {
      fontWeight: 300,
    },
    h6: {
      fontWeight: 300,
    },
    body1: {
      fontWeight: 300,
    },
    body2: {
      fontWeight: 300,
    },
    button: {
      letterSpacing: '0.1em',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'uppercase',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
        contained: {
          backgroundImage: 'linear-gradient(45deg, #FF2800, #FF4D4D)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку
    console.log("App.jsx - Проверка маршрутов и авторизации");
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#000000',
        }}
      >
        <img 
          src="/images/ferrari-logo-animated.gif" 
          alt="Ferrari Loading" 
          style={{ width: '150px' }}
        />
      </Box>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/car/:id" element={<CarDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/test-drive" element={<TestDrive />} />
                  
                  {/* Защищенные маршруты для авторизованных пользователей */}
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/order/:id" element={<ProtectedRoute><OrderProcess /></ProtectedRoute>} />
                  <Route path="/service" element={<ProtectedRoute><ServiceAppointment /></ProtectedRoute>} />
                  <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />

                  {/* VIP маршруты */}
                  <Route path="/vip" element={<ProtectedRoute vipOnly><VipServices /></ProtectedRoute>} />

                  {/* Админ маршруты */}
                  <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="/admin/cars" element={<AdminCars />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/events" element={<AdminEvents />} />
                    <Route path="/admin/test-drives" element={<AdminTestDrives />} />
                  </Route>

                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;