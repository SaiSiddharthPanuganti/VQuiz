const geminiService = require('./geminiService');
const { YoutubeTranscript } = require('youtube-transcript');

class QuizGenerator {
  async getTranscript(videoUrl) {
    try {
      // Extract video ID from URL
      let videoId = videoUrl;
      if (videoUrl.includes('watch?v=')) {
        videoId = videoUrl.split('watch?v=')[1].split('&')[0];
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1];
      }

      // Fetch transcript
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      
      // Combine all text segments and limit to a reasonable length
      const fullText = transcript
        .map(item => item.text)
        .join(' ')
        .slice(0, 5000); // Limit to 5000 characters to avoid token limits
      
      return fullText;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      if (error.message.includes('Could not find any transcripts')) {
        throw new Error('This video does not have captions/transcript available');
      }
      throw new Error('Failed to fetch video transcript');
    }
  }

  async generateQuiz(videoUrl, preferences) {
    try {
      const transcript = await this.getTranscript(videoUrl);
      
      if (!transcript || transcript.trim().length === 0) {
        throw new Error('No transcript content available');
      }

      const questions = await geminiService.generateQuestions(transcript, preferences);
      return questions;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error; // Propagate the specific error message
    }
  }
}

module.exports = new QuizGenerator(); 