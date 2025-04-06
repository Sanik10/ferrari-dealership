import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Slider, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Paper,
  Divider,
  Button,
  Chip,
  InputAdornment,
  IconButton,
  Collapse,
  Card,
  CardMedia,
  useMediaQuery
} from '@mui/material';
import CarCard from '../components/CarCard';
import { carAPI } from '../services/api';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, styled } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';

// Стилизованные компоненты
const FerrariSlider = styled(Slider)(() => ({
  color: '#FF2800',
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px rgba(255, 40, 0, 0.16)`,
    },
    '&.Mui-active': {
      boxShadow: `0px 0px 0px 14px rgba(255, 40, 0, 0.16)`,
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
}));

const FilterPaper = styled(Paper)(() => ({
  backgroundColor: 'rgba(30, 30, 30, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
}));

// Стилизованный Select компонент для унификации
const FerrariSelect = styled(Select)(() => ({
  color: 'white',
  borderRadius: '6px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#FF2800',
  },
  '& .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  }
}));

// Стилизованный TextField
const FerrariTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    borderRadius: '6px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '6px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FF2800',
    }
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#FF2800',
  }
}));

// Стилизованная FormControl
const FerrariFormControl = styled(FormControl)(() => ({
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#FF2800',
  }
}));

const Catalog = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchParams = useSearchParams()[0];
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      
      let response;
      if (searchParams.has('query')) {
        const searchQuery = searchParams.get('query');
        setSearchValue(searchQuery);
        response = await carAPI.searchCars(searchQuery);
      } else {
        response = await carAPI.getAllCars();
      }
      
      console.log('Ответ от API:', response);
      
      if (response) {
        // Проверяем формат ответа
        let carsData = [];
        
        if (Array.isArray(response)) {
          carsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          carsData = response.data;
        } else {
          console.error('Неожиданный формат ответа API:', response);
        }
        
        setCars(carsData);
        
        // Определяем максимальную цену для фильтра
        if (carsData.length > 0) {
          const highestPrice = Math.max(...carsData.map(car => car.price));
          setMaxPrice(highestPrice);
          setPriceRange([0, highestPrice]);
        }
      } else {
        setCars([]);
      }
    } catch (error) {
      console.error('Error loading cars:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Подсчет активных фильтров
    let count = 0;
    if (brand) count++;
    if (year) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (search) count++;
    setActiveFilters(count);
  }, [brand, year, priceRange, search, maxPrice]);

  // Фильтрация автомобилей
  const filteredCars = Array.isArray(cars) 
    ? cars.filter(car => {
        const matchesSearch = search 
          ? `${car.brand} ${car.model} ${car.description || ''}`.toLowerCase().includes(search.toLowerCase())
          : true;
        
        return (
          (!brand || car.brand === brand) &&
          (!year || car.year.toString() === year) &&
          car.price >= priceRange[0] &&
          car.price <= priceRange[1] &&
          matchesSearch
        );
      })
    : [];

  // Сортировка автомобилей
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  // Получаем уникальные бренды и годы для фильтров
  const uniqueBrands = [...new Set(cars.map(car => car.brand))];
  const uniqueYears = [...new Set(cars.map(car => car.year))].sort((a, b) => b - a);

  const resetFilters = () => {
    setBrand('');
    setYear('');
    setPriceRange([0, maxPrice]);
    setSearch('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url("/images/ferrari-catalog-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        pt: 12,
        pb: 8
      }}
    >
      <Container>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="overline" 
            component="div" 
            sx={{ 
              color: '#FF2800', 
              fontWeight: 'bold',
              letterSpacing: 2,
              mb: 1
            }}
          >
            FERRARI MOSCOW
          </Typography>
          
          <Typography 
            variant="h3" 
            component={motion.h3}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            КАТАЛОГ АВТОМОБИЛЕЙ
          </Typography>
          
          <Divider 
            sx={{ 
              width: '80px', 
              mx: 'auto', 
              my: 3,
              borderColor: '#FF2800',
              borderWidth: 2
            }} 
          />
          
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              opacity: 0.9 
            }}
          >
            Выберите свой идеальный автомобиль из нашей коллекции
          </Typography>
        </Box>
        
        <FilterPaper 
          elevation={3}
          sx={{ 
            mb: 6, 
            p: 3, 
            overflow: 'hidden'
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1, color: '#FF2800' }} />
              <Typography variant="h6" sx={{ color: 'white' }}>
                Фильтры
                {activeFilters > 0 && (
                  <Chip 
                    size="small" 
                    label={activeFilters} 
                    sx={{ ml: 1, bgcolor: '#FF2800', color: 'white', borderRadius: '4px' }}
                  />
                )}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {activeFilters > 0 && (
                <Button 
                  size="small"
                  onClick={resetFilters}
                  sx={{ 
                    mr: 2, 
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      color: '#FF2800'
                    },
                    borderRadius: '6px'
                  }}
                  startIcon={<ClearIcon />}
                >
                  Сбросить
                </Button>
              )}
              
              <IconButton 
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '6px'
                }}
              >
                {showFilters ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Box>
          </Box>
          
          <Collapse in={showFilters}>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FerrariTextField
                    fullWidth
                    placeholder="Поиск по марке, модели или описанию"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: search ? (
                        <InputAdornment position="end">
                          <IconButton 
                            size="small" 
                            onClick={() => setSearch('')}
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '4px'
                            }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FerrariFormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Марка</InputLabel>
                    <FerrariSelect 
                      value={brand} 
                      onChange={(e) => setBrand(e.target.value)}
                      startAdornment={<DirectionsCarIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.8)' }} />}
                    >
                      <MenuItem value="">Все</MenuItem>
                      {uniqueBrands.map(brand => (
                        <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                      ))}
                    </FerrariSelect>
                  </FerrariFormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FerrariFormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Год выпуска</InputLabel>
                    <FerrariSelect 
                      value={year} 
                      onChange={(e) => setYear(e.target.value)}
                      startAdornment={<CalendarTodayIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.8)' }} />}
                    >
                      <MenuItem value="">Все годы</MenuItem>
                      {uniqueYears.map(year => (
                        <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                      ))}
                    </FerrariSelect>
                  </FerrariFormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.8)' }} />
                    <Typography sx={{ color: 'white' }}>
                      Цена: {new Intl.NumberFormat('ru-RU', { 
                        style: 'currency', 
                        currency: 'RUB',
                        maximumFractionDigits: 0
                      }).format(priceRange[0])} - {new Intl.NumberFormat('ru-RU', { 
                        style: 'currency', 
                        currency: 'RUB',
                        maximumFractionDigits: 0
                      }).format(priceRange[1])}
                    </Typography>
                  </Box>
                  <FerrariSlider
                    value={priceRange}
                    onChange={(_, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={maxPrice}
                    valueLabelFormat={(value) => 
                      new Intl.NumberFormat('ru-RU', { 
                        style: 'currency', 
                        currency: 'RUB',
                        maximumFractionDigits: 0
                      }).format(value)
                    }
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <FerrariFormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Сортировать</InputLabel>
                    <FerrariSelect
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      startAdornment={<SortIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.8)' }} />}
                    >
                      <MenuItem value="newest">Сначала новые</MenuItem>
                      <MenuItem value="oldest">Сначала старые</MenuItem>
                      <MenuItem value="price_asc">По возрастанию цены</MenuItem>
                      <MenuItem value="price_desc">По убыванию цены</MenuItem>
                    </FerrariSelect>
                  </FerrariFormControl>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </FilterPaper>

        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              py: 8,
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <CircularProgress size={60} sx={{ color: '#FF2800', mb: 2 }} />
            <Typography variant="h6" color="rgba(255, 255, 255, 0.7)">
              Загрузка автомобилей...
            </Typography>
          </Box>
        ) : (
          <>
            <Box 
              sx={{ 
                mb: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                px: 2,
                py: 1,
                borderRadius: '8px',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography>
                Найдено автомобилей: <span style={{ color: '#FF2800', fontWeight: 'bold' }}>{sortedCars.length}</span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SpeedIcon sx={{ mr: 1, color: '#FF2800' }} />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Уникальные предложения для истинных ценителей Ferrari
                </Typography>
              </Box>
            </Box>
            
            <AnimatePresence>
              {sortedCars.length > 0 ? (
                <Grid container spacing={4}>
                  {sortedCars.map((car, index) => (
                    <Grid 
                      item 
                      key={car.id} 
                      xs={12} 
                      sm={6} 
                      md={4}
                      component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <CarCard car={car} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <FilterPaper 
                  sx={{ 
                    py: 8, 
                    textAlign: 'center',
                    borderRadius: '8px',
                    p: 4
                  }}
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <DirectionsCarIcon sx={{ fontSize: 60, color: '#FF2800', mb: 2 }} />
                  <Typography variant="h5" color="white" gutterBottom>
                    По вашему запросу ничего не найдено
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" paragraph>
                    Попробуйте изменить параметры поиска или связаться с нами для получения 
                    индивидуального предложения
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={resetFilters}
                    startIcon={<ClearIcon />}
                    sx={{
                      backgroundColor: '#FF2800',
                      borderRadius: '6px',
                      '&:hover': {
                        backgroundColor: '#CC2000',
                      }
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </FilterPaper>
              )}
            </AnimatePresence>
          </>
        )}
        
        {!loading && sortedCars.length > 0 && (
          <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Не нашли что искали?
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.7)" paragraph>
              Свяжитесь с нами, и мы поможем подобрать автомобиль по вашим предпочтениям 
              или найдем редкую модель Ferrari специально для вас.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{
                backgroundColor: '#FF2800',
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#CC2000',
                },
                py: 1.5,
                px: 4,
                mt: 2
              }}
            >
              Связаться с менеджером
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Catalog;