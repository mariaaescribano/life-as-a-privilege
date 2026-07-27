import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { NutrienteIlustracionModal } from "../../components/metodo/NutrienteIlustracionModal";
import { NutrienteCirculo } from "../../components/metodo/NutrienteCirculo";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
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
      color={nutricionTxt}
      fontFamily="'EB Garamond', serif"
      fontWeight="600"
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.03em"
      cursor="pointer"
      transition="all 0.18s"
      _hover={{ transform: "translateY(-1px)" }}
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
         // Mismo glow que la cabecera (halo blanco + menta con el tinte de la
         // disciplina), en vez del glow suave solo-color.
         boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${nutricionTxt}1a, 0 0 48px ${nutricionTxt}10`}
         {...rest}>
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
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!n) { navigate("/metodo/nutricion/nutrientes", { replace: true }); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }

        // Marcar este nutriente como REVISADO: el usuario está viendo sus subtipos.
        // Es el único sitio donde se marca (fuente única para principales y
        // secundarios), para que el tick de la rejilla signifique de verdad
        // «he visto sus subtipos» y no solo «he pulsado la tarjeta».
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const data = r.data?.data ?? {};
          const explorados: string[] = Array.isArray(data.nutrientes_explorados) ? data.nutrientes_explorados : [];
          if (n && !explorados.includes(n.key)) {
            const nuevos = [...explorados, n.key];
            void axios.patch(`${API_URL}/metodo-nutricion/${userId}`,
              { data: { ...data, nutrientes_explorados: nuevos, nutrientes_hecho: nuevos.length >= NUTRIENTES.length } },
              { headers: { Authorization: `Bearer ${token}` } }).catch(() => { /* se reintenta al volver a entrar */ });
          }
        } catch { /* sin fila todavía: se creará al guardar */ }

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

  if (loading) return <NutricionLoading />;
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

          {/* 2 · Box de lectura con la MISMA estética que las ilustraciones
              (ComicViewer en modo disciplina): foto grande `contain` con glow a la
              izquierda + botón «Ver ilustración» debajo; a la derecha el título y
              la descripción con su propio scroll. Sin rayita, líneas de luz
              arriba/abajo y la sombra de la disciplina, para que case 1:1 con el
              visor de ilustraciones. */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
            {/* Ancho = el del header (maxW 1000). Sin override de sombra: usa el
                glow suave por defecto de SeccionBox (el mismo discreto del header). */}
            <SeccionBox
              maxW="1000px"
              mx="auto"
            >
              {/* Líneas de luz (idénticas a las del visor de ilustraciones) */}
              <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
                   bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />
              <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={2}
                   bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

              <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "stretch" }}
                    justify="center" gap={{ base: 5, md: 10 }} px={{ base: 5, md: 10 }} py={{ base: 6, md: 9 }}
                    h={{ base: "auto", md: "420px" }}>

                {/* Izquierda: foto (contain + glow) + botón «Ver ilustración» debajo */}
                <Flex direction="column" gap={{ base: 4, md: 5 }} flexShrink={0} align="center" justify="center"
                      w={{ base: "100%", md: "280px" }} maxW={{ base: "240px", md: "280px" }}>
                  <Box w="100%" aspectRatio={1} position="relative"
                       filter={`drop-shadow(0 0 12px rgba(255,255,255,0.14)) drop-shadow(0 0 30px ${nutricionTxt}33)`}>
                    <Image src={encodeURI(n.img)} alt={n.label} w="100%" h="100%" objectFit="contain" borderRadius="lg"
                           fallback={<FotoPlaceholder label={n.label} color={n.color} />} />
                  </Box>

                  {comic && (
                    <Box as="button" onClick={() => setComicOpen(true)}
                         w="100%" position="relative" overflow="hidden"
                         display="inline-flex" alignItems="center" justifyContent="center" gap={2.5}
                         px={5} py={{ base: 2.5, md: 3 }} borderRadius="xl"
                         color={nutricionTxt}
                         bg="transparent"
                         border={`1.5px solid ${nutricionTxt}`}
                         fontWeight="800" fontSize={{ base: "sm", md: "md" }}
                         letterSpacing="0.08em" textTransform="uppercase" cursor="pointer"
                         boxShadow="none"
                         transition="all 0.25s ease"
                         _hover={{ bg: nutricionTxt, color: nutricionBg, transform: "translateY(-2px)", boxShadow: `0 8px 22px ${nutricionTxt}55` }}
                         _active={{ transform: "translateY(0)", boxShadow: `0 4px 14px ${nutricionTxt}44` }}>
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                           w={{ base: "20px", md: "22px" }} h={{ base: "20px", md: "22px" }} fill="currentColor" flexShrink={0}>
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                      </Box>
                      Ver ilustración
                    </Box>
                  )}
                </Flex>

                {/* Derecha: título (sin rayita) + descripción con scroll propio,
                    al mismo tamaño de letra que las ilustraciones. */}
                <Box flex="1" minW={0} w={{ base: "100%", md: "auto" }} alignSelf={{ base: "auto", md: "stretch" }}
                     display="flex" flexDirection="column" justifyContent="flex-start"
                     maxH={{ base: "none", md: "100%" }} overflowY={{ base: "visible", md: "auto" }} overflowX="hidden"
                     pr={{ base: 0, md: 3 }}
                     sx={{
                       "&::-webkit-scrollbar": { width: "6px" },
                       "&::-webkit-scrollbar-thumb": { background: `${nutricionTxt}55`, borderRadius: "3px" },
                       "&::-webkit-scrollbar-track": { background: "transparent" },
                       scrollbarWidth: "thin",
                       scrollbarColor: `${nutricionTxt}55 transparent`,
                     }}>
                  <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1.25"
                        mb={{ base: 3, md: 4 }} textAlign={{ base: "center", md: "left" }}>
                    {n.label}
                  </Text>
                  {(n.descripcion ?? [n.resumen]).map((parrafo, i) => (
                    <Text key={i} color={nutricionTxt} textAlign={{ base: "center", md: "left" }}
                          fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7" letterSpacing="0.02em"
                          fontWeight="400" mt={i === 0 ? 0 : { base: 4, md: 5 }}>
                      {parrafo}
                    </Text>
                  ))}
                </Box>
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
                      {hayVariosSubgrupos && g.grupo && (() => {
                        // «⚡ Electrolitos» → mandala (emoji) centrado en la línea,
                        // y el nombre en blanco, centrado, debajo de la separación.
                        const partes = g.grupo.split(" ");
                        const mandala = partes[0];
                        const nombre = partes.slice(1).join(" ");
                        return (
                          <Flex direction="column" align="center" gap={{ base: 1.5, md: 2 }} mb={{ base: 4, md: 5 }}>
                            <Flex align="center" gap={3} w="100%">
                              <Box flex="1" h="1px" bgGradient={`linear(to-r, transparent, ${nutricionTxt}66)`} />
                              <Box as="span" fontSize={{ base: "lg", md: "xl" }} lineHeight="1" flexShrink={0}>{mandala}</Box>
                              <Box flex="1" h="1px" bgGradient={`linear(to-l, transparent, ${nutricionTxt}66)`} />
                            </Flex>
                            <Text color="white" fontWeight="800" fontSize={{ base: "md", md: "lg" }}
                                  letterSpacing="0.08em" textTransform="uppercase" textAlign="center" whiteSpace="nowrap"
                                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                              {nombre}
                            </Text>
                          </Flex>
                        );
                      })()}
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
