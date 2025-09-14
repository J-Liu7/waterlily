export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Survey {
  id: number;
  title: string;
  description?: string;
  created_by: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: number;
  survey_id: number;
  question_text: string;
  question_description?: string;
  question_type: QuestionType;
  options?: QuestionOption[];
  is_required: boolean;
  order_index: number;
  created_at: Date;
}

export interface QuestionOption {
  value: string;
  label: string;
}

export type QuestionType = 
  | 'text' 
  | 'textarea' 
  | 'radio' 
  | 'checkbox' 
  | 'select' 
  | 'number' 
  | 'email' 
  | 'date';

export interface SurveyResponse {
  id: number;
  survey_id: number;
  user_id: number;
  submitted_at: Date;
}

export interface QuestionResponse {
  id: number;
  survey_response_id: number;
  question_id: number;
  response_value: string;
  created_at: Date;
}

// DTOs for API
export interface CreateUserDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateSurveyDto {
  title: string;
  description?: string;
  questions: CreateQuestionDto[];
}

export interface CreateQuestionDto {
  question_text: string;
  question_description?: string;
  question_type: QuestionType;
  options?: QuestionOption[];
  is_required: boolean;
}

export interface SubmitResponseDto {
  survey_id: number;
  responses: {
    question_id: number;
    response_value: string;
  }[];
}

export interface SurveyWithQuestions extends Survey {
  questions: Question[];
}

export interface SurveyResponseWithAnswers extends SurveyResponse {
  survey: Survey;
  answers: (QuestionResponse & { question: Question })[];
}
