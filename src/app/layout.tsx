import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../globals.css";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SessionProvider } from "next-auth/react";
import { AuthWrapper } from "@/components/providers/AuthWrapper";
import { Toaster } from "@/components/ui/toaster";

const whitneysemibold = localFont({
  src: "./(app)/fonts/whitneysemibold.otf",
  variable: "--font-whitney-light",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dev-Space",
  description: "Discord for Devs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${whitneysemibold.className} antialiased flex h-screen `}
      >
        <Toaster />
        <QueryProvider>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <AuthWrapper>{children}</AuthWrapper>
            </ThemeProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
