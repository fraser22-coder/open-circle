/**
 * Input sanitization helpers — strip HTML/script tags and trim strings.
 * Used in API routes before writing to the database.
 */

/** Strip HTML tags and dangerous characters from a string */
export function sanitizeString(value: unknown, maxLength = 1000): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, '')          // strip HTML tags
    .replace(/[<>"'`]/g, '')          // strip leftover angle brackets / quotes
    .trim()
    .slice(0, maxLength)
}

/** Sanitize an email address */
export function sanitizeEmail(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().toLowerCase().slice(0, 254)
}

/** Sanitize a phone number — digits, spaces, +, -, ( ) only */
export function sanitizePhone(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[^0-9+\-() ]/g, '').trim().slice(0, 30)
}

/** Clamp a number to a range */
export function sanitizeNumber(value: unknown, min: number, max: number): number | null {
  const n = Number(value)
  if (!isFinite(n)) return null
  return Math.min(max, Math.max(min, Math.round(n)))
}

/** Validate that a value is one of an allowed set */
export function sanitizeEnum<T extends string>(value: unknown, allowed: T[]): T | null {
  if (typeof value !== 'string') return null
  return allowed.includes(value as T) ? (value as T) : null
}

/** Sanitize an array of enum values */
export function sanitizeEnumArray<T extends string>(value: unknown, allowed: T[]): T[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is T => allowed.includes(v as T)).slice(0, 10)
}

/** Sanitize an array of strings */
export function sanitizeStringArray(value: unknown, maxItems = 20, maxLength = 200): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map(v => sanitizeString(v, maxLength))
    .filter(Boolean)
    .slice(0, maxItems)
}
