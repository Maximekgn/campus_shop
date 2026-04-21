import type { ReactNode } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
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
