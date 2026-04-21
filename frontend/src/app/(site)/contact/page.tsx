"use client";

import { ReactNode, useState, ChangeEvent, FormEvent } from "react";
import { api } from "@/services/api";
import { Mail, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-border)] placeholder:text-[var(--color-muted)]";

export default function ContactPage(): ReactNode {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await api.post("/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Impossible d'envoyer le message pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Contact
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Nous contacter
        </h1>
        <p className="mt-3 text-base text-[var(--color-muted)]">
          Une question ou un problème ? Envoie-nous un message et nous te répondrons rapidement.
        </p>
      </div>

      {/* Info cards */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            <Mail className="h-4 w-4" /> Email
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--color-foreground)]">
            support@campusshop.tg
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            <MapPin className="h-4 w-4" /> Localisation
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--color-foreground)]">Lomé, Togo</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {submitted && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4 shrink-0" />
            Merci ! Ton message a bien été envoyé.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-[var(--color-foreground)]" htmlFor="name">
              Nom *
            </label>
            <input
              id="name" type="text" name="name" required
              value={formData.name} onChange={handleChange}
              placeholder="Ton nom" className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[var(--color-foreground)]" htmlFor="email">
              Email *
            </label>
            <input
              id="email" type="email" name="email" required
              value={formData.email} onChange={handleChange}
              placeholder="ton@email.com" className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--color-foreground)]" htmlFor="subject">
            Sujet *
          </label>
          <input
            id="subject" type="text" name="subject" required
            value={formData.subject} onChange={handleChange}
            placeholder="Sujet de ton message" className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--color-foreground)]" htmlFor="message">
            Message *
          </label>
          <textarea
            id="message" name="message" required rows={5}
            value={formData.message} onChange={handleChange}
            placeholder="Décris ton problème ou ta question..."
            className={inputClass}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
        </Button>
      </form>
    </div>
  );
}
