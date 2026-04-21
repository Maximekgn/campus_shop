"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfileResponse } from "@/services/user.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Package, CheckCircle, MessageCircle, Calendar } from "lucide-react";

type UserProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await userService.getProfile(Number(id));
        setProfile(data);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Utilisateur non trouvé</h1>
          <button
            onClick={() => router.push("/listings")}
            className="mt-4 flex items-center gap-2 text-[var(--color-primary)]"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux annonces
          </button>
        </div>
      </div>
    );
  }

  const { user, stats } = profile;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">
          {user.name}
        </h1>
        {user.is_active ? (
          <p className="mt-1 text-sm text-green-600">En ligne</p>
        ) : (
          <p className="mt-1 text-sm text-gray-500">Hors ligne</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annonces publiées</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published_listings_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes effectuées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sold_listings_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réponse</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.response_rate_percent !== null 
                ? `${stats.response_rate_percent}%` 
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Membre depuis le {new Date(stats.registration_date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
