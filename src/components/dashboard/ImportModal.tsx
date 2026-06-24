import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet, Check } from "lucide-react";

export function ImportModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [stage, setStage] = useState<"idle" | "done">("idle");

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(() => setStage("idle"), 200); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Import inventory data</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file. Columns must include SKU, name, quantity, and threshold.
          </DialogDescription>
        </DialogHeader>

        {stage === "idle" ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-surface p-10 text-center transition-colors hover:border-primary/40 hover:bg-accent/30">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="mt-4 text-sm font-medium">Drag & drop your file here</div>
            <div className="mt-1 text-xs text-muted-foreground">or click to browse · CSV, XLSX up to 25 MB</div>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>template_inventory_v3.csv</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-accent/40 p-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-6 w-6" />
            </div>
            <div className="mt-4 text-sm font-medium">142 items imported successfully</div>
            <div className="mt-1 text-xs text-muted-foreground">Stock levels updated · 3 new alerts triggered</div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          {stage === "idle" ? (
            <Button onClick={() => setStage("done")}>Simulate upload</Button>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
