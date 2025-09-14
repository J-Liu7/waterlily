'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { SurveyWithQuestions, Question } from '@/types';
import { surveyApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import SingleQuestionDisplay from '@/components/survey/SingleQuestionDisplay';
import AllQuestionsDisplay from '@/components/survey/AllQuestionsDisplay';
import { Layout, List } from 'lucide-react';

interface SurveyPageProps {
  params: {
    id: string;
  };
}

export default function SurveyPage({ params }: SurveyPageProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [survey, setSurvey] = useState<SurveyWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await surveyApi.getSurveyById(parseInt(params.id));
        setSurvey(response.survey || null);
      } catch (error) {
        console.error('Failed to fetch survey:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSurvey();
    }
  }, [user, params.id, router]);

  const handleInputChange = (questionId: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<number, string> = {};
    
    survey?.questions.forEach(question => {
      if (question.is_required && (!responses[question.id] || responses[question.id].trim() === '')) {
        newErrors[question.id] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const responsesArray = Object.entries(responses).map(([questionId, value]) => ({
        question_id: parseInt(questionId),
        response_value: value
      }));

      await surveyApi.submitResponse(survey!.id, responsesArray);
      router.push(`/survey/${survey!.id}/success`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit survey');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    // This method is no longer used as we're using the new display components
    return null;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !survey) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="mr-4"
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Survey</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'single' ? 'default' : 'outline'}
                onClick={() => setViewMode('single')}
                size="sm"
                className="flex items-center"
              >
                <Layout className="w-4 h-4 mr-2" />
                Single Question
              </Button>
              <Button
                variant={viewMode === 'all' ? 'default' : 'outline'}
                onClick={() => setViewMode('all')}
                size="sm"
                className="flex items-center"
              >
                <List className="w-4 h-4 mr-2" />
                All Questions
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
            {survey.description && (
              <p className="mt-2 text-gray-600 max-w-3xl mx-auto">{survey.description}</p>
            )}
          </div>

          {viewMode === 'single' ? (
            <SingleQuestionDisplay
              questions={survey.questions}
              responses={responses}
              onResponseChange={handleInputChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              errors={errors}
            />
          ) : (
            <AllQuestionsDisplay
              questions={survey.questions}
              responses={responses}
              onResponseChange={handleInputChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              errors={errors}
            />
          )}
        </div>
      </main>
    </div>
  );
}
