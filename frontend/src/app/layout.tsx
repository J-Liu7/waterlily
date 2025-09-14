import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Survey App',
  description: 'A modern survey application built with Next.js',
  keywords: ['survey', 'forms', 'data collection', 'feedback'],
  authors: [{ name: 'Survey App Team' }],
  openGraph: {
    title: 'Survey App',
    description: 'A modern survey application built with Next.js',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
