import React from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import {
  ayurvedaNom, AyurvedaIcon,
  tcmNom, TCMIcon,
  cabalaNom, CabalaIcon,
  fisiologiaNom, FisiologiaIcon,
  nutricionNom, NutricionIcon,
  neuropsicologiaNom, NeuropsicologiaIcon,
  astrologiaNom, AstrologiaIcon,
  culturaNom, CulturaIcon,
} from "../../GlobalVariables";

// Icono propio de cada disciplina, por su nombre. Se muestra a la izquierda del
// ordinal en la cabecera del box de pago (en lugar del logo/mandala genérico).
const ICONO_POR_NOM: Record<string, (size: string) => React.ReactNode> = {
  [ayurvedaNom]:        (s) => <AyurvedaIcon size={{ base: s, md: s }} />,
  [tcmNom]:             (s) => <TCMIcon size={{ base: s, md: s }} />,
  [cabalaNom]:          (s) => <CabalaIcon size={{ base: s, md: s }} />,
  [fisiologiaNom]:      (s) => <FisiologiaIcon size={{ base: s, md: s }} />,
  [nutricionNom]:       (s) => <NutricionIcon size={{ base: s, md: s }} />,
  [neuropsicologiaNom]: (s) => <NeuropsicologiaIcon size={{ base: s, md: s }} />,
  [astrologiaNom]:      (s) => <AstrologiaIcon size={{ base: s, md: s }} />,
  [culturaNom]:         (s) => <CulturaIcon size={{ base: s, md: s }} />,
};

export interface PagoDisciplinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPagar: () => void;
  loading?: boolean;
  error?: string | null;
  /** Si se pasa, muestra un botón de "modo test" (desbloqueo sin cobro). */
  onTest?: () => void;
}

interface BaseProps extends PagoDisciplinaModalProps {
  /** Color de fondo de la disciplina (disciplinaBg). */
  bg: string;
  /** Color de texto/acento de la disciplina (disciplinaTxt). */
  txt: string;
  /** Nombre de la disciplina, para pintar SIEMPRE su imagen de fondo. */
  nom: string;
  /** Ordinal de la disciplina, p.ej. "Séptima disciplina". */
  ordinal: string;
  /** Resumen de 2 líneas de lo que hace el recorrido. */
  descripcion: React.ReactNode;
  /** Precio mostrado (por defecto "20 €"). */
  precio?: string;
  /** Color del texto de error (según el fondo sea claro u oscuro). */
  errorColor?: string;
}

/**
 * Box de pago común a todas las disciplinas. Se pinta con los colores de cada
 * disciplina (disciplinaBg de fondo, disciplinaTxt para texto y acentos), de
 * modo que el estilo coincide con el recorrido que se va a desbloquear.
 * Los wrappers por disciplina (PagoCabalaModal, PagoNutricionModal, …) solo le
 * pasan sus colores, su ordinal y su resumen.
 */
export function PagoDisciplinaModal({
  isOpen,
  onClose,
  onPagar,
  loading,
  error,
  onTest,
  bg,
  txt,
  nom,
  ordinal,
  descripcion,
  precio = "20 €",
  errorColor = "#ffb4b4",
}: BaseProps) {
  return (
    // scrollBehavior="inside": si el contenido es más alto que la pantalla, el
    // box no crece sin límite — se limita a la altura del viewport y el cuerpo
    // hace scroll vertical dentro.
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
      {/* Detrás del popup: la página se oscurece un poco y se desenfoca. */}
      <ModalOverlay bg="rgba(0,0,0,0.55)" sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} />
      <ModalContent
        bg="transparent"
        border={`1px solid ${txt}52`}
        borderRadius="2xl"
        boxShadow={`0 16px 60px rgba(0,0,0,0.5), 0 0 40px ${txt}1f`}
        mx={{ base: 4, md: 0 }}
        my={{ base: 4, md: 6 }}
        maxH={{ base: "calc(100dvh - 2rem)", md: "calc(100dvh - 3rem)" }}
        fontFamily="'EB Garamond', serif"
        overflow="hidden"
        position="relative"
      >
        {/* Fondo del popup = SOLO la imagen de la disciplina, tal cual (sin velo
            de color encima). La legibilidad la dan las sombras del texto. */}
        <DisciplinaBgLayer nom={nom} borderRadius="2xl" />

        <ModalBody px={{ base: 7, md: 10 }} py={{ base: 8, md: 10 }} position="relative" zIndex={1}>
          <Flex direction="column" gap={5}>
            <Flex align="center" gap={3} justify="center">
              {ICONO_POR_NOM[nom]?.("36px")}
              <Text
                color={txt}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="800"
                letterSpacing="0.05em"
                textAlign="center"
                style={{ textShadow: `1px 2px 12px ${txt}4d` }}
              >
                {ordinal}
              </Text>
            </Flex>

            <Box h="1px" bgGradient={`linear(to-r, transparent, ${txt}66, transparent)`} />

            <Text
              color={`${txt}f2`}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.85"
              letterSpacing="0.015em"
              textAlign="center"
            >
              {descripcion}
            </Text>

            <Text
              color={txt}
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="700"
              lineHeight="1"
              textAlign="center"
              textShadow={`0 0 20px ${txt}80, 0 0 42px ${txt}55`}
              mt={1}
            >
              {precio}
            </Text>

            <Flex justify="center" mt={3} gap={4} wrap="wrap">
              <Box
                as="button"
                onClick={loading ? undefined : onPagar}
                px={10}
                py={3}
                borderRadius="full"
                bg={txt}
                color={bg}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.08em"
                cursor={loading ? "not-allowed" : "pointer"}
                opacity={loading ? 0.6 : 1}
                boxShadow={`0 4px 24px ${txt}47`}
                transition="all 0.22s"
                _hover={loading ? {} : { transform: "translateY(-2px)", boxShadow: `0 8px 32px ${txt}66` }}
              >
                {loading ? "Conectando…" : "Pagar"}
              </Box>
              <Box
                as="button"
                onClick={loading ? undefined : onClose}
                px={8}
                py={3}
                borderRadius="full"
                bg="transparent"
                color={`${txt}d9`}
                border={`1px solid ${txt}80`}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                letterSpacing="0.06em"
                cursor={loading ? "not-allowed" : "pointer"}
                opacity={loading ? 0.5 : 1}
                transition="all 0.22s"
                _hover={loading ? {} : { borderColor: txt, color: txt }}
              >
                Ahora no
              </Box>
            </Flex>

            {error && (
              <Text
                color={errorColor}
                fontSize="sm"
                textAlign="center"
                fontStyle="italic"
                mt={1}
              >
                {error}
              </Text>
            )}

            {onTest && (
              <Box
                as="button"
                onClick={loading ? undefined : onTest}
                alignSelf="center"
                mt={2}
                px={8}
                py={2.5}
                borderRadius="full"
                bg={`${txt}29`}
                color={txt}
                border={`1.5px dashed ${txt}bf`}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                letterSpacing="0.05em"
                cursor={loading ? "not-allowed" : "pointer"}
                transition="all 0.2s"
                _hover={loading ? {} : { bg: `${txt}47`, transform: "translateY(-1px)" }}
              >
                💳 Pago de prueba (sin cobro real)
              </Box>
            )}

            <Text
              color={`${txt}8c`}
              fontSize="xs"
              letterSpacing="0.06em"
              fontStyle="italic"
              textAlign="center"
              mt={1}
            >
              Pago seguro a través de Stripe
            </Text>

            <Box h="1px" bgGradient={`linear(to-r, transparent, ${txt}40, transparent)`} mt={1} />

            <Text
              color={`${txt}99`}
              fontSize="xs"
              lineHeight="1.6"
              fontStyle="italic"
              textAlign="center"
            >
              Doy mi palabra de honor de que todos los textos son obra mía, escritos por mí. Aunque me he
              apoyado en herramientas de inteligencia artificial, las ideas, las palabras y el contenido son
              enteramente míos.
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PagoDisciplinaModal;
