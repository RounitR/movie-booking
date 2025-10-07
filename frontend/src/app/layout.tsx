import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";

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
          <NavBar />
        </header>
        <main className="max-w-5xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
