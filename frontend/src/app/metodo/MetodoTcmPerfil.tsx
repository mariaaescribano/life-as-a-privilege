import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, elementoPredominante,
  balanceElemento, conteoBalance, viajeCompleto,
  type DatosTcm, type Elemento, type Balance,
} from "../../components/metodo/tcmRecorrido";
import { ICONO_ELEMENTO, FOTO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";
import { TcmEstrellaDetalle } from "../../components/metodo/TcmEstrellaDetalle";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// ── Estado de cada elemento (leído de los tests de balance) ──────────────────
const ESTADO_LABEL: Record<Balance, string> = {
  equilibrio: "En equilibrio",
  exceso: "En exceso",
  deficiencia: "En deficiencia",
};
// Verde = equilibrio, rojo = exceso, ámbar = deficiencia (misma paleta de los elementos).
const ESTADO_COLOR: Record<Balance, string> = {
  equilibrio: "#6f9463",
  exceso: "#d1495b",
  deficiencia: "#c8963e",
};

export default function MetodoTcmPerfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }

        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: DatosTcm = res.data?.data ?? {};
        // El perfil completo requiere haber recorrido los cinco elementos.
        if (!viajeCompleto(d)) { navigate("/metodo/tcm/elementos"); return; }
        setData(d);
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const predominante = useMemo(() => elementoPredominante(data), [data]);

  // Estado (equilibrio/exceso/deficiencia) y nivel de desequilibrio (0–1) de cada
  // elemento, a partir de sus respuestas de balance. `nivel` = proporción de
  // respuestas de exceso/deficiencia sobre el total → es la altura de la columna.
  const estados = useMemo(() => {
    const out: Partial<Record<Elemento, { balance: Balance | null; nivel: number | null }>> = {};
    for (const el of ORDEN_ELEMENTOS) {
      const r = data.elementos?.[el]?.miniTest?.respuestas;
      const c = conteoBalance(el, r);
      out[el] = {
        balance: balanceElemento(el, r),
        nivel: c.total === 0 ? null : (c.exceso + c.deficiencia) / c.total,
      };
    }
    return out;
  }, [data]);

  const reduce = useReducedMotion();

  // No quitamos el spinner hasta que estén descargados los iconos/fotos de los
  // elementos Y el fondo de disciplina, para que ni la página ni las barras
  // aparezcan/animen hasta que los fondos ya se vean.
  const iconosListos = usePrecargarImagenes([
    "/img/fondos/tcm.png",
    ...ORDEN_ELEMENTOS.map((el) => ICONO_ELEMENTO[el]),
    ...ORDEN_ELEMENTOS.map((el) => FOTO_ELEMENTO[el]),
  ]);

  // Las barras suben una a una en cuanto la página está lista (fotos cargadas).
  // No usamos useInView: su observer se montaba durante el spinner (con el ref
  // aún a null) y nunca llegaba a observar las barras → no se animaban nunca.
  const [barrasEnter, setBarrasEnter] = useState(false);
  useEffect(() => {
    if (reduce) { setBarrasEnter(true); return; }
    if (!loading && iconosListos) {
      const t = setTimeout(() => setBarrasEnter(true), 120);
      return () => clearTimeout(t);
    }
  }, [loading, iconosListos, reduce]);

  if (loading || !iconosListos) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1080px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Tu equilibrio"
            pageLabel="3/8"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Los 5 elementos", onClick: () => navigate("/metodo/tcm/elementos") }}
            extra={ilustracionesBtn}
            next={{ label: "Los ciclos →", onClick: () => navigate("/metodo/tcm/ciclos") }}
          />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                textAlign="center" maxW="620px" style={{ textShadow: INK_SHADOW }}>
            Eres un equilibrio entre los Cinco Elementos. Este es tu punto de partida para recuperar tu armonía. Cuanta más altura, más desequilibrio hay en dicho Elemento. Los que están vacíos es que están equilibrados.
          </Text>
          </Reveal>

          {/* ── Box 1 · Columnas por estado (equilibrio = barra vacía) ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.98} delay={0.2} duration={0.7} w="100%">
          <Panel titulo="" color={tcmTxt} full>
            {/* Leyenda de estados */}
            <Flex justify="center" gap={{ base: 3, md: 6 }} wrap="wrap" mb={5}>
              {(["equilibrio", "exceso", "deficiencia"] as Balance[]).map((b) => (
                <Flex key={b} align="center" gap={2}>
                  <Box w="12px" h="12px" borderRadius="sm" bg={ESTADO_COLOR[b]}
                       style={{ boxShadow: `0 0 8px ${ESTADO_COLOR[b]}` }} />
                  <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "2xs", md: "xs" }} fontWeight={600}>
                    {ESTADO_LABEL[b]}
                  </Text>
                </Flex>
              ))}
            </Flex>

            <Box>
              {/* Zona de barras */}
              <Box h={{ base: "180px", md: "240px" }}>
                <Flex h="100%" align="flex-end" justify="space-between"
                      gap={{ base: 2, md: 5 }} px={{ base: 1, md: 3 }}>
                  {ORDEN_ELEMENTOS.map((el, i) => (
                    <ColumnaBalance key={el} index={i} enter={barrasEnter}
                                    balance={estados[el]?.balance ?? null} nivel={estados[el]?.nivel ?? null} />
                  ))}
                </Flex>
              </Box>

              {/* Elementos (icono + nombre + estado) */}
              <Flex justify="space-between" gap={{ base: 2, md: 5 }} px={{ base: 1, md: 3 }} mt={2.5}>
                {ORDEN_ELEMENTOS.map((el) => {
                  const E = ELEMENTOS[el];
                  const balance = estados[el]?.balance ?? null;
                  return (
                    <Flex key={el} flex="1" direction="column" align="center" gap={1} minW={0}>
                      <Box w={{ base: "38px", md: "50px" }} h={{ base: "38px", md: "50px" }}
                           borderRadius="full" overflow="hidden" border={`2px solid ${E.color}`}
                           style={{ boxShadow: `0 0 8px ${E.color}88` }}>
                        <img src={ICONO_ELEMENTO[el]} alt={E.nombre}
                             style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>
                      <Text color="white" fontSize={{ base: "2xs", md: "sm" }} fontWeight={700}
                            textAlign="center" noOfLines={1}>
                        {E.nombre}
                      </Text>
                      <Text color={balance ? ESTADO_COLOR[balance] : "rgba(255,255,255,0.45)"}
                            fontSize={{ base: "3xs", md: "2xs" }} fontWeight={700} textAlign="center"
                            fontStyle={balance ? "normal" : "italic"} noOfLines={1} lineHeight="1.2">
                        {balance ? ESTADO_LABEL[balance] : "sin datos"}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          </Panel>
          </Reveal>

          {/* ── Box 2 · Estrella selectora + detalle (componente compartido con Diagnóstico) ── */}
          <Reveal inView direction="up" distance={26} scaleFrom={0.98} duration={0.7} amount={0.15} w="100%">
            <TcmEstrellaDetalle estados={estados} predominante={predominante} />
          </Reveal>

          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.3} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="620px"
                lineHeight="1.6">
            Esta valoración tiene un fin educativo y de autoconocimiento. No constituye un diagnóstico clínico
            ni sustituye la valoración de un profesional cualificado.
          </Text>
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ── Columna vertical de un elemento, por estado ──────────────────────────────
// Los elementos EN EQUILIBRIO (o sin datos) salen con la barra vacía: solo se
// dibuja barra cuando hay desequilibrio (exceso/deficiencia), en su color de
// estado y con la altura = `nivel` (cuánto desequilibrio hay).
function ColumnaBalance({ balance, nivel, index, enter }: {
  balance: Balance | null; nivel: number | null; index: number; enter: boolean;
}) {
  const enDesequilibrio = balance === "exceso" || balance === "deficiencia";
  const color = enDesequilibrio ? ESTADO_COLOR[balance] : ESTADO_COLOR.equilibrio;
  // Barra vacía si está en equilibrio o sin datos; si no, altura por nivel.
  const alturaPct = enDesequilibrio ? Math.max((nivel ?? 0) * 100, 12) : 0;
  // Entrada escalonada: cada barra arranca "encogida" y CRECE hasta su altura,
  // una tras otra (retraso por índice), con leve rebote para dar emoción.
  // Animamos `scaleY` (no `height`): las transiciones de height en % dentro de
  // flex no animan de forma fiable; el transform SIEMPRE lo hace.
  const delay = `${index * 0.16}s`;
  return (
    <Flex flex="1" direction="column" align="center" justify="flex-end" h="100%" minW={0}>
      {enDesequilibrio ? (
        <Box w={{ base: "70%", md: "62%" }} maxW="64px" h={`${alturaPct}%`}
             borderTopRadius="md" bgGradient={`linear(to-t, ${color}cc, ${color})`}
             transformOrigin="bottom center"
             transform={enter ? "scaleY(1)" : "scaleY(0)"}
             transition="transform 0.85s cubic-bezier(0.34,1.3,0.64,1)"
             style={{ transitionDelay: delay, boxShadow: `0 0 12px ${color}88, inset 0 1px 0 rgba(255,255,255,0.4)` }} />
      ) : (
        // Zócalo tenue: marca "vacío = en equilibrio" sin dibujar columna. Aparece
        // (fundido + leve subida) en su turno, para acompañar a las barras.
        <Box w={{ base: "70%", md: "62%" }} maxW="64px" h="4px" borderRadius="full"
             bg={`${ESTADO_COLOR.equilibrio}aa`} opacity={enter ? 1 : 0}
             transform={enter ? "translateY(0)" : "translateY(6px)"}
             transition="opacity 0.5s ease, transform 0.5s ease"
             style={{ transitionDelay: delay, boxShadow: `0 0 10px ${ESTADO_COLOR.equilibrio}66` }} />
      )}
    </Flex>
  );
}

function Panel({ titulo, color, children, full, fill }: {
  titulo: string; color: string; children: React.ReactNode; full?: boolean; fill?: boolean;
}) {
  return (
    <Box position="relative" w="100%" h={fill ? "100%" : undefined} borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}
         gridColumn={full ? { md: "1 / -1" } : undefined}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} h={fill ? "100%" : undefined} px={{ base: 6, md: 8 }} py={{ base: 5, md: 6 }}>
        {titulo && (
          <>
            <Text color={color} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em"
                  textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
              {titulo}
            </Text>
            <Box h="1px" w="100%" mb={4} bg={`${color}88`} />
          </>
        )}
        {children}
      </Box>
    </Box>
  );
}
