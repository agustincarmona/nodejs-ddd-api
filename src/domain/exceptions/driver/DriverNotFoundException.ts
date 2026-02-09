export class DriverNotFoundException extends Error {
  constructor(id: string) {
    super(`Conductor con ID ${id} no encontrado`);
    this.name = 'DriverNotFoundException';
    
    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DriverNotFoundException);
    }
  }
}
