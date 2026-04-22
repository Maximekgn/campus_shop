"use client";

import { ChangeEvent, FormEvent, useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

type RegisterFormData = {
  name: string;
  email: string;
  student_id: string;
  password: string;
  password_confirmation: string;
};

export default function RegisterPage(): ReactNode {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "", email: "", student_id: "", password: "", password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Tous les champs sont requis"); return;
    }
    if (formData.password !== formData.password_confirmation) {
      setError("Les mots de passe ne correspondent pas"); return;
    }
    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères"); return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await register(
        formData.name, formData.email, formData.password,
        formData.password_confirmation, formData.student_id,
      );
      if (!result.success) { setError(result.error ?? "Erreur lors de l'inscription"); return; }
      router.push("/");
    } catch {
      setError("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const field = (id: keyof RegisterFormData, label: string, type = "text", placeholder = "", hint?: string) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">
        {label}
      </label>
      <Input id={id} type={type} name={id} placeholder={placeholder}
        value={formData[id]} onChange={handleChange} required />
      {hint && <p className="mt-1 text-xs text-[var(--color-muted)]">{hint}</p>}
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm font-semibold text-[var(--color-foreground)] opacity-60 hover:opacity-100 transition">
            ← CampusShop
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
            Créer un compte
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Rejoins la communauté étudiante CampusShop.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {field("name",      "Nom complet",             "text",     "Jean Dupont")}
          {field("email",     "Email étudiant",           "email",    "mon@etudiant.fr", "Utilise ton email officiel de l'établissement")}
          {field("student_id","Numéro d'étudiant",        "text",     "STUD123456")}
          {field("password",  "Mot de passe",             "password", "••••••••",        "Minimum 8 caractères")}
          {field("password_confirmation", "Confirmer le mot de passe", "password", "••••••••")}

          <Button className="mt-2 w-full" disabled={loading}>
            {loading ? "Inscription…" : "Créer un compte"}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-foreground)] hover:underline">
            Se connecter
          </Link>
        </p>

        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <p className="text-xs text-[var(--color-muted)]">
            En t'inscrivant, tu acceptes nos{" "}
            <Link href="/terms" className="underline hover:text-[var(--color-foreground)]">conditions d'utilisation</Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="underline hover:text-[var(--color-foreground)]">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
