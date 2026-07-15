import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { ALIMENTOS, GRUPOS_ALIMENTOS, type Alimento, type GrupoAlimento } from "../../hardCoded/espacio/AlimentosNutricion";

// Tarjeta de un alimento (mismo aspecto que las de nutrientes): emoji/foto,
// nombre y frase corta. Tick verde arriba a la derecha si ya lo has abierto.
function AlimentoBox({ a, visto, onClick, delay }: { a: Alimento; visto: boolean; onClick: () => void; delay: number }) {
  return (
    <Reveal direction="up" distance={20} delay={delay} duration={0.5} w="100%" display="flex">
      <Box
        as="button"
        onClick={onClick}
        position="relative"
        overflow="hidden"
        w="100%"
        h="100%"
        borderRadius="2xl"
        cursor="pointer"
        fontFamily="'EB Garamond', serif"
        transition="all 0.2s ease"
        boxShadow="0 4px 16px rgba(0,0,0,0.22), 0 0 14px rgba(255,255,255,0.12)"
        _hover={{ transform: "translateY(-4px)", boxShadow: "0 10px 30px rgba(0,0,0,0.32), 0 0 22px rgba(255,255,255,0.35)" }}
        _active={{ transform: "translateY(-1px)" }}
      >
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}55`} />

        {visto && (
          <Flex position="absolute" top="9px" right="9px" zIndex={2} align="center" justify="center"
                w="24px" h="24px" borderRadius="full" bg={nutricionTxt}
                boxShadow={`0 0 10px ${nutricionTxt}, 0 1px 4px rgba(0,0,0,0.5)`}>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill={nutricionBg}>
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </Box>
          </Flex>
        )}

        <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 2, md: 2.5 }}
              p={{ base: 4, md: 5 }} h="100%">
          <Flex w="100%" aspectRatio={1} borderRadius="xl" overflow="hidden" flexShrink={0}
                bg={`${nutricionTxt}12`} boxShadow="0 0 12px rgba(255,255,255,0.12)"
                align="center" justify="center" fontSize={{ base: "44px", md: "60px" }} lineHeight="1">
            <span role="img" aria-label={a.nombre}>{a.emoji ?? a.nombre.charAt(0)}</span>
          </Flex>
          <Text color={nutricionTxt} fontWeight="700" lineHeight="1.2" textAlign="center"
                fontSize={{ base: "sm", md: "md" }} letterSpacing="0.02em"
                style={{ textShadow: `0 1px 4px ${nutricionBg}` }}>
            {a.nombre}
          </Text>
          <Text color={`${nutricionTxt}cc`} fontSize={{ base: "3xs", md: "2xs" }} fontStyle="italic"
                textAlign="center" lineHeight="1.35">
            {a.resumen}
          </Text>
        </Flex>
      </Box>
    </Reveal>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionAlimentos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [grupo, setGrupo] = useState<GrupoAlimento>(GRUPOS_ALIMENTOS[0].key);
  const [vistos, setVistos] = useState<string[]>([]);
  const dataRef = useRef<Record<string, any>>({});

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
          const guardados = dataRef.current?.alimentos_vistos;
          if (Array.isArray(guardados)) setVistos(guardados);
        } catch { /* sin fila todavía */ }
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  const abrir = (a: Alimento) => {
    if (!vistos.includes(a.key)) {
      const nuevos = [...vistos, a.key];
      setVistos(nuevos);
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (userId && token) {
        const data = { ...dataRef.current, alimentos_vistos: nuevos };
        dataRef.current = data;
        axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
          { headers: { Authorization: `Bearer ${token}` } }).catch(() => { /* se reintenta */ });
      }
    }
    navigate(`/metodo/nutricion/alimentos/${a.key}`);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  const vistosSet = new Set(vistos);
  const delGrupo = ALIMENTOS.filter((a) => a.grupo === grupo);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="Biblioteca de alimentos"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Los nutrientes", onClick: () => navigate("/metodo/nutricion/nutrientes") }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Elige un alimento y descubre de qué moléculas está hecho, y qué hace cada una dentro de ti.
            </Text>
          </Reveal>

          {/* Pestañas de grupo */}
          <Reveal direction="up" distance={12} delay={0.16} duration={0.5} w="100%" display="flex" justifyContent="center">
            <Flex wrap="wrap" justify="center" gap={{ base: 2, md: 2.5 }}>
              {GRUPOS_ALIMENTOS.map((g) => {
                const activo = g.key === grupo;
                return (
                  <Box
                    as="button"
                    key={g.key}
                    onClick={() => setGrupo(g.key)}
                    px={{ base: 3.5, md: 4 }}
                    py={{ base: 1.5, md: 2 }}
                    borderRadius="full"
                    fontFamily="'EB Garamond', serif"
                    fontWeight={700}
                    fontSize={{ base: "xs", md: "sm" }}
                    letterSpacing="0.02em"
                    cursor="pointer"
                    transition="all 0.18s"
                    color={activo ? nutricionBg : nutricionTxt}
                    bg={activo ? nutricionTxt : `${nutricionBg}cc`}
                    border={`1px solid ${nutricionTxt}${activo ? "" : "44"}`}
                    boxShadow={activo ? `0 2px 12px ${nutricionTxt}55` : "0 1px 6px rgba(0,0,0,0.18)"}
                    _hover={{ transform: "translateY(-1px)", bg: activo ? nutricionTxt : nutricionBg }}
                  >
                    {g.label}
                  </Box>
                );
              })}
            </Flex>
          </Reveal>

          {/* Rejilla de alimentos del grupo activo */}
          {delGrupo.length > 0 ? (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 5 }} w="100%">
              {delGrupo.map((a, i) => (
                <AlimentoBox key={a.key} a={a} visto={vistosSet.has(a.key)} delay={0.04 * i} onClick={() => abrir(a)} />
              ))}
            </SimpleGrid>
          ) : (
            <Reveal direction="up" distance={12} delay={0.2} duration={0.5} display="flex" justifyContent="center">
              <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    textAlign="center" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                Pronto añadiremos alimentos de este grupo.
              </Text>
            </Reveal>
          )}

        </Flex>
      </Flex>

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
