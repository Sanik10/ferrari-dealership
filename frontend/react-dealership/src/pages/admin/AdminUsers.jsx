import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  InputAdornment,
  TablePagination,
  Switch,
  FormControlLabel,
  FormHelperText,
  Avatar,
  Tab,
  Tabs,
  Badge,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import EventIcon from '@mui/icons-material/Event';
import DiamondIcon from '@mui/icons-material/Diamond';
import PasswordIcon from '@mui/icons-material/Password';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import RestoreIcon from '@mui/icons-material/Restore';

// API
import { userAPI, orderAPI, serviceAPI, eventAPI } from '../../services/api';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const RoleChip = styled(Chip)(({ role, theme }) => {
  const roleColors = {
    admin: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      icon: <AdminPanelSettingsIcon fontSize="small" />
    },
    manager: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      icon: <SupervisorAccountIcon fontSize="small" />
    },
    user: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
      icon: <PersonIcon fontSize="small" />
    },
    vip: {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
      icon: <DiamondIcon fontSize="small" />
    }
  };

  return {
    backgroundColor: roleColors[role]?.backgroundColor || theme.palette.grey[500],
    color: roleColors[role]?.color || theme.palette.common.white,
    '& .MuiChip-icon': {
      color: 'inherit'
    }
  };
});

// User roles with icons
const userRoles = [
  { value: 'user', label: 'Клиент', icon: <PersonIcon /> },
  { value: 'vip', label: 'VIP Клиент', icon: <DiamondIcon /> },
  { value: 'manager', label: 'Менеджер', icon: <SupervisorAccountIcon /> },
  { value: 'admin', label: 'Администратор', icon: <AdminPanelSettingsIcon /> }
];

// Main component
const AdminUsers = () => {
  const theme = useTheme();
  
  // State variables
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', or 'view'
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filter, setFilter] = useState({
    role: 'all',
    status: 'all'
  });
  const [sort, setSort] = useState({
    field: 'lastName',
    direction: 'asc'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userActivities, setUserActivities] = useState(null);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [detailsTab, setDetailsTab] = useState(0);
  
  // Form data for adding/editing a user
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    active: true,
    password: '',
    confirmPassword: '',
    vipStatus: false
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUsers();
      
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle dialog open for adding a user
  const handleAddUserClick = () => {
    setDialogMode('add');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      role: 'user',
      active: true,
      password: '',
      confirmPassword: '',
      vipStatus: false
    });
    setFormErrors({});
    setOpenDialog(true);
  };
  
  // Handle dialog open for editing a user
  const handleEditUserClick = (user) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user',
      active: user.active !== false, // Default to true if not specified
      password: '',
      confirmPassword: '',
      vipStatus: user.vipStatus || false
    });
    setFormErrors({});
    setOpenDialog(true);
  };
  
  // Handle dialog open for viewing a user
  const handleViewUserClick = async (user) => {
    setDialogMode('view');
    setSelectedUser(user);
    setDetailsTab(0);
    setOpenDialog(true);
    
    try {
      setLoadingActivities(true);
      
      // Fetch user activities (orders, services, events)
      const [ordersResponse, servicesResponse, eventsResponse] = await Promise.all([
        orderAPI.getUserOrders(user.id),
        serviceAPI.getUserServices(user.id),
        eventAPI.getUserEvents(user.id)
      ]);
      
      setUserActivities({
        orders: ordersResponse.data || [],
        services: servicesResponse.data || [],
        events: eventsResponse.data || []
      });
    } catch (error) {
      console.error('Error fetching user activities:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось загрузить активности пользователя.',
        severity: 'error'
      });
    } finally {
      setLoadingActivities(false);
    }
  };
  
  // Handle dialog open for deleting a user
  const handleDeleteUserClick = (user) => {
    setSelectedUser(user);
    setConfirmDeleteOpen(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setUserActivities(null);
  };
  
  // Handle close delete confirmation
  const handleCloseDeleteConfirm = () => {
    setConfirmDeleteOpen(false);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user corrects the field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    if (!formData.firstName.trim()) errors.firstName = 'Имя обязательно';
    if (!formData.lastName.trim()) errors.lastName = 'Фамилия обязательна';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Некорректный формат email';
    }
    
    // Validate phone number format (optional field)
    if (formData.phone) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = 'Некорректный формат телефона';
      }
    }
    
    // Validate password for new users
    if (dialogMode === 'add') {
      if (!formData.password) {
        errors.password = 'Пароль обязателен';
      } else if (formData.password.length < 6) {
        errors.password = 'Пароль должен быть не менее 6 символов';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
      }
    } else if (dialogMode === 'edit' && formData.password) {
      // Validate password only if provided for editing
      if (formData.password.length < 6) {
        errors.password = 'Пароль должен быть не менее 6 символов';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmitForm = async () => {
    if (!validateForm()) return;
    
    try {
      if (dialogMode === 'add') {
        // Add new user
        await userAPI.addUser(formData);
        setSnackbar({
          open: true,
          message: 'Пользователь успешно добавлен',
          severity: 'success'
        });
      } else {
        // Update existing user
        const updateData = { ...formData };
        
        // Only include password if it's provided
        if (!updateData.password) {
          delete updateData.password;
          delete updateData.confirmPassword;
        }
        
        await userAPI.updateUser(selectedUser.id, updateData);
        setSnackbar({
          open: true,
          message: 'Данные пользователя успешно обновлены',
          severity: 'success'
        });
      }
      
      // Refresh users list
      fetchUsers();
      
      // Close dialog
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting user data:', error);
      setSnackbar({
        open: true,
        message: `Не удалось ${dialogMode === 'add' ? 'добавить' : 'обновить'} пользователя.`,
        severity: 'error'
      });
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      await userAPI.deleteUser(selectedUser.id);
      
      setSnackbar({
        open: true,
        message: 'Пользователь успешно удален',
        severity: 'success'
      });
      
      // Refresh users list
      fetchUsers();
      
      // Close confirmation dialog
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось удалить пользователя.',
        severity: 'error'
      });
    }
  };
  
  // Handle user status toggle
  const handleToggleUserStatus = async (user) => {
    try {
      const updatedUser = { ...user, active: !user.active };
      await userAPI.updateUser(user.id, updatedUser);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === user.id ? { ...u, active: !u.active } : u)
      );
      
      setSnackbar({
        open: true,
        message: `Пользователь ${updatedUser.active ? 'активирован' : 'деактивирован'}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при изменении статуса пользователя',
        severity: 'error'
      });
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilter(prevState => ({
      ...prevState,
      [name]: value
    }));
    setPage(0); // Reset to first page when filtering
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    setSort(prevState => ({
      field,
      direction: prevState.field === field && prevState.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prevState => ({
      ...prevState,
      open: false
    }));
  };
  
  // Handle tab change in user details
  const handleChangeDetailsTab = (event, newValue) => {
    setDetailsTab(newValue);
  };
  
  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      // Filter by search query
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch = 
        fullName.includes(searchQuery.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by role
      const matchesRole = filter.role === 'all' || user.role === filter.role;
      
      // Filter by status
      const matchesStatus = 
        filter.status === 'all' || 
        (filter.status === 'active' && user.active !== false) || 
        (filter.status === 'inactive' && user.active === false);
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let valueA, valueB;
      
      switch (sort.field) {
        case 'firstName':
          valueA = a.firstName || '';
          valueB = b.firstName || '';
          break;
        case 'lastName':
          valueA = a.lastName || '';
          valueB = b.lastName || '';
          break;
        case 'email':
          valueA = a.email || '';
          valueB = b.email || '';
          break;
        case 'role':
          valueA = a.role || '';
          valueB = b.role || '';
          break;
        default:
          valueA = a[sort.field] || '';
          valueB = b[sort.field] || '';
      }
      
      if (valueA < valueB) return sort.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  
  // Paginate users
  const paginatedUsers = filteredAndSortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Get user initials for avatar
  const getUserInitials = (user) => {
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };
  
  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return theme.palette.error.main;
      case 'manager':
        return theme.palette.primary.main;
      case 'vip':
        return theme.palette.warning.main;
      default:
        return theme.palette.success.main;
    }
  };
  
  // Get role icon
  const getRoleIcon = (role) => {
    const roleObj = userRoles.find(r => r.value === role);
    return roleObj ? roleObj.icon : <PersonIcon />;
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} /> 
            Управление пользователями
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddUserClick}
          >
            Добавить пользователя
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Filters and Search */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Поиск пользователей..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="role-filter-label">Роль</InputLabel>
                <Select
                  labelId="role-filter-label"
                  value={filter.role}
                  label="Роль"
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <MenuItem value="all">Все роли</MenuItem>
                  {userRoles.map(role => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {React.cloneElement(role.icon, { style: { marginRight: 8, fontSize: '1.25rem' } })}
                        {role.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Статус</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={filter.status}
                  label="Статус"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="all">Все статусы</MenuItem>
                  <MenuItem value="active">Активные</MenuItem>
                  <MenuItem value="inactive">Неактивные</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Найдено: {filteredAndSortedUsers.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Error message if any */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Loading state */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Users Table */}
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => handleSortChange('lastName')}
                      >
                        Пользователь
                        {sort.field === 'lastName' && (
                          <SortIcon 
                            fontSize="small"
                            sx={{ 
                              ml: 0.5, 
                              transform: sort.direction === 'desc' ? 'rotate(180deg)' : 'none' 
                            }} 
                          />
                        )}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => handleSortChange('email')}
                      >
                        Email
                        {sort.field === 'email' && (
                          <SortIcon 
                            fontSize="small"
                            sx={{ 
                              ml: 0.5, 
                              transform: sort.direction === 'desc' ? 'rotate(180deg)' : 'none' 
                            }} 
                          />
                        )}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>Телефон</StyledTableCell>
                    <StyledTableCell>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => handleSortChange('role')}
                      >
                        Роль
                        {sort.field === 'role' && (
                          <SortIcon 
                            fontSize="small"
                            sx={{ 
                              ml: 0.5, 
                              transform: sort.direction === 'desc' ? 'rotate(180deg)' : 'none' 
                            }} 
                          />
                        )}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="center">Статус</StyledTableCell>
                    <StyledTableCell align="center">Действия</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <StyledTableRow key={user.id}>
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                mr: 2, 
                                bgcolor: getRoleColor(user.role),
                                width: 36,
                                height: 36
                              }}
                            >
                              {getUserInitials(user)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1">
                                {user.firstName} {user.lastName}
                              </Typography>
                              {user.registeredAt && (
                                <Typography variant="caption" color="text.secondary">
                                  Регистрация: {formatDate(user.registeredAt)}
                                </Typography>
                              )}
                            </Box>
                            {user.vipStatus && (
                              <Chip 
                                icon={<DiamondIcon />}
                                label="VIP"
                                size="small"
                                sx={{ 
                                  ml: 1,
                                  bgcolor: theme.palette.warning.light,
                                  color: theme.palette.warning.contrastText
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || 'Не указан'}</TableCell>
                        <TableCell>
                          <RoleChip 
                            label={userRoles.find(r => r.value === user.role)?.label || 'Клиент'}
                            size="small"
                            role={user.role || 'user'}
                            icon={getRoleIcon(user.role)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={user.active !== false ? "Активен" : "Заблокирован"}
                            color={user.active !== false ? "success" : "error"}
                            size="small"
                            icon={user.active !== false ? <CheckCircleIcon /> : <BlockIcon />}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Детали">
                              <IconButton 
                                size="small"
                                onClick={() => handleViewUserClick(user)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Редактировать">
                              <IconButton 
                                size="small"
                                color="primary"
                                onClick={() => handleEditUserClick(user)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
							<Tooltip title={user.active !== false ? "Заблокировать" : "Активировать"}>
                              <IconButton 
                                size="small"
                                color={user.active !== false ? "error" : "success"}
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                {user.active !== false ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                              <IconButton 
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUserClick(user)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body1" sx={{ py: 2 }}>
                          Пользователи не найдены
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredAndSortedUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Строк на странице:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            />
          </>
        )}
      </Paper>
      
      {/* Add/Edit User Dialog */}
      {(dialogMode === 'add' || dialogMode === 'edit') && (
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {dialogMode === 'add' ? 'Добавить нового пользователя' : 'Редактировать пользователя'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  name="firstName"
                  label="Имя"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  name="lastName"
                  label="Фамилия"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="phone"
                  label="Телефон"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="address"
                  label="Адрес"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Роль</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    value={formData.role}
                    label="Роль"
                    onChange={handleInputChange}
                  >
                    {userRoles.map(role => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {React.cloneElement(role.icon, { style: { marginRight: 8, fontSize: '1.25rem' } })}
                          {role.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.active}
                        onChange={handleInputChange}
                        name="active"
                        color="success"
                      />
                    }
                    label="Активен"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.vipStatus}
                        onChange={handleInputChange}
                        name="vipStatus"
                        color="warning"
                      />
                    }
                    label="VIP статус"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <VpnKeyIcon sx={{ mr: 1 }} />
                  {dialogMode === 'add' ? 'Создание пароля' : 'Изменение пароля'}
                </Typography>
                {dialogMode === 'edit' && (
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Оставьте поля пустыми, если не хотите менять пароль
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="password"
                  label="Пароль"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={dialogMode === 'add'}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="confirmPassword"
                  label="Подтверждение пароля"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={dialogMode === 'add'}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button 
              onClick={handleSubmitForm}
              variant="contained" 
              color="primary"
            >
              {dialogMode === 'add' ? 'Добавить' : 'Сохранить'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* View User Details Dialog */}
      {dialogMode === 'view' && selectedUser && (
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    mr: 2, 
                    bgcolor: getRoleColor(selectedUser.role),
                    width: 40,
                    height: 40
                  }}
                >
                  {getUserInitials(selectedUser)}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RoleChip 
                      label={userRoles.find(r => r.value === selectedUser.role)?.label || 'Клиент'}
                      size="small"
                      role={selectedUser.role || 'user'}
                      icon={getRoleIcon(selectedUser.role)}
                    />
                    {selectedUser.vipStatus && (
                      <Chip 
                        icon={<DiamondIcon />}
                        label="VIP"
                        size="small"
                        sx={{ 
                          ml: 1,
                          bgcolor: theme.palette.warning.light,
                          color: theme.palette.warning.contrastText
                        }}
                      />
                    )}
                    <Chip 
                      label={selectedUser.active !== false ? "Активен" : "Заблокирован"}
                      color={selectedUser.active !== false ? "success" : "error"}
                      size="small"
                      icon={selectedUser.active !== false ? <CheckCircleIcon /> : <BlockIcon />}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box>
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />} 
                  size="small"
                  onClick={() => {
                    handleCloseDialog();
                    handleEditUserClick(selectedUser);
                  }}
                  sx={{ mr: 1 }}
                >
                  Редактировать
                </Button>
              </Box>
            </Box>
          </DialogTitle>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={detailsTab} 
              onChange={handleChangeDetailsTab} 
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab 
                label="Информация" 
                icon={<InfoIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Заказы"
                disabled={loadingActivities}
                icon={
                  <Badge 
                    badgeContent={userActivities?.orders?.length || 0} 
                    color="primary"
                    max={99}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                }
              />
              <Tab 
                label="Сервис"
                disabled={loadingActivities}
                icon={
                  <Badge 
                    badgeContent={userActivities?.services?.length || 0} 
                    color="secondary"
                    max={99}
                  >
                    <CarRepairIcon />
                  </Badge>
                }
              />
              <Tab 
                label="События"
                disabled={loadingActivities}
                icon={
                  <Badge 
                    badgeContent={userActivities?.events?.length || 0} 
                    color="error"
                    max={99}
                  >
                    <EventIcon />
                  </Badge>
                }
              />
            </Tabs>
          </Box>
          
          <DialogContent dividers>
            {/* Loading indicator */}
            {loadingActivities && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            )}
            
            {/* User Info Tab */}
            {detailsTab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Личная информация
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="ФИО" 
                            secondary={`${selectedUser.firstName} ${selectedUser.lastName}`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Email" 
                            secondary={selectedUser.email} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PhoneIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Телефон" 
                            secondary={selectedUser.phone || 'Не указан'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LocationOnIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Адрес" 
                            secondary={selectedUser.address || 'Не указан'} 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Учетная запись
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <CalendarMonthIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Дата регистрации" 
                            secondary={selectedUser.registeredAt ? formatDate(selectedUser.registeredAt) : 'Не указана'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            {getRoleIcon(selectedUser.role)}
                          </ListItemIcon>
                          <ListItemText 
                            primary="Роль" 
                            secondary={userRoles.find(r => r.value === selectedUser.role)?.label || 'Клиент'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            {selectedUser.active !== false ? <CheckCircleIcon color="success" /> : <BlockIcon color="error" />}
                          </ListItemIcon>
                          <ListItemText 
                            primary="Статус" 
                            secondary={selectedUser.active !== false ? 'Активен' : 'Заблокирован'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <RestoreIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Последний вход" 
                            secondary={selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Нет данных'} 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
            
            {/* Orders Tab */}
            {detailsTab === 1 && userActivities && (
              <>
                {userActivities.orders.length > 0 ? (
                  <List>
                    {userActivities.orders.map((order, index) => (
                      <ListItem 
                        key={order.id}
                        divider={index !== userActivities.orders.length - 1}
                        secondaryAction={
                          <Chip 
                            label={order.status || 'Новый'} 
                            color={
                              order.status === 'completed' ? 'success' :
                              order.status === 'cancelled' ? 'error' :
                              order.status === 'processing' ? 'info' : 'warning'
                            }
                            size="small"
                          />
                        }
                      >
                        <ListItemIcon>
                          <ShoppingCartIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              Заказ {order.orderNumber || `#${order.id.slice(0, 8)}`}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {order.date ? formatDate(order.date) : 'Дата не указана'} • 
                                {order.totalPrice ? ` Сумма: ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(order.totalPrice)}` : ' Сумма не указана'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {order.car?.name || 'Автомобиль не указан'}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Заказы отсутствуют
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {/* Services Tab */}
            {detailsTab === 2 && userActivities && (
              <>
                {userActivities.services.length > 0 ? (
                  <List>
                    {userActivities.services.map((service, index) => (
                      <ListItem 
                        key={service.id}
                        divider={index !== userActivities.services.length - 1}
                        secondaryAction={
                          <Chip 
                            label={service.status || 'Новый'} 
                            color={
                              service.status === 'completed' ? 'success' :
                              service.status === 'cancelled' ? 'error' :
                              service.status === 'in_progress' ? 'info' : 'warning'
                            }
                            size="small"
                          />
                        }
                      >
                        <ListItemIcon>
                          <CarRepairIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              Сервис {service.serviceNumber || `#${service.id.slice(0, 8)}`}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {service.date ? formatDate(service.date) : 'Дата не указана'} • 
                                {service.serviceType || 'Тип не указан'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {service.car?.name || 'Автомобиль не указан'}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CarRepairIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Записи на сервис отсутствуют
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {/* Events Tab */}
            {detailsTab === 3 && userActivities && (
              <>
                {userActivities.events.length > 0 ? (
                  <List>
                    {userActivities.events.map((event, index) => (
                      <ListItem 
                        key={event.id}
                        divider={index !== userActivities.events.length - 1}
                        secondaryAction={
                          <Chip 
                            label={
                              new Date(event.date) > new Date() ? 'Предстоит' : 'Завершено'
                            } 
                            color={
                              new Date(event.date) > new Date() ? 'info' : 'default'
                            }
                            size="small"
                          />
                        }
                      >
                        <ListItemIcon>
                          <EventIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {event.title || 'Без названия'}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {event.date ? formatDate(event.date) : 'Дата не указана'} • 
                                {event.type ? ` Тип: ${event.type}` : ''}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {event.location || 'Место не указано'}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <EventIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Записи на мероприятия отсутствуют
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить пользователя {selectedUser?.firstName} {selectedUser?.lastName}?
            Это действие нельзя отменить. Все связанные данные (заказы, сервисные записи и т.д.) также могут быть удалены.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Отмена</Button>
          <Button 
            onClick={handleDeleteUser} 
            variant="contained" 
            color="error"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminUsers;