"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listingService } from "@/services/listing.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Flag, CheckCircle, XCircle } from "lucide-react";

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

const REPORT_REASONS = [
  "Contenu inapproprié ou offensant",
  "Prix suspect ou Trompeur",
  "Annonce frauduleuse",
  "Violation des conditions d'utilisation",
  "Autre raison",
];

export default function ReportPage({ params }: ReportPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const data = await listingService.getById(Number(id));
        setListing(data);
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setListing({ id, title: "Annonce#" + id });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const finalReason = reason === "Autre raison" ? customReason : reason;

    if (!finalReason.trim()) {
      setError("Veuillez sélectionner ou entrer une raison");
      setSubmitting(false);
      return;
    }

    try {
      await listingService.report(Number(id), finalReason);
      setSuccess(true);
    } catch (err) {
      console.error("Failed to submit report:", err);
      setError("Échec de l'envoi du signalement. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold">Signalement envoyé</h2>
            <p className="mt-2 text-[var(--color-muted)]">
              Merci pour votre signalement. Notre équipe examinera cette annonce.
            </p>
            <Button
              onClick={() => router.push("/listings")}
              className="mt-6 w-full"
            >
              Retour aux annonces
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            Signaler une annonce
          </CardTitle>
        </CardHeader>
        <CardContent>
          {listing && (
            <div className="mb-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-[var(--color-muted)]">Annonce signalée:</p>
              <p className="font-medium">{listing.title}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Reason du signalement
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition hover:bg-slate-50 ${
                      reason === r
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-sm">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {reason === "Autre raison" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Précisez la raison
                </label>
                <Textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Décrivez le problème..."
                  rows={4}
                />
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Envoi...
                  </>
                ) : (
                  "Signaler"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
