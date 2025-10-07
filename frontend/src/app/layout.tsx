import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Movie Booking",
  description: "Frontend for Movie Booking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="w-full border-b border-black/[.08] dark:border-white/[.145] bg-background">
          <nav className="mx-auto max-w-5xl flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="font-semibold">Movie Booking</Link>
              <span className="text-sm text-gray-500">Frontend</span>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/signup" className="hover:underline">Signup</Link>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/movies" className="hover:underline">Movies</Link>
              <Link href="/my-bookings" className="hover:underline">My Bookings</Link>
              <a href="http://localhost:8010/swagger/" target="_blank" rel="noreferrer" className="hover:underline">API Docs</a>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
