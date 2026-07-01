import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, ApiError } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/change-password")({
  head: () => ({ meta: [{ title: "Changer le mot de passe — DATAFUSE" }] }),
  beforeLoad: () => {
    // Vérifier que l'utilisateur est connecté
    if (typeof window !== "undefined" && !getUser()) {
      throw redirect({ to: "/login" });
    }
  },
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si c'est un changement forcé (premier login)
  const user = getUser();
  const isFirstLogin = user?.mustChangePassword === true;

  // Validation du mot de passe
  const passwordRequirements = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    match: newPassword === confirmPassword && newPassword.length > 0,
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isPasswordValid) {
      setError("Le mot de passe ne respecte pas les critères requis");
      setLoading(false);
      return;
    }

    try {
      await api("/api/password/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: isFirstLogin ? undefined : currentPassword,
          newPassword,
        }),
      });

      toast.success("Mot de passe modifié avec succès");

      // Si c'est la première connexion, déconnecter et rediriger vers login
      if (isFirstLogin) {
        // Déconnecter l'utilisateur pour qu'il se reconnecte avec son nouveau mot de passe
        localStorage.removeItem("datafuse_token");
        localStorage.removeItem("datafuse_user");

        toast.info("Veuillez vous reconnecter avec votre nouveau mot de passe");

        // Rediriger vers la page de login
        navigate({ to: "/login" });
      } else {
        // Changement normal de mot de passe, rafraîchir l'utilisateur et rediriger
        await api("/api/auth/me").then(() => {
          navigate({ to: "/" });
        });
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue lors du changement de mot de passe");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">
            {isFirstLogin ? "Définir votre mot de passe" : "Changer le mot de passe"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isFirstLogin
              ? "Pour des raisons de sécurité, vous devez définir un nouveau mot de passe avant de continuer."
              : "Choisissez un nouveau mot de passe sécurisé pour votre compte."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-2xl p-6">
          {!isFirstLogin && (
            <div className="space-y-1.5">
              <Label htmlFor="current">Mot de passe actuel</Label>
              <Input
                id="current"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="new">Nouveau mot de passe</Label>
            <Input
              id="new"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmer le mot de passe</Label>
            <Input
              id="confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* Indicateurs de force du mot de passe */}
          {newPassword && (
            <div className="space-y-2 p-3 bg-surface rounded-lg text-sm">
              <div className="font-medium text-foreground mb-2">Exigences du mot de passe :</div>
              <RequirementItem met={passwordRequirements.length} text="Au moins 8 caractères" />
              <RequirementItem met={passwordRequirements.uppercase} text="Une lettre majuscule" />
              <RequirementItem met={passwordRequirements.lowercase} text="Une lettre minuscule" />
              <RequirementItem met={passwordRequirements.number} text="Un chiffre" />
              {confirmPassword && (
                <RequirementItem met={passwordRequirements.match} text="Les mots de passe correspondent" />
              )}
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || !isPasswordValid}>
            {loading ? "Changement en cours..." : "Changer le mot de passe"}
          </Button>

          {!isFirstLogin && (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate({ to: "/" })}
            >
              Annuler
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="h-4 w-4 text-primary shrink-0" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
      <span className={met ? "text-primary" : "text-muted-foreground"}>{text}</span>
    </div>
  );
}
