import React, { createContext, useContext, useState } from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({
    isLoading: false,
    message: ''
  });

  const startProgress = (message = 'Loading...') => {
    setProgress({
      isLoading: true,
      message
    });
  };

  const stopProgress = () => {
    setProgress({
      isLoading: false,
      message: ''
    });
  };

  return (
    <ProgressContext.Provider value={{ startProgress, stopProgress }}>
      {progress.isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            bgcolor: 'background.paper',
            boxShadow: 1,
            p: 1
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
            {progress.message}
          </Typography>
          <LinearProgress />
        </Box>
      )}
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}; 