import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

function TeacherDashboard() {
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
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 2,
            maxWidth: '800px'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome, Teacher!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your teacher dashboard is coming soon...
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default TeacherDashboard; 