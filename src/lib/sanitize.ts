import validator from "validator";

const MAX_EMAIL = 254;
const MAX_SHORT = 500;   // names, URLs, single-line fields
const MAX_LONG = 5000;   // textarea fields

/** Normalise and lowercase an email address. */
export function sanitizeEmail(raw: string): string {
  const trimmed = raw.trim().slice(0, MAX_EMAIL);
  return validator.normalizeEmail(trimmed) || trimmed.toLowerCase();
}

/** Trim, strip ASCII control characters (except tab/newline/CR), and enforce a max length. */
export function sanitizeText(raw: string, maxLen: number = MAX_SHORT): string {
  return raw
    .trim()
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .slice(0, maxLen);
}

/** Same as sanitizeText but for long textarea values. */
export function sanitizeLong(raw: string): string {
  return sanitizeText(raw, MAX_LONG);
}

/** Validate that a string is a plausible email address. */
export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

/** Validate that a string is a plausible URL (http or https). */
export function isValidUrl(url: string): boolean {
  return validator.isURL(url, { protocols: ["http", "https"], require_protocol: false });
}
