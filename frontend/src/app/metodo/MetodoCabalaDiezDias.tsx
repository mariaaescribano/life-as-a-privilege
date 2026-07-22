import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { cabalaSefirotMap, CABALA_SEFIROT_ORDEN, CABALA_TOTAL_PAGINAS, CABALA_PAG } from "../../components/metodo/cabalaSefirot";
import { CABALA_TEST } from "../../components/metodo/cabalaTest";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";

// Sombra OSCURA (casi negra), no del color del fondo: da contraste real al
// texto ámbar (cabalaTxt) sobre el fondo marrón, para que se lea bien.
const INK_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.72), 0 0 22px rgba(0,0,0,0.5)";
// Sombra del box = la MISMA que la del header (glow claro sobre el fondo de la
// disciplina), no la sombra oscura anterior.
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${cabalaTxt}1a, 0 0 48px ${cabalaTxt}10`;
// Fondo del box = imagen de Cábala (cabala.png) con un velo marrón oscuro
// (cabalaBg) que sube el contraste del texto ámbar sobre la acuarela (igual que
// los boxes del resto del recorrido de Cábala).
const CAJA_OVERLAY = `${cabalaBg}cc`;

// Un día por SEFIRÁ (las 10 clásicas, sin Da'at). Cada día toma el ejercicio de
// esa dimensión; si no tiene, se usan sus preguntas de reflexión.
const DIAS = CABALA_SEFIROT_ORDEN.filter((k) => k !== "daat").map((k) => cabalaSefirotMap[k]);

const Caja = ({ children, ...rest }: React.ComponentProps<typeof Box>) => (
  <Box position="relative" overflow="hidden" w="100%"
       borderRadius="2xl" boxShadow={CAJA_GLOW} {...rest}>
    <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" overlay={CAJA_OVERLAY} />
    <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 6, md: 7 }}>{children}</Box>
  </Box>
);

const ItemLista = ({ children }: { children: React.ReactNode }) => (
  <Flex align="flex-start" gap={3}>
    <Box flexShrink={0} mt="10px" w="6px" h="6px" borderRadius="full" bg={cabalaTxt} boxShadow={`0 0 8px ${cabalaTxt}aa`} />
    <Text color={`${cabalaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>{children}</Text>
  </Flex>
);

export default function MetodoCabalaDiezDias() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }
      } catch { navigate("/metodo/cabala"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title="10 días con tus dimensiones"
              pageLabel={`${CABALA_PAG.dias}/${CABALA_TOTAL_PAGINAS}`}
              compact bgColor={`${cabalaBg}dd`} color={cabalaTxt} nom={cabalaNom} mb={0}
              prev={{ label: "← Diagnóstico final", onClick: () => navigate("/metodo/cabala/final") }}
              extra={{ label: "El Árbol", onClick: () => navigate("/metodo/cabala/arbol") }}
              next={{ label: "Cursos →", onClick: () => navigate("/metodo/cabala/cursos") }}
            />
          </Reveal>

          <Reveal direction="up" distance={16} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.85" maxW="660px" style={{ textShadow: INK_SHADOW }}>
              Diez días, una dimensión cada día. Dedica la jornada a observar y practicar la sefirá que toca,
              apoyándote en su ejercicio. No se trata de hacerlo perfecto, sino de habitar cada energía un día entero.
            </Text>
          </Reveal>

          {/* Nota: la Cuenta del Omer (Sefirat HaOmer) */}
          <Reveal direction="up" distance={16} delay={0.14} duration={0.6} w="100%">
            <Caja>
              <Flex align="flex-start" gap={{ base: 3, md: 4 }}>
                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" flexShrink={0}
                     w={{ base: "26px", md: "30px" }} h={{ base: "26px", md: "30px" }} fill={cabalaTxt} mt="2px">
                  <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                </Box>
                <Box>
                  <Text color={cabalaTxt} fontWeight="800" fontSize={{ base: "lg", md: "xl" }} mb={1} style={{ textShadow: INK_SHADOW }}>
                    Una tradición: la Cuenta del Omer (Sefirat HaOmer)
                  </Text>
                  <Text color={`${cabalaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" style={{ textShadow: INK_SHADOW }}>
                    En la Cábala existe una práctica milenaria en la que, día a día, uno se centra en un atributo
                    concreto del alma: la <Box as="span" fontStyle="italic">Cuenta del Omer</Box> (Sefirat HaOmer).
                    Dura 49 días (siete semanas por siete sefirot) y cada jornada trabaja una combinación —por ejemplo,
                    «Gevurah dentro de Chesed»—. Este trabajo de 10 días es una adaptación más breve: una sefirá por día,
                    para que empieces a reconocer cada energía en tu Vida cotidiana.
                  </Text>
                </Box>
              </Flex>
            </Caja>
          </Reveal>

          {/* Los 10 días */}
          {DIAS.map((s, i) => {
            const etiqueta = CABALA_TEST[s.key]?.etiqueta ?? "";
            const ej = s.ejercicio;
            return (
              <Reveal key={s.key} direction="up" distance={20} delay={0.12} duration={0.6} w="100%" inView>
                <Caja>
                  <Flex align="center" gap={{ base: 3, md: 4 }} mb={4}>
                    <Flex flexShrink={0} align="center" justify="center" w={{ base: "44px", md: "50px" }} h={{ base: "44px", md: "50px" }}
                          borderRadius="full" bg={`${cabalaTxt}18`} border={`1.5px solid ${cabalaTxt}66`}
                          color={cabalaTxt} fontWeight="800" fontSize={{ base: "md", md: "lg" }}
                          boxShadow={`0 0 14px ${cabalaTxt}44`}>
                      {i + 1}
                    </Flex>
                    <Box>
                      <Text color={`${cabalaTxt}99`} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase" style={{ textShadow: INK_SHADOW }}>
                        Día {i + 1}{etiqueta ? ` · ${etiqueta}` : ""}
                      </Text>
                      <Text color={cabalaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.1"
                            style={{ textShadow: `0 0 16px ${cabalaTxt}44` }}>
                        {s.titulo}
                      </Text>
                    </Box>
                  </Flex>

                  {s.frase && (
                    <Text color={`${cabalaTxt}cc`} fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" mb={4} style={{ textShadow: INK_SHADOW }}>
                      {s.frase}
                    </Text>
                  )}

                  {/* Práctica del día: el ejercicio de la dimensión (o sus preguntas). */}
                  {ej ? (
                    <>
                      <Text color={cabalaTxt} fontWeight="700" fontSize={{ base: "lg", md: "xl" }} mb={1} style={{ textShadow: INK_SHADOW }}>{ej.titulo}</Text>
                      <Text color={`${cabalaTxt}bb`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" mb={3} style={{ textShadow: INK_SHADOW }}>{ej.intro}</Text>
                      {ej.columnas && ej.columnas.length > 0 && (
                        <Flex direction="column" gap={2} mb={ej.prompts?.length ? 3 : 0}>
                          {ej.columnas.map((c, ci) => (
                            <Text key={ci} color={`${cabalaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                              <Box as="span" fontWeight="700" textTransform="uppercase" letterSpacing="0.06em">{c.titulo}:</Box>{" "}
                              {c.descripcion}
                            </Text>
                          ))}
                        </Flex>
                      )}
                      {ej.promptsIntro && (
                        <Text color={`${cabalaTxt}aa`} fontStyle="italic" fontSize={{ base: "md", md: "lg" }} mb={2} style={{ textShadow: INK_SHADOW }}>{ej.promptsIntro}</Text>
                      )}
                      {ej.prompts && ej.prompts.length > 0 && (
                        <Flex direction="column" gap={2.5}>
                          {ej.prompts.map((p, pi) => <ItemLista key={pi}>{p}</ItemLista>)}
                        </Flex>
                      )}
                      {ej.footer && (
                        <Text color={`${cabalaTxt}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" mt={3} style={{ textShadow: INK_SHADOW }}>
                          {Array.isArray(ej.footer) ? ej.footer.join(" ") : ej.footer}
                        </Text>
                      )}
                    </>
                  ) : (
                    <>
                      <Text color={cabalaTxt} fontWeight="700" fontSize={{ base: "lg", md: "xl" }} mb={3} style={{ textShadow: INK_SHADOW }}>
                        Reflexiona a lo largo del día
                      </Text>
                      <Flex direction="column" gap={2.5}>
                        {s.preguntas.items.slice(0, 5).map((q, qi) => <ItemLista key={qi}>{q}</ItemLista>)}
                      </Flex>
                    </>
                  )}
                </Caja>
              </Reveal>
            );
          })}

          <Reveal direction="up" distance={16} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center" inView>
            <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" fontWeight="600" textAlign="center"
                  maxW="620px" lineHeight="1.7" mt={2} style={{ textShadow: INK_SHADOW }}>
              “Al décimo día, el Árbol ya no está fuera de ti: lo reconoces en tu forma de vivir.”
            </Text>
          </Reveal>
        </Flex>
      </Flex>

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />
      <IndiceCabala />
    </Box>
  );
}
