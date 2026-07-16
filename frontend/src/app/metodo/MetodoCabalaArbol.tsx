import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import ArbolDeLaVida, { type Sefira } from "../../components/global/ArbolDeLaVida";
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import { CABALA_SEFIROT_ORDEN, CABALA_TOTAL_PAGINAS } from "../../components/metodo/cabalaSefirot";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";

const INK_SHADOW = `0 1px 3px ${cabalaBg}f5, 0 0 8px ${cabalaBg}cc, 0 2px 16px ${cabalaBg}88`;

// Nodos del Árbol (las 10 sefirot con círculo). Da'at es una dimensión numerada
// del recorrido pero NO tiene nodo en el árbol, así que no cuenta para el tick.
const TREE_KEYS = CABALA_SEFIROT_ORDEN.filter((k) => k !== "daat");
const TOTAL_SEFIROT = TREE_KEYS.length; // 10

export default function MetodoCabalaArbol() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);
  const [vistas, setVistas] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!token || !userId) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        // Acceso solo con Cábala pagada; si no, volvemos a la intro (que abre el pago).
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }

        // Progreso: qué dimensiones (sefirot) ya ha visto el usuario.
        try {
          const res = await axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const v = res.data?.data?.sefirotVistas;
          if (Array.isArray(v)) setVistas(v);
        } catch { /* sin progreso todavía */ }
      } catch {
        navigate("/metodo/cabala");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const nVistas = vistas.filter((k) => TREE_KEYS.includes(k as any)).length;
  const completado = nVistas >= TOTAL_SEFIROT;

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          {/* Header con botón "Ilustraciones" en medio y tick/progreso arriba a la derecha */}
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <Box position="relative" w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
                title="El Árbol de la Vida"
                pageLabel={`2/${CABALA_TOTAL_PAGINAS}`}
                compact
                bgColor={`${cabalaBg}dd`}
                color={cabalaTxt}
                nom={cabalaNom}
                mb={0}
                prev={{ label: "← Introducción", onClick: () => navigate("/metodo/cabala") }}
                extra={{ label: "Ilustraciones", onClick: () => setIlustracionesOpen(true) }}
              />
              {/* Progreso / tick de completado */}
              <Flex
                position="absolute"
                top={{ base: 2, md: 3 }}
                right={{ base: 2, md: 3 }}
                zIndex={2}
                align="center"
                gap={1.5}
                px={2.5}
                py={1}
                borderRadius="full"
                bg={`${cabalaBg}cc`}
                border={`1.5px solid ${completado ? cabalaTxt : `${cabalaTxt}66`}`}
                boxShadow={completado ? `0 0 16px ${cabalaTxt}88` : "none"}
                sx={{ backdropFilter: "blur(4px)" }}
              >
                {completado && (
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill={cabalaTxt}>
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                )}
                <Text color={completado ? cabalaTxt : `${cabalaTxt}aa`} fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase">
                  {completado ? "Completado" : `${nVistas}/${TOTAL_SEFIROT}`}
                </Text>
              </Flex>
            </Box>
          </Reveal>

          {/* ── Guía ── */}
          <Reveal direction="up" distance={16} delay={0.1} duration={0.6} display="flex" justifyContent="center">
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic"
              letterSpacing="0.04em"
              textAlign="center"
              maxW="560px"
              style={{ textShadow: INK_SHADOW }}
            >
              Toca cada sefirá para descubrir su dimensión. Cuando las hayas visto todas, el Árbol quedará completo.
            </Text>
          </Reveal>

          {/* ── Árbol de la Vida (dinámico) ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.97} delay={0.18} duration={0.8} w="100%">
            <Box
              w="100%"
              boxShadow={`0 4px 20px rgba(0,0,0,0.22), 0 0 22px ${cabalaTxt}55`}
              bg={cabalaBg}
              border={`1.5px solid ${cabalaTxt}55`}
              borderRadius="3xl"
              px={{ base: 6, md: 10 }}
              pt={{ base: 8, md: 10 }}
              pb={{ base: 8, md: 10 }}
            >
              <ArbolDeLaVida
                suppressInternalModal
                onSefiraClick={(s: Sefira) => navigate(`/metodo/cabala/sefira/${s.key}`)}
              />
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      <CabalaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />

      <SiteFooter />
    </Box>
  );
}
