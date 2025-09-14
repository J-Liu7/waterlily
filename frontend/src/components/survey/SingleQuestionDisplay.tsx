'use client';

import React, { useState } from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SingleQuestionDisplayProps {
  questions: Question[];
  responses: Record<number, string>;
  onResponseChange: (questionId: number, value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  errors: Record<number, string>;
}

export default function SingleQuestionDisplay({
  questions,
  responses,
  onResponseChange,
  onSubmit,
  submitting,
  errors,
}: SingleQuestionDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isCurrentQuestionValid = () => {
    const response = responses[currentQuestion.id];
    if (currentQuestion.is_required) {
      return response && response.trim() !== '';
    }
    return true;
  };

  const canProceed = () => {
    return isCurrentQuestionValid();
  };

  const getAnsweredQuestions = () => {
    return questions.filter(q => responses[q.id] && responses[q.id].trim() !== '').length;
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || '';
    const error = errors[question.id];

    switch (question.question_type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <Input
            type={question.question_type}
            value={value}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
            placeholder="Enter your answer"
            error={error}
            className="text-lg py-3"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
            placeholder="Enter your answer"
            rows={6}
            error={error}
            className="text-lg py-3"
          />
        );
      
      case 'radio':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onResponseChange(question.id, e.target.value)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-900">{option.label}</span>
              </label>
            ))}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={value.split(',').includes(option.value)}
                  onChange={(e) => {
                    const currentValues = value ? value.split(',').filter(v => v) : [];
                    if (e.target.checked) {
                      currentValues.push(option.value);
                    } else {
                      const index = currentValues.indexOf(option.value);
                      if (index > -1) {
                        currentValues.splice(index, 1);
                      }
                    }
                    onResponseChange(question.id, currentValues.join(','));
                  }}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-900">{option.label}</span>
              </label>
            ))}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        );
      
      case 'select':
        return (
          <div>
            <select
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="" className="text-gray-500">Select an option</option>
              {question.options?.map((option, index) => (
                <option key={index} value={option.value} className="text-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        );
      
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {getAnsweredQuestions()} of {totalQuestions} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentQuestion.question_text}
            {currentQuestion.is_required && <span className="text-red-500 ml-1">*</span>}
          </h2>
          {currentQuestion.question_description && (
            <p className="text-gray-600 text-lg">{currentQuestion.question_description}</p>
          )}
        </div>

        <div className="mb-8">
          {renderQuestion(currentQuestion)}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={onSubmit}
              loading={submitting}
              className="flex items-center px-8"
              disabled={!canProceed()}
            >
              Submit Survey
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Question Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Progress</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`
                w-8 h-8 rounded-full text-sm font-medium transition-colors
                ${index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : responses[questions[index].id] && responses[questions[index].id].trim() !== ''
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}