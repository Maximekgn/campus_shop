'use client';

import { ChangeEvent, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type FilterState = {
  search: string;
  type: string;
  maxPrice: string;
};

type ListingFiltersProps = {
  onFilter: (filters: FilterState) => void;
};

export default function ListingFilters({ onFilter }: ListingFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    maxPrice: '',
  });

  const handleChange = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilter(updated);
  };

  const handleReset = () => {
    const empty = { search: '', type: '', maxPrice: '' };
    setFilters(empty);
    onFilter(empty);
  };

  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-foreground)]">
        Filtrer les annonces
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          type="text"
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('search', e.target.value)}
        />
        <select
          value={filters.type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange('type', e.target.value)}
          className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
        >
          <option value="">Tous les types</option>
          <option value="vente">Vente</option>
          <option value="don">Don</option>
          <option value="echange">Échange</option>
        </select>
        <Input
          type="number"
          placeholder="Prix max (FCFA)"
          value={filters.maxPrice}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('maxPrice', e.target.value)}
        />
        <Button variant="secondary" onClick={handleReset}>
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
