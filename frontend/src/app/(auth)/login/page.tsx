'use client';

import { ChangeEvent, FormEvent, useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage(): ReactNode {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
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

    if (!formData.email || !formData.password) {
      setError('Tous les champs sont requis');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.error ?? 'Erreur de connexion');
        return;
      }
      if (result.user?.role === 'moderator') {
        router.push('/admin');
      } else {
        router.push('/my-listings');
      }
    } catch {
      setError('Erreur de connexion');
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
            Connexion
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Accède à ton espace CampusShop
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-foreground)]">
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="mon@email.com"
              value={formData.email}
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
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        {/* Lien inscription */}
        <div className="text-center">
          <p className="text-sm text-[var(--color-muted)]">
            Pas encore inscrit ?{' '}
            <Link href="/register" className="font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-primary)]">
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Info */}
        <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-muted)]">
            Compte etudiant ou moderateur requis pour acceder a l'espace CampusShop.
          </p>
        </div>
      </div>
    </div>
  );
}

