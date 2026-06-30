import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Pill, ArrowRight, ShieldCheck, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, getUser, API_ENABLED } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — DATAFUSE" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && getUser()) throw redirect({ to: "/" });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(API_ENABLED ? "admin@datafuse.app" : "agence@datafuse.io");
  const [password, setPassword] = useState(API_ENABLED ? "ChangeMe123!" : "demo");
  const [role, setRoleState] = useState<"pharmacy" | "admin">("pharmacy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let user;
      if (API_ENABLED) {
        user = await login(email, password);
      } else {
        user = await login(email, role);
      }

      // Vérifier si l'utilisateur doit changer son mot de passe
      if (user.mustChangePassword) {
        navigate({ to: "/change-password" });
      } else {
        navigate({ to: "/" });
      }
    } catch (err: any) {
      setError(err?.message || "Échec de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "48px 48px, 64px 64px",
        }} />
        <div className="relative flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground/15 backdrop-blur">
            <Pill className="h-5 w-5" />
          </div>
          <div className="text-lg font-bold tracking-tight">DATA<span className="opacity-80">FUSE</span></div>
        </div>

        <div className="relative space-y-6">
          <h1 className="font-display text-5xl leading-[1.05]">Le système nerveux<br/>de votre officine.</h1>
          <p className="max-w-md text-sm opacity-85">
            Une plateforme unique pour piloter vos stocks, vos commandes et votre réseau —
            de 10 à 50 000 références, sans friction.
          </p>
          <div className="grid gap-3 max-w-md">
            {[
              { icon: Zap, t: "Synchronisation temps réel", d: "Importez, vendez, ajustez instantanément." },
              { icon: ShieldCheck, t: "Conforme & sécurisé", d: "RGPD, hébergement HDS, audit complet." },
              { icon: Building2, t: "Multi-officines", d: "Vision réseau pour les groupements." },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-primary-foreground/10 p-3 backdrop-blur">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-foreground/15">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{f.t}</div>
                  <div className="text-xs opacity-80">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs opacity-70">© 2026 DataFuse SAS · Tous droits réservés</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Pill className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold tracking-tight">DATA<span className="text-primary">FUSE</span></div>
          </div>

          <div className="text-xs font-medium uppercase tracking-wider text-primary">Bienvenue</div>
          <h2 className="mt-1 font-display text-4xl">Connectez-vous</h2>
          <p className="mt-2 text-sm text-muted-foreground">Accédez à votre tableau de bord ANF.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email professionnel</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pw">Mot de passe</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => navigate({ to: "/forgot-password" })}
                >
                  Oublié ?
                </button>
              </div>
              <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {!API_ENABLED && (
              <div className="space-y-1.5">
                <Label>Type de compte (démo)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: "pharmacy", l: "Agence" },
                    { v: "admin", l: "Super-Admin" },
                  ].map(o => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setRoleState(o.v as "pharmacy" | "admin")}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                        role === o.v
                          ? "border-primary bg-accent text-foreground"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Mode démo. Pour activer le backend Node.js, définissez <code>VITE_API_URL</code>.
                </p>
              </div>
            )}

            {error && <div className="text-sm text-destructive">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion…" : <>Se connecter <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Pas encore de compte ? <a href="#" className="text-primary hover:underline">Demander une démo</a>
          </p>
        </div>
      </div>
    </div>
  );
}
