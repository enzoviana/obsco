import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Mail, Search, Download, Truck, MapPin, Pencil, Ban, Play, Building2, Globe2 } from "lucide-react";
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
import {
  COUNTRIES, addGrossiste, deleteGrossiste, getGrossistes, updateGrossiste, setGrossisteStatus,
  getAgencies, type Grossiste,
} from "@/lib/agencies";
import { exportCSV } from "@/lib/export";

export const Route = createFileRoute("/grossistes")({
  head: () => ({ meta: [{ title: "Grossistes — OBCO" }] }),
  component: GrossistesPage,
});

function GrossistesPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("all");
  const [list, setList] = useState<Grossiste[]>(() => (typeof window !== "undefined" ? getGrossistes() : []));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Grossiste | null>(null);
  const agencies = typeof window !== "undefined" ? getAgencies() : [];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = getUser();
    if (!u) navigate({ to: "/login" });
    
    setList(getGrossistes());
    const sync = () => setList(getGrossistes());
    window.addEventListener("obco:gros", sync);
    return () => window.removeEventListener("obco:gros", sync);
  }, [navigate]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return list.filter(g =>
      (country === "all" || g.country === country) &&
      (!ql || g.partenaire.toLowerCase().includes(ql) || g.email.toLowerCase().includes(ql))
    );
  }, [list, q, country]);

  const handleExport = () => {
    exportCSV("grossistes", filtered.map(g => {
      return {
        ID: g.id, Partenaire: g.partenaire, Type: g.type,
        "Code Pays": g.country, Pays: COUNTRIES.find(c => c.code === g.country)?.name ?? g.country,
        Statut: g.status, Email: g.email,
      };
    }));
    toast.success("Export CSV téléchargé");
  };

  return (
    <AppShell
      title="Grossistes"
      subtitle={`${list.length} partenaires`}
      actions={<>
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Exporter</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Ajouter un Grossiste</Button>
          </DialogTrigger>
          <GrossisteDialog onClose={() => setOpen(false)} g={null} />
        </Dialog>
      </>}
    >
      <div className="rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un partenaire…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-surface">
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Partenaire</th>
                <th className="px-4 py-3 text-left font-medium">Pays</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => {
                const c = COUNTRIES.find(x => x.code === g.country);
                const blocked = g.status === "blocked";
                return (
                  <tr key={g.id} className="border-t border-border/60 hover:bg-surface/60">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{g.partenaire}</div>
                          <div className="text-[11px] text-muted-foreground">{g.id} · {g.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground"><span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" />{c?.name ?? g.country} <span className="font-mono text-[10px]">({g.country})</span></span></td>
                    <td className="px-4 py-3.5"><StatusBadge status={g.status} /></td>
                    <td className="px-4 py-3.5 text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3" />{g.email}</span></td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(g)} title="Éditer">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title={blocked ? "Débloquer" : "Bloquer"}
                          onClick={() => { setGrossisteStatus(g.id, blocked ? "active" : "blocked"); toast.success(blocked ? "Grossiste débloqué" : "Grossiste bloqué"); }}>
                          {blocked ? <Play className="h-3.5 w-3.5 text-primary" /> : <Ban className="h-3.5 w-3.5 text-warning" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Supprimer"
                          onClick={() => { if (confirm(`Supprimer ${g.partenaire} ?`)) { deleteGrossiste(g.id); toast.success("Grossiste supprimé"); } }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">Aucun Grossiste trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && <GrossisteDialog onClose={() => setEditing(null)} g={editing} />}
      </Dialog>
    </AppShell>
  );
}

function GrossisteDialog({ onClose, g }: { onClose: () => void; g: Grossiste | null }) {
  const [f, setF] = useState<Omit<Grossiste, "id">>({
    partenaire: g?.partenaire ?? "", type: "Grossiste",
    country: g?.country ?? COUNTRIES[0].code,
    email: g?.email ?? "", status: g?.status ?? "active",
  });

  const submit = () => {
    if (!f.partenaire || !f.email) { toast.error("Champs requis manquants"); return; }
    if (g) { updateGrossiste(g.id, f); toast.success("Grossiste mis à jour"); }
    else { addGrossiste(f); toast.success(`${f.partenaire} ajouté`); }
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{g ? "Modifier le Grossiste" : "Nouveau Grossiste"}</DialogTitle>
        <DialogDescription>Informations du grossiste.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div><Label>Partenaire *</Label><Input value={f.partenaire} onChange={e => setF({ ...f, partenaire: e.target.value })} placeholder="ex. CAMED" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Pays *</Label>
            <Select value={f.country} onValueChange={v => setF({ ...f, country: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Statut</Label>
            <Select value={f.status} onValueChange={(v: Grossiste["status"]) => setF({ ...f, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="warning">Retirer</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="blocked">Bloqué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Email *</Label><Input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={submit}>{g ? "Enregistrer" : "Ajouter"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
