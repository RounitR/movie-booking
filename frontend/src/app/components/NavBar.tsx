"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/auth";

export default function NavBar() {
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAuthed(!!getAccessToken());
    const onStorage = () => setAuthed(!!getAccessToken());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const onLogout = () => {
    clearTokens();
    setAuthed(false);
    router.replace("/");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
      <Link href="/" className="font-semibold">Movie Booking</Link>
      <nav className="flex gap-4 text-sm">
        <Link className="hover:underline" href="/movies">Movies</Link>
        <Link className="hover:underline" href="/my-bookings">My Bookings</Link>
        {!authed && (
          <>
            <Link className="hover:underline" href="/signup">Signup</Link>
            <Link className="hover:underline" href="/login">Login</Link>
          </>
        )}
        {authed && (
          <button onClick={onLogout} className="hover:underline">Logout</button>
        )}
      </nav>
    </div>
  );
}