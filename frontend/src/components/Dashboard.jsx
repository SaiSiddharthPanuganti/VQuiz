import React, { useState } from 'react';
import {
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageContainer, GlassPaper, FormContainer } from '../styles/StyledComponents';
import { YouTube, Settings } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const { showLoading, hideLoading, showNotification } = useApp();
  const username = localStorage.getItem('username');
  const [anchorEl, setAnchorEl] = useState(null);
  
  const [quizData, setQuizData] = useState({
    videoUrl: '',
    numberOfQuestions: 5,
    difficulty: 'medium'
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showLoading('Generating quiz...');
      const response = await api.generateQuiz(quizData.videoUrl, {
        numberOfQuestions: quizData.numberOfQuestions,
        difficulty: quizData.difficulty
      });
      // Handle the generated quiz
      showNotification('Quiz generated successfully!', 'success');
      // Navigate to quiz display or handle the next step
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      hideLoading();
    }
  };

  return (
    <PageContainer>
      {/* User Menu */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          padding: 2,
          zIndex: 1000
        }}
      >
        <IconButton onClick={handleMenu}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {username?.[0]?.toUpperCase()}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled>
            <Typography variant="body2">
              Signed in as {username}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Main Content */}
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
            <YouTube />
          </Box>

          <Typography variant="h4" gutterBottom>
            Generate Quiz
          </Typography>

          <FormContainer component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="YouTube Video URL"
              required
              value={quizData.videoUrl}
              onChange={(e) => setQuizData({ ...quizData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              helperText="Enter a valid YouTube video URL"
            />

            <FormControl fullWidth>
              <InputLabel>Number of Questions</InputLabel>
              <Select
                value={quizData.numberOfQuestions}
                label="Number of Questions"
                onChange={(e) => setQuizData({ ...quizData, numberOfQuestions: e.target.value })}
              >
                <MenuItem value={5}>5 Questions</MenuItem>
                <MenuItem value={10}>10 Questions</MenuItem>
                <MenuItem value={15}>15 Questions</MenuItem>
                <MenuItem value={20}>20 Questions</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={quizData.difficulty}
                label="Difficulty Level"
                onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Generate Quiz
            </Button>
          </FormContainer>
        </GlassPaper>
      </motion.div>
    </PageContainer>
  );
}

export default Dashboard; 