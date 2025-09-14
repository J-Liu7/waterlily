'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { SurveyResponse } from '@/types';
import { surveyApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ResponsesPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await surveyApi.getUserResponses();
        setResponses(response.responses || []);
      } catch (error) {
        console.error('Failed to fetch responses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchResponses();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Survey App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user.first_name} {user.last_name}
              </span>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">My Survey Responses</h2>
            <p className="mt-2 text-gray-600">
              View all the surveys you have completed and your responses.
            </p>
          </div>

          {responses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">You haven't submitted any survey responses yet.</p>
              <Link href="/dashboard">
                <Button>Browse Available Surveys</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {responses.map((response) => (
                <div
                  key={response.response_id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {response.survey_title}
                        </h3>
                        {response.survey_description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {response.survey_description}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Submitted: {new Date(response.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {response.responses.slice(0, 3).map((answer, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <p className="font-medium text-gray-900 text-sm">
                            {answer.question_text}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {answer.response_value.length > 100 
                              ? `${answer.response_value.substring(0, 100)}...`
                              : answer.response_value
                            }
                          </p>
                        </div>
                      ))}
                      {response.responses.length > 3 && (
                        <p className="text-sm text-gray-500 italic">
                          ... and {response.responses.length - 3} more responses
                        </p>
                      )}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Link href={`/responses/${response.response_id}`}>
                        <Button variant="outline">
                          View Full Response
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}