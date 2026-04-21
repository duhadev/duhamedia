import { Resend } from 'resend';

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export function from(): string {
  return process.env.RESEND_FROM ?? 'Duha Media <hello@duhamedia.com>';
}

export function ownerEmail(): string {
  if (!process.env.OWNER_EMAIL) throw new Error('OWNER_EMAIL is not set');
  return process.env.OWNER_EMAIL;
}
