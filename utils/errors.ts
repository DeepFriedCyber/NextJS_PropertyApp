/**
 * Custom error classes for better error handling and categorization
 */

// Base error class for all application errors
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Database related errors
export class DatabaseError extends AppError {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

// Validation errors
export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Embedding generation errors
export class EmbeddingError extends AppError {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'EmbeddingError';
    Object.setPrototypeOf(this, EmbeddingError.prototype);
  }
}

// CSV parsing errors
export class CSVParsingError extends AppError {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'CSVParsingError';
    Object.setPrototypeOf(this, CSVParsingError.prototype);
  }
}