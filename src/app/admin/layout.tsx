import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/shell";
import { ToastProvider } from "@/components/admin/toast";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = (await headers()).get("x-admin-path") ?? "";
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

  const session = await getSession();
  const authenticated = Boolean(session && session.role === "admin");

  if (!authenticated) {
    if (isLoginPage) {
      return <>{children}</>;
    }
    redirect("/admin/login");
  }

  // Already authenticated — send dashboard visitors to the login page back.
  if (isLoginPage) {
    redirect("/admin/dashboard");
  }

  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}