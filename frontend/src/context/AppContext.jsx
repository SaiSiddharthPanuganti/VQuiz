import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const [loading, setLoading] = useState({
    isLoading: false,
    message: ''
  });

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  const showLoading = (message = 'Loading...') => {
    setLoading({
      isLoading: true,
      message
    });
  };

  const hideLoading = () => {
    setLoading({
      isLoading: false,
      message: ''
    });
  };

  return (
    <AppContext.Provider
      value={{
        notification,
        showNotification,
        hideNotification,
        loading,
        showLoading,
        hideLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext); 