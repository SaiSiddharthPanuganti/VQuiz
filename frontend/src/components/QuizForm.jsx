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

function QuizForm({ onSubmit }) {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { startProgress, stopProgress } = useProgress();
  
  const [preferences, setPreferences] = useState({
    questionType: 'multiple-choice',
    numberOfQuestions: 5,
    difficulty: 'medium'
  });

  // Add YouTube URL validation regex
  const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

  const validateForm = () => {
    // YouTube link validation
    if (!youtubeLink.trim()) {
      setError('Please enter a YouTube video link');
      return false;
    }
    
    if (!youtubeUrlRegex.test(youtubeLink)) {
      setError('Please enter a valid YouTube video URL');
      return false;
    }

    // Number of questions validation
    const numQuestions = parseInt(preferences.numberOfQuestions);
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 20) {
      setError('Number of questions must be between 1 and 20');
      return false;
    }

    // Question type validation
    const validQuestionTypes = ['multiple-choice', 'true-false', 'fill-in-the-blanks'];
    if (!validQuestionTypes.includes(preferences.questionType)) {
      setError('Invalid question type selected');
      return false;
    }

    // Difficulty validation
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(preferences.difficulty)) {
      setError('Invalid difficulty level selected');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    startProgress(`Generating ${preferences.questionType} quiz...`);

    try {
      await onSubmit(youtubeLink, preferences);
    } catch (err) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
      stopProgress();
    }
  };

  const handleNumberOfQuestionsChange = (e) => {
    const value = e.target.value;
    // Allow empty string for better UX during typing
    if (value === '') {
      setPreferences({
        ...preferences,
        numberOfQuestions: value
      });
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      // Clamp the value between 1 and 20
      const clampedValue = Math.min(Math.max(numValue, 1), 20);
      setPreferences({
        ...preferences,
        numberOfQuestions: clampedValue
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
                <MenuItem value="multiple-choice">Multiple Choice Questions</MenuItem>
                <MenuItem value="true-false">True/False Questions</MenuItem>
                <MenuItem value="fill-in-the-blanks">Fill In The Blanks</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Number of Questions"
              value={preferences.numberOfQuestions}
              onChange={handleNumberOfQuestionsChange}
              type="number"
              InputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*'
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
