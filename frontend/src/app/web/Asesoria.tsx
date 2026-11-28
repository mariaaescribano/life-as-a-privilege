import React, { useEffect, useState } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import TrasCabecera from "../../components/global/TrasCabecera";
import SiteFooter from "../../components/global/Footer";
import { Reveal } from "../../components/global/Reveal";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { focoBlanco } from "../../components/global/foco";
import {
  FONDO_PAGINA_TURQUESA as T,
  astrologiaNom, astrologiaBg, astrologiaTxt,
  neuropsicologiaNom, neuropsicologiaBg, neuropsicologiaTxt,
  fisiologiaNom, fisiologiaBg, fisiologiaTxt,
  culturaNom, culturaBg, culturaTxt,
} from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { MandalaTinte } from "../../components/global/MandalaTinte";
import { FlechaBonita } from "../../components/global/FlechaBonita";
import { glowHeader } from "../../components/metodo/FotoBox";
import { FormacionPopup } from "../../components/web/FormacionPopup";
import { FORMACION_PSICOLOGIA, FORMACION_FISIOLOGIA } from "../../data/formacionAsesoria";
import { useT } from "../../i18n";

/**
 * Asesoría 1:1. POR AHORA solo lleva el titular «Asesorías 1:1» con su frase de debajo y, en medio, el
 * botón «Pedir una sesión gratuita» (que lleva a /reservar-cita). Todo lo demás (foto, cajas, «¿Cómo trabajo?»,
 * mapa de disciplinas, opiniones, formulario…) está fuera: la página completa se guardó en
 * `Asesoria.completa.tsx.txt`.
 */
// Las cuatro cajas, una debajo de otra, cada una con el fondo de su disciplina. `enlace`: "opiniones" lleva
// a las experiencias; "formacion" abre el popup con la formación de esa disciplina.
const CAJAS = [
  { n: 1, nom: astrologiaNom, bg: astrologiaBg, txt: astrologiaTxt, ruta: "/disciplina/astrologia", parrafos: 2, enlace: "opiniones" as const },
  { n: 2, nom: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt, ruta: "/disciplina/psicologia", parrafos: 2, enlace: "formacion" as const, lista: FORMACION_PSICOLOGIA },
  { n: 3, nom: fisiologiaNom, bg: fisiologiaBg, txt: fisiologiaTxt, ruta: "/disciplina/fisiologia", parrafos: 1, enlace: "formacion" as const, lista: FORMACION_FISIOLOGIA },
  { n: 4, nom: culturaNom, bg: culturaBg, txt: culturaTxt, ruta: "/disciplina/filosofia", parrafos: 3, enlace: null },
];

const Asesoria = () => {
  const t = useT();
  const navigate = useNavigate();
  // Popup de formación abierto (el número de la caja) o ninguno.
  const [formacion, setFormacion] = useState<number | null>(null);

  // La cabecera arranca un instante después de montar, para que se vea entrar.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <WelcomeCabecera activo={mounted} titulo={t("asesoria.titulo")} subtitulo={t("asesoria.subtitulo")} mayusculas sinSeparador />

        <TrasCabecera>

        {/* ── La frase de la metodología y, debajo, las cuatro cajas ── */}
        <Box px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }}>
          <Reveal activo={mounted} direction="up" distance={16} duration={0.9}>
            <Text color={T} textAlign="center" maxW="1080px" mx="auto" fontSize={{ base: "lg", md: "2xl", lg: "3xl" }} lineHeight="1.5" fontStyle="italic" letterSpacing="0.04em">
              {t("asesoria.metodologia")}
            </Text>
          </Reveal>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }} maxW="1080px" mx="auto" mt={{ base: 8, md: 12 }}>
            {CAJAS.map((c, idx) => {
              const sombra = sombraTexto(c.nom, c.bg);
              const parrafos = Array.from({ length: c.parrafos }, (_, i) => t(`asesoria.caja${c.n}.p${i + 1}` as any));
              return (
                <Reveal key={c.n} inView direction="up" distance={26} duration={0.9} delay={(idx % 2) * 0.15} h="100%">
                  <Flex
                    direction="column"
                    h="100%"
                    position="relative"
                    overflow="hidden"
                    borderRadius="2xl"
                    border={`1.5px solid ${c.txt}`}
                    boxShadow={glowHeader(c.txt)}
                    color={c.txt}
                    px={{ base: 6, md: 9 }}
                    py={{ base: 7, md: 9 }}
                    transition="transform 0.35s cubic-bezier(0.22,1,0.36,1)"
                    _hover={{ transform: "translateY(-3px)" }}
                  >
                    <DisciplinaBgLayer nom={c.nom} borderRadius="2xl" />
                    <Flex position="relative" zIndex={1} direction="column" flex="1" textShadow={sombra}>
                      {/* Cabecera: el mandala, el título a la izquierda y una raya fina debajo */}
                      <Flex align="center" gap={3}>
                        <MandalaTinte h={{ base: "30px", md: "36px" }} color={c.txt} />
                        <Text fontWeight="700" fontSize={{ base: "2xl", md: "3xl" }} letterSpacing="0.03em" lineHeight="1.15">
                          {t(`asesoria.caja${c.n}.titulo` as any)}
                        </Text>
                      </Flex>
                      <Box h="1px" w="100%" bg={`${c.txt}88`} mt={{ base: 4, md: 5 }} mb={{ base: 4, md: 5 }} />

                      <Flex direction="column" gap={4} flex="1">
                        {parrafos.map((p, i) => (
                          <Text key={i} fontSize={{ base: "md", md: "lg" }} lineHeight="1.65">{p}</Text>
                        ))}
                      </Flex>

                      {/* Pie: el enlace a la izquierda y, a la derecha, el botón a la página de la disciplina */}
                      <Flex align="center" justify="space-between" gap={4} wrap="wrap" mt={{ base: 6, md: 8 }} pt={{ base: 4, md: 5 }} borderTop={`1px solid ${c.txt}44`}>
                        {c.enlace ? (
                          <Flex
                            as="button"
                            type="button"
                            onClick={() => (c.enlace === "opiniones" ? navigate("/opiniones") : setFormacion(c.n))}
                            title={t(`asesoria.caja${c.n}.enlace` as any)}
                            aria-label={t(`asesoria.caja${c.n}.enlace` as any)}
                            align="center"
                            justify="center"
                            w={{ base: "44px", md: "50px" }}
                            h={{ base: "44px", md: "50px" }}
                            borderRadius="full"
                            border={`1.5px solid ${c.txt}`}
                            bg="transparent"
                            color={c.txt}
                            transition="background 0.25s ease, transform 0.25s ease"
                            _hover={{ bg: `${c.txt}1f`, transform: "translateY(-2px)" }}
                            _focusVisible={focoBlanco}
                          >
                            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" w="24px" h="24px" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              {c.enlace === "opiniones" ? (
                                // Comentario: la burbuja de diálogo
                                <path d="M4 5.5h16v11H9.5L4.5 20v-3.5H4z" />
                              ) : (
                                // Medallita: el círculo y las dos cintas
                                <>
                                  <circle cx="12" cy="9" r="5" />
                                  <path d="M8.6 13.4 7 21l5-3 5 3-1.6-7.6" />
                                </>
                              )}
                            </Box>
                          </Flex>
                        ) : <Box />}
                        <Flex
                          as="button"
                          type="button"
                          role="group"
                          onClick={() => navigate(c.ruta)}
                          align="center"
                          gap={3}
                          px={{ base: 5, md: 6 }}
                          py="10px"
                          borderRadius="full"
                          border={`1.5px solid ${c.txt}`}
                          bg="transparent"
                          color={c.txt}
                          fontWeight="700"
                          fontSize={{ base: "md", md: "lg" }}
                          letterSpacing="0.06em"
                          textShadow={sombra}
                          transition="background 0.25s ease"
                          _hover={{ bg: `${c.txt}1f` }}
                          _focusVisible={focoBlanco}
                        >
                          {t(`asesoria.caja${c.n}.boton` as any)}
                          <FlechaBonita size="30px" grosor={2} transition="transform 0.3s ease" _groupHover={{ transform: "translateX(5px)" }} />
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Reveal>
              );
            })}
          </SimpleGrid>
        </Box>

        {CAJAS.filter((c) => c.lista).map((c) => (
          <FormacionPopup
            key={c.n}
            abierto={formacion === c.n}
            titulo={t(`asesoria.caja${c.n}.enlace` as any)}
            items={c.lista!}
            nom={c.nom}
            bg={c.bg}
            txt={c.txt}
            onCerrar={() => setFormacion(null)}
          />
        ))}

        {/* ── El botón, en medio ── */}
        <Flex justify="center" pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }} px={5}>
          <Reveal activo={mounted} direction="up" distance={16} duration={0.9} delay={0.2}>
            <Flex
              as="button"
              type="button"
              onClick={() => navigate("/reservar-cita")}
              align="center"
              px={{ base: 8, md: 10 }}
              py="14px"
              borderRadius="full"
              bg="transparent"
              border={`1.5px solid ${T}`}
              color={T}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.16em"
              textTransform="uppercase"
              whiteSpace="nowrap"
              cursor="pointer"
              transition="transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease"
              _hover={{ transform: "translateY(-2px)", bg: `${T}14` }}
              _active={{ transform: "translateY(0)" }}
              _focusVisible={focoBlanco}
            >
              <MandalaTinte h="26px" color={T} />
              {t("welcome.hero.pedirCita")}
            </Flex>
          </Reveal>
        </Flex>
        </TrasCabecera>
      </Box>

      <TrasCabecera><SiteFooter /></TrasCabecera>
    </Box>
  );
};

export default Asesoria;
