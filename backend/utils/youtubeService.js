const ytdl = require('ytdl-core');
const { YoutubeTranscript } = require('youtube-transcript');

class YoutubeService {
  async getTranscript(youtubeLink) {
    try {
      // Validate YouTube URL
      if (!ytdl.validateURL(youtubeLink)) {
        throw new Error('Invalid YouTube URL');
      }

      // Get video ID
      const videoId = ytdl.getVideoID(youtubeLink);

      // Get transcript
      const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);
      
      if (!transcriptArray || transcriptArray.length === 0) {
        throw new Error('No transcript available for this video');
      }

      // Combine transcript text
      const transcriptText = transcriptArray
        .map(item => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      return transcriptText;

    } catch (error) {
      console.error('YouTube transcript error:', error);
      throw new Error('Failed to get video transcript: ' + error.message);
    }
  }
}

module.exports = YoutubeService; 