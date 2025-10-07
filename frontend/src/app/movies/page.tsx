"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Movies</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="grid gap-3">
        {movies.map((m) => (
          <li key={m.id} className="border rounded p-4">
            <div className="font-medium">{m.title}</div>
            <div className="text-sm text-gray-600">Duration: {m.duration_minutes} min</div>
            <Link className="text-blue-600 hover:underline" href={`/movies/${m.id}/shows`}>
              View shows
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}