const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuiz = async (transcript, preferences) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Generate a ${preferences.difficulty} level quiz with ${preferences.numberOfQuestions} questions 
      based on the following transcript. The quiz should be in ${preferences.quizType} format.
      
      Transcript: "${transcript}"
      
      Format the response as a JSON object with the following structure based on quiz type:
      
      For MCQ:
      {
        "questions": [{
          "question": "question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": "correct option",
          "explanation": "explanation"
        }]
      }
      
      For True/False:
      {
        "questions": [{
          "question": "statement",
          "correctAnswer": true/false,
          "explanation": "explanation"
        }]
      }
      
      For Fill in the Blanks:
      {
        "questions": [{
          "question": "sentence with ___ for blank",
          "correctAnswer": "answer",
          "explanation": "explanation"
        }]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const quiz = JSON.parse(response.text());

    return quiz;
  } catch (error) {
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
};

module.exports = { generateQuiz }; 