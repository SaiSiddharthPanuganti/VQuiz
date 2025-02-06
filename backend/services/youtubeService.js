const { YoutubeTranscript } = require('youtube-transcript');
const axios = require('axios');

// Extract video ID from URL
const getVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    let videoId;

    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    }

    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    return videoId;
  } catch (error) {
    throw new Error('Invalid YouTube URL');
  }
};

const getTranscript = async (videoUrl) => {
  try {
    const videoId = getVideoId(videoUrl);
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
};

const getVideoInfo = async (url) => {
  try {
    const videoId = getVideoId(url);
    const response = await axios.get(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`);
    
    return {
      title: response.data.title,
      author: response.data.author_name,
      thumbnailUrl: response.data.thumbnail_url
    };
  } catch (error) {
    console.error('Error getting video info:', error);
    // Return a default object if video info can't be fetched
    return {
      title: 'YouTube Quiz',
      author: 'Unknown',
      thumbnailUrl: null
    };
  }
};

module.exports = {
  getTranscript,
  getVideoInfo,
  getVideoId
}; 