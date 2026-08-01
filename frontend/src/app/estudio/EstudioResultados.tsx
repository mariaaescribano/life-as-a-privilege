import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { EstudioLayout } from "../../components/estudio/EstudioLayout";
import { BotonLecturaCarta } from "../../components/estudio/LecturaCartaModal";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { Glifo, GlifoSigno } from "../../components/metodo/Glifo";
import { CUERPOS } from "../../components/metodo/astrologiaData";
import { Float, Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { useImagesReady } from "../../hooks/useImagesReady";
import { LifeLoading } from "../../components/global/LifeLoading";
import { textoPregunta } from "../../data/estudioPreguntas";
import { AstrologiaIcon, astrologiaTxt } from "../../GlobalVariables";
import {
  getEstadisticas,
  getEstudioId,
  type EstadisticasEstudio,
  type ItemEstadistica,
} from "../../data/estudioApi";

/** Debajo de esta muestra, un porcentaje no significa gran cosa: se avisa. */
const MUESTRA_MINIMA = 5;

/** Cómo se nombra el grupo con el que se compara: «Sol en Leo» o «Sol en la casa 5». */
const grupoDe = (label: string, it: ItemEstadistica) =>
  it.eje === "casa" ? `${label} en la casa ${it.posicion}` : `${label} en ${it.posicion}`;

export default function EstudioResultados() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState<EstadisticasEstudio | null>(null);
  const [cargando, setCargando] = useState(true);
  const fotosListas = useImagesReady([SPACE_IMG, "/img/icono/life.png"]);

  useEffect(() => {
    const id = getEstudioId();
    if (!id) { navigate("/estudio/datos", { replace: true }); return; }
    (async () => {
      try {
        setDatos(await getEstadisticas(id));
      } catch {
        navigate("/estudio/datos", { replace: true });
      } finally {
        setCargando(false);
      }
    })();
  }, [navigate]);

  // Las respuestas llegan en una lista plana; se agrupan por planeta y se
  // ordenan como en la carta (Ascendente, Sol, Luna, …), no como vengan de la BD.
  const porPlaneta = useMemo(() => {
    const mapa = new Map<string, ItemEstadistica[]>();
    for (const it of datos?.items ?? []) {
      const lista = mapa.get(it.planeta) ?? [];
      lista.push(it);
      mapa.set(it.planeta, lista);
    }
    return CUERPOS
      .filter((c) => mapa.has(c.key))
      .map((c) => ({ cuerpo: c, items: mapa.get(c.key)! }));
  }, [datos]);

  if (cargando || !fotosListas) return <LifeLoading />;
  if (!datos) return null;

  const coincidencias = datos.items.filter(
    (i) => i.total >= MUESTRA_MINIMA && (i.respuesta ? i.porcentajeSi >= 50 : i.porcentajeSi < 50),
  ).length;
  const medibles = datos.items.filter((i) => i.total >= MUESTRA_MINIMA).length;

  return (
    <EstudioLayout>
      <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 7, md: 9 }}>
        {/* ── GRACIAS ── */}
        <Reveal direction="down" distance={18} duration={0.8}>
          <Flex direction="column" align="center" gap={4} textAlign="center">
            <Float amplitude={6} duration={6}>
              <Image src="/img/icono/life.png" alt="" h={{ base: "60px", md: "84px" }} objectFit="contain"
                     style={{ filter: "drop-shadow(0 0 12px rgba(255,255,255,0.6)) drop-shadow(0 0 28px rgba(180,255,245,0.3))" }} />
            </Float>
            <Text color="white" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700"
                  letterSpacing="0.06em" textTransform="uppercase" lineHeight="1.12"
                  textShadow="0 0 16px rgba(255,255,255,0.6), 0 0 38px rgba(180,255,245,0.32)">
              Gracias
            </Text>
            <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "md", md: "lg" }} maxW="680px" lineHeight="1.8">
              Tus respuestas ya forman parte del estudio. Ahora mismo somos{" "}
              <b>{datos.participantesTotales}</b>{" "}
              {datos.participantesTotales === 1 ? "persona" : "personas"} y cada carta nueva afina un
              poco más los números. Esto es lo que ha salido con lo tuyo:
            </Text>
            {medibles > 0 && (
              <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" maxW="620px">
                Has respondido igual que la mayoría de la gente con tu mismo signo en{" "}
                <b>{coincidencias} de {medibles}</b> preguntas con muestra suficiente.
              </Text>
            )}
          </Flex>
        </Reveal>

        {/* ── RESULTADOS PLANETA A PLANETA ── */}
        <RevealStagger display="flex" flexDirection="column" gap={{ base: 5, md: 6 }} w="100%"
                       stagger={0.07} delayChildren={0.2}>
          {porPlaneta.map(({ cuerpo: c, items }) => (
            <RevealItem key={c.key}>
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   boxShadow={`0 0 20px ${c.color}44, 0 0 52px ${c.color}22`}>
                <SpaceBg overlay="rgba(8,13,30,0.72)" />

                <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
                  <Flex align="center" gap={3} mb={4}>
                    <Flex w="44px" h="44px" borderRadius="full" flexShrink={0} align="center" justify="center"
                          bg={`${c.color}1f`} border={`1px solid ${c.color}55`}>
                      <Glifo symbol={c.symbol} color={c.color} size={28} />
                    </Flex>
                    <Box flex="1">
                      <Text color={c.color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.05em"
                            style={{ textShadow: `0 0 12px rgba(255,255,255,0.5), 0 0 28px ${c.color}66` }}>
                        {c.label}
                      </Text>
                      <Flex align="center" gap={1.5} mt={0.5}>
                        <GlifoSigno nombre={datos.participante.signos[c.key]} size={16} color={c.color} />
                        <Text color={`${c.color}cc`} fontSize="sm" fontStyle="italic">
                          en {datos.participante.signos[c.key]}
                          {datos.participante.casas?.[c.key] != null
                            ? ` · casa ${datos.participante.casas[c.key]}`
                            : ""}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>

                  <Flex direction="column" gap={{ base: 4, md: 5 }}>
                    {items.map((it) => (
                      <Box key={it.preguntaId}>
                        <Text color={`${c.color}ee`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" mb={2}
                              style={{ textShadow: "0 0 10px rgba(0,0,0,0.85)" }}>
                          {textoPregunta(it.preguntaId)}
                        </Text>

                        {/* Barra: proporción de «sí» dentro de su mismo signo */}
                        <Flex align="center" gap={3}>
                          <Box flex="1" h="8px" borderRadius="full" bg={`${c.color}1f`} overflow="hidden">
                            <Box h="100%" borderRadius="full" bg={c.color}
                                 w={`${it.porcentajeSi}%`} boxShadow={`0 0 10px ${c.color}88`}
                                 transition="width 0.5s ease" />
                          </Box>
                          <Text color={c.color} fontSize={{ base: "md", md: "lg" }} fontWeight="700" flexShrink={0}
                                minW="52px" textAlign="right">
                            {it.porcentajeSi}%
                          </Text>
                        </Flex>

                        <Flex justify="space-between" align="baseline" gap={3} mt={1.5} flexWrap="wrap">
                          <Text color={`${c.color}aa`} fontSize="xs" fontStyle="italic" lineHeight="1.5">
                            {it.total >= MUESTRA_MINIMA
                              ? `Las personas con ${grupoDe(c.label, it)} han respondido que sí un ${it.porcentajeSi}% (${it.si} de ${it.total}).`
                              : `Todavía sois pocos con ${grupoDe(c.label, it)} (${it.total}): el porcentaje aún no dice mucho.`}
                          </Text>
                          <Text color={c.color} fontSize="xs" fontWeight="700" letterSpacing="0.1em"
                                textTransform="uppercase" flexShrink={0}>
                            Tú: {it.respuesta ? "Sí" : "No"}
                          </Text>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              </Box>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* ── LA LECTURA ──
            Aquí es donde más sentido tiene ofrecerla: acaba de leer datos sobre
            sí mismo y quiere más. Va ANTES del enlace a El Mapa porque una de
            las dos opciones lleva justo ahí. */}
        <Reveal direction="up" distance={16} duration={0.7} delay={0.25}>
          <BotonLecturaCarta
            email={datos.participante.email}
            datos={datos.participante.datos}
            variant="destacado"
          />
        </Reveal>

        {/* ── EL PROYECTO ──
            De aquí sale el puente al Mapa: quien ha llegado hasta el final del
            estudio es justo quien puede querer recorrerlo entero. */}
        <Reveal direction="up" distance={20} duration={0.8} delay={0.3} w="100%">
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
               boxShadow={`0 0 20px rgba(255,255,255,0.16), 0 0 46px ${astrologiaTxt}26`}>
            <SpaceBg overlay="rgba(8,13,30,0.7)" />

            <Flex position="relative" zIndex={1} direction="column" align="center" gap={4} textAlign="center"
                  px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
              <AstrologiaIcon size={{ base: "36px", md: "44px" }} />
              <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "3xl" }} fontWeight="700"
                    letterSpacing="0.08em" textTransform="uppercase" lineHeight="1.2"
                    style={{ textShadow: `0 0 14px rgba(255,255,255,0.5), 0 0 34px ${astrologiaTxt}66` }}>
                Esto es solo el principio
              </Text>
              <Text color={`${astrologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" maxW="640px">
                El estudio nace de un proyecto más grande: <b>El Mapa</b>, un recorrido por ocho
                disciplinas —astrología, psicología, medicina china, fisiología, nutrición, cábala…—
                para entenderte de verdad y dejar de pelearte contigo.
              </Text>

              <Flex gap={3} direction={{ base: "column", sm: "row" }} w="100%" maxW="520px" mt={2}>
                <Box as="button" onClick={() => navigate("/elMetodo")} flex="1"
                     py={{ base: 3.5, md: 4 }} borderRadius="full"
                     bg={`${astrologiaTxt}22`} border={`1px solid ${astrologiaTxt}`} color={astrologiaTxt}
                     fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.12em"
                     textTransform="uppercase" cursor="pointer" transition="all 0.22s"
                     _hover={{ bg: `${astrologiaTxt}33`, boxShadow: `0 0 24px ${astrologiaTxt}55` }}>
                  Descubrir El Mapa
                </Box>
                <Box as="button" onClick={() => navigate("/")} flex="1"
                     py={{ base: 3.5, md: 4 }} borderRadius="full"
                     bg="transparent" border={`1px solid ${astrologiaTxt}55`} color={`${astrologiaTxt}cc`}
                     fontSize={{ base: "md", md: "lg" }} fontWeight="600" letterSpacing="0.12em"
                     textTransform="uppercase" cursor="pointer" transition="all 0.22s"
                     _hover={{ borderColor: astrologiaTxt, color: astrologiaTxt }}>
                  Ir a la web
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Reveal>

        <Reveal direction="up" distance={12} duration={0.6} delay={0.4}>
          <Flex direction="column" align="center" gap={2}>
            <Box as="button" onClick={() => navigate("/estudio/preguntas")}
                 color="rgba(255,255,255,0.72)" fontSize="sm" bg="transparent" border="none"
                 cursor="pointer" _hover={{ color: "white" }}>
              ← Volver a mis respuestas
            </Box>
            <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="600px">
              Los porcentajes se recalculan solos cada vez que alguien participa. Vuelve dentro de un
              tiempo: los tuyos habrán cambiado.
            </Text>
          </Flex>
        </Reveal>
      </Flex>
    </EstudioLayout>
  );
}
