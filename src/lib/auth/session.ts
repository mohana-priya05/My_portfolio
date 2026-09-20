import "server-only";
import * as jose from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
export const ADMIN_ROLE = "admin";

export interface SessionPayload {
  sub: string;
  email: string;
  role: typeof ADMIN_ROLE;
}

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set and at least 16 characters long");
  }
  return new TextEncoder().encode(secret);
}

export const sessionMaxAgeSeconds = (): number => {
  const num = Number(process.env.SESSION_MAX_AGE);
  return Number.isFinite(num) && num > 0 ? num : 12 * 60 * 60;
};

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new jose.SignJWT({ role: payload.role, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds())
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (!payload.sub || (payload.role !== ADMIN_ROLE && payload.email === undefined)) {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email as string,
      role: ADMIN_ROLE,
    };
  } catch {
    return null;
  }
}

export async function createSessionCookie(payload: SessionPayload): Promise<string> {
  const token = await signSessionToken(payload);
  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== ADMIN_ROLE) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}