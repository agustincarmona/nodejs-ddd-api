export class DuplicateLicenseException extends Error {
  constructor(licencia: string) {
    super(`Ya existe un conductor con la licencia: ${licencia}`);
    this.name = 'DuplicateLicenseException';
    
    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DuplicateLicenseException);
    }
  }
}
