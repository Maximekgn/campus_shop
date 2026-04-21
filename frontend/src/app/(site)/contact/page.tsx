'use client';

import { ReactNode, useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';

export default function ContactPage(): ReactNode {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setError("Impossible d'envoyer le message pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Link href="/">
          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-4">← Retour</button>
        </Link>
        <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">Nous contacter</h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Une question ? Un problème ? Contacte-nous et nous te répondrons rapidement.
        </p>
      </div>

      {/* Contact Info */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
          <p className="text-sm text-[var(--color-muted)]">📧 Email</p>
          <p className="mt-2 font-semibold text-[var(--color-foreground)]">support@campusshop.tg</p>
        </div>
        <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
          <p className="text-sm text-[var(--color-muted)]">📍 Localisation</p>
          <p className="mt-2 font-semibold text-[var(--color-foreground)]">Lomé, Togo</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-[28px] border border-[var(--color-border)] bg-white p-8">
        {submitted && (
          <div className="mb-6 rounded-[16px] bg-green-100 p-4 text-sm font-semibold text-green-700">
            ✓ Merci ! Ton message a été envoyé. Nous te répondrons bientôt.
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-[var(--color-foreground)]">Nom *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-[16px] border border-[var(--color-border)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Ton nom"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-[var(--color-foreground)]">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-[16px] border border-[var(--color-border)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="ton@email.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-[var(--color-foreground)]">Sujet *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-[16px] border border-[var(--color-border)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Sujet de ton message"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-[var(--color-foreground)]">Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="mt-2 w-full rounded-[16px] border border-[var(--color-border)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Raconte-nous ton problème..."
          />
        </div>

        <Button className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </Button>
      </form>
    </div>
  );
}
