import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { ComicHambreModal } from "../../components/metodo/ComicHambreModal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useLeidos } from "../../hooks/useLeidos";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { MICROBIOTA_BACTERIAS, MICROBIOTA_TARJETAS } from "../../hardCoded/espacio/MicrobiotaNutricion";

// ═════════════════════════════════════════════════════════════════════════
// Apartado «Microbiota» del recorrido de Nutrición. Se llega desde Los
// nutrientes (botón «Microbiota →» → cómic de transición → aquí). Primero las
// bacterias más conocidas de la microbiota; tras un separador con el mandala,
// las moléculas que fabrican. Cada tarjeta abre su ficha tipo cómic y, al
// leerla, se queda con su marquita (también las que se leen pasando con las
// flechas dentro del visor).
// ═════════════════════════════════════════════════════════════════════════

// Listas de leídos dentro de metodo_nutricion.data (una por rejilla).
const CAMPO_BACTERIAS = "microbiota_bacterias_leidas";
const CAMPO_MOLECULAS = "microbiota_moleculas_leidas";

export default function MetodoNutricionMicrobiota() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fichaIdx, setFichaIdx] = useState<number | null>(null);
  const [bacteriaIdx, setBacteriaIdx] = useState<number | null>(null);
  const { leido, marcarLeido, snapshot } = useLeidos("metodo-nutricion");
  // Lo que venía YA leído al abrir el visor (para el aviso «✓ Leída» de dentro).
  const [yaLeidas, setYaLeidas] = useState<Set<string>>(new Set());

  // El visor marca cada ficha que se muestra, así que la foto de lo ya leído se
  // toma al abrir, antes de entrar.
  const abrirBacteria = (i: number) => {
    setYaLeidas(snapshot(CAMPO_BACTERIAS));
    setBacteriaIdx(i);
  };
  const abrirMolecula = (i: number) => {
    setYaLeidas(snapshot(CAMPO_MOLECULAS));
    setFichaIdx(i);
  };
  // Cómic de transición hacia «El hambre» (se abre al pulsar «El hambre →»).
  const [comicHambreOpen, setComicHambreOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }

        // No mostramos la página hasta que TODAS las fotos de las tarjetas estén
        // descargadas: si no, se queda en el spinner (no aparecen de golpe).
        await precargarImagenes(
          [...MICROBIOTA_BACTERIAS, ...MICROBIOTA_TARJETAS].map((t) => encodeURI(t.foto)),
        );
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
              title="La microbiota"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: `← ${t("metodo.nutri.paso.secundarios")}`, onClick: () => navigate("/metodo/nutricion/nutrientes-secundarios") }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: `${t("metodo.nutri.paso.hambre")} →`, onClick: () => setComicHambreOpen(true) }}
            />
          </Reveal>

          {/* ── Las bacterias más conocidas de tu microbiota ── */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px">
              Algunas de las bacterias más conocidas que habitan tu intestino, cada una con su función.
            </Text>
          </Reveal>

          <Reveal inView direction="up" distance={20} delay={0.16} duration={0.6} w="100%">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
              {MICROBIOTA_BACTERIAS.map((bac, i) => (
                <TarjetaNutri key={bac.key} titulo={bac.titulo} foto={bac.foto}
                              visto={leido(CAMPO_BACTERIAS, bac.key)}
                              onClick={() => abrirBacteria(i)} />
              ))}
            </SimpleGrid>
          </Reveal>

          {/* ── Separador horizontal con el mandala en medio ── */}
          <Reveal inView direction="up" distance={12} delay={0.1} duration={0.6} w="100%">
            <Flex align="center" justify="center" gap={{ base: 4, md: 6 }} w="100%" py={{ base: 2, md: 3 }}>
              <Box flex="1" h="1px" bg="linear-gradient(to right, transparent, rgba(255,255,255,0.75))" />
              <Image
                src="/img/icono/life.png"
                alt=""
                h={{ base: "44px", md: "56px" }}
                objectFit="contain"
                flexShrink={0}
                style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 24px rgba(180,255,245,0.28))" }}
              />
              <Box flex="1" h="1px" bg="linear-gradient(to left, transparent, rgba(255,255,255,0.75))" />
            </Flex>
          </Reveal>

          {/* ── Las moléculas que fabrican ── */}
          <Reveal inView direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px">
              Tres de las moléculas más importantes que fabrican las bacterias de tu intestino.
            </Text>
          </Reveal>

          <Reveal inView direction="up" distance={20} delay={0.16} duration={0.6} w="100%">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
              {MICROBIOTA_TARJETAS.map((tar, i) => (
                <TarjetaNutri key={tar.key} titulo={tar.titulo} foto={tar.foto}
                              visto={leido(CAMPO_MOLECULAS, tar.key)}
                              onClick={() => abrirMolecula(i)} />
              ))}
            </SimpleGrid>
          </Reveal>

        </Flex>
      </Flex>

      {/* Ficha tipo cómic de la bacteria seleccionada. */}
      {bacteriaIdx !== null && (
        <NutrienteFichaModal tarjetas={MICROBIOTA_BACTERIAS} index={bacteriaIdx}
                             onLeida={(i) => {
                               const bac = MICROBIOTA_BACTERIAS[i];
                               if (bac) marcarLeido(CAMPO_BACTERIAS, bac.key);
                             }}
                             leida={(i) => yaLeidas.has(MICROBIOTA_BACTERIAS[i]?.key)}
                             onClose={() => setBacteriaIdx(null)} onSelect={setBacteriaIdx} />
      )}

      {/* Ficha tipo cómic de la molécula seleccionada. */}
      {fichaIdx !== null && (
        <NutrienteFichaModal tarjetas={MICROBIOTA_TARJETAS} index={fichaIdx}
                             onLeida={(i) => {
                               const tar = MICROBIOTA_TARJETAS[i];
                               if (tar) marcarLeido(CAMPO_MOLECULAS, tar.key);
                             }}
                             leida={(i) => yaLeidas.has(MICROBIOTA_TARJETAS[i]?.key)}
                             onClose={() => setFichaIdx(null)} onSelect={setFichaIdx} />
      )}

      {/* Cómic de transición hacia «El hambre». */}
      <ComicHambreModal
        isOpen={comicHambreOpen}
        onClose={() => setComicHambreOpen(false)}
        onContinue={() => navigate("/metodo/nutricion/hambre")}
      />

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
