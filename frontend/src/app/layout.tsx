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
  description: "Book movies and manage your bookings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geistSans.variable + " " + geistMono.variable}>
        <header className="p-4 border-b flex items-center justify-between">
          <a href="/" className="font-semibold">Movie Booking</a>
          <nav className="flex gap-4">
            <a href="/movies">Movies</a>
            <a href="/my-bookings">My Bookings</a>
            <a href="/signup">Signup</a>
            <a href="/login">Login</a>
            <a href="http://localhost:8010/swagger/" target="_blank" rel="noreferrer">API Docs</a>
          </nav>
        </header>
        <main className="p-6 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
