import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CabalaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import {
  CABALA_SENDEROS,
  NOMBRE_SEFIRA,
  senderoCompleto,
  senderosContenidoCompleto,
  puntuacionSendero,
  interpretacionSendero,
} from "../../components/metodo/cabalaSenderos";
import { CABALA_TOTAL_PAGINAS, CABALA_PAG } from "../../components/metodo/cabalaSefirot";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";
import { CAJA_GLOW, CAJA_GLOW_FUERTE } from "../../components/metodo/cabalaGlow";

// Sombra OSCURA (casi negra), no del color del fondo: da contraste real al
// texto ámbar (cabalaTxt) sobre el fondo marrón, para que se lea bien.
const INK_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.72), 0 0 22px rgba(0,0,0,0.5)";

// El glow vive en cabalaGlow.ts: TODO el recorrido comparte el halo del header.

// Box con la imagen de Cábala de fondo (letra dorada).
// `talCual`: la acuarela de Cábala se ve al 100 %, sin velo ni opacidad que la
// laven. El contraste del texto lo pone INK_SHADOW, no un velo encima de la foto.
const Caja = ({ children, destacado = false }: { children: React.ReactNode; destacado?: boolean }) => (
  <Box position="relative" overflow="hidden" w="100%" border={`1.5px solid ${destacado ? cabalaTxt : `${cabalaTxt}44`}`}
       borderRadius="2xl" boxShadow={destacado ? CAJA_GLOW_FUERTE : CAJA_GLOW}>
    <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" talCual />
    <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 6, md: 7 }}>
      {children}
    </Box>
  </Box>
);

export default function MetodoCabalaSenderosDiagnostico() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);
  const [senderos, setSenderos] = useState<Record<string, number[]>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }
        try {
          const res = await axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const s = res.data?.data?.senderos;
          // Puerta: no se puede entrar al Diagnóstico de senderos sin haber
          // rellenado el test de LOS 22 senderos. Si falta alguno, se vuelve a
          // «Los Senderos» para completarlos.
          if (!senderosContenidoCompleto(s)) {
            navigate("/metodo/cabala/senderos");
            return;
          }
          if (s && typeof s === "object") setSenderos(s);
        } catch { /* sin respuestas todavía */ }
      } catch {
        navigate("/metodo/cabala");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Resultado por sendero: completado, puntuación y banda (mayor puntuación =
  // más resistencia; bandIdx mayor = transición más bloqueada).
  const resultados = useMemo(() => {
    return CABALA_SENDEROS.map((s) => {
      const r = senderos[String(s.num)] ?? senderos[s.num as any];
      const completo = senderoCompleto(s, r);
      const total = completo ? puntuacionSendero(s, r!) : -1;
      const band = completo ? interpretacionSendero(s, total) : null;
      const bandIdx = band ? s.interpretaciones.findIndex((b) => b.min === band.min && b.max === band.max) : -1;
      return { s, completo, total, band, bandIdx };
    });
  }, [senderos]);

  const completados = resultados.filter((r) => r.completo).length;
  const todos = resultados.length;
  const todoCompleto = completados === todos;

  // Senderos prioritarios: los de mayor resistencia (bandIdx alto), más urgentes primero.
  const prioritarios = resultados
    .filter((r) => r.completo && r.bandIdx >= 2)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  if (loading) {
    return <CabalaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title="Diagnóstico de los Senderos"
              pageLabel={`${CABALA_PAG.senderosDiag}/${CABALA_TOTAL_PAGINAS}`}
              compact
              bgColor={`${cabalaBg}dd`}
              color={cabalaTxt}
              nom={cabalaNom}
              mb={0}
              prev={{ label: "← Los senderos", onClick: () => navigate("/metodo/cabala/senderos") }}
              extra={{ label: "Ilustraciones", onClick: () => setIlustracionesOpen(true)}}
              next={{ label: "Diagnóstico final →", onClick: () => navigate("/metodo/cabala/final") }}
            />
          </Reveal>

          <Reveal direction="up" distance={16} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            {/* El texto de debajo del header va SIEMPRE blanco y sin sombra: cae
                sobre el turquesa limpio, donde cabalaTxt (#bd814d) da 1,46:1 de
                contraste y el blanco 4,8:1. El ámbar de Cábala, solo dentro de
                las cajas. */}
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.85" maxW="660px">
              Cada sendero es una transición entre dos capacidades. Aquí se reúne el resultado de tus 22 tests
              para mostrar qué caminos fluyen y cuáles piden más trabajo.
            </Text>
          </Reveal>

          <Reveal direction="up" distance={14} delay={0.14} duration={0.5} display="flex" justifyContent="center">
            <Text color={`${cabalaTxt}cc`} fontSize="sm" letterSpacing="0.1em" textTransform="uppercase"
                  bg={`${cabalaBg}cc`} border={`1px solid ${cabalaTxt}44`} borderRadius="full" px={4} py={1.5}>
              {completados}/{todos} senderos completados
            </Text>
          </Reveal>

          {!todoCompleto ? (
            <Reveal direction="up" distance={16} delay={0.2} duration={0.6} w="100%">
              <Caja>
                <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} textAlign="center" style={{ textShadow: INK_SHADOW }}>
                  Aún faltan senderos por recorrer
                </Text>
                <Text color={`${cabalaTxt}bb`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" textAlign="center" style={{ textShadow: INK_SHADOW }}>
                  Completa el test de los 22 senderos para recibir tu diagnóstico final. Cada respuesta se guarda
                  automáticamente; puedes continuar cuando quieras.
                </Text>
              </Caja>
            </Reveal>
          ) : (
            <>
              {/* ── Senderos prioritarios ── */}
              <Reveal direction="up" distance={20} delay={0.18} duration={0.7} w="100%">
                {prioritarios.length > 0 ? (
                  <Caja destacado>
                    <Text color={`${cabalaTxt}99`} fontSize="xs" letterSpacing="0.16em" textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
                      Tus senderos prioritarios
                    </Text>
                    <Flex direction="column" gap={4}>
                      {prioritarios.map(({ s, band, total }) => (
                        <Box key={s.num}>
                          <Flex align="baseline" justify="space-between" gap={3} wrap="wrap" mb={1}>
                            <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
                              {s.orden} · {NOMBRE_SEFIRA[s.from]} → {NOMBRE_SEFIRA[s.to]}
                            </Text>
                            <Text color={`${cabalaTxt}88`} fontSize="xs" letterSpacing="0.08em" textTransform="uppercase">
                              {band?.titulo} · {total}
                            </Text>
                          </Flex>
                          <Text color={cabalaTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" style={{ textShadow: INK_SHADOW }}>
                            {band?.texto}
                          </Text>
                        </Box>
                      ))}
                    </Flex>
                  </Caja>
                ) : (
                  <Caja>
                    <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} textAlign="center" style={{ textShadow: INK_SHADOW }}>
                      Tus transiciones fluyen
                    </Text>
                    <Text color={`${cabalaTxt}bb`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" textAlign="center" style={{ textShadow: INK_SHADOW }}>
                      No aparece ningún sendero con una resistencia marcada. Sigue observándote: el equilibrio se
                      sostiene practicándolo.
                    </Text>
                  </Caja>
                )}
              </Reveal>

              {/* ── Todos los senderos ── */}
              <Reveal direction="up" distance={18} delay={0.24} duration={0.6} w="100%">
                <Caja>
                  <Text color={cabalaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.08em" mb={5} style={{ textShadow: INK_SHADOW }}>
                    Los 22 senderos
                  </Text>
                  <Flex direction="column" gap={3.5}>
                    {resultados.map(({ s, band, total }) => (
                      <Flex key={s.num} align="baseline" justify="space-between" gap={3} wrap="wrap"
                            borderBottom={`1px solid ${cabalaTxt}1c`} pb={3}>
                        <Text color={`${cabalaTxt}dd`} fontSize={{ base: "lg", md: "xl" }} style={{ textShadow: INK_SHADOW }}>
                          <Box as="span" color={`${cabalaTxt}77`} fontWeight="700" mr={1.5}>{s.orden}.</Box>
                          {s.letra} <Box as="span" color={`${cabalaTxt}77`}>· {NOMBRE_SEFIRA[s.from]} → {NOMBRE_SEFIRA[s.to]}</Box>
                        </Text>
                        {/* El veredicto de cada sendero sube con la lista: en `xs`
                            quedaba como una nota al pie al lado de una línea que
                            ahora es bastante mayor. */}
                        <Text color={band ? cabalaTxt : `${cabalaTxt}66`} fontSize={{ base: "sm", md: "md" }}
                              fontWeight={band ? "700" : "400"} letterSpacing="0.04em"
                              fontStyle={band ? "normal" : "italic"} style={{ textShadow: INK_SHADOW }}>
                          {band ? `${band.titulo} · ${total}` : "sin responder"}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Caja>
              </Reveal>
            </>
          )}
        </Flex>
      </Flex>

      <CabalaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />

      <IndiceCabala />
    </Box>
  );
}
