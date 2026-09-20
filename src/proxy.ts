import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";

const ADMIN_LOGIN_PATH = "/admin/login";

/**
 * Next.js 16 Proxy — optimistic network-layer guard for the admin area.
 * The real authorization check (getSession / requireAdmin) runs again in
 * the admin layout, server components, and API route handlers.
 * Also stamps the resolved path on a header so the admin layout can skip its
 * guard for the public login page.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  response.headers.set("x-admin-path", pathname);

  if (pathname === ADMIN_LOGIN_PATH || pathname === ADMIN_LOGIN_PATH + "/") {
    return response;
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};