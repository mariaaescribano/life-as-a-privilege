import React, { useEffect, useState } from "react";
import { Box, Flex, IconButton, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import { CelulaCard, CelulaModal } from "./celulasUi";
import { FisiologiaLoader } from "./comicLoaders";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL,
  CelulasOrganosIcon,
  fisiologiaBg,
  fisiologiaTxt,
} from "../../GlobalVariables";
import { celulas as CELULAS, type Celula } from "../../hardCoded/espacio/CelulasCuerpoData";

const TXT = fisiologiaTxt;
const BG = fisiologiaBg;
const FISIO_IMG = "/img/fondos/fisio.png";
// Clave en metodo_fisiologia.data donde se guardan las células ya descubiertas
// (misma que usa la página «Todas tus células»).
const VISTAS_KEY = "celulas_vistas";

/** Popup INMERSIVO de "Tus células": la foto de Fisiología cubre toda la
 *  pantalla y encima aparecen todas las células (los boxes). El usuario puede
 *  pulsar cualquiera para leer su ficha. Se abre desde el `extra` del header. */
export function TusCelulasModal({
  isOpen,
  onClose,
  titulo = "Tus células",
  celulas = CELULAS,
}: {
  isOpen: boolean;
  onClose: () => void;
  /** Título del popup. Por defecto «Tus células»; los órganos pasan su nombre. */
  titulo?: string;
  /** Lista de células a mostrar. Por defecto todas las de Fisiología. */
  celulas?: Celula[];
}) {
  const [selected, setSelected] = useState<Celula | null>(null);
  // Células que el usuario ya ha visto (para pintar el tick arriba a la derecha).
  const [vistas, setVistas] = useState<Set<string>>(new Set());

  // No mostramos la rejilla hasta que TODAS las fotos (fondo + las de cada
  // célula) estén cargadas; mientras, se ve la animación de espera de Fisiología.
  // Se precargan solo cuando el popup está abierto.
  const fotosListas = usePrecargarImagenes(
    isOpen ? [FISIO_IMG, ...celulas.map((c) => c.foto)] : [],
  );

  // Al abrir el popup, traemos del backend las células ya descubiertas.
  useEffect(() => {
    if (!isOpen) return;
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    (async () => {
      try {
        const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } });
        const g = r.data?.data?.[VISTAS_KEY];
        if (Array.isArray(g)) setVistas(new Set(g));
      } catch { /* sin datos todavía */ }
    })();
  }, [isOpen]);

  // Bloquea el scroll de la página de fondo mientras el popup está abierto. Se
  // reafirma cuando se cierra una ficha (selected → null), porque la ficha
  // restablece el overflow al desmontarse.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, selected]);

  // Cerrar con Escape (solo el popup grande; la ficha gestiona su propio Escape).
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && !selected) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, selected, onClose]);

  // Al cerrar el popup grande, olvida la ficha abierta para la próxima vez.
  useEffect(() => { if (!isOpen) setSelected(null); }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Box position="fixed" inset={0} zIndex={1000} fontFamily="'EB Garamond', serif">
      {/* ── Fondo inmersivo: foto de Fisiología cubriendo TODA la pantalla ── */}
      <Box position="absolute" inset={0} bg={BG} overflow="hidden">
        <Box
          as="img"
          src={FISIO_IMG}
          alt=""
          loading="eager"
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* Velo más claro + capa blanca: aclara la foto y crea distinción con
            los boxes de las células, que quedan más oscuros por encima. */}
        <Box position="absolute" inset={0} bg={`${BG}59`} />
        <Box position="absolute" inset={0} bg="rgba(255,255,255,0.22)" />
      </Box>

      {/* ── X cerrar ── */}
      <IconButton
        aria-label="Cerrar"
        onClick={onClose}
        position="fixed"
        top={{ base: 3, md: 5 }}
        right={{ base: 3, md: 5 }}
        zIndex={3}
        variant="ghost"
        borderRadius="full"
        w={{ base: "42px", md: "48px" }}
        h={{ base: "42px", md: "48px" }}
        minW={{ base: "42px", md: "48px" }}
        bg="rgba(0,0,0,0.4)"
        border={`1px solid ${TXT}aa`}
        sx={{ backdropFilter: "blur(4px)" }}
        _hover={{ bg: "rgba(0,0,0,0.62)", borderColor: TXT }}
        _focus={{ boxShadow: "none" }}
        _focusVisible={{ boxShadow: "none" }}
        icon={
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill="#ffffff"
            style={{ filter: `drop-shadow(0 0 5px ${TXT}) drop-shadow(0 1px 2px rgba(0,0,0,0.8))` }}>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Box>
        }
      />

      {/* ── Contenido: hasta que TODAS las fotos estén cargadas, la animación de
          espera de Fisiología (el corazón latiendo). Luego, título + rejilla. ── */}
      {!fotosListas ? (
        <Flex position="absolute" inset={0} zIndex={2} align="center" justify="center">
          <FisiologiaLoader />
        </Flex>
      ) : (
      <Box position="absolute" inset={0} zIndex={2} overflowY="auto"
           px={{ base: 5, md: 10, lg: 16 }} py={{ base: 14, md: 16 }}>
        <Flex direction="column" align="center" gap={{ base: 8, md: 10 }} w="100%">
          {/* Título: icono a la IZQUIERDA + "Tus células" */}
          <Flex direction="row" align="center" justify="center" gap={{ base: 3, md: 4 }}>
            <CelulasOrganosIcon size={{ base: "40px", md: "54px" }} />
            <Text
              color={TXT}
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="700"
              letterSpacing="0.08em"
              lineHeight="1.1"
              style={{ textShadow: `0 0 14px ${BG}cc, 0 0 34px ${BG}88, 0 2px 6px rgba(0,0,0,0.6)` }}
            >
              {titulo}
            </Text>
          </Flex>

          {/* Rejilla de células — 4 en ordenador, 1 en móvil */}
          {celulas.length > 0 ? (
            <SimpleGrid
              w="100%"
              maxW="1200px"
              columns={{ base: 1, sm: 2, md: 4 }}
              spacing={{ base: 5, md: 6 }}
            >
              {celulas.map((celula) => (
                <CelulaCard key={celula.id} celula={celula} visto={vistas.has(celula.id)}
                            onClick={() => setSelected(celula)} />
              ))}
            </SimpleGrid>
          ) : (
            <Text color={`${TXT}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
              Pronto podrás explorar las células de este órgano.
            </Text>
          )}
        </Flex>
      </Box>
      )}

      {/* Ficha de la célula seleccionada (por encima del popup). Con flechas
          para pasar por todas las células sin cerrar la ficha. */}
      {selected && (
        <CelulaModal
          celula={selected}
          celulas={celulas}
          onSelect={setSelected}
          onClose={() => setSelected(null)}
        />
      )}
    </Box>
  );
}

/** Hook para añadir el botón "Tus células" al `extra` del MetodoStepHeader de
 *  cualquier página de Fisiología. Mismo patrón que useIlustracionesTcm. */
export function useTusCelulas() {
  const [open, setOpen] = useState(false);
  const extra = {
    label: "Tus células",
    onClick: () => setOpen(true),
    icon: <CelulasOrganosIcon size={{ base: "16px", md: "18px" }} />,
  };
  const modal = <TusCelulasModal isOpen={open} onClose={() => setOpen(false)} />;
  return { extra, modal };
}
