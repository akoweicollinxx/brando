import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brando — AI Brand Generator",
  description: "Turn any idea into a ready-to-launch brand in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
            <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur border-b border-gray-100 dark:border-white/[0.08]">
              <a href="/" className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                brando
              </a>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Show when="signed-out">
                  <SignInButton>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-white/60 hover:text-black dark:hover:text-white transition">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition">
                      Get started
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </header>
            <div className="pt-16">{children}</div>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
