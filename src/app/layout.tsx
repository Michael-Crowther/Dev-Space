import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../globals.css";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import { SessionProvider } from "next-auth/react";

const whitneysemibold = localFont({
  src: "./fonts/whitneysemibold.otf",
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
      <body className={`${whitneysemibold.className} antialiased flex`}>
        <QueryProvider>
          <SessionProvider>
            <UserProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </UserProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
