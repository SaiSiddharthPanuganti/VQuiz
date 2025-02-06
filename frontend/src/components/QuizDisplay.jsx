import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Divider,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { motion } from 'framer-motion';

function QuizDisplay({ quiz, onReset }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });
    setShowExplanation(false);
  };

  const handleNext = () => {
    setCurrentQuestion(prev => prev + 1);
    setShowExplanation(false);
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => prev - 1);
    setShowExplanation(false);
  };

  const handleSubmit = () => {
    const totalQuestions = quiz.questions.length;
    let correctCount = 0;
    const wrongAnswers = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      } else {
        wrongAnswers.push({
          questionNumber: index + 1,
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation
        });
      }
    });

    setScore(`${correctCount}/${totalQuestions}`);
    setIncorrectAnswers(wrongAnswers);
    setIsSubmitted(true);
  };

  const question = quiz.questions[currentQuestion];

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
          maxWidth: '800px',
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
          {/* Quiz Header */}
          <Typography variant="h4" gutterBottom>
            {quiz.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Score Display */}
          {isSubmitted && (
            <>
              <Alert 
                severity="info" 
                sx={{ mb: 3 }}
              >
                <Typography variant="h6">
                  Final Score: {score}
                </Typography>
                {incorrectAnswers.length > 0 ? (
                  <Typography>
                    You got {quiz.questions.length - incorrectAnswers.length} questions correct and {incorrectAnswers.length} questions wrong.
                  </Typography>
                ) : (
                  <Typography>
                    Perfect score! You got all questions correct!
                  </Typography>
                )}
              </Alert>

              {incorrectAnswers.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Review Incorrect Answers:
                  </Typography>
                  <List>
                    {incorrectAnswers.map((wrong, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          flexDirection: 'column', 
                          alignItems: 'flex-start',
                          bgcolor: 'background.default',
                          borderRadius: 1,
                          mb: 2,
                          p: 2
                        }}
                      >
                        <Typography variant="subtitle1" color="error" gutterBottom>
                          Question {wrong.questionNumber}: {wrong.question}
                        </Typography>
                        <Typography color="text.secondary">
                          Your Answer: {wrong.userAnswer}
                        </Typography>
                        <Typography color="success.main">
                          Correct Answer: {wrong.correctAnswer}
                        </Typography>
                        <Typography sx={{ mt: 1 }}>
                          Explanation: {wrong.explanation}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </>
          )}

          {/* Question */}
          <Typography variant="h6" gutterBottom>
            {question.question}
          </Typography>

          {/* Options */}
          <RadioGroup
            value={selectedAnswers[currentQuestion] || ''}
            onChange={(e) => handleAnswerSelect(e.target.value)}
          >
            {question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
                disabled={isSubmitted}
                sx={{
                  ...(isSubmitted && option === question.correctAnswer && {
                    color: 'success.main',
                  }),
                  ...(isSubmitted && 
                    selectedAnswers[currentQuestion] === option && 
                    option !== question.correctAnswer && {
                      color: 'error.main',
                    }),
                }}
              />
            ))}
          </RadioGroup>

          {/* Explanation */}
          <Collapse in={showExplanation || isSubmitted}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Explanation:
              </Typography>
              {question.explanation}
            </Alert>
          </Collapse>

          {/* Navigation Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <Box>
              {!isSubmitted && (
                <Button
                  variant="outlined"
                  onClick={() => setShowExplanation(!showExplanation)}
                  sx={{ mr: 2 }}
                >
                  {showExplanation ? 'Hide' : 'Show'} Explanation
                </Button>
              )}

              {currentQuestion < quiz.questions.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQuestion]}
                >
                  Next
                </Button>
              ) : (
                !isSubmitted && (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                  >
                    Submit Quiz
                  </Button>
                )
              )}
            </Box>
          </Box>

          {/* Reset Button */}
          {isSubmitted && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={onReset}
              >
                Create New Quiz
              </Button>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}

export default QuizDisplay; 