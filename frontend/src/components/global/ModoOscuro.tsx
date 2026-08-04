import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { Box } from "@chakra-ui/react";

/**
 * MODO OSCURO (modo noche).
 *
 * La preferencia tiene tres valores y «sistema» es el de partida: mientras la
 * usuaria no toque el interruptor, la app hace lo que diga su móvil u
 * ordenador. En cuanto lo toca, manda su elección y se recuerda para siempre
 * (localStorage).
 *
 * Aquí solo vive el ESTADO. Lo que se ve —el velo que apaga la pantalla— lo
 * pinta `modoOscuro.css` a partir del atributo `data-modo` que este provider
 * escribe en el <html>. Ese reparto es a propósito: así el modo oscuro no
 * depende de que ningún componente se acuerde de consultar nada.
 */

export type ModoLuz = "claro" | "oscuro" | "sistema";

/** Misma clave que lee el script de arranque de index.html. Si se cambia una, hay que cambiar la otra. */
const CLAVE = "modoLuz";

function leerPreferencia(): ModoLuz {
  try {
    const v = localStorage.getItem(CLAVE);
    if (v === "claro" || v === "oscuro" || v === "sistema") return v;
  } catch {
    /* navegador sin localStorage (o en modo privado): seguimos al sistema */
  }
  return "sistema";
}

function sistemaEsOscuro(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

type ModoLuzCtx = {
  /** Lo que ha elegido la usuaria: "claro" | "oscuro" | "sistema". */
  modo: ModoLuz;
  /** Lo que se está viendo de verdad, ya resuelto el caso "sistema". */
  esOscuro: boolean;
  setModo: (m: ModoLuz) => void;
  /** Claro ⇄ oscuro. Deja la preferencia explícita (ya no sigue al sistema). */
  alternar: () => void;
};

const ModoLuzContext = createContext<ModoLuzCtx | null>(null);

export function ModoLuzProvider({ children }: { children: React.ReactNode }) {
  const [modo, setModoState] = useState<ModoLuz>(leerPreferencia);
  const [sistemaOscuro, setSistemaOscuro] = useState<boolean>(sistemaEsOscuro);

  // Con la preferencia en "sistema" seguimos al dispositivo EN VIVO: si cambia
  // solo al atardecer, la app cambia con él sin recargar.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const alCambiar = (e: MediaQueryListEvent) => setSistemaOscuro(e.matches);
    mq.addEventListener?.("change", alCambiar);
    return () => mq.removeEventListener?.("change", alCambiar);
  }, []);

  const esOscuro = modo === "oscuro" || (modo === "sistema" && sistemaOscuro);

  // El atributo del que cuelga todo el CSS. El script de index.html ya lo dejó
  // puesto antes del primer pintado; esto lo mantiene al día a partir de ahí.
  useEffect(() => {
    document.documentElement.dataset.modo = esOscuro ? "oscuro" : "claro";
  }, [esOscuro]);

  const setModo = useCallback((m: ModoLuz) => {
    setModoState(m);
    try {
      localStorage.setItem(CLAVE, m);
    } catch {
      /* si no se puede guardar, al menos vale para esta sesión */
    }
  }, []);

  const alternar = useCallback(
    () => setModo(esOscuro ? "claro" : "oscuro"),
    [esOscuro, setModo]
  );

  const valor = useMemo(
    () => ({ modo, esOscuro, setModo, alternar }),
    [modo, esOscuro, setModo, alternar]
  );

  return <ModoLuzContext.Provider value={valor}>{children}</ModoLuzContext.Provider>;
}

/**
 * Si por lo que sea se usa fuera del provider, devuelve un valor inerte en vez
 * de lanzar: un interruptor que no funciona es un fastidio, una pantalla en
 * blanco es un problema.
 */
export function useModoLuz(): ModoLuzCtx {
  const ctx = useContext(ModoLuzContext);
  if (ctx) return ctx;
  return { modo: "claro", esOscuro: false, setModo: () => {}, alternar: () => {} };
}

/* ------------------------------------------------------------------ */
/* El interruptor                                                      */
/* ------------------------------------------------------------------ */

/** Luna, para pasar a oscuro. Un círculo al que se le muerde otro con una máscara:
 *  así el creciente sale exacto sin depender de un `path` copiado. */
function IconoLuna({ size }: { size: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <Box as="svg" viewBox="0 0 24 24" w={size} h={size} display="block" aria-hidden="true">
      <mask id={`luna-${id}`}>
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <circle cx="20" cy="6" r="9" fill="black" />
      </mask>
      <circle cx="12" cy="12" r="9" fill="currentColor" mask={`url(#luna-${id})`} />
    </Box>
  );
}

/** Sol, para volver a claro. */
function IconoSol({ size }: { size: string }) {
  // Ocho rayos, repartidos cada 45°.
  const rayos = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <Box as="svg" viewBox="0 0 24 24" w={size} h={size} display="block" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      {rayos.map((grados) => (
        <line
          key={grados}
          // El rayo va de y=1.5 a y=4.5: queda fuera del disco (que llega a
          // y=7) con un hueco de aire en medio.
          x1="12"
          y1="1.5"
          x2="12"
          y2="4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${grados} 12 12)`}
        />
      ))}
    </Box>
  );
}

/**
 * Interruptor de modo oscuro. Vive en el SiteHeader, que está en 97 de las 100
 * páginas del recorrido y en todo lo demás, así que con un solo sitio queda
 * accesible desde casi cualquier pantalla.
 *
 * No se pone flotante en una esquina a propósito: abajo-izquierda ya está el
 * mini diario y abajo-derecha los botones «Volver» y la ayuda del recorrido.
 */
export function BotonModoOscuro({ compact = false }: { compact?: boolean }) {
  const { esOscuro, alternar } = useModoLuz();
  const size = compact ? "19px" : "22px";
  const etiqueta = esOscuro ? "Volver al modo claro" : "Ver en modo oscuro";

  return (
    <Box
      as="button"
      type="button"
      onClick={alternar}
      aria-label={etiqueta}
      title={etiqueta}
      color="white"
      bg="transparent"
      border="none"
      p={0}
      lineHeight="0"
      flexShrink={0}
      cursor="pointer"
      opacity={0.85}
      // Mismo resplandor que el resto del header, para que no parezca pegado.
      filter="drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 18px rgba(255,255,255,0.28))"
      transition="opacity 0.25s ease, filter 0.25s ease, transform 0.25s ease"
      _hover={{
        opacity: 1,
        transform: "scale(1.12)",
        filter:
          "drop-shadow(0 0 12px rgba(255,255,255,0.8)) drop-shadow(0 0 26px rgba(180,255,245,0.45))",
      }}
    >
      {esOscuro ? <IconoSol size={size} /> : <IconoLuna size={size} />}
    </Box>
  );
}
