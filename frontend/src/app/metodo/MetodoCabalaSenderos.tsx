import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import ArbolDeLaVida from "../../components/global/ArbolDeLaVida";
import { CabalaSefiraIlustracionModal } from "../../components/metodo/CabalaSefiraIlustracionModal";
import { CABALA_SENDEROS, senderoPorNum } from "../../components/metodo/cabalaSenderos";
import { ilustracionSendero } from "../../components/metodo/cabalaSenderoIlustraciones";
import { CABALA_TOTAL_PAGINAS } from "../../components/metodo/cabalaSefirot";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";

const INK_SHADOW = `0 1px 3px ${cabalaBg}f5, 0 0 8px ${cabalaBg}cc, 0 2px 16px ${cabalaBg}88`;

// Nombre del sendero para el antetítulo del visor (p.ej. «1 · Aleph»).
const nombreSendero = (num: number): string => {
  const s = senderoPorNum[num];
  return s ? `${s.orden} · ${s.letra}` : "Sendero";
};

export default function MetodoCabalaSenderos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Senderos con su ilustración ya vista, y el que se está viendo en el modal.
  const [readNums, setReadNums] = useState<Set<number>>(new Set());
  const [modalNum, setModalNum] = useState<number | null>(null);
  const dataRef = useRef<any>({}); // copia de metodo_cabala.data para mergear al guardar

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }
        try {
          const res = await axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = res.data?.data ?? {};
          const vistos: any[] = Array.isArray(dataRef.current.senderoIlustracionesVistas) ? dataRef.current.senderoIlustracionesVistas : [];
          setReadNums(new Set(vistos.map((n) => Number(n))));
        } catch { /* sin fila todavía */ }
      } catch {
        navigate("/metodo/cabala");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Marca un sendero como visto (badge dorado) y persiste en metodo_cabala.data.
  const marcarLeido = useCallback((num: number) => {
    setReadNums((prev) => {
      if (prev.has(num)) return prev;
      const next = new Set(prev);
      next.add(num);
      const data = { ...dataRef.current, senderoIlustracionesVistas: Array.from(next) };
      dataRef.current = data;
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (userId && token) {
        axios.patch(`${API_URL}/metodo-cabala/${userId}`, { data }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
      }
      return next;
    });
  }, []);

  // El recorrido sendero a sendero se desbloquea cuando están TODOS vistos.
  const todosVistos = CABALA_SENDEROS.every((s) => readNums.has(s.num));
  const primero = CABALA_SENDEROS[0];

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title="Los 22 Senderos"
              pageLabel={`${CABALA_TOTAL_PAGINAS}/${CABALA_TOTAL_PAGINAS}`}
              compact
              bgColor={`${cabalaBg}dd`}
              color={cabalaTxt}
              nom={cabalaNom}
              mb={0}
              prev={{ label: "← Mapa Evolutivo", onClick: () => navigate("/metodo/cabala/diagnostico") }}
              extra={{ label: "El Árbol", onClick: () => navigate("/metodo/cabala/arbol") }}
              next={{
                label: "Recorrer →",
                onClick: () => navigate(`/metodo/cabala/sendero/${primero.num}`),
                disabled: !todosVistos,
                disabledTooltip: "Descubre la ilustración de los 22 senderos para recorrerlos uno a uno",
              }}
            />
          </Reveal>

          <Reveal direction="up" distance={16} delay={0.1} duration={0.6} display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.8" maxW="600px" style={{ textShadow: INK_SHADOW }}>
              Si las sefirot son estados, los senderos son el movimiento entre ellos. Toca cualquiera de los
              22 caminos para ver su ilustración. Cuando los hayas descubierto todos, se desbloqueará el recorrido.
            </Text>
          </Reveal>

          {/* Árbol en modo senderos: al pulsar un camino, se entra en su página */}
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
                variant="senderos"
                readSenderos={readNums}
                onSenderoClick={(s) => setModalNum(s.num)}
              />
            </Box>
          </Reveal>

          {/* Comenzar por el principio — se desbloquea al ver TODAS las ilustraciones */}
          <Reveal direction="up" distance={16} delay={0.26} duration={0.6} display="flex" justifyContent="center">
            <Box as="button"
                 onClick={todosVistos ? () => navigate(`/metodo/cabala/sendero/${primero.num}`) : undefined}
                 disabled={!todosVistos}
                 px={8} py={3} borderRadius="full"
                 bg={todosVistos ? `${cabalaTxt}18` : `${cabalaTxt}0a`}
                 border={`1.5px solid ${todosVistos ? `${cabalaTxt}66` : `${cabalaTxt}2a`}`}
                 color={todosVistos ? cabalaTxt : `${cabalaTxt}66`}
                 fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
                 cursor={todosVistos ? "pointer" : "not-allowed"} transition="all 0.18s"
                 boxShadow={todosVistos ? `0 0 18px ${cabalaTxt}44` : "none"}
                 _hover={todosVistos ? { bg: `${cabalaTxt}2e`, borderColor: cabalaTxt, transform: "translateY(-2px)" } : undefined}>
              {todosVistos
                ? `Comenzar por ${primero.letra} (${primero.hebreo}) →`
                : "Descubre los 22 senderos para empezar"}
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {/* Ilustración (cómic) del sendero pinchado. Al terminarla, se marca visto
          (su badge se enciende en el árbol). */}
      {modalNum !== null && (
        <CabalaSefiraIlustracionModal
          isOpen={modalNum !== null}
          vinetas={ilustracionSendero(modalNum)}
          sefiraNombre={nombreSendero(modalNum)}
          onClose={() => setModalNum(null)}
          onComplete={() => { marcarLeido(modalNum); setModalNum(null); }}
        />
      )}

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />

      <IndiceCabala />
    </Box>
  );
}
