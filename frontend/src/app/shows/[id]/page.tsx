"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ShowBookingPage({ params }: { params: { id: string } }) {
  const showId = params.id;
  const [seat, setSeat] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (typeof seat !== "number") throw new Error("Please enter a seat number");
      await api(`/shows/${showId}/book/`, {
        method: "POST",
        body: JSON.stringify({ seat_number: seat }),
      });
      setMessage("Seat booked successfully.");
      setSeat("");
    } catch (err: any) {
      setMessage(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Book a Seat</h1>
      <form onSubmit={onSubmit} className="max-w-md flex flex-col gap-3">
        <input
          className="border rounded p-2"
          placeholder="Seat number"
          type="number"
          min={1}
          value={seat}
          onChange={(e) => setSeat(e.target.value ? parseInt(e.target.value, 10) : "")}
          required
        />
        <button
          className="rounded bg-foreground text-background px-4 py-2 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book"}
        </button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}