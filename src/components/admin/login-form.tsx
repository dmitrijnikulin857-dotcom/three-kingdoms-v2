"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const [email, setEmail] = useState("owner@three-kingdoms.de");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login fehlgeschlagen");
        setLoading(false);
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("Serverfehler. Bitte erneut versuchen.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 font-serif text-3xl font-bold text-gold">
          三
        </span>
        <h1 className="mt-4 font-serif text-2xl font-bold text-white">
          Three Kingdoms
        </h1>
        <p className="mt-1 text-sm text-neutral-500">Admin Panel</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 p-8">
        <div>
          <label className="label">E-Mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="label">Passwort</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-9"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-crimson-light">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-gold w-full">
          <LogIn className="h-4 w-4" />
          {loading ? "Anmeldung …" : "Anmelden"}
        </button>

        <p className="rounded-lg bg-ink-soft px-4 py-3 text-center text-xs text-neutral-500">
          Demo-Zugang: <span className="text-neutral-300">owner@three-kingdoms.de</span>
          {" · "}
          <span className="text-neutral-300">ChangeMe!2024</span>
        </p>
      </form>
    </div>
  );
}
