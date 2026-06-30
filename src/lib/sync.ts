// Write-through helpers — fire-and-forget API mutations.
// Local stores update synchronously (optimistic). On API failure we toast.
import { api, API_ENABLED, ApiError } from "./api";
import { toast } from "sonner";

function notify(err: unknown, op: string) {
  const msg = err instanceof Error ? err.message : String(err);
  // Don't spam during preview/demo if the backend is offline.
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) return;

  // Si c'est une erreur 401, afficher un message plus explicite
  if (err instanceof ApiError && err.status === 401) {
    toast.error("Session expirée, veuillez vous reconnecter");
    return;
  }

  toast.error(`Erreur ${op}: ${msg}`);
}

export function syncFire(promise: Promise<unknown>, op: string) {
  promise.catch(err => notify(err, op));
}

export function syncCreate(path: string, body: unknown): Promise<unknown> {
  if (!API_ENABLED) return Promise.resolve();
  const promise = api(path, { method: "POST", body: JSON.stringify(body) });
  syncFire(promise, `création ${path}`);
  return promise;
}

export function syncUpdate(path: string, body: unknown) {
  if (!API_ENABLED) return;
  syncFire(api(path, { method: "PATCH", body: JSON.stringify(body) }), `mise à jour ${path}`);
}

export function syncPut(path: string, body: unknown) {
  if (!API_ENABLED) return;
  syncFire(api(path, { method: "PUT", body: JSON.stringify(body) }), `modification ${path}`);
}

export function syncDelete(path: string) {
  if (!API_ENABLED) return;
  syncFire(api(path, { method: "DELETE" }), `suppression ${path}`);
}
