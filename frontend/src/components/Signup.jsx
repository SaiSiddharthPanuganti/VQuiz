import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { PageContainer, GlassPaper, FormContainer } from '../styles/StyledComponents';
import api from '../services/api';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      showLoading('Creating your account...');
      await api.signup(formData);
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Signup failed');
    } finally {
      hideLoading();
    }
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <GlassPaper>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <PersonAddOutlinedIcon />
          </Box>

          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormContainer component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              helperText="Username must be between 3 and 30 characters"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              helperText="Please enter a valid email address"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              helperText="Password must be at least 6 characters long"
              error={formData.password.length > 0 && formData.password.length < 6}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              helperText={
                formData.confirmPassword.length > 0 && 
                formData.password !== formData.confirmPassword 
                  ? "Passwords don't match"
                  : " "
              }
              error={
                formData.confirmPassword.length > 0 && 
                formData.password !== formData.confirmPassword
              }
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign Up
            </Button>

            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
              sx={{
                mt: 1,
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            >
              Already have an account? Login
            </Button>
          </FormContainer>
        </GlassPaper>
      </motion.div>
    </PageContainer>
  );
}

export default Signup; 