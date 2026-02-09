export class ValidationException extends Error {
  constructor(message: string, public readonly field?: string) {
    super(message);
    this.name = 'ValidationException';
    
    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationException);
    }
  }
}
