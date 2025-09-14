'use client';

import React, { useState } from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface AllQuestionsDisplayProps {
  questions: Question[];
  responses: Record<number, string>;
  onResponseChange: (questionId: number, value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  errors: Record<number, string>;
}

export default function AllQuestionsDisplay({
  questions,
  responses,
  onResponseChange,
  onSubmit,
  submitting,
  errors,
}: AllQuestionsDisplayProps) {
  const validateForm = () => {
    const newErrors: Record<number, string> = {};
    
    questions.forEach(question => {
      if (question.is_required && (!responses[question.id] || responses[question.id].trim() === '')) {
        newErrors[question.id] = 'This field is required';
      }
    });

    return Object.keys(newErrors).length === 0;
  };

  const getAnsweredQuestions = () => {
    return questions.filter(q => responses[q.id] && responses[q.id].trim() !== '').length;
  };

  const progress = (getAnsweredQuestions() / questions.length) * 100;

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
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
            placeholder="Enter your answer"
            rows={4}
            error={error}
          />
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center text-gray-900 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onResponseChange(question.id, e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">{option.label}</span>
              </label>
            ))}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center text-gray-900 cursor-pointer">
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
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">{option.label}</span>
              </label>
            ))}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      
      case 'select':
        return (
          <div>
            <select
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="" className="text-gray-500">Select an option</option>
              {question.options?.map((option, index) => (
                <option key={index} value={option.value} className="text-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Progress: {getAnsweredQuestions()} of {questions.length} questions answered
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* All Questions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {index + 1}. {question.question_text}
                    {question.is_required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  {question.question_description && (
                    <p className="mt-1 text-sm text-gray-600">{question.question_description}</p>
                  )}
                </div>
                {renderQuestion(question)}
              </div>
            ))}

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                loading={submitting}
                className="px-8"
              >
                Submit Survey
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}