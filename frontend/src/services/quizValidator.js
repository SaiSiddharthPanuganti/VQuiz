export const validateQuizSubmission = (answers, quiz) => {
  const errors = [];

  // Check if all questions are answered
  if (Object.keys(answers).length !== quiz.questions.length) {
    errors.push('Please answer all questions before submitting');
  }

  // Validate answers based on quiz type
  Object.entries(answers).forEach(([index, answer]) => {
    const question = quiz.questions[index];
    
    switch (quiz.quizType) {
      case 'mcq':
        if (!question.options.includes(answer)) {
          errors.push(`Invalid answer for question ${Number(index) + 1}`);
        }
        break;
        
      case 'true_false':
        if (typeof answer !== 'boolean') {
          errors.push(`Invalid answer format for question ${Number(index) + 1}`);
        }
        break;
        
      case 'fill_blanks':
        if (typeof answer !== 'string' || answer.trim() === '') {
          errors.push(`Empty answer for question ${Number(index) + 1}`);
        }
        break;
        
      default:
        errors.push(`Unsupported quiz type: ${quiz.quizType}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateScore = (answers, quiz) => {
  let correctAnswers = 0;

  Object.entries(answers).forEach(([index, answer]) => {
    const question = quiz.questions[index];
    
    switch (quiz.quizType) {
      case 'mcq':
      case 'true_false':
        if (answer === question.correctAnswer) {
          correctAnswers++;
        }
        break;
        
      case 'fill_blanks':
        if (answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          correctAnswers++;
        }
        break;
    }
  });

  return (correctAnswers / quiz.questions.length) * 100;
}; 