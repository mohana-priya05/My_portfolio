import "server-only";
import bcrypt from "bcryptjs";

/**
 * Verifies a plaintext password against a bcrypt hash.
 * Uses bcryptjs which is pure JavaScript (no native build required).
 */
export async function verifyPassword(
  password: string,
  passwordHash?: string,
): Promise<boolean> {
  if (!passwordHash && process.env.ADMIN_PASSWORD_HASH === undefined) {
    // If no hash is configured the admin login must never succeed silently.
    return false;
  }
  const hash = passwordHash ?? process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export function adminEmail(): string | null {
  return process.env.ADMIN_EMAIL ?? null;
}

/**
 * Generates a bcrypt hash. Used by scripts/hash-password.mjs — never called
 * at request time with a plaintext password from the browser.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}