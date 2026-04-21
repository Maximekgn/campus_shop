"use client";

import { ChangeEvent, FormEvent, useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage(): ReactNode {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Tous les champs sont requis");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) { setError(result.error ?? "Erreur de connexion"); return; }
      router.push(result.user?.role === "moderator" ? "/admin" : "/my-listings");
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm font-semibold text-[var(--color-foreground)] opacity-60 hover:opacity-100 transition">
            ← CampusShop
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Accède à ton espace étudiant.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">
              Email
            </label>
            <Input id="email" type="email" name="email" placeholder="mon@email.com"
              value={formData.email} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">
              Mot de passe
            </label>
            <Input id="password" type="password" name="password" placeholder="••••••••"
              value={formData.password} onChange={handleChange} required />
          </div>

          <Button className="mt-2 w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          Pas encore inscrit ?{" "}
          <Link href="/register" className="font-semibold text-[var(--color-foreground)] hover:underline">
            Créer un compte
          </Link>
        </p>

        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <p className="text-xs text-[var(--color-muted)]">
            Un compte étudiant ou modérateur est requis pour accéder à la plateforme.
          </p>
        </div>
      </div>
    </div>
  );
}
