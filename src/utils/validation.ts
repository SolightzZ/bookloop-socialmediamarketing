/**
 * Shared validation helpers for auth forms.
 * Single source of truth for Thai error messages and rules.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
// กัน DoS ผ่าน bcrypt/hash ฝั่ง server — รหัสผ่านยาวเกินไปยังไงก็ไม่ปลอดภัยขึ้น
const MAX_PASSWORD_LENGTH = 72;

const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());

export const getEmailError = (email: string): string | undefined => {
   if (!email.trim()) return 'กรุณากรอกอีเมล';
   if (!isValidEmail(email)) return 'รูปแบบอีเมลไม่ถูกต้อง';
   return undefined;
};

export const getPasswordError = (password: string): string | undefined => {
   if (!password) return 'กรุณากรอกรหัสผ่าน';
   if (password.length < MIN_PASSWORD_LENGTH) return `รหัสผ่านต้องมีความยาวอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`;
   if (password.length > MAX_PASSWORD_LENGTH) return `รหัสผ่านต้องมีความยาวไม่เกิน ${MAX_PASSWORD_LENGTH} ตัวอักษร`;
   return undefined;
};

/**
 * ใช้เฉพาะฟอร์ม login — ตรวจแค่กรอกหรือไม่ กันล็อกผู้ใช้เก่าที่รหัสผ่านสั้นกว่าเกณฑ์ปัจจุบัน
 * (เกณฑ์ min/max ใหม่บังคับเฉพาะรหัสผ่านที่ตั้งใหม่: สมัคร / รีเซ็ต / เปลี่ยน)
 */
export const getLoginPasswordError = (password: string): string | undefined => {
   if (!password) return 'กรุณากรอกรหัสผ่าน';
   return undefined;
};

export const getPasswordMatchError = (password: string, confirmPassword: string): string | undefined => {
   if (!confirmPassword) return 'กรุณายืนยันรหัสผ่าน';
   if (password !== confirmPassword) return 'รหัสผ่านยืนยันไม่ตรงกัน';
   return undefined;
};
