"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { emailVerificationService } from "@/services/email-verification.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, CheckCircle, Send, AlertCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const isVerified = user?.email_verified_at != null;

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    setResent(false);

    try {
      const result = await emailVerificationService.resendVerification();
      setResent(true);
    } catch (err) {
      console.error("Failed to resend verification:", err);
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold">Email vérifié</h2>
            <p className="mt-2 text-[var(--color-muted)]">
              Votre adresse email est déjà vérifiée.
            </p>
            <Button onClick={() => router.push("/listings")} className="mt-6 w-full">
              Retour aux annonces
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Vérifiez votre email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-[var(--color-muted)]">
            <p>
              Un email de vérification a été envoyé à{" "}
              <span className="font-medium text-[var(--color-foreground)]">
                {user.email}
              </span>
            </p>
            <p className="mt-2 text-sm">
              Veuillez cliquer sur le lien dans l'email pour activer votre compte.
            </p>
          </div>

          {resent && (
            <div className="rounded-lg bg-green-50 p-4 text-center text-sm text-green-700">
              <CheckCircle className="mr-1 h-4 w-4" />
              Email de vérification envoyé !
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
              <AlertCircle className="mr-1 h-4 w-4 inline" />
              {error}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleResend}
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Envoi en cours...
                </>
              ) : (
                <>
                <Send className="mr-2 h-4 w-4" />
                Renvoyer l'email de vérification
              </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/listings")}
              className="w-full"
            >
              Retour aux annonces
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}