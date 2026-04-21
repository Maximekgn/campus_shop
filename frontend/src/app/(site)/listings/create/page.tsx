'use client';

import { ChangeEvent, FormEvent, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type ListingFormData = {
  title: string;
  description: string;
  type: 'vente' | 'don' | 'echange';
  price: string;
};

type PhotoFile = {
  id: string;
  file: File;
  preview: string;
};

export default function CreateListingPage(): ReactNode {
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    type: 'vente',
    price: '',
  });
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newPhotos: PhotoFile[] = [];
    const totalPhotos = photos.length + files.length;

    if (totalPhotos > 3) {
      setError('Maximum 3 photos autorisées');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 1024 * 1024) {
        setError('Chaque photo doit faire moins de 1 Mo');
        return;
      }

      const preview = URL.createObjectURL(file);
      newPhotos.push({
        id: `temp-${Date.now()}-${i}`,
        file,
        preview,
      });
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setError('');
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title || !formData.description) {
      setError('Titre et description sont requis');
      setLoading(false);
      return;
    }

    if (formData.type === 'vente' && !formData.price) {
      setError('Le prix est requis pour une vente');
      setLoading(false);
      return;
    }

    try {
      // Simulation d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/my-listings');
    } catch (err) {
      setError('Erreur lors de la création de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">Créer une annonce</h1>
        <p className="mt-1 text-[var(--color-muted)]">Vends, donne ou échange avec la communauté</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Infos générales */}
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-foreground)]">Informations générales</h2>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-[var(--color-foreground)]">
              Titre *
            </label>
            <Input
              id="title"
              type="text"
              name="title"
              placeholder="Ex: Livre de Maths L2"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-[var(--color-foreground)]">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Décris ton article en détail (état, raison, etc.)"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-semibold text-[var(--color-foreground)]">
                Type d'annonce *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
              >
                <option value="vente">À vendre</option>
                <option value="don">À donner</option>
                <option value="echange">Échange</option>
              </select>
            </div>

            {formData.type === 'vente' && (
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-semibold text-[var(--color-foreground)]">
                  Prix (FCFA) *
                </label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required={formData.type === 'vente'}
                />
              </div>
            )}
          </div>
        </div>

        {/* Photos */}
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-foreground)]">Photos</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Maximum 3 photos, 1 Mo chacune (JPEG, PNG, WebP)
            </p>
          </div>

          {/* Zone upload */}
          <div className="relative rounded-[20px] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center transition hover:border-[var(--color-primary)]">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              disabled={photos.length >= 3}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div className="pointer-events-none">
              <p className="text-lg font-semibold text-[var(--color-foreground)]">
                {photos.length >= 3 ? '3 photos max atteint' : 'Clique ou glisse tes photos'}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {photos.length}/3 photos
              </p>
            </div>
          </div>

          {/* Aperçus photos */}
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative h-28 overflow-hidden rounded-[16px] border border-[var(--color-border)]">
                  <img
                    src={photo.preview}
                    alt="Aperçu"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 transition hover:bg-black/40"
                  >
                    <span className="text-white opacity-0 transition group-hover:opacity-100">✕</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Création...' : 'Publier l\'annonce'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
