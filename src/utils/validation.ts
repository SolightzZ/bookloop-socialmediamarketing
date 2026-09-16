/**
 * Shared validation helpers for auth forms.
 * Single source of truth for Thai error messages and rules.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());

export const getEmailError = (email: string): string | undefined => {
  if (!email.trim()) return 'กรุณากรอกอีเมล';
  if (!isValidEmail(email)) return 'รูปแบบอีเมลไม่ถูกต้อง';
  return undefined;
};

export const getPasswordError = (password: string): string | undefined => {
  if (!password) return 'กรุณากรอกรหัสผ่าน';
  if (password.length < MIN_PASSWORD_LENGTH)
    return `รหัสผ่านต้องมีความยาวอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`;
  return undefined;
};

export const getPasswordMatchError = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (!confirmPassword) return 'กรุณายืนยันรหัสผ่าน';
  if (password !== confirmPassword) return 'รหัสผ่านยืนยันไม่ตรงกัน';
  return undefined;
};
