export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface Survey {
  id: number;
  title: string;
  description?: string;
  created_by: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
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
  created_at: string;
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

export interface SurveyWithQuestions extends Survey {
  questions: Question[];
}

export interface SurveyResponse {
  response_id: number;
  submitted_at: string;
  survey_id: number;
  survey_title: string;
  survey_description?: string;
  responses: {
    question_id: number;
    question_text: string;
    question_description?: string;
    question_type: QuestionType;
    response_value: string;
  }[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  token: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  message?: string;
  error?: string;
  user?: User;
  token?: string;
  survey?: T;
  surveys?: T[];
  responses?: T[];
  response?: T;
}
