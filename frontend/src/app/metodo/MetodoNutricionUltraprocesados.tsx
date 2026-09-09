import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { useT } from "../../i18n";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { ComicIntegralModal } from "../../components/metodo/ComicIntegralModal";
import { glowHeader } from "../../components/metodo/FotoBox";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useLeidos } from "../../hooks/useLeidos";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import {
  SENALES_ETIQUETA, ULTRAPROCESADOS, ULTRAPROCESADOS_LEIDOS_KEY,
} from "../../hardCoded/espacio/UltraprocesadosNutricion";

// ═════════════════════════════════════════════════════════════════════════
// LOS ULTRAPROCESADOS · paso 6 del recorrido de Nutrición, entre «El hambre» y
// el plato de Harvard. Después de entender por qué no puedes parar de comer,
// esto es lo que estás comiendo.
//
// La página va de menos a más exigente a propósito:
//   1. El ensayo del NIH, que es el ancla: no es opinión, es un experimento.
//   2. Cómo leer una etiqueta — lo ÚNICO accionable, y por eso va arriba: si
//      alguien abandona a los treinta segundos, que se lleve esto.
//   3. Las fichas, agrupadas POR LO SÓLIDO QUE ES EL DATO y no por lo que
//      asustan. Ese orden es la página: es lo que la separa del documental de
//      sobremesa, y lo que la hace sobrevivir a que alguien la discuta.
//   4. El cierre: el cóctel que nadie ha estudiado.
//
// El cómic de «Lo integral» vive AQUÍ (antes estaba en «El hambre»): encaja
// mejor detrás de esta página —esto es lo que te comes, esto es comida de
// verdad, y ahora monta tu plato— y así el paso nuevo no parte esa pareja.
// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionUltraprocesados() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fichaIdx, setFichaIdx] = useState<number | null>(null);
  const [comicIntegralOpen, setComicIntegralOpen] = useState(false);
  const { leido, marcarLeido, snapshot } = useLeidos("metodo-nutricion");
  // Qué fichas venían YA leídas al abrir el visor (para el aviso «✓ Leída»).
  const [yaLeidos, setYaLeidos] = useState<Set<string>>(new Set());

  // El visor marca como leída cada ficha que se muestre (también las que se
  // pasan con las flechas), así que la foto de lo ya leído se toma AQUÍ.
  const abrir = (i: number) => {
    setYaLeidos(snapshot(ULTRAPROCESADOS_LEIDOS_KEY));
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

        // Las tarjetas no salen hasta tener sus fotos: si no, se rellenan a
        // trozos. Las que aún no existan cuentan igual (el `onerror` resuelve),
        // así que esto no se cuelga mientras las portadas estén pendientes.
        await precargarImagenes(ULTRAPROCESADOS.map((u) => encodeURI(u.foto)));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <NutricionLoading />;

  // Los bloques por nivel de certeza, en el orden en que vienen en los datos.
  const grupos: string[] = [];
  ULTRAPROCESADOS.forEach((u) => {
    if (u.grupo && !grupos.includes(u.grupo)) grupos.push(u.grupo);
  });

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title={t("metodo.nutri.paso.ultraprocesados")}
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: `← ${t("metodo.nutri.paso.hambre")}`, onClick: () => navigate("/metodo/nutricion/hambre") }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: `${t("metodo.nutri.paso.platoCrear")} →`, onClick: () => setComicIntegralOpen(true) }}
            />
          </Reveal>

          {/* La tesis de la página. Fuera de las cajas: blanco y sin sombra. */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "lg", md: "2xl" }} fontWeight={600} fontStyle="italic"
                  textAlign="center" lineHeight="1.7" maxW="720px">
              {t("metodo.nutri.ultra.tesis")}
            </Text>
          </Reveal>

          <Reveal direction="up" distance={14} delay={0.16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "sm", md: "md" }} lineHeight="1.85"
                  textAlign="center" maxW="720px">
              {t("metodo.nutri.ultra.intro")}
            </Text>
          </Reveal>

          {/* ── EL ENSAYO DEL NIH: el ancla de toda la página ─────────────── */}
          <Reveal inView direction="up" distance={22} delay={0.1} duration={0.65} amount={0.15} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 boxShadow={glowHeader(nutricionTxt)}>
              <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}d9`} />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 3, md: 4 }}
                    px={{ base: 5, md: 10 }} py={{ base: 7, md: 10 }}>
                <Text color={`${nutricionTxt}cc`} fontSize="2xs" fontWeight={700} letterSpacing="0.14em"
                      textTransform="uppercase" textAlign="center">
                  {t("metodo.nutri.ultra.ensayoEtiqueta")}
                </Text>
                <Text color={nutricionTxt} fontWeight={800} lineHeight="1.1" textAlign="center"
                      fontSize={{ base: "3xl", md: "5xl" }}
                      style={{ textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}>
                  {t("metodo.nutri.ultra.ensayoDato")}
                </Text>
                <Box w="72px" h="1px" bg={`${nutricionTxt}55`} />
                <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.85"
                      textAlign="center" maxW="700px"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {t("metodo.nutri.ultra.ensayoTexto")}
                </Text>
                <Text color={`${nutricionTxt}bb`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                      textAlign="center" lineHeight="1.6" maxW="620px"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {t("metodo.nutri.ultra.ensayoPie")}
                </Text>
              </Flex>
            </Box>
          </Reveal>

          <Separador />

          {/* ── CÓMO LEER UNA ETIQUETA: lo único accionable ───────────────── */}
          <Reveal inView direction="up" distance={18} duration={0.6} w="100%" display="flex"
                  justifyContent="center" flexDirection="column" alignItems="center" gap={3}>
            <Text color="white" fontWeight={700} fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
              {t("metodo.nutri.ultra.etiquetaTitulo")}
            </Text>
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px">
              {t("metodo.nutri.ultra.etiquetaIntro")}
            </Text>
          </Reveal>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 5 }} w="100%">
            {SENALES_ETIQUETA.map((s, i) => (
              <Reveal inView key={s.titulo} direction="up" distance={20} scaleFrom={0.97} duration={0.55}
                      amount={0.2} delay={(i % 2) * 0.07} w="100%" display="flex">
                <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                     boxShadow={glowHeader(nutricionTxt)}>
                  <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}cc`} />
                  <Flex position="relative" zIndex={1} direction="column" gap={2}
                        px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }} h="100%">
                    <Text color={nutricionTxt} fontWeight={700} fontSize={{ base: "md", md: "lg" }}
                          lineHeight="1.3" style={{ textShadow: "0 1px 5px rgba(0,0,0,0.55)" }}>
                      {s.titulo}
                    </Text>
                    <Box w="44px" h="1px" bg={`${nutricionTxt}55`} />
                    <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8"
                          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                      {s.texto}
                    </Text>
                  </Flex>
                </Box>
              </Reveal>
            ))}
          </SimpleGrid>

          <Separador />

          {/* ── LAS FICHAS, por nivel de certeza ──────────────────────────── */}
          <Reveal inView direction="up" distance={18} duration={0.6} w="100%" display="flex"
                  justifyContent="center" flexDirection="column" alignItems="center" gap={3}>
            <Text color="white" fontWeight={700} fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
              {t("metodo.nutri.ultra.fichasTitulo")}
            </Text>
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="680px">
              {t("metodo.nutri.ultra.fichasIntro")}
            </Text>
          </Reveal>

          {grupos.map((grupo) => (
            <Flex key={grupo} direction="column" w="100%" gap={{ base: 4, md: 5 }}>
              {/* Encabezado del bloque: solo el texto y una rayita fina. */}
              <Reveal inView direction="up" distance={12} duration={0.5} w="100%">
                <Flex align="center" gap={4} w="100%">
                  <Text color="white" fontWeight={700} fontSize={{ base: "sm", md: "md" }}
                        letterSpacing="0.08em" textTransform="uppercase" flexShrink={0}>
                    {grupo}
                  </Text>
                  <Box flex="1" h="1px" bg="linear-gradient(to right, rgba(255,255,255,0.55), transparent)" />
                </Flex>
              </Reveal>

              <Box display="grid" gap={{ base: 4, md: 6 }} w="100%"
                   gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}>
                {ULTRAPROCESADOS.map((u, i) => (u.grupo === grupo ? (
                  <Reveal inView key={u.key} direction="up" distance={22} scaleFrom={0.96} duration={0.55}
                          amount={0.2} delay={(i % 3) * 0.06} w="100%" display="flex">
                    <TarjetaNutri titulo={u.titulo} foto={u.foto}
                                  visto={leido(ULTRAPROCESADOS_LEIDOS_KEY, u.key)}
                                  onClick={() => abrir(i)} />
                  </Reveal>
                ) : null))}
              </Box>
            </Flex>
          ))}

          {/* Cierre: el cóctel que nadie ha estudiado. Sobre el turquesa, sin caja. */}
          <Reveal inView direction="up" distance={18} delay={0.1} duration={0.7} w="100%"
                  display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontStyle="italic" fontWeight="400"
                  textAlign="center" maxW="740px" lineHeight="1.7" mt={{ base: 2, md: 4 }}>
              {t("metodo.nutri.ultra.cierre")}
            </Text>
          </Reveal>

        </Flex>
      </Flex>

      {/* La ficha que se haya pulsado, en el visor de ilustración. */}
      {fichaIdx !== null && (
        <NutrienteFichaModal tarjetas={ULTRAPROCESADOS} index={fichaIdx} sinSaltar
                             onLeida={(i) => {
                               const u = ULTRAPROCESADOS[i];
                               if (u) marcarLeido(ULTRAPROCESADOS_LEIDOS_KEY, u.key);
                             }}
                             leida={(i) => yaLeidos.has(ULTRAPROCESADOS[i]?.key)}
                             onClose={() => setFichaIdx(null)} onSelect={setFichaIdx} />
      )}

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

/** Separador con el mandala en medio, el mismo que usa la Microbiota. */
function Separador() {
  return (
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
  );
}
