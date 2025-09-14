import express from 'express';
import {
  createSurvey,
  getSurveys,
  getSurveyById,
  submitResponse,
  getUserResponses,
  getResponseById
} from '../controllers/surveyController';
import { authenticateToken } from '../middleware/auth';
import { validateSurveyCreation, validateSurveyResponse } from '../middleware/validation';

const router = express.Router();

// Survey management
router.post('/', authenticateToken, validateSurveyCreation, createSurvey);
router.get('/', getSurveys);
router.get('/:id', getSurveyById);

// Response management
router.post('/:id/responses', authenticateToken, validateSurveyResponse, submitResponse);
router.get('/responses/my', authenticateToken, getUserResponses);
router.get('/responses/:id', authenticateToken, getResponseById);

export default router;
