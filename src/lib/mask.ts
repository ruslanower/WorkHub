/**
 * Contact masking for chat messages. Phone numbers, e-mails and links are
 * replaced so deals stay on-platform (payment protection, documents, insurance).
 */
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const URL_RE = /\b(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(?:com|net|org|ua|pl|ke|io|me|info|biz)(?:\/\S*)?\b/gi;
const MESSENGER = /(?:t\.me|wa\.me|telegram\.me|viber:\/\/)\S*/gi;
const PHONE = /(?:\+?\d[\s().-]?){7,}\d/g;
const HANDLE = /(^|\s)@[a-z0-9_]{4,}/gi;

export const MASK_TOKEN = '•••';

export interface MaskResult {
  text: string;
  masked: boolean;
}

export function maskContacts(input: string): MaskResult {
  let masked = false;
  const rep = (re: RegExp, s: string, keepLead = false) =>
    s.replace(re, (m, lead?: string) => {
      masked = true;
      return keepLead && typeof lead === 'string' ? `${lead}${MASK_TOKEN}` : MASK_TOKEN;
    });
  let out = input;
  out = rep(EMAIL, out);
  out = rep(MESSENGER, out);
  out = rep(URL_RE, out);
  out = rep(PHONE, out);
  out = rep(HANDLE, out, true);
  return { text: out, masked };
}
