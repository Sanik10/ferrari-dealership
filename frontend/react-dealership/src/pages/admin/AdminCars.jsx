import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';

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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ColorLensIcon from '@mui/icons-material/ColorLens';

// Components
import EditCarDialog from '../../components/EditCarDialog';

// API
import { carAPI } from '../../services/api';

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

const AdminCars = () => {
  // State variables
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', or 'delete'
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filter, setFilter] = useState({
    category: 'all',
    availability: 'all'
  });
  const [sort, setSort] = useState({
    field: 'name',
    direction: 'asc'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCar, setSelectedCar] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Категории автомобилей для фильтрации в таблице
  const carCategoryOptions = [
    { value: 'all', label: 'Все категории' },
    { value: 'sport', label: 'Sport' },
    { value: 'gt', label: 'GT' },
    { value: 'hypercar', label: 'Hypercar' },
    { value: 'classic', label: 'Classic' },
    { value: 'limited_edition', label: 'Limited Edition' }
  ];
  
  // Fetch cars on component mount
  useEffect(() => {
    console.log("AdminCars компонент загружен");
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("AdminCars - Пользователь:", user);
    console.log("AdminCars - Роль пользователя:", user?.role);
    
    fetchCars();
  }, []);
  
  // Fetch cars from API
  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getAllCars();
      console.log("Response from getAllCars:", response);
      
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
      console.error('Error fetching cars:', error);
      setError('Не удалось загрузить автомобили. Пожалуйста, попробуйте позже.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle dialog open for adding a car
  const handleAddCarClick = () => {
    console.log("Нажата кнопка 'Добавить автомобиль'");
    setDialogMode('add');
    setSelectedCar(null);
    setOpenDialog(true);
  };
  
  // Handle dialog open for editing a car
  const handleEditCarClick = (car) => {
    console.log("Редактирование автомобиля:", car);
    setDialogMode('edit');
    setSelectedCar(car);
    setOpenDialog(true);
  };
  
  // Handle dialog open for deleting a car
  const handleDeleteCarClick = (car) => {
    setSelectedCar(car);
    setConfirmDeleteOpen(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle close delete confirmation
  const handleCloseDeleteConfirm = () => {
    setConfirmDeleteOpen(false);
  };
  
  // Handle save car from EditCarDialog
  const handleSaveCar = async (carData) => {
    console.log("Сохранение автомобиля в режиме:", dialogMode);
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (dialogMode === 'add') {
        console.log("Создание нового автомобиля...");
        
        // Проверяем, содержит ли carData изображения
        const hasImages = carData.has('images') && 
          Array.from(carData.getAll('images')).filter(f => f instanceof File).length > 0;
        
        if (hasImages) {
          console.log("Обнаружены изображения для нового автомобиля");
          
          // Сначала создаем объект FormData только с данными автомобиля (без изображений)
          const carFormData = new FormData();
          
          // Копируем все поля, кроме 'images' в новый FormData
          for (const [key, value] of carData.entries()) {
            if (key !== 'images') {
              carFormData.append(key, value);
            }
          }
          
          console.log("Шаг 1: Создание автомобиля без изображений");
          const createResponse = await carAPI.createCar(carFormData);
          console.log("Автомобиль создан:", createResponse);
          
          // Создаем новый FormData только для изображений
          const imagesFormData = new FormData();
          
          // Добавляем все файлы из оригинального FormData
          const imageFiles = Array.from(carData.getAll('images'))
            .filter(f => f instanceof File);
          
          console.log(`Шаг 2: Загрузка ${imageFiles.length} изображений для автомобиля ${createResponse.car.id}`);
          
          // Добавляем файлы
          imageFiles.forEach(file => {
            imagesFormData.append('images', file);
          });
          
          // Если указан mainImageIndex, добавляем его
          if (carData.has('mainImageIndex')) {
            imagesFormData.append('mainImageIndex', carData.get('mainImageIndex'));
          }
          
          // Отправляем изображения отдельным запросом
          const uploadResponse = await carAPI.uploadImages(createResponse.car.id, imagesFormData);
          console.log("Результат загрузки изображений:", uploadResponse);
          
          result = uploadResponse; // Используем результат с новыми изображениями
        } else {
          console.log("Создание автомобиля без изображений");
          // Если нет изображений, просто создаем автомобиль
          result = await carAPI.createCar(carData);
        }
      } else if (dialogMode === 'edit' && selectedCar) {
        console.log(`Обновление автомобиля ${selectedCar.id}`);
        
        // Проверяем, содержит ли carData новые изображения
        const hasNewImages = carData.has('images') && 
          Array.from(carData.getAll('images')).filter(f => f instanceof File).length > 0;
        
        if (hasNewImages) {
          console.log("Обнаружены новые изображения для обновления");
          
          // Сначала создаем объект FormData только с данными автомобиля (без изображений)
          const carFormData = new FormData();
          
          // Копируем все поля, кроме 'images' в новый FormData
          for (const [key, value] of carData.entries()) {
            if (key !== 'images') {
              carFormData.append(key, value);
            }
          }
          
          console.log("Шаг 1: Обновление автомобиля без изображений");
          const updateResponse = await carAPI.updateCar(selectedCar.id, carFormData);
          console.log("Автомобиль обновлен:", updateResponse);
          
          // Создаем новый FormData только для изображений
          const imagesFormData = new FormData();
          
          // Добавляем все файлы из оригинального FormData
          const imageFiles = Array.from(carData.getAll('images'))
            .filter(f => f instanceof File);
          
          console.log(`Шаг 2: Загрузка ${imageFiles.length} изображений для автомобиля ${selectedCar.id}`);
          
          // Добавляем файлы
          imageFiles.forEach(file => {
            imagesFormData.append('images', file);
          });
          
          // Если указан mainImageIndex, добавляем его
          if (carData.has('mainImageIndex')) {
            imagesFormData.append('mainImageIndex', carData.get('mainImageIndex'));
          }
          
          // Отправляем изображения отдельным запросом
          const uploadResponse = await carAPI.uploadImages(selectedCar.id, imagesFormData);
          console.log("Результат загрузки изображений:", uploadResponse);
          
          result = uploadResponse; // Используем результат с новыми изображениями
        } else {
          console.log("Обновление автомобиля без изображений");
          // Если нет новых изображений, просто обновляем автомобиль
          result = await carAPI.updateCar(selectedCar.id, carData);
        }
      }
      
      // Обновляем список после успешного сохранения
      if (result) {
        fetchCars();
        setSnackbar({
          open: true,
          message: dialogMode === 'add' 
            ? "Автомобиль успешно добавлен" 
            : "Автомобиль успешно обновлен",
          severity: "success"
        });
      }
    } catch (err) {
      console.error("Ошибка при сохранении автомобиля:", err);
      setSnackbar({
        open: true,
        message: `Ошибка: ${err.response?.data?.error || err.message}`,
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false);
    }
  };
  
  // Handle delete car
  const handleDeleteCar = async () => {
    try {
      await carAPI.deleteCar(selectedCar.id);
      
      setSnackbar({
        open: true,
        message: 'Автомобиль успешно удален',
        severity: 'success'
      });
      
      fetchCars();
      setConfirmDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting car:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при удалении автомобиля',
        severity: 'error'
      });
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value
    }));
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    setSort(prevSort => ({
      field,
      direction: prevSort.field === field && prevSort.direction === 'asc' ? 'desc' : 'asc'
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
  
  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prevState => ({
      ...prevState,
      open: false
    }));
  };
  
  // Filter and sort cars
  const filteredAndSortedCars = Array.isArray(cars) 
    ? cars.filter(car => {
        // Filter by search query
        const matchesSearch = 
          (car.brand && car.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (car.model && car.model.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Filter by category
        const matchesCategory = filter.category === 'all' || car.category === filter.category;
        
        // Filter by availability
        const matchesAvailability = filter.availability === 'all' ||
                                  (filter.availability === 'available' && car.available) ||
                                  (filter.availability === 'unavailable' && !car.available);
        
        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        const fieldA = sort.field === 'price' ? parseFloat(a[sort.field]) : a[sort.field];
        const fieldB = sort.field === 'price' ? parseFloat(b[sort.field]) : b[sort.field];
        
        if (fieldA < fieldB) return sort.direction === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [];
  
  // Paginate cars
  const paginatedCars = filteredAndSortedCars.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
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
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Управление автомобилями
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Управление автомобилями
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddCarClick}
        >
          Добавить автомобиль
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : cars.length > 0 ? (
        <Grid container spacing={3}>
          {cars.map((car) => (
            <Grid item xs={12} md={4} key={car.id}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {car.brand} {car.model}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {car.year} - {car.price ? `${car.price.toLocaleString()} ₽` : 'Цена по запросу'}
                </Typography>
                <Box sx={{ display: 'flex', mt: 'auto', justifyContent: 'flex-end' }}>
                  <Button size="small" color="primary" sx={{ mr: 1 }} onClick={() => handleEditCarClick(car)}>
                    Редактировать
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteCarClick(car)}>
                    Удалить
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Автомобили не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Добавьте первый автомобиль, нажав на кнопку "Добавить автомобиль".
          </Typography>
        </Paper>
      )}
      
      {/* Диалоговое окно для подтверждения удаления */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы действительно хотите удалить автомобиль {selectedCar?.brand} {selectedCar?.model}?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Это действие невозможно отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Отмена</Button>
          <Button onClick={handleDeleteCar} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* EditCarDialog Component */}
      <EditCarDialog
        open={openDialog}
        onClose={handleCloseDialog}
        car={selectedCar}
        onSave={handleSaveCar}
        isLoading={isSubmitting}
      />
      
      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminCars;