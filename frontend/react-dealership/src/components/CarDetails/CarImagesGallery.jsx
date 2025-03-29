const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001";

// Обработка изображений для карусели
const processImageUrls = (images, mainImage) => {
  console.log("Обработка изображений для галереи:", { images, mainImage });
  
  if (!images || !Array.isArray(images) || images.length === 0) {
    console.log("Нет изображений для обработки");
    return ['/images/car-placeholder.jpg'];
  }
  
  // Преобразуем URL-адреса изображений
  let processedUrls = images.map(image => {
    // Проверка на null или undefined
    if (!image) {
      console.error("Обнаружено null/undefined изображение");
      return null;
    }
    
    if (typeof image === 'string') {
      // Если изображение уже имеет полный URL
      if (image.startsWith('http') || image.startsWith('blob:')) {
        return image;
      }
      
      // Если путь начинается с /uploads, добавляем baseUrl
      if (image.startsWith('/uploads/')) {
        return `${baseUrl}${image}`;
      }
      
      // Если путь начинается с /api
      if (image.startsWith('/api/')) {
        return `${baseUrl}${image.substring(4)}`;
      }
      
      // Для других случаев
      return `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`;
    }
    
    console.error("Некорректный формат изображения:", image);
    return null;
  }).filter(url => url !== null); // Удаляем null значения
  
  // Если после фильтрации не осталось URL, используем плейсхолдер
  if (processedUrls.length === 0) {
    console.log("После обработки нет валидных URL, используем плейсхолдер");
    return ['/images/car-placeholder.jpg'];
  }
  
  // Если есть главное изображение, перемещаем его в начало массива
  if (mainImage && typeof mainImage === 'string') {
    console.log("Обработка главного изображения:", mainImage);
    
    let mainImageUrl;
    if (mainImage.startsWith('http') || mainImage.startsWith('blob:')) {
      mainImageUrl = mainImage;
    } else if (mainImage.startsWith('/uploads/')) {
      mainImageUrl = `${baseUrl}${mainImage}`;
    } else if (mainImage.startsWith('/api/')) {
      mainImageUrl = `${baseUrl}${mainImage.substring(4)}`;
    } else {
      mainImageUrl = `${baseUrl}${mainImage.startsWith('/') ? mainImage : `/${mainImage}`}`;
    }
    
    // Ищем главное изображение в массиве по имени файла (последняя часть пути)
    const mainImageFilename = mainImageUrl.split('/').pop();
    const mainImageIndex = processedUrls.findIndex(url => url.includes(mainImageFilename));
    
    if (mainImageIndex !== -1) {
      // Если главное изображение в массиве, перемещаем его в начало
      const [mainImg] = processedUrls.splice(mainImageIndex, 1);
      processedUrls.unshift(mainImg);
    } else if (!processedUrls.includes(mainImageUrl)) {
      // Если главного изображения нет в массиве, добавляем его в начало
      processedUrls.unshift(mainImageUrl);
    }
  }
  
  console.log("Обработанные URL изображений:", processedUrls);
  return processedUrls;
}; 