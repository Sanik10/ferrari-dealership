import { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Avatar, 
  Menu, MenuItem, IconButton, Drawer, List, ListItem, 
  ListItemText, useMediaQuery, useTheme, ListItemIcon, Divider 
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AuthDialog from './AuthDialog';
import ferrariLogo from '/images/ferrari-logo-png-transparent.png';
import { useAuth } from '../contexts/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { isAuthenticated, currentUser, logout } = useAuth();

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout(() => navigate('/'));
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: 'Каталог', path: '/catalog' },
    { label: 'Тест-драйв', path: '/test-drive' },
    { label: 'Услуги', path: '/services' },
    { label: 'О нас', path: '/about' },
    { label: 'Контакты', path: '/contact' }
  ];

  const renderMobileDrawer = (
    <Drawer
      anchor="right"
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      sx={{
        '& .MuiDrawer-paper': { 
          width: '70%', 
          background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
          color: 'white'
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.path}
            sx={{ 
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              py: 2 
            }}
          >
            <ListItemText 
              primary={item.label} 
              sx={{ 
                color: location.pathname === item.path ? 'primary.main' : 'white',
                textAlign: 'center' 
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  // User menu (if authenticated)
  const userMenu = (
    <>
      <IconButton
        edge="end"
        color="inherit"
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
        sx={{ mr: isMobile ? 0 : 2 }}
      >
        <Avatar
          alt={currentUser?.name || "User"}
          src={currentUser?.avatar}
          sx={{
            width: 35,
            height: 35,
            bgcolor: currentUser?.avatar ? 'transparent' : '#FF2800',
          }}
        >
          {!currentUser?.avatar && (currentUser?.name?.charAt(0) || 'U')}
        </Avatar>
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            backgroundColor: 'rgba(25, 25, 25, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 40, 0, 0.1)',
              },
            },
          },
        }}
        MenuListProps={{
          sx: { py: 0.5 },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate('/profile');
        }}>
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          Мой профиль
        </MenuItem>
        
        {currentUser?.role === 'admin' && (
          <MenuItem onClick={() => {
            handleMenuClose();
            console.log("Нажата кнопка Админ-панель");
            console.log("Роль пользователя:", currentUser?.role);
            console.log("Перенаправление на /admin");
            navigate('/admin');
          }}>
            <ListItemIcon>
              <DashboardIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            Админ-панель
          </MenuItem>
        )}
        
        <Divider sx={{ my: 0.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{
          background: 'linear-gradient(to right, #000000, #1a1a1a)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 40, 0, 0.1)'
        }}
      >
        <Toolbar>
          <Box 
            component={Link} 
            to="/"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img 
              src={ferrariLogo} 
              alt="Ferrari Logo" 
              style={{ height: 40, marginRight: 10 }} 
            />
            <Typography
              variant="h6"
              sx={{
                color: '#FF2800',
                fontWeight: 'bold',
                fontSize: { xs: '1.4rem', md: '1.8rem' },
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: 1
              }}
            >
              FERRARI MOSCOW
            </Typography>
          </Box>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navItems.map((item) => (
                <Button 
                  key={item.path}
                  color="inherit" 
                  component={Link} 
                  to={item.path}
                  sx={{ 
                    color: 'white',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: location.pathname === item.path ? '100%' : '0%',
                      height: '2px',
                      bottom: 0,
                      left: 0,
                      backgroundColor: '#FF2800',
                      transition: 'width 0.3s ease'
                    },
                    '&:hover:after': {
                      width: '100%'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {isAuthenticated ? (
              userMenu
            ) : (
              <Button 
                variant="contained" 
                onClick={() => setAuthOpen(true)}
                sx={{
                  backgroundImage: 'linear-gradient(45deg, #FF2800, #FF4D4D)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundImage: 'linear-gradient(45deg, #FF4D4D, #FF2800)',
                  }
                }}
              >
                Войти
              </Button>
            )}
            
            {isMobile && (
              <IconButton 
                color="inherit" 
                aria-label="menu"
                onClick={() => setMobileOpen(true)} 
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileDrawer}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;