import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { ComicIntegralModal } from "../../components/metodo/ComicIntegralModal";
import { NutrienteIlustracionModal } from "../../components/metodo/NutrienteIlustracionModal";
import { HAMBRE_HOLISTICA, HAMBRE_CIERRE, sinNegrita } from "../../components/metodo/hambreHolistica";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";

// ═════════════════════════════════════════════════════════════════════════
// Apartado «El hambre» del recorrido de Nutrición. Va ENTRE la Microbiota y el
// plato de Harvard. Contenido: «El hambre, una mirada holística» — 4 lecturas y,
// al final, una frase directamente sobre el fondo turquesa (sin box).
//
// La página NO trae el texto: enseña las cuatro fotos en la MISMA tarjeta que la
// Microbiota (TarjetaNutri → FotoBox: foto a sangre arriba, título abajo a la
// izquierda, sin botón «Ver» porque la tarjeta entera es el botón). La lectura se
// hace en el visor inmersivo (el mismo de las Ilustraciones), que abre por la que
// se pulse y deja pasar a las otras tres con las flechas. Antes los cuatro textos
// iban en la propia página, en boxes con scroll interno: había que leer cuatro
// columnas de texto seguidas sin salir del turquesa, y la foto competía con la
// letra.
//
// Los mismos 4 bloques (HAMBRE_HOLISTICA) son también un cómic de la galería de
// «Ilustraciones» de Nutrición.
// ═════════════════════════════════════════════════════════════════════════

// Las viñetas tal como las lee el visor: sin las marcas **…** de negrita, que el
// ComicViewer pinta en plano.
const VINETAS_HAMBRE = sinNegrita(HAMBRE_HOLISTICA);

export default function MetodoNutricionHambre() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Cómic de transición «Lo integral» (se abre al pulsar «Crea tu plato →»).
  const [comicIntegralOpen, setComicIntegralOpen] = useState(false);
  // La lectura abierta en el visor (índice dentro de HAMBRE_HOLISTICA).
  const [lecturaAbierta, setLecturaAbierta] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }

        // No mostramos la página hasta que TODAS las fotos de los 4 boxes estén
        // descargadas: mientras, se ve la animación de Nutrición (no aparecen
        // de golpe ni sale un hueco vacío).
        await precargarImagenes(HAMBRE_HOLISTICA.map((v) => encodeURI(v.src)));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <NutricionLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="El hambre"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: `← ${t("metodo.nutri.paso.microbiota")}`, onClick: () => navigate("/metodo/nutricion/microbiota") }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: `${t("metodo.nutri.paso.platoCrear")} →`, onClick: () => setComicIntegralOpen(true) }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "lg", md: "2xl" }} fontWeight={600} fontStyle="italic"
                  textAlign="center" lineHeight="1.7" maxW="720px">
              El hambre: una mirada holística
            </Text>
          </Reveal>

          {/* Las cuatro lecturas, en la tarjeta de la Microbiota: foto arriba y
              título abajo. Una fila de cuatro en escritorio, dos en tablet y una
              sola columna en móvil. */}
          <Reveal inView direction="up" distance={20} delay={0.16} duration={0.6} w="100%">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 4, md: 6 }} w="100%">
              {HAMBRE_HOLISTICA.map((v, i) => (
                <TarjetaNutri key={v.src} titulo={v.titulo} foto={v.src}
                              onClick={() => setLecturaAbierta(i)} />
              ))}
            </SimpleGrid>
          </Reveal>

          {/* Frase de cierre, directamente sobre el fondo turquesa (sin box) */}
          <Reveal inView direction="up" distance={18} delay={0.2} duration={0.7} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontStyle="italic" fontWeight="400"
                  textAlign="center" maxW="740px" lineHeight="1.7" mt={{ base: 2, md: 4 }}
                  style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}>
              {HAMBRE_CIERRE}
            </Text>
          </Reveal>

        </Flex>
      </Flex>

      {/* La lectura que se haya pulsado, en el visor inmersivo: abre por esa y
          deja pasar a las otras tres con las flechas. */}
      <NutrienteIlustracionModal
        isOpen={lecturaAbierta !== null}
        vinetas={VINETAS_HAMBRE}
        initialIndex={lecturaAbierta ?? 0}
        onClose={() => setLecturaAbierta(null)}
      />

      {/* Cómic de transición «Lo integral» hacia el plato de Harvard. */}
      <ComicIntegralModal
        isOpen={comicIntegralOpen}
        onClose={() => setComicIntegralOpen(false)}
        onContinue={() => navigate("/metodo/nutricion/plato")}
      />

      <IndiceNutricion />
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
