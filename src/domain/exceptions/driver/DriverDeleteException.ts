export class DriverDeleteException extends Error {
  constructor(id: string, reason?: string) {
    const message = reason 
      ? `Error al eliminar el conductor con ID ${id}: ${reason}`
      : `Error al eliminar el conductor con ID ${id}`;
    super(message);
    this.name = 'DriverDeleteException';
    
    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DriverDeleteException);
    }
  }
}
