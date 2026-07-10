import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  nitro: {
    preset: "vercel",
  },

  vite: {
    build: {
      // Force rebuild et cache busting
      rollupOptions: {
        output: {
          // Ajouter un hash aux noms de fichiers pour invalider le cache
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`
        }
      }
    },

    ssr: {
      noExternal: [
        "tslib",
        /^@radix-ui\/.*/,
        /^react-remove-scroll.*/,
        /^aria-hidden$/,
        /^use-sidecar$/,
        /^use-callback-ref$/,
        /^react-style-singleton$/,
      ],
    },

    optimizeDeps: {
      include: [
        "tslib",
        "@radix-ui/react-dialog",
      ],
    },
  },
});