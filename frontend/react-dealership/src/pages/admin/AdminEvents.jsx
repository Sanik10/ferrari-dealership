import { useState, useEffect, useRef } from 'react';
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
  FormHelperText,
  Switch,
  FormControlLabel,
  Card,
  CardMedia,
  Tabs,
  Tab,
  ListItem,
  ListItemText,
  List,
  Badge
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { ru } from 'date-fns/locale';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import PublishIcon from '@mui/icons-material/Publish';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonIcon from '@mui/icons-material/Person';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// API
import { eventAPI, userAPI } from '../../services/api';

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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const ImagePreview = styled('div')(({ theme }) => ({
  width: '100%',
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
}));

const RemoveImageButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: alpha(theme.palette.common.white, 0.8),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.9),
  },
}));

// Event types
const eventTypes = [
  { value: 'race', label: 'Гоночное событие' },
  { value: 'launch', label: 'Запуск нового автомобиля' },
  { value: 'exhibition', label: 'Выставка' },
  { value: 'meeting', label: 'Встреча владельцев' },
  { value: 'test_drive', label: 'Групповой тест-драйв' },
  { value: 'other', label: 'Другое' }
];

// Main component
const AdminEvents = () => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  
  // State variables
  const [events, setEvents] = useState([]);
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
    type: 'all',
    status: 'all'
  });
  const [sort, setSort] = useState({
    field: 'date',
    direction: 'asc'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [detailsTab, setDetailsTab] = useState(0);
  
  // Form data for adding/editing an event
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: null,
    endDate: null,
    location: '',
    capacity: '',
    price: '',
    type: 'exhibition',
    featured: false,
    registration: true,
    active: true,
    imageUrl: '',
    newImage: null
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEvents();
      
      if (response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Не удалось загрузить мероприятия. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle dialog open for adding an event
  const handleAddEventClick = () => {
    setDialogMode('add');
    setFormData({
      title: '',
      description: '',
      date: new Date(),
      endDate: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), // + 3 hours by default
      location: '',
      capacity: '',
      price: '',
      type: 'exhibition',
      featured: false,
      registration: true,
      active: true,
      imageUrl: '',
      newImage: null
    });
    setFormErrors({});
    setOpenDialog(true);
  };
  
  // Handle dialog open for editing an event
  const handleEditEventClick = (event) => {
    setDialogMode('edit');
    setSelectedEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? new Date(event.date) : null,
      endDate: event.endDate ? new Date(event.endDate) : null,
      location: event.location || '',
      capacity: event.capacity || '',
      price: event.price !== undefined ? String(event.price) : '',
      type: event.type || 'exhibition',
      featured: event.featured || false,
      registration: event.registration !== false,
      active: event.active !== false,
      imageUrl: event.imageUrl || '',
      newImage: null
    });
    setFormErrors({});
    setOpenDialog(true);
  };
  
  // Handle dialog open for viewing an event
  const handleViewEventClick = async (event) => {
    setDialogMode('view');
    setSelectedEvent(event);
    setDetailsTab(0);
    setOpenDialog(true);
    
    try {
      setLoadingAttendees(true);
      const response = await eventAPI.getEventAttendees(event.id);
      
      if (response.data) {
        setAttendees(response.data);
      } else {
        setAttendees([]);
      }
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось загрузить список участников.',
        severity: 'error'
      });
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }
  };
  
  // Handle dialog open for deleting an event
  const handleDeleteEventClick = (event) => {
    setSelectedEvent(event);
    setConfirmDeleteOpen(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setAttendees([]);
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
  
  // Handle date changes
  const handleDateChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear specific error when user corrects the field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prevState => ({
          ...prevState,
          imageUrl: reader.result,
          newImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
    
    // Clear the input to allow selecting the same file again
    e.target.value = "";
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setFormData(prevState => ({
      ...prevState,
      imageUrl: '',
      newImage: null
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    if (!formData.title.trim()) errors.title = 'Название обязательно';
    if (!formData.description.trim()) errors.description = 'Описание обязательно';
    if (!formData.location.trim()) errors.location = 'Место проведения обязательно';
    if (!formData.date) errors.date = 'Дата начала обязательна';
    if (!formData.endDate) errors.endDate = 'Дата окончания обязательна';
    
    // Validate end date is after start date
    if (formData.date && formData.endDate && formData.date >= formData.endDate) {
      errors.endDate = 'Дата окончания должна быть позже даты начала';
    }
    
    // Validate capacity
    if (formData.capacity) {
      const capacity = parseInt(formData.capacity);
      if (isNaN(capacity) || capacity <= 0) {
        errors.capacity = 'Вместимость должна быть положительным числом';
      }
    }
    
    // Validate price
    if (formData.price) {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        errors.price = 'Цена должна быть неотрицательным числом';
      }
    }
    
    // Validate image
    if (!formData.imageUrl && !formData.newImage) {
      errors.imageUrl = 'Изображение обязательно';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmitForm = async () => {
    if (!validateForm()) return;
    
    try {
      // Prepare form data for submission
      const eventData = new FormData();
      
      // Add all form fields
      for (const key in formData) {
        if (key === 'newImage') continue; // Handle image separately
        if (key === 'date' || key === 'endDate') {
          if (formData[key]) {
            eventData.append(key, formData[key].toISOString());
          }
        } else {
          eventData.append(key, formData[key]);
        }
      }
      
      // Add image if present
      if (formData.newImage) {
        eventData.append('image', formData.newImage);
      }
      
      if (dialogMode === 'add') {
        // Add new event
        await eventAPI.addEvent(eventData);
        setSnackbar({
          open: true,
          message: 'Мероприятие успешно добавлено',
          severity: 'success'
        });
      } else {
        // Update existing event
        await eventAPI.updateEvent(selectedEvent.id, eventData);
        setSnackbar({
          open: true,
          message: 'Мероприятие успешно обновлено',
          severity: 'success'
        });
      }
      
      // Refresh events list
      fetchEvents();
      
      // Close dialog
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting event data:', error);
      setSnackbar({
        open: true,
        message: `Не удалось ${dialogMode === 'add' ? 'добавить' : 'обновить'} мероприятие.`,
        severity: 'error'
      });
    }
  };
  
  // Handle event deletion
  const handleDeleteEvent = async () => {
    try {
      await eventAPI.deleteEvent(selectedEvent.id);
      
      setSnackbar({
        open: true,
        message: 'Мероприятие успешно удалено',
        severity: 'success'
      });
      
      // Refresh events list
      fetchEvents();
      
      // Close confirmation dialog
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error('Error deleting event:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось удалить мероприятие.',
        severity: 'error'
      });
    }
  };
  
  // Handle event status toggle
  const handleToggleEventStatus = async (event) => {
    try {
      const updatedEvent = { ...event, active: !event.active };
      await eventAPI.updateEvent(event.id, updatedEvent);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(e => e.id === event.id ? { ...e, active: !e.active } : e)
      );
      
      setSnackbar({
        open: true,
        message: `Мероприятие ${updatedEvent.active ? 'активировано' : 'деактивировано'}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error toggling event status:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при изменении статуса мероприятия',
        severity: 'error'
      });
    }
  };
  
  // Handle featured status toggle
  const handleToggleFeaturedStatus = async (event) => {
    try {
      const updatedEvent = { ...event, featured: !event.featured };
      await eventAPI.updateEvent(event.id, updatedEvent);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(e => e.id === event.id ? { ...e, featured: !e.featured } : e)
      );
      
      setSnackbar({
        open: true,
        message: `Мероприятие ${updatedEvent.featured ? 'отмечено как избранное' : 'удалено из избранных'}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при изменении статуса избранного мероприятия',
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
  
  // Handle tab change in event details
  const handleChangeDetailsTab = (event, newValue) => {
    setDetailsTab(newValue);
  };
  
  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      // Filter by search query
      const matchesSearch = 
        (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by type
      const matchesType = filter.type === 'all' || event.type === filter.type;
      
      // Filter by status
      const now = new Date();
      const eventStart = event.date ? new Date(event.date) : null;
      const matchesStatus = 
        filter.status === 'all' || 
        (filter.status === 'active' && event.active !== false) || 
        (filter.status === 'inactive' && event.active === false) ||
        (filter.status === 'upcoming' && eventStart && eventStart > now) ||
        (filter.status === 'past' && eventStart && eventStart <= now);
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let valueA, valueB;
      
      switch (sort.field) {
        case 'title':
          valueA = a.title || '';
          valueB = b.title || '';
          break;
        case 'date':
          valueA = a.date ? new Date(a.date) : new Date(0);
          valueB = b.date ? new Date(b.date) : new Date(0);
          break;
        case 'location':
          valueA = a.location || '';
          valueB = b.location || '';
          break;
        case 'capacity':
          valueA = a.capacity || 0;
          valueB = b.capacity || 0;
          break;
        case 'price':
          valueA = a.price || 0;
          valueB = b.price || 0;
          break;
        default:
          valueA = a[sort.field] || '';
          valueB = b[sort.field] || '';
      }
      
      if (valueA < valueB) return sort.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  
  // Paginate events
  const paginatedEvents = filteredAndSortedEvents.slice(
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
  
  // Format price for display
  const formatPrice = (price) => {
    if (price === 0 || price === '0') return 'Бесплатно';
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price);
  };
  
  // Check if event is upcoming
  const isUpcoming = (date) => {
    if (!date) return false;
    return new Date(date) > new Date();
  };
  
  // Get chip color based on event status
  const getEventStatusColor = (event) => {
    if (!event.active) return 'error';
    if (isUpcoming(event.date)) return 'primary';
    return 'default';
  };
  
  // Get event status text
  const getEventStatusText = (event) => {
    if (!event.active) return 'Неактивно';
    if (isUpcoming(event.date)) return 'Предстоит';
    return 'Завершено';
  };
  
  // Get event type label
  const getEventTypeLabel = (type) => {
    const eventType = eventTypes.find(t => t.value === type);
    return eventType ? eventType.label : 'Другое';
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ mr: 1 }} /> 
              Управление мероприятиями
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddEventClick}
            >
              Добавить мероприятие
            </Button>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {/* Filters and Search */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder="Поиск мероприятий..."
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
                  <InputLabel id="type-filter-label">Тип</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    value={filter.type}
                    label="Тип"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <MenuItem value="all">Все типы</MenuItem>
                    {eventTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
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
                    <MenuItem value="upcoming">Предстоящие</MenuItem>
                    <MenuItem value="past">Завершенные</MenuItem>
                    <MenuItem value="active">Активные</MenuItem>
                    <MenuItem value="inactive">Неактивные</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Найдено: {filteredAndSortedEvents.length}
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
              {/* Events Table */}
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
                          onClick={() => handleSortChange('title')}
                        >
                          Название
                          {sort.field === 'title' && (
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
                          onClick={() => handleSortChange('date')}
                        >
                          Дата
                          {sort.field === 'date' && (
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
                          onClick={() => handleSortChange('location')}
                        >
                          Место
                          {sort.field === 'location' && (
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
                      <StyledTableCell>Тип</StyledTableCell>
                      <StyledTableCell align="center">
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer' 
                          }}
                          onClick={() => handleSortChange('capacity')}
                        >
                          Участники
                          {sort.field === 'capacity' && (
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
                    {paginatedEvents.length > 0 ? (
                      paginatedEvents.map((event) => (
                        <StyledTableRow key={event.id}>
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {event.imageUrl ? (
                                <Box
                                  component="img"
                                  src={event.imageUrl}
                                  alt={event.title}
                                  sx={{
                                    width: 60,
                                    height: 40,
                                    borderRadius: 1,
                                    objectFit: 'cover',
                                    mr: 2
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: 60,
                                    height: 40,
                                    borderRadius: 1,
                                    backgroundColor: 'grey.300',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2
                                  }}
                                >
                                  <ImageIcon color="action" />
                                </Box>
                              )}
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                  {event.title}
                                </Typography>
                                {event.featured && (
                                  <Chip 
                                    label="Избранное" 
                                    size="small" 
                                    color="secondary" 
                                    sx={{ mt: 0.5 }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {event.date ? formatDate(event.date) : 'Не указана'}
                                </Typography>
                              </Box>
                              {event.endDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    до {formatDate(event.endDate)}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {event.location || 'Не указано'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getEventTypeLabel(event.type)} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <StyledBadge 
                                badgeContent={event.attendees?.length || 0} 
                                color="primary"
                                showZero
                              >
                                <PeopleIcon />
                              </StyledBadge>
                              {event.capacity && (
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  / {event.capacity}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={getEventStatusText(event)}
                              color={getEventStatusColor(event)}
                              size="small"
                              icon={
                                !event.active ? <EventBusyIcon /> : 
                                isUpcoming(event.date) ? <EventAvailableIcon /> : 
                                <HourglassEmptyIcon />
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <Tooltip title="Детали">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleViewEventClick(event)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Редактировать">
                                <IconButton 
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditEventClick(event)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={event.active ? "Деактивировать" : "Активировать"}>
                                <IconButton 
                                  size="small"
                                  color={event.active ? "error" : "success"}
                                  onClick={() => handleToggleEventStatus(event)}
                                >
                                  {event.active ? <EventBusyIcon fontSize="small" /> : <EventAvailableIcon fontSize="small" />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={event.featured ? "Убрать из избранного" : "Добавить в избранное"}>
                                <IconButton 
                                  size="small"
                                  color={event.featured ? "secondary" : "default"}
                                  onClick={() => handleToggleFeaturedStatus(event)}
                                >
                                  {event.featured ? <CheckCircleIcon fontSize="small" /> : <MoreVertIcon fontSize="small" />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Удалить">
                                <IconButton 
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteEventClick(event)}
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
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body1" sx={{ py: 2 }}>
                            Мероприятия не найдены
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
                count={filteredAndSortedEvents.length}
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
        
        {/* Add/Edit Event Dialog */}
        {(dialogMode === 'add' || dialogMode === 'edit') && (
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {dialogMode === 'add' ? 'Добавить новое мероприятие' : 'Редактировать мероприятие'}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    name="title"
                    label="Название мероприятия"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Дата и время начала"
                    value={formData.date}
                    onChange={(newValue) => handleDateChange('date', newValue)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        margin="normal"
                        required
                        error={!!formErrors.date}
                        helperText={formErrors.date}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Дата и время окончания"
                    value={formData.endDate}
                    onChange={(newValue) => handleDateChange('endDate', newValue)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        margin="normal"
                        required
                        error={!!formErrors.endDate}
                        helperText={formErrors.endDate}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    name="location"
                    label="Место проведения"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={!!formErrors.location}
                    helperText={formErrors.location}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="type-label">Тип мероприятия</InputLabel>
                    <Select
                      labelId="type-label"
                      name="type"
                      value={formData.type}
                      label="Тип мероприятия"
                      onChange={handleInputChange}
                    >
                      {eventTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="capacity"
                    label="Максимальное количество участников"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    error={!!formErrors.capacity}
                    helperText={formErrors.capacity}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="price"
                    label="Стоимость участия"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    error={!!formErrors.price}
                    helperText={formErrors.price}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.featured}
                          onChange={handleInputChange}
                          name="featured"
                          color="secondary"
                        />
                      }
                      label="Избранное мероприятие"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.registration}
                          onChange={handleInputChange}
                          name="registration"
                          color="info"
                        />
                      }
                      label="Открыта регистрация"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.active}
                          onChange={handleInputChange}
                          name="active"
                          color="success"
                        />
                      }
                      label="Активно"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1 }} />
                    Описание мероприятия
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <ImageIcon sx={{ mr: 1 }} />
                    Изображение мероприятия
                  </Typography>
                  
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Загрузить изображение
                    <VisuallyHiddenInput 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageSelect}
                      ref={fileInputRef}
                    />
                  </Button>
                  
                  {formErrors.imageUrl && (
                    <FormHelperText error>{formErrors.imageUrl}</FormHelperText>
                  )}
                  
                  {formData.imageUrl && (
                    <ImagePreview sx={{ backgroundImage: `url(${formData.imageUrl})` }}>
                      <RemoveImageButton 
                        size="small"
                        onClick={handleRemoveImage}
                      >
                        <CloseIcon />
                      </RemoveImageButton>
                    </ImagePreview>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Отмена</Button>
              <Button 
                onClick={handleSubmitForm}
                variant="contained" 
                color="primary"
                startIcon={<PublishIcon />}
              >
                {dialogMode === 'add' ? 'Добавить' : 'Сохранить'}
              </Button>
            </DialogActions>
          </Dialog>
        )}
        
        {/* View Event Details Dialog */}
        {dialogMode === 'view' && selectedEvent && (
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Typography variant="h6">
                    {selectedEvent.title}
                  </Typography>
                </Box>
                <Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    size="small"
                    onClick={() => {
                      handleCloseDialog();
                      handleEditEventClick(selectedEvent);
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
                  label="Участники"
                  icon={
                    <Badge 
                      badgeContent={attendees?.length || 0} 
                      color="primary"
                      max={99}
                    >
                      <PeopleIcon />
                    </Badge>
                  }
                  iconPosition="start"
                  disabled={loadingAttendees}
                />
              </Tabs>
            </Box>
            
            <DialogContent dividers>
              {/* Loading indicator */}
              {loadingAttendees && detailsTab === 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              )}
              
              {/* Event Info Tab */}
              {detailsTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    {selectedEvent.imageUrl ? (
                      <Card>
                        <CardMedia
                          component="img"
                          height="250"
                          image={selectedEvent.imageUrl}
                          alt={selectedEvent.title}
                        />
                      </Card>
                    ) : (
                      <Paper
                        sx={{
                          height: 250,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'grey.200'
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                      </Paper>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Основная информация
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarMonthIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span" fontWeight="medium">
                                Дата начала
                              </Typography>
                            </Box>
                          } 
                          secondary={selectedEvent.date ? formatDate(selectedEvent.date) : 'Не указана'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span" fontWeight="medium">
                                Дата окончания
                              </Typography>
                            </Box>
                          } 
                          secondary={selectedEvent.endDate ? formatDate(selectedEvent.endDate) : 'Не указана'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOnIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span" fontWeight="medium">
                                Место проведения
                              </Typography>
                            </Box>
                          } 
                          secondary={selectedEvent.location || 'Не указано'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CategoryIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span" fontWeight="medium">
                                Тип мероприятия
                              </Typography>
                            </Box>
                          } 
                          secondary={getEventTypeLabel(selectedEvent.type)} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PeopleIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span" fontWeight="medium">
                                Вместимость
                              </Typography>
                            </Box>
                          } 
                          secondary={selectedEvent.capacity ? `${selectedEvent.capacity} человек` : 'Не ограничено'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AttachMoneyIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span" fontWeight="medium">
                                Стоимость
                              </Typography>
                            </Box>
                          } 
                          secondary={selectedEvent.price !== undefined ? formatPrice(selectedEvent.price) : 'Не указана'} 
                        />
                      </ListItem>
                    </List>
                    
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip 
                        label={getEventStatusText(selectedEvent)}
                        color={getEventStatusColor(selectedEvent)}
                        size="small"
                        icon={
                          !selectedEvent.active ? <EventBusyIcon /> : 
                          isUpcoming(selectedEvent.date) ? <EventAvailableIcon /> : 
                          <HourglassEmptyIcon />
                        }
                      />
                      
                      {selectedEvent.featured && (
                        <Chip 
                          label="Избранное" 
                          color="secondary" 
                          size="small"
                        />
                      )}
                      
                      <Chip 
                        label={selectedEvent.registration !== false ? "Регистрация открыта" : "Регистрация закрыта"} 
                        color={selectedEvent.registration !== false ? "success" : "error"} 
                        size="small"
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Описание
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedEvent.description || 'Описание отсутствует'}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              
              {/* Attendees Tab */}
              {detailsTab === 1 && !loadingAttendees && (
                <>
                  {attendees.length > 0 ? (
                    <List>
                      {attendees.map((attendee, index) => (
                        <ListItem 
                          key={attendee.id}
                          divider={index !== attendees.length - 1}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2">
                                {attendee.firstName} {attendee.lastName}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                {attendee.email && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {attendee.email}
                                    </Typography>
                                  </Box>
                                )}
                                {attendee.phone && (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {attendee.phone}
                                    </Typography>
                                  </Box>
                                )}
                                {attendee.registrationDate && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      Зарегистрирован: {formatDate(attendee.registrationDate)}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Нет зарегистрированных участников
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
              Вы уверены, что хотите удалить мероприятие "{selectedEvent?.title}"?
              Это действие нельзя отменить. Все связанные данные (регистрации участников) также будут удалены.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirm}>Отмена</Button>
            <Button 
              onClick={handleDeleteEvent} 
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

export default AdminEvents;