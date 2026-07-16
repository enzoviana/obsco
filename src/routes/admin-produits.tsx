import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Loader2, Merge, Trash2, RefreshCw } from "lucide-react";
import { getUser } from "@/lib/auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin-produits")({
  head: () => ({ meta: [{ title: "Administration Produits — OBCO" }] }),
  component: AdminProduitsPage,
});

interface AnalysisResult {
  summary: {
    totalProducts: number;
    duplicateGroups: number;
    totalCategories: number;
    categoryIssues: number;
  };
  duplicates: Array<{
    normalizedName: string;
    count: number;
    products: Array<{
      id: string;
      cip: string;
      name: string;
      category: string;
      laboratory: string;
    }>;
  }>;
  categories: Array<{ name: string; count: number }>;
  categoryIssues: Array<{
    singular: string;
    singularCount: number;
    plural: string;
    pluralCount: number;
    suggestion: string;
  }>;
}

function AdminProduitsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [normalizing, setNormalizing] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [selectedDuplicateGroup, setSelectedDuplicateGroup] = useState<any>(null);
  const [selectedKeepId, setSelectedKeepId] = useState<string>("");

  useEffect(() => {
    const u = getUser();
    if (!u) {
      navigate({ to: "/login" });
      return;
    }
    if (u.role !== "admin") {
      toast.error("Accès refusé : administrateur requis");
      navigate({ to: "/" });
      return;
    }

    loadAnalysis();
  }, [navigate]);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const response = await fetch(`${apiUrl}/api/admin/products/analyze`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      } else {
        toast.error("Erreur lors de l'analyse");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  const normalizeCategories = async () => {
    if (!analysis || analysis.categoryIssues.length === 0) {
      toast.info("Aucune normalisation nécessaire");
      return;
    }

    if (!confirm(`Normaliser ${analysis.categoryIssues.length} catégories ?`)) {
      return;
    }

    setNormalizing(true);
    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      // Créer le mapping des catégories à normaliser
      const mapping: Record<string, string> = {};
      for (const issue of analysis.categoryIssues) {
        const suggestion = issue.suggestion;
        // Remplacer la version non suggérée par la suggestion
        if (suggestion === issue.plural) {
          mapping[issue.singular] = issue.plural;
        } else {
          mapping[issue.plural] = issue.singular;
        }
      }

      const response = await fetch(`${apiUrl}/api/admin/products/normalize-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mapping }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        loadAnalysis(); // Recharger l'analyse
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la normalisation");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la normalisation");
    } finally {
      setNormalizing(false);
    }
  };

  const openMergeDialog = (group: any) => {
    setSelectedDuplicateGroup(group);
    setSelectedKeepId(group.products[0].id);
    setMergeDialogOpen(true);
  };

  const mergeDuplicates = async () => {
    if (!selectedDuplicateGroup || !selectedKeepId) return;

    const deleteIds = selectedDuplicateGroup.products
      .filter((p: any) => p.id !== selectedKeepId)
      .map((p: any) => p.id);

    if (deleteIds.length === 0) {
      toast.error("Sélectionnez au moins un produit à fusionner");
      return;
    }

    try {
      const token = localStorage.getItem("obco_token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

      const response = await fetch(`${apiUrl}/api/admin/products/merge-duplicates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ keepId: selectedKeepId, deleteIds }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setMergeDialogOpen(false);
        loadAnalysis();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la fusion");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la fusion");
    }
  };

  if (loading) {
    return (
      <AppShell title="Administration Produits" subtitle="Analyse en cours...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!analysis) {
    return (
      <AppShell title="Administration Produits" subtitle="Erreur">
        <div className="text-center text-muted-foreground">Impossible de charger l'analyse</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Administration Produits"
      subtitle="Détecter et corriger les doublons et incohérences"
      actions={
        <Button onClick={loadAnalysis} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      }
    >
      {/* Résumé */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <div className="bento-card">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Produits</div>
          <div className="mt-2 text-3xl font-display">{analysis.summary.totalProducts}</div>
        </div>
        <div className="bento-card">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Groupes de Doublons</div>
          <div className="mt-2 text-3xl font-display text-warning">{analysis.summary.duplicateGroups}</div>
        </div>
        <div className="bento-card">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Catégories Totales</div>
          <div className="mt-2 text-3xl font-display">{analysis.summary.totalCategories}</div>
        </div>
        <div className="bento-card">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Incohérences Catégories</div>
          <div className="mt-2 text-3xl font-display text-destructive">{analysis.summary.categoryIssues}</div>
        </div>
      </div>

      {/* Incohérences de catégories */}
      {analysis.categoryIssues.length > 0 && (
        <div className="bento-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Incohérences Catégories (Singulier/Pluriel)</h3>
              <p className="text-sm text-muted-foreground">{analysis.categoryIssues.length} problème(s) détecté(s)</p>
            </div>
            <Button onClick={normalizeCategories} disabled={normalizing}>
              {normalizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Normaliser automatiquement
            </Button>
          </div>

          <div className="space-y-3">
            {analysis.categoryIssues.map((issue, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm font-medium">{issue.singular}</div>
                        <div className="text-xs text-muted-foreground">{issue.singularCount} produit(s)</div>
                      </div>
                      <span className="text-muted-foreground">↔</span>
                      <div>
                        <div className="text-sm font-medium">{issue.plural}</div>
                        <div className="text-xs text-muted-foreground">{issue.pluralCount} produit(s)</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Suggéré: {issue.suggestion}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doublons */}
      {analysis.duplicates.length > 0 && (
        <div className="bento-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Produits en Doublon</h3>
              <p className="text-sm text-muted-foreground">{analysis.duplicates.length} groupe(s) de doublons détecté(s)</p>
            </div>
          </div>

          <div className="space-y-4">
            {analysis.duplicates.map((group, idx) => (
              <div key={idx} className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="font-medium">{group.count} doublons potentiels</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">Clé: {group.normalizedName}</div>
                  </div>
                  <Button size="sm" onClick={() => openMergeDialog(group)}>
                    <Merge className="mr-2 h-3.5 w-3.5" />
                    Fusionner
                  </Button>
                </div>

                <div className="space-y-2">
                  {group.products.map((product) => (
                    <div key={product.id} className="rounded-md bg-background p-3 text-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            CIP: {product.cip} · Catégorie: {product.category} · Labo: {product.laboratory}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.duplicates.length === 0 && analysis.categoryIssues.length === 0 && (
        <div className="bento-card text-center py-12">
          <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-1">Aucun problème détecté</h3>
          <p className="text-sm text-muted-foreground">Tous les produits sont harmonisés</p>
        </div>
      )}

      {/* Dialog de fusion */}
      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Fusionner les produits en doublon</DialogTitle>
            <DialogDescription>
              Sélectionnez le produit à conserver. Les autres seront fusionnés avec celui-ci (prix, objectifs, stocks, ventes).
            </DialogDescription>
          </DialogHeader>

          {selectedDuplicateGroup && (
            <div className="space-y-3">
              {selectedDuplicateGroup.products.map((product: any) => (
                <label
                  key={product.id}
                  className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedKeepId === product.id ? "border-primary bg-primary/5" : "border-border hover:bg-surface"
                  }`}
                >
                  <input
                    type="radio"
                    name="keep-product"
                    value={product.id}
                    checked={selectedKeepId === product.id}
                    onChange={(e) => setSelectedKeepId(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      CIP: {product.cip} · {product.category} · {product.laboratory}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={mergeDuplicates}>
              <Merge className="mr-2 h-4 w-4" />
              Fusionner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
