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
  Card,
  CardMedia,
  Tabs,
  Tab,
  ListItem,
  ListItemText,
  List,
  FormHelperText,
  Badge,
  Avatar
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { ru } from 'date-fns/locale';
import { styled, useTheme } from '@mui/material/styles';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import BlockIcon from '@mui/icons-material/Block';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CommentIcon from '@mui/icons-material/Comment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// API
import { testDriveAPI, carAPI, userAPI } from '../../services/api';

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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

// Test drive statuses with labels and colors
const testDriveStatuses = [
  { value: 'pending', label: 'Ожидает подтверждения', color: 'warning', icon: <HourglassEmptyIcon /> },
  { value: 'confirmed', label: 'Подтвержден', color: 'info', icon: <EventIcon /> },
  { value: 'completed', label: 'Завершен', color: 'success', icon: <DoneIcon /> },
  { value: 'cancelled', label: 'Отменен', color: 'error', icon: <CancelIcon /> },
  { value: 'no_show', label: 'Неявка', color: 'error', icon: <BlockIcon /> }
];

// Main component
const AdminTestDrives = () => {
  const theme = useTheme();
  
  // State variables
  const [testDrives, setTestDrives] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view'); // 'edit' or 'view'
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filter, setFilter] = useState({
    status: 'all',
    date: 'all'
  });
  const [sort, setSort] = useState({
    field: 'scheduledDate',
    direction: 'asc'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTestDrive, setSelectedTestDrive] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [carData, setCarData] = useState(null);
  const [detailsTab, setDetailsTab] = useState(0);
  
  // Form data for editing a test drive
  const [formData, setFormData] = useState({
    scheduledDate: null,
    status: 'pending',
    notes: '',
    adminNotes: ''
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch test drives on component mount
  useEffect(() => {
    fetchTestDrives();
    fetchCars();
  }, []);
  
  // Fetch test drives from API
  const fetchTestDrives = async () => {
    try {
      setLoading(true);
      const response = await testDriveAPI.getTestDrives();
      
      if (response.data) {
        setTestDrives(response.data);
      }
    } catch (error) {
      console.error('Error fetching test drives:', error);
      setError('Не удалось загрузить тест-драйвы. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch cars for populating dropdowns
  const fetchCars = async () => {
    try {
      const response = await carAPI.getAllCars();
      
      if (response) {
        // Проверяем формат ответа
        if (Array.isArray(response)) {
          setCars(response);
        } else if (response.data && Array.isArray(response.data)) {
          setCars(response.data);
        } else {
          console.error('Неожиданный формат ответа API:', response);
          setCars([]);
        }
      } else {
        setCars([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке автомобилей:', error);
      setCars([]);
    }
  };
  
  // Fetch user data for a specific test drive
  const fetchUserData = async (userId) => {
    try {
      const response = await userAPI.getUserById(userId);
      
      if (response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось загрузить данные пользователя.',
        severity: 'error'
      });
    }
  };
  
  // Fetch car data for a specific test drive
  const fetchCarData = async (carId) => {
    try {
      const response = await carAPI.getCar(carId);
      
      if (response.data) {
        setCarData(response.data);
      }
    } catch (error) {
      console.error('Error fetching car data:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось загрузить данные автомобиля.',
        severity: 'error'
      });
    }
  };
  
  // Handle dialog open for editing a test drive
  const handleEditTestDriveClick = (testDrive) => {
    setDialogMode('edit');
    setSelectedTestDrive(testDrive);
    setFormData({
      scheduledDate: testDrive.scheduledDate ? new Date(testDrive.scheduledDate) : null,
      status: testDrive.status || 'pending',
      notes: testDrive.notes || '',
      adminNotes: testDrive.adminNotes || ''
    });
    setFormErrors({});
    setOpenDialog(true);
    
    // Fetch user and car data if not available
    if (testDrive.userId) {
      fetchUserData(testDrive.userId);
    }
    
    if (testDrive.carId) {
      fetchCarData(testDrive.carId);
    }
  };
  
  // Handle dialog open for viewing a test drive
  const handleViewTestDriveClick = (testDrive) => {
    setDialogMode('view');
    setSelectedTestDrive(testDrive);
    setDetailsTab(0);
    setOpenDialog(true);
    
    // Fetch user and car data if not available
    if (testDrive.userId) {
      fetchUserData(testDrive.userId);
    }
    
    if (testDrive.carId) {
      fetchCarData(testDrive.carId);
    }
  };
  
  // Handle dialog open for deleting a test drive
  const handleDeleteTestDriveClick = (testDrive) => {
    setSelectedTestDrive(testDrive);
    setConfirmDeleteOpen(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTestDrive(null);
    setUserData(null);
    setCarData(null);
  };
  
  // Handle close delete confirmation
  const handleCloseDeleteConfirm = () => {
    setConfirmDeleteOpen(false);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear specific error when user corrects the field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle date changes
  const handleDateChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      scheduledDate: value
    }));
    
    // Clear specific error
    if (formErrors.scheduledDate) {
      setFormErrors(prev => ({ ...prev, scheduledDate: null }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.scheduledDate) {
      errors.scheduledDate = 'Дата и время тест-драйва обязательны';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmitForm = async () => {
    if (!validateForm()) return;
    
    try {
      // Update test drive
      await testDriveAPI.updateTestDrive(selectedTestDrive.id, formData);
      
      setSnackbar({
        open: true,
        message: 'Тест-драйв успешно обновлен',
        severity: 'success'
      });
      
      // Refresh test drives list
      fetchTestDrives();
      
      // Close dialog
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating test drive:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось обновить тест-драйв.',
        severity: 'error'
      });
    }
  };
  
  // Handle quick status update
  const handleStatusUpdate = async (testDriveId, newStatus) => {
    try {
      await testDriveAPI.updateTestDrive(testDriveId, { status: newStatus });
      
      // Update local state
      setTestDrives(prevTestDrives => 
        prevTestDrives.map(td => td.id === testDriveId ? { ...td, status: newStatus } : td)
      );
      
      setSnackbar({
        open: true,
        message: `Статус тест-драйва успешно изменен на "${getStatusLabel(newStatus)}"`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating test drive status:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при изменении статуса тест-драйва',
        severity: 'error'
      });
    }
  };
  
  // Handle test drive deletion
  const handleDeleteTestDrive = async () => {
    try {
      await testDriveAPI.deleteTestDrive(selectedTestDrive.id);
      
      setSnackbar({
        open: true,
        message: 'Тест-драйв успешно удален',
        severity: 'success'
      });
      
      // Refresh test drives list
      fetchTestDrives();
      
      // Close confirmation dialog
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error('Error deleting test drive:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось удалить тест-драйв.',
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
  
  // Handle tab change in test drive details
  const handleChangeDetailsTab = (event, newValue) => {
    setDetailsTab(newValue);
  };
  
  // Get label for a status
  const getStatusLabel = (status) => {
    const statusObj = testDriveStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : 'Неизвестный статус';
  };
  
  // Get color for a status
  const getStatusColor = (status) => {
    const statusObj = testDriveStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'default';
  };
  
  // Get icon for a status
  const getStatusIcon = (status) => {
    const statusObj = testDriveStatuses.find(s => s.value === status);
    return statusObj ? statusObj.icon : <InfoOutlinedIcon />;
  };
  
  // Get car model name by ID
  const getCarModelName = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? car.model : 'Неизвестная модель';
  };
  
  // Filter and sort test drives
  const filteredAndSortedTestDrives = testDrives
    .filter(testDrive => {
      // Filter by search query (client name, email, phone, or car model)
      const matchesSearch = 
        (testDrive.clientName && testDrive.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (testDrive.email && testDrive.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (testDrive.phone && testDrive.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (getCarModelName(testDrive.carId).toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by status
      const matchesStatus = filter.status === 'all' || testDrive.status === filter.status;
      
      // Filter by date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const testDriveDate = testDrive.scheduledDate ? new Date(testDrive.scheduledDate) : null;
      let matchesDate = filter.date === 'all';
      
      if (testDriveDate) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        if (filter.date === 'today') {
          const testDriveDay = new Date(testDriveDate);
          testDriveDay.setHours(0, 0, 0, 0);
          matchesDate = testDriveDay.getTime() === today.getTime();
        } else if (filter.date === 'tomorrow') {
          const testDriveDay = new Date(testDriveDate);
          testDriveDay.setHours(0, 0, 0, 0);
          const tomorrowDay = new Date(tomorrow);
          tomorrowDay.setHours(0, 0, 0, 0);
          matchesDate = testDriveDay.getTime() === tomorrowDay.getTime();
        } else if (filter.date === 'week') {
          matchesDate = testDriveDate > today && testDriveDate < nextWeek;
        } else if (filter.date === 'upcoming') {
          matchesDate = testDriveDate > today;
        } else if (filter.date === 'past') {
          matchesDate = testDriveDate < today;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      let valueA, valueB;
      
      switch (sort.field) {
        case 'scheduledDate':
          valueA = a.scheduledDate ? new Date(a.scheduledDate) : new Date(0);
          valueB = b.scheduledDate ? new Date(b.scheduledDate) : new Date(0);
          break;
        case 'clientName':
          valueA = a.clientName || '';
          valueB = b.clientName || '';
          break;
        case 'carModel':
          valueA = getCarModelName(a.carId) || '';
          valueB = getCarModelName(b.carId) || '';
          break;
        case 'status':
          valueA = a.status || '';
          valueB = b.status || '';
          break;
        default:
          valueA = a[sort.field] || '';
          valueB = b[sort.field] || '';
      }
      
      if (valueA < valueB) return sort.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  
  // Paginate test drives
  const paginatedTestDrives = filteredAndSortedTestDrives.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2);
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DriveEtaIcon sx={{ mr: 1 }} /> 
              Управление тест-драйвами
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {/* Filters and Search */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder="Поиск по имени клиента, email, телефону или модели..."
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
                  <InputLabel id="status-filter-label">Статус</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={filter.status}
                    label="Статус"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="all">Все статусы</MenuItem>
                    {testDriveStatuses.map(status => (
                      <MenuItem key={status.value} value={status.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {React.cloneElement(status.icon, { style: { marginRight: 8, fontSize: '1.25rem' } })}
                          {status.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="date-filter-label">Дата</InputLabel>
                  <Select
                    labelId="date-filter-label"
                    value={filter.date}
                    label="Дата"
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  >
                    <MenuItem value="all">Все даты</MenuItem>
                    <MenuItem value="today">Сегодня</MenuItem>
                    <MenuItem value="tomorrow">Завтра</MenuItem>
                    <MenuItem value="week">На этой неделе</MenuItem>
                    <MenuItem value="upcoming">Предстоящие</MenuItem>
                    <MenuItem value="past">Прошедшие</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Найдено: {filteredAndSortedTestDrives.length}
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
              {/* Test Drives Table */}
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
                          onClick={() => handleSortChange('scheduledDate')}
                        >
                          Дата и время
                          {sort.field === 'scheduledDate' && (
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
                          onClick={() => handleSortChange('clientName')}
                        >
                          Клиент
                          {sort.field === 'clientName' && (
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
                          onClick={() => handleSortChange('carModel')}
                        >
                          Автомобиль
                          {sort.field === 'carModel' && (
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
                          onClick={() => handleSortChange('status')}
                        >
                          Статус
                          {sort.field === 'status' && (
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
                      <StyledTableCell align="center">Контакты</StyledTableCell>
                      <StyledTableCell align="center">Действия</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTestDrives.length > 0 ? (
                      paginatedTestDrives.map((testDrive) => (
                        <StyledTableRow key={testDrive.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {testDrive.scheduledDate ? formatDate(testDrive.scheduledDate) : 'Не указана'}
                                </Typography>
                              </Box>
                              {testDrive.createdAt && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    Заявка от: {formatDate(testDrive.createdAt)}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  mr: 2, 
								  bgcolor: theme.palette.primary.main,
                                  width: 36,
                                  height: 36
                                }}
                              >
                                {getUserInitials(testDrive.clientName)}
                              </Avatar>
                              <Box>
                                <Typography variant="body1">
                                  {testDrive.clientName || 'Имя не указано'}
                                </Typography>
                                {testDrive.drivingExperience && (
                                  <Typography variant="caption" color="text.secondary">
                                    Стаж вождения: {testDrive.drivingExperience} лет
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DirectionsCarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {getCarModelName(testDrive.carId)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusLabel(testDrive.status)} 
                              color={getStatusColor(testDrive.status)}
                              size="small"
                              icon={React.cloneElement(getStatusIcon(testDrive.status), { fontSize: 'small' })}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                              {testDrive.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <EmailIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', color: 'text.secondary' }} />
                                  <Typography variant="caption">{testDrive.email}</Typography>
                                </Box>
                              )}
                              {testDrive.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <PhoneIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', color: 'text.secondary' }} />
                                  <Typography variant="caption">{testDrive.phone}</Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <Tooltip title="Детали">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleViewTestDriveClick(testDrive)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Редактировать">
                                <IconButton 
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditTestDriveClick(testDrive)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Подтвердить" sx={{ display: testDrive.status === 'pending' ? 'inline-flex' : 'none' }}>
                                <IconButton 
                                  size="small"
                                  color="info"
                                  onClick={() => handleStatusUpdate(testDrive.id, 'confirmed')}
                                >
                                  <EventIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Завершить" sx={{ display: testDrive.status === 'confirmed' ? 'inline-flex' : 'none' }}>
                                <IconButton 
                                  size="small"
                                  color="success"
                                  onClick={() => handleStatusUpdate(testDrive.id, 'completed')}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Отметить неявку" sx={{ display: testDrive.status === 'confirmed' ? 'inline-flex' : 'none' }}>
                                <IconButton 
                                  size="small"
                                  color="error"
                                  onClick={() => handleStatusUpdate(testDrive.id, 'no_show')}
                                >
                                  <BlockIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Отменить" sx={{ display: ['pending', 'confirmed'].includes(testDrive.status) ? 'inline-flex' : 'none' }}>
                                <IconButton 
                                  size="small"
                                  color="error"
                                  onClick={() => handleStatusUpdate(testDrive.id, 'cancelled')}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Удалить">
                                <IconButton 
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteTestDriveClick(testDrive)}
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
                            Тест-драйвы не найдены
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
                count={filteredAndSortedTestDrives.length}
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
        
        {/* Edit Test Drive Dialog */}
        {dialogMode === 'edit' && selectedTestDrive && (
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Редактирование тест-драйва
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Клиент
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        sx={{ 
                          mr: 2, 
                          bgcolor: theme.palette.primary.main,
                          width: 40,
                          height: 40
                        }}
                      >
                        {getUserInitials(selectedTestDrive.clientName)}
                      </Avatar>
                      <Typography variant="subtitle1">
                        {selectedTestDrive.clientName || 'Имя не указано'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 1 }}>
                      {selectedTestDrive.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{selectedTestDrive.email}</Typography>
                        </Box>
                      )}
                      {selectedTestDrive.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{selectedTestDrive.phone}</Typography>
                        </Box>
                      )}
                      {selectedTestDrive.drivingExperience && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DriveEtaIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            Стаж вождения: {selectedTestDrive.drivingExperience} лет
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Автомобиль
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DirectionsCarIcon fontSize="medium" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle1">
                        {getCarModelName(selectedTestDrive.carId)}
                      </Typography>
                    </Box>
                    {carData && (
                      <Box sx={{ mt: 1 }}>
                        {carData.price && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CreditCardIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              Цена: {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(carData.price)}
                            </Typography>
                          </Box>
                        )}
                        {carData.engine && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              Двигатель: {carData.engine}
                            </Typography>
                          </Box>
                        )}
                        {carData.color && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ColorIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              Цвет: {carData.color}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Дата и время тест-драйва"
                    value={formData.scheduledDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        margin="normal"
                        required
                        error={!!formErrors.scheduledDate}
                        helperText={formErrors.scheduledDate}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="status-label">Статус</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={formData.status}
                      label="Статус"
                      onChange={handleInputChange}
                    >
                      {testDriveStatuses.map(status => (
                        <MenuItem key={status.value} value={status.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {React.cloneElement(status.icon, { style: { marginRight: 8, fontSize: '1.25rem' } })}
                            {status.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Комментарий клиента"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CommentIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Заметки администратора (не видны клиенту)"
                    name="adminNotes"
                    value={formData.adminNotes}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Добавьте внутренние заметки по этому тест-драйву..."
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
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>
        )}
        
        {/* View Test Drive Details Dialog */}
        {dialogMode === 'view' && selectedTestDrive && (
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DriveEtaIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Typography variant="h6">
                    Детали тест-драйва
                  </Typography>
                </Box>
                <Box>
                  <Chip 
                    label={getStatusLabel(selectedTestDrive.status)} 
                    color={getStatusColor(selectedTestDrive.status)}
                    icon={React.cloneElement(getStatusIcon(selectedTestDrive.status), { fontSize: 'small' })}
                    sx={{ mr: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    size="small"
                    onClick={() => {
                      handleCloseDialog();
                      handleEditTestDriveClick(selectedTestDrive);
                    }}
                  >
                    Редактировать
                  </Button>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        Информация о клиенте
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: theme.palette.primary.main,
                            width: 48,
                            height: 48
                          }}
                        >
                          {getUserInitials(selectedTestDrive.clientName)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {selectedTestDrive.clientName || 'Имя не указано'}
                          </Typography>
                          
                          <Box sx={{ mt: 1 }}>
                            {selectedTestDrive.email && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">{selectedTestDrive.email}</Typography>
                              </Box>
                            )}
                            {selectedTestDrive.phone && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">{selectedTestDrive.phone}</Typography>
                              </Box>
                            )}
                            {selectedTestDrive.drivingExperience && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DriveEtaIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  Стаж вождения: {selectedTestDrive.drivingExperience} лет
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectionsCarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        Информация об автомобиле
                      </Typography>
                      
                      {carData ? (
                        <Box sx={{ mt: 2 }}>
                          {carData.imageUrl && (
                            <Box
                              component="img"
                              src={carData.imageUrl}
                              alt={`${carData.make} ${carData.model}`}
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: 1,
                                mb: 2
                              }}
                            />
                          )}
                          
                          <Typography variant="h6">
                            {carData.make} {carData.model}
                          </Typography>
                          
                          <Box sx={{ mt: 1 }}>
                            {carData.year && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">Год: {carData.year}</Typography>
                              </Box>
                            )}
                            {carData.price && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CreditCardIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  Цена: {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(carData.price)}
                                </Typography>
                              </Box>
                            )}
                            {carData.engine && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  Двигатель: {carData.engine}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                          <DirectionsCarIcon fontSize="large" sx={{ mr: 2, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            {getCarModelName(selectedTestDrive.carId)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        Детали тест-драйва
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <CalendarMonthIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Дата и время тест-драйва
                              </Typography>
                              <Typography variant="body1">
                                {selectedTestDrive.scheduledDate ? 
                                  formatDate(selectedTestDrive.scheduledDate) : 
                                  'Не запланировано'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Дата создания заявки
                              </Typography>
                              <Typography variant="body1">
                                {selectedTestDrive.createdAt ? 
                                  formatDate(selectedTestDrive.createdAt) : 
                                  'Не указана'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        
                        {selectedTestDrive.preferredContact && (
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <PhoneIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Предпочтительный способ связи
                                </Typography>
                                <Typography variant="body1">
                                  {selectedTestDrive.preferredContact}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        )}
                        
                        {selectedTestDrive.notes && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <CommentIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Комментарий клиента
                                </Typography>
                                <Typography variant="body1">
                                  {selectedTestDrive.notes}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        )}
                        
                        {selectedTestDrive.adminNotes && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <InfoOutlinedIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Заметки администратора
                                </Typography>
                                <Typography variant="body1">
                                  {selectedTestDrive.adminNotes}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Закрыть</Button>
              {selectedTestDrive.status === 'pending' && (
                <Button 
                  color="info" 
                  variant="contained"
                  onClick={() => {
                    handleStatusUpdate(selectedTestDrive.id, 'confirmed');
                    handleCloseDialog();
                  }}
                  startIcon={<EventIcon />}
                >
                  Подтвердить
                </Button>
              )}
              {selectedTestDrive.status === 'confirmed' && (
                <>
                  <Button 
                    color="success" 
                    variant="contained"
                    onClick={() => {
                      handleStatusUpdate(selectedTestDrive.id, 'completed');
                      handleCloseDialog();
                    }}
                    startIcon={<CheckCircleIcon />}
                  >
                    Завершить
                  </Button>
                  <Button 
                    color="error" 
                    variant="contained"
                    onClick={() => {
                      handleStatusUpdate(selectedTestDrive.id, 'no_show');
                      handleCloseDialog();
                    }}
                    startIcon={<BlockIcon />}
                  >
                    Неявка
                  </Button>
                </>
              )}
              {['pending', 'confirmed'].includes(selectedTestDrive.status) && (
                <Button 
                  color="error" 
                  variant="outlined"
                  onClick={() => {
                    handleStatusUpdate(selectedTestDrive.id, 'cancelled');
                    handleCloseDialog();
                  }}
                  startIcon={<CancelIcon />}
                >
                  Отменить тест-драйв
                </Button>
              )}
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
              Вы уверены, что хотите удалить тест-драйв для {selectedTestDrive?.clientName || 'клиента'} на {selectedTestDrive?.scheduledDate ? formatDate(selectedTestDrive.scheduledDate) : 'указанную дату'}?
              Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirm}>Отмена</Button>
            <Button 
              onClick={handleDeleteTestDrive} 
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
    </LocalizationProvider>
  );
};

export default AdminTestDrives;