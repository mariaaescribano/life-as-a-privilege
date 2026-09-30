import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useLeidos } from "../../hooks/useLeidos";
import { nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { MITOS_LEIDOS_KEY } from "../../hardCoded/espacio/MitosNutricion";
import { useMitosNutricion } from "../../hardCoded/espacio/useMitosNutricion";

// ═════════════════════════════════════════════════════════════════════════
// Apartado «Preguntas y mitos» del recorrido de Nutrición. Se llega desde la
// actividad del plato de Harvard. Cada pregunta es una tarjeta con su viñeta;
// al pulsarla se abre la respuesta en el visor de ilustración (foto + texto +
// fondo de la disciplina), y se puede pasar de un mito a otro con las flechas.
// Cada respuesta leída deja su marquita en la tarjeta (también las que se leen
// pasando con las flechas dentro del visor).
// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionMitos() {
  // Columnas de la rejilla: reinicia la cascada en cada fila.
  const columnas = useBreakpointValue({ base: 1, sm: 2, md: 3 }) ?? 1;
  // Los mitos en el idioma activo (el orden, la foto y la `key` con la que se
  // guarda lo leído siguen saliendo del español).
  const MITOS_NUTRICION = useMitosNutricion();
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fichaIdx, setFichaIdx] = useState<number | null>(null);
  const { leido, marcarLeido, snapshot } = useLeidos("metodo-nutricion");
  // Qué mitos venían YA leídos al abrir el visor (para el aviso «✓ Leída»).
  const [yaLeidos, setYaLeidos] = useState<Set<string>>(new Set());

  // Abre la respuesta de un mito. El visor marca como leída cada viñeta que se
  // muestre (también las que se pasan con las flechas), así que la foto de lo
  // que ya estaba leído se toma AQUÍ, antes de entrar.
  const abrir = (i: number) => {
    setYaLeidos(snapshot(MITOS_LEIDOS_KEY));
    setFichaIdx(i);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await getUserMe();
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }

        // No mostramos la página hasta que TODAS las fotos de los mitos estén
        // descargadas: si no, se queda en el spinner (no aparecen de golpe).
        await precargarImagenes(MITOS_NUTRICION.map((m) => encodeURI(m.foto)));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <NutricionLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title={t("metodo.nutri.paso.mitos")}
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: `← ${t("metodo.nutri.paso.macros")}`, onClick: () => navigate("/metodo/nutricion/macros") }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: `${t("metodo.nutri.paso.origen")} →`, onClick: () => navigate("/metodo/nutricion/origen") }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px">
              {t("metodo.nutri.mitos.intro")}
            </Text>
          </Reveal>

          {/* Cada tarjeta se revela POR SÍ MISMA al asomar, en vez de con un
              RevealStagger sobre la rejilla entera.
              OJO, que aquí estuvo el fallo de la página en blanco: el
              RevealStagger disparaba con `amount={0.1}`, o sea «cuando el 10%
              del contenedor esté en pantalla». Con doce tarjetas se cumplía al
              instante, pero al pasar de sesenta la rejilla mide varios miles de
              píxeles y ese 10% no cabe en ninguna pantalla: el disparo NUNCA
              llegaba y las sesenta y cuatro tarjetas se quedaban a opacidad 0
              —ocupando su hueco, invisibles—.
              Tarjeta a tarjeta el umbral es de la tarjeta, así que da igual
              cuántos mitos haya. El `delay` por columna mantiene la sensación de
              cascada dentro de cada fila. */}
          <Box display="grid" gap={{ base: 4, md: 6 }} w="100%"
               gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}>
            {MITOS_NUTRICION.map((m, i) => (
              <Reveal inView once key={m.key} direction="up" distance={30} scaleFrom={0.96} duration={0.8}
                      amount={0.25} delay={0.1 + (i % columnas) * 0.14} w="100%" display="flex">
                <TarjetaNutri titulo={m.titulo} foto={m.foto}
                              visto={leido(MITOS_LEIDOS_KEY, m.key)}
                              onClick={() => abrir(i)} />
              </Reveal>
            ))}
          </Box>

        </Flex>
      </Flex>

      {/* Respuesta en el visor de ilustración (foto + texto + fondo cambiado). */}
      {fichaIdx !== null && (
        <NutrienteFichaModal tarjetas={MITOS_NUTRICION} index={fichaIdx} sinSaltar
                             onLeida={(i) => {
                               const m = MITOS_NUTRICION[i];
                               if (m) marcarLeido(MITOS_LEIDOS_KEY, m.key);
                             }}
                             leida={(i) => yaLeidos.has(MITOS_NUTRICION[i]?.key)}
                             onClose={() => setFichaIdx(null)} onSelect={setFichaIdx} />
      )}

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
