"use client";

import { signIn, signOut } from "@/lib/auth.client";
import { useState } from "react";

const GENERIC_ERROR = "Identifiants invalides ou accès non autorisé.";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: authError } = await signIn.email({ email, password });
      if (authError) {
        setError(GENERIC_ERROR);
        return;
      }

      // La session est créée : on vérifie le rôle avant d'exposer la console.
      const res = await fetch("/api/admin/session", { cache: "no-store" });
      if (!res.ok) {
        await signOut();
        setError(GENERIC_ERROR);
        return;
      }

      window.location.replace("/admin");
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-md space-y-4.5 border border-admin-green/35 bg-[#020c06]/95 p-8 shadow-[0_30px_100px_rgba(0,0,0,.5)] sm:p-11"
    >
      <span
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-admin-green to-transparent"
        aria-hidden
      />

      <div>
        <p className="admin-type-micro font-mono uppercase tracking-[0.2em] text-admin-muted">
          Mandibula / Control system
        </p>
        <h1 className="mt-2 text-[clamp(30px,4vw,44px)] font-black uppercase leading-none tracking-[-0.05em] text-foreground">
          Accès administration
        </h1>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="admin-email"
          className="admin-type-micro block font-mono uppercase tracking-[0.13em] text-admin-muted"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12.25 w-full border border-admin-border bg-[#020805] px-3.5 text-base text-foreground outline-none focus:border-admin-green focus:ring-2 focus:ring-admin-green/20"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="admin-password"
          className="admin-type-micro block font-mono uppercase tracking-[0.13em] text-admin-muted"
        >
          Mot de passe
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12.25 w-full border border-admin-border bg-[#020805] px-3.5 text-base text-foreground outline-none focus:border-admin-green focus:ring-2 focus:ring-admin-green/20"
        />
      </div>

      {error && (
        <p role="alert" className="admin-type-small border border-destructive/40 px-3 py-2 text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="admin-type-micro h-12.5 w-full border border-admin-green bg-admin-green font-mono font-black uppercase tracking-[0.08em] text-[#031006] transition-colors hover:bg-[#8affaa] disabled:opacity-60"
      >
        {isLoading ? "Vérification…" : "Se connecter"}
      </button>
    </form>
  );
}
