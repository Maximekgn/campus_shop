"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { categoryService, Category } from "@/services/category.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ListingFilters as Filters } from "@/services/listing.service";

export default function ListingFilters({
  onFilter,
}: {
  onFilter: (filters: Filters) => void;
}) {
  const [filters, setFilters] = useState<{
    q: string;
    type: string;
    price_max: string;
    categories: string;
  }>({
    q: "",
    type: "",
    price_max: "",
    categories: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilter({
      q: updated.q || undefined,
      type: (updated.type as Filters["type"]) || undefined,
      price_max: updated.price_max
        ? parseInt(updated.price_max, 10)
        : undefined,
      categories: updated.categories || undefined,
    });
  };

  const handleReset = () => {
    const empty = { q: "", type: "", price_max: "", categories: "" };
    setFilters(empty);
    onFilter({});
  };

  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-foreground)]">
        Filtrer les annonces
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          type="text"
          placeholder="Rechercher..."
          value={filters.q}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("q", e.target.value)
          }
        />
        <select
          value={filters.type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleChange("type", e.target.value)
          }
          className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
        >
          <option value="">Tous les types</option>
          <option value="vente">Vente</option>
          <option value="don">Don</option>
          <option value="echange">Échange</option>
        </select>
        <select
          value={filters.categories}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleChange("categories", e.target.value)
          }
          className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
        >
          <option value="">Toutes catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Prix max (FCFA)"
          value={filters.price_max}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("price_max", e.target.value)
          }
        />
        <Button variant="secondary" onClick={handleReset}>
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
