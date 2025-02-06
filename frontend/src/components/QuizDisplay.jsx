import React, { useState } from 'react';
import {
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Box,
  LinearProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { QuizOutlined, Timer } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer, GlassPaper } from '../styles/StyledComponents';

function QuizDisplay({ questions, onSubmit, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            return 30;
          }
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, questions.length]);

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions');
      return;
    }
    onSubmit(answers);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '800px' }}
      >
        <GlassPaper>
          <Box sx={{ width: '100%', mb: 4 }}>
            <Stepper activeStep={currentQuestion} alternativeLabel>
              {questions.map((_, index) => (
                <Step key={index}>
                  <StepLabel></StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              mb: 3
            }}
          >
            <Typography variant="h4">
              Question {currentQuestion + 1}/{questions.length}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timer color={timeLeft <= 10 ? 'error' : 'primary'} />
              <Typography
                variant="h6"
                color={timeLeft <= 10 ? 'error' : 'primary'}
              >
                {timeLeft}s
              </Typography>
            </Box>
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ width: '100%', mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  mb: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {questions[currentQuestion].question}
                </Typography>

                <RadioGroup
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={
                        <Radio 
                          sx={{
                            '&.Mui-checked': {
                              color: 'primary.main'
                            }
                          }}
                        />
                      }
                      label={option}
                      sx={{
                        mb: 1,
                        p: 1,
                        width: '100%',
                        borderRadius: 1,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(33, 150, 243, 0.1)'
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </Paper>
            </motion.div>
          </AnimatePresence>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              disabled={currentQuestion === 0}
              onClick={() => {
                setCurrentQuestion(prev => prev - 1);
                setTimeLeft(30);
              }}
              fullWidth
            >
              Previous
            </Button>
            
            {currentQuestion < questions.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => {
                  setCurrentQuestion(prev => prev + 1);
                  setTimeLeft(30);
                }}
                fullWidth
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
              >
                Submit Quiz
              </Button>
            )}
          </Box>
        </GlassPaper>
      </motion.div>
    </PageContainer>
  );
}

export default QuizDisplay; 