import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Globe2, Search, Download, Plus, Pencil, Trash2 } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { getUser } from "@/lib/auth";
import {
  COUNTRIES, getAgencies, ensureCountriesLoaded, addCountry, updateCountry, deleteCountry, type Country,
} from "@/lib/agencies";
import { exportCSV } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/pays")({
  head: () => ({ meta: [{ title: "Pays — DATAFUSE" }] }),
  component: PaysPage,
});

function PaysPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [, force] = useState(0);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Country | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getUser()) navigate({ to: "/login" });
    ensureCountriesLoaded();
    force(x => x + 1);
    const sync = () => force(x => x + 1);
    window.addEventListener("datafuse:countries", sync);
    return () => window.removeEventListener("datafuse:countries", sync);
  }, [navigate]);

  const agencies = typeof window !== "undefined" ? getAgencies() : [];

  const rows = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return COUNTRIES
      .map(c => ({ ...c, agences: agencies.filter(a => a.country === c.code).length }))
      .filter(r => !ql || r.name.toLowerCase().includes(ql) || r.code.toLowerCase().includes(ql) || r.region.toLowerCase().includes(ql));
  }, [agencies, q]);

  const handleExport = () => {
    exportCSV("pays", rows.map(r => ({ Pays: r.name, "Code ISO": r.code, Région: r.region, Devise: r.currency, Agences: r.agences })));
    toast.success("CSV téléchargé");
  };

  return (
    <AppShell
      title="Pays"
      subtitle={`${COUNTRIES.length} pays · Région et code ISO modifiables`}
      actions={<>
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Exporter CSV</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Ajouter un pays</Button>
          </DialogTrigger>
          <PaysDialog onClose={() => setOpen(false)} pays={null} />
        </Dialog>
      </>}
    >
      <div className="mb-4 rounded-2xl border border-border bg-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un pays, code ISO, région…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Pays</th>
              <th className="px-4 py-3 text-left font-medium">Code ISO</th>
              <th className="px-4 py-3 text-left font-medium">Région</th>
              <th className="px-4 py-3 text-left font-medium">Devise</th>
              <th className="px-4 py-3 text-right font-medium">Agences</th>
              <th className="px-4 py-3 text-left font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.code} className="border-t border-border/60 hover:bg-surface/40">
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <Globe2 className="h-4 w-4" />
                    </div>
                    {r.name}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{r.code}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.region}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.currency}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.agences}</td>
                <td className="px-4 py-3"><StatusBadge status={r.agences > 0 ? "active" : "inactive"} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Éditer" onClick={() => setEditing(r)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Supprimer"
                      onClick={() => {
                        if (r.agences > 0) { toast.error("Supprimez d'abord les agences de ce pays"); return; }
                        if (confirm(`Supprimer ${r.name} ?`)) { deleteCountry(r.code); toast.success("Pays supprimé"); }
                      }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && <PaysDialog onClose={() => setEditing(null)} pays={editing} />}
      </Dialog>
    </AppShell>
  );
}

function PaysDialog({ onClose, pays }: { onClose: () => void; pays: Country | null }) {
  const [f, setF] = useState<Country>({
    code: pays?.code ?? "",
    name: pays?.name ?? "",
    region: pays?.region ?? "Afrique",
    currency: pays?.currency ?? "XOF",
  });
  const submit = () => {
    if (!f.code || !f.name || !f.region) { toast.error("Champs requis manquants"); return; }
    try {
      if (pays) { updateCountry(pays.code, f); toast.success(`Pays ${f.name} mis à jour`); }
      else { addCountry({ ...f, code: f.code.toUpperCase() }); toast.success(`Pays ${f.name} ajouté`); }
      onClose();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
  };
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{pays ? "Modifier le pays" : "Nouveau pays"}</DialogTitle>
        <DialogDescription>Pays / Code ISO / Région (ex. Sénégal · SN · Afrique).</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div><Label>Nom du pays *</Label><Input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Sénégal" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Code ISO *</Label><Input value={f.code} onChange={e => setF({ ...f, code: e.target.value.toUpperCase() })} maxLength={3} disabled={!!pays} placeholder="SN" /></div>
          <div><Label>Devise</Label><Input value={f.currency} onChange={e => setF({ ...f, currency: e.target.value.toUpperCase() })} placeholder="XOF" /></div>
        </div>
        <div><Label>Région *</Label><Input value={f.region} onChange={e => setF({ ...f, region: e.target.value })} placeholder="Afrique" /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={submit}>{pays ? "Enregistrer" : "Ajouter le pays"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
