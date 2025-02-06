export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        return {
          message: error.response.data.error || 'Invalid request',
          severity: 'warning'
        };
      case 401:
        // Handle unauthorized access
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
        return {
          message: 'Session expired. Please login again.',
          severity: 'error'
        };
      case 404:
        return {
          message: 'Resource not found',
          severity: 'error'
        };
      case 429:
        return {
          message: 'Too many requests. Please try again later.',
          severity: 'warning'
        };
      default:
        return {
          message: 'Something went wrong. Please try again.',
          severity: 'error'
        };
    }
  } else if (error.request) {
    // No response received
    return {
      message: 'Network error. Please check your connection.',
      severity: 'error'
    };
  } else {
    // Error in request setup
    return {
      message: error.message || 'An unexpected error occurred',
      severity: 'error'
    };
  }
};

export const handleTranscriptError = (error) => {
  if (error.message.includes('Video unavailable')) {
    return {
      message: 'This video is unavailable or does not have captions.',
      severity: 'error'
    };
  }
  if (error.message.includes('Invalid YouTube URL')) {
    return {
      message: 'Please enter a valid YouTube video URL.',
      severity: 'warning'
    };
  }
  return handleApiError(error);
};

export const handleQuizGenerationError = (error) => {
  if (error.message.includes('API rate limit')) {
    return {
      message: 'Quiz generation limit reached. Please try again later.',
      severity: 'warning'
    };
  }
  if (error.message.includes('Content too long')) {
    return {
      message: 'Video content is too long. Please choose a shorter video.',
      severity: 'warning'
    };
  }
  return handleApiError(error);
}; 