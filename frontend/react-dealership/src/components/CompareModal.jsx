import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Grid, 
  Card, 
  CardMedia, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow,
  Button,
  IconButton,
  Box,
  Tabs,
  Tab,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HistoryIcon from '@mui/icons-material/History';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice, formatNumber } from '../utils/formatters';

const CompareModal = ({ open, onClose, cars = [], onAddCar }) => {
  const [selectedCars, setSelectedCars] = useState(cars || []);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // Обновление автомобилей при изменении props
  useEffect(() => {
    setSelectedCars(cars);
  }, [cars]);
  
  // Категории спецификаций для сравнения
  const specCategories = [
    { 
      id: 'basic', 
      label: 'Основное', 
      icon: <CompareArrowsIcon />,
      specs: [
        { label: 'Марка', value: 'brand' },
        { label: 'Модель', value: 'model' },
        { label: 'Год выпуска', value: 'year' },
        { label: 'Цвет кузова', value: 'exteriorColor' },
        { label: 'Цвет салона', value: 'interiorColor' },
        { label: 'Материал салона', value: 'interiorMaterial' },
        { label: 'Категория', value: 'category', format: (value) => 
          value ? value.replace('_', ' ').toUpperCase() : 'Не указано'
        },
        { label: 'Специальная серия', value: 'specialSeries' },
      ]
    },
    { 
      id: 'performance', 
      label: 'Динамика', 
      icon: <SpeedIcon />,
      specs: [
        { label: 'Двигатель', value: 'engine' },
        { label: 'Мощность', value: 'horsepower', format: (value) => value ? `${value} л.с.` : 'Не указано' },
        { label: 'Разгон 0-100 км/ч', value: 'acceleration', format: (value) => value ? `${value} сек.` : 'Не указано' },
        { label: 'Максимальная скорость', value: 'maxSpeed', format: (value) => value ? `${value} км/ч` : 'Не указано' },
        { label: 'Трансмиссия', value: 'transmission' },
        { label: 'Привод', value: 'driveType' },
      ]
    },
    { 
      id: 'economy', 
      label: 'Расходы', 
      icon: <MonetizationOnIcon />,
      specs: [
        { label: 'Цена', value: 'price', format: (value) => formatPrice(value) },
        { label: 'Тип топлива', value: 'fuelType' },
        { label: 'Расход топлива', value: 'fuelConsumption', format: (value) => value ? `${value} л/100км` : 'Не указано' },
        { label: 'Стоимость аренды', value: 'rentalPricePerDay', format: (value) => value ? `${formatPrice(value)}/день` : 'Недоступно' },
      ]
    },
    { 
      id: 'other', 
      label: 'Прочее', 
      icon: <SettingsIcon />,
      specs: [
        { label: 'VIN', value: 'vin' },
        { label: 'Пробег', value: 'mileage', format: (value) => value ? `${formatNumber(value)} км` : '0 км' },
        { label: 'Колеса', value: 'wheels' },
        { label: 'Карбоно-керамические тормоза', value: 'carbonCeramic', format: (value) => value ? 'Да' : 'Нет' },
        { label: 'Сертификат подлинности', value: 'certificateOfAuthenticity', format: (value) => value ? 'Да' : 'Нет' },
      ]
    }
  ];
  
  // Обработка смены вкладки
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };
  
  // Удаление автомобиля из сравнения
  const handleRemoveCar = (index) => {
    const newSelectedCars = [...selectedCars];
    newSelectedCars.splice(index, 1);
    setSelectedCars(newSelectedCars);
  };
  
  // Получение текущей категории спецификаций
  const currentCategory = specCategories[tabValue] || specCategories[0];
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
          color: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', mr: 2 }}>
            Сравнение автомобилей
          </Typography>
          <Chip 
            label={`${selectedCars.length} ${selectedCars.length === 1 ? 'автомобиль' : selectedCars.length >= 2 && selectedCars.length <= 4 ? 'автомобиля' : 'автомобилей'}`} 
            size="small" 
            sx={{ bgcolor: 'primary.main', color: 'white' }} 
          />
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {selectedCars.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Вы не выбрали автомобили для сравнения
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                onClose();
                if (onAddCar) onAddCar();
              }}
            >
              Выбрать автомобили
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Вкладки категорий */}
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .Mui-selected': { color: 'white' },
                  '& .MuiTabs-indicator': { bgcolor: 'primary.main' }
                }}
              >
                {specCategories.map((category) => (
                  <Tab 
                    key={category.id} 
                    label={category.label} 
                    icon={category.icon} 
                    iconPosition="start"
                  />
                ))}
              </Tabs>
              
              {/* Сетка автомобилей */}
              <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                <Grid container spacing={3}>
                  {selectedCars.map((car, index) => (
                    <Grid item xs={12} md={selectedCars.length > 1 ? 6 : 12} lg={selectedCars.length > 2 ? 4 : selectedCars.length > 1 ? 6 : 12} key={car.id || index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <Card sx={{ 
                          bgcolor: 'rgba(255,255,255,0.05)', 
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative'
                        }}>
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height={isSmallScreen ? 180 : 220}
                              image={car.mainImage ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${car.mainImage}` : 
                                     car.images?.[0] ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${car.images[0]}` : 
                                     '/images/car-placeholder.jpg'}
                              alt={`${car.brand} ${car.model}`}
                              sx={{ objectFit: 'cover' }}
                            />
                            <IconButton 
                              sx={{ 
                                position: 'absolute', 
                                top: 8, 
                                right: 8, 
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                              }}
                              onClick={() => handleRemoveCar(index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          
                          <Box sx={{ p: 2.5 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                              {car.brand} {car.model}
                              {car.specialSeries && ` ${car.specialSeries}`}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                              <Chip 
                                label={car.year} 
                                size="small" 
                                sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }} 
                              />
                              {car.category && (
                                <Chip 
                                  label={car.category.replace('_', ' ').toUpperCase()} 
                                  size="small" 
                                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} 
                                />
                              )}
                            </Box>
                            
                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                            
                            <Table size="small">
                              <TableBody>
                                {currentCategory.specs.map((spec) => (
                                  <TableRow key={spec.value}>
                                    <TableCell 
                                      component="th" 
                                      scope="row"
                                      sx={{ 
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.7)',
                                        pl: 0,
                                        py: 1,
                                        fontSize: '0.875rem'
                                      }}
                                    >
                                      {spec.label}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{ 
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        fontWeight: 'medium',
                                        pr: 0,
                                        py: 1,
                                        fontSize: '0.875rem'
                                      }}
                                    >
                                      {spec.format 
                                        ? spec.format(car[spec.value]) 
                                        : car[spec.value] || 'Не указано'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                          
                          <Box sx={{ mt: 'auto', p: 2, pt: 0 }}>
                            <Button
                              variant="outlined"
                              fullWidth
                              component={motion.button}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                onClose();
                                window.location.href = `/car/${car.id}`;
                              }}
                              sx={{ 
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.3)',
                                '&:hover': {
                                  borderColor: 'white',
                                  backgroundColor: 'rgba(255,255,255,0.05)'
                                }
                              }}
                            >
                              Подробнее
                            </Button>
                          </Box>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                  
                  {/* Карточка добавления автомобиля */}
                  {selectedCars.length < 3 && onAddCar && (
                    <Grid item xs={12} md={selectedCars.length > 0 ? 6 : 12} lg={selectedCars.length > 1 ? 4 : selectedCars.length > 0 ? 6 : 12}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: selectedCars.length * 0.2 }}
                      >
                        <Card sx={{ 
                          bgcolor: 'rgba(255,255,255,0.02)', 
                          borderRadius: '12px',
                          border: '2px dashed rgba(255,255,255,0.2)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          p: 4,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderColor: 'rgba(255,255,255,0.3)',
                          }
                        }}
                        onClick={() => {
                          onClose();
                          onAddCar();
                        }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Box 
                              sx={{ 
                                width: 80, 
                                height: 80, 
                                borderRadius: '50%', 
                                bgcolor: 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                mx: 'auto'
                              }}
                            >
                              <CompareArrowsIcon fontSize="large" sx={{ color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              Добавить автомобиль
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Выберите ещё один автомобиль для сравнения (максимум 3)
                            </Typography>
                          </Box>
                        </Card>
                      </motion.div>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompareModal; 