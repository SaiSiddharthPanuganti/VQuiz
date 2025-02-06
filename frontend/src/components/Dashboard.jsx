import React, { useState } from 'react';
import { Container, Alert, Snackbar } from '@mui/material';
import QuizForm from './QuizForm';
import QuizDisplay from './QuizDisplay';
import { useProgress } from '../context/ProgressContext';

function Dashboard() {
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const { startProgress, stopProgress } = useProgress();

  const handleQuizGenerate = async (youtubeLink, preferences) => {
    try {
      setError('');
      startProgress('Generating quiz from video...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/quiz/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          videoUrl: youtubeLink,
          ...preferences
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      console.log('Quiz data:', data);

      if (!data.success || !data.quiz) {
        throw new Error('Invalid quiz data received');
      }

      setQuiz(data.quiz);
    } catch (error) {
      console.error('Quiz generation error:', error);
      setError(error.message || 'Failed to generate quiz');
      setQuiz(null);
    } finally {
      stopProgress();
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setError('');
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'relative'
      }}
    >
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      {!quiz ? (
        <QuizForm onQuizGenerate={handleQuizGenerate} />
      ) : (
        <QuizDisplay quiz={quiz} onReset={handleReset} />
      )}
    </Container>
  );
}

export default Dashboard; 