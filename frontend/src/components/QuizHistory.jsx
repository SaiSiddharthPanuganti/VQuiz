import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Button,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  AccessTime,
  Grade,
  EmojiEvents,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageContainer, GlassPaper } from '../styles/StyledComponents';
import api from '../services/api';

function QuizHistory() {
  const [quizzes, setQuizzes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      const response = await api.getQuizHistory();
      setQuizzes(response.quizzes);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
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
            <EmojiEvents sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4">Quiz History</Typography>
          </Box>

          <List sx={{ width: '100%' }}>
            {quizzes.map((quiz) => (
              <React.Fragment key={quiz.id}>
                <Paper
                  elevation={3}
                  sx={{
                    mb: 2,
                    overflow: 'hidden',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <ListItem
                    button
                    onClick={() => handleExpand(quiz.id)}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2,
                      p: 2
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {quiz.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<Grade />}
                          label={`Score: ${quiz.score}%`}
                          color={getScoreColor(quiz.score)}
                          variant="outlined"
                        />
                        <Chip
                          icon={<AccessTime />}
                          label={new Date(quiz.date).toLocaleDateString()}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <IconButton>
                      {expandedId === quiz.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </ListItem>

                  <Collapse in={expandedId === quiz.id} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Questions Review:
                      </Typography>
                      <List>
                        {quiz.questions.map((question, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              gap: 1
                            }}
                          >
                            <ListItemText
                              primary={question.question}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color={question.isCorrect ? 'success.main' : 'error.main'}
                                  >
                                    Your answer: {question.userAnswer}
                                  </Typography>
                                  {!question.isCorrect && (
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="success.main"
                                      sx={{ display: 'block' }}
                                    >
                                      Correct answer: {question.correctAnswer}
                                    </Typography>
                                  )}
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Collapse>
                </Paper>
              </React.Fragment>
            ))}
          </List>

          {quizzes.length === 0 && !loading && (
            <Box
              sx={{
                textAlign: 'center',
                p: 4
              }}
            >
              <Typography variant="h6" gutterBottom>
                No Quiz History Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Take your first quiz to see your history here!
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/dashboard'}
                sx={{ mt: 2 }}
              >
                Start a Quiz
              </Button>
            </Box>
          )}
        </GlassPaper>
      </motion.div>
    </PageContainer>
  );
}

export default QuizHistory; 