import React, { useState } from 'react';
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageContainer, GlassPaper, FormContainer } from '../styles/StyledComponents';

function QuizPreferences({ onSubmit, onBack }) {
  const [preferences, setPreferences] = useState({
    questionType: 'multiple-choice',
    numberOfQuestions: 5,
    difficulty: 'medium'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSubmit(preferences);
    } catch (error) {
      setError(error.message);
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
          <Settings sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Quiz Preferences
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormContainer component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <InputLabel>Question Type</InputLabel>
              <Select
                value={preferences.questionType}
                label="Question Type"
                onChange={(e) => setPreferences({...preferences, questionType: e.target.value})}
              >
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="true-false">True/False</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Number of Questions</InputLabel>
              <Select
                value={preferences.numberOfQuestions}
                label="Number of Questions"
                onChange={(e) => setPreferences({...preferences, numberOfQuestions: e.target.value})}
              >
                {[5, 10, 15, 20].map(num => (
                  <MenuItem key={num} value={num}>{num}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={preferences.difficulty}
                label="Difficulty"
                onChange={(e) => setPreferences({...preferences, difficulty: e.target.value})}
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
            
            <Button
              onClick={onBack}
              variant="outlined"
              fullWidth
            >
              Back
            </Button>
          </FormContainer>
        </GlassPaper>
      </motion.div>
    </PageContainer>
  );
}

export default QuizPreferences; 