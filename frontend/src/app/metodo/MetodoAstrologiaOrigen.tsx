import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { ORIGEN_ESPIRITUALIDAD } from "../../components/metodo/ComicUniversoModal";
import { AstrologiaLoader } from "../../components/metodo/comicLoaders";
import { useComic } from "../../i18n/comics";
import { astrologiaTxt, FONDO_PAGINA_BEIGE } from "../../GlobalVariables";

/**
 * Lo que se abre al pulsar EMPEZAR en el camino de Astrología: directamente el cómic del Origen (las ilustraciones
 * inmersivas, sin página alrededor). Sin X: la persona se mueve solo con las flechas. La de la izquierda de la primera
 * viñeta la devuelve al principio (el camino); la de la derecha de la última sigue a la Bienvenida.
 */
export default function MetodoAstrologiaOrigen() {
  const navigate = useNavigate();
  // Solo las 13 primeras: la 14 («El Mapa te acompañará…») no sale en el cómic de EMPEZAR.
  const vinetas = useComic("origen-espiritualidad", ORIGEN_ESPIRITUALIDAD).slice(0, 13);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  return (
    <Box minH="100vh" bg={FONDO_PAGINA_BEIGE}>
      <IntroComicModal
        isOpen
        vinetas={vinetas}
        themeColor={astrologiaTxt}
        loader={<AstrologiaLoader color={astrologiaTxt} />}
        soloFlechas
        siguienteArriba
        alAnterior={() => navigate("/camino/astrologia")}
        onClose={() => { /* sin X: no se cierra */ }}
        onComplete={() => navigate("/metodo/astrologia/bienvenida")}
      />
    </Box>
  );
}
