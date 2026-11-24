import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { AstrologiaLoader } from "../../components/metodo/comicLoaders";
import { HISTORIA_ASTROLOGIA } from "../../components/metodo/comicHistoriaAstrologia";
import { useComic } from "../../i18n/comics";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { astrologiaTxt, FONDO_PAGINA_BEIGE } from "../../GlobalVariables";

/**
 * Paso 2 del recorrido de Astrología: la Historia. Ya no hay página: al entrar se abre directamente el cómic de las
 * ilustraciones, sin X (solo flechas). La flecha de la izquierda de la primera viñeta vuelve al paso anterior; la de la
 * derecha de la última sigue a la Explicación (o, si María aún no ha abierto ese paso, al camino).
 */
export default function MetodoAstrologiaHistoria() {
  const navigate = useNavigate();
  const vinetas = useComic("astrologia-historia", HISTORIA_ASTROLOGIA);
  const { bloqueada, cargado } = useAstrologiaProgreso();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  // «Siguiente» cerrado hasta que María abra el paso 3 (ella entra siempre).
  const siguienteCerrado = !esMariaMirando() && cargado && bloqueada(3);

  // Atrás = de donde se venía (la Bienvenida, o el cómic de EMPEZAR si no hay Bienvenida); sin historial, el camino.
  const atras = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate("/camino/astrologia");
  };

  return (
    <Box minH="100vh" bg={FONDO_PAGINA_BEIGE}>
      <IntroComicModal
        isOpen
        vinetas={vinetas}
        themeColor={astrologiaTxt}
        loader={<AstrologiaLoader color={astrologiaTxt} />}
        soloFlechas
        siguienteArriba
        alAnterior={atras}
        onClose={() => { /* sin X: no se cierra */ }}
        onComplete={() => navigate(siguienteCerrado ? "/camino/astrologia" : "/metodo/astrologia/explicacion")}
      />
    </Box>
  );
}
