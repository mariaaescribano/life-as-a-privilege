import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg } from "../../components/metodo/SpaceBg";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

interface Reto { id: string; titulo: string; texto: string; }

const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

// Posición (en %) de cada estrella: rejilla con "temblor" determinista por índice,
// para que se repartan por el cielo y no salten al re-renderizar.
function starPos(i: number, total: number): { top: string; left: string } {
  const cols = Math.min(Math.max(Math.ceil(Math.sqrt(total)), 1), 4);
  const rows = Math.max(Math.ceil(total / cols), 1);
  const col = i % cols;
  const row = Math.floor(i / cols);
  const cellW = 100 / cols;
  const cellH = 100 / rows;
  const seeded = (n: number) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const jitterX = (seeded(i * 2 + 1) - 0.5) * cellW * 0.5;
  const jitterY = (seeded(i * 2 + 2) - 0.5) * cellH * 0.5;
  return {
    left: `${cellW * (col + 0.5) + jitterX}%`,
    top: `${cellH * (row + 0.5) + jitterY}%`,
  };
}

// Estrella grande con glow que titila; al pulsarla se abre el reto.
function EstrellaReto({ index, total, onOpen }: { index: number; total: number; onOpen: () => void }) {
  const { top, left } = starPos(index, total);
  const glow = `drop-shadow(0 0 6px ${astrologiaTxt}) drop-shadow(0 0 16px ${astrologiaTxt}cc)`;
  const glowFuerte = `drop-shadow(0 0 12px ${astrologiaTxt}) drop-shadow(0 0 30px ${astrologiaTxt})`;
  return (
    <Box
      as="button"
      onClick={onOpen}
      aria-label="Abrir punto clave"
      position="absolute"
      top={top}
      left={left}
      transform="translate(-50%, -50%)"
      transition="transform 0.25s ease"
      cursor="pointer"
      zIndex={2}
      _hover={{ transform: "translate(-50%, -50%) scale(1.18)" }}
      sx={{
        "@keyframes retoTwinkle": {
          "0%, 100%": { filter: glow, opacity: 0.9 },
          "50%": { filter: glowFuerte, opacity: 1 },
        },
      }}
    >
      <Box
        as="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        w={{ base: "42px", md: "56px" }}
        h={{ base: "42px", md: "56px" }}
        fill={astrologiaTxt}
        style={{ animation: "retoTwinkle 3s ease-in-out infinite", animationDelay: `${(index % 5) * 0.45}s` }}
      >
        {/* Estrella de 8 puntas (octograma) con rayos finos y elegantes. */}
        <path d="M12 1 L13.53 8.30 L19.78 4.22 L15.70 10.47 L23 12 L15.70 13.53 L19.78 19.78 L13.53 15.70 L12 23 L10.47 15.70 L4.22 19.78 L8.30 13.53 L1 12 L8.30 10.47 L4.22 4.22 L10.47 8.30 Z" />
      </Box>
    </Box>
  );
}

export default function MetodoAstrologiaLectura() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [retos, setRetos] = useState<Reto[]>([]);
  const [retoAbierto, setRetoAbierto] = useState<Reto | null>(null);
  const [comicOpen, setComicOpen] = useState(false);

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

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
            title="Puntos clave"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            step={{ current: 4, total: 6 }}
            mb={0}
            prev={{ label: "← Arquetipos", onClick: () => navigate("/metodo/astrologia/cartaAstral") }}
            extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
            next={{ label: "Casas →", onClick: () => navigate("/metodo/astrologia/casas") }}
          />

          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}44`}
            boxShadow={`0 0 22px rgba(255,255,255,0.15), 0 0 50px rgba(255,255,255,0.08), 0 0 30px ${astrologiaTxt}1a`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.66)" />

            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 5, md: 7 }}>
              <Flex direction="column" align="center" gap={3}>
                <Text color={`${astrologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.8" textAlign="center" maxW="560px"
                      style={{ textShadow: `0 0 10px rgba(255,255,255,0.4)` }}>
                  Pulsa sobre cada estrella para descubrir tus puntos clave.
                </Text>
              </Flex>

              {/* Cielo con las estrellas-reto */}
              {retos.length > 0 ? (
                <Box position="relative" w="100%" h={{ base: "220px", md: "300px" }} mt={{ base: 4, md: 5 }} px={{ base: 4, md: 8 }} py={{ base: 4, md: 6 }}>
                  {retos.map((r, i) => (
                    <EstrellaReto key={r.id} index={i} total={retos.length} onOpen={() => setRetoAbierto(r)} />
                  ))}
                </Box>
              ) : (
                <Text color={`${astrologiaTxt}aa`} fontSize="md" fontStyle="italic" textAlign="center" mt={8}>
                  Tus puntos clave aparecerán aquí muy pronto.
                </Text>
              )}
            </Box>
          </Box>
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
                {retoAbierto.titulo.trim() && (
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
      <SiteFooter />
    </Box>
  );
}
