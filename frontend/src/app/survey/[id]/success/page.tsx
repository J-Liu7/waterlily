'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SurveySuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Survey Submitted Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for taking the time to complete this survey. Your responses have been recorded.
        </p>
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/responses">
            <Button variant="outline" className="w-full">
              View My Responses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}