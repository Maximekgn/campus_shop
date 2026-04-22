"use client";

import { ChangeEvent, FormEvent, useState, ReactNode } from "react";
import { Check, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/authStore";
import type { User as UserType } from "@/types";

const labelClass = "mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]";

export default function ProfilePage(): ReactNode {
  const { user: currentUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    student_id: currentUser?.student_id || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Mon profil
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Gère tes informations personnelles et la sécurité de ton compte.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_240px]">

        {/* Left — forms */}
        <div className="space-y-6">

          {/* Personal info */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Informations personnelles
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  <Check className="h-4 w-4 shrink-0" /> Profil mis à jour avec succès
                </div>
              )}

              <div>
                <label htmlFor="name" className={labelClass}>Nom complet</label>
                <Input id="name" type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} disabled />
                <p className="mt-1 text-xs text-[var(--color-muted)]">Non modifiable</p>
              </div>

              <div>
                <label htmlFor="student_id" className={labelClass}>Numéro d'étudiant</label>
                <Input id="student_id" type="text" name="student_id" value={formData.student_id} onChange={handleChange} disabled />
                <p className="mt-1 text-xs text-[var(--color-muted)]">Non modifiable</p>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </form>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Sécurité
            </h2>
            <Button variant="secondary">Changer mon mot de passe</Button>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="mb-1 text-sm font-semibold text-red-600 uppercase tracking-widest">
              Zone de danger
            </h2>
            <p className="mb-4 text-xs text-red-500">
              La suppression de ton compte est irréversible.
            </p>
            <button
              type="button"
              className="text-sm font-semibold text-red-600 hover:text-red-800 transition"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>

        {/* Right — account summary */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Membre depuis
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-foreground)]">
              {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString("fr-FR", {
                year: "numeric", month: "long", day: "numeric",
              }) : "N/A"}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Statut
            </p>
            <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              currentUser?.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
            }`}>
              {currentUser?.is_active ? <><Check className="h-3 w-3" /> Actif</> : "Inactif"}
            </span>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Rôle
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-foreground)]">
              {currentUser?.role === "moderateur"
                ? <><Shield className="h-4 w-4" /> Modérateur</>
                : <><User className="h-4 w-4" /> Membre</>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
