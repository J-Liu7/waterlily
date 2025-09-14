/**
 * Environment configuration and validation
 */

interface EnvironmentConfig {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_APP_NAME?: string;
  NEXT_PUBLIC_APP_VERSION?: string;
}

const requiredEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
} as const;

const optionalEnvVars = {
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Survey App',
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
} as const;

/**
 * Validates that all required environment variables are present
 * @throws Error if any required environment variables are missing
 */
export function validateEnvironment(): void {
  // Since we have fallbacks, just validate the URL format
  if (requiredEnvVars.NEXT_PUBLIC_API_URL) {
    try {
      new URL(requiredEnvVars.NEXT_PUBLIC_API_URL);
    } catch {
      throw new Error('NEXT_PUBLIC_API_URL must be a valid URL');
    }
  }
}

/**
 * Gets the validated environment configuration
 * @returns EnvironmentConfig object with all environment variables
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  validateEnvironment();
  
  return {
    ...requiredEnvVars,
    ...optionalEnvVars,
  } as EnvironmentConfig;
}

/**
 * Environment configuration object
 */
export const env = getEnvironmentConfig();

/**
 * Check if we're in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Check if we're in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * API URL for making requests
 */
export const API_URL = env.NEXT_PUBLIC_API_URL;