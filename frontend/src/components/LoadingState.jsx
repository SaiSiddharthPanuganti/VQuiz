import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';

function LoadingState({ message, progress, type = 'circular' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Paper
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          maxWidth: 400,
          mx: 'auto',
        }}
      >
        {type === 'circular' ? (
          <CircularProgress
            size={60}
            thickness={4}
            value={progress}
            variant={progress ? 'determinate' : 'indeterminate'}
          />
        ) : (
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              value={progress}
              variant={progress ? 'determinate' : 'indeterminate'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}
        
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
        
        {progress && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            {Math.round(progress)}% Complete
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
}

export default LoadingState; 