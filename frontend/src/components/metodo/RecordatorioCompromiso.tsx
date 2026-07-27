import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Heart } from "lucide-react";
import axios from "axios";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";

// Recordatorio del compromiso escrito en Psicología (los «nuevos patrones» que
// el usuario decidió vivir). Se trae a la página de Ayurveda «Tu día» para que
// no olvide a qué se comprometió mientras diseña su día ideal.
//
// Comportamiento: popup automático al entrar (una vez) + pastilla flotante
// «Mi compromiso» para reabrirlo cuando quiera.

const TINTA = neuropsicologiaTxt; // marrón tinta
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

interface Compromiso {
  titulo: string;
  patron: string;
}

export function RecordatorioCompromiso() {
  const [compromisos, setCompromisos] = useState<Compromiso[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    (async () => {
      try {
        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = psi.data?.data || {};
        const rel = Array.isArray(d.constelaciones) ? d.constelaciones : [];
        const lista: Compromiso[] = rel
          .map((c: any) => ({
            titulo: (c?.titulo || "").trim() || "Relación sin título",
            patron: (c?.nuevoPatron || "").trim(),
          }))
          .filter((x: Compromiso) => x.patron.length > 0);
        if (lista.length > 0) {
          setCompromisos(lista);
          setOpen(true); // popup automático al entrar
        }
      } catch {
        // silencioso: si no hay datos, simplemente no mostramos el recordatorio
      }
    })();
  }, []);

  if (compromisos.length === 0) return null;

  return (
    <>
      {/* Pastilla flotante para reabrir (apilada encima del botón de compañía) */}
      <Flex
        as="button"
        onClick={() => setOpen(true)}
        position="fixed"
        bottom={{ base: "72px", md: "92px" }}
        right={{ base: 4, md: 6 }}
        zIndex={30}
        align="center"
        gap={2}
        pl={3}
        pr={4}
        py={2}
        borderRadius="full"
        bg={neuropsicologiaBg}
        border={`1.5px solid ${TINTA}55`}
        boxShadow={`0 4px 18px rgba(0,0,0,0.25), 0 0 16px ${neuropsicologiaBg}88`}
        cursor="pointer"
        fontFamily="'EB Garamond', serif"
        transition="all 0.2s"
        _hover={{ transform: "translateY(-2px)", boxShadow: `0 6px 24px rgba(0,0,0,0.3), 0 0 22px ${neuropsicologiaBg}` }}
        aria-label="Ver mi compromiso"
      >
        <Heart size={16} color={TINTA} fill={TINTA} />
        <Text color={TINTA} fontWeight="700" fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.04em" whiteSpace="nowrap">
          Mi compromiso
        </Text>
      </Flex>

      {/* Popup */}
      <Modal isOpen={open} onClose={() => setOpen(false)} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(8px)" }} />
        <ModalContent
          bg={neuropsicologiaBg}
          border={`1px solid ${TINTA}44`}
          borderRadius="2xl"
          boxShadow={`0 16px 60px rgba(0,0,0,0.5), 0 0 40px ${neuropsicologiaBg}66`}
          mx={{ base: 4, md: 0 }}
          fontFamily="'EB Garamond', serif"
          overflow="hidden"
        >
          <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
          <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
            <Flex direction="column" gap={5}>
              <Flex direction="column" align="center" gap={2}>
                <Heart size={30} color={TINTA} fill={TINTA} />
                <Text
                  color={TINTA}
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                  textAlign="center"
                  lineHeight="1.25"
                  style={{ textShadow: INK_SHADOW }}
                >
                  No lo olvides
                </Text>
                <Text
                  color={`${TINTA}cc`}
                  fontSize={{ base: "sm", md: "md" }}
                  fontStyle="italic"
                  textAlign="center"
                  style={{ textShadow: INK_SHADOW }}
                >
                  Esto es lo que te comprometiste a vivir en Psicología. Que te acompañe mientras
                  diseñas tu día.
                </Text>
              </Flex>

              <Box h="1px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

              <Flex direction="column" gap={{ base: 3, md: 4 }}>
                {compromisos.map((x, i) => (
                  <Box
                    key={i}
                    position="relative"
                    borderRadius="xl"
                    overflow="hidden"
                    bg="rgba(255,251,243,0.72)"
                    border={`1px solid ${TINTA}33`}
                    pl={{ base: 5, md: 6 }}
                    pr={{ base: 4, md: 5 }}
                    py={{ base: 3.5, md: 4 }}
                  >
                    <Box position="absolute" left="0" top="0" bottom="0" w="4px" bg={TINTA} />
                    <Text
                      color={TINTA}
                      fontSize="2xs"
                      fontWeight="700"
                      letterSpacing="0.16em"
                      textTransform="uppercase"
                      opacity={0.7}
                      mb={1}
                    >
                      {x.titulo}
                    </Text>
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="600" fontStyle="italic" lineHeight="1.5">
                      «{x.patron}»
                    </Text>
                  </Box>
                ))}
              </Flex>

              <Flex justify="center" mt={1}>
                <Box
                  as="button"
                  onClick={() => setOpen(false)}
                  px={9}
                  py={2.5}
                  borderRadius="full"
                  bg={TINTA}
                  color={PAPEL}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="700"
                  letterSpacing="0.06em"
                  cursor="pointer"
                  boxShadow={`0 4px 20px ${TINTA}55`}
                  transition="all 0.2s"
                  _hover={{ transform: "translateY(-2px)", boxShadow: `0 8px 28px ${TINTA}77` }}
                >
                  Lo tengo presente
                </Box>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
