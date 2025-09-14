'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { surveyApi } from '@/lib/api';
import { QuestionType, QuestionOption } from '@/types';

interface QuestionData {
  id: string;
  question_text: string;
  question_description: string;
  question_type: QuestionType;
  options: QuestionOption[];
  is_required: boolean;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const addQuestion = () => {
    const newQuestion: QuestionData = {
      id: Date.now().toString(),
      question_text: '',
      question_description: '',
      question_type: 'text',
      options: [],
      is_required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<QuestionData>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOption: QuestionOption = {
        value: '',
        label: '',
      };
      updateQuestion(questionId, {
        options: [...question.options, newOption]
      });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, updates: Partial<QuestionOption>) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = question.options.map((option, index) =>
        index === optionIndex ? { ...option, ...updates } : option
      );
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Survey title is required');
      return;
    }

    if (questions.length === 0) {
      setError('At least one question is required');
      return;
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question_text.trim()) {
        setError('All questions must have text');
        return;
      }
      
      if (['radio', 'checkbox', 'select'].includes(question.question_type)) {
        if (question.options.length === 0) {
          setError(`Question "${question.question_text}" requires at least one option`);
          return;
        }
        
        for (const option of question.options) {
          if (!option.value.trim() || !option.label.trim()) {
            setError(`All options for "${question.question_text}" must have value and label`);
            return;
          }
        }
      }
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const surveyData = {
        title: title.trim(),
        description: description.trim() || undefined,
        questions: questions.map(q => ({
          question_text: q.question_text.trim(),
          question_description: q.question_description.trim() || undefined,
          question_type: q.question_type,
          options: ['radio', 'checkbox', 'select'].includes(q.question_type) 
            ? q.options.filter(opt => opt.value.trim() && opt.label.trim())
            : undefined,
          is_required: q.is_required,
        }))
      };

      await surveyApi.createSurvey(surveyData);
      
      setSuccess('Survey created successfully!');
      setTitle('');
      setDescription('');
      setQuestions([]);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'radio', label: 'Multiple Choice (Single Select)' },
    { value: 'checkbox', label: 'Multiple Choice (Multi Select)' },
    { value: 'select', label: 'Dropdown' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'date', label: 'Date' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Survey Creator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Survey</h2>
            <p className="text-gray-600">
              Build a survey by adding questions and configuring their options.
            </p>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Survey Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Survey Information</h3>
              
              <Input
                label="Survey Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter survey title"
                required
              />
              
              <Textarea
                label="Survey Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter survey description (optional)"
                rows={3}
              />
            </div>

            {/* Questions */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                <Button type="button" onClick={addQuestion} variant="outline">
                  Add Question
                </Button>
              </div>

              {questions.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500">No questions added yet. Click "Add Question" to get started.</p>
                </div>
              )}

              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-gray-900">Question {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Question Text *"
                      value={question.question_text}
                      onChange={(e) => updateQuestion(question.id, { question_text: e.target.value })}
                      placeholder="Enter your question"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Type *</label>
                      <select
                        value={question.question_type}
                        onChange={(e) => updateQuestion(question.id, { 
                          question_type: e.target.value as QuestionType,
                          options: ['radio', 'checkbox', 'select'].includes(e.target.value) ? [] : []
                        })}
                        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      >
                        {questionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Textarea
                    label="Question Description"
                    value={question.question_description}
                    onChange={(e) => updateQuestion(question.id, { question_description: e.target.value })}
                    placeholder="Additional context or instructions (optional)"
                    rows={2}
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      checked={question.is_required}
                      onChange={(e) => updateQuestion(question.id, { is_required: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-700">
                      Required question
                    </label>
                  </div>

                  {/* Options for radio, checkbox, select */}
                  {['radio', 'checkbox', 'select'].includes(question.question_type) && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Options</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(question.id)}
                        >
                          Add Option
                        </Button>
                      </div>

                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <Input
                            placeholder="Option value"
                            value={option.value}
                            onChange={(e) => updateOption(question.id, optionIndex, { value: e.target.value })}
                          />
                          <Input
                            placeholder="Option label"
                            value={option.label}
                            onChange={(e) => updateOption(question.id, optionIndex, { label: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(question.id, optionIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}

                      {question.options.length === 0 && (
                        <p className="text-sm text-gray-500">No options added yet. Click "Add Option" to add choices.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!title.trim() || questions.length === 0}
              >
                Create Survey
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}