import React from 'react';
import {
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { EmojiEvents, CheckCircle, Cancel } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageContainer, GlassPaper, FormContainer } from '../styles/StyledComponents';

function Results({ results, onRetry }) {
  const score = (results.correctAnswers / results.totalQuestions) * 100;
  
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <GlassPaper>
          <EmojiEvents sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Quiz Results
          </Typography>

          <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
            <Typography variant="h2" color="primary" gutterBottom>
              {Math.round(score)}%
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </Typography>
          </Box>

          <FormContainer>
            <List sx={{ width: '100%' }}>
              {results.questions.map((question, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      flexDirection: 'column',
                      gap: 1,
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      borderRadius: 2,
                      mb: 2,
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      {question.isCorrect ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Cancel color="error" />
                      )}
                      <ListItemText
                        primary={`Question ${index + 1}`}
                        secondary={question.question}
                      />
                    </Box>

                    <Box sx={{ width: '100%', pl: 4 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Your answer: 
                        <Chip
                          label={question.userAnswer}
                          size="small"
                          color={question.isCorrect ? "success" : "error"}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      {!question.isCorrect && (
                        <Typography variant="body2" color="success.main">
                          Correct answer: {question.correctAnswer}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {question.explanation}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < results.questions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={onRetry}
                fullWidth
              >
                Try Another Quiz
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.print()}
                fullWidth
              >
                Save Results
              </Button>
            </Box>
          </FormContainer>
        </GlassPaper>
      </motion.div>
    </PageContainer>
  );
}

export default Results; 