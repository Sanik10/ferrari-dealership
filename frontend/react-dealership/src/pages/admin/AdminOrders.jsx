import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventNoteIcon from '@mui/icons-material/EventNote';

// API
import { orderAPI, carAPI, userAPI } from '../../services/api';

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

// Status chip colors
const statusColors = {
  pending: { color: 'warning', icon: <ScheduleIcon /> },
  processing: { color: 'info', icon: <LocalShippingIcon /> },
  completed: { color: 'success', icon: <CheckCircleIcon /> },
  cancelled: { color: 'error', icon: <CancelIcon /> }
};

// Order statuses
const orderStatuses = [
  { value: 'pending', label: 'Ожидает обработки' },
  { value: 'processing', label: 'В обработке' },
  { value: 'completed', label: 'Завершен' },
  { value: 'cancelled', label: 'Отменен' }
];

// Order timeline step labels
const orderSteps = [
  'Заказ получен',
  'Оплата подтверждена',
  'Подготовка автомобиля',
  'Доставка',
  'Заказ завершен'
];

// Main component
const AdminOrders = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // State variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filter, setFilter] = useState({
    status: 'all',
    period: 'all'
  });
  const [sort, setSort] = useState({
    field: 'date',
    direction: 'desc'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [carDetails, setCarDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsTab, setDetailsTab] = useState(0);
  
  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);
  
  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      console.log("Response from getOrders:", response);
      
      if (response) {
        // Проверяем формат ответа
        if (Array.isArray(response)) {
          setOrders(response);
        } else if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error('Неожиданный формат ответа API:', response);
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Не удалось загрузить заказы. Пожалуйста, попробуйте позже.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle order details dialog open
  const handleOrderDetailsClick = async (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
    
    try {
      // Fetch related car and user details if needed
      if (order.carId) {
        const carResponse = await carAPI.getCar(order.carId);
        setCarDetails(carResponse.data);
      }
      
      if (order.userId) {
        const userResponse = await userAPI.getUserById(order.userId);
        setUserDetails(userResponse.data);
      }
    } catch (error) {
      console.error('Error fetching additional details:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось загрузить все детали заказа.',
        severity: 'warning'
      });
    }
  };
  
  // Handle status update dialog open
  const handleStatusUpdateClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setStatusUpdateOpen(true);
  };
  
  // Handle delete confirmation dialog open
  const handleDeleteOrderClick = (order) => {
    setSelectedOrder(order);
    setConfirmDeleteOpen(true);
  };
  
  // Close order details dialog
  const handleCloseDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
    setCarDetails(null);
    setUserDetails(null);
    setDetailsTab(0);
  };
  
  // Close status update dialog
  const handleCloseStatusUpdate = () => {
    setStatusUpdateOpen(false);
  };
  
  // Close delete confirmation dialog
  const handleCloseDeleteConfirm = () => {
    setConfirmDeleteOpen(false);
  };
  
  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      await orderAPI.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        note: statusNote
      });
      
      // Update local state
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: newStatus, statusHistory: [...(order.statusHistory || []), { status: newStatus, date: new Date().toISOString(), note: statusNote }] }
          : order
      ));
      
      setSnackbar({
        open: true,
        message: 'Статус заказа успешно обновлен',
        severity: 'success'
      });
      
      // Close dialog
      handleCloseStatusUpdate();
    } catch (error) {
      console.error('Error updating order status:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при обновлении статуса заказа',
        severity: 'error'
      });
    }
  };
  
  // Handle order deletion
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      await orderAPI.deleteOrder(selectedOrder.id);
      
      // Update local state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== selectedOrder.id));
      
      setSnackbar({
        open: true,
        message: 'Заказ успешно удален',
        severity: 'success'
      });
      
      // Close dialog
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error('Error deleting order:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при удалении заказа',
        severity: 'error'
      });
    }
  };
  
  // Handle search query change
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
  
  // Change details tab
  const handleChangeDetailsTab = (event, newValue) => {
    setDetailsTab(newValue);
  };
  
  // Calculate active step for timeline
  const getActiveStep = (status) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 2;
      case 'completed':
        return 4;
      case 'cancelled':
        return -1; // No active step for cancelled
      default:
        return 0;
    }
  };
  
  // Filter and sort orders
  const filteredAndSortedOrders = Array.isArray(orders) 
    ? orders.filter(order => {
        // Filter by search query
        const matchesSearch = 
          (order.orderNumber && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (userDetails && userDetails.name && userDetails.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (order.carId && carDetails && carDetails.name && carDetails.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Filter by status
        const matchesStatus = filter.status === 'all' || order.status === filter.status;
        
        // Filter by period
        let matchesPeriod = true;
        if (filter.period !== 'all') {
          const orderDate = new Date(order.date);
          const now = new Date();
          
          switch (filter.period) {
            case 'today': {
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              matchesPeriod = orderDate >= today;
              break;
            }
            case 'week': {
              const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              matchesPeriod = orderDate >= lastWeek;
              break;
            }
            case 'month': {
              const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
              matchesPeriod = orderDate >= lastMonth;
              break;
            }
            default:
              matchesPeriod = true;
          }
        }
        
        return matchesSearch && matchesStatus && matchesPeriod;
      })
      .sort((a, b) => {
        let valueA, valueB;
        
        switch (sort.field) {
          case 'date':
            valueA = new Date(a.date);
            valueB = new Date(b.date);
            break;
          case 'orderNumber':
            valueA = a.orderNumber || '';
            valueB = b.orderNumber || '';
            break;
          case 'totalPrice':
            valueA = parseFloat(a.totalPrice);
            valueB = parseFloat(b.totalPrice);
            break;
          default:
            valueA = a[sort.field];
            valueB = b[sort.field];
        }
        
        if (valueA < valueB) return sort.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [];
  
  // Paginate orders
  const paginatedOrders = filteredAndSortedOrders.slice(
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
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCartIcon sx={{ mr: 1 }} /> 
            Управление заказами
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Filters and Search */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Поиск заказов..."
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
                  {orderStatuses.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="period-filter-label">Период</InputLabel>
                <Select
                  labelId="period-filter-label"
                  value={filter.period}
                  label="Период"
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                >
                  <MenuItem value="all">Все время</MenuItem>
                  <MenuItem value="today">Сегодня</MenuItem>
                  <MenuItem value="week">Последние 7 дней</MenuItem>
                  <MenuItem value="month">Последние 30 дней</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  <FilterListIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Найдено: {filteredAndSortedOrders.length}
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
            {/* Orders Table */}
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
                        onClick={() => handleSortChange('orderNumber')}
                      >
                        № Заказа
                        {sort.field === 'orderNumber' && (
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
                    <StyledTableCell>Клиент</StyledTableCell>
                    <StyledTableCell>Автомобиль</StyledTableCell>
                    <StyledTableCell>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => handleSortChange('totalPrice')}
                      >
                        Сумма
                        {sort.field === 'totalPrice' && (
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
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order) => (
                      <StyledTableRow key={order.id}>
                        <TableCell component="th" scope="row">
                          {order.orderNumber || `#${order.id.slice(0, 8)}`}
                        </TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>
                          {order.customer?.name || 'Н/Д'}
                        </TableCell>
                        <TableCell>
                          {order.car?.name || `ID: ${order.carId}` || 'Н/Д'}
                        </TableCell>
                        <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            icon={statusColors[order.status]?.icon}
                            label={orderStatuses.find(s => s.value === order.status)?.label || order.status}
                            color={statusColors[order.status]?.color || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Детали">
                              <IconButton 
                                size="small"
                                onClick={() => handleOrderDetailsClick(order)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Изменить статус">
                              <IconButton 
                                size="small"
                                color="primary"
                                onClick={() => handleStatusUpdateClick(order)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                              <IconButton 
                                size="small"
                                color="error"
                                onClick={() => handleDeleteOrderClick(order)}
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
                          Заказы не найдены
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
              count={filteredAndSortedOrders.length}
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
      
      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                Заказ {selectedOrder.orderNumber || `#${selectedOrder.id.slice(0, 8)}`}
                <Typography variant="body2" color="text.secondary">
                  от {formatDate(selectedOrder.date)}
                </Typography>
              </Box>
              <Chip 
                icon={statusColors[selectedOrder.status]?.icon}
                label={orderStatuses.find(s => s.value === selectedOrder.status)?.label || selectedOrder.status}
                color={statusColors[selectedOrder.status]?.color || 'default'}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={detailsTab} onChange={handleChangeDetailsTab} aria-label="order details tabs">
                  <Tab label="Общая информация" icon={<InfoIcon />} iconPosition="start" />
                  <Tab label="Детали заказа" icon={<ShoppingCartIcon />} iconPosition="start" />
                  <Tab label="История статусов" icon={<EventNoteIcon />} iconPosition="start" />
                </Tabs>
              </Box>
              
              {/* General Info Tab */}
              {detailsTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1 }} />
                          Информация о клиенте
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="ФИО" 
                              secondary={userDetails?.fullName || selectedOrder.customer?.name || 'Н/Д'} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <EmailIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Email" 
                              secondary={userDetails?.email || selectedOrder.customer?.email || 'Н/Д'} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <PhoneIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Телефон" 
                              secondary={userDetails?.phone || selectedOrder.customer?.phone || 'Н/Д'} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <LocationOnIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Адрес" 
                              secondary={selectedOrder.deliveryAddress || userDetails?.address || 'Н/Д'} 
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoneyIcon sx={{ mr: 1 }} />
                          Финансовая информация
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <AttachMoneyIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Сумма заказа" 
                              secondary={formatPrice(selectedOrder.totalPrice)} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <PaymentIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Способ оплаты" 
                              secondary={selectedOrder.paymentMethod || 'Н/Д'} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <ReceiptIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Статус оплаты" 
                              secondary={selectedOrder.paymentStatus || 'Н/Д'} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CalendarMonthIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Дата заказа" 
                              secondary={formatDate(selectedOrder.date)} 
                            />
                                                    </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <DirectionsCarIcon sx={{ mr: 1 }} />
                          Информация об автомобиле
                        </Typography>
                        
                        {carDetails ? (
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Box 
                                sx={{ 
                                  height: 150, 
                                  borderRadius: 1, 
                                  overflow: 'hidden',
                                  mb: 2 
                                }}
                              >
                                <img 
                                  src={carDetails.images?.[0] || '/images/car-placeholder.jpg'} 
                                  alt={carDetails.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={8}>
                              <Typography variant="h6" gutterBottom>
                                {carDetails.name} {carDetails.model}
                              </Typography>
                              
                              <List dense>
                                <ListItem>
                                  <ListItemIcon>
                                    <AttachMoneyIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Базовая цена" 
                                    secondary={formatPrice(carDetails.price)} 
                                  />
                                </ListItem>
                                
                                <ListItem>
                                  <ListItemIcon>
                                    <CalendarMonthIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Год выпуска" 
                                    secondary={carDetails.year} 
                                  />
                                </ListItem>
                                
                                {carDetails.specs && (
                                  <ListItem>
                                    <ListItemIcon>
                                      <SpeedIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary="Двигатель" 
                                      secondary={`${carDetails.specs.engine}, ${carDetails.specs.power}`} 
                                    />
                                  </ListItem>
                                )}
                              </List>
                            </Grid>
                          </Grid>
                        ) : (
                          <Typography color="text.secondary">
                            Данные об автомобиле недоступны или автомобиль был удален.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <EventNoteIcon sx={{ mr: 1 }} />
                          Процесс выполнения заказа
                        </Typography>
                        
                        {selectedOrder.status !== 'cancelled' ? (
                          <Stepper 
                            activeStep={getActiveStep(selectedOrder.status)} 
                            alternativeLabel
                            sx={{ mt: 2 }}
                          >
                            {orderSteps.map((label, index) => (
                              <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                              </Step>
                            ))}
                          </Stepper>
                        ) : (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            Заказ был отменен.
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
              
              {/* Order Details Tab */}
              {detailsTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Детали заказа
                        </Typography>
                        
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Наименование</TableCell>
                                  <TableCell align="right">Цена</TableCell>
                                  <TableCell align="right">Количество</TableCell>
                                  <TableCell align="right">Сумма</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedOrder.items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell align="right">{formatPrice(item.price)}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">{formatPrice(item.price * item.quantity)}</TableCell>
                                  </TableRow>
                                ))}
                                
                                {/* Custom options if available */}
                                {selectedOrder.options && selectedOrder.options.length > 0 && (
                                  <>
                                    <TableRow>
                                      <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                                        Дополнительные опции
                                      </TableCell>
                                    </TableRow>
                                    
                                    {selectedOrder.options.map((option, index) => (
                                      <TableRow key={`option-${index}`}>
                                        <TableCell>{option.name}</TableCell>
                                        <TableCell align="right">{formatPrice(option.price)}</TableCell>
                                        <TableCell align="right">1</TableCell>
                                        <TableCell align="right">{formatPrice(option.price)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </>
                                )}
                                
                                {/* Subtotal, tax, etc. */}
                                <TableRow>
                                  <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                                    Подитог:
                                  </TableCell>
                                  <TableCell align="right">{formatPrice(selectedOrder.subtotal || selectedOrder.totalPrice)}</TableCell>
                                </TableRow>
                                
                                {selectedOrder.tax && (
                                  <TableRow>
                                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                                      НДС (20%):
                                    </TableCell>
                                    <TableCell align="right">{formatPrice(selectedOrder.tax)}</TableCell>
                                  </TableRow>
                                )}
                                
                                {selectedOrder.discount && (
                                  <TableRow>
                                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                                      Скидка:
                                    </TableCell>
                                    <TableCell align="right">-{formatPrice(selectedOrder.discount)}</TableCell>
                                  </TableRow>
                                )}
                                
                                <TableRow>
                                  <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                                    Итого:
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                    {formatPrice(selectedOrder.totalPrice)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography color="text.secondary">
                            Детальная информация о составе заказа отсутствует.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {selectedOrder.notes && (
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Примечания к заказу
                          </Typography>
                          <Typography variant="body2">
                            {selectedOrder.notes}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}
              
              {/* Status History Tab */}
              {detailsTab === 2 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      История статусов заказа
                    </Typography>
                    
                    {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                      <List>
                        {selectedOrder.statusHistory.map((status, index) => (
                          <ListItem key={index} divider={index !== selectedOrder.statusHistory.length - 1}>
                            <ListItemIcon>
                              {statusColors[status.status]?.icon || <InfoIcon />}
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="subtitle1">
                                    {orderStatuses.find(s => s.value === status.status)?.label || status.status}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDate(status.date)}
                                  </Typography>
                                </Box>
                              }
                              secondary={status.note && status.note}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography color="text.secondary">
                        История изменений статусов заказа недоступна.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Закрыть</Button>
              <Button 
                color="primary" 
                variant="contained"
                onClick={() => handleStatusUpdateClick(selectedOrder)}
              >
                Изменить статус
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Status Update Dialog */}
      <Dialog
        open={statusUpdateOpen}
        onClose={handleCloseStatusUpdate}
      >
        <DialogTitle>Изменить статус заказа</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-update-label">Статус</InputLabel>
            <Select
              labelId="status-update-label"
              value={newStatus}
              label="Статус"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {orderStatuses.map(status => (
                <MenuItem key={status.value} value={status.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {statusColors[status.value]?.icon && (
                      <Box component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        {statusColors[status.value].icon}
                      </Box>
                    )}
                    {status.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            margin="normal"
            label="Примечание к статусу"
            multiline
            rows={3}
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Добавьте комментарий к изменению статуса заказа..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusUpdate}>Отмена</Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained" 
            color="primary"
          >
            Обновить статус
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить заказ {selectedOrder?.orderNumber || (selectedOrder && `#${selectedOrder.id.slice(0, 8)}`)}?
            Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Отмена</Button>
          <Button 
            onClick={handleDeleteOrder} 
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

export default AdminOrders;