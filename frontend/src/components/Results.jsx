import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Check,
  Close,
  EmojiEvents,
  Refresh,
  Home,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageContainer, GlassPaper } from '../styles/StyledComponents';

function Results({ quizResults }) {
  const navigate = useNavigate();
  const { score, questions, answers, quizType } = quizResults;

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const renderAnswer = (question, userAnswer, index) => {
    switch (quizType) {
      case 'mcq':
        return (
          <ListItem
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                {index + 1}. {question.question}
              </Typography>
              {userAnswer === question.correctAnswer ? (
                <Check color="success" />
              ) : (
                <Close color="error" />
              )}
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography color="text.secondary">Your answer: </Typography>
              <Chip
                label={userAnswer}
                color={userAnswer === question.correctAnswer ? 'success' : 'error'}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              />
              {userAnswer !== question.correctAnswer && (
                <>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Correct answer:
                  </Typography>
                  <Chip
                    label={question.correctAnswer}
                    color="success"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </>
              )}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, fontStyle: 'italic' }}
              >
                {question.explanation}
              </Typography>
            </Box>
          </ListItem>
        );

      case 'true_false':
        return (
          <ListItem
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                {index + 1}. {question.question}
              </Typography>
              {userAnswer === question.correctAnswer ? (
                <Check color="success" />
              ) : (
                <Close color="error" />
              )}
            </Box>
            <Box>
              <Typography color="text.secondary">
                Your answer: {userAnswer ? 'True' : 'False'}
              </Typography>
              {userAnswer !== question.correctAnswer && (
                <Typography color="text.secondary">
                  Correct answer: {question.correctAnswer ? 'True' : 'False'}
                </Typography>
              )}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, fontStyle: 'italic' }}
              >
                {question.explanation}
              </Typography>
            </Box>
          </ListItem>
        );

      case 'fill_blanks':
        return (
          <ListItem
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                {index + 1}. {question.question}
              </Typography>
              {userAnswer.toLowerCase() === question.correctAnswer.toLowerCase() ? (
                <Check color="success" />
              ) : (
                <Close color="error" />
              )}
            </Box>
            <Box>
              <Typography color="text.secondary">Your answer: {userAnswer}</Typography>
              {userAnswer.toLowerCase() !== question.correctAnswer.toLowerCase() && (
                <Typography color="text.secondary">
                  Correct answer: {question.correctAnswer}
                </Typography>
              )}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, fontStyle: 'italic' }}
              >
                {question.explanation}
              </Typography>
            </Box>
          </ListItem>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '800px' }}
      >
        <GlassPaper>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 4
            }}
          >
            <EmojiEvents
              sx={{
                fontSize: 48,
                color: getScoreColor(score)
              }}
            />
            <Box>
              <Typography variant="h4" gutterBottom>
                Quiz Results
              </Typography>
              <Typography variant="h6" color={getScoreColor(score)}>
                Your Score: {score}%
              </Typography>
            </Box>
          </Box>

          <List>
            {questions.map((question, index) => (
              <React.Fragment key={index}>
                {renderAnswer(question, answers[index], index)}
                {index < questions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate('/dashboard')}
              fullWidth
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => navigate('/quiz')}
              fullWidth
            >
              Take Another Quiz
            </Button>
          </Box>
        </GlassPaper>
      </motion.div>
    </PageContainer>
  );
}

export default Results; 