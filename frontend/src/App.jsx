import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingOverlay from './components/LoadingOverlay';
import Notification from './components/Notification';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import QuizHistory from './components/QuizHistory';
import Statistics from './components/Statistics';
import Leaderboard from './components/Leaderboard';
import QuizDisplay from './components/QuizDisplay';
import Results from './components/Results';
import ProtectedRoute from './components/ProtectedRoute';
import { useApp } from './context/AppContext';

function AppContent() {
  const { notification, hideNotification, loading } = useApp();
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Box sx={{ display: 'flex' }}>
      {loading.isLoading && <LoadingOverlay message={loading.message} />}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={hideNotification}
      />
      
      {isAuthenticated && <Navigation />}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          p: 3,
          width: { sm: isAuthenticated ? `calc(100% - 240px)` : '100%' },
          ml: { sm: isAuthenticated ? '240px' : 0 },
          mt: isAuthenticated ? '64px' : 0,
        }}
      >
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <QuizHistory />
            </ProtectedRoute>
          } />
          <Route path="/statistics" element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute>
              <QuizDisplay />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;