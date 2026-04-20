'use client';

import { ReactNode } from 'react';

export default function LoadingSpinner({
  size = 'md',
  fullScreen = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}): ReactNode {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className="relative inline-flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-4 border-[var(--color-primary-soft)] border-t-[var(--color-primary)] animate-spin`}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center py-8">{spinner}</div>;
}
