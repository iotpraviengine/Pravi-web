// Shared between the contact form (client) and the /api/contact route (server).
import { ui } from "@/i18n/ui";

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
export type ContactMessages = (typeof ui)["vi"]["form"]["errors"];

// Vietnamese numbers (0… / +84…), or any international number written with its country code.
export const PHONE_RE = /^((\+?84|0)\d{8,10}|\+\d{7,15})$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(p: ContactPayload, messages: ContactMessages = ui.vi.form.errors): ContactErrors {
  const errors: ContactErrors = {};
  if (p.name.trim().length < 2) errors.name = messages.name;
  if (!PHONE_RE.test(p.phone.replace(/[\s.\-()]/g, ""))) errors.phone = messages.phone;
  if (p.email && !EMAIL_RE.test(p.email.trim())) errors.email = messages.email;
  if (p.message.trim().length < 10) errors.message = messages.message;
  if (p.message.length > 4000) errors.message = messages.messageLong;
  return errors;
}
