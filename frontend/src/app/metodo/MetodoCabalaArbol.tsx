import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import ArbolDeLaVida, { type Sefira } from "../../components/global/ArbolDeLaVida";
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import { CabalaSefiraIlustracionModal } from "../../components/metodo/CabalaSefiraIlustracionModal";
import { CABALA_TOTAL_PAGINAS, type CabalaPageKey } from "../../components/metodo/cabalaSefirot";
import {
  CABALA_ILUSTRACIONES_KEYS,
  CABALA_ILUSTRACIONES_VINETAS,
  CABALA_ILUSTRACIONES_VINETA_KEYS,
} from "../../components/metodo/cabalaIlustraciones";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";

// Ojo del botón "Ilustraciones" (se pinta a la izquierda del texto).
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="16" height="16" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))", flexShrink: 0 }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </svg>
);

export default function MetodoCabalaArbol() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);
  // Sefirot con su ilustración ya leída, y la que se está viendo en el modal.
  const [readKeys, setReadKeys] = useState<Set<string>>(new Set());
  const [modalKey, setModalKey] = useState<CabalaPageKey | null>(null);
  const dataRef = useRef<any>({}); // copia de metodo_cabala.data para mergear al guardar

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

        // Cargamos qué ilustraciones ha leído ya (para pintar sus sellos).
        try {
          const res = await axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = res.data?.data ?? {};
          const vistas: string[] = Array.isArray(dataRef.current.ilustracionesVistas) ? dataRef.current.ilustracionesVistas : [];
          setReadKeys(new Set(vistas));
        } catch { /* sin fila todavía */ }
      } catch {
        navigate("/metodo/cabala");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Marca una sefirá como leída (sello) y persiste en metodo_cabala.data.
  const marcarLeida = useCallback((key: CabalaPageKey) => {
    setReadKeys((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      const data = { ...dataRef.current, ilustracionesVistas: Array.from(next) };
      dataRef.current = data;
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (userId && token) {
        axios.patch(`${API_URL}/metodo-cabala/${userId}`, { data }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
      }
      return next;
    });
  }, []);

  // El recorrido se desbloquea cuando están TODAS leídas.
  const todasLeidas = CABALA_ILUSTRACIONES_KEYS.every((k) => readKeys.has(k));

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" fontFamily="'EB Garamond', serif"
         bg="#008080">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          {/* Header con botón "Ilustraciones" en medio */}
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
                extra={{ label: "Ilustraciones", onClick: () => setIlustracionesOpen(true), icon: <EyeIcon /> }}
                next={{
                  label: "Keter →",
                  onClick: () => navigate("/metodo/cabala/sefira/kether"),
                  disabled: !todasLeidas,
                  disabledTooltip: "Descubre la ilustración de todas las sefirot para desbloquear el recorrido",
                }}
              />
            </Box>
          </Reveal>

          {/* ── Árbol de la Vida (dinámico) ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.97} delay={0.18} duration={0.8} w="100%">
            <Box
              w="100%"
              position="relative"
              overflow="hidden"
              boxShadow={`0 10px 40px rgba(0,0,0,0.45), 0 0 40px ${cabalaTxt}44, inset 0 0 60px ${cabalaBg}`}
              border={`1.5px solid ${cabalaTxt}66`}
              borderRadius="3xl"
              px={{ base: 6, md: 10 }}
              pt={{ base: 8, md: 10 }}
              pb={{ base: 8, md: 10 }}
            >
              {/* Fondo del box = imagen de la disciplina (cabala.png). El fondo de
                  la página se queda turquesa; la nebulosa vive dentro del box. */}
              <DisciplinaBgLayer nom={cabalaNom} borderRadius="3xl" overlay="rgba(6,3,1,0.55)" />
              <Box position="relative" zIndex={1}>
                <ArbolDeLaVida
                  suppressInternalModal
                  showDaat
                  readKeys={readKeys}
                  onDaatClick={() => setModalKey("daat")}
                  onSefiraClick={(s: Sefira) => setModalKey(s.key as CabalaPageKey)}
                />
              </Box>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      <CabalaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      {/* Ilustración (cómic) de la sefirá pinchada. Al terminarla, se marca leída
          (aparece su sello en el Árbol). */}
      {modalKey && (
        <CabalaSefiraIlustracionModal
          isOpen={!!modalKey}
          vinetas={CABALA_ILUSTRACIONES_VINETAS}
          initialIndex={Math.max(0, CABALA_ILUSTRACIONES_VINETA_KEYS.indexOf(modalKey))}
          onPageView={(i) => marcarLeida(CABALA_ILUSTRACIONES_VINETA_KEYS[i])}
          onClose={() => setModalKey(null)}
          onComplete={() => setModalKey(null)}
        />
      )}

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />

      <SiteFooter />

      <IndiceCabala />
    </Box>
  );
}
