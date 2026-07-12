import React, { useEffect, useState } from "react";
import { Box, Flex, IconButton, Modal, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { ComicViewer } from "./ComicViewer";
import { fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import type { Sistema } from "../../hardCoded/espacio/SistemasFisiologia";

const TXT = fisiologiaTxt;
const BG = fisiologiaBg;

type Tab = "comic" | "test";

/**
 * Modal de un SISTEMA del cuerpo. Tiene dos apartados:
 *   · «Cómic»        → las viñetas del sistema (ComicViewer a pantalla completa).
 *   · «Cómo te sientes» → un test de autorregistro (cómo se siente el usuario /
 *                         qué tal va ese sistema). Se guardará en metodo_fisiologia.
 *
 * ⚠️ PENDIENTE: María irá pasando el contenido (viñetas del cómic y preguntas del
 * test). Mientras tanto se muestran placeholders. Cuando llegue el test se
 * renderizará aquí y se persistirá (patrón «prefill + guardar»).
 */
export function SistemaModal({ sistema, onClose }: { sistema: Sistema | null; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("comic");
  const [comicAbierto, setComicAbierto] = useState(false);

  // Al abrir un sistema nuevo, empezamos por el cómic y cerramos el visor.
  useEffect(() => {
    if (sistema) { setTab("comic"); setComicAbierto(false); }
  }, [sistema?.key]);

  useEffect(() => {
    if (!sistema) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [sistema]);

  useEffect(() => {
    if (!sistema) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && !comicAbierto) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [sistema, comicAbierto, onClose]);

  if (!sistema) return null;
  const accent = sistema.color;

  // Cómic a pantalla completa (reutiliza el ComicViewer del resto de Fisiología).
  if (comicAbierto && sistema.comic.length > 0) {
    return (
      <Modal isOpen onClose={() => setComicAbierto(false)} size="full" isCentered scrollBehavior="outside">
        <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
        <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0}
                      fontFamily="'EB Garamond', serif" minH="100vh">
          <ComicViewer
            key={sistema.key}
            vinetas={sistema.comic}
            onClose={() => setComicAbierto(false)}
            onComplete={() => { setComicAbierto(false); setTab("test"); }}
            themeColor={TXT}
            disciplinaBgImage="/img/fondos/fisio.png"
            disciplinaBgColor={BG}
          />
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Box position="fixed" inset={0} zIndex={1200} fontFamily="'EB Garamond', serif"
         display="flex" alignItems="center" justifyContent="center"
         px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}
         bg="rgba(0,20,14,0.55)" sx={{ backdropFilter: "blur(14px)" }}
         onClick={onClose}>
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        overflow="hidden"
        w={{ base: "100%", md: "720px" }}
        maxW="100%"
        maxH={{ base: "calc(100dvh - 48px)", md: "620px" }}
        borderRadius="24px"
        border={`1px solid ${accent}66`}
        boxShadow={`0 32px 80px rgba(0,0,0,0.5), 0 0 30px ${accent}55`}
        display="flex"
        flexDirection="column"
      >
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="24px" overlay="rgba(16,10,26,0.55)" />

        {/* Cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          position="absolute"
          top="14px"
          right="14px"
          zIndex={3}
          variant="ghost"
          borderRadius="full"
          w="38px" h="38px" minW="38px"
          bg="rgba(0,0,0,0.4)"
          border={`1px solid ${TXT}88`}
          _hover={{ bg: "rgba(0,0,0,0.62)", borderColor: TXT }}
          _focus={{ boxShadow: "none" }}
          _focusVisible={{ boxShadow: "none" }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="20px" h="20px" fill="#fff">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </Box>
          }
        />

        {/* Cabecera: nombre del sistema */}
        <Flex position="relative" zIndex={1} direction="column" align="center" gap={3} px={{ base: 5, md: 8 }} pt={{ base: 8, md: 9 }}>
          <Text color={TXT} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.03em"
                textAlign="center" lineHeight="1.15"
                style={{ textShadow: `0 0 16px ${accent}, 0 2px 6px rgba(0,0,0,0.6)` }}>
            Sistema {sistema.label.toLowerCase()}
          </Text>
          <Box w="80px" h="2px" borderRadius="full" bg={accent} boxShadow={`0 0 12px ${accent}`} />

          {/* Pestañas: Cómic / Cómo te sientes */}
          <Flex mt={2} gap={2} bg="rgba(0,0,0,0.28)" borderRadius="full" p={1} border={`1px solid ${TXT}22`}>
            {([["comic", "Cómic"], ["test", "Cómo te sientes"]] as [Tab, string][]).map(([k, lbl]) => (
              <Box key={k} as="button" onClick={() => setTab(k)}
                   px={{ base: 4, md: 5 }} py={1.5} borderRadius="full"
                   bg={tab === k ? TXT : "transparent"}
                   color={tab === k ? BG : `${TXT}cc`}
                   fontWeight={700} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.03em"
                   cursor="pointer" transition="all 0.18s"
                   _hover={tab === k ? {} : { color: TXT }}>
                {lbl}
              </Box>
            ))}
          </Flex>
        </Flex>

        {/* Cuerpo del apartado activo */}
        <Box position="relative" zIndex={1} flex="1" minH={0} overflowY="auto"
             px={{ base: 5, md: 8 }} py={{ base: 6, md: 7 }}
             sx={{
               "&::-webkit-scrollbar": { width: "5px" },
               "&::-webkit-scrollbar-thumb": { bg: `${TXT}55`, borderRadius: "full" },
             }}>
          {tab === "comic" ? (
            <Flex direction="column" align="center" gap={5} textAlign="center" py={4}>
              {sistema.comic.length > 0 ? (
                <>
                  <Text color={`${TXT}e6`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
                    Un pequeño cómic para conocer tu sistema {sistema.label.toLowerCase()}.
                  </Text>
                  <Box as="button" onClick={() => setComicAbierto(true)}
                       px={8} py={2.5} borderRadius="full" bg={TXT} color={BG}
                       fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.05em"
                       cursor="pointer" transition="all 0.2s"
                       boxShadow={`0 0 18px ${TXT}66, 0 0 40px ${TXT}33`}
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${TXT}88` }}>
                    Leer el cómic →
                  </Box>
                </>
              ) : (
                <Placeholder texto="El cómic de este sistema llegará muy pronto." />
              )}
            </Flex>
          ) : (
            <Flex direction="column" align="center" gap={5} textAlign="center" py={4}>
              {sistema.test.length > 0 ? (
                // Cuando lleguen las preguntas se renderiza aquí el test + guardado.
                <Placeholder texto="El test de este sistema estará disponible en breve." />
              ) : (
                <Placeholder texto="Aquí podrás registrar cómo te sientes y qué tal va este sistema. Muy pronto." />
              )}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function Placeholder({ texto }: { texto: string }) {
  return (
    <Flex direction="column" align="center" gap={3} py={8} px={4}>
      <Text fontSize="3xl">🩺</Text>
      <Text color={`${TXT}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" maxW="420px" lineHeight="1.8"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}>
        {texto}
      </Text>
    </Flex>
  );
}
