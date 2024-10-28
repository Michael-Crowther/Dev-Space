"use client";
import { usePathname, useRouter } from "next/navigation";
import { UserProvider } from "@/components/providers/UserProvider";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();
  const router = useRouter();
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Only wrap with UserProvider if not on authentication routes
  return isAuthRoute ? (
    <>{children}</>
  ) : (
    <UserProvider>{children}</UserProvider>
  );
}
