import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // On indique explicitement à Nitro de compiler pour Vercel
  nitro: {
    preset: "vercel"
  },
  // 💡 On passe la configuration par l'objet vite, ce qui résout l'erreur TypeScript
  vite: {
    ssr: {
      noExternal: ["@radix-ui/react-dialog", "@radix-ui/react-slot", "tslib"],
    },
  },
});