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
import { PRECIO_DISCIPLINA, PRECIO_DISCIPLINA_ANTES } from "./pagoDisciplinaLink";
import { PrecioConAntes } from "./PrecioConAntes";
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
  /** Precio mostrado (por defecto, el de una disciplina: PRECIO_DISCIPLINA). */
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
  bg,
  txt,
  nom,
  ordinal,
  descripcion,
  precio = PRECIO_DISCIPLINA,
  errorColor = "#ffb4b4",
}: BaseProps) {
  // Consentimiento de términos + renuncia al desistimiento. Se reinicia cada vez
  // que se abre el modal: nunca debe quedar marcado «de la vez anterior».
  const [acepta, setAcepta] = React.useState(false);
  React.useEffect(() => { if (isOpen) setAcepta(false); }, [isOpen]);

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

            <Flex direction="column" align="center" gap={1.5} mt={1}>
              <PrecioConAntes
                precio={precio}
                color={txt}
                sombra={`0 0 20px ${txt}80, 0 0 42px ${txt}55`}
              />
              {PRECIO_DISCIPLINA_ANTES && (
                <Text color={`${txt}bb`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
                  Aprovecha que está en un precio reducido
                </Text>
              )}
            </Flex>

            {/* Una sola casilla, con texto corto. El detalle de qué se acepta
                —incluido que el pago no se devuelve— vive en la lista de
                condiciones de /terminos, no aquí: el box de pago no es sitio
                para un párrafo jurídico. */}
            <Flex
              align="center"
              justify="center"
              gap={3}
              mt={2}
              cursor="pointer"
              onClick={() => setAcepta((v) => !v)}
              role="checkbox"
              aria-checked={acepta}
            >
              <Flex
                flexShrink={0}
                w="20px"
                h="20px"
                borderRadius="4px"
                border={`1.5px solid ${acepta ? txt : `${txt}80`}`}
                bg={acepta ? txt : "transparent"}
                align="center"
                justify="center"
                transition="all 0.18s"
              >
                {acepta && (
                  <Box as="svg" viewBox="0 0 24 24" w="14px" h="14px" fill="none" stroke={bg} strokeWidth="3.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </Box>
                )}
              </Flex>
              <Text color={`${txt}e0`} fontSize="sm" lineHeight="1.6">
                Acepto las{" "}
                <Text
                  as="span"
                  textDecoration="underline"
                  onClick={(e) => { e.stopPropagation(); window.open("/terminos", "_blank"); }}
                  _hover={{ color: txt }}
                >
                  condiciones de compra
                </Text>
              </Text>
            </Flex>

            <Flex justify="center" mt={3} gap={4} wrap="wrap">
              <Box
                as="button"
                onClick={loading || !acepta ? undefined : onPagar}
                px={10}
                py={3}
                borderRadius="full"
                bg={txt}
                color={bg}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.08em"
                cursor={loading || !acepta ? "not-allowed" : "pointer"}
                opacity={loading || !acepta ? 0.5 : 1}
                boxShadow={`0 4px 24px ${txt}47`}
                transition="all 0.22s"
                _hover={loading || !acepta ? {} : { transform: "translateY(-2px)", boxShadow: `0 8px 32px ${txt}66` }}
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
