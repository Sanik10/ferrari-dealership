import { useState, useEffect, useRef } from 'react';
import { Box, Slider, IconButton, Typography, Fade, CircularProgress } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import TouchAppIcon from '@mui/icons-material/TouchApp';

const CarViewer360 = ({ images, title }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const containerRef = useRef(null);
  const controlsTimer = useRef(null);
  const animationControls = useAnimation();
  const rotationInterval = useRef(null);
  
  // Предзагрузка изображений
  useEffect(() => {
    let mounted = true;
    const totalImages = images.length;
    let loadedCount = 0;
    
    const imageObjects = images.map(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (mounted) {
          loadedCount++;
          setLoadingProgress(Math.floor((loadedCount / totalImages) * 100));
          if (loadedCount === totalImages) {
            setPreloadedImages(imageObjects);
            setIsLoaded(true);
          }
        }
      };
      return img;
    });
    
    return () => {
      mounted = false;
    };
  }, [images]);
  
  // Автоматическое вращение
  useEffect(() => {
    if (isPlaying && isLoaded) {
      rotationInterval.current = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % images.length);
      }, 100);
    } else {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
      }
    }
    
    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
      }
    };
  }, [isPlaying, isLoaded, images.length]);
  
  // Автоскрытие элементов управления
  useEffect(() => {
    const hideControls = () => {
      if (!isDragging) {
        setShowControls(false);
      }
    };
    
    if (showControls && !isDragging) {
      controlsTimer.current = setTimeout(hideControls, 3000);
    }
    
    return () => {
      if (controlsTimer.current) {
        clearTimeout(controlsTimer.current);
      }
    };
  }, [showControls, isDragging]);
  
  // Обработка полноэкранного режима
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [fullscreen]);
  
  // Анимация появления/исчезновения
  useEffect(() => {
    if (showControls) {
      animationControls.start({ opacity: 1 });
    } else {
      animationControls.start({ opacity: 0 });
    }
  }, [showControls, animationControls]);
  
  const handleSliderChange = (_, newValue) => {
    setCurrentFrame(newValue);
    
    // Останавливаем автоматическое вращение при ручном изменении кадра
    if (isPlaying) {
      setIsPlaying(false);
    }
  };
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    setShowControls(true);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };
  
  // Обработка драга (перетаскивания)
  const handleMouseDown = (e) => {
    if (!isLoaded) return;
    
    setIsDragging(true);
    setDragStart(e.clientX);
    
    // Останавливаем автоматическое вращение при перетаскивании
    if (isPlaying) {
      setIsPlaying(false);
    }
  };
  
  const handleTouchStart = (e) => {
    if (!isLoaded) return;
    
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    
    // Останавливаем автоматическое вращение при перетаскивании
    if (isPlaying) {
      setIsPlaying(false);
    }
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging || !isLoaded) return;
    
    const dragDistance = e.clientX - dragStart;
    if (Math.abs(dragDistance) > 5) {
      const frameCount = images.length;
      const framesToMove = Math.floor(dragDistance / 10);
      
      if (framesToMove !== 0) {
        setCurrentFrame(prev => {
          // Обеспечиваем циклическое изменение кадра
          let newFrame = (prev - framesToMove) % frameCount;
          if (newFrame < 0) newFrame += frameCount;
          return newFrame;
        });
        setDragStart(e.clientX);
      }
    }
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging || !isLoaded) return;
    
    const dragDistance = e.touches[0].clientX - dragStart;
    if (Math.abs(dragDistance) > 5) {
      const frameCount = images.length;
      const framesToMove = Math.floor(dragDistance / 10);
      
      if (framesToMove !== 0) {
        setCurrentFrame(prev => {
          // Обеспечиваем циклическое изменение кадра
          let newFrame = (prev - framesToMove) % frameCount;
          if (newFrame < 0) newFrame += frameCount;
          return newFrame;
        });
        setDragStart(e.touches[0].clientX);
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const handleMouseEnter = () => {
    setShowControls(true);
  };
  
  // Отображение загрузки
  if (!isLoaded) {
    return (
      <Box
        sx={{
          height: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0,0,0,0.05)',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <CircularProgress 
          variant="determinate" 
          value={loadingProgress}
          size={60}
          thickness={5}
          sx={{ mb: 2, color: 'primary.main' }}
        />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Загрузка 3D просмотра
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {loadingProgress}% ({Math.round((loadingProgress/100) * images.length)} из {images.length} изображений)
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box
      ref={containerRef}
      sx={{
        position: fullscreen ? 'fixed' : 'relative',
        top: fullscreen ? 0 : 'auto',
        left: fullscreen ? 0 : 'auto',
        right: fullscreen ? 0 : 'auto',
        bottom: fullscreen ? 0 : 'auto',
        zIndex: fullscreen ? 9999 : 1,
        bgcolor: fullscreen ? 'black' : 'transparent',
        height: fullscreen ? '100vh' : 400,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: fullscreen ? 0 : 2,
        overflow: 'hidden',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onClick={() => setShowControls(true)}
    >
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          bgcolor: '#f5f5f5',
        }}
      >
        <motion.img
          key={currentFrame}
          src={images[currentFrame]}
          alt={`${title || 'Автомобиль'} - вид ${currentFrame + 1} из ${images.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            userSelect: 'none',
            WebkitUserDrag: 'none',
          }}
          draggable="false"
        />
        
        {/* Индикатор первого использования - показывается только первые несколько секунд */}
        <Fade in={isLoaded && !isDragging && currentFrame === 0} timeout={1000}>
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              p: 1.5,
              borderRadius: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              pointerEvents: 'none',
            }}
          >
            <TouchAppIcon sx={{ animation: 'pulse 1.5s infinite' }} />
            <Typography variant="body2">Перетащите для вращения</Typography>
          </Box>
        </Fade>
        
        {/* Кнопки управления */}
        <motion.div
          animate={animationControls}
          initial={{ opacity: 1 }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: '8px'
          }}
        >
          <IconButton
            onClick={togglePlayPause}
            sx={{
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </motion.div>
      </Box>
      
      <motion.div
        animate={animationControls}
        initial={{ opacity: 1 }}
      >
        <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.03)' }}>
          <Slider
            value={currentFrame}
            onChange={handleSliderChange}
            min={0}
            max={images.length - 1}
            sx={{
              '& .MuiSlider-thumb': {
                bgcolor: 'primary.main',
                width: 16,
                height: 16,
                '&:hover, &.Mui-active': {
                  boxShadow: '0 0 0 8px rgba(255, 40, 0, 0.16)'
                }
              },
              '& .MuiSlider-track': {
                bgcolor: 'primary.main',
                height: 4
              },
              '& .MuiSlider-rail': {
                height: 4
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Поверните автомобиль, перемещая ползунок или мышь
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {currentFrame + 1} / {images.length}
            </Typography>
          </Box>
        </Box>
      </motion.div>
      
      {/* CSS для анимации пульсации */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.6; transform: scale(1); }
        }
      `}</style>
    </Box>
  );
};

export default CarViewer360; 