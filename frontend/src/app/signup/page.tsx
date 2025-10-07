"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const usernameValid = useMemo(() => username.trim().length >= 3, [username]);
  const passwordValid = useMemo(() => password.length >= 8, [password]);
  const formValid = emailValid && usernameValid && passwordValid;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    setLoading(true);
    setMessage(null);
    try {
      await api("/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
      setMessage("Signup successful. You can now log in.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setMessage(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Signup</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div>
          <input
            className="border rounded p-2 w-full"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {!usernameValid && username.length > 0 && (
            <p className="text-xs text-red-600 mt-1">Username must be at least 3 characters.</p>
          )}
        </div>
        <div>
          <input
            className="border rounded p-2 w-full"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!emailValid && email.length > 0 && (
            <p className="text-xs text-red-600 mt-1">Please enter a valid email.</p>
          )}
        </div>
        <div>
          <input
            className="border rounded p-2 w-full"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!passwordValid && password.length > 0 && (
            <p className="text-xs text-red-600 mt-1">Password must be at least 8 characters.</p>
          )}
        </div>
        <button
          className="rounded bg-foreground text-background px-4 py-2 disabled:opacity-50"
          type="submit"
          disabled={loading || !formValid}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}