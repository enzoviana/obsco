# Template pour connecter les pages au backend

## Structure standard d'une page dynamique

```tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import { apiClient, type YourType } from "@/lib/api";

export const Route = createFileRoute("/your-route")({
  head: () => ({ meta: [{ title: "Your Title — DATAFUSE" }] }),
  component: YourPage,
});

function YourPage() {
  const navigate = useNavigate();
  const [list, setList] = useState<YourType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<YourType | null>(null);
  const [formData, setFormData] = useState({ /* vos champs */ });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !getUser()) {
      navigate({ to: "/login" });
      return;
    }
    loadData();
  }, [navigate]);

  async function loadData() {
    try {
      const data = await apiClient.getAllYourItems();
      setList(data);
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await apiClient.updateYourItem(editing.id, formData);
        toast.success("Modifié");
      } else {
        await apiClient.createYourItem(formData);
        toast.success("Créé");
      }
      setOpen(false);
      loadData();
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ?")) return;
    try {
      await apiClient.deleteYourItem(id);
      toast.success("Supprimé");
      loadData();
    } catch (error) {
      toast.error("Erreur");
    }
  }

  const filtered = list.filter(item =>
    !search || item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AppShell title="Titre" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Votre titre"
      subtitle={`${list.length} éléments`}
      actions={
        <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau
        </Button>
      }
    >
      {/* Recherche */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tableau ou grille */}
      <div className="rounded-2xl border border-border bg-card">
        {/* Votre contenu */}
      </div>

      {/* Dialog de création/modification */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier" : "Nouveau"}</DialogTitle>
          </DialogHeader>
          {/* Vos champs de formulaire */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
```

## Pages à créer/modifier

### Module Gestion
- ✅ /laboratoires-backend (créé)
- [ ] /pays
- [ ] /agences
- [ ] /grossistes
- [ ] /fournisseurs
- [ ] /produits (adapter l'existant)
- [ ] /produits-objectifs
- [ ] /produits-tarifs

### Autres
- ✅ /stocks (déjà connecté)
- ✅ Dashboard (déjà connecté)
- [ ] /rapports
- [ ] /stats
- [ ] /parametres
- [ ] Module Sorties Locales (toutes les pages)

## Modification des routes existantes

Remplacer les imports de `@/lib/agencies` par `@/lib/api`:
```tsx
// Avant
import { getData, type DataType } from "@/lib/agencies";

// Après
import { apiClient, type DataType } from "@/lib/api";
```

Remplacer les appels localStorage/mock par des appels API:
```tsx
// Avant
const data = getData();

// Après
const data = await apiClient.getAllData();
```
