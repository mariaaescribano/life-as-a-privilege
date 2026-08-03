import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useLeidos } from "../../hooks/useLeidos";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { MITOS_NUTRICION, MITOS_LEIDOS_KEY } from "../../hardCoded/espacio/MitosNutricion";

// ═════════════════════════════════════════════════════════════════════════
// Apartado «Preguntas y mitos» del recorrido de Nutrición. Se llega desde la
// actividad del plato de Harvard. Cada pregunta es una tarjeta con su viñeta;
// al pulsarla se abre la respuesta en el visor de ilustración (foto + texto +
// fondo de la disciplina), y se puede pasar de un mito a otro con las flechas.
// Cada respuesta leída deja su marquita en la tarjeta (también las que se leen
// pasando con las flechas dentro del visor).
// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionMitos() {
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
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
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

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="Preguntas y mitos"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Tus calorías", onClick: () => navigate("/metodo/nutricion/calorias") }}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: "Cursos →", onClick: () => navigate("/metodo/nutricion/cursos") }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px">
              Estas son algunas de las preguntas y mitos que más se repiten. Toca cada uno para descubrir qué dice
              de verdad la ciencia.
            </Text>
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.16} duration={0.6} w="100%">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
              {MITOS_NUTRICION.map((m, i) => (
                <TarjetaNutri key={m.key} titulo={m.titulo} foto={m.foto}
                              visto={leido(MITOS_LEIDOS_KEY, m.key)}
                              onClick={() => abrir(i)} />
              ))}
            </SimpleGrid>
          </Reveal>

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
