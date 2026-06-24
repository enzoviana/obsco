import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, FileSpreadsheet, Search, Pencil, Trash2, Plus, Save, Target, Tag, Boxes } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUser } from "@/lib/auth";
import {
  getPanoramicProducts, SUPPLIERS, COUNTRIES, PRODUCT_TYPES,
  getProductPricing, setProductPricing, getProductObjectives, setProductObjectives,
  addCustomProduct, updateProduct, deleteProduct, getProductLaboratories,
  type ProductPanoramic, type EntityStatus,
} from "@/lib/agencies";
import { exportCSV, exportXLSX } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/produits")({
  head: () => ({ meta: [{ title: "Produits — DATAFUSE" }] }),
  component: ProduitsPage,
});

function ProduitsPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [lab, setLab] = useState("all");
  const [type, setType] = useState("all");
  const [all, setAll] = useState<ProductPanoramic[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ProductPanoramic | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getUser()) { navigate({ to: "/login" }); return; }
    const reload = () => setAll(getPanoramicProducts());
    reload();
    window.addEventListener("datafuse:products", reload);
    return () => window.removeEventListener("datafuse:products", reload);
  }, [navigate]);

  const labs = useMemo(() => Array.from(new Set(all.map(p => p.laboratory))).sort(), [all]);
  const list = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return all.filter(p =>
      (lab === "all" || p.laboratory === lab) &&
      (type === "all" || p.type === type) &&
      (!ql || p.name.toLowerCase().includes(ql) || p.cip.includes(ql) || p.laboratory.toLowerCase().includes(ql))
    );
  }, [all, q, lab, type]);

  // Full export — panoramic + per-supplier stocks
  const exportFull = () => {
    const panoramique = list.map(p => ({
      ID: p.id, CIP: p.cip, Produit: p.name, Laboratoire: p.laboratory, Type: p.type, Statut: p.productStatus,
      "PGHT pays": p.pghtPays, "Ventes": p.ventes, "Budget Mois": p.budgetMois,
      "Taux Réal (%)": p.tauxReal, "Ventes An-1": p.ventesAn1, "Taux Évol (%)": p.tauxEvol,
      "CA": p.ca, "Budget Mois CA": p.budgetMoisCa, "Tx Real Budget CA (%)": p.txRealBudgetCa,
      "Cumul Budget": p.cumulBudget, "Cumul Réalisé": p.cumulRealise,
      "Tx Réal prév (%)": p.txRealPrev, "Poids (%)": p.poids,
    }));
    const fournisseurs: Record<string, unknown>[] = [];
    for (const p of list) {
      const row: Record<string, unknown> = { ID: p.id, Produit: p.name, Laboratoire: p.laboratory };
      for (const s of SUPPLIERS) {
        const f = p.fournisseurs[s];
        row[`${s} - Prix Unit.`] = f.prixUnitaire;
        row[`${s} - Ventes`] = f.ventes;
        row[`${s} - Stocks`] = f.stocks;
        row[`${s} - Commandes`] = f.commandes;
      }
      fournisseurs.push(row);
    }
    exportXLSX("produits-complet", { Panoramique: panoramique, "Stocks fournisseurs": fournisseurs });
    toast.success("Export complet téléchargé (panoramique + stocks fournisseurs)");
  };

  const exportSimpleCSV = () => {
    exportCSV("produits", list.map(p => ({
      ID: p.id, Désignation: p.name, Laboratoire: p.laboratory, Type: p.type,
      "Prix référence (€)": p.pghtPays, "Objectif mois": p.budgetMois, Statut: p.productStatus,
    })));
    toast.success("CSV simple téléchargé");
  };

  return (
    <AppShell
      title="Produits"
      subtitle={`${list.length} références · vue simplifiée`}
      actions={<>
        <Button variant="outline" size="sm" onClick={exportSimpleCSV}><Download className="mr-2 h-4 w-4" />CSV simple</Button>
        <Button variant="outline" size="sm" onClick={exportFull}><FileSpreadsheet className="mr-2 h-4 w-4" />Export complet (XLSX)</Button>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Créer un produit</Button>
          </DialogTrigger>
          <ProductDialog onClose={() => setCreateOpen(false)} product={null} />
        </Dialog>
      </>}
    >
      <div className="rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher (désignation, CIP, laboratoire)…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={lab} onValueChange={setLab}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Laboratoire" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous laboratoires</SelectItem>
            {labs.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            {PRODUCT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-surface">
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Désignation</th>
                <th className="px-4 py-3 text-left font-medium">Laboratoire</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 100).map(p => (
                <tr key={p.id} className="border-t border-border/60 hover:bg-surface/60">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Boxes className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{p.cip}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{p.laboratory}</td>
                  <td className="px-4 py-3.5"><span className="inline-flex rounded-md bg-secondary px-2 py-1 text-xs">{p.type}</span></td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.productStatus} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setEditing(p)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />Éditer
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                        onClick={() => { if (confirm(`Supprimer ${p.name} ?`)) { deleteProduct(p.id); toast.success("Produit supprimé"); } }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">Aucun produit trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {list.length > 100 && (
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Affichage des 100 premiers résultats sur {list.length}. Affinez la recherche pour cibler un produit.
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && <ProductDialog onClose={() => setEditing(null)} product={editing} />}
      </Dialog>
    </AppShell>
  );
}

function ProductDialog({ onClose, product }: { onClose: () => void; product: ProductPanoramic | null }) {
  const labs = getProductLaboratories();
  const [name, setName] = useState(product?.name ?? "");
  const [laboratory, setLab] = useState(product?.laboratory ?? labs[0] ?? "");
  const [type, setType] = useState(product?.type ?? PRODUCT_TYPES[0]);
  const [status, setStatus] = useState<EntityStatus>(product?.productStatus ?? "active");
  const [price, setPrice] = useState<number>(product?.pghtPays ?? 0);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [objs, setObjs] = useState<Record<string, number>>({});

  useEffect(() => {
    if (product) {
      setPrices(getProductPricing(product.id, product.pghtPays));
      setObjs(getProductObjectives(product.id, product.budgetMois));
    } else {
      const p: Record<string, number> = {};
      const o: Record<string, number> = {};
      for (const c of COUNTRIES) { p[c.code] = 0; o[c.code] = 0; }
      setPrices(p); setObjs(o);
    }
  }, [product]);

  const submit = () => {
    if (!name || !laboratory) { toast.error("Désignation et laboratoire requis"); return; }
    if (product) {
      updateProduct(product.id, { name, laboratory, type, productStatus: status, pghtPays: price });
      setProductPricing(product.id, prices);
      setProductObjectives(product.id, objs);
      toast.success("Produit mis à jour");
    } else {
      addCustomProduct({ name, laboratory, type, productStatus: status, pghtPays: price, pricing: prices, objectives: objs });
      toast.success("Produit créé");
    }
    onClose();
  };

  const totalObj = Object.values(objs).reduce((a, b) => a + b, 0);

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{product ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
        <DialogDescription>Désignation, laboratoire, type, statut, prix et objectifs par pays.</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="info">
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">Informations</TabsTrigger>
          <TabsTrigger value="prix" className="flex-1"><Tag className="h-3.5 w-3.5 mr-2" />Prix par pays</TabsTrigger>
          <TabsTrigger value="obj" className="flex-1"><Target className="h-3.5 w-3.5 mr-2" />Objectifs (qté)</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4 space-y-3">
          <div><Label>Désignation *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="ex. Paracétamol 500 bte/20" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Laboratoire *</Label>
              <Select value={laboratory} onValueChange={setLab}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{labs.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PRODUCT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Prix de référence (€)</Label>
              <Input type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={status} onValueChange={(v: EntityStatus) => setStatus(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="warning">Attention</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="blocked">Bloqué</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prix" className="mt-4">
          <div className="max-h-[360px] overflow-y-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface sticky top-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-3 py-2 text-left font-medium">Pays</th><th className="px-3 py-2 text-left font-medium">Code</th><th className="px-3 py-2 text-right font-medium">Prix unitaire (€)</th></tr>
              </thead>
              <tbody>
                {COUNTRIES.map(c => (
                  <tr key={c.code} className="border-t border-border/60">
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{c.code}</td>
                    <td className="px-3 py-2">
                      <Input type="number" step="0.01" className="w-28 text-right h-8 ml-auto block"
                        value={prices[c.code] ?? 0}
                        onChange={e => setPrices({ ...prices, [c.code]: parseFloat(e.target.value) || 0 })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="obj" className="mt-4">
          <div className="max-h-[360px] overflow-y-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface sticky top-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-3 py-2 text-left font-medium">Pays</th><th className="px-3 py-2 text-left font-medium">Code</th><th className="px-3 py-2 text-right font-medium">Objectif (unités)</th></tr>
              </thead>
              <tbody>
                {COUNTRIES.map(c => (
                  <tr key={c.code} className="border-t border-border/60">
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{c.code}</td>
                    <td className="px-3 py-2">
                      <Input type="number" step="1" className="w-28 text-right h-8 ml-auto block"
                        value={objs[c.code] ?? 0}
                        onChange={e => setObjs({ ...objs, [c.code]: parseInt(e.target.value) || 0 })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-right">Total: <b className="text-foreground">{totalObj.toLocaleString("fr-FR")}</b> unités</div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={submit}><Save className="h-3.5 w-3.5 mr-1.5" />{product ? "Enregistrer" : "Créer le produit"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
