export class EmailValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static isValid(email: string): boolean {
    if (!email || email.trim().length === 0) {
      return false;
    }
    return this.EMAIL_REGEX.test(email);
  }
}
