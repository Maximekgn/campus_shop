import Link from 'next/link';

const navigation = {
  site: [
    { href: '/listings', label: 'Annonces'  },
    { href: '/about',    label: 'À propos'  },
    { href: '/contact',  label: 'Contact'   },
  ],
  legal: [
    { href: '/privacy', label: 'Confidentialité' },
    { href: '/terms',   label: 'Conditions'      },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">

          {/* Brand */}
          <div className="max-w-xs">
            <p className="text-sm font-semibold text-[var(--color-foreground)]">CampusShop</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Petites annonces entre étudiants — achète, vends, donne ou échange.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                Navigation
              </p>
              <ul className="mt-3 space-y-2">
                {navigation.site.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                Légal
              </p>
              <ul className="mt-3 space-y-2">
                {navigation.legal.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-[var(--color-border)] pt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} CampusShop
          </p>
          <p className="text-xs text-[var(--color-muted)]">support@campusshop.tg · Lomé, Togo</p>
        </div>

      </div>
    </footer>
  );
}
