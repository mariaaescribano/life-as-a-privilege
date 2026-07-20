import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box, Flex, Text, Image, Collapse,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Curso } from "../../hardCoded/cursos";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

// Título del popup: SIEMPRE en una sola línea; si no cabe, reduce la fuente.
function PopupTitle({ text, color, tShadow }: { text: string; color: string; tShadow: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [fontPx, setFontPx] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const base = window.innerWidth >= 768 ? 30 : 22;
      el.style.fontSize = `${base}px`;
      const available = el.clientWidth;
      const needed = el.scrollWidth;
      if (needed > available && available > 0) {
        setFontPx(Math.max(13, Math.floor(base * (available / needed))));
      } else {
        setFontPx(base);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);
  return (
    <Text
      ref={ref}
      color={color}
      fontSize={fontPx ? `${fontPx}px` : { base: "xl", md: "3xl" }}
      fontWeight="700"
      letterSpacing="0.04em"
      lineHeight="1.25"
      textAlign="center"
      whiteSpace="nowrap"
      mt={{ base: "22px", md: "14px" }}
      mb={{ base: 4, md: 3 }}
      style={{ textShadow: tShadow }}
    >
      {text}
    </Text>
  );
}

/**
 * Popup de detalle de un curso (título, foto, descripción, lecciones/ejercicios
 * y botón Acceder/Pagar). Reutilizable: se abre pasando `curso` (null = cerrado).
 */
export function CursoDetalleModal({
  curso,
  color,
  bgColor,
  nom,
  onClose,
}: {
  curso: Curso | null;
  color: string;
  bgColor: string;
  nom: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [leccionesOpen, setLeccionesOpen] = useState(false);
  // Al abrir/cambiar de curso, el desplegable de lecciones empieza cerrado.
  useEffect(() => { setLeccionesOpen(false); }, [curso]);

  const handleAcceder = (c: Curso) => {
    if (c.precio === null) navigate(c.cursoLink);
    else window.open(STRIPE_PAYMENT_LINK, "_blank");
  };
  const formatPrecio = (precio: number | null) =>
    precio === null ? "Acceso Libre" : `${precio.toFixed(2).replace(".", ",")} €`;

  return (
    <Modal isOpen={curso !== null} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="rgba(0,0,0,0.86)" sx={{ backdropFilter: "blur(8px)" }} />
      <ModalContent
        bg={bgColor}
        border={`1px solid ${color}77`}
        borderRadius="2xl"
        overflow="hidden"
        position="relative"
        boxShadow={`0 0 50px ${color}66, 0 0 120px rgba(255,255,255,0.16), 0 22px 70px rgba(0,0,0,0.7)`}
        mx={{ base: 4, md: 0 }}
        fontFamily="'EB Garamond', serif"
      >
        {hasDisciplinaBg(nom) && <DisciplinaBgLayer nom={nom} borderRadius="2xl" />}

        <ModalCloseButton color={color} top={4} right={4} zIndex={2} />
        <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 7 }}>
          {curso && (() => {
            const nLecciones =
              curso.modulos?.reduce((a, m) => a + m.submodules.length, 0) ??
              curso.numLecciones ?? 0;
            const nEjercicios = (curso.modulos ?? []).reduce(
              (a, m) => a + m.submodules.reduce((b, s) => b + (s.tipo === "test" ? (s.ejercicios?.length ?? 0) : 0), 0),
              0,
            );
            const tShadow = `0 1px 4px ${bgColor}, 0 0 10px ${bgColor}, 0 0 22px ${bgColor}`;
            return (
              <Box>
                {/* Título */}
                <PopupTitle text={curso.titulo} color={color} tShadow={tShadow} />

                {/* Raya horizontal de separación */}
                <Box h="2px" mb={{ base: 6, md: 4 }} borderRadius="full" opacity={0.75}
                     bgGradient={`linear(to-r, transparent, ${color}, transparent)`} />

                {/* Foto del curso (16:9) */}
                <Box
                  borderRadius="xl"
                  overflow="hidden"
                  mb={{ base: 6, md: 4 }}
                  w="100%"
                  sx={{ aspectRatio: "16 / 9" }}
                  border={`1px solid ${color}44`}
                >
                  <Image src={curso.foto} alt={curso.titulo} w="100%" h="100%" objectFit="cover" display="block" />
                </Box>

                {/* Descripción */}
                <Text
                  color={color}
                  fontSize={{ base: "md", md: "md" }}
                  lineHeight={{ base: "1.85", md: "1.7" }}
                  letterSpacing="0.02em"
                  textAlign="center"
                  mb={{ base: 6, md: 4 }}
                  opacity={0.95}
                  style={{ textShadow: tShadow }}
                >
                  {curso.descripcion}
                </Text>

                {/* N lecciones — desplegable con módulos y submódulos */}
                <Box mb={{ base: 6, md: 4 }}>
                  <Flex
                    as="button"
                    w="100%"
                    align="center"
                    justify="space-between"
                    px={{ base: 5, md: 6 }}
                    py={4}
                    borderTopRadius="xl"
                    borderBottomRadius={leccionesOpen ? "0" : "xl"}
                    bg="rgba(255,255,255,0.1)"
                    border={`1px solid ${color}44`}
                    sx={{ backdropFilter: "blur(8px)" }}
                    cursor="pointer"
                    onClick={() => setLeccionesOpen((o) => !o)}
                    transition="border-radius 0.2s, background 0.2s"
                    _hover={{ bg: "rgba(255,255,255,0.16)" }}
                  >
                    <Text color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em" style={{ textShadow: tShadow }}>
                      {nLecciones} {nLecciones === 1 ? "lección" : "lecciones"}
                      {nEjercicios > 0 && ` · ${nEjercicios} ${nEjercicios === 1 ? "ejercicio" : "ejercicios"}`}
                    </Text>
                    <Text color={color} fontSize="lg" transform={leccionesOpen ? "rotate(180deg)" : "rotate(0deg)"} transition="transform 0.25s">
                      ▾
                    </Text>
                  </Flex>

                  <Collapse in={leccionesOpen} animateOpacity>
                    <Box
                      px={{ base: 5, md: 6 }}
                      py={4}
                      bg="rgba(255,255,255,0.06)"
                      border={`1px solid ${color}44`}
                      borderTop="none"
                      borderBottomRadius="xl"
                      sx={{ backdropFilter: "blur(8px)" }}
                    >
                      {(curso.modulos ?? []).map((mod, mi) => (
                        <Box key={mi} mb={mi < (curso.modulos!.length - 1) ? 4 : 0}>
                          <Text color={color} fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.06em" textTransform="uppercase" mb={2} style={{ textShadow: tShadow }}>
                            {mod.title}
                          </Text>
                          <Flex direction="column" gap={1.5} pl={3}>
                            {mod.submodules.map((sub, si) => (
                              <Flex key={si} align="center" gap={2}>
                                <Box w="5px" h="5px" borderRadius="full" bg={color} flexShrink={0} />
                                <Text color={color} opacity={0.92} fontSize={{ base: "sm", md: "md" }} lineHeight="1.5" style={{ textShadow: tShadow }}>{sub.nom}</Text>
                              </Flex>
                            ))}
                          </Flex>
                        </Box>
                      ))}
                      {(!curso.modulos || curso.modulos.length === 0) && (
                        <Text color={color} opacity={0.8} fontStyle="italic" fontSize="sm" style={{ textShadow: tShadow }}>Próximamente.</Text>
                      )}
                    </Box>
                  </Collapse>
                </Box>

                {/* Precio + Botón */}
                <Flex
                  align="center"
                  justify="space-between"
                  pt={2}
                  mb={{ base: 4, md: 1 }}
                  gap={4}
                  flexWrap="wrap"
                >
                  <Text
                    color={color}
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="700"
                    lineHeight="1"
                    style={{ textShadow: tShadow }}
                  >
                    {formatPrecio(curso.precio)}
                  </Text>

                  <Box
                    as="button"
                    onClick={() => handleAcceder(curso)}
                    color={bgColor}
                    bg={color}
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "lg", md: "xl" }}
                    letterSpacing="0.08em"
                    px={{ base: 8, md: 10 }}
                    py="13px"
                    borderRadius="full"
                    cursor="pointer"
                    _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                    boxShadow={`0 4px 18px rgba(0,0,0,0.4), 0 0 22px ${color}66`}
                  >
                    {curso.precio === null ? "Acceder →" : "Pagar →"}
                  </Box>
                </Flex>
              </Box>
            );
          })()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CursoDetalleModal;
