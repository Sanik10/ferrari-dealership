import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Tabs,
  Tab,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Typography,
  Switch,
  FormControlLabel,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import SpeedIcon from "@mui/icons-material/Speed";
import InfoIcon from "@mui/icons-material/Info";

// Категории автомобилей Ferrari
const CAR_CATEGORIES = [
  { value: "sport", label: "Sport" },
  { value: "gt", label: "GT" },
  { value: "hypercar", label: "Hypercar" },
  { value: "classic", label: "Classic" },
  { value: "limited_edition", label: "Limited Edition" },
];

// Популярные марки автомобилей (премиум-сегмент)
const CAR_BRANDS = [
  { value: "Ferrari", label: "Ferrari" },
  { value: "Lamborghini", label: "Lamborghini" },
  { value: "Porsche", label: "Porsche" },
  { value: "Aston Martin", label: "Aston Martin" },
  { value: "Bentley", label: "Bentley" },
  { value: "Rolls-Royce", label: "Rolls-Royce" },
  { value: "Bugatti", label: "Bugatti" },
  { value: "Maserati", label: "Maserati" },
  { value: "McLaren", label: "McLaren" },
  { value: "Mercedes-Benz", label: "Mercedes-Benz" },
  { value: "BMW", label: "BMW" },
  { value: "Audi", label: "Audi" },
  { value: "Jaguar", label: "Jaguar" },
  { value: "Tesla", label: "Tesla" },
];

// Типы трансмиссий
const TRANSMISSION_TYPES = [
  { value: "Автоматическая", label: "Автоматическая" },
  { value: "Механическая", label: "Механическая" },
  { value: "Роботизированная DCT", label: "Роботизированная DCT" },
  { value: "F1-DCT", label: "F1-DCT" },
];

// Типы топлива
const FUEL_TYPES = [
  { value: "Бензин", label: "Бензин" },
  { value: "Дизель", label: "Дизель" },
  { value: "Гибрид", label: "Гибрид" },
  { value: "Электро", label: "Электро" },
];

// Типы привода
const DRIVE_TYPES = [
  { value: "Задний", label: "Задний" },
  { value: "Полный", label: "Полный" },
];

const EditCarDialog = ({ open, onClose, car, onSave, isLoading = false }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    vin: "",
    mileage: 0,
    description: "",
    images: [],
    history: "",
    engine: "",
    transmission: "",
    horsepower: "",
    acceleration: "",
    fuelType: "",
    fuelConsumption: "",
    features: [],

    // Новые поля из обновленной модели
    category: "",
    maxSpeed: "",
    specialSeries: "",
    exteriorColor: "",
    interiorColor: "",
    interiorMaterial: "",
    wheels: "",
    rentalAvailable: false,
    rentalPricePerDay: "",
    testDriveAvailable: false,
    driveType: "",
    carbonCeramic: false,
    carLocation: "",
    certificateOfAuthenticity: false,

    available: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [newFeature, setNewFeature] = useState("");
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [error, setError] = useState("");

  // Инициализация формы данными автомобиля
  useEffect(() => {
    if (car) {
      console.log("Инициализация формы с данными автомобиля:", car);
      
      if (car.images) {
        console.log("Детальная информация об изображениях:");
        console.log("- Тип images:", typeof car.images);
        console.log("- Является массивом:", Array.isArray(car.images));
        console.log("- Длина:", car.images?.length || 0);
        console.log("- Содержимое:", car.images);
        console.log("- mainImage:", car.mainImage);
      }
      
      const baseUrl =
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:5001";

      // Используем функциональную форму обновления состояния, чтобы избежать зависимости от formData
      setFormData(prevFormData => ({
        ...prevFormData,
        ...car,
        features: car.features || [],
      }));

      // Сохраняем оригинальные пути к изображениям для последующей отправки
      if (car.images && Array.isArray(car.images)) {
        console.log("Найдены изображения автомобиля:", car.images);
        setExistingImages(car.images);
      } else {
        console.log("У автомобиля нет изображений, устанавливаем пустой массив");
        setExistingImages([]);
      }

      // Подготовка изображений для предпросмотра
      if (car.images && Array.isArray(car.images) && car.images.length > 0) {
        console.log("Обработка изображений автомобиля:", car.images);
        
        // Создаем корректные URL для предпросмотра
        const imageUrls = car.images.map((image) => {
          if (!image) return null;
          
          // Если это уже полный URL
          if (image.startsWith('http') || image.startsWith('blob:')) {
            return image;
          }
          
          // Если начинается с /uploads
          if (image.startsWith('/uploads/')) {
            return `${baseUrl}${image}`;
          }
          
          // Другие случаи - добавляем baseUrl
          return `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`;
        }).filter(url => url); // Удаляем null значения
        
        console.log("Созданные URL для предпросмотра:", imageUrls);
        setPreviewImages(imageUrls);

        // Установка основного изображения
        if (car.mainImage) {
          let mainImageUrl;
          
          // Обрабатываем mainImage также как и обычные изображения
          if (car.mainImage.startsWith('http') || car.mainImage.startsWith('blob:')) {
            mainImageUrl = car.mainImage;
          } else if (car.mainImage.startsWith('/uploads/')) {
            mainImageUrl = `${baseUrl}${car.mainImage}`;
          } else {
            mainImageUrl = `${baseUrl}${car.mainImage.startsWith('/') ? car.mainImage : `/${car.mainImage}`}`;
          }
          
          console.log("URL главного изображения:", mainImageUrl);
          
          // Ищем индекс главного изображения в массиве
          const mainIndex = car.images.findIndex((imgPath) => {
            if (!imgPath) return false;
            return car.mainImage.includes(imgPath) || imgPath.includes(car.mainImage);
          });
          
          console.log("Индекс главного изображения:", mainIndex);
          if (mainIndex !== -1) {
            setMainImageIndex(mainIndex);
          }
        }
      } else {
        console.log("У автомобиля нет изображений");
        setPreviewImages([]);
      }

      setNewImages([]);
      setTabIndex(0);
    }
  }, [car]); // Удаляем formData из зависимостей

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    // Проверяем, что введенное значение - это число
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (!files.length) {
      console.log("Файлы не выбраны");
      return;
    }
    
    console.log("Выбраны новые файлы:", files.map(f => `${f.name} (${f.type}, ${f.size} bytes)`));
    
    // Добавляем новые файлы и превью
    setNewImages([...newImages, ...files]);
    
    // Создаем превью для всех выбранных файлов
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewUrls]);
    
    // Если это первое изображение, автоматически делаем его главным
    if (previewImages.length === 0 && newPreviewUrls.length > 0) {
      setMainImageIndex(0);
    }
  };

  const handleRemoveImage = (index) => {
    // Сохраняем копии массивов
    const updatedPreviewImages = [...previewImages];
    let updatedExistingImages = [...existingImages];
    
    // Удаляем из предпросмотра
    updatedPreviewImages.splice(index, 1);
    setPreviewImages(updatedPreviewImages);
    
    // Определяем, является ли это существующим изображением или новым
    if (index < existingImages.length) {
      // Удаляем существующее изображение
      updatedExistingImages.splice(index, 1);
      setExistingImages(updatedExistingImages);
      console.log("Удалено существующее изображение с индексом", index);
    } else {
      // Удаляем новое изображение
      const newIndex = index - existingImages.length;
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(newIndex, 1);
      setNewImages(updatedNewImages);
      console.log("Удалено новое изображение с относительным индексом", newIndex);
    }
    
    // Если удаляем основное изображение, сбрасываем индекс
    if (index === mainImageIndex) {
      // Устанавливаем первое доступное изображение как основное или сбрасываем, если изображений нет
      const newMainIndex = updatedPreviewImages.length > 0 ? 0 : -1;
      setMainImageIndex(newMainIndex);
      console.log("Основное изображение сброшено на индекс", newMainIndex);
    } else if (index < mainImageIndex) {
      // Если удаляем изображение перед основным, сдвигаем индекс
      setMainImageIndex(mainImageIndex - 1);
      console.log("Индекс основного изображения сдвинут на", mainImageIndex - 1);
    }
  };

  const setAsMainImage = (index) => {
    setMainImageIndex(index);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('=== НАЧАЛО ОТПРАВКИ ФОРМЫ ===');
    
    try {
      // Проверка обязательных полей
      if (!formData.brand || !formData.model || !formData.year || !formData.price || !formData.vin) {
        setError("Пожалуйста, заполните все обязательные поля");
        return;
      }
      
      // Создаем FormData для отправки
      const data = new FormData();
      
      // Добавляем текстовые поля
      console.log('Добавление текстовых полей в FormData:');
      Object.entries(formData).forEach(([key, value]) => {
        // Пропускаем поля images и features, они обрабатываются отдельно
        if (key !== 'images' && key !== 'features') {
          data.append(key, value === null ? '' : value);
        }
      });
      
      // Добавляем features как массив
      if (formData.features && formData.features.length > 0) {
        formData.features.forEach(feature => {
          data.append('features', feature);
        });
      }
      
      // Добавляем существующие изображения
      if (existingImages && existingImages.length > 0) {
        existingImages.forEach(img => {
          data.append('existingImages', img);
        });
      }
      
      // Добавляем новые изображения
      if (newImages && newImages.length > 0) {
        newImages.forEach(file => {
          data.append('images', file);
        });
      }
      
      // Добавляем индекс главного изображения
      if (mainImageIndex !== null && mainImageIndex !== undefined) {
        data.append('mainImageIndex', mainImageIndex);
      }
      
      // Отправляем данные
      console.log('Отправка данных формы');
      await onSave(data);
      console.log('Форма успешно отправлена');
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      setError(error.message || 'Ошибка при отправке формы');
    }
  };

  // Проверка заполнения обязательных полей
  const isFormValid = () => {
    return (
      formData.brand &&
      formData.model &&
      formData.year &&
      formData.price &&
      formData.vin
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 2 },
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          backgroundColor: "rgba(0,0,0,0.02)",
          px: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" component="div">
          {car?.id
            ? "Редактирование автомобиля"
            : "Добавление нового автомобиля"}
        </Typography>
        <IconButton onClick={onClose}>
          <DeleteIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 0, py: 0 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 3,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            backgroundColor: "rgba(0,0,0,0.02)",
          }}
        >
          <Tab icon={<DirectionsCarIcon />} label="Основная информация" />
          <Tab icon={<SpeedIcon />} label="Характеристики" />
          <Tab icon={<ColorLensIcon />} label="Внешний вид" />
          <Tab icon={<AttachMoneyIcon />} label="Цены и доступность" />
          <Tab icon={<DescriptionIcon />} label="Описание и история" />
        </Tabs>

        <Box sx={{ p: 3, overflowY: "auto" }}>
          {/* Отображение ошибок */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Первая вкладка - Основная информация */}
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Марка</InputLabel>
                  <Select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    label="Марка"
                  >
                    {CAR_BRANDS.map((brand) => (
                      <MenuItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </MenuItem>
                    ))}
                    <MenuItem value="other">Другая марка</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.brand === "other" && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ввести марку вручную"
                    name="customBrand"
                    value={formData.customBrand || ""}
                    onChange={(e) => {
                      const { value } = e.target;
                      setFormData({
                        ...formData,
                        brand: value, // Записываем значение напрямую в brand
                        customBrand: value // Сохраняем для поля ввода
                      });
                    }}
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Модель"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Год"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleNumberChange}
                  InputProps={{
                    inputProps: {
                      min: 1950,
                      max: new Date().getFullYear() + 1,
                    },
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="VIN"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  required
                  helperText="Идентификационный номер автомобиля"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Категория</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Категория"
                  >
                    {CAR_CATEGORIES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Специальная серия"
                  name="specialSeries"
                  value={formData.specialSeries || ""}
                  onChange={handleChange}
                  placeholder="Например: Pista, Monza SP2"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Цена"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleNumberChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₽</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Пробег"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleNumberChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">км</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Местонахождение автомобиля"
                  name="carLocation"
                  value={formData.carLocation || ""}
                  onChange={handleChange}
                  placeholder="Например: Шоурум Москва, склад Санкт-Петербург"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.certificateOfAuthenticity || false}
                      onChange={handleSwitchChange}
                      name="certificateOfAuthenticity"
                      color="primary"
                    />
                  }
                  label="Сертификат подлинности"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  fontWeight="medium"
                >
                  Фотографии автомобиля
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {previewImages.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 160,
                        height: 120,
                        border:
                          index === mainImageIndex ? "3px solid" : "1px solid",
                        borderColor:
                          index === mainImageIndex
                            ? "primary.main"
                            : "rgba(0,0,0,0.1)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        loading="lazy"
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          bgcolor: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.2s",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <Stack direction="row" spacing={1}>
                          {index !== mainImageIndex && (
                            <Tooltip title="Сделать основным">
                              <IconButton
                                size="small"
                                sx={{ color: "white" }}
                                onClick={() => setAsMainImage(index)}
                              >
                                <StarIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Удалить">
                            <IconButton
                              size="small"
                              sx={{ color: "white" }}
                              onClick={() => handleRemoveImage(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                      {index === mainImageIndex && (
                        <Chip
                          label="Основное"
                          size="small"
                          color="primary"
                          sx={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                    sx={{
                      width: 160,
                      height: 120,
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      borderStyle: "dashed",
                    }}
                  >
                    Добавить фото
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      onClick={(e) => {
                        // Сбрасываем значение, чтобы можно было выбрать те же файлы повторно
                        e.target.value = '';
                      }}
                    />
                  </Button>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  * Выберите основное изображение, которое будет отображаться в
                  каталоге
                </Typography>
                {previewImages.length > 0 && (
                  <Typography variant="caption" color="primary" sx={{ display: "block", mt: 1 }}>
                    Текущее основное изображение: {mainImageIndex + 1} из {previewImages.length}
                  </Typography>
                )}
                {newImages.length > 0 && (
                  <Typography variant="caption" color="success.main" sx={{ display: "block", mt: 1 }}>
                    Новых фото для загрузки: {newImages.length}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}

          {/* Вторая вкладка - Технические характеристики */}
          {tabIndex === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Двигатель"
                  name="engine"
                  value={formData.engine || ""}
                  onChange={handleChange}
                  placeholder="Например: 4.0L V8 Twin-Turbo"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Мощность"
                  name="horsepower"
                  type="number"
                  value={formData.horsepower || ""}
                  onChange={handleNumberChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">л.с.</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Трансмиссия</InputLabel>
                  <Select
                    name="transmission"
                    value={formData.transmission || ""}
                    onChange={handleChange}
                    label="Трансмиссия"
                  >
                    {TRANSMISSION_TYPES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Разгон 0-100 км/ч"
                  name="acceleration"
                  type="number"
                  value={formData.acceleration || ""}
                  onChange={handleNumberChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">сек.</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Максимальная скорость"
                  name="maxSpeed"
                  type="number"
                  value={formData.maxSpeed || ""}
                  onChange={handleNumberChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">км/ч</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Привод</InputLabel>
                  <Select
                    name="driveType"
                    value={formData.driveType || ""}
                    onChange={handleChange}
                    label="Привод"
                  >
                    {DRIVE_TYPES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Тип топлива</InputLabel>
                  <Select
                    name="fuelType"
                    value={formData.fuelType || ""}
                    onChange={handleChange}
                    label="Тип топлива"
                  >
                    {FUEL_TYPES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Расход топлива"
                  name="fuelConsumption"
                  type="number"
                  value={formData.fuelConsumption || ""}
                  onChange={handleNumberChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">л/100км</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.carbonCeramic || false}
                      onChange={handleSwitchChange}
                      name="carbonCeramic"
                      color="primary"
                    />
                  }
                  label="Карбоно-керамические тормоза"
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  fontWeight="medium"
                >
                  Особенности и комплектация
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Добавить особенность"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Например: Панорамная крыша"
                    sx={{ mr: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={addFeature}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Добавить
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {formData.features &&
                    formData.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        onDelete={() => removeFeature(index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                </Box>
              </Grid>
            </Grid>
          )}

          {/* Третья вкладка - Внешний вид */}
          {tabIndex === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Цвет экстерьера"
                  name="exteriorColor"
                  value={formData.exteriorColor || ""}
                  onChange={handleChange}
                  placeholder="Например: Rosso Corsa, Giallo Modena"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Цвет интерьера"
                  name="interiorColor"
                  value={formData.interiorColor || ""}
                  onChange={handleChange}
                  placeholder="Например: Nero, Cuoio"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Материал интерьера"
                  name="interiorMaterial"
                  value={formData.interiorMaterial || ""}
                  onChange={handleChange}
                  placeholder="Например: Кожа, Алькантара"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Колеса"
                  name="wheels"
                  value={formData.wheels || ""}
                  onChange={handleChange}
                  placeholder="Например: 20-дюймовые кованые диски"
                />
              </Grid>
            </Grid>
          )}

          {/* Четвертая вкладка - Цены и доступность */}
          {tabIndex === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.available}
                      onChange={handleSwitchChange}
                      name="available"
                      color="primary"
                    />
                  }
                  label="Доступен для продажи"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.testDriveAvailable || false}
                      onChange={handleSwitchChange}
                      name="testDriveAvailable"
                      color="primary"
                    />
                  }
                  label="Доступен для тест-драйва"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.rentalAvailable || false}
                      onChange={handleSwitchChange}
                      name="rentalAvailable"
                      color="primary"
                    />
                  }
                  label="Доступен для аренды"
                />
              </Grid>
              {formData.rentalAvailable && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Стоимость аренды в день"
                    name="rentalPricePerDay"
                    type="number"
                    value={formData.rentalPricePerDay || ""}
                    onChange={handleNumberChange}
                    required={formData.rentalAvailable}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₽</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
            </Grid>
          )}

          {/* Пятая вкладка - Описание и история */}
          {tabIndex === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  multiline
                  rows={5}
                  placeholder="Подробное описание автомобиля"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="История автомобиля"
                  name="history"
                  value={formData.history || ""}
                  onChange={handleChange}
                  multiline
                  rows={5}
                  placeholder="История автомобиля, предыдущие владельцы, обслуживание и т.д."
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid rgba(0,0,0,0.08)",
          backgroundColor: "rgba(0,0,0,0.02)",
        }}
      >
        <Button onClick={onClose} variant="outlined">
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid() || isLoading}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogActions>

      {/* Snackbar для сообщений */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EditCarDialog; 

