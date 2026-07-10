import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { exportCSV, exportXLSX, parseUploadedFile } from "@/lib/export";
import { getAgencies, getGrossistes, getPanoramicProducts } from "@/lib/agencies";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/import")({
  head: () => ({ meta: [{ title: "Import / Export — OBCO" }] }),
  component: ImportPage,
});

function ImportPage() {
  const navigate = useNavigate();
  const [parsed, setParsed] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [agencyInfo, setAgencyInfo] = useState<{ id: string; country: string } | null>(null);
  const [importing, setImporting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Sélection de l'année et du mois pour l'import
  // Règle : 1 mois de décalage (si on est en juillet, on peut importer jusqu'à juin)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12

  // Calculer le mois maximum autorisé (mois actuel - 1)
  const maxMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const maxYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const [selectedYear, setSelectedYear] = useState(maxYear);
  const [selectedMonth, setSelectedMonth] = useState(maxMonth);

  // Générer les options d'années (5 ans en arrière et 1 an en avant)
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);
  const monthOptions = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = getUser();
    if (!u) {
      navigate({ to: "/login" });
      return;
    }
    setUser(u);

    // Récupérer l'agence de l'utilisateur connecté
    const loadAgencyInfo = () => {
      if (u.role === "pharmacy") {
        const agencies = getAgencies();
        const userAgency = agencies.find(a => a.email === u.email);
        if (userAgency) {
          setAgencyInfo({ id: userAgency.id, country: userAgency.country });
        }
      }
    };

    loadAgencyInfo();

    // Écouter les changements des agences et grossistes
    const syncAgencies = () => loadAgencyInfo();
    window.addEventListener("obco:agencies", syncAgencies);
    window.addEventListener("obco:gros", syncAgencies);

    return () => {
      window.removeEventListener("obco:agencies", syncAgencies);
      window.removeEventListener("obco:gros", syncAgencies);
    };
  }, [navigate]); // Retirer 'user' des dépendances pour éviter la boucle infinie

  // Filtrer les fournisseurs attribués à cette agence
  const agencySuppliers = useMemo(() => {
    const grossistes = getGrossistes();
    const suppliers = new Set<string>();
    const currentUser = user || getUser(); // Utiliser user s'il existe, sinon getUser()

    // Si admin, montrer tous les fournisseurs
    if (currentUser?.role === "admin") {
      for (const g of grossistes) {
        if (g.status === "blocked" || g.status === "inactive") continue;
        suppliers.add(g.partenaire);
      }
      return Array.from(suppliers).sort();
    }

    // Si agence sans info, retourner vide
    if (!agencyInfo) return [];

    // Filtrer les fournisseurs pour l'agence
    for (const g of grossistes) {
      // Ignorer les grossistes inactifs ou bloqués
      if (g.status === "blocked" || g.status === "inactive") continue;

      // Scope "country" : fournisseur disponible pour tout le pays
      if (g.scope === "country" && g.country === agencyInfo.country) {
        suppliers.add(g.partenaire);
      }

      // Scope "agency" : fournisseur dédié à cette agence spécifique
      if (g.scope === "agency" && g.agencyId === agencyInfo.id) {
        suppliers.add(g.partenaire);
      }
    }

    return Array.from(suppliers).sort();
  }, [agencyInfo]); // Ne dépend que de agencyInfo, pas de user

  // Générer le modèle avec la structure exacte de Sorties Locales
  const templateData = useMemo(() => {
    if (agencySuppliers.length === 0) {
      return {
        headers: [],
        rows: [],
      };
    }

    // Prendre quelques produits réels comme exemples
    const products = getPanoramicProducts().slice(0, 10);

    // Créer les noms de colonnes significatifs
    const columnNames: string[] = ["Produit"];

    for (const supplier of agencySuppliers) {
      columnNames.push(`${supplier}_Ventes`);
      columnNames.push(`${supplier}_Stocks`);
      columnNames.push(`${supplier}_Cmd`);
    }

    columnNames.push("Total_Ventes");
    columnNames.push("Total_Stocks");
    columnNames.push("Total_Cmd");

    // Ligne 1 : Noms des fournisseurs (avec colonnes vides pour fusion en Excel)
    const headerRow1: Record<string, string | number> = { Produit: "Produit" };

    for (const supplier of agencySuppliers) {
      headerRow1[`${supplier}_Ventes`] = supplier;
      headerRow1[`${supplier}_Stocks`] = "";
      headerRow1[`${supplier}_Cmd`] = "";
    }

    headerRow1["Total_Ventes"] = "Total";
    headerRow1["Total_Stocks"] = "";
    headerRow1["Total_Cmd"] = "";

    // Ligne 2 : Sous-colonnes (Ventes, Stocks, Cmd)
    const headerRow2: Record<string, string | number> = { Produit: "" };

    for (const supplier of agencySuppliers) {
      headerRow2[`${supplier}_Ventes`] = "Ventes";
      headerRow2[`${supplier}_Stocks`] = "Stocks";
      headerRow2[`${supplier}_Cmd`] = "Cmd";
    }

    headerRow2["Total_Ventes"] = "Ventes";
    headerRow2["Total_Stocks"] = "Stocks";
    headerRow2["Total_Cmd"] = "Cmd";

    // Créer les lignes de données
    const dataRows = products.map(p => {
      const row: Record<string, string | number> = {
        Produit: `${p.name} (${p.cip})`
      };

      let totalVentes = 0;
      let totalStocks = 0;
      let totalCmd = 0;

      // Pour chaque fournisseur : 3 colonnes (Ventes, Stocks, Cmd)
      for (const supplier of agencySuppliers) {
        const ventes = 0;
        const stocks = 0;
        const cmd = 0;

        row[`${supplier}_Ventes`] = ventes;
        row[`${supplier}_Stocks`] = stocks;
        row[`${supplier}_Cmd`] = cmd;

        totalVentes += ventes;
        totalStocks += stocks;
        totalCmd += cmd;
      }

      // Totaux de ligne
      row["Total_Ventes"] = totalVentes;
      row["Total_Stocks"] = totalStocks;
      row["Total_Cmd"] = totalCmd;

      return row;
    });

    // Ligne de total (pied de tableau)
    const totalRow: Record<string, string | number> = { Produit: "TOTAL" };

    // Total par fournisseur (colonnes)
    for (const supplier of agencySuppliers) {
      totalRow[`${supplier}_Ventes`] = 0;
      totalRow[`${supplier}_Stocks`] = 0;
      totalRow[`${supplier}_Cmd`] = 0;
    }

    // Total global
    totalRow["Total_Ventes"] = 0;
    totalRow["Total_Stocks"] = 0;
    totalRow["Total_Cmd"] = 0;

    return {
      headers: [headerRow1, headerRow2],
      rows: [...dataRows, totalRow],
    };
  }, [agencySuppliers]);

  const downloadCSV = () => {
    if (agencySuppliers.length === 0) {
      toast.error("Aucun fournisseur attribué à votre agence");
      return;
    }

    // Combiner les en-têtes et les données
    const allRows = [...templateData.headers, ...templateData.rows];
    exportCSV("modele-import-agence", allRows);
    toast.success("Modèle CSV téléchargé avec structure Sorties Locales");
  };

  const downloadXLSX = () => {
    if (agencySuppliers.length === 0) {
      toast.error("Aucun fournisseur attribué à votre agence");
      return;
    }

    // Combiner les en-têtes et les données
    const allRows = [...templateData.headers, ...templateData.rows];
    exportXLSX("modele-import-agence", { "Import Données": allRows });
    toast.success("Modèle XLSX téléchargé avec structure Sorties Locales");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null); setParsed(null);
    try {
      // Parser avec SheetJS directement pour avoir plus de contrôle
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convertir en tableau de tableaux pour gérer les en-têtes sur 2 lignes
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      if (rawData.length < 3) {
        setError("Le fichier ne contient pas assez de lignes.");
        return;
      }

      // Ligne 1 : Noms des fournisseurs (Produit, CAMED, "", "", COPHARMED, "", "", Total, "", "")
      const headerRow1 = rawData[0];
      // Ligne 2 : Sous-colonnes ("", Ventes, Stocks, Cmd, Ventes, Stocks, Cmd, Ventes, Stocks, Cmd)
      const headerRow2 = rawData[1];

      // Construire les noms de colonnes finaux
      const columnNames: string[] = [];
      let currentSupplier = "";

      for (let i = 0; i < headerRow1.length; i++) {
        const header1 = String(headerRow1[i] || "").trim();
        const header2 = String(headerRow2[i] || "").trim();

        if (i === 0) {
          // Colonne Produit
          columnNames.push("Produit");
        } else if (header1 && header1 !== "") {
          // Nouveau fournisseur détecté
          currentSupplier = header1;
          columnNames.push(`${currentSupplier}_${header2}`);
        } else if (currentSupplier && header2) {
          // Sous-colonne du fournisseur actuel
          columnNames.push(`${currentSupplier}_${header2}`);
        } else {
          columnNames.push(`col_${i}`);
        }
      }

      console.log("Noms de colonnes détectés:", columnNames);

      // Convertir les lignes de données (à partir de la ligne 3)
      const dataRows: Record<string, any>[] = [];

      for (let i = 2; i < rawData.length; i++) {
        const row = rawData[i];
        const produit = String(row[0] || "").trim();

        // Ignorer les lignes vides et la ligne TOTAL
        if (!produit || produit === "TOTAL") continue;

        const rowData: Record<string, any> = {};

        for (let j = 0; j < columnNames.length && j < row.length; j++) {
          rowData[columnNames[j]] = row[j];
        }

        dataRows.push(rowData);
      }

      console.log("Données parsées:", dataRows.slice(0, 2));

      if (!dataRows.length) {
        setError("Aucune donnée à importer. Vérifiez le contenu du fichier.");
        return;
      }

      setParsed(dataRows);
      setShowPreviewModal(true);
      toast.success(`${dataRows.length} produits détectés`);
    } catch (err) {
      console.error("Erreur parsing:", err);
      setError("Impossible de lire le fichier. Vérifiez le format (CSV / XLSX).");
      toast.error("Échec de l'import");
    }
  };

  const validateAndImport = async () => {
    if (!parsed || !agencyInfo) return;

    setImporting(true);
    setError(null);

    try {
      // Transformer les données parsées pour l'API
      const importData = {
        year: selectedYear,
        month: selectedMonth,
        data: [] as Array<{
          productCip: string;
          productName: string;
          suppliers: Array<{
            wholesalerId: string;
            wholesalerName: string;
            sales: number;
            stock: number;
            orders: number;
          }>;
        }>,
      };

      const grossistes = getGrossistes();
      const grossisteIdMap = new Map<string, string>();
      for (const g of grossistes) {
        grossisteIdMap.set(g.partenaire, g.id);
      }

      for (const row of parsed) {
        const produitStr = String(row.Produit || "").trim();
        if (!produitStr) continue;

        // Extraire le CIP depuis "Nom produit (CIP)"
        const cipMatch = produitStr.match(/\(([^)]+)\)$/);
        if (!cipMatch) {
          console.warn("CIP non trouvé pour:", produitStr);
          continue;
        }

        const cip = cipMatch[1];
        const name = produitStr.replace(/\s*\([^)]+\)$/, "").trim();

        const suppliers = [];

        // Parcourir les fournisseurs de l'agence
        for (const supplierName of agencySuppliers) {
          const ventesKey = `${supplierName}_Ventes`;
          const stocksKey = `${supplierName}_Stocks`;
          const cmdKey = `${supplierName}_Cmd`;

          const ventes = parseInt(String(row[ventesKey] || 0));
          const stocks = parseInt(String(row[stocksKey] || 0));
          const cmd = parseInt(String(row[cmdKey] || 0));

          // Ne pas inclure si toutes les valeurs sont 0
          if (ventes === 0 && stocks === 0 && cmd === 0) continue;

          const wholesalerId = grossisteIdMap.get(supplierName);
          if (!wholesalerId) {
            console.warn("Grossiste non trouvé:", supplierName);
            continue;
          }

          suppliers.push({
            wholesalerId,
            wholesalerName: supplierName,
            sales: isNaN(ventes) ? 0 : ventes,
            stock: isNaN(stocks) ? 0 : stocks,
            orders: isNaN(cmd) ? 0 : cmd,
          });
        }

        if (suppliers.length > 0) {
          importData.data.push({
            productCip: cip,
            productName: name,
            suppliers,
          });
        }
      }

      if (importData.data.length === 0) {
        setError("Aucune donnée valide à importer");
        setImporting(false);
        return;
      }

      // Envoyer à l'API
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com"}/api/import/monthly`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("obco_token")}`,
        },
        body: JSON.stringify(importData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de l'import");
      }

      const result = await response.json();
      toast.success(`${result.count} enregistrements importés avec succès`);
      setParsed(null);
      setShowPreviewModal(false);
    } catch (err: any) {
      console.error("Erreur import:", err);
      setError(err.message || "Erreur lors de l'import");
      toast.error(err.message || "Échec de l'import");
    } finally {
      setImporting(false);
    }
  };

  return (
    <AppShell title="Import / Export" subtitle="Téléverser vos données mensuelles">
      {/* Sélection de la période */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <h3 className="font-semibold text-sm mb-3">📅 Période d'import</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1">Mois</label>
            <select
              value={selectedMonth}
              onChange={(e) => {
                const newMonth = Number(e.target.value);
                const newDate = new Date(selectedYear, newMonth - 1);
                const maxDate = new Date(maxYear, maxMonth - 1);

                // Vérifier que la date sélectionnée n'est pas dans le futur
                if (newDate <= maxDate) {
                  setSelectedMonth(newMonth);
                }
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {monthOptions.map((m) => {
                const isDisabled = selectedYear === currentYear && m.value >= currentMonth;
                return (
                  <option key={m.value} value={m.value} disabled={isDisabled}>
                    {m.label} {isDisabled ? "(non disponible)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1">Année</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                const newYear = Number(e.target.value);
                setSelectedYear(newYear);

                // Ajuster le mois si nécessaire
                if (newYear === currentYear && selectedMonth >= currentMonth) {
                  setSelectedMonth(maxMonth);
                }
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="text-xs text-primary">
            ⏱️ <strong>Délai d'import :</strong> Vous pouvez importer des données jusqu'au mois de <strong>{monthOptions.find(m => m.value === maxMonth)?.label} {maxYear}</strong>.
            Les données du mois en cours ne peuvent être importées qu'à partir du 1er du mois suivant.
          </p>
        </div>
      </div>

      {/* Afficher les fournisseurs disponibles */}
      {agencySuppliers.length > 0 && (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                {user?.role === "admin"
                  ? `📦 Tous les fournisseurs (${agencySuppliers.length})`
                  : `📦 Fournisseurs attribués à votre agence (${agencySuppliers.length})`}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {agencySuppliers.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {user?.role === "admin"
                  ? "Le fichier modèle contiendra tous les fournisseurs actifs."
                  : "Le fichier modèle contiendra uniquement vos fournisseurs (scope pays + agence). Format identique à 'Sorties Locales'."}
              </p>
            </div>
          </div>
        </div>
      )}

      {user?.role !== "admin" && agencySuppliers.length === 0 && (
        <div className="mb-6 rounded-2xl border-2 border-warning/20 bg-warning/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-warning mb-1">
                ⚠️ Aucun fournisseur attribué
              </h3>
              <p className="text-xs text-muted-foreground">
                Votre agence n'a pas encore de fournisseurs (grossistes) attribués. Contactez l'administrateur pour
                configurer vos fournisseurs avant de pouvoir importer des données.
              </p>
            </div>
          </div>
        </div>
      )}

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
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong>Structure identique à "Sorties Locales"</strong>
                <div className="text-xs mt-0.5">Colonne Produit + 3 colonnes par fournisseur + Total</div>
              </div>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong>En-têtes sur 2 lignes</strong>
                <div className="text-xs mt-0.5">Ligne 1 : Nom fournisseur | Ligne 2 : Ventes, Stocks, Cmd</div>
              </div>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong>Totaux automatiques</strong>
                <div className="text-xs mt-0.5">Colonne Total (somme par ligne) + Ligne Total (somme par colonne)</div>
              </div>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              Format accepté : CSV (« ; ») ou XLSX
            </li>
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

      {/* Modal d'aperçu de l'import */}
      <Dialog open={showPreviewModal} onOpenChange={(open) => {
        setShowPreviewModal(open);
        if (!open) setParsed(null);
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu de l'import · {parsed?.length || 0} produits</DialogTitle>
            <DialogDescription>
              Période : {monthOptions.find(m => m.value === selectedMonth)?.label} {selectedYear}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead className="bg-surface">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Produit</th>
                  {agencySuppliers.map(s => (
                    <th key={s} colSpan={3} className="px-3 py-2 text-center font-medium text-muted-foreground uppercase tracking-wider text-[10px] border-l border-border">
                      {s}
                    </th>
                  ))}
                </tr>
                <tr className="bg-surface/50">
                  <th className="px-3 py-1 text-left font-medium text-muted-foreground text-[9px]"></th>
                  {agencySuppliers.map(s => (
                    <>
                      <th key={`${s}-v`} className="px-2 py-1 text-center font-medium text-muted-foreground text-[9px]">V</th>
                      <th key={`${s}-s`} className="px-2 py-1 text-center font-medium text-muted-foreground text-[9px]">S</th>
                      <th key={`${s}-c`} className="px-2 py-1 text-center font-medium text-muted-foreground text-[9px] border-r border-border">C</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed?.slice(0, 15).map((r, i) => (
                  <tr key={i} className="border-t border-border/60 hover:bg-surface/30">
                    <td className="px-3 py-2 text-[10px] max-w-[200px] truncate">{String(r.Produit ?? "")}</td>
                    {agencySuppliers.map(s => (
                      <>
                        <td key={`${s}-v`} className="px-2 py-2 text-center text-[10px]">{r[`${s}_Ventes`] || 0}</td>
                        <td key={`${s}-s`} className="px-2 py-2 text-center text-[10px]">{r[`${s}_Stocks`] || 0}</td>
                        <td key={`${s}-c`} className="px-2 py-2 text-center text-[10px] border-r border-border">{r[`${s}_Cmd`] || 0}</td>
                      </>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(parsed?.length || 0) > 15 && (
            <div className="text-xs text-muted-foreground text-center">
              …{(parsed?.length || 0) - 15} produits supplémentaires
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setParsed(null);
                setShowPreviewModal(false);
              }}
              disabled={importing}
            >
              Annuler
            </Button>
            <Button
              onClick={validateAndImport}
              disabled={importing}
            >
              {importing ? "Import en cours..." : "Valider et importer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
