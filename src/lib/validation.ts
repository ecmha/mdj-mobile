// Same rules the server enforces on accounts.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 8;

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email.trim());
