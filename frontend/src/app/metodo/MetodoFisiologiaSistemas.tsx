import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { SistemaModal } from "../../components/metodo/SistemaModal";
import { Reveal } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx} from "../../GlobalVariables";
import { SISTEMAS, type Sistema } from "../../hardCoded/espacio/SistemasFisiologia";

// Tarjeta de un sistema: imagen arriba + nombre. Se colocan en rejilla de 3.
function SistemaBox({
  sistema,
  active,
  visto = false,
  onClick,
}: {
  sistema: Sistema;
  active: boolean;
  /** true si el usuario ya ha abierto su viñeta → muestra el check. */
  visto?: boolean;
  onClick: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Box
      as="button"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      w="100%"
      h="100%"
      borderRadius="2xl"
      border={`1px solid ${active || visto ? fisiologiaTxt : `${fisiologiaTxt}44`}`}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      transition="all 0.2s ease"
      boxShadow={active
        ? `0 6px 24px rgba(0,0,0,0.3), 0 0 24px ${sistema.color}, 0 0 14px ${fisiologiaTxt}66`
        : visto
        ? `0 4px 18px rgba(0,0,0,0.22), 0 0 22px ${fisiologiaTxt}66`
        : `0 4px 16px rgba(0,0,0,0.22), 0 0 14px ${fisiologiaTxt}1f`}
      _hover={{ transform: "translateY(-4px)", borderColor: `${fisiologiaTxt}aa`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.32), 0 0 22px ${sistema.color}` }}
      _active={{ transform: "translateY(-1px)" }}
    >
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

      {/* Sello de "viñeta ya leída" */}
      {visto && (
        <Flex position="absolute" top="9px" right="9px" zIndex={2} align="center" justify="center"
              w="24px" h="24px" borderRadius="full" bg={fisiologiaTxt}
              boxShadow={`0 0 10px ${fisiologiaTxt}, 0 1px 4px rgba(0,0,0,0.5)`}>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill="#1a1226">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </Box>
        </Flex>
      )}
      <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 3, md: 4 }}
            p={{ base: 4, md: 6 }} h="100%">
        {/* Imagen cuadrada del sistema → de momento inicial con color de acento */}
        <Box w="100%" aspectRatio={1} borderRadius="xl" overflow="hidden" flexShrink={0}
             bg={`${sistema.color}22`} border={`1px solid ${sistema.color}66`}
             boxShadow={`0 0 12px ${sistema.color}44`}
             display="flex" alignItems="center" justifyContent="center">
          {!imgErr ? (
            <Image src={encodeURI(sistema.foto)} alt={sistema.label} w="100%" h="100%" objectFit="cover"
                   onError={() => setImgErr(true)} />
          ) : (
            <Text color={fisiologiaTxt} fontWeight="800" fontSize={{ base: "3xl", md: "4xl" }}
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
              {sistema.label.charAt(0)}
            </Text>
          )}
        </Box>
        <Text color={fisiologiaTxt} fontWeight="700" lineHeight="1.25" textAlign="center"
              fontSize={{ base: "lg", md: "2xl" }} letterSpacing="0.02em"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.65), 0 0 10px rgba(0,0,0,0.4)" }}>
          {sistema.label}
        </Text>
      </Flex>
    </Box>
  );
}

// Clave en metodo_fisiologia.data donde guardamos los sistemas ya vistos.
const SISTEMAS_VISTOS_KEY = "sistemas_vistos";

export default function MetodoFisiologiaSistemas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sistema, setSistema] = useState<Sistema | null>(null);
  const [vistos, setVistos] = useState<Set<string>>(new Set());
  const dataRef = useRef<Record<string, any>>({});
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  // La rejilla de sistemas aparece UNA A UNA en cuanto la página está lista.
  // (No usamos useInView porque la rejilla solo se monta tras el loading y el
  //  observer del nivel superior se engancharía antes de que exista → no se
  //  vería nada.)
  const reduce = useReducedMotion();
  const [gridEnter, setGridEnter] = useState(false);

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
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }

        // Cargamos los sistemas ya vistos para retomar el camino (checks).
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardados: string[] = dataRef.current?.[SISTEMAS_VISTOS_KEY] ?? [];
          if (Array.isArray(guardados) && guardados.length) setVistos(new Set(guardados));
        } catch { /* sin fila todavía */ }

        // No mostramos la página hasta que TODAS las fotos de los sistemas estén
        // descargadas, para que la rejilla no se rellene de golpe después.
        await precargarImagenes(SISTEMAS.map((s) => encodeURI(s.foto)));
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // Abre la viñeta de un sistema y lo marca como visto (se guarda en BD). Se usa
  // tanto al pulsar la tarjeta como al navegar con las flechas dentro del modal.
  const verSistema = (s: Sistema) => {
    setSistema(s);
    if (vistos.has(s.key)) return;
    const next = new Set(vistos);
    next.add(s.key);
    setVistos(next);
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const data = { ...dataRef.current, [SISTEMAS_VISTOS_KEY]: Array.from(next) };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => { /* se reintenta la próxima vez */ });
  };

  // En cuanto la página deja de cargar, dejamos que las tarjetas entren
  // escalonadas (un frame después, para que la transición se aprecie).
  useEffect(() => {
    if (loading) return;
    if (reduce) { setGridEnter(true); return; }
    const id = requestAnimationFrame(() => setGridEnter(true));
    return () => cancelAnimationFrame(id);
  }, [loading, reduce]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Sistemas"
            pageLabel="3/4"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Las células", onClick: () => navigate("/metodo/fisiologia/todas-tus-celulas") }}
            extra={celulasBtn}
            next={{ label: "El cuerpo →", onClick: () => navigate("/metodo/fisiologia/organismo"),
                    disabled: vistos.size < SISTEMAS.length,
                    disabledTooltip: "Primero lee todos los sistemas" }}
          />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Varios órganos que colaboran forman un sistema. Pulsa cada sistema para conocerlo.
            </Text>
          </Reveal>

          {/* ── Rejilla de sistemas: 3 por fila (2 en móvil). Las tarjetas
              aparecen una a una al hacer scroll (fundido + subida escalonada). ── */}
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
            {SISTEMAS.map((s, i) => (
              <Box key={s.key}
                   opacity={gridEnter ? 1 : 0}
                   transform={gridEnter ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)"}
                   transition="opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)"
                   sx={{ transitionDelay: `${i * 0.07}s` }}>
                <SistemaBox sistema={s} active={sistema?.key === s.key} visto={vistos.has(s.key)} onClick={() => verSistema(s)} />
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Flex>

      {/* Modal inmersivo del sistema: imagen + descripción, con flechas para
          moverse entre sistemas sin cerrar. */}
      <SistemaModal sistema={sistema} sistemas={SISTEMAS} onSelect={verSistema} onClose={() => setSistema(null)} />

      {celulasModal}
      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
