import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 text-center">
            <p className="font-mono text-sm font-bold tracking-[0.18em] text-foreground">
              MOHANA PRIYA
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Portfolio Admin</p>
          </div>
          <LoginForm />
        </div>
        <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground">
          Protected area — authorized personnel only
        </p>
      </div>
    </div>
  );
}