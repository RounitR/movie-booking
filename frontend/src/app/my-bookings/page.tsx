"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import Link from "next/link";

type Booking = {
  id: number;
  seat_number: number;
  status: string;
  created_at: string;
  show: {
    id: number;
    screen_name: string;
    date_time: string;
    movie: { id: number; title: string };
  };
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api<Booking[]>("/my-bookings/")
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError("Please log in to view your bookings.");
      setLoading(false);
      return;
    }
    load();
  }, []);

  const cancelBooking = async (id: number) => {
    setCancelingId(id);
    try {
      await api(`/bookings/${id}/cancel/`, { method: "POST" });
      load();
    } catch (err: any) {
      setError(err.message || "Cancel failed");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">My Bookings</h1>
      {loading && <p>Loading...</p>}
      {error && (
        <p className="text-red-600">
          {error} {error.includes("log in") && (<Link href="/login" className="underline ml-2">Go to Login</Link>)}
        </p>
      )}
      {!loading && !error && (
        <ul className="grid gap-3">
          {bookings.map((b) => (
            <li key={b.id} className="border rounded p-4">
              <div className="font-medium">{b.show.movie.title} - {b.show.screen_name}</div>
              <div className="text-sm text-gray-600">Seat {b.seat_number} · {new Date(b.show.date_time).toLocaleString()}</div>
              <div className="text-sm">Status: {b.status}</div>
              <button
                className="mt-2 rounded bg-foreground text-background px-3 py-1 disabled:opacity-50"
                onClick={() => cancelBooking(b.id)}
                disabled={b.status !== "booked" || cancelingId === b.id}
              >
                {cancelingId === b.id ? "Cancelling..." : "Cancel"}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Link className="text-blue-600 hover:underline" href="/movies">Back to Movies</Link>
      </div>
    </div>
  );
}