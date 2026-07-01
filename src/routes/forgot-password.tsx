import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Mot de passe oublié — OBCO" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api("/api/password/request-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
        auth: false,
      });

      setSuccess(true);
      toast.success("Email envoyé ! Vérifiez votre boîte de réception.");
    } catch (err: any) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
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
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Mot de passe oublié</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        {success ? (
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Email envoyé !</h3>
              <p className="text-sm text-muted-foreground">
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email
                avec les instructions pour réinitialiser votre mot de passe.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              L'email peut prendre quelques minutes pour arriver. Pensez à vérifier vos spams.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate({ to: "/login" })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-2xl p-6">
            <div className="space-y-1.5">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate({ to: "/login" })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
