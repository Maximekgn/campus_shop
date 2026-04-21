"use client";

import { ReactNode } from "react";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ListingsErrorPage(): ReactNode {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-full bg-red-100 p-6">
        <FileText className="h-12 w-12 text-red-500" />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
          Erreur d'annonce
        </h1>
        <p className="mt-4 text-lg text-[var(--color-muted)]">
          Impossible de charger l'annonce. Elle a peut-être été supprimée.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/listings">
          <Button>Voir toutes les annonces</Button>
        </Link>
        <Link href="/">
          <Button variant="secondary">Accueil</Button>
        </Link>
      </div>
    </div>
  );
}
