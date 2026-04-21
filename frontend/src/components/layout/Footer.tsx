import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white/95">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="mb-8 grid gap-8 sm:grid-cols-3 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-semibold text-[var(--color-foreground)]">CampusShop</h3>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Plateforme d'annonces conçue pour les étudiants
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[var(--color-foreground)]">Navigation</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/listings" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">
                  Annonces
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-[var(--color-foreground)]">Légal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">
                  Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[var(--color-foreground)]">Support</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-[var(--color-muted)]"><Mail className="h-4 w-4" /> support@campusshop.tg</li>
              <li className="flex items-center gap-2 text-[var(--color-muted)]"><MapPin className="h-4 w-4" /> Lomé, Togo</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-border)] pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-muted)]">© {new Date().getFullYear()} CampusShop</p>
            <p className="text-sm text-[var(--color-muted)]">Petites annonces et troc entre étudiants</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
