"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { listingService } from "@/services/listing.service";
import { categoryService, Category } from "@/services/category.service";

type ListingFormData = {
  title: string;
  description: string;
  type: "vente" | "don" | "echange";
  price: string;
  category_id: string;
};

type PhotoFile = { id: string; file: File; preview: string };

const selectClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-foreground)] appearance-none";

const labelClass = "mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]";

export default function CreateListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormData>({
    title: "", description: "", type: "vente", price: "", category_id: "",
  });
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [duplicateSuggestion, setDuplicateSuggestion] = useState<any>(null);

  useEffect(() => {
    categoryService.getAll()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;
    if (photos.length + files.length > 3) {
      setError("Maximum 3 photos autorisées");
      return;
    }
    const newPhotos: PhotoFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 1024 * 1024) { setError("Chaque photo doit faire moins de 1 Mo"); return; }
      newPhotos.push({ id: `temp-${Date.now()}-${i}`, file, preview: URL.createObjectURL(file) });
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
    setError("");
  };

  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>, forceCreate = false) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.description) { setError("Titre et description sont requis"); return; }
    if (formData.type === "vente" && !formData.price) { setError("Le prix est requis pour une vente"); return; }
    setLoading(true);
    setError("");
    setDuplicateSuggestion(null);
    try {
      await listingService.create({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: formData.type === "don" ? null : parseFloat(formData.price),
        categories: formData.category_id ? [parseInt(formData.category_id)] : undefined,
        photos: photos.map(p => p.file),
        force_create: forceCreate,
      });
      router.push("/my-listings");
    } catch (err: any) {
      if (err.data?.duplicate_suggestion) {
        setDuplicateSuggestion(err.data.duplicate_suggestion);
        setError("Il semble que vous ayez déjà posté une annonce très similaire récemment.");
      } else {
        setError(err.message || "Une erreur est survenue lors de la publication");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Nouvelle annonce
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Publier une annonce
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Vends, donne ou échange avec la communauté étudiante.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
            {duplicateSuggestion && (
              <div className="mt-3 flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleSubmit(undefined, true)}
                  disabled={loading}
                >
                  Publier quand même
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Section — Infos */}
        <div className="space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            Informations
          </h2>

          <div>
            <label htmlFor="title" className={labelClass}>Titre *</label>
            <Input id="title" name="title" type="text" placeholder="Ex: Livre de Maths L2"
              value={formData.title} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description *</label>
            <textarea
              id="description" name="description" rows={5} required
              placeholder="Décris ton article en détail…"
              value={formData.description} onChange={handleChange}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-foreground)] placeholder:text-[var(--color-muted)] resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className={labelClass}>Type *</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange} className={selectClass}>
                <option value="vente">À vendre</option>
                <option value="don">À donner</option>
                <option value="echange">Échange</option>
              </select>
            </div>

            {!categoriesLoading && categories.length > 0 && (
              <div>
                <label htmlFor="category_id" className={labelClass}>Catégorie</label>
                <select id="category_id" name="category_id" value={formData.category_id}
                  onChange={handleChange} className={selectClass}>
                  <option value="">Sélectionner</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            {formData.type === "vente" && (
              <div>
                <label htmlFor="price" className={labelClass}>Prix (FCFA) *</label>
                <Input id="price" name="price" type="number" placeholder="0" min="0" step="0.01"
                  value={formData.price} onChange={handleChange} required={formData.type === "vente"} />
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border)]" />

        {/* Section — Photos */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Photos</h2>
            <p className="mt-1 text-xs text-[var(--color-muted)]">Maximum 3 photos · 1 Mo par photo</p>
          </div>

          {/* Drop zone */}
          <div className="relative flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-10 transition hover:border-[var(--color-foreground)]">
            <input
              type="file" multiple accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange} disabled={photos.length >= 3}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div className="pointer-events-none flex flex-col items-center gap-2 text-center">
              <ImagePlus className="h-7 w-7 text-[var(--color-muted)]" />
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                {photos.length >= 3 ? "Maximum atteint" : "Clique ou glisse tes photos"}
              </p>
              <p className="text-xs text-[var(--color-muted)]">{photos.length}/3</p>
            </div>
          </div>

          {/* Previews */}
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative h-24 overflow-hidden rounded-xl border border-[var(--color-border)]">
                  <img src={photo.preview} alt="Aperçu" className="h-full w-full object-cover" />
                  <button
                    type="button" onClick={() => removePhoto(photo.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 transition hover:bg-black/40"
                  >
                    <X className="h-5 w-5 text-white opacity-0 transition group-hover:opacity-100" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <LoadingSpinner /> : "Publier l'annonce"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
