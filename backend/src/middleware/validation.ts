import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  next();
};

export const validateSurveyCreation = (req: Request, res: Response, next: NextFunction) => {
  const { title, questions } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Survey title is required' });
  }

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'At least one question is required' });
  }

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    if (!question.question_text || !question.question_text.trim()) {
      return res.status(400).json({ error: 'Question text is required' });
    }
    if (!question.question_type) {
      return res.status(400).json({ error: 'Question type is required' });
    }
  }

  next();
};

export const validateSurveyResponse = (req: Request, res: Response, next: NextFunction) => {
  const { survey_id, responses } = req.body;

  if (!survey_id || typeof survey_id !== 'number') {
    return res.status(400).json({ error: 'Valid survey_id is required' });
  }

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({ error: 'At least one response is required' });
  }

  for (const response of responses) {
    if (!response.question_id || typeof response.question_id !== 'number') {
      return res.status(400).json({ error: 'Valid question_id is required for each response' });
    }
    if (response.response_value === undefined || response.response_value === null) {
      return res.status(400).json({ error: 'Response value is required for each response' });
    }
  }

  next();
};
