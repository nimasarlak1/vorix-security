const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
}

export function normalizePhone(input: string): string {
  return normalizeDigits(input)
    .replace(/[\s\-()]/g, '')
    .replace(/^\+98/, '0')
    .replace(/^0098/, '0');
}

export function isValidMobile(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

export function cleanText(input: unknown, max: number): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}
