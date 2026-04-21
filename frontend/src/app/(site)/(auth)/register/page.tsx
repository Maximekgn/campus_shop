'use client';

import { ChangeEvent, FormEvent, useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

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
    name: '',
    email: '',
    student_id: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.student_id) {
      setError('Tous les champs sont requis');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData.name, formData.email, formData.password, formData.student_id);
      if (!result.success) {
        setError(result.error ?? "Erreur lors de l'inscription");
        return;
      }
      router.push('/');
    } catch {
      setError('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo & titre */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">
            Inscription
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Rejoins CampusShop en quelques clics
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-[var(--color-foreground)]">
              Nom complet
            </label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Jean Dupont"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-foreground)]">
              Email étudiant
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="mon@etudiant.fr"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-[var(--color-muted)]">
              Utilise ton email officiel de l'établissement
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="student_id" className="block text-sm font-semibold text-[var(--color-foreground)]">
              Numéro d'étudiant
            </label>
            <Input
              id="student_id"
              type="text"
              name="student_id"
              placeholder="STUD123456"
              value={formData.student_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-[var(--color-foreground)]">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-[var(--color-muted)]">
              Min. 8 caractères
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password_confirmation" className="block text-sm font-semibold text-[var(--color-foreground)]">
              Confirmer le mot de passe
            </label>
            <Input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? 'Inscription...' : 'Créer un compte'}
          </Button>
        </form>

        {/* Lien connexion */}
        <div className="text-center">
          <p className="text-sm text-[var(--color-muted)]">
            Déjà inscrit ?{' '}
            <Link href="/login" className="font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-primary)]">
              Se connecter
            </Link>
          </p>
        </div>

        {/* Conditions */}
        <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-muted)]">
            En t'inscrivant, tu acceptes nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
}

