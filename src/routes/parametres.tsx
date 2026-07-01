import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getUser, useUser } from "@/lib/auth";
import { User, Bell, Lock, Building, Palette, Globe, Code2, Download, Github, Users, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/parametres")({
  head: () => ({ meta: [{ title: "Paramètres — OBCO" }] }),
  component: SettingsPage,
});

const TABS = [
  { id: "profile", label: "Profil", icon: User },
  { id: "utilisateurs", label: "Utilisateurs (Agences)", icon: Users },
  { id: "admin", label: "Comptes Admin", icon: ShieldCheck },
  { id: "pharmacy", label: "Officine", icon: Building },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Sécurité", icon: Lock },
  { id: "appearance", label: "Apparence", icon: Palette },
  { id: "locale", label: "Langue & Région", icon: Globe },

] as const;

function SettingsPage() {
  const navigate = useNavigate();
  const user = useUser();
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("profile");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getUser()) { navigate({ to: "/login" }); return; }
    const sync = () => {
      const h = window.location.hash.replace("#", "");
      if (h && TABS.some(t => t.id === h)) setTab(h as typeof TABS[number]["id"]);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [navigate]);

  return (
    <AppShell title="Paramètres" subtitle="Préférences du compte">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <nav className="space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (typeof window !== "undefined") history.replaceState(null, "", `#${t.id}`); }}
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
          {tab === "utilisateurs" && <UsersSection />}
          {tab === "admin" && <AdminAccountsSection />}
          {tab === "pharmacy" && <PharmacySection />}
          {tab === "notifications" && <NotificationsSection />}
          {tab === "security" && <SecuritySection />}
          {tab === "appearance" && <AppearanceSection />}
          {tab === "locale" && <LocaleSection />}

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
    <Section title="Profil" desc="Vos informations personnelles affichées sur OBCO.">
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
      <ToggleRow title="Nouveautés OBCO" desc="Annonces produit et conseils." />
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



function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function UsersSection() {
  const [accounts, setAccounts] = useState([
    { id: "U-001", agence: "ANF Abidjan", email: "abidjan@anf.com", login: "anf.abidjan", role: "Agence", status: "active" },
    { id: "U-002", agence: "ANF Dakar", email: "dakar@anf.com", login: "anf.dakar", role: "Agence", status: "active" },
    { id: "U-003", agence: "ANF Bamako", email: "bamako@anf.com", login: "anf.bamako", role: "Agence", status: "active" },
    { id: "U-004", agence: "ANF Douala", email: "douala@anf.com", login: "anf.douala", role: "Agence", status: "inactive" },
  ]);
  const [form, setForm] = useState({ agence: "", email: "", login: "", password: "" });

  const create = () => {
    if (!form.agence || !form.email || !form.login) return toast.error("Champs requis manquants");
    setAccounts(a => [...a, { id: `U-${String(a.length + 1).padStart(3, "0")}`, agence: form.agence, email: form.email, login: form.login, role: "Agence", status: "active" }]);
    setForm({ agence: "", email: "", login: "", password: "" });
    toast.success("Compte agence créé");
  };

  return (
    <Section title="Utilisateurs (Agences)" desc="Gérez les identifiants et créez de nouveaux comptes agences.">
      <div className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
        <div><Label className="text-xs">Agence</Label><Input value={form.agence} onChange={e => setForm({ ...form, agence: e.target.value })} placeholder="ANF Lomé" /></div>
        <div><Label className="text-xs">Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="lome@anf.com" /></div>
        <div><Label className="text-xs">Identifiant</Label><Input value={form.login} onChange={e => setForm({ ...form, login: e.target.value })} placeholder="anf.lome" /></div>
        <div><Label className="text-xs">Mot de passe initial</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></div>
        <div className="sm:col-span-2 flex justify-end">
          <Button size="sm" onClick={create}><Plus className="mr-2 h-4 w-4" />Créer un compte agence</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-3 py-2 text-left">Agence</th><th className="px-3 py-2 text-left">Identifiant</th><th className="px-3 py-2 text-left">Email</th><th className="px-3 py-2 text-left">Statut</th><th className="px-3 py-2"></th></tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id} className="border-t border-border/60">
                <td className="px-3 py-2.5 font-medium">{a.agence}</td>
                <td className="px-3 py-2.5 font-mono text-xs">{a.login}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{a.email}</td>
                <td className="px-3 py-2.5"><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${a.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{a.status}</span></td>
                <td className="px-3 py-2.5 text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setAccounts(list => list.filter(x => x.id !== a.id)); toast.success("Compte supprimé"); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function AdminAccountsSection() {
  const [admins, setAdmins] = useState([
    { id: "A-001", name: "Admin Principal", email: "admin@anf.com", role: "Super-Admin" },
    { id: "A-002", name: "Pierre Lemoine", email: "p.lemoine@anf.com", role: "Admin" },
  ]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const create = () => {
    if (!form.name || !form.email) return toast.error("Champs requis manquants");
    setAdmins(a => [...a, { id: `A-${String(a.length + 1).padStart(3, "0")}`, name: form.name, email: form.email, role: "Admin" }]);
    setForm({ name: "", email: "", password: "" });
    toast.success("Compte admin créé");
  };

  return (
    <Section title="Comptes Admin" desc="Gérez les administrateurs existants ou créez-en de nouveaux.">
      <div className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
        <div><Label className="text-xs">Nom complet</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label className="text-xs">Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Mot de passe initial</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        <div className="sm:col-span-2 flex justify-end">
          <Button size="sm" onClick={create}><Plus className="mr-2 h-4 w-4" />Créer un compte admin</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-3 py-2 text-left">Nom</th><th className="px-3 py-2 text-left">Email</th><th className="px-3 py-2 text-left">Rôle</th><th className="px-3 py-2"></th></tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="border-t border-border/60">
                <td className="px-3 py-2.5 font-medium">{a.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{a.email}</td>
                <td className="px-3 py-2.5"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{a.role}</span></td>
                <td className="px-3 py-2.5 text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={a.role === "Super-Admin"} onClick={() => { setAdmins(list => list.filter(x => x.id !== a.id)); toast.success("Admin supprimé"); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

