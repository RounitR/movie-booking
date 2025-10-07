"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { use } from "react";

type Params = Promise<{ id: string }>;

type Show = {
  id: number;
  screen_name: string;
  date_time: string;
  total_seats: number;
  movie: { id: number; title: string };
};

export default function MovieShowsPage({ params }: { params: Params }) {
  const { id: movieId } = use(params);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api<Show[]>(`/movies/${movieId}/shows/`)
      .then((data) => {
        if (mounted) setShows(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [movieId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Shows</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="grid gap-3">
        {shows.map((s) => (
          <li key={s.id} className="border rounded p-4">
            <div className="font-medium">{s.movie.title} - {s.screen_name}</div>
            <div className="text-sm text-gray-600">{new Date(s.date_time).toLocaleString()} · {s.total_seats} seats</div>
            <Link className="text-blue-600 hover:underline" href={`/shows/${s.id}`}>Book seat</Link>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Link className="text-blue-600 hover:underline" href="/movies">Back to Movies</Link>
      </div>
    </div>
  );
}