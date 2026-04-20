import type { ReactNode } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <AdminSidebar />
        <section className="min-w-0 flex-1 rounded-[24px] border border-[var(--color-border)] bg-white p-5 sm:p-6 lg:p-8">
          {children}
        </section>
      </div>
    </div>
  );
}
