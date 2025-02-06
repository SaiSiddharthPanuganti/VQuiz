const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    try {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log('Gemini API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini API:', error);
      throw new Error('Failed to initialize Gemini service');
    }
  }

  async generateQuestions(transcript, preferences) {
    console.log('Generating questions with preferences:', preferences);
    
    try {
      await this.checkInternetConnection();
      
      const prompt = this.buildPrompt(transcript, preferences);
      
      console.log('Sending prompt to Gemini API...');
      
      const result = await this.model.generateContent(prompt);
      console.log('Received response from Gemini API');
      
      const text = result.response.text();
      
      console.log('Raw response text:', text);
      
      // Extract and clean JSON
      const cleanedText = this.cleanResponse(text);
      
      console.log('Cleaned text:', cleanedText);

      let questions;
      try {
        questions = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Attempting to fix malformed JSON...');
        const fixedJson = this.attemptToFixJson(cleanedText);
        questions = JSON.parse(fixedJson);
      }

      // Validate and fix questions
      const validatedQuestions = questions.map((q, index) => {
        // Basic structure validation
        if (!q || typeof q !== 'object') {
          throw new Error(`Question ${index + 1} is not properly structured`);
        }

        // Ensure all required fields exist
        const requiredFields = ['question', 'options', 'correctAnswer', 'explanation'];
        for (const field of requiredFields) {
          if (!q[field]) {
            throw new Error(`Question ${index + 1} is missing the required field: ${field}`);
          }
        }

        // Ensure options is an array with exactly 4 options
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Question ${index + 1} must have exactly 4 options`);
        }

        // Ensure all options are strings and not empty
        q.options = q.options.map(opt => String(opt).trim());
        if (q.options.some(opt => !opt)) {
          throw new Error(`Question ${index + 1} has empty options`);
        }

        // Fix correct answer if it's not in options
        if (!q.options.includes(q.correctAnswer)) {
          console.log(`Fixing correct answer for question ${index + 1}`);
          q.correctAnswer = q.options[0];
          q.explanation = `${q.explanation} (Note: Answer corrected to: ${q.correctAnswer})`;
        }

        return {
          question: String(q.question).trim(),
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: String(q.explanation).trim()
        };
      });

      console.log('Successfully validated all questions');
      
      return validatedQuestions;
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error.message.includes('No internet connection')) {
        throw error;
      }
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  buildPrompt(transcript, preferences) {
    const { questionType = 'multiple-choice', numberOfQuestions = 5, difficulty = 'medium' } = preferences;

    return `
      You are a quiz generator. Generate ${numberOfQuestions} ${difficulty} difficulty multiple-choice questions based on this content. 
      The response must be in valid JSON format.

      Content: "${transcript.substring(0, 2000)}"

      Rules:
      1. Each question MUST have exactly 4 options
      2. The correctAnswer MUST be exactly matching one of the options
      3. All questions must be factual and based on the content
      4. Provide clear explanations
      5. Return ONLY the JSON array, no additional text

      Format your response exactly like this:
      [
        {
          "question": "What is...?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "explanation": "This is correct because..."
        }
      ]
    `;
  }

  cleanResponse(text) {
    // Find the first [ and last ]
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']') + 1;
    
    if (start === -1 || end === 0) {
      throw new Error('Could not find valid JSON array in response');
    }

    return text.slice(start, end);
  }

  attemptToFixJson(text) {
    // Remove any markdown code block markers
    text = text.replace(/```json/g, '').replace(/```/g, '');
    
    // Remove any non-JSON text before [ and after ]
    text = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
    
    // Fix common JSON issues
    text = text
      .replace(/\n/g, ' ')
      .replace(/,\s*]/g, ']')
      .replace(/,\s*}/g, '}')
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
      .replace(/:\s*(['"])?([^{}\[\],:]+)(['"])?\s*(,|}])/g, ': "$2"$4');
    
    return text;
  }

  async checkInternetConnection() {
    try {
      await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: 'no-store'
      });
    } catch (error) {
      console.error('Internet connection check failed:', error);
      throw new Error('No internet connection');
    }
  }
}

module.exports = new GeminiService(); 