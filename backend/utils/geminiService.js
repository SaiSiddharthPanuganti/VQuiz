const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateQuestions(transcript, preferences) {
    // Check internet connectivity first
    try {
      await this.checkInternetConnection();
    } catch (error) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    const { questionType, numberOfQuestions, difficulty } = preferences;
    
    const prompt = `
    You are a quiz generator. Generate ${numberOfQuestions} ${questionType} questions based on this transcript: "${transcript}"
    
    Requirements:
    - Difficulty level: ${difficulty}
    - Each question must be relevant to the transcript content
    - For MCQ, provide exactly 4 options
    - Ensure all answers are clear and unambiguous
    
    Return ONLY a valid JSON array with this exact structure:
    [
      {
        "question": "question text here",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "exact correct option text",
        "explanation": "brief explanation"
      }
    ]

    Important: Ensure the response is ONLY the JSON array, no additional text or markdown formatting.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to ensure valid JSON
      let cleanedText = text
        .trim()
        // Remove markdown code blocks if present
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        // Remove any leading/trailing whitespace
        .trim();

      try {
        const parsedQuestions = JSON.parse(cleanedText);
        
        // Validate the structure of each question
        const validatedQuestions = parsedQuestions.map(q => ({
          question: String(q.question || ''),
          options: Array.isArray(q.options) ? q.options.map(String) : [],
          correctAnswer: String(q.correctAnswer || ''),
          explanation: String(q.explanation || '')
        }));

        // Ensure we have the correct number of questions
        return validatedQuestions.slice(0, numberOfQuestions);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw Response:', text);
        throw new Error('Failed to parse generated questions. Please try again.');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error.message.includes('No internet connection')) {
        throw error;
      }
      throw new Error('Failed to generate questions. Please try again later.');
    }
  }

  // Helper method to check internet connectivity
  async checkInternetConnection() {
    try {
      await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: 'no-store'
      });
    } catch (error) {
      throw new Error('No internet connection');
    }
  }
}

module.exports = new GeminiService(); 