import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WORLD_COUNTRIES, type CountryData } from "@/lib/countries-data";

// Helper pour combiner les classnames
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type CountrySelectProps = {
  value?: string; // Code ISO du pays sélectionné
  onSelect: (country: CountryData) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function CountrySelect({ value, onSelect, disabled, placeholder = "Sélectionner un pays..." }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedCountry = useMemo(
    () => WORLD_COUNTRIES.find(c => c.code === value),
    [value]
  );

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return WORLD_COUNTRIES;

    return WORLD_COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
    );
  }, [search]);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Bouton de sélection */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !selectedCountry && "text-muted-foreground"
        )}
      >
        {selectedCountry ? (
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">{selectedCountry.flag}</span>
            <span className="font-medium">{selectedCountry.name}</span>
            <span className="text-xs text-muted-foreground">({selectedCountry.code})</span>
          </div>
        ) : (
          <span>{placeholder}</span>
        )}
        {selectedCountry && !disabled && (
          <X
            className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onSelect({ name: "", code: "", code3: "", flag: "", region: "" });
            }}
          />
        )}
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          {/* Barre de recherche */}
          <div className="flex items-center border-b border-border px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Rechercher un pays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>

          {/* Liste des pays */}
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Aucun pays trouvé.
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onSelect(country);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    value === country.code && "bg-accent"
                  )}
                >
                  <span className="text-2xl leading-none">{country.flag}</span>
                  <div className="flex flex-1 flex-col items-start">
                    <span className="font-medium">{country.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {country.code} · {country.region}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
