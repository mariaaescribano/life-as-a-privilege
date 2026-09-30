// ─────────────────────────────────────────────────────────────────────────────
// PINES DEL DIARIO · abajo a la derecha del /home, SOLO para quien tiene
// diario de terapias (entradas publicadas por María).
//
// Dos botones rectangulares apilados:
//   · «Mis notas» — abre un visor con las notas que el usuario ha ido
//     escribiendo dentro del recorrido (la tabla `notas`, las mismas del
//     botón flotante de /metodo). Aquí solo se LEEN (y se pueden borrar);
//     para escribir está el recorrido.
//   · «Diario de terapia» — lleva a /diario, con su icono propio (el
//     marcapáginas con corazón, el mismo del panel de admin). Si hay notas
//     publicadas SIN LEER, encima del pin sale un numerito con cuántas son
//     (antes eso era una tarjeta entera en la columna de la izquierda;
//     ahora todo el aviso es este numerito).
//
// Si la persona no tiene ninguna entrada publicada en el diario, no se pinta
// nada: el /home no cambia ni un píxel (la misma regla que «Tu camino»).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { Box, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";
import { listarMias } from "../../api/diario";
import { DiarioIcon, NotaCard, type Nota } from "../../components/global/MiniDiario";
import { IconoDiarioTerapia } from "../../components/global/IconoDiarioTerapia";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { cacheDeOtraCuenta } from "../../api/sesion";
import { useT } from "../../i18n";

// Se recuerda a nivel de módulo si esta cuenta tiene diario (y cuántas notas
// le quedan sin leer), para que al volver al home no haya parpadeo.
let tieneDiarioCache: boolean | null = null;
let sinLeerCache = 0;

/** Para que la página /diario pueda apagar el numerito de «sin leer» sin recargar. */
export const olvidarCacheDiario = () => {
  tieneDiarioCache = null;
  sinLeerCache = 0;
};

/** El estilo común de los dos pines: rectangulares, apilados, mismo material. */
const PIN = {
  as: "button",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  px: "20px",
  py: "14px",
  borderRadius: "xl",
  bg: "rgba(255,255,255,0.1)",
  border: "1.5px solid rgba(255,255,255,0.5)",
  color: "white",
  cursor: "pointer",
  // Glow blanco suave, SIN sombra oscura de profundidad (la sombra los hacía
  // pesados sobre el turquesa; la luz los integra).
  boxShadow: "0 0 10px rgba(255,255,255,0.18), 0 0 24px rgba(255,255,255,0.08)",
  transition: "all 0.22s ease",
  _hover: {
    bg: "rgba(255,255,255,0.2)",
    borderColor: "white",
    transform: "translateY(-2px)",
    boxShadow: "0 0 14px rgba(255,255,255,0.3), 0 0 32px rgba(255,255,255,0.14)",
  },
  _active: { transform: "translateY(0)" },
} as const;

export default function PinesDiario({ estatico = false }: {
  /** En vez de flotar abajo a la derecha, los pines van EN EL FLUJO de la
   *  página (los usa el móvil: debajo del box «Tu mapa», así que cuando el
   *  mapa se despliega, los pines bajan con él). En móvil no flota nada. */
  estatico?: boolean;
}) {
  const t = useT();
  const navigate = useNavigate();
  if (cacheDeOtraCuenta("pinesDiario")) {
    tieneDiarioCache = null;
    sinLeerCache = 0;
  }
  const [tieneDiario, setTieneDiario] = useState<boolean>(tieneDiarioCache === true);
  const [sinLeer, setSinLeer] = useState<number>(sinLeerCache);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Visor de «Mis notas»
  const [notas, setNotas] = useState<Nota[]>([]);
  const [cargando, setCargando] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (tieneDiarioCache !== null) return;
    let cancel = false;
    listarMias().then((lista) => {
      tieneDiarioCache = lista.length > 0;
      sinLeerCache = lista.filter((e) => !e.leida_at).length;
      if (!cancel) {
        setTieneDiario(tieneDiarioCache);
        setSinLeer(sinLeerCache);
      }
    });
    return () => { cancel = true; };
  }, []);

  const abrirNotas = async () => {
    onOpen();
    if (!userId) return;
    setCargando(true);
    try {
      const { data } = await axios.get(`${API_URL}/notas/${userId}`);
      setNotas(Array.isArray(data) ? data : []);
    } catch {
      setNotas([]);
    } finally {
      setCargando(false);
    }
  };

  const borrar = async (id: string) => {
    if (!userId) return;
    setNotas((prev) => prev.filter((n) => n.id !== id)); // optimista
    try {
      await axios.delete(`${API_URL}/notas/${userId}/${id}`);
    } catch {
      abrirNotas(); // si falla, recargamos el estado real
    }
  };

  if (!userId || !tieneDiario) return null;

  return (
    <>
      {/* ── Los dos pines, apilados. Flotando abajo a la derecha SOLO en
          escritorio (desde lg); en móvil van estáticos, en el flujo, debajo
          de «Tu mapa» (instancia con `estatico` que pinta el Home). ── */}
      <Flex
        direction="column"
        align="stretch"
        gap="10px"
        fontFamily="'EB Garamond', serif"
        {...(estatico
          ? { w: "100%", maxW: { base: "420px", md: "320px" }, mx: "auto" }
          : {
              position: "fixed" as const,
              right: { base: "14px", md: "26px" },
              bottom: { base: "calc(14px + env(safe-area-inset-bottom))", md: "26px" },
              zIndex: 150,
              display: { base: "none", lg: "flex" },
            })}
      >
        <Flex {...PIN} onClick={abrirNotas} aria-label={t("home.pin.misNotas")}>
          <DiarioIcon fill="white" size="26px" />
          <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em" whiteSpace="nowrap">
            {t("home.pin.misNotas")}
          </Text>
        </Flex>

        <Flex {...PIN} position="relative" onClick={() => navigate("/diario")} aria-label={t("home.pin.diarioTerapia")}>
          {/* El numerito de notas sin leer, montado sobre la esquina del pin. */}
          {sinLeer > 0 && (
            <Flex
              position="absolute"
              top="-9px"
              right="-9px"
              minW="22px"
              h="22px"
              px="6px"
              align="center"
              justify="center"
              borderRadius="full"
              bg="white"
              color="#008080"
              fontSize="xs"
              fontWeight="800"
              lineHeight="1"
              boxShadow="0 0 8px rgba(255,255,255,0.4)"
              pointerEvents="none"
            >
              {sinLeer}
            </Flex>
          )}
          <IconoDiarioTerapia fill="#FFFFFF" size="26px" />
          <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em" whiteSpace="nowrap">
            {t("home.pin.diarioTerapia")}
          </Text>
        </Flex>
      </Flex>

      {/* ── Visor de «Mis notas» ── */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(8px)" }} />
        <ModalContent
          bg="#008080"
          border="1px solid rgba(255,255,255,0.32)"
          borderRadius="2xl"
          boxShadow="0 16px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.15)"
          mx={{ base: 4, md: 0 }}
          fontFamily="'EB Garamond', serif"
          overflow="hidden"
          maxH={{ base: "min(86dvh, 600px)", md: "min(88dvh, 640px)" }}
        >
          <Box
            as="button"
            onClick={onClose}
            position="absolute"
            top={3}
            right={3}
            zIndex={2}
            w="34px"
            h="34px"
            borderRadius="full"
            bg="rgba(0,0,0,0.15)"
            border="1px solid rgba(255,255,255,0.5)"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="md"
            lineHeight="1"
            cursor="pointer"
            transition="all 0.18s"
            _hover={{ bg: "rgba(255,255,255,0.22)", borderColor: "white" }}
            aria-label={t("comun.cerrar")}
          >
            ✕
          </Box>

          <ModalBody px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }} flex="1" minH={0} display="flex" flexDirection="column" overflow="hidden">
            <Flex align="center" justify="center" gap={2.5} mb={4} flexShrink={0}>
              <DiarioIcon fill="white" size="26px" />
              <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" letterSpacing="0.04em">
                {t("home.pin.misNotas")}
              </Text>
            </Flex>

            {cargando ? (
              <Flex justify="center" align="center" flex="1" minH="180px">
                <LifeLoader color="#ffffff" size="56px" />
              </Flex>
            ) : notas.length === 0 ? (
              <Flex justify="center" align="center" flex="1" minH="120px">
                <Text color="rgba(255,255,255,0.6)" textAlign="center" fontStyle="italic">
                  {t("diario.vacio")}
                </Text>
              </Flex>
            ) : (
              <Flex
                direction="column"
                gap={3}
                flex="1"
                minH={0}
                overflowY="auto"
                pr={2}
                sx={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.4) transparent",
                  "&::-webkit-scrollbar": { width: "8px" },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                  "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.35)", borderRadius: "8px" },
                }}
              >
                {notas.map((n) => (
                  <NotaCard key={n.id} nota={n} onBorrar={borrar} />
                ))}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
