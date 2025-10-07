"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Show = {
  id: number;
  screen_name: string;
  date_time: string;
  total_seats: number;
  movie: { id: number; title: string };
};

export default function MovieShowsPage({ params }: { params: { id: string } }) {
  const movieId = params.id;
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
    <div>
      <h1 className="text-2xl font-semibold mb-4">Shows</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="grid gap-3">
        {shows.map((s) => (
          <li key={s.id} className="border rounded p-3">
            <div className="font-semibold">{s.movie.title} - {s.screen_name}</div>
            <div className="text-sm text-gray-600">{new Date(s.date_time).toLocaleString()} · {s.total_seats} seats</div>
            <a className="text-blue-600 hover:underline" href={`/shows/${s.id}`}>Book seat</a>
          </li>
        ))}
      </ul>
    </div>
  );
}