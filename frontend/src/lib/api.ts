import axios, { AxiosResponse } from 'axios';
import { User, Survey, SurveyWithQuestions, SurveyResponse, RegisterData, LoginData, ApiResponse } from '@/types';
import { API_URL } from '@/lib/env';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (userData: RegisterData): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (loginData: LoginData): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/auth/login', loginData);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/profile');
    return response.data;
  },
};

// Survey API
export const surveyApi = {
  createSurvey: async (surveyData: {
    title: string;
    description?: string;
    questions: {
      question_text: string;
      question_description?: string;
      question_type: string;
      options?: { value: string; label: string }[];
      is_required: boolean;
    }[];
  }): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post('/surveys', surveyData);
    return response.data;
  },

  getSurveys: async (): Promise<ApiResponse<Survey>> => {
    const response: AxiosResponse<ApiResponse<Survey>> = await api.get('/surveys');
    return response.data;
  },

  getSurveyById: async (id: number): Promise<ApiResponse<SurveyWithQuestions>> => {
    const response: AxiosResponse<ApiResponse<SurveyWithQuestions>> = await api.get(`/surveys/${id}`);
    return response.data;
  },

  submitResponse: async (surveyId: number, responses: { question_id: number; response_value: string }[]): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post(`/surveys/${surveyId}/responses`, {
      survey_id: surveyId,
      responses,
    });
    return response.data;
  },

  getUserResponses: async (): Promise<ApiResponse<SurveyResponse>> => {
    const response: AxiosResponse<ApiResponse<SurveyResponse>> = await api.get('/surveys/responses/my');
    return response.data;
  },

  getResponseById: async (id: number): Promise<ApiResponse<SurveyResponse>> => {
    const response: AxiosResponse<ApiResponse<SurveyResponse>> = await api.get(`/surveys/responses/${id}`);
    return response.data;
  },
};

export default api;
