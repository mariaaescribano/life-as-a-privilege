import { defineConfig } from "vite";

// Configuración del empaquetador. Hasta ahora NO había ninguna: Vite usaba sus
// valores por defecto y metía React, Chakra, framer-motion, axios y el código
// propio en UN SOLO archivo de entrada de ~950 KB que se descarga en TODAS las
// páginas. Aquí solo se toca el reparto en archivos; no cambia nada del código
// ni de cómo se ve la web.
//
// Por qué separar por librería y no dejarlo en un bloque:
//   · Se descargan EN PARALELO en vez de en un único archivo enorme.
//   · Sobreviven a los despliegues: React o Chakra no cambian de una subida a
//     otra, así que el navegador los reutiliza en vez de volver a bajarlos…
//     SIEMPRE QUE el servidor deje cachear. Hoy Render sirve todo con
//     `cache-control: max-age=0`, así que este beneficio no se está cobrando:
//     hay que darles `max-age=31536000, immutable` a /assets/* en el panel de
//     Render (los nombres ya llevan hash, así que es seguro).
const VENDOR: Record<string, string[]> = {
  // React y su router: el corazón, lo que menos cambia.
  react: ["react-dom", "react-router", "react-router-dom", "scheduler"],
  // Chakra y su motor de estilos (emotion, popper, focus-lock…).
  chakra: [
    "@chakra-ui", "@emotion", "@popperjs", "focus-lock", "react-focus-lock",
    "react-remove-scroll", "react-remove-scroll-bar", "react-clientside-effect",
    "stylis", "color2k", "lodash.mergewith", "aria-hidden", "use-callback-ref",
    "use-sidecar", "compute-scroll-into-view", "detect-node-es", "toggle-selection",
  ],
  // Las animaciones.
  motion: ["framer-motion", "motion-dom", "motion-utils"],
  // Las llamadas al servidor.
  red: ["axios", "follow-redirects"],
};

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // Nombre del paquete tal cual aparece en la ruta, para casar tanto
          // "node_modules/react-dom/..." como "node_modules/@chakra-ui/react/...".
          const ruta = id.split("node_modules/").pop() ?? "";
          for (const [grupo, paquetes] of Object.entries(VENDOR)) {
            if (paquetes.some((p) => ruta.startsWith(p + "/") || ruta.startsWith(p))) return grupo;
          }
          return;
        },
      },
    },
  },
});
