'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || user?.role !== 'moderateur') {
      router.push('/');
      return;
    }
    
    setChecked(true);
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
        <AdminSidebar />
        <section className="min-w-0 flex-1 rounded-[28px] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),white_34%)] p-4 shadow-[var(--color-shadow)] sm:p-6 lg:p-7 xl:p-8">
          {children}
        </section>
      </div>
    </div>
  );
}
