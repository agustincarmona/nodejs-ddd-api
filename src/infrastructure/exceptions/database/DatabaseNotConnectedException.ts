export class DatabaseNotConnectedException extends Error {
  constructor() {
    super('Database not connected');
    this.name = 'DatabaseNotConnectedException';
    
    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseNotConnectedException);
    }
  }
}
