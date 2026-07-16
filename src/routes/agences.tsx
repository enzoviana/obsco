import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Mail, MapPin, Users, Search, Download, Pencil, Ban, Play } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import { addAgency, deleteAgency, getAgencies, updateAgency, setAgencyStatus, type Agency } from "@/lib/agencies";
import { WORLD_COUNTRIES } from "@/lib/countries-data";
import { exportCSV } from "@/lib/export";

export const Route = createFileRoute("/agences")({
  head: () => ({ meta: [{ title: "Agences — OBCO" }] }),
  component: AgencesPage,
});

function AgencesPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [list, setList] = useState<Agency[]>(() => (typeof window !== "undefined" ? getAgencies() : []));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Agency | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = getUser();
    if (!u) navigate({ to: "/login" });
    
    setList(getAgencies());
    const sync = () => setList(getAgencies());
    window.addEventListener("obco:agencies", sync);
    return () => window.removeEventListener("obco:agencies", sync);
  }, [navigate]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return list.filter(a =>
      (country === "all" || a.country === country) &&
      (!ql || a.name.toLowerCase().includes(ql) || a.email.toLowerCase().includes(ql) || a.manager.toLowerCase().includes(ql))
    );
  }, [list, q, country]);

  const handleExport = () => {
    exportCSV("agences", filtered.map(a => {
      const c = WORLD_COUNTRIES.find(x => x.code === a.country);
      return {
        ID: a.id, Nom: a.name, Pays: c?.name ?? a.country, "Code ISO": a.country, Région: c?.region ?? "",
        Ville: a.city, Email: a.email, Responsable: a.manager, "Date création": a.createdAt, Statut: a.status,
      };
    }));
    toast.success("Export CSV téléchargé");
  };

  return (
    <AppShell
      title="Agences du réseau"
      subtitle={`${list.length} agences réparties sur ${new Set(list.map(a => a.country)).size} pays`}
      actions={<>
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Exporter</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Créer une agence</Button>
          </DialogTrigger>
          <AgencyDialog onClose={() => setOpen(false)} agency={null} />
        </Dialog>
      </>}
    >
      <div className="rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher par nom, email, responsable…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Pays" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            {[...WORLD_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name, 'fr')).map(c => <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-surface">
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Agence</th>
                <th className="px-4 py-3 text-left font-medium">Pays</th>
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Région</th>
                <th className="px-4 py-3 text-left font-medium">Responsable</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const c = WORLD_COUNTRIES.find(x => x.code === a.country);
                const blocked = a.status === "blocked";
                return (
                <tr key={a.id} className="border-t border-border/60 hover:bg-surface/60">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-[11px] font-semibold text-primary">
                        {a.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-[11px] text-muted-foreground"> {a.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3 w-3" />{c?.name ?? a.country}</span></td>
                  <td className="px-4 py-3.5 font-mono text-xs">{a.country}</td>
                  <td className="px-4 py-3.5 text-muted-foreground text-xs">{c?.region ?? "—"}</td>
                  <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5"><Users className="h-3 w-3 text-muted-foreground" />{a.manager}</span></td>
                  <td className="px-4 py-3.5 text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3" />{a.email}</span></td>
                  <td className="px-4 py-3.5"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(a)} title="Éditer">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title={blocked ? "Débloquer" : "Bloquer"}
                        onClick={() => { setAgencyStatus(a.id, blocked ? "active" : "blocked"); toast.success(blocked ? "Agence débloquée" : "Agence bloquée"); }}>
                        {blocked ? <Play className="h-3.5 w-3.5 text-primary" /> : <Ban className="h-3.5 w-3.5 text-warning" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Supprimer"
                        onClick={() => { if (confirm(`Supprimer ${a.name} ?`)) { deleteAgency(a.id); toast.success("Agence supprimée"); } }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-sm">Aucune agence trouvée.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && <AgencyDialog onClose={() => setEditing(null)} agency={editing} />}
      </Dialog>
    </AppShell>
  );
}

function AgencyDialog({ onClose, agency }: { onClose: () => void; agency: Agency | null }) {
  const [name, setName] = useState(agency?.name ?? "");
  const [country, setCountry] = useState(agency?.country ?? WORLD_COUNTRIES[0].code);
  const [manager, setManager] = useState(agency?.manager ?? "");
  const [email, setEmail] = useState(agency?.email ?? "");
  const [city, setCity] = useState(agency?.city ?? "");
  const [loading, setLoading] = useState(false);

  // Trier les pays par ordre alphabétique
  const sortedCountries = useMemo(() =>
    [...WORLD_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    []
  );

  const submit = async () => {
    if (!name || !country || !email) { toast.error("Champs requis manquants"); return; }

    setLoading(true);
    try {
      if (agency) {
        updateAgency(agency.id, { name, country, manager, email, city });
        toast.success(`Agence ${name} mise à jour`);
      } else {
        const result = await addAgency({ name, country, manager, email, city });

        // Afficher le mot de passe temporaire si disponible
        if (result.temporaryPassword) {
          toast.success(
            <div>
              <div className="font-semibold mb-1">✅ Agence {name} créée</div>
              <div className="text-xs opacity-90">📧 Email envoyé à {email}</div>
              <div className="mt-2 p-2 bg-background/50 rounded border">
                <div className="text-xs font-semibold">Mot de passe provisoire :</div>
                <div className="font-mono text-sm mt-1 select-all">{result.temporaryPassword}</div>
              </div>
            </div>,
            { duration: 10000 } // Afficher pendant 10 secondes
          );
        } else {
          toast.success(`Agence ${name} créée`);
        }
      }
      onClose();
    } catch (error: any) {
      console.error("Erreur création agence:", error);
      const errorMessage = error?.message || error?.error || "Erreur lors de la création de l'agence";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{agency ? "Modifier l'agence" : "Nouvelle agence"}</DialogTitle>
        <DialogDescription>Plusieurs agences peuvent être créées dans un même pays.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div><Label>Nom de l'agence *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="ANF …" /></div>
        <div>
          <Label>Pays *</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {sortedCountries.map(c => <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Ville</Label><Input value={city} onChange={e => setCity(e.target.value)} /></div>
          <div><Label>Responsable</Label><Input value={manager} onChange={e => setManager(e.target.value)} /></div>
        </div>
        <div><Label>Email *</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>Annuler</Button>
        <Button onClick={submit} disabled={loading}>
          {loading ? "Création en cours..." : (agency ? "Enregistrer" : "Créer l'agence")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
