// Shared between the contact form (client) and the /api/contact route (server).

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  website: string; // honeypot – real visitors leave it empty
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export const PHONE_RE = /^(\+?84|0)\d{8,10}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(p: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  if (p.name.trim().length < 2) errors.name = "Vui lòng nhập họ và tên (ít nhất 2 ký tự).";
  if (!PHONE_RE.test(p.phone.replace(/[\s.\-()]/g, ""))) errors.phone = "Số điện thoại chưa đúng – ví dụ: 0968 240 789.";
  if (p.email && !EMAIL_RE.test(p.email.trim())) errors.email = "Email chưa đúng định dạng – ví dụ: ten@congty.vn.";
  if (p.message.trim().length < 10) errors.message = "Vui lòng mô tả nhu cầu của bạn (ít nhất 10 ký tự).";
  if (p.message.length > 4000) errors.message = "Nội dung quá dài – tối đa 4.000 ký tự.";
  return errors;
}
