import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2";
  const variantStyles =
    variant === "secondary"
      ? "border border-[var(--color-primary)] bg-white text-[var(--color-foreground)] hover:bg-[var(--color-primary-soft)]"
      : variant === "ghost"
      ? "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-primary-soft)]"
      : "bg-[var(--color-primary)] text-white shadow-[var(--color-shadow)] hover:bg-[var(--color-primary-dark)]";

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
