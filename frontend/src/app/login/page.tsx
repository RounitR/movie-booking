"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { setTokens, Tokens } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const usernameValid = useMemo(() => username.trim().length >= 3, [username]);
  const passwordValid = useMemo(() => password.length >= 8, [password]);
  const formValid = usernameValid && passwordValid;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    setLoading(true);
    setMessage(null);
    try {
      const tokens = await api<Tokens>("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setTokens(tokens);
      setMessage("Login successful.");
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="max-w-md flex flex-col gap-3">
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}