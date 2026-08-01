import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { EstudioLayout } from "../../components/estudio/EstudioLayout";
import { BotonLecturaCarta } from "../../components/estudio/LecturaCartaModal";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { Glifo, GlifoSigno } from "../../components/metodo/Glifo";
import { CUERPOS } from "../../components/metodo/astrologiaData";
import { Float, Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { useImagesReady } from "../../hooks/useImagesReady";
import { LifeLoading } from "../../components/global/LifeLoading";
import { estadisticasDeEjemplo } from "../../data/estudioDemo";
import { AstrologiaIcon, astrologiaTxt } from "../../GlobalVariables";
import {
  getEstadisticas,
  getEstudioId,
  type EstadisticasEstudio,
  type ItemEstadistica,
} from "../../data/estudioApi";

/** Debajo de esta muestra, un porcentaje no significa gran cosa: se avisa. */
const MUESTRA_MINIMA = 5;

/**
 * Un TOTAL del estudio: un arquetipo en una de sus dos posiciones. No se enseña
 * pregunta a pregunta —eso es ruido—: se enseña cuánto conecta esta persona con
 * ese arquetipo y cuánto conecta la gente que lo tiene en el mismo sitio.
 */
interface Grupo {
  eje: "signo" | "casa";
  posicion: string;
  /** Cuántas preguntas tiene ese bloque y a cuántas dijo que sí. */
  preguntas: number;
  tuSi: number;
  /** % de «sí» suyo en ese bloque. */
  tuPorcentaje: number;
  /** % de «sí» de TODA la gente con esa misma posición (respuestas agregadas). */
  mediaPorcentaje: number;
  /** Cuánta gente hay en ese grupo (la pregunta más respondida del bloque). */
  personas: number;
}

/** Cómo se nombra el grupo con el que se compara: «Sol en Leo» o «Sol en la casa 5». */
const grupoDe = (label: string, g: Grupo) =>
  g.eje === "casa" ? `${label} en la casa ${g.posicion}` : `${label} en ${g.posicion}`;

/** El título del bloque dentro de la tarjeta del planeta. */
const tituloGrupo = (g: Grupo) => (g.eje === "casa" ? `En la casa ${g.posicion}` : `En ${g.posicion}`);

export default function EstudioResultados() {
  const navigate = useNavigate();
  const location = useLocation();
  const [datos, setDatos] = useState<EstadisticasEstudio | null>(null);
  const [cargando, setCargando] = useState(true);
  const fotosListas = useImagesReady([SPACE_IMG, "/img/icono/life.png"]);

  const params = new URLSearchParams(location.search);
  // Vista de ejemplo: /estudio/resultados?demo — datos inventados, para poder
  // ver la pantalla antes de que el estudio tenga muestra. Ver estudioDemo.ts.
  const esEjemplo = params.has("demo");
  // Vuelta desde Stripe tras pagar la lectura (el Payment Link redirige aquí).
  const vieneDePagar = params.get("lectura") === "ok";

  useEffect(() => {
    if (esEjemplo) {
      setDatos(estadisticasDeEjemplo());
      setCargando(false);
      return;
    }
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
  }, [navigate, esEjemplo]);

  /**
   * Las respuestas llegan pregunta a pregunta; aquí se convierten en TOTALES.
   * Se agrupan por (planeta, eje) —que es como se mide el estudio: por signo y
   * por casa— y de cada bloque salen dos cifras: cuánto ha dicho que sí esta
   * persona y cuánto dice que sí todo el mundo con esa misma posición.
   *
   * La media del grupo se calcula sumando síes y respuestas de todas sus
   * preguntas (no promediando porcentajes): así una pregunta con mucha muestra
   * pesa lo que le toca y no lo mismo que una con tres respuestas.
   */
  const porPlaneta = useMemo(() => {
    const bloques = new Map<string, ItemEstadistica[]>();
    for (const it of datos?.items ?? []) {
      const clave = `${it.planeta}|${it.eje}`;
      bloques.set(clave, [...(bloques.get(clave) ?? []), it]);
    }

    const grupoDeItems = (items: ItemEstadistica[]): Grupo => {
      const tuSi = items.filter((i) => i.respuesta).length;
      const si = items.reduce((n, i) => n + i.si, 0);
      const total = items.reduce((n, i) => n + i.total, 0);
      return {
        eje: items[0].eje,
        posicion: items[0].posicion,
        preguntas: items.length,
        tuSi,
        tuPorcentaje: Math.round((tuSi / items.length) * 100),
        mediaPorcentaje: total > 0 ? Math.round((si / total) * 100) : 0,
        // Cuánta gente hay en el grupo: la pregunta más contestada del bloque.
        personas: items.reduce((n, i) => Math.max(n, i.total), 0),
      };
    };

    // Se ordena como la carta (Ascendente, Sol, Luna…), no como venga de la BD,
    // y dentro de cada planeta primero el signo y después la casa.
    return CUERPOS
      .map((c) => {
        const grupos = (["signo", "casa"] as const)
          .map((eje) => bloques.get(`${c.key}|${eje}`))
          .filter((items): items is ItemEstadistica[] => !!items?.length)
          .map(grupoDeItems);
        return { cuerpo: c, grupos };
      })
      .filter((p) => p.grupos.length > 0);
  }, [datos]);

  if (cargando || !fotosListas) return <LifeLoading />;
  if (!datos) return null;

  return (
    <EstudioLayout>
      <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 7, md: 9 }}>
        {/* Chapa de «esto es un ejemplo»: discreta, pero suficiente para que unos
            números inventados no se puedan tomar por resultados del estudio. */}
        {esEjemplo && (
          <Box px={4} py={1.5} borderRadius="full" bg="rgba(255,255,255,0.14)"
               border="1px solid rgba(255,255,255,0.4)">
            <Text color="white" fontSize="xs" letterSpacing="0.18em" textTransform="uppercase" fontWeight="600">
              Vista de ejemplo · datos inventados
            </Text>
          </Box>
        )}

        {/* Vuelta de Stripe: lo primero que tiene que ver es que su pago llegó.
            No confirma nada por su cuenta —el cobro lo confirma Stripe—, solo
            recoge a quien vuelve para que no aterrice en una página muda. */}
        {vieneDePagar && (
          <Box w="100%" maxW="620px" px={{ base: 5, md: 7 }} py={{ base: 4, md: 5 }} borderRadius="xl"
               bg="rgba(255,255,255,0.1)" border="1px solid rgba(255,255,255,0.45)" textAlign="center">
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="700" mb={1}>
              Pago recibido ✓
            </Text>
            <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
              Gracias. Me pongo con tu carta y te la mando por correo en cuanto esté lista.
            </Text>
          </Box>
        )}

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
            {/* Nada de «somos N personas»: con muestra pequeña es un número que
                resta, y en la vista de ejemplo sería directamente falso. */}
            <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "md", md: "lg" }} maxW="680px" lineHeight="1.8">
              Gracias por haber participado
            </Text>
          </Flex>
        </Reveal>

        {/* La lectura, antes de los resultados: quien viene a por su carta la
            encuentra sin bajar, y quien viene a por los números sigue scroll. */}
        <Reveal direction="up" distance={14} duration={0.65} delay={0.12}>
          <BotonLecturaCarta
            email={datos.participante.email}
            datos={datos.participante.datos}
            participanteId={datos.participante.id}
            variant="destacado"
          />
        </Reveal>

        {/* ── RESULTADOS PLANETA A PLANETA ── */}
        <RevealStagger display="flex" flexDirection="column" gap={{ base: 5, md: 6 }} w="100%"
                       stagger={0.07} delayChildren={0.2}>
          {porPlaneta.map(({ cuerpo: c, grupos }) => (
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

                  {/* Un bloque por eje: el signo y la casa. Nada de pregunta a
                      pregunta — dos totales y su comparación, que es lo que el
                      estudio mide. */}
                  <Flex direction="column" gap={{ base: 5, md: 6 }}>
                    {grupos.map((g, i) => {
                      const hayMuestra = g.personas >= MUESTRA_MINIMA;
                      return (
                        <React.Fragment key={`${g.eje}-${g.posicion}`}>
                          {/* Raya entre el signo y la casa: fina, pero que se vea.
                              Va suelta entre bloques para que el hueco del `gap`
                              le quede igual arriba y abajo. */}
                          {i > 0 && <Box h="1px" bg={`${c.color}55`} />}
                        <Box>
                          <Text color={`${c.color}ee`} fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                                letterSpacing="0.04em" mb={3}
                                style={{ textShadow: "0 0 10px rgba(0,0,0,0.85)" }}>
                            {tituloGrupo(g)}
                          </Text>

                          {/* Tu barra */}
                          <Flex align="center" gap={3} mb={2}>
                            <Text color={`${c.color}bb`} fontSize="xs" fontWeight="700" letterSpacing="0.14em"
                                  textTransform="uppercase" minW="52px">
                              Tú
                            </Text>
                            <Box flex="1" h="10px" borderRadius="full" bg={`${c.color}1f`} overflow="hidden">
                              <Box h="100%" borderRadius="full" bg={c.color} w={`${g.tuPorcentaje}%`}
                                   boxShadow={`0 0 10px ${c.color}aa`} transition="width 0.6s ease" />
                            </Box>
                            <Text color={c.color} fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                                  minW="52px" textAlign="right" flexShrink={0}>
                              {g.tuPorcentaje}%
                            </Text>
                          </Flex>

                          {/* La del grupo, más apagada: es el fondo contra el que se lee la tuya */}
                          <Flex align="center" gap={3}>
                            <Text color={`${c.color}77`} fontSize="xs" fontWeight="600" letterSpacing="0.14em"
                                  textTransform="uppercase" minW="52px">
                              Media
                            </Text>
                            <Box flex="1" h="10px" borderRadius="full" bg={`${c.color}14`} overflow="hidden">
                              <Box h="100%" borderRadius="full" bg={`${c.color}66`}
                                   w={`${hayMuestra ? g.mediaPorcentaje : 0}%`} transition="width 0.6s ease" />
                            </Box>
                            <Text color={`${c.color}88`} fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                                  minW="52px" textAlign="right" flexShrink={0}>
                              {hayMuestra ? `${g.mediaPorcentaje}%` : "—"}
                            </Text>
                          </Flex>

                          {/* Sin cifras de muestra: el tamaño del grupo se nota en
                              si hay media o no, no hace falta cantarlo. */}
                          <Text color={`${c.color}aa`} fontSize="xs" fontStyle="italic" lineHeight="1.6" mt={2.5}>
                            {hayMuestra
                              ? `Las personas con ${grupoDe(c.label, g)} se reconocen en él un ${g.mediaPorcentaje}% de media.`
                              : `Todavía sois pocos con ${grupoDe(c.label, g)}: la media aún no dice mucho.`}
                          </Text>
                        </Box>
                        </React.Fragment>
                      );
                    })}
                  </Flex>
                </Box>
              </Box>
            </RevealItem>
          ))}
        </RevealStagger>

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
