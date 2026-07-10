import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getUser, useUser } from "@/lib/auth";
import { User, Bell, Lock, Users, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/parametres")({
  head: () => ({ meta: [{ title: "Paramètres — OBCO" }] }),
  component: SettingsPage,
  ssr: false,
});

const TABS = [
  { id: "profile", label: "Profil", icon: User },
  { id: "utilisateurs", label: "Utilisateurs (Agences)", icon: Users },
  { id: "admin", label: "Comptes Admin", icon: ShieldCheck },
  { id: "security", label: "Sécurité", icon: Lock },
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
          {tab === "profile" && <ProfileSection />}
          {tab === "utilisateurs" && <UsersSection />}
          {tab === "admin" && <AdminAccountsSection />}
          {tab === "security" && <SecuritySection />}
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

function ProfileSection() {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const save = async () => {
    if (!name || !email) {
      toast.error("Tous les champs sont requis");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const response = await fetch(`${apiUrl}/api/auth/me/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        const updated = await response.json();
        // Mettre à jour le localStorage
        const currentUser = JSON.parse(localStorage.getItem("obco_user") || "{}");
        localStorage.setItem("obco_user", JSON.stringify({ ...currentUser, ...updated }));
        window.dispatchEvent(new Event("obco:user"));
        toast.success("Profil mis à jour");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section title="Profil" desc="Vos informations personnelles affichées sur OBCO.">
      <Field label="Nom complet">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={() => { setName(user?.name || ""); setEmail(user?.email || ""); }}>
          Annuler
        </Button>
        <Button onClick={save} disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </Section>
  );
}

function SecuritySection() {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Tous les champs sont requis");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const response = await fetch(`${apiUrl}/api/auth/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Mot de passe modifié");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section title="Sécurité" desc="Mot de passe et authentification.">
      <Field label="Mot de passe actuel">
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
        />
      </Field>
      <Field label="Nouveau mot de passe">
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
        />
      </Field>
      <Field label="Confirmer">
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          onClick={() => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
        >
          Annuler
        </Button>
        <Button onClick={changePassword} disabled={loading}>
          {loading ? "Modification..." : "Changer le mot de passe"}
        </Button>
      </div>
    </Section>
  );
}

function UsersSection() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [form, setForm] = useState({ agencyId: "", email: "", password: "", name: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const [usersRes, agenciesRes] = await Promise.all([
        fetch(`${apiUrl}/api/users/agencies`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/api/agencies`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (usersRes.ok) {
        const users = await usersRes.json();
        setAccounts(users);
      }

      if (agenciesRes.ok) {
        const agenciesData = await agenciesRes.json();
        setAgencies(agenciesData);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const create = async () => {
    if (!form.agencyId || !form.email || !form.password || !form.name) {
      toast.error("Tous les champs sont requis");
      return;
    }

    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const response = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: "agence",
          agencyId: form.agencyId,
        }),
      });

      if (response.ok) {
        setForm({ agencyId: "", email: "", password: "", name: "" });
        toast.success("Compte agence créé");
        loadData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création");
    }
  };

  const deleteAccount = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce compte ?")) return;

    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const response = await fetch(`${apiUrl}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok || response.status === 204) {
        toast.success("Compte supprimé");
        loadData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <Section title="Utilisateurs (Agences)" desc="Chargement...">
        <div className="text-center text-muted-foreground py-8">Chargement...</div>
      </Section>
    );
  }

  return (
    <Section title="Utilisateurs (Agences)" desc="Gérez les identifiants et créez de nouveaux comptes agences.">
      <div className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Agence</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.agencyId}
            onChange={(e) => setForm({ ...form, agencyId: e.target.value })}
          >
            <option value="">Sélectionner une agence</option>
            {agencies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} - {a.city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-xs">Nom complet</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jean Dupont" />
        </div>
        <div>
          <Label className="text-xs">Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jean@agence.com" />
        </div>
        <div>
          <Label className="text-xs">Mot de passe initial</Label>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button size="sm" onClick={create}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un compte agence
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Nom</th>
              <th className="px-3 py-2 text-left">Agence</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                  Aucun compte agence
                </td>
              </tr>
            ) : (
              accounts.map((a) => (
                <tr key={a.id} className="border-t border-border/60">
                  <td className="px-3 py-2.5 font-medium">{a.name}</td>
                  <td className="px-3 py-2.5">{a.agency?.name || "N/A"}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{a.email}</td>
                  <td className="px-3 py-2.5 text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteAccount(a.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function AdminAccountsSection() {
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const response = await fetch(`${apiUrl}/api/users/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des admins");
    } finally {
      setLoading(false);
    }
  };

  const create = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Tous les champs sont requis");
      return;
    }

    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const response = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: "super_admin",
          agencyId: null,
        }),
      });

      if (response.ok) {
        setForm({ name: "", email: "", password: "" });
        toast.success("Compte super-admin créé");
        loadAdmins();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création");
    }
  };

  const deleteAdmin = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce compte admin ?")) return;

    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const response = await fetch(`${apiUrl}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok || response.status === 204) {
        toast.success("Admin supprimé");
        loadAdmins();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <Section title="Comptes Admin" desc="Chargement...">
        <div className="text-center text-muted-foreground py-8">Chargement...</div>
      </Section>
    );
  }

  return (
    <Section title="Comptes Admin" desc="Gérez les administrateurs existants ou créez de nouveaux comptes super-admin.">
      <div className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Nom complet</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Admin Name" />
        </div>
        <div>
          <Label className="text-xs">Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@obco.com" />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Mot de passe initial</Label>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button size="sm" onClick={create}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un compte super-admin
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Nom</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Rôle</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                  Aucun administrateur
                </td>
              </tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id} className="border-t border-border/60">
                  <td className="px-3 py-2.5 font-medium">{a.name}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{a.email}</td>
                  <td className="px-3 py-2.5">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Super-Admin
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={a.id === user?.id}
                      onClick={() => deleteAdmin(a.id)}
                      title={a.id === user?.id ? "Vous ne pouvez pas supprimer votre propre compte" : "Supprimer"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
