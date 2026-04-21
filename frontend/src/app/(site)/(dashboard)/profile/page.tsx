"use client";

import { ChangeEvent, FormEvent, useState, ReactNode } from "react";
import { Check, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockUsers } from "@/data/users";
import type { User } from "@/types";

export default function ProfilePage(): ReactNode {
  // Simulation de l'utilisateur connecté (u1)
  const currentUser = mockUsers[0] as User;

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    student_id: currentUser.student_id || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">
          Mon profil
        </h1>
        <p className="mt-1 text-[var(--color-muted)]">
          Gère tes informations personnelles
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {/* Colonne gauche : infos perso */}
        <div className="md:col-span-2 space-y-8">
          {/* Informations personnelles */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8">
            <h2 className="mb-6 text-2xl font-semibold text-[var(--color-foreground)]">
              Informations personnelles
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {success && (
                <div className="rounded-[16px] border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  <>
                    <Check className="mr-1 h-4 w-4" /> Profil mis à jour avec
                    succès
                  </>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[var(--color-foreground)]"
                >
                  Nom complet
                </label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[var(--color-foreground)]"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
                <p className="text-xs text-[var(--color-muted)]">
                  Non modifiable
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="student_id"
                  className="block text-sm font-semibold text-[var(--color-foreground)]"
                >
                  Numéro d'étudiant
                </label>
                <Input
                  id="student_id"
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  disabled
                />
                <p className="text-xs text-[var(--color-muted)]">
                  Non modifiable
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </Button>
            </form>
          </div>

          {/* Changement mot de passe */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8">
            <h2 className="mb-6 text-2xl font-semibold text-[var(--color-foreground)]">
              Sécurité
            </h2>
            <Button variant="secondary" className="w-full">
              Changer mon mot de passe
            </Button>
          </div>

          {/* Zone de danger */}
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8">
            <h2 className="mb-6 text-2xl font-semibold text-red-700">
              Zone de danger
            </h2>
            <Button
              variant="ghost"
              className="w-full text-red-700 hover:bg-red-100"
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>

        {/* Colonne droite : résumé */}
        <div className="space-y-6">
          {/* Infos compte */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Membre depuis
            </h3>
            <p className="text-lg font-semibold text-[var(--color-foreground)]">
              {new Date(currentUser.created_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Statut */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Statut
            </h3>
            <div
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                currentUser.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {currentUser.is_active ? (
                <>
                  <Check className="mr-1 h-4 w-4" /> Actif
                </>
              ) : (
                "Banni"
              )}
            </div>
          </div>

          {/* Rôle */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Rôle
            </h3>
            <p className="text-sm font-semibold capitalize text-[var(--color-foreground)]">
              {currentUser.role === "moderator" ? (
                <>
                  <Shield className="mr-1 h-4 w-4" /> Modérateur
                </>
              ) : (
                <>
                  <User className="mr-1 h-4 w-4" /> Membre
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
