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
import { Reveal, Breathe } from "../../components/global/Reveal";
import { NutrienteIlustracionModal } from "../../components/metodo/NutrienteIlustracionModal";
import { NutrienteCirculo } from "../../components/metodo/NutrienteCirculo";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { glowSuave } from "../../components/metodo/FotoBox";
import { comicNutrienteByKey } from "../../components/metodo/comicsNutrientes";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { NUTRIENTES, rutaListaNutriente, type Nutriente, type NutrienteTarjeta } from "../../hardCoded/espacio/NutrientesNutricion";

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

// Botón «← Volver» en la gama de Nutrición (verde), bajo el header. Lleva la
// foto de la disciplina (nutri.png) de fondo, con un velo claro para que el
// texto verde oscuro (nutricionTxt) se lea.
function VolverNutri({ onClick }: { onClick: () => void }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      alignSelf="flex-start"
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={{ base: 4, md: 5 }}
      py={{ base: 2, md: 2.5 }}
      borderRadius="full"
      border={`1px solid ${nutricionTxt}55`}
      color={nutricionTxt}
      fontFamily="'EB Garamond', serif"
      fontWeight="600"
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.03em"
      cursor="pointer"
      boxShadow="0 2px 12px rgba(0,0,0,0.2)"
      transition="all 0.18s"
      _hover={{ borderColor: nutricionTxt, transform: "translateY(-1px)" }}
    >
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="full" overlay={`${nutricionBg}55`} />
      <Box as="span" position="relative" zIndex={1} display="inline-flex" alignItems="center" gap={2}>
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
             w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill="currentColor" flexShrink={0}>
          <path d="M480-160 160-480l320-320 56 57-223 223h487v80H313l224 224-57 56Z" />
        </Box>
        Volver
      </Box>
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
         boxShadow={glowSuave(nutricionTxt)} {...rest}>
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
  const [comicOpen, setComicOpen] = useState(false); // ilustración (cómic) del grupo

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
  const esSecundario = rutaListaNutriente(n.key).endsWith("secundarios");

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
              title={esSecundario ? "Nutrientes secundarios" : "Los nutrientes"}
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
            <VolverNutri onClick={() => navigate(rutaListaNutriente(n.key))} />
          </Reveal>

          {/* 2 · Box grande: a la IZQUIERDA la foto del grupo con el botón del
              cómic justo debajo; a la DERECHA el título y la descripción, que se
              lee al tamaño de las ilustraciones y con scroll vertical propio. */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.6} w="100%">
            <SeccionBox>
              <Flex direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "flex-start" }}
                    gap={{ base: 5, md: 8 }} p={{ base: 5, md: 8 }}>

                {/* Izquierda: foto + botón «Ver ilustración» debajo */}
                <Flex direction="column" gap={{ base: 4, md: 5 }} flexShrink={0}
                      w={{ base: "100%", md: "300px" }} align="center">
                  <Breathe scale={0.02} duration={6.5} w="100%" aspectRatio={1}
                       borderRadius="xl" overflow="hidden" bg={`${n.color}22`}
                       boxShadow="0 4px 18px rgba(0,0,0,0.25)">
                    <Image src={encodeURI(n.img)} alt={n.label} w="100%" h="100%" objectFit="cover"
                           fallback={<FotoPlaceholder label={n.label} color={n.color} />} />
                  </Breathe>

                  {comic && (
                    <Box as="button" onClick={() => setComicOpen(true)}
                         w="100%" position="relative" overflow="hidden"
                         display="inline-flex" alignItems="center" justifyContent="center" gap={2.5}
                         px={5} py={{ base: 2.5, md: 3 }} borderRadius="xl"
                         color={nutricionBg}
                         bgGradient={`linear(135deg, ${nutricionTxt}, ${n.color})`}
                         fontWeight="800" fontSize={{ base: "sm", md: "md" }}
                         letterSpacing="0.08em" textTransform="uppercase" cursor="pointer"
                         boxShadow={`0 6px 20px ${nutricionTxt}55, inset 0 1px 0 rgba(255,255,255,0.28)`}
                         transition="all 0.2s"
                         _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px ${nutricionTxt}88, inset 0 1px 0 rgba(255,255,255,0.35)` }}
                         _active={{ transform: "translateY(0)" }}>
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                           w={{ base: "20px", md: "22px" }} h={{ base: "20px", md: "22px" }} fill="currentColor" flexShrink={0}>
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                      </Box>
                      Ver ilustración
                    </Box>
                  )}
                </Flex>

                {/* Derecha: título + descripción con scroll (tamaño ilustraciones) */}
                <Flex direction="column" gap={3} flex="1" minW={0} align="flex-start">
                  <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" lineHeight="1.1">
                    {n.label}
                  </Text>
                  <Box h="2px" w="64px" bgGradient={`linear(to-r, ${n.color}, transparent)`} />

                  <Box w="100%" overflowY="auto" maxH={{ base: "280px", md: "340px" }} pr={{ base: 1, md: 3 }}
                       sx={{
                         "&::-webkit-scrollbar": { width: "6px" },
                         "&::-webkit-scrollbar-thumb": { background: `${nutricionTxt}44`, borderRadius: "3px" },
                         "&::-webkit-scrollbar-track": { background: "transparent" },
                       }}>
                    {(n.descripcion ?? [n.resumen]).map((parrafo, i) => (
                      <Text key={i} color={nutricionTxt} textAlign="left"
                            fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1.9" letterSpacing="0.02em"
                            fontWeight="400" mt={i === 0 ? 0 : { base: 4, md: 5 }}>
                        {parrafo}
                      </Text>
                    ))}
                  </Box>
                </Flex>
              </Flex>
            </SeccionBox>
          </Reveal>

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
                          <TarjetaNutri key={tar.key} titulo={tar.titulo} foto={tar.foto} numero={tar.numero}
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

      {/* Ilustración (cómic) del grupo, a pantalla completa (misma estructura que
          las ilustraciones de otras disciplinas). */}
      {comic && (
        <NutrienteIlustracionModal isOpen={comicOpen} vinetas={comic} onClose={() => setComicOpen(false)} />
      )}

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
