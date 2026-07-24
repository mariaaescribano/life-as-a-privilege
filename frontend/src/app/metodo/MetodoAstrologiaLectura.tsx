import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { useImagesReady } from "../../hooks/useImagesReady";
import { ComicAstrologiaModal, VINETAS_CASAS } from "../../components/metodo/ComicAstrologiaModal";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { useAstroLeidos } from "../../hooks/useAstroLeidos";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

const MotionBox = motion(Box) as any;

interface Reto { id: string; titulo: string; texto: string; }

const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

// PRNG determinista (mulberry32): mismo reparto en cada render, no "salta".
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Reparte `total` estrellas por el cielo de forma ALEATORIA pero SIN solaparse:
// muestreo por rechazo con distancia mínima (estilo Poisson-disk). Como el
// recuadro es más ancho que alto, ponderamos la distancia horizontal por el
// aspecto para que el hueco se vea parejo en ambas direcciones. Si en algún
// caso cuesta colocar una estrella, relajamos la distancia para no bloquear.
function layoutStars(total: number): { top: string; left: string }[] {
  const rand = mulberry32(total * 9973 + 7);
  const ax = 7, ay = 10;                  // márgenes (%) mínimos: que llenen el box
  const xMin = ax, xMax = 100 - ax;
  const yMin = ay, yMax = 100 - ay;
  const aspect = 2.2;                     // ancho/alto aproximado del recuadro
  let minDist = 22;                       // hueco mínimo entre centros (ponderado)
  const pts: { x: number; y: number }[] = [];

  for (let i = 0; i < total; i++) {
    let placed = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      const x = xMin + rand() * (xMax - xMin);
      const y = yMin + rand() * (yMax - yMin);
      const lejos = pts.every((p) => Math.hypot((x - p.x) * aspect, y - p.y) >= minDist);
      if (lejos) { pts.push({ x, y }); placed = true; break; }
    }
    if (!placed) {
      // No se encontró hueco: si aún hay margen, relajamos y reintentamos.
      if (minDist > 7) { minDist *= 0.85; i--; continue; }
      pts.push({ x: xMin + rand() * (xMax - xMin), y: yMin + rand() * (yMax - yMin) });
    }
  }

  return pts.map((p) => ({ left: `${p.x.toFixed(2)}%`, top: `${p.y.toFixed(2)}%` }));
}

// Estrella grande con glow que titila; al pulsarla se abre el reto.
// Cuando ya se ha leído, la estrella queda más tenue y sin titileo (más un
// pequeño ✓) para que el usuario vea de un vistazo cuáles le faltan.
function EstrellaReto({ index, pos, leido, onOpen }: { index: number; pos: { top: string; left: string }; leido: boolean; onOpen: () => void }) {
  const { top, left } = pos;
  const glow = `drop-shadow(0 0 6px ${astrologiaTxt}) drop-shadow(0 0 16px ${astrologiaTxt}cc)`;
  const glowFuerte = `drop-shadow(0 0 12px ${astrologiaTxt}) drop-shadow(0 0 30px ${astrologiaTxt})`;
  return (
    <MotionBox
      as="button"
      onClick={onOpen}
      aria-label={leido ? "Punto clave leído (abrir de nuevo)" : "Abrir punto clave"}
      position="absolute"
      top={top}
      left={left}
      cursor="pointer"
      zIndex={2}
      // Entrada: la estrella "se enciende" (aparece con un pequeño estallido de
      // escala) en cascada según su índice; conserva el centrado y el hover.
      // Al MONTAR (no whileInView) para que siempre ocurra al cambiar de página.
      initial={{ opacity: 0, scale: 0.15 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.18 }}
      transition={{ delay: 0.35 + (index % 10) * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      transformTemplate={(_: any, generated: string) => `translate(-50%, -50%) ${generated}`}
      sx={{
        "@keyframes retoTwinkle": {
          "0%, 100%": { filter: glow, opacity: 0.9 },
          "50%": { filter: glowFuerte, opacity: 1 },
        },
      }}
    >
      <Box position="relative" display="inline-flex">
        <Box
          as="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          w={{ base: "38px", md: "50px" }}
          h={{ base: "38px", md: "50px" }}
          fill={astrologiaTxt}
          opacity={leido ? 0.4 : 1}
          style={leido
            ? { filter: `drop-shadow(0 0 4px ${astrologiaTxt}77)` }
            : { animation: "retoTwinkle 3s ease-in-out infinite", animationDelay: `${(index % 5) * 0.45}s` }}
        >
          {/* Estrella de 8 puntas (octograma) con rayos finos y elegantes. */}
          <path d="M12 1 L13.53 8.30 L19.78 4.22 L15.70 10.47 L23 12 L15.70 13.53 L19.78 19.78 L13.53 15.70 L12 23 L10.47 15.70 L4.22 19.78 L8.30 13.53 L1 12 L8.30 10.47 L4.22 4.22 L10.47 8.30 Z" />
        </Box>
        {leido && (
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               position="absolute" bottom="-2px" right="-2px" w="16px" h="16px" fill={astrologiaTxt}
               style={{ filter: `drop-shadow(0 0 3px ${astrologiaTxt})` }}>
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </Box>
        )}
      </Box>
    </MotionBox>
  );
}

export default function MetodoAstrologiaLectura() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [retos, setRetos] = useState<Reto[]>([]);
  const [retoAbierto, setRetoAbierto] = useState<Reto | null>(null);
  const [comicOpen, setComicOpen] = useState(false);
  // Cómic de las casas: se intercala antes de pasar a «Casas».
  const [comicCasasOpen, setComicCasasOpen] = useState(false);
  const { leidos: retosLeidos, marcarLeido: marcarReto, cargado } = useAstroLeidos("retos");
  const fotosListas = useImagesReady([SPACE_IMG]);

  // Abre un punto clave y lo marca como leído (persistente en BD).
  const abrirReto = (r: Reto) => { setRetoAbierto(r); marcarReto(r.id); };

  // Para pasar a Casas hay que haber leído TODOS los puntos clave.
  const todosRetosLeidos = retos.length === 0 || retos.every((r) => retosLeidos.has(r.id));

  // Posiciones (aleatorias pero separadas) calculadas una vez por nº de retos.
  const starPositions = useMemo(() => layoutStars(retos.length), [retos.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const res = await axios.get<{ link_carta?: string | null; retos?: Reto[] } | null>(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lista = Array.isArray(res.data?.retos) ? res.data!.retos! : [];
        // Si no hay ni PDF ni puntos clave, la carta aún no está lista.
        if (!res.data?.link_carta && lista.length === 0) { navigate("/metodo/astrologia"); return; }
        setRetos(lista);
      } catch {
        navigate("/metodo/astrologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading || !cargado || !fotosListas) {
    return <RecorridoLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title="Puntos clave"
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 4, total: 8 }}
              mb={0}
              prev={{ label: "← Arquetipos", onClick: () => navigate("/metodo/astrologia/cartaAstral") }}
              extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
              next={{
                label: "Casas →",
                // Antes de pasar a «Casas» intercalamos el cómic de las casas.
                onClick: () => setComicCasasOpen(true),
                disabled: !todosRetosLeidos,
                disabledTooltip: "Lee todos tus puntos clave para continuar.",
              }}
            />
          </Reveal>

          {/* Texto sobre el fondo (área azul), debajo del header y encima del
              box: el box de las estrellas queda solo para las estrellas. */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%"
                  display="flex" flexDirection="column" alignItems="center" gap={3}>
            <Text color={`${astrologiaTxt}ee`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.8" textAlign="center" maxW="560px"
                  style={{ textShadow: `0 0 10px rgba(255,255,255,0.4)` }}>
              Pulsa sobre cada estrella para descubrir tus puntos clave.
            </Text>
            {retos.length > 0 && (
              <Text color={todosRetosLeidos ? astrologiaTxt : `${astrologiaTxt}cc`} fontSize={{ base: "sm", md: "md" }}
                    fontWeight="600" letterSpacing="0.04em" textAlign="center"
                    style={{ textShadow: `0 0 8px ${astrologiaTxt}44` }}>
                {todosRetosLeidos
                  ? "Has leído todos tus puntos clave. Ya puedes continuar a Casas."
                  : `Has leído ${retos.filter((r) => retosLeidos.has(r.id)).length} de ${retos.length} puntos clave.`}
              </Text>
            )}
          </Reveal>

          <Reveal
            direction="up"
            distance={34}
            scaleFrom={0.97}
            delay={0.22}
            duration={0.75}
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${astrologiaTxt}1a, 0 0 48px ${astrologiaTxt}10`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.66)" />

            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 5, md: 7 }}>
              {/* Cielo con las estrellas-reto */}
              {retos.length > 0 ? (
                <Box position="relative" w="100%" h={{ base: "220px", md: "300px" }} px={{ base: 4, md: 8 }} py={{ base: 4, md: 6 }}>
                  {retos.map((r, i) => (
                    <EstrellaReto key={r.id} index={i} pos={starPositions[i]} leido={retosLeidos.has(r.id)} onOpen={() => abrirReto(r)} />
                  ))}
                </Box>
              ) : (
                <Text color={`${astrologiaTxt}aa`} fontSize="md" fontStyle="italic" textAlign="center" mt={8}>
                  Tus puntos clave aparecerán aquí muy pronto.
                </Text>
              )}
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {/* Modal de un reto */}
      <Modal isOpen={!!retoAbierto} onClose={() => setRetoAbierto(null)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(5,8,22,0.7)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent
          bg={astrologiaBg}
          borderRadius="2xl"
          border={`1px solid ${astrologiaTxt}55`}
          boxShadow={`0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${astrologiaTxt}44`}
          overflow="hidden"
          mx={4}
        >
          <SpaceBg overlay="rgba(8,13,30,0.8)" />
          <ModalCloseButton color={astrologiaTxt} zIndex={2} />
          <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 7, md: 9 }}>
            {retoAbierto && (
              <Flex direction="column" gap={4}>
                {retoAbierto.titulo?.trim() && (
                  <>
                    <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.03em" textAlign="center"
                          style={{ textShadow: `0 0 14px rgba(255,255,255,0.5), 0 0 30px ${astrologiaTxt}55` }}>
                      {retoAbierto.titulo}
                    </Text>
                    {/* Separador horizontal elegante: línea con degradado que se desvanece en los bordes */}
                    <Box
                      h="1px"
                      w="55%"
                      maxW="220px"
                      mx="auto"
                      bgGradient={`linear(to-r, transparent, ${astrologiaTxt}aa, transparent)`}
                      boxShadow={`0 0 8px ${astrologiaTxt}55`}
                    />
                  </>
                )}
                <Text color={`${astrologiaTxt}ee`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" whiteSpace="pre-line"
                      style={{ textShadow: `0 0 10px rgba(255,255,255,0.35)` }}>
                  {retoAbierto.texto}
                </Text>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />

      {/* Cómic de las casas: intercalado antes de «Casas». */}
      <ComicPasoModal
        isOpen={comicCasasOpen}
        onClose={() => setComicCasasOpen(false)}
        onContinue={() => navigate("/metodo/astrologia/casas")}
        vinetas={VINETAS_CASAS}
        continueLabel="Casas"
        themeColor={astrologiaTxt}
      />
      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom} precio={20} llamadaTitulo="Reserva tu llamada de astrología" />
      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
