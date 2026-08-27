import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Skillstream Academy",
    template: "%s · Skillstream Academy",
  },
  description:
    "A connected learning platform for enrollment, guided learning, and verifiable certification.",
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
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-100 -translate-y-24 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
