import React, { useState } from 'react';
import { Container, Alert, Snackbar } from '@mui/material';
import QuizForm from './QuizForm';
import QuizDisplay from './QuizDisplay';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [quiz, setQuiz] = useState(null);
  const [showQuizForm, setShowQuizForm] = useState(true);
  const [error, setError] = useState('');
  const { startProgress, stopProgress } = useProgress();
  const { currentUser } = useAuth();

  const handleQuizGenerate = async (youtubeLink, preferences) => {
    try {
      setError('');
      startProgress('Generating quiz from video...');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/quiz/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          videoUrl: youtubeLink,
          numberOfQuestions: preferences.numberOfQuestions,
          difficulty: preferences.difficulty,
          questionType: preferences.questionType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      if (!data.success || !data.quiz) {
        throw new Error('Invalid quiz data received');
      }

      setQuiz(data.quiz);
      setShowQuizForm(false);
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
    setShowQuizForm(true);
    setError('');
  };

  return (
    <Container maxWidth="lg">
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

      {showQuizForm ? (
        <QuizForm onSubmit={handleQuizGenerate} />
      ) : (
        <QuizDisplay quiz={quiz} onReset={handleReset} />
      )}
    </Container>
  );
}

export default Dashboard; 