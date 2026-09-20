import { NextResponse } from "next/server";
import { loginRateLimiter, clientIp } from "@/lib/auth/rate-limit";
import { verifyPassword, adminEmail } from "@/lib/auth/password";
import { createSessionCookie, SESSION_COOKIE, sessionMaxAgeSeconds } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = loginRateLimiter.check("login:" + ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many login attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email and password." },
      { status: 400 },
    );
  }

  const configuredEmail = adminEmail();
  const emailMatches =
    configuredEmail !== null && configuredEmail.toLowerCase() === parsed.data.email.toLowerCase();
  // Always run the bcrypt comparison to keep timing constant for a given payload.
  const passwordValid = await verifyPassword(parsed.data.password);
  const credentialsValid = emailMatches && passwordValid;

  if (!credentialsValid) {
    return NextResponse.json(
      { ok: false, error: "Invalid email or password." },
      { status: 401 },
    );
  }

  loginRateLimiter.reset("login:" + ip);

  const token = await createSessionCookie({
    sub: configuredEmail!,
    email: configuredEmail!,
    role: "admin",
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds(),
  });
  return response;
}