import { Pill, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type Role = "pharmacy" | "admin";

export function Header({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Pill className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight">Pharma<span className="text-primary">OS</span></div>
            <div className="text-[11px] text-muted-foreground leading-tight">Inventory Cloud</div>
          </div>
        </div>

        <div className="ml-6 hidden flex-1 max-w-md md:flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span>Search SKUs, pharmacies, imports…</span>
          <kbd className="ml-auto rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-border bg-surface p-1 text-xs font-medium">
            <button
              onClick={() => setRole("pharmacy")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                role === "pharmacy" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pharmacy View
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                role === "admin" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Super-Admin
            </button>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </Button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
            {role === "admin" ? "SA" : "PC"}
          </div>
        </div>
      </div>
    </header>
  );
}
