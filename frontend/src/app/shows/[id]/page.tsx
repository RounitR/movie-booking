"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { use } from "react";

type Params = Promise<{ id: string }>;

type ShowDetail = {
  id: number;
  screen_name: string;
  date_time: string;
  total_seats: number;
  available_seats: number;
  booked_seats: number[];
  movie: { id: number; title: string };
};

export default function ShowBookingPage({ params }: { params: Params }) {
  const { id: showId } = use(params);
  const [seat, setSeat] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useState<ShowDetail | null>(null);
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  const loadShow = async () => {
    try {
      const data = await api<ShowDetail>(`/shows/${showId}/`);
      setShow(data);
      setFetchErr(null);
    } catch (err: any) {
      setFetchErr(err.message || "Failed to load show");
    }
  };

  useEffect(() => {
    loadShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (typeof seat !== "number") throw new Error("Please select a seat");
      await api(`/shows/${showId}/book/`, {
        method: "POST",
        body: JSON.stringify({ seat_number: seat }),
      });
      setMessage(`Seat ${seat} booked successfully.`);
      setSeat("");
      // Refresh show details to update seat map and availability
      await loadShow();
    } catch (err: any) {
      setMessage(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const isBooked = (n: number) => show?.booked_seats.includes(n) ?? false;
  const isSelected = (n: number) => seat === n;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-2">Book a Seat</h1>
      {fetchErr && <p className="text-red-600 mb-3">{fetchErr}</p>}
      {show && (
        <>
          <p className="text-sm text-gray-700 mb-4">
            {show.movie.title} - {show.screen_name} · {new Date(show.date_time).toLocaleString()}<br />
            {show.total_seats} total · {show.available_seats} available
          </p>
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Select a seat:</div>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}
            >
              {Array.from({ length: show.total_seats }, (_, i) => i + 1).map((n) => {
                const booked = isBooked(n);
                const selected = isSelected(n);
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={booked}
                    onClick={() => setSeat(n)}
                    className={
                      `border rounded p-2 text-sm ` +
                      (booked
                        ? "bg-red-200 border-red-400 text-red-800 cursor-not-allowed"
                        : selected
                          ? "bg-blue-200 border-blue-500"
                          : "bg-white hover:bg-blue-100")
                    }
                    aria-label={`Seat ${n}${booked ? " (booked)" : selected ? " (selected)" : ""}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
          <form onSubmit={onSubmit} className="flex items-center gap-3">
            <input
              className="border rounded p-2 w-24"
              placeholder="Seat"
              type="number"
              min={1}
              max={show.total_seats}
              value={seat}
              onChange={(e) => setSeat(e.target.value ? parseInt(e.target.value, 10) : "")}
              required
            />
            <button
              className="rounded bg-foreground text-background px-4 py-2 disabled:opacity-50"
              type="submit"
              disabled={loading || typeof seat !== "number"}
            >
              {loading ? "Booking..." : "Book"}
            </button>
          </form>
        </>
      )}
      {message && <p className="mt-3 text-sm">{message}</p>}
      <div className="mt-4">
        <Link className="text-blue-600 hover:underline" href={show ? `/movies/${show.movie.id}/shows` : "/movies"}>Back to Shows</Link>
      </div>
    </div>
  );
}