"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Movie = { id: number; title: string; duration_minutes: number };

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api<Movie[]>("/movies/")
      .then((data) => {
        if (mounted) setMovies(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Movies</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="grid gap-3">
        {movies.map((m) => (
          <li key={m.id} className="border rounded p-3">
            <div className="font-semibold">{m.title}</div>
            <div className="text-sm text-gray-600">Duration: {m.duration_minutes} min</div>
            <a className="text-blue-600 hover:underline" href={`/movies/${m.id}/shows`}>
              View shows
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}