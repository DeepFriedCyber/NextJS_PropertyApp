/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Handles errors in API routes
 * @param error The error to handle
 * @returns An object with status and message
 */
export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return {
      status: error.status,
      message: error.message
    };
  }
  
  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message
    };
  }
  
  return {
    status: 500,
    message: 'An unknown error occurred'
  };
};

/**
 * Safely parses JSON with error handling
 * @param data The data to parse
 * @returns The parsed data or null if parsing fails
 */
export const safeJsonParse = <T>(data: string): T | null => {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return null;
  }
};