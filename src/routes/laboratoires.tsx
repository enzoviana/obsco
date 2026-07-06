import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Mail, Phone, MapPin, Search, Download, FlaskConical, User, Pencil, Ban, Play } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import {
  addLaboratoire, deleteLaboratoire, getLaboratoires, updateLaboratoire, setLaboratoireStatus,
  type Laboratoire,
} from "@/lib/agencies";
import { exportCSV } from "@/lib/export";
import { WORLD_COUNTRIES } from "@/lib/countries-data";

export const Route = createFileRoute("/laboratoires")({
  head: () => ({ meta: [{ title: "Laboratoires — OBCO" }] }),
  component: LaboratoiresPage,
});

function LaboratoiresPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("all");
  const [list, setList] = useState<Laboratoire[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Laboratoire | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = getUser();
    if (!u) {
      navigate({ to: "/login" });
      return;
    }

    try {
      setList(getLaboratoires());
    } catch (err) {
      console.error("Erreur lors du chargement des laboratoires:", err);
      toast.error("Erreur lors du chargement des laboratoires");
      setList([]);
    }

    const sync = () => {
      try {
        setList(getLaboratoires());
      } catch (err) {
        console.error("Erreur lors de la synchronisation des laboratoires:", err);
      }
    };
    window.addEventListener("obco:labs", sync);
    return () => window.removeEventListener("obco:labs", sync);
  }, [navigate]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return list.filter(l =>
      (country === "all" || l.country === country) &&
      (!ql || l.name.toLowerCase().includes(ql) || l.email.toLowerCase().includes(ql) || l.contact.toLowerCase().includes(ql))
    );
  }, [list, q, country]);

  const handleExport = () => {
    exportCSV("laboratoires", filtered.map(l => {
      const c = WORLD_COUNTRIES.find(x => x.code === l.country);
      return {
        ID: l.id, Laboratoire: l.name, Pays: c?.name ?? l.country, "Code Pays": l.country, "Région": c?.region ?? "",
        Contact: l.contact, Email: l.email, Téléphone: l.phone, Adresse: l.address, Statut: l.status, "Date création": l.createdAt,
      };
    }));
    toast.success("Export CSV téléchargé");
  };

  return (
    <AppShell
      title="Laboratoires"
      subtitle={`${list.length} laboratoires · plusieurs labs autorisés par pays`}
      actions={<>
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Exporter</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Créer un laboratoire</Button>
          </DialogTrigger>
          <LabDialog onClose={() => setOpen(false)} lab={null} />
        </Dialog>
      </>}
    >
      <div className="rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher par nom, email, contact…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            {WORLD_COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-surface">
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Laboratoire</th>
                <th className="px-4 py-3 text-left font-medium">Pays</th>
                <th className="px-4 py-3 text-left font-medium">Région</th>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">Email / Tél.</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const c = WORLD_COUNTRIES.find(x => x.code === l.country);
                const blocked = l.status === "blocked";
                return (
                  <tr key={l.id} className="border-t border-border/60 hover:bg-surface/60">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <FlaskConical className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{l.name}</div>
                          <div className="text-[11px] text-muted-foreground">{l.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground"><span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" />{c?.name ?? l.country} ({l.country})</span></td>
                    <td className="px-4 py-3.5 text-muted-foreground">{c?.region ?? "—"}</td>
                    <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5"><User className="h-3 w-3 text-muted-foreground" />{l.contact}</span></td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3 w-3" />{l.email}</span>
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3 w-3" />{l.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={l.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(l)} title="Éditer">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title={blocked ? "Débloquer" : "Bloquer"}
                          onClick={() => { setLaboratoireStatus(l.id, blocked ? "active" : "blocked"); toast.success(blocked ? "Laboratoire débloqué" : "Laboratoire bloqué"); }}>
                          {blocked ? <Play className="h-3.5 w-3.5 text-primary" /> : <Ban className="h-3.5 w-3.5 text-warning" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Supprimer"
                          onClick={() => { if (confirm(`Supprimer ${l.name} ?`)) { deleteLaboratoire(l.id); toast.success("Laboratoire supprimé"); } }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">Aucun laboratoire trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && <LabDialog onClose={() => setEditing(null)} lab={editing} />}
      </Dialog>
    </AppShell>
  );
}

function LabDialog({ onClose, lab }: { onClose: () => void; lab: Laboratoire | null }) {
const [f, setF] = useState({
    name: lab?.name ?? "",
    country: lab?.country ?? "",
    contact: lab?.contact ?? "",
    email: lab?.email ?? "",
    phone: lab?.phone ?? "",
    address: lab?.address ?? "",
  });
  const submit = () => {
    if (!f.name || !f.country || !f.email) { toast.error("Champs requis manquants"); return; }
    if (lab) { updateLaboratoire(lab.id, f); toast.success(`Laboratoire ${f.name} mis à jour`); }
    else { addLaboratoire(f); toast.success(`Laboratoire ${f.name} créé`); }
    onClose();
  };
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{lab ? "Modifier le laboratoire" : "Nouveau laboratoire"}</DialogTitle>
        <DialogDescription>Plusieurs laboratoires peuvent être créés dans le même pays.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div><Label>Nom du laboratoire *</Label><Input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="ex. Sanofi Afrique" /></div>
        <div>
          <Label>Pays *</Label>
          <Select value={f.country} onValueChange={v => setF({ ...f, country: v })}>
            <SelectTrigger><SelectValue placeholder="Sélectionner un pays" /></SelectTrigger>
            <SelectContent>{WORLD_COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Contact</Label><Input value={f.contact} onChange={e => setF({ ...f, contact: e.target.value })} /></div>
          <div><Label>Téléphone</Label><Input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} placeholder="+225 …" /></div>
        </div>
        <div><Label>E-mail *</Label><Input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
        <div><Label>Adresse</Label><Textarea rows={2} value={f.address} onChange={e => setF({ ...f, address: e.target.value })} /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={submit}>{lab ? "Enregistrer" : "Créer le laboratoire"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
