import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from './theme/darkTheme';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Statistics from './components/Statistics';
import Welcome from './components/Welcome';
import TeacherDashboard from './components/TeacherDashboard';
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}
    >
      <CssBaseline />
      {isAuthenticated && (
        <Navigation open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/teacher-dashboard" 
            element={
              <PrivateRoute>
                <TeacherDashboard />
              </PrivateRoute>
            } 
          />
          <Route
            path="/statistics"
            element={
              <PrivateRoute>
                <Statistics />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AuthProvider>
          <ProgressProvider>
            <AppContent />
          </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;