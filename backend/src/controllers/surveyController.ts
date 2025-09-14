import { Request, Response } from 'express';
import { query } from '../utils/database';
import { CreateSurveyDto, SurveyWithQuestions, SubmitResponseDto } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';

export const createSurvey = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, questions }: CreateSurveyDto = req.body;
    const userId = req.userId!;

    // Begin transaction
    await query('BEGIN');

    try {
      // Create survey
      const surveyResult = await query(
        'INSERT INTO surveys (title, description, created_by) VALUES ($1, $2, $3) RETURNING id',
        [title, description, userId]
      );
      const surveyId = surveyResult.rows[0].id;

      // Create questions
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        await query(
          'INSERT INTO questions (survey_id, question_text, question_description, question_type, options, is_required, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            surveyId,
            question.question_text,
            question.question_description,
            question.question_type,
            question.options ? JSON.stringify(question.options) : null,
            question.is_required,
            i + 1
          ]
        );
      }

      await query('COMMIT');

      res.status(201).json({
        message: 'Survey created successfully',
        surveyId
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Create survey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSurveys = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT s.*, u.first_name, u.last_name FROM surveys s JOIN users u ON s.created_by = u.id WHERE s.is_active = true ORDER BY s.created_at DESC'
    );

    res.json({ surveys: result.rows });
  } catch (error) {
    console.error('Get surveys error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSurveyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get survey
    const surveyResult = await query(
      'SELECT s.*, u.first_name, u.last_name FROM surveys s JOIN users u ON s.created_by = u.id WHERE s.id = $1 AND s.is_active = true',
      [id]
    );

    if (surveyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Get questions
    const questionsResult = await query(
      'SELECT id, question_text, question_description, question_type, options, is_required, order_index FROM questions WHERE survey_id = $1 ORDER BY order_index',
      [id]
    );

    const survey: SurveyWithQuestions = {
      ...surveyResult.rows[0],
      questions: questionsResult.rows.map(q => ({
        ...q,
        options: q.options || null
      }))
    };

    res.json({ survey });
  } catch (error) {
    console.error('Get survey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitResponse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { survey_id, responses }: SubmitResponseDto = req.body;
    const userId = req.userId!;

    // Check if user already submitted
    const existingResponse = await query(
      'SELECT id FROM survey_responses WHERE survey_id = $1 AND user_id = $2',
      [survey_id, userId]
    );

    if (existingResponse.rows.length > 0) {
      return res.status(400).json({ error: 'You have already submitted a response to this survey' });
    }

    // Begin transaction
    await query('BEGIN');

    try {
      // Create survey response
      const responseResult = await query(
        'INSERT INTO survey_responses (survey_id, user_id) VALUES ($1, $2) RETURNING id',
        [survey_id, userId]
      );
      const surveyResponseId = responseResult.rows[0].id;

      // Create question responses
      for (const response of responses) {
        await query(
          'INSERT INTO question_responses (survey_response_id, question_id, response_value) VALUES ($1, $2, $3)',
          [surveyResponseId, response.question_id, response.response_value]
        );
      }

      await query('COMMIT');

      res.status(201).json({
        message: 'Response submitted successfully',
        responseId: surveyResponseId
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserResponses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const result = await query(
      `SELECT 
        sr.id as response_id,
        sr.submitted_at,
        s.id as survey_id,
        s.title as survey_title,
        s.description as survey_description,
        json_agg(
          json_build_object(
            'question_id', q.id,
            'question_text', q.question_text,
            'question_type', q.question_type,
            'response_value', qr.response_value
          ) ORDER BY q.order_index
        ) as responses
      FROM survey_responses sr
      JOIN surveys s ON sr.survey_id = s.id
      JOIN question_responses qr ON sr.id = qr.survey_response_id
      JOIN questions q ON qr.question_id = q.id
      WHERE sr.user_id = $1
      GROUP BY sr.id, s.id
      ORDER BY sr.submitted_at DESC`
    , [userId]);

    res.json({ responses: result.rows });
  } catch (error) {
    console.error('Get user responses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getResponseById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const result = await query(
      `SELECT 
        sr.id as response_id,
        sr.submitted_at,
        s.id as survey_id,
        s.title as survey_title,
        s.description as survey_description,
        json_agg(
          json_build_object(
            'question_id', q.id,
            'question_text', q.question_text,
            'question_description', q.question_description,
            'question_type', q.question_type,
            'response_value', qr.response_value
          ) ORDER BY q.order_index
        ) as responses
      FROM survey_responses sr
      JOIN surveys s ON sr.survey_id = s.id
      JOIN question_responses qr ON sr.id = qr.survey_response_id
      JOIN questions q ON qr.question_id = q.id
      WHERE sr.id = $1 AND sr.user_id = $2
      GROUP BY sr.id, s.id`
    , [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.json({ response: result.rows[0] });
  } catch (error) {
    console.error('Get response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
