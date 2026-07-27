import React from "react";
import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { DISCIPLINAS_CURSO } from "../../data/disciplinasCurso";
import { astrologiaBg, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";

interface PagoExitoModalProps {
  isOpen: boolean;
  onAceptar: () => void;
  /** Título del modal. Por defecto, el de Astrología (compatibilidad). */
  titulo?: string;
  /** Mensaje bajo el título. */
  mensaje?: string;
  /** Disciplina: fija el fondo inmersivo (imagen propia vía DisciplinaBgLayer). */
  nom?: string;
  /** Color del texto/acentos de la disciplina (disciplinaTxt). */
  txtColor?: string;
  /** Color base de la disciplina (disciplinaBg): halo del texto + letra del botón. */
  bgColor?: string;
}

export function PagoExitoModal({
  isOpen,
  onAceptar,
  titulo = "Pago de Astrología realizado",
  mensaje = "Ya puedes acceder.",
  nom = astrologiaNom,
  txtColor = astrologiaTxt,
  bgColor = astrologiaBg,
}: PagoExitoModalProps) {
  // Halo del color base de la disciplina para que el texto claro se lea sobre
  // la imagen de fondo (inmersivo).
  const ink = `0 1px 3px ${bgColor}f2, 0 0 10px ${bgColor}cc, 0 2px 18px ${bgColor}99`;
  // Icono de la disciplina (su fill ya es el color Txt de la disciplina), en vez
  // del mandala blanco, que desentonaba sobre el fondo de color.
  const Icon = DISCIPLINAS_CURSO.find((d) => d.nom === nom)?.Icon;
  return (
    <Modal isOpen={isOpen} onClose={onAceptar} size="lg" isCentered closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay bg="rgba(0,0,0,0.6)" sx={{ backdropFilter: "blur(9px)", WebkitBackdropFilter: "blur(9px)" }} />
      <ModalContent
        position="relative"
        bg={bgColor}
        border={`1px solid ${txtColor}55`}
        borderRadius="2xl"
        boxShadow={`0 16px 60px rgba(0,0,0,0.5), 0 0 40px ${txtColor}22`}
        mx={{ base: 4, md: 0 }}
        fontFamily="'EB Garamond', serif"
        overflow="hidden"
      >
        {/* Fondo inmersivo de la disciplina: su imagen tal cual, SIN difuminar. */}
        <DisciplinaBgLayer nom={nom} borderRadius="2xl" />

        <ModalBody position="relative" zIndex={1} px={{ base: 7, md: 10 }} py={{ base: 8, md: 10 }}>
          <Flex direction="column" gap={5}>
            <Flex align="center" justify="center" gap={3}>
              {Icon
                ? <Icon size={{ base: "42px", md: "52px" }} />
                : <Image src="/img/icono/life.png" h="36px" objectFit="contain" />}
              <Text
                color={txtColor}
                // Siempre en UNA sola línea horizontal (nowrap); el tamaño se
                // ajusta para que quepan también los títulos largos ("Pago de
                // Medicina China realizado").
                fontSize={{ base: "sm", md: "xl" }}
                fontWeight="800"
                letterSpacing="0.02em"
                textAlign="left"
                whiteSpace="nowrap"
                style={{ textShadow: ink }}
              >
                {titulo}
              </Text>
            </Flex>

            <Box h="1px" bgGradient={`linear(to-r, transparent, ${txtColor}88, transparent)`} />

            <Text
              color={txtColor}
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="1.7"
              letterSpacing="0.015em"
              textAlign="center"
              fontStyle="italic"
              style={{ textShadow: ink }}
            >
              {mensaje}
            </Text>

            <Flex justify="center" mt={3}>
              <Box
                as="button"
                onClick={onAceptar}
                px={10}
                py={3}
                borderRadius="full"
                bg={txtColor}
                color={bgColor}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.08em"
                cursor="pointer"
                boxShadow={`0 4px 24px ${txtColor}55`}
                transition="all 0.22s"
                // Al volver del pago el modal enfoca el botón: quitamos el aro
                // azul de foco (no debe verse "seleccionado").
                outline="none"
                _focus={{ boxShadow: `0 4px 24px ${txtColor}55`, outline: "none" }}
                _focusVisible={{ boxShadow: `0 4px 24px ${txtColor}55`, outline: "none" }}
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 8px 32px ${txtColor}88` }}
              >
                Aceptar
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
