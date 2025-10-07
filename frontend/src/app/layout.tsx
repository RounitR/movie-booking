import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Movie Booking",
  description: "Clean and simple movie booking UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
            <Link href="/" className="font-semibold">Movie Booking</Link>
            <nav className="flex gap-4 text-sm">
              <Link className="hover:underline" href="/movies">Movies</Link>
              <Link className="hover:underline" href="/my-bookings">My Bookings</Link>
              <Link className="hover:underline" href="/signup">Signup</Link>
              <Link className="hover:underline" href="/login">Login</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
