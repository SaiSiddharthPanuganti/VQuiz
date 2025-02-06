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
  ListItemText,
  TextField
} from '@mui/material';
import { motion } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';

function QuizDisplay({ quiz, onReset }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  // Debug logging
  console.log('Quiz data:', quiz);
  console.log('Question type:', quiz?.questionType);
  console.log('Current question:', quiz?.questions?.[currentQuestion]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });
    setShowExplanation(false);
  };

  const renderQuestionInput = (question) => {
    if (!question) return null;

    switch (quiz.questionType) {
      case 'multiple-choice':
        return (
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
                  my: 1,
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
        );

      case 'true-false':
        return (
          <RadioGroup
            value={selectedAnswers[currentQuestion] || ''}
            onChange={(e) => handleAnswerSelect(e.target.value)}
          >
            <FormControlLabel 
              value="True" 
              control={<Radio />} 
              label="True"
              sx={{
                ...(isSubmitted && "True" === question.correctAnswer && {
                  color: 'success.main',
                }),
              }}
            />
            <FormControlLabel 
              value="False" 
              control={<Radio />} 
              label="False"
              sx={{
                ...(isSubmitted && "False" === question.correctAnswer && {
                  color: 'success.main',
                }),
              }}
            />
          </RadioGroup>
        );

      case 'fill-in-the-blanks':
        return (
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your answer here"
            value={selectedAnswers[currentQuestion] || ''}
            onChange={(e) => handleAnswerSelect(e.target.value)}
            disabled={isSubmitted}
            error={isSubmitted && selectedAnswers[currentQuestion]?.toLowerCase().trim() !== question.correctAnswer?.toLowerCase().trim()}
            helperText={isSubmitted && selectedAnswers[currentQuestion]?.toLowerCase().trim() !== question.correctAnswer?.toLowerCase().trim() ? 
              `Correct answer: ${question.correctAnswer}` : ''}
            sx={{ mt: 2 }}
          />
        );

      default:
        console.log('Unsupported question type:', quiz.questionType);
        return (
          <Typography color="error">
            Unsupported question type
          </Typography>
        );
    }
  };

  const handleSubmit = () => {
    const totalQuestions = quiz.questions.length;
    let correctCount = 0;
    const wrongAnswers = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      let isCorrect = false;

      if (quiz.questionType === 'fill-in-the-blanks') {
        isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
      } else {
        isCorrect = userAnswer === question.correctAnswer;
      }

      if (isCorrect) {
        correctCount++;
      } else {
        wrongAnswers.push({
          questionNumber: index + 1,
          question: question.question,
          userAnswer: userAnswer || 'No answer provided',
          correctAnswer: question.correctAnswer,
          explanation: question.explanation
        });
      }
    });

    setScore(`${correctCount}/${totalQuestions}`);
    setIncorrectAnswers(wrongAnswers);
    setIsSubmitted(true);
  };

  if (!quiz?.questions?.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error: No questions available
        </Typography>
      </Box>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {quiz.title}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>
            {question.question}
          </Typography>
          {renderQuestionInput(question)}
        </Box>

        {/* Show Explanation */}
        <Collapse in={showExplanation || isSubmitted}>
          <Alert severity="info" sx={{ mt: 2 }}>
            {question.explanation}
          </Alert>
        </Collapse>

        {/* Navigation */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => setCurrentQuestion(prev => prev - 1)}
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
                onClick={() => setCurrentQuestion(prev => prev + 1)}
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

        {/* Score Display and Create Another Quiz Button */}
        {isSubmitted && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">
              <Typography variant="h6">Score: {score}</Typography>
              {incorrectAnswers.length > 0 && (
                <List>
                  {incorrectAnswers.map((wrong, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Question ${wrong.questionNumber}: ${wrong.question}`}
                        secondary={`Your answer: ${wrong.userAnswer} | Correct answer: ${wrong.correctAnswer}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Alert>

            {/* Create Another Quiz Button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={onReset}
                startIcon={<RefreshIcon />}
                sx={{ mt: 2 }}
              >
                Create Another Quiz
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default QuizDisplay; 