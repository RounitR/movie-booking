import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-3">Movie Booking</h1>
      <p className="text-sm text-gray-700 mb-6">Book seats for movie shows and manage your bookings. Use the links below to get started.</p>
      <ul className="grid gap-2">
        <li><Link className="text-blue-600 hover:underline" href="/movies">Browse Movies</Link></li>
        <li><Link className="text-blue-600 hover:underline" href="/signup">Signup</Link></li>
        <li><Link className="text-blue-600 hover:underline" href="/login">Login</Link></li>
        <li><a className="text-blue-600 hover:underline" href="http://localhost:8010/swagger/" target="_blank" rel="noreferrer">API Docs</a></li>
      </ul>
    </div>
  );
}
