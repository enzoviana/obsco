import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  nitro: {
    preset: "vercel",
  },

  vite: {
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