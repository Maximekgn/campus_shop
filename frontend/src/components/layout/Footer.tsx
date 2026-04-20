export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} CampusShop</p>
        <p>Petites annonces et troc entre étudiants</p>
      </div>
    </footer>
  );
}
