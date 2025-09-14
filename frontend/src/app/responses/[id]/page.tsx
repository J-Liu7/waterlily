'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { SurveyResponse } from '@/types';
import { surveyApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface ResponseDetailPageProps {
  params: {
    id: string;
  };
}

export default function ResponseDetailPage({ params }: ResponseDetailPageProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const result = await surveyApi.getResponseById(parseInt(params.id));
        setResponse(result.response || null);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        router.push('/responses');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchResponse();
    }
  }, [user, params.id, router]);

  const renderAnswer = (answer: any) => {
    switch (answer.question_type) {
      case 'checkbox':
        const values = answer.response_value.split(',').filter((v: string) => v.trim());
        return (
          <ul className="list-disc list-inside">
            {values.map((value: string, index: number) => (
              <li key={index} className="text-gray-700">{value}</li>
            ))}
          </ul>
        );
      case 'textarea':
        return (
          <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border">
            {answer.response_value}
          </div>
        );
      default:
        return <p className="text-gray-700">{answer.response_value}</p>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !response) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/responses')}
                className="mr-4"
              >
                ← Back to My Responses
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Survey Response</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <div className="mb-8 border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {response.survey_title}
                </h1>
                {response.survey_description && (
                  <p className="mt-2 text-gray-600">{response.survey_description}</p>
                )}
                <div className="mt-4 text-sm text-gray-500">
                  <p>Submitted on: {new Date(response.submitted_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-8">
                {response.responses.map((answer, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {index + 1}. {answer.question_text}
                      </h3>
                      {answer.question_description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {answer.question_description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      {renderAnswer(answer)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push('/responses')}
                >
                  Back to All Responses
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                >
                  Take Another Survey
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}