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
//
// CUIDADO al tocar estas listas: si una librería que usan las demás se queda
// FUERA de todos los grupos, Rollup la mete donde le parece (por ejemplo,
// React dentro del archivo de Chakra) y los archivos acaban importándose en
// círculo: react → chakra → react. En el navegador eso revienta con
// «can't access property "createContext" of undefined», porque Chakra se
// ejecuta antes de que React exista. Por eso `react` está el PRIMERO de la
// lista: es la base de todo lo demás y nunca puede quedarse suelto.
const VENDOR: Record<string, string[]> = {
  // React y su router: el corazón, lo que menos cambia.
  react: [
    "react", "react-dom", "react-is", "react-router", "react-router-dom",
    "scheduler", "use-sync-external-store",
  ],
  // Chakra y su motor de estilos (emotion, popper, focus-lock…).
  chakra: [
    "@chakra-ui", "@emotion", "@popperjs", "focus-lock", "react-focus-lock",
    "react-remove-scroll", "react-remove-scroll-bar", "react-clientside-effect",
    "stylis", "color2k", "lodash.mergewith", "aria-hidden", "use-callback-ref",
    "use-sidecar", "compute-scroll-into-view", "detect-node-es", "toggle-selection",
    "@zag-js", "framesync", "@popperjs/core",
  ],
  // Las animaciones.
  motion: ["framer-motion", "motion-dom", "motion-utils", "motion"],
  // Las llamadas al servidor.
  red: ["axios", "follow-redirects"],
};

// Nombre del paquete tal cual: "node_modules/react-dom/client.js" → "react-dom",
// "node_modules/@chakra-ui/react/dist/x.js" → "@chakra-ui/react". Se compara por
// nombre EXACTO (o por el ámbito "@algo") para que "react" no se trague a
// "react-three-fiber" ni "@react-three/drei", que van aparte y se cargan solos.
function nombrePaquete(id: string): string {
  const ruta = id.split("node_modules/").pop() ?? "";
  const partes = ruta.split("/");
  return partes[0].startsWith("@") ? partes.slice(0, 2).join("/") : partes[0];
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          const paquete = nombrePaquete(id);
          const ambito = paquete.startsWith("@") ? paquete.split("/")[0] : null;
          for (const [grupo, paquetes] of Object.entries(VENDOR)) {
            if (paquetes.includes(paquete) || (ambito && paquetes.includes(ambito))) return grupo;
          }
          return;
        },
      },
    },
  },
});
