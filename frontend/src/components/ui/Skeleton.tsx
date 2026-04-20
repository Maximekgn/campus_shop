'use client';

import { ReactNode } from 'react';

export default function Skeleton({
  className = '',
  variant = 'text',
}: {
  className?: string;
  variant?: 'text' | 'card' | 'circle';
}): ReactNode {
  const baseClasses =
    'animate-pulse bg-gradient-to-r from-[var(--color-soft)] via-[var(--color-primary-soft)] to-[var(--color-soft)] bg-[length:200%_100%] rounded';

  const variantClasses = {
    text: 'h-4 w-3/4 rounded-[8px]',
    card: 'h-48 w-full rounded-[28px]',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        backgroundPosition: '200% 0',
        animation: 'shimmer 2s infinite',
      }}
    />
  );
}
