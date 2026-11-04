import React, { useState } from "react";
import axios from "axios";
import { useT } from "../../i18n";
import { personaActiva } from "../../api/persona";
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
  API_URL,
} from "../../GlobalVariables";

/** Nombre de la disciplina → clave con la que el servidor guarda su acceso. */
const SCOPE_POR_NOM: Record<string, string> = {
  [astrologiaNom]: "metodo",
  [neuropsicologiaNom]: "psicologia",
  [ayurvedaNom]: "ayurveda",
  [tcmNom]: "tcm",
  [fisiologiaNom]: "fisiologia",
  [nutricionNom]: "nutricion",
  [cabalaNom]: "cabala",
  [culturaNom]: "cultura",
};

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
  /** Sin uso desde que el título es el nombre de la disciplina; los wrappers aún lo pasan. */
  ordinal?: string;
  /** Resumen de 2 líneas de lo que hace el recorrido. */
  descripcion: React.ReactNode;
  /** Sin uso desde que ya no se cobra; los wrappers aún lo pasan. */
  precio?: string;
  /** Sin uso desde que ya no se cobra; los wrappers aún lo pasan. */
  errorColor?: string;
}

/**
 * Una casilla del box de pago: el cuadradito, su texto y (si hace falta) una
 * línea de letra pequeña debajo. Está aquí y no suelta en cada sitio porque
 * ahora hay dos y tienen que verse exactamente igual.
 *
 * Toda la fila es el interruptor —también el texto—, que es lo que espera
 * cualquiera que haya marcado una casilla alguna vez. Los enlaces de dentro
 * paran el clic con `stopPropagation` para no marcarla al abrirlos.
 */
export function Casilla({
  marcada,
  onToggle,
  bg,
  txt,
  nota,
  children,
}: {
  marcada: boolean;
  onToggle: () => void;
  bg: string;
  txt: string;
  /** Letra pequeña bajo el texto (para matizar el alcance del permiso). */
  nota?: string;
  children: React.ReactNode;
}) {
  return (
    <Flex
      align="flex-start"
      gap={3}
      cursor="pointer"
      onClick={onToggle}
      role="checkbox"
      aria-checked={marcada}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); onToggle(); }
      }}
      _focusVisible={{ outline: "none" }}
    >
      <Flex
        flexShrink={0}
        mt="3px"
        w="20px"
        h="20px"
        borderRadius="4px"
        border={`1.5px solid ${marcada ? txt : `${txt}80`}`}
        bg={marcada ? txt : "transparent"}
        align="center"
        justify="center"
        transition="all 0.18s"
      >
        {marcada && (
          <Box as="svg" viewBox="0 0 24 24" w="14px" h="14px" fill="none" stroke={bg} strokeWidth="3.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </Box>
        )}
      </Flex>

      <Box minW={0}>
        <Text color={`${txt}e0`} fontSize="sm" lineHeight="1.6">
          {children}
        </Text>
        {nota && (
          <Text color={`${txt}99`} fontSize="xs" lineHeight="1.5" fontStyle="italic" mt={1}>
            {nota}
          </Text>
        )}
      </Box>
    </Flex>
  );
}

/**
 * Lo que sale al pulsar una disciplina que aún no está abierta. Ya NO se cobra por
 * disciplina: María abre cada una a mano desde /admin/usuarios, a medida que avanzan
 * las sesiones. Por eso este box no pide nada ni lleva precio: solo avisa y se cierra.
 *
 * Conserva el nombre, las props y los wrappers por disciplina (PagoCabalaModal,
 * PagoNutricionModal, …) porque Home y todas las páginas de disciplina lo montan con
 * `onPagar`/`loading`/`error`: esas props ya no se usan, pero así no hubo que tocar
 * cincuenta sitios, y el cobro por Stripe sigue en el código por si algún día vuelve.
 *
 * Se pinta con los colores de cada disciplina (disciplinaBg de fondo, disciplinaTxt
 * para texto y acentos).
 */
export function PagoDisciplinaModal({
  isOpen,
  onClose,
  bg,
  txt,
  nom,
  descripcion,
}: BaseProps) {
  const t = useT();
  // María en el camino de una persona: aquí, además de leer el aviso, abre la
  // disciplina (la persona NO tiene este botón). Es el mismo POST /user/admin/acceso
  // del panel; el servidor solo lo admite con token de admin.
  const persona = personaActiva();
  const scope = SCOPE_POR_NOM[nom];
  const [abriendo, setAbriendo] = useState(false);
  const [errorAbrir, setErrorAbrir] = useState(false);
  const abrir = async () => {
    if (!persona || !scope || abriendo) return;
    setAbriendo(true);
    setErrorAbrir(false);
    try {
      await axios.post(`${API_URL}/user/admin/acceso`, { userId: persona.id, disciplina: scope, abierta: true });
      // Recarga entera: Home guarda las disciplinas abiertas en una caché de módulo.
      window.location.reload();
    } catch {
      setErrorAbrir(true);
      setAbriendo(false);
    }
  };

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
                {/* El nombre de la disciplina (Astrología…), no «Primera disciplina»: el
                    ordinal ya no se pinta, aunque los wrappers siguen pasándolo. */}
                {nom}
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
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="700"
              lineHeight="1.6"
              textAlign="center"
              style={{ textShadow: `0 0 20px ${txt}80` }}
            >
              {t("metodo.pago.laAbroYo")}
            </Text>

            <Flex justify="center" mt={2} gap={3} wrap="wrap">
              {persona && scope && (
                <Box
                  as="button"
                  onClick={abrir}
                  px={10}
                  py={3}
                  borderRadius="full"
                  bg="transparent"
                  border={`1.5px solid ${txt}`}
                  color={txt}
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="700"
                  letterSpacing="0.08em"
                  cursor={abriendo ? "wait" : "pointer"}
                  opacity={abriendo ? 0.6 : 1}
                  boxShadow={`0 0 24px ${txt}47`}
                  transition="all 0.22s"
                  _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 32px ${txt}66` }}
                  _focusVisible={{ outline: `2px solid ${txt}`, outlineOffset: "3px" }}
                >
                  {errorAbrir ? "No se pudo abrir" : abriendo ? "Abriendo…" : "Abrir"}
                </Box>
              )}
              <Box
                as="button"
                onClick={onClose}
                px={10}
                py={3}
                borderRadius="full"
                bg={txt}
                color={bg}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.08em"
                cursor="pointer"
                boxShadow={`0 4px 24px ${txt}47`}
                transition="all 0.22s"
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 8px 32px ${txt}66` }}
                _focusVisible={{ outline: `2px solid ${txt}`, outlineOffset: "3px" }}
              >
                {t("metodo.pago.entendido")}
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PagoDisciplinaModal;
