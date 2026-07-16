import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { NutrienteComic } from "../../components/metodo/NutrienteComic";
import { NutrienteCirculo } from "../../components/metodo/NutrienteCirculo";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { comicNutrienteByKey } from "../../components/metodo/comicsNutrientes";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { NUTRIENTES, type Nutriente, type NutrienteTarjeta } from "../../hardCoded/espacio/NutrientesNutricion";

// ═════════════════════════════════════════════════════════════════════════
// Página de detalle de UN grupo de nutrientes (Carbohidratos, Grasas…).
// Se llega desde /metodo/nutricion/nutrientes al pulsar una tarjeta.
//
// Estructura (en construcción, se irá rellenando):
//   1. Header + botón «← Volver».
//   2. Box grande: foto del grupo a la izquierda + título y descripción.
//   3. Box tipo cómic: foto a la izquierda + texto a la derecha.
//   4. Tres tarjetas.
// ═════════════════════════════════════════════════════════════════════════

const nutrienteByKey = (key: string): Nutriente | undefined =>
  NUTRIENTES.find((n) => n.key === key);

// Botón «← Volver» en la gama de Nutrición (verde), bajo el header.
function VolverNutri({ onClick }: { onClick: () => void }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      alignSelf="flex-start"
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={{ base: 4, md: 5 }}
      py={{ base: 2, md: 2.5 }}
      borderRadius="full"
      bg={`${nutricionBg}e6`}
      border={`1px solid ${nutricionTxt}55`}
      color={nutricionTxt}
      fontFamily="'EB Garamond', serif"
      fontWeight="600"
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.03em"
      cursor="pointer"
      boxShadow="0 2px 12px rgba(0,0,0,0.2)"
      transition="all 0.18s"
      _hover={{ bg: nutricionBg, borderColor: nutricionTxt, transform: "translateY(-1px)" }}
    >
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill="currentColor" flexShrink={0}>
        <path d="M480-160 160-480l320-320 56 57-223 223h487v80H313l224 224-57 56Z" />
      </Box>
      Volver
    </Box>
  );
}

// Marco base de sección con el fondo de Nutrición (nutri.png) visible + un velo
// claro suave para que el texto oscuro (nutricionTxt) se lea. Mismo tratamiento
// que las tarjetas de la lista de nutrientes. Reutilizado por las secciones.
function SeccionBox({ children, ...rest }: React.ComponentProps<typeof Box>) {
  return (
    <Box position="relative" overflow="hidden" w="100%" borderRadius="2xl"
         border={`1px solid ${nutricionTxt}2e`}
         boxShadow="0 6px 24px rgba(0,0,0,0.22), 0 0 16px rgba(255,255,255,0.1)" {...rest}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}55`} />
      <Box position="relative" zIndex={1}>{children}</Box>
    </Box>
  );
}

// Recuadro de imagen placeholder (mientras no haya foto): un icono suave sobre
// un fondo tenue del color del grupo.
function FotoPlaceholder({ label = "Foto", color }: { label?: string; color: string }) {
  return (
    <Flex direction="column" align="center" justify="center" gap={2} w="100%" h="100%"
          minH="160px" bg={`${color}1f`} border={`1px dashed ${nutricionTxt}55`} borderRadius="xl">
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill={`${nutricionTxt}88`}>
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
      </Box>
      <Text color={`${nutricionTxt}99`} fontSize="2xs" fontWeight="700" letterSpacing="0.14em"
            textTransform="uppercase">
        {label}
      </Text>
    </Flex>
  );
}

export default function MetodoNutricionNutriente() {
  const navigate = useNavigate();
  const { key } = useParams<{ key: string }>();
  const [loading, setLoading] = useState(true);

  const [fichaIdx, setFichaIdx] = useState<number | null>(null); // tarjeta abierta

  const n = nutrienteByKey(key || "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!n) { navigate("/metodo/nutricion/nutrientes", { replace: true }); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito && !testEnabled) { navigate("/metodo/nutricion"); return; }

        // No mostramos la página hasta que sus fotos estén descargadas: la foto
        // del grupo, las viñetas del cómic y las fotos de las tarjetas, para que
        // ninguna aparezca de golpe cuando el resto ya está en pantalla.
        await precargarImagenes([
          n.img,
          ...(comicNutrienteByKey(n.key)?.map((v) => v.src) ?? []),
          ...(n.tarjetas?.map((t) => t.foto) ?? []),
        ]);
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, key]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!n) return null;

  const comic = comicNutrienteByKey(n.key);

  // Subgrupos de tarjetas (p.ej. «⚡ Electrolitos» / «🧱 Minerales»): agrupamos
  // las tarjetas consecutivas por su `grupo` conservando el índice GLOBAL (el que
  // usa el modal de ficha). Si ninguna define `grupo`, queda un único grupo.
  const subgruposTarjetas: { grupo?: string; items: { tar: NutrienteTarjeta; idx: number }[] }[] = [];
  (n.tarjetas ?? []).forEach((tar, idx) => {
    const ultimo = subgruposTarjetas[subgruposTarjetas.length - 1];
    if (ultimo && ultimo.grupo === tar.grupo) ultimo.items.push({ tar, idx });
    else subgruposTarjetas.push({ grupo: tar.grupo, items: [{ tar, idx }] });
  });
  const hayVariosSubgrupos = subgruposTarjetas.length > 1;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          {/* 1 · Header */}
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="Los nutrientes"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
            />
          </Reveal>

          {/* Botón «← Volver» */}
          <Reveal direction="up" distance={12} delay={0.08} duration={0.5} w="100%" display="flex">
            <VolverNutri onClick={() => navigate("/metodo/nutricion/nutrientes")} />
          </Reveal>

          {/* 2 · Box grande: foto del grupo (izq) + título + descripción (der) */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.6} w="100%">
            <SeccionBox>
              <Flex direction={{ base: "column", md: "row" }} align="center" gap={{ base: 5, md: 8 }}
                    p={{ base: 5, md: 8 }}>
                <Box w={{ base: "100%", md: "300px" }} flexShrink={0} aspectRatio={1}
                     borderRadius="xl" overflow="hidden" bg={`${n.color}22`}
                     boxShadow="0 4px 18px rgba(0,0,0,0.25)">
                  <Image src={encodeURI(n.img)} alt={n.label} w="100%" h="100%" objectFit="cover"
                         fallback={<FotoPlaceholder label={n.label} color={n.color} />} />
                </Box>
                <Flex direction="column" gap={3} flex="1" textAlign={{ base: "center", md: "left" }}
                      align={{ base: "center", md: "flex-start" }}>
                  <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" lineHeight="1.1">
                    {n.label}
                  </Text>
                  <Box h="2px" w="64px" bgGradient={`linear(to-r, ${n.color}, transparent)`} />
                  <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                        fontWeight="600" lineHeight="1.6" maxW="440px">
                    {n.resumen}
                  </Text>
                </Flex>
              </Flex>
            </SeccionBox>
          </Reveal>

          {/* 3 · Cómic del grupo: foto 1:1 (izq) + texto (der) con scroll. */}
          {comic && (
            <Reveal direction="up" distance={20} delay={0.18} duration={0.6} w="100%">
              <NutrienteComic vinetas={comic} />
            </Reveal>
          )}

          {/* 4 · Tarjetas (moléculas/tipos). En círculo de colores (vitaminas) o
              en rejilla estilo «Todas tus células». Cada una abre su ficha cómic. */}
          {n.tarjetas && n.tarjetas.length > 0 && (
            <Reveal direction="up" distance={20} delay={0.24} duration={0.6} w="100%">
              {n.tarjetasCirculo ? (
                <NutrienteCirculo tarjetas={n.tarjetas} tituloCentro={n.label}
                                  onSelect={(i) => setFichaIdx(i)} />
              ) : (
                <Flex direction="column" w="100%" gap={{ base: 6, md: 8 }}>
                  {subgruposTarjetas.map((g, gi) => (
                    <Box key={g.grupo ?? gi} w="100%">
                      {/* Encabezado del subgrupo con línea horizontal a los lados
                          (solo si hay más de un subgrupo, p.ej. Electrolitos/Minerales). */}
                      {hayVariosSubgrupos && g.grupo && (
                        <Flex align="center" gap={4} mb={{ base: 4, md: 5 }}>
                          <Box flex="1" h="1px" bgGradient={`linear(to-r, transparent, ${nutricionTxt}66)`} />
                          <Text color={nutricionTxt} fontWeight="800" fontSize={{ base: "md", md: "lg" }}
                                letterSpacing="0.06em" textTransform="uppercase" whiteSpace="nowrap"
                                style={{ textShadow: `0 1px 4px ${nutricionBg}` }}>
                            {g.grupo}
                          </Text>
                          <Box flex="1" h="1px" bgGradient={`linear(to-l, transparent, ${nutricionTxt}66)`} />
                        </Flex>
                      )}
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
                        {g.items.map(({ tar, idx }) => (
                          <TarjetaNutri key={tar.key} titulo={tar.titulo} foto={tar.foto}
                                        onClick={() => setFichaIdx(idx)} />
                        ))}
                      </SimpleGrid>
                    </Box>
                  ))}
                </Flex>
              )}
            </Reveal>
          )}

        </Flex>
      </Flex>

      {/* Ficha tipo cómic de la tarjeta seleccionada. */}
      {n.tarjetas && fichaIdx !== null && (
        <NutrienteFichaModal tarjetas={n.tarjetas} index={fichaIdx}
                             onClose={() => setFichaIdx(null)} onSelect={setFichaIdx} />
      )}

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
