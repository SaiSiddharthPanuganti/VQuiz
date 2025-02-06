import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { YouTube } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageContainer, GlassPaper, FormContainer } from '../styles/StyledComponents';

function VideoInput({ onSubmit }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(url);
    } catch (error) {
      setError(error.message || 'Failed to process video URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <GlassPaper>
          <YouTube sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Enter Video URL
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormContainer component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="YouTube URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={loading}
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Processing...' : 'Generate Quiz'}
            </Button>
          </FormContainer>
        </GlassPaper>
      </motion.div>
    </PageContainer>
  );
}

export default VideoInput; 