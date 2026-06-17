import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Curso } from "../../hardCoded/cursos";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

/**
 * Tarjeta de curso "detallada" — antes era el contenido de un popup; ahora la
 * tarjeta ES el detalle completo y vive directamente en la página. Empieza por
 * la foto (sin título encima), seguida de descripción, lecciones desplegables y
 * precio + botón. Al pulsar "Acceder" se entra directamente al curso (o a
 * Stripe si es de pago). Sin popup intermedio.
 */
export function CursoCardDetalle({
  curso,
  color,
  bgColor,
  nom,
}: {
  curso: Curso;
  color: string;
  bgColor: string;
  nom: string;
}) {
  const navigate = useNavigate();
  const [leccionesOpen, setLeccionesOpen] = useState(false);

  const handleAcceder = () => {
    if (curso.precio === null) navigate(curso.cursoLink);
    else window.open(STRIPE_PAYMENT_LINK, "_blank");
  };
  const formatPrecio = (precio: number | null) =>
    precio === null ? "Gratis" : `${precio.toFixed(2).replace(".", ",")} €`;

  const nLecciones =
    curso.modulos?.reduce((a, m) => a + m.submodules.length, 0) ??
    curso.numLecciones ?? 0;
  const nEjercicios = (curso.modulos ?? []).reduce(
    (a, m) => a + m.submodules.reduce((b, s) => b + (s.tipo === "test" ? (s.ejercicios?.length ?? 0) : 0), 0),
    0,
  );
  const tShadow = `0 1px 4px ${bgColor}, 0 0 10px ${bgColor}, 0 0 22px ${bgColor}`;

  return (
    <Flex
      direction="column"
      position="relative"
      w="100%"
      h="100%"
      borderRadius="2xl"
      overflow="hidden"
      bg={bgColor}
      boxShadow={`0 0 18px rgba(255,255,255,0.15), 0 0 42px rgba(180,255,245,0.1), 0 0 24px ${color}40, 0 0 60px ${color}22`}
    >
      {/* Fondo propio de la disciplina (con su color real, sin velo) */}
      {hasDisciplinaBg(nom) && <DisciplinaBgLayer nom={nom} borderRadius="2xl" />}

      {/* Contenido */}
      <Flex direction="column" position="relative" zIndex={1} h="100%" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }} gap={{ base: 3, md: 3 }}>
        {/* Foto del curso (16:9) — protagonista de la tarjeta */}
        <Box
          borderRadius="xl"
          overflow="hidden"
          w="100%"
          sx={{ aspectRatio: "16 / 9" }}
          border={`1px solid ${color}44`}
        >
          <Image src={curso.foto} alt={curso.titulo} w="100%" h="100%" objectFit="cover" display="block" />
        </Box>

        {/* Descripción (secundaria) */}
        <Text
          color={color}
          fontSize={{ base: "xs", md: "sm" }}
          lineHeight={{ base: "1.6", md: "1.55" }}
          letterSpacing="0.01em"
          textAlign="center"
          opacity={0.9}
          style={{ textShadow: tShadow }}
        >
          {curso.descripcion}
        </Text>

        {/* N lecciones — abre un popup discreto con módulos y submódulos */}
        <Box>
          <Flex
            as="button"
            w="100%"
            align="center"
            justify="center"
            px={{ base: 4, md: 4 }}
            py={{ base: 2, md: 2.5 }}
            borderRadius="lg"
            bg="rgba(255,255,255,0.08)"
            border={`1px solid ${color}33`}
            sx={{ backdropFilter: "blur(8px)" }}
            cursor="pointer"
            onClick={() => setLeccionesOpen(true)}
            transition="background 0.2s"
            _hover={{ bg: "rgba(255,255,255,0.14)" }}
          >
            <Text color={color} fontSize={{ base: "xs", md: "sm" }} fontWeight="600" letterSpacing="0.03em" opacity={0.9} style={{ textShadow: tShadow }}>
              {nLecciones} {nLecciones === 1 ? "lección" : "lecciones"}
              {nEjercicios > 0 && ` · ${nEjercicios} ${nEjercicios === 1 ? "ejercicio" : "ejercicios"}`}
            </Text>
          </Flex>
        </Box>

        {/* Popup discreto de contenido — solo para ubicar al usuario. Se cierra
            fácilmente (botón ✕, click fuera o Esc). */}
        <Modal isOpen={leccionesOpen} onClose={() => setLeccionesOpen(false)} isCentered scrollBehavior="inside" size={{ base: "xs", md: "md" }}>
          <ModalOverlay bg="rgba(0,0,0,0.45)" sx={{ backdropFilter: "blur(2px)" }} />
          <ModalContent
            bg={bgColor}
            borderRadius="2xl"
            border={`1px solid ${color}44`}
            boxShadow={`0 10px 40px rgba(0,0,0,0.45), 0 0 24px ${color}33`}
            overflow="hidden"
            maxH="80vh"
            mx={4}
          >
            {hasDisciplinaBg(nom) && <DisciplinaBgLayer nom={nom} borderRadius="2xl" />}
            <ModalCloseButton color={color} zIndex={2} />

            {/* Cabecera fija: título + minidescripción (1 frase) y separación horizontal */}
            <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} pt={{ base: 5, md: 6 }} pb={3}>
              <Text color={color} fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.12em" textTransform="uppercase" pr={6} style={{ textShadow: tShadow }}>
                Contenido del curso
              </Text>
              <Text color={color} opacity={0.8} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" lineHeight="1.5" mt={2} pr={6} style={{ textShadow: tShadow }}>
                {curso.descripcionContenido || curso.descripcion}
              </Text>
            </Box>
            <Divider position="relative" zIndex={1} borderColor={`${color}33`} opacity={1} />

            {/* Cuerpo con scroll vertical */}
            <ModalBody
              position="relative"
              zIndex={1}
              px={{ base: 5, md: 7 }}
              py={{ base: 5, md: 6 }}
              sx={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: `${color}44`, borderRadius: "9999px" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
              }}
            >
              {(curso.modulos ?? []).map((mod, mi) => (
                <Box key={mi} mb={mi < (curso.modulos!.length - 1) ? 4 : 0}>
                  <Text color={color} fontWeight="700" fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.06em" textTransform="uppercase" mb={2} opacity={0.95} style={{ textShadow: tShadow }}>
                    {mod.title}
                  </Text>
                  <Flex direction="column" gap={1.5} pl={3}>
                    {mod.submodules.map((sub, si) => (
                      <Flex key={si} align="center" gap={2.5}>
                        <Box w="4px" h="4px" borderRadius="full" bg={color} flexShrink={0} opacity={0.8} />
                        <Text color={color} opacity={0.85} fontSize={{ base: "xs", md: "sm" }} lineHeight="1.5" style={{ textShadow: tShadow }}>{sub.nom}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              ))}
              {(!curso.modulos || curso.modulos.length === 0) && (
                <Text color={color} opacity={0.8} fontStyle="italic" fontSize="xs" style={{ textShadow: tShadow }}>Próximamente.</Text>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Precio (izquierda) + botón Comenzar/Pagar (derecha) — secundarios,
            compactos: el protagonista es la foto. */}
        <Flex align="center" justify="space-between" gap={3} mt="auto" pt={1} flexWrap="wrap">
          <Text
            color={color}
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="700"
            lineHeight="1"
            style={{ textShadow: tShadow }}
          >
            {formatPrecio(curso.precio)}
          </Text>
          <Box
            as="button"
            onClick={handleAcceder}
            color={bgColor}
            bg={color}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.06em"
            px={{ base: 5, md: 6 }}
            py="9px"
            borderRadius="full"
            cursor="pointer"
            flexShrink={0}
            _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
            transition="all 0.2s"
            boxShadow={`0 3px 14px rgba(0,0,0,0.35), 0 0 16px ${color}55`}
          >
            {curso.precio === null ? "Comenzar →" : "Pagar →"}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default CursoCardDetalle;
