import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  DirectionsCar as CarsIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Event as EventsIcon,
  TimeToLeave as TestDrivesIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Стилизованная навигационная кнопка
const NavButton = styled(Button)(({ theme, active }) => ({
  color: 'white',
  margin: theme.spacing(0, 0.5),
  textTransform: 'none',
  fontWeight: active ? 'bold' : 'normal',
  borderBottom: active ? '2px solid #FF2800' : '2px solid transparent',
  borderRadius: 0,
  '&:hover': {
    backgroundColor: 'rgba(255, 40, 0, 0.08)',
    borderBottom: '2px solid #FF2800',
  },
}));

const AdminNavbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/admin', label: 'Обзор', icon: <DashboardIcon /> },
    { path: '/admin/cars', label: 'Автомобили', icon: <CarsIcon /> },
    { path: '/admin/orders', label: 'Заказы', icon: <OrdersIcon /> },
    { path: '/admin/users', label: 'Пользователи', icon: <UsersIcon /> },
    { path: '/admin/events', label: 'События', icon: <EventsIcon /> },
    { path: '/admin/test-drives', label: 'Тест-драйвы', icon: <TestDrivesIcon /> },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{
        width: 250,
        bgcolor: '#121212',
        height: '100%',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          bgcolor: 'rgba(255,40,0,0.1)',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Админ-панель
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          Ferrari Moscow
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.path}
            sx={{
              bgcolor: isActive(item.path) ? 'rgba(255,40,0,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,40,0,0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#FF2800' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                sx: { color: 'white' },
              }}
            />
          </ListItem>
        ))}
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <ListItem button component={Link} to="/">
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="На главную"
            primaryTypographyProps={{
              sx: { color: 'rgba(255,255,255,0.7)' },
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #121212 0%, #1A1A1A 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={Link}
          to="/admin"
          sx={{
            flexGrow: isMobile ? 1 : 0,
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/images/ferrari-logo.png"
            alt="Ferrari Logo"
            sx={{
              height: 36,
              mr: 1,
              display: { xs: 'none', sm: 'block' },
            }}
          />
          Админ-панель
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {navItems.map((item) => (
              <NavButton
                key={item.path}
                active={isActive(item.path)}
                component={Link}
                to={item.path}
                startIcon={item.icon}
              >
                {item.label}
              </NavButton>
            ))}
          </Box>
        )}

        <Button
          component={Link}
          to="/"
          color="inherit"
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            border: '1px solid rgba(255,255,255,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.5)',
            },
            ml: 2,
            display: { xs: 'none', sm: 'flex' },
          }}
          startIcon={<HomeIcon />}
        >
          На сайт
        </Button>
      </Toolbar>

      {/* Мобильное меню */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            bgcolor: '#121212',
            backgroundImage: 'linear-gradient(rgba(255,40,0,0.02), rgba(0,0,0,0.1))',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default AdminNavbar; 