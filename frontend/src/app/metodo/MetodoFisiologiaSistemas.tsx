import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { FotoBox } from "../../components/metodo/FotoBox";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { SistemaModal } from "../../components/metodo/SistemaModal";
import { Reveal } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx} from "../../GlobalVariables";
import { SISTEMAS, type Sistema } from "../../hardCoded/espacio/SistemasFisiologia";

// Tarjeta de un sistema: box por defecto (FotoBox), imagen arriba + nombre abajo.
function SistemaBox({
  sistema,
  visto = false,
  onClick,
}: {
  sistema: Sistema;
  /** true si el usuario ya ha abierto su viñeta → muestra el check. */
  visto?: boolean;
  onClick: () => void;
}) {
  return (
    <FotoBox
      titulo={sistema.label}
      foto={sistema.foto}
      nom={fisiologiaNom}
      tinta={fisiologiaTxt}
      bg={fisiologiaBg}
      visto={visto}
      colorTint={`${sistema.color}22`}
      onClick={onClick}
    />
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
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px">
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
                <SistemaBox sistema={s} visto={vistos.has(s.key)} onClick={() => verSistema(s)} />
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
