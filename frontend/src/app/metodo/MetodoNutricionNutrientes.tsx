import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Flex, Text, SimpleGrid,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon,
} from "../../GlobalVariables";
import { NUTRIENTES, type Nutriente } from "../../hardCoded/espacio/NutrientesNutricion";

const MBox = motion(Box);
const INK = `0 1px 3px rgba(20,32,20,0.9), 0 0 8px rgba(20,32,20,0.7)`;

// ── Detalle de un nutriente (dentro del modal) ───────────────────────────────
function NutrienteDetalle({ n }: { n: Nutriente }) {
  return (
    <Flex direction="column" gap={5}>
      <Flex align="center" gap={3}>
        <Box fontSize={{ base: "40px", md: "48px" }} lineHeight="1">{n.emoji}</Box>
        <Box>
          <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" lineHeight="1.1"
                style={{ textShadow: INK }}>
            {n.label}
          </Text>
          <Text color={n.color} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" fontWeight="600">
            {n.resumen}
          </Text>
        </Box>
      </Flex>

      <Box h="1px" bgGradient={`linear(to-r, ${n.color}, transparent)`} />

      {/* Tipos */}
      <Box>
        <Text color={n.color} fontSize="xs" fontWeight="800" letterSpacing="0.14em"
              textTransform="uppercase" mb={2.5}>
          Tipos
        </Text>
        <Flex direction="column" gap={2.5}>
          {n.tipos.map((t) => (
            <Box key={t.nombre} pl={3} borderLeft={`2px solid ${n.color}88`}>
              <Text color="white" fontWeight="700" fontSize={{ base: "sm", md: "md" }}>{t.nombre}</Text>
              <Text color="rgba(255,255,255,0.82)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                {t.desc}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Qué hacen */}
      <Box>
        <Text color={n.color} fontSize="xs" fontWeight="800" letterSpacing="0.14em"
              textTransform="uppercase" mb={2.5}>
          Qué hacen
        </Text>
        <Flex direction="column" gap={2}>
          {n.queHacen.map((q, i) => (
            <Flex key={i} gap={2.5} align="flex-start">
              <Box mt="9px" w="6px" h="6px" borderRadius="full" bg={n.color} flexShrink={0}
                   sx={{ boxShadow: `0 0 8px ${n.color}` }} />
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.65">
                {q}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* Dónde encontrarlo */}
      <Box>
        <Text color={n.color} fontSize="xs" fontWeight="800" letterSpacing="0.14em"
              textTransform="uppercase" mb={2.5}>
          Dónde encontrarlo
        </Text>
        <Flex wrap="wrap" gap={2}>
          {n.donde.map((d) => (
            <Box key={d} px={3} py={1.5} borderRadius="full" bg={`${n.color}22`}
                 border={`1px solid ${n.color}66`}>
              <Text color="white" fontSize={{ base: "xs", md: "sm" }} fontWeight="600">{d}</Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionNutrientes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [explorados, setExplorados] = useState<string[]>([]);
  const [abierto, setAbierto] = useState<Nutriente | null>(null);
  const dataRef = useRef<Record<string, any>>({});

  const total = NUTRIENTES.length;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito && !testEnabled) { navigate("/metodo/nutricion"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardados = dataRef.current?.nutrientes_explorados;
          if (Array.isArray(guardados)) setExplorados(guardados);
        } catch { /* sin fila todavía */ }
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  const guardar = async (nuevos: string[]) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const data = {
      ...dataRef.current,
      nutrientes_explorados: nuevos,
      nutrientes_hecho: nuevos.length >= total,
    };
    dataRef.current = data;
    try {
      await axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* se reintenta al próximo toque */ }
  };

  const abrir = (n: Nutriente) => {
    setAbierto(n);
    if (!explorados.includes(n.key)) {
      const nuevos = [...explorados, n.key];
      setExplorados(nuevos);
      void guardar(nuevos);
    }
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  const exploradosSet = new Set(explorados);
  const completo = explorados.length >= total;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
            title="Los nutrientes"
            compact
            maxW="1000px"
            bgColor={`${nutricionBg}dd`}
            color={nutricionTxt}
            nom={nutricionNom}
            mb={0}
            prev={{ label: "← Introducción", onClick: () => navigate("/metodo/nutricion/intro") }}
          />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={2}>
              <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    textAlign="center" lineHeight="1.8" maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                Toca cada grupo para descubrir sus tipos, qué hacen dentro de ti y dónde encontrarlo.
              </Text>
              <Text color={completo ? "#bff0b3" : "rgba(255,255,255,0.8)"} fontSize="xs" fontWeight="700"
                    letterSpacing="0.12em" textTransform="uppercase">
                {completo ? "✓ Los has explorado todos" : `Explorados · ${explorados.length}/${total}`}
              </Text>
            </Flex>
          </Reveal>

          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 5 }} w="100%">
            {NUTRIENTES.map((n, i) => {
              const visto = exploradosSet.has(n.key);
              return (
                <Reveal key={n.key} direction="up" distance={20} delay={0.06 * i} duration={0.55} w="100%">
                  <MBox
                    as="button"
                    onClick={() => abrir(n)}
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    w="100%" h="100%" textAlign="center"
                    borderRadius="2xl" overflow="hidden" position="relative"
                    bg={`${n.color}1f`}
                    border={`1.5px solid ${n.color}${visto ? "cc" : "66"}`}
                    sx={{ boxShadow: `0 0 18px ${n.color}33, inset 0 0 30px ${n.color}12` }}
                    px={{ base: 3, md: 5 }} py={{ base: 5, md: 7 }}
                  >
                    {visto && (
                      <Box position="absolute" top={2.5} right={2.5} w={{ base: "20px", md: "22px" }} h={{ base: "20px", md: "22px" }}
                           borderRadius="full" bg={n.color} display="flex" alignItems="center" justifyContent="center"
                           sx={{ boxShadow: `0 0 10px ${n.color}` }}>
                        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                             w="14px" h="14px" fill="#12210f">
                          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </Box>
                      </Box>
                    )}
                    <Box fontSize={{ base: "40px", md: "52px" }} lineHeight="1" mb={2}>{n.emoji}</Box>
                    <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="800" lineHeight="1.15"
                          style={{ textShadow: INK }}>
                      {n.label}
                    </Text>
                    <Text color="rgba(255,255,255,0.78)" fontSize={{ base: "2xs", md: "xs" }} lineHeight="1.4" mt={1}>
                      {n.resumen}
                    </Text>
                  </MBox>
                </Reveal>
              );
            })}
          </SimpleGrid>
        </Flex>
      </Flex>

      {/* Modal de detalle */}
      <Modal isOpen={!!abierto} onClose={() => setAbierto(null)} size={{ base: "sm", md: "lg" }} isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(8px)" }} />
        <ModalContent bg="#0a3d3d" border={`1px solid ${abierto?.color ?? "#fff"}55`} borderRadius="2xl"
                      boxShadow={`0 16px 60px rgba(0,0,0,0.5), 0 0 40px ${abierto?.color ?? "#fff"}22`}
                      mx={{ base: 4, md: 0 }} fontFamily="'EB Garamond', serif" overflow="hidden">
          <ModalCloseButton color="white" />
          <ModalBody px={{ base: 6, md: 9 }} py={{ base: 7, md: 9 }}>
            <AnimatePresence mode="wait">
              {abierto && (
                <MBox key={abierto.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                  <NutrienteDetalle n={abierto} />
                </MBox>
              )}
            </AnimatePresence>
          </ModalBody>
        </ModalContent>
      </Modal>

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
