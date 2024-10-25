"use client";
import { usePathname } from "next/navigation";
import { UserProvider } from "@/components/providers/UserProvider";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Only wrap with UserProvider if not on authentication routes
  return isAuthRoute ? (
    <>{children}</>
  ) : (
    <UserProvider>{children}</UserProvider>
  );
}
