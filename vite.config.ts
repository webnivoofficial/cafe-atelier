import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const r = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

/* Two real pages so /menu is a genuine, directly-loadable route
   (Vercel serves menu.html at /menu via its clean-URL behaviour):
   - /      → index.html  (the Café Atelier home experience)
   - /menu  → menu.html   (the dedicated QR destination) */
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: r('./index.html'),
        menu: r('./menu.html'),
      },
    },
  },
})
