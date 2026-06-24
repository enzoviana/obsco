import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { exportCSV, exportXLSX, parseUploadedFile } from "@/lib/export";
import { SUPPLIERS } from "@/lib/agencies";
import { toast } from "sonner";

export const Route = createFileRoute("/import")({
  head: () => ({ meta: [{ title: "Import / Export — DATAFUSE" }] }),
  component: ImportPage,
});

const TEMPLATE_ROWS = [
  {
    CIP: "3400900000000", Produit: "Paracétamol 500mg bte/20", Laboratoire: "Sanofi",
    "PGHT pays": 2.5, "Ventes": 0, "Budget Mois": 0, "Ventes An-1": 0,
    ...Object.fromEntries(SUPPLIERS.flatMap(s => [
      [`${s} - Prix Unit.`, ""], [`${s} - Ventes`, ""], [`${s} - Stocks`, ""], [`${s} - Commandes`, ""],
    ])),
  },
];

function ImportPage() {
  const navigate = useNavigate();
  const [parsed, setParsed] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = getUser();
    if (!u) navigate({ to: "/login" });
  }, [navigate]);

  const downloadCSV = () => { exportCSV("modele-import-anf", TEMPLATE_ROWS); toast.success("Modèle CSV téléchargé"); };
  const downloadXLSX = () => { exportXLSX("modele-import-anf", { Modèle: TEMPLATE_ROWS }); toast.success("Modèle XLSX téléchargé"); };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null); setParsed(null);
    try {
      const rows = await parseUploadedFile(file);
      if (!rows.length) { setError("Le fichier est vide."); return; }
      setParsed(rows);
      toast.success(`${rows.length} lignes importées avec succès`);
    } catch (err) {
      setError("Impossible de lire le fichier. Vérifiez le format (CSV / XLSX).");
      toast.error("Échec de l'import");
    }
  };

  return (
    <AppShell title="Import / Export" subtitle="Téléverser vos données mensuelles">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Download className="h-5 w-5" /></div>
            <div>
              <h3 className="font-display text-xl">1. Téléchargez le modèle</h3>
              <p className="text-xs text-muted-foreground">Remplissez les colonnes puis téléversez le fichier</p>
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />Une ligne par produit (CIP unique)</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />Données par fournisseur : Prix, Ventes, Stocks, Commandes</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />Format accepté : CSV (séparateur « ; ») ou XLSX</li>
          </ul>
          <div className="mt-6 flex gap-2">
            <Button onClick={downloadCSV} variant="outline" className="flex-1"><Download className="mr-2 h-4 w-4" />CSV</Button>
            <Button onClick={downloadXLSX} className="flex-1"><FileSpreadsheet className="mr-2 h-4 w-4" />XLSX</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Upload className="h-5 w-5" /></div>
            <div>
              <h3 className="font-display text-xl">2. Téléversez le fichier</h3>
              <p className="text-xs text-muted-foreground">Glissez-déposez ou cliquez pour parcourir</p>
            </div>
          </div>

          <label className="mt-5 block cursor-pointer rounded-xl border-2 border-dashed border-border bg-surface/40 px-6 py-10 text-center hover:border-primary/50 hover:bg-surface transition">
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} className="hidden" />
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <div className="mt-3 text-sm font-medium">Cliquez pour sélectionner un fichier</div>
            <div className="text-xs text-muted-foreground mt-1">CSV · XLSX · max 10 Mo</div>
          </label>

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm flex gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <span className="text-destructive">{error}</span>
            </div>
          )}
        </div>
      </div>

      {parsed && parsed.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl">Aperçu de l'import · {parsed.length} lignes</h3>
              <p className="text-xs text-muted-foreground">Vérifiez les données avant validation</p>
            </div>
            <Button size="sm" onClick={() => { toast.success("Import validé. Les données seront synchronisées."); setParsed(null); }}>
              Valider et synchroniser
            </Button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead className="bg-surface">
                <tr>{Object.keys(parsed[0]).map(k => <th key={k} className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px] whitespace-nowrap">{k}</th>)}</tr>
              </thead>
              <tbody>
                {parsed.slice(0, 10).map((r, i) => (
                  <tr key={i} className="border-t border-border/60">
                    {Object.values(r).map((v, j) => <td key={j} className="px-3 py-2 whitespace-nowrap">{String(v ?? "")}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsed.length > 10 && <div className="mt-3 text-xs text-muted-foreground text-center">…{parsed.length - 10} lignes supplémentaires</div>}
        </div>
      )}
    </AppShell>
  );
}
