import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

// Создаем контекст
const SnackbarContext = createContext(null);

// Хук для использования контекста
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar должен использоваться внутри SnackbarProvider');
  }
  return context;
};

// Провайдер контекста
export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  });

  // Метод для отображения уведомления
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Метод для закрытия уведомления
  const closeSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            backgroundColor: snackbar.severity === 'success' 
              ? 'rgba(76, 175, 80, 0.9)' 
              : snackbar.severity === 'error' 
                ? 'rgba(211, 47, 47, 0.9)'
                : snackbar.severity === 'warning'
                  ? 'rgba(255, 152, 0, 0.9)'
                  : 'rgba(3, 169, 244, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarContext; 