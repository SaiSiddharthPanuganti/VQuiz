import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';

function QuizForm({ onQuizGenerate }) {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { startProgress, stopProgress } = useProgress();
  
  const [preferences, setPreferences] = useState({
    questionType: 'multiple-choice',
    numberOfQuestions: 5,
    difficulty: 'medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeLink.trim()) {
      setError('Please enter a YouTube video link');
      return;
    }

    setLoading(true);
    setError('');
    startProgress('Generating quiz...');

    try {
      await onQuizGenerate(youtubeLink, {
        questionType: preferences.questionType,
        numberOfQuestions: parseInt(preferences.numberOfQuestions),
        difficulty: preferences.difficulty
      });
    } catch (err) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
      stopProgress();
    }
  };

  const handleNumberOfQuestionsChange = (e) => {
    const value = parseInt(e.target.value);
    // Ensure the number is between 1 and 20
    if (value >= 1 && value <= 20) {
      setPreferences({
        ...preferences,
        numberOfQuestions: value
      });
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '20px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 4,
              color: 'primary.main',
              fontWeight: 500
            }}
          >
            Create Your Quiz
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="YouTube Video Link"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              margin="normal"
              variant="outlined"
              required
              sx={{ mb: 3 }}
              placeholder="Paste your YouTube video URL here..."
            />

            <FormControl 
              fullWidth 
              sx={{ mb: 3 }}
            >
              <InputLabel>Question Type</InputLabel>
              <Select
                value={preferences.questionType}
                label="Question Type"
                onChange={(e) => setPreferences({
                  ...preferences,
                  questionType: e.target.value
                })}
              >
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="true-false">True/False</MenuItem>
                <MenuItem value="open-ended">Open Ended</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Number of Questions"
              value={preferences.numberOfQuestions}
              onChange={handleNumberOfQuestionsChange}
              inputProps={{
                min: 1,
                max: 20,
                step: 1
              }}
              sx={{ mb: 3 }}
              helperText="Enter a number between 1 and 20"
            />

            <FormControl 
              fullWidth 
              sx={{ mb: 4 }}
            >
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={preferences.difficulty}
                label="Difficulty"
                onChange={(e) => setPreferences({
                  ...preferences,
                  difficulty: e.target.value
                })}
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
              size="large"
              disabled={loading || !youtubeLink.trim() || preferences.numberOfQuestions < 1}
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Generate Quiz'
              )}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default QuizForm; 