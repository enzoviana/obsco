import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Package, Building2, Globe2, FlaskConical, Store } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchResult {
  id: string;
  type: "product" | "agency" | "country" | "laboratory" | "wholesaler";
  title: string;
  subtitle?: string;
  path: string;
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Raccourci clavier ⌘K ou Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("obco_token");
        if (!token) return;

        const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";

        // Recherche parallèle dans toutes les entités
        const [productsRes, agenciesRes, countriesRes, labsRes, wholesalersRes] = await Promise.allSettled([
          fetch(`${apiUrl}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/agencies`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/countries`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/laboratories`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/wholesalers`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const searchResults: SearchResult[] = [];
        const lowerQuery = query.toLowerCase();

        // Produits
        if (productsRes.status === "fulfilled" && productsRes.value.ok) {
          const products = await productsRes.value.json();
          const filtered = products
            .filter((p: any) =>
              p.name?.toLowerCase().includes(lowerQuery) ||
              p.cip?.toLowerCase().includes(lowerQuery)
            )
            .slice(0, 5)
            .map((p: any) => ({
              id: p.id,
              type: "product" as const,
              title: p.name,
              subtitle: `CIP: ${p.cip} • ${p.laboratory}`,
              path: `/produits?search=${p.cip}`,
            }));
          searchResults.push(...filtered);
        }

        // Agences
        if (agenciesRes.status === "fulfilled" && agenciesRes.value.ok) {
          const agencies = await agenciesRes.value.json();
          const filtered = agencies
            .filter((a: any) =>
              a.name?.toLowerCase().includes(lowerQuery) ||
              a.city?.toLowerCase().includes(lowerQuery)
            )
            .slice(0, 5)
            .map((a: any) => ({
              id: a.id,
              type: "agency" as const,
              title: a.name,
              subtitle: a.city ? `${a.city} • ${a.country?.name || ""}` : a.country?.name,
              path: `/agences?id=${a.id}`,
            }));
          searchResults.push(...filtered);
        }

        // Pays
        if (countriesRes.status === "fulfilled" && countriesRes.value.ok) {
          const countries = await countriesRes.value.json();
          const filtered = countries
            .filter((c: any) =>
              c.name?.toLowerCase().includes(lowerQuery) ||
              c.code?.toLowerCase().includes(lowerQuery)
            )
            .slice(0, 5)
            .map((c: any) => ({
              id: c.code,
              type: "country" as const,
              title: c.name,
              subtitle: `${c.code} • ${c.region}`,
              path: `/pays?code=${c.code}`,
            }));
          searchResults.push(...filtered);
        }

        // Laboratoires
        if (labsRes.status === "fulfilled" && labsRes.value.ok) {
          const labs = await labsRes.value.json();
          const filtered = labs
            .filter((l: any) => l.name?.toLowerCase().includes(lowerQuery))
            .slice(0, 5)
            .map((l: any) => ({
              id: l.id,
              type: "laboratory" as const,
              title: l.name,
              subtitle: l.contact || l.email,
              path: `/laboratoires?id=${l.id}`,
            }));
          searchResults.push(...filtered);
        }

        // Grossistes
        if (wholesalersRes.status === "fulfilled" && wholesalersRes.value.ok) {
          const wholesalers = await wholesalersRes.value.json();
          const filtered = wholesalers
            .filter((w: any) =>
              w.name?.toLowerCase().includes(lowerQuery) ||
              w.city?.toLowerCase().includes(lowerQuery)
            )
            .slice(0, 5)
            .map((w: any) => ({
              id: w.id,
              type: "wholesaler" as const,
              title: w.name,
              subtitle: w.city || w.countryCode,
              path: `/grossistes?id=${w.id}`,
            }));
          searchResults.push(...filtered);
        }

        setResults(searchResults);
      } catch (error) {
        console.error("Erreur de recherche:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate({ to: result.path as any });
  };

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "product": return Package;
      case "agency": return Building2;
      case "country": return Globe2;
      case "laboratory": return FlaskConical;
      case "wholesaler": return Store;
    }
  };

  const groupByType = () => {
    const grouped: Record<string, SearchResult[]> = {
      product: [],
      agency: [],
      country: [],
      laboratory: [],
      wholesaler: [],
    };

    results.forEach((r) => grouped[r.type].push(r));

    return Object.entries(grouped).filter(([_, items]) => items.length > 0);
  };

  const typeLabels: Record<string, string> = {
    product: "Produits",
    agency: "Agences",
    country: "Pays",
    laboratory: "Laboratoires",
    wholesaler: "Grossistes",
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground hover:bg-card transition-colors cursor-pointer"
      >
        <Search className="h-4 w-4" />
        <span>Rechercher un produit, une agence, un pays…</span>
        <kbd className="ml-auto rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Rechercher..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!loading && query.length >= 2 && results.length === 0 && (
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          )}

          {loading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Recherche...
            </div>
          )}

          {!loading && results.length > 0 && groupByType().map(([type, items]) => (
            <CommandGroup key={type} heading={typeLabels[type]}>
              {items.map((result) => {
                const Icon = getIcon(result.type);
                return (
                  <CommandItem
                    key={`${result.type}-${result.id}`}
                    onSelect={() => handleSelect(result)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{result.title}</span>
                      {result.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {result.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
