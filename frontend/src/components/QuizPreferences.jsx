import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  FormHelperText,
  Paper,
} from '@mui/material';
import { QuizOutlined } from '@mui/icons-material';

function QuizPreferences({ preferences, setPreferences, error }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <QuizOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4">Generate Quiz</Typography>
      </Box>

      <TextField
        fullWidth
        label="YouTube Video URL"
        value={preferences.videoUrl}
        onChange={(e) => setPreferences({ ...preferences, videoUrl: e.target.value })}
        placeholder="https://www.youtube.com/watch?v=..."
        error={!!error}
        helperText={error || "Enter a valid YouTube video URL"}
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Question Type</InputLabel>
        <Select
          value={preferences.quizType}
          label="Question Type"
          onChange={(e) => setPreferences({ ...preferences, quizType: e.target.value })}
        >
          <MenuItem value="mcq">Multiple Choice Questions</MenuItem>
          <MenuItem value="true_false">True/False</MenuItem>
          <MenuItem value="fill_blanks">Fill in the Blanks</MenuItem>
        </Select>
        <FormHelperText>Select the type of questions you want</FormHelperText>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Number of Questions</InputLabel>
        <Select
          value={preferences.numberOfQuestions}
          label="Number of Questions"
          onChange={(e) => setPreferences({ ...preferences, numberOfQuestions: e.target.value })}
        >
          <MenuItem value={5}>5 Questions</MenuItem>
          <MenuItem value={10}>10 Questions</MenuItem>
          <MenuItem value={15}>15 Questions</MenuItem>
          <MenuItem value={20}>20 Questions</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Difficulty Level</InputLabel>
        <Select
          value={preferences.difficulty}
          label="Difficulty Level"
          onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
        >
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
}

export default QuizPreferences; 