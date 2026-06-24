import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getUser, useUser } from "@/lib/auth";
import { User, Bell, Lock, Building, Palette, Globe, Code2, Download, Github } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/parametres")({
  head: () => ({ meta: [{ title: "Paramètres — DATAFUSE" }] }),
  component: SettingsPage,
});

const TABS = [
  { id: "profile", label: "Profil", icon: User },
  { id: "pharmacy", label: "Officine", icon: Building },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Sécurité", icon: Lock },
  { id: "appearance", label: "Apparence", icon: Palette },
  { id: "locale", label: "Langue & Région", icon: Globe },
  { id: "developer", label: "Code source", icon: Code2 },
] as const;

function SettingsPage() {
  const navigate = useNavigate();
  const user = useUser();
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("profile");

  useEffect(() => { if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" }); }, [navigate]);

  return (
    <AppShell title="Paramètres" subtitle="Préférences du compte">
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                tab === t.id ? "bg-card border border-border shadow-sm font-medium" : "text-muted-foreground hover:text-foreground hover:bg-card/60"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-border bg-card p-6">
          {tab === "profile" && <ProfileSection email={user?.email ?? ""} name={user?.name ?? ""} />}
          {tab === "pharmacy" && <PharmacySection />}
          {tab === "notifications" && <NotificationsSection />}
          {tab === "security" && <SecuritySection />}
          {tab === "appearance" && <AppearanceSection />}
          {tab === "locale" && <LocaleSection />}
          {tab === "developer" && <DeveloperSection />}
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <Separator className="my-6" />
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-center">
      <Label className="text-sm">{label}</Label>
      <div>
        {children}
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

function SaveBar() {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button variant="ghost">Annuler</Button>
      <Button onClick={() => toast.success("Modifications enregistrées")}>Enregistrer</Button>
    </div>
  );
}

function ProfileSection({ email, name }: { email: string; name: string }) {
  return (
    <Section title="Profil" desc="Vos informations personnelles affichées sur DataFuse.">
      <Field label="Nom complet"><Input defaultValue={name} /></Field>
      <Field label="Email"><Input type="email" defaultValue={email} /></Field>
      <Field label="Téléphone"><Input type="tel" placeholder="06 12 34 56 78" /></Field>
      <Field label="Fonction"><Input defaultValue="Responsable agence" /></Field>
      <SaveBar />
    </Section>
  );
}

function PharmacySection() {
  return (
    <Section title="Agence" desc="Informations légales et de contact de votre agence.">
      <Field label="Raison sociale"><Input defaultValue="ANF Abidjan SARL" /></Field>
      <Field label="N° FINESS"><Input defaultValue="750012345" /></Field>
      <Field label="Adresse"><Input defaultValue="14 rue de la République, 75011 Paris" /></Field>
      <Field label="N° de TVA"><Input defaultValue="FR12345678901" /></Field>
      <SaveBar />
    </Section>
  );
}

function NotificationsSection() {
  return (
    <Section title="Notifications" desc="Choisissez ce que vous souhaitez recevoir.">
      <ToggleRow title="Alertes de stock faible" desc="Recevoir un email lorsqu'un produit passe sous son seuil." defaultChecked />
      <ToggleRow title="Ruptures de stock" desc="Notification immédiate en cas de rupture." defaultChecked />
      <ToggleRow title="Imports terminés" desc="Confirmation à la fin de chaque import." />
      <ToggleRow title="Rapport hebdomadaire" desc="Résumé chaque lundi matin." defaultChecked />
      <ToggleRow title="Nouveautés DataFuse" desc="Annonces produit et conseils." />
    </Section>
  );
}

function ToggleRow({ title, desc, defaultChecked }: { title: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function SecuritySection() {
  return (
    <Section title="Sécurité" desc="Mot de passe et authentification.">
      <Field label="Mot de passe actuel"><Input type="password" /></Field>
      <Field label="Nouveau mot de passe"><Input type="password" /></Field>
      <Field label="Confirmer"><Input type="password" /></Field>
      <ToggleRow title="Authentification à deux facteurs" desc="Sécurisez votre compte avec un code à usage unique." defaultChecked />
      <SaveBar />
    </Section>
  );
}

function AppearanceSection() {
  return (
    <Section title="Apparence" desc="Personnalisez l'interface.">
      <Field label="Thème">
        <div className="flex gap-2">
          {["Clair", "Sombre", "Système"].map((t, i) => (
            <button key={t} className={`rounded-xl border px-4 py-2 text-sm ${i === 0 ? "border-primary bg-accent" : "border-border bg-surface text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </Field>
      <ToggleRow title="Densité compacte" desc="Affichez plus d'informations à l'écran." />
      <ToggleRow title="Animations réduites" desc="Limite les transitions et animations." />
    </Section>
  );
}

function LocaleSection() {
  return (
    <Section title="Langue & Région" desc="Format des dates, devises et langue de l'interface.">
      <Field label="Langue"><Input defaultValue="Français (France)" /></Field>
      <Field label="Devise"><Input defaultValue="EUR (€)" /></Field>
      <Field label="Fuseau horaire"><Input defaultValue="Europe/Paris (UTC+1)" /></Field>
      <Field label="Format de date"><Input defaultValue="JJ/MM/AAAA" /></Field>
      <SaveBar />
    </Section>
  );
}

function DeveloperSection() {
  return (
    <Section title="Code source" desc="Téléchargez l'intégralité du code source de DataFuse.">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary"><Code2 className="h-6 w-6" /></div>
          <div className="min-w-0 flex-1">
            <div className="font-medium">Archive complète (.zip)</div>
            <p className="mt-1 text-sm text-muted-foreground">Contient toutes les sources, composants et configurations du projet.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild>
                <a href="/datafuse-source.zip" download>
                  <Download className="mr-2 h-4 w-4" /> Télécharger le ZIP
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Voir sur GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <InfoCard label="Framework" value="TanStack Start" />
        <InfoCard label="Style" value="Tailwind v4" />
        <InfoCard label="Licence" value="Propriétaire" />
      </div>
    </Section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
