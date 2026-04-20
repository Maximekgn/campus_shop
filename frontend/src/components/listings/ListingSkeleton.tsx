'use client';

import { ReactNode } from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function ListingSkeleton(): ReactNode {
  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 md:col-span-1">
      <Skeleton variant="card" className="mb-4" />
      <Skeleton className="mb-3 w-2/3" />
      <Skeleton className="mb-3 w-1/2" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}
