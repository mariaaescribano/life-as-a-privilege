import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { cabalaSefirotMap, CABALA_SEFIROT_ORDEN, CABALA_TOTAL_PAGINAS, CABALA_PAG } from "../../components/metodo/cabalaSefirot";
import { CABALA_TEST, testCompleto } from "../../components/metodo/cabalaTest";
import {
  calcularTransiciones, nivelCombinado, sefiraEvaluable, sefirotContenidoCompleto, polaridadSefira,
  POLARIDAD_LABEL, TIPO_LABEL, esBloqueo,
} from "../../components/metodo/cabalaDiagnostico";
import {
  CABALA_SENDEROS, NOMBRE_SEFIRA, senderoCompleto, senderosContenidoCompleto, puntuacionSendero, interpretacionSendero,
} from "../../components/metodo/cabalaSenderos";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";
import { CAJA_GLOW, CAJA_GLOW_HOVER } from "../../components/metodo/cabalaGlow";

// Sombra OSCURA (casi negra), no del color del fondo: da contraste real al
// texto ámbar (cabalaTxt) sobre el fondo marrón, para que se lea bien.
const INK_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.72), 0 0 22px rgba(0,0,0,0.5)";
// El glow vive en cabalaGlow.ts: TODO el recorrido comparte el halo del header.
const CAJA_OVERLAY = `${cabalaBg}cc`;

const Caja = ({ children }: { children: React.ReactNode }) => (
  <Box position="relative" overflow="hidden" w="100%" border={`1.5px solid ${cabalaTxt}44`}
       borderRadius="2xl" boxShadow={CAJA_GLOW}>
    <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" overlay={CAJA_OVERLAY} />
    <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 6, md: 7 }}>{children}</Box>
  </Box>
);

const Titulo = ({ children }: { children: React.ReactNode }) => (
  <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.08em" mb={4} style={{ textShadow: INK_SHADOW }}>
    {children}
  </Text>
);

function BarraNivel({ nivel }: { nivel: number }) {
  const pct = Math.max(0, Math.min(100, (nivel / 10) * 100));
  return (
    <Box w="100%" h="7px" borderRadius="full" bg={`${cabalaTxt}1c`} overflow="hidden">
      <Box h="100%" borderRadius="full" bg={cabalaTxt} w={`${pct}%`} boxShadow={`0 0 10px ${cabalaTxt}aa`} />
    </Box>
  );
}

export default function MetodoCabalaFinal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Record<string, number[]>>({});
  const [autoeval, setAutoeval] = useState<Record<string, number[]>>({});
  const [senderos, setSenderos] = useState<Record<string, number[]>>({});

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
          const dt = res.data?.data ?? {};
          // Puerta: el Diagnóstico final necesita TODO el contenido relleno —
          // el de las sefirot y el de los 22 senderos—. Si falta algo, se manda
          // a completarlo (sefirot → Árbol; senderos → Los Senderos).
          if (!sefirotContenidoCompleto(dt.test, dt.autoeval)) {
            navigate("/metodo/cabala/arbol");
            return;
          }
          if (!senderosContenidoCompleto(dt.senderos)) {
            navigate("/metodo/cabala/senderos");
            return;
          }
          if (dt.test && typeof dt.test === "object") setTest(dt.test);
          if (dt.autoeval && typeof dt.autoeval === "object") setAutoeval(dt.autoeval);
          if (dt.senderos && typeof dt.senderos === "object") setSenderos(dt.senderos);
        } catch { /* sin datos */ }
      } catch { navigate("/metodo/cabala"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // ── Dimensiones ──
  const niveles = useMemo(() => CABALA_SEFIROT_ORDEN.map((key) => {
    const r = test[key] ?? [];
    const a = autoeval[key] ?? [];
    const completo = sefiraEvaluable(r, a);
    return {
      key, titulo: cabalaSefirotMap[key].titulo, numero: cabalaSefirotMap[key].numero,
      etiqueta: CABALA_TEST[key].etiqueta, completo,
      nivel: completo ? nivelCombinado(r, a) : -1,
      polaridad: testCompleto(r) ? polaridadSefira(r) : "equilibrio" as const,
    };
  }), [test, autoeval]);
  const bloqueos = useMemo(() =>
    calcularTransiciones(test, autoeval).filter((t) => t.completa && esBloqueo(t.tipo)).sort((a, b) => b.gravedad - a.gravedad),
    [test, autoeval]);
  const bloqueoPrincipal = bloqueos[0] ?? null;
  const dimsCompletas = niveles.filter((n) => n.completo).length;

  // ── Senderos ──
  const senderoRes = useMemo(() => CABALA_SENDEROS.map((s) => {
    const r = senderos[String(s.num)];
    const completo = senderoCompleto(s, r);
    const total = completo ? puntuacionSendero(s, r!) : -1;
    const band = completo ? interpretacionSendero(s, total) : null;
    const bandIdx = band ? s.interpretaciones.findIndex((b) => b.min === band.min && b.max === band.max) : -1;
    return { s, completo, total, band, bandIdx };
  }), [senderos]);
  const sendCompletos = senderoRes.filter((r) => r.completo).length;
  const senderosPrioritarios = senderoRes.filter((r) => r.completo && r.bandIdx >= 2).sort((a, b) => b.total - a.total).slice(0, 3);

  const descargar = () => {
    const L: string[] = [];
    L.push("DIAGNÓSTICO FINAL · CÁBALA");
    L.push("El Árbol de la Vida — mapa de autoconocimiento");
    L.push("");
    L.push(`— TUS DIMENSIONES (${dimsCompletas}/${niveles.length} respondidas) —`);
    niveles.forEach((n) => {
      L.push(`${n.numero}. ${n.titulo} · ${n.etiqueta}: ${n.completo ? `${n.nivel}/10 · ${POLARIDAD_LABEL[n.polaridad]}` : "sin responder"}`);
    });
    if (bloqueoPrincipal) {
      L.push("");
      L.push(`Paso evolutivo prioritario: ${cabalaSefirotMap[bloqueoPrincipal.from].titulo} → ${cabalaSefirotMap[bloqueoPrincipal.to].titulo} (${TIPO_LABEL[bloqueoPrincipal.tipo]}).`);
      L.push(bloqueoPrincipal.narrativa);
    }
    L.push("");
    L.push(`— TUS SENDEROS (${sendCompletos}/${senderoRes.length} completados) —`);
    senderoRes.forEach(({ s, band, total }) => {
      L.push(`${s.orden}. ${s.letra} · ${NOMBRE_SEFIRA[s.from]} → ${NOMBRE_SEFIRA[s.to]}: ${band ? `${band.titulo} (${total})` : "sin responder"}`);
    });
    if (senderosPrioritarios.length) {
      L.push("");
      L.push("Senderos prioritarios:");
      senderosPrioritarios.forEach(({ s, band }) => L.push(`· ${s.letra} (${NOMBRE_SEFIRA[s.from]} → ${NOMBRE_SEFIRA[s.to]}): ${band?.titulo}. ${band?.texto}`));
    }
    const blob = new Blob([L.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagnostico-cabala.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title="Diagnóstico Final"
              pageLabel={`${CABALA_PAG.final}/${CABALA_TOTAL_PAGINAS}`}
              compact bgColor={`${cabalaBg}dd`} color={cabalaTxt} nom={cabalaNom} mb={0}
              prev={{ label: "← Senderos", onClick: () => navigate("/metodo/cabala/senderos/diagnostico") }}
              extra={{ label: "El Árbol", onClick: () => navigate("/metodo/cabala/arbol") }}
              next={{ label: "10 días →", onClick: () => navigate("/metodo/cabala/dias") }}
            />
          </Reveal>

          <Reveal direction="up" distance={16} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.85" maxW="660px" style={{ textShadow: INK_SHADOW }}>
              Aquí se reúne todo tu recorrido: tus dimensiones (las sefirot) y tus transiciones (los senderos).
              Puedes descargarlo para guardarlo y volver a él cuando quieras.
            </Text>
          </Reveal>

          {/* Descargar */}
          <Reveal direction="up" distance={14} delay={0.16} duration={0.55} display="flex" justifyContent="center">
            <Box as="button" onClick={descargar}
                 display="inline-flex" alignItems="center" gap={2.5} px={{ base: 7, md: 8 }} py={{ base: 2.5, md: 3 }}
                 borderRadius="full" bg={cabalaTxt} color={cabalaBg} fontWeight="800" fontSize={{ base: "sm", md: "md" }}
                 letterSpacing="0.06em" cursor="pointer" transition="all 0.2s"
                 boxShadow={CAJA_GLOW}
                 _hover={{ transform: "translateY(-2px)", boxShadow: CAJA_GLOW_HOVER }}>
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="20px" h="20px" fill="currentColor">
                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
              </Box>
              Descargar mi diagnóstico
            </Box>
          </Reveal>

          {/* Dimensiones */}
          <Reveal direction="up" distance={18} delay={0.2} duration={0.6} w="100%">
            <Caja>
              <Titulo>Tus dimensiones · {dimsCompletas}/{niveles.length}</Titulo>
              {bloqueoPrincipal && (
                <Box mb={5} bg={`${cabalaTxt}0d`} border={`1px solid ${cabalaTxt}33`} borderRadius="xl" p={{ base: 4, md: 5 }}>
                  <Text color={`${cabalaTxt}99`} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase" mb={1} style={{ textShadow: INK_SHADOW }}>
                    Paso evolutivo prioritario
                  </Text>
                  <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
                    {cabalaSefirotMap[bloqueoPrincipal.from].titulo} → {cabalaSefirotMap[bloqueoPrincipal.to].titulo}
                    <Box as="span" color={`${cabalaTxt}88`} fontSize="sm" fontWeight="400"> · {TIPO_LABEL[bloqueoPrincipal.tipo]}</Box>
                  </Text>
                  <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" style={{ textShadow: INK_SHADOW }}>{bloqueoPrincipal.narrativa}</Text>
                </Box>
              )}
              <Flex direction="column" gap={3}>
                {niveles.map((n) => (
                  <Box key={n.key}>
                    <Flex justify="space-between" align="baseline" mb={1} gap={2} wrap="wrap">
                      <Text color={`${cabalaTxt}dd`} fontSize={{ base: "md", md: "lg" }} style={{ textShadow: INK_SHADOW }}>
                        <Box as="span" color={`${cabalaTxt}77`} fontWeight="700" mr={1.5}>{n.numero}.</Box>
                        {n.titulo} <Box as="span" color={`${cabalaTxt}77`}>· {n.etiqueta}</Box>
                      </Text>
                      {n.completo
                        ? <Text color={cabalaTxt} fontSize="xs" fontWeight="700">{n.nivel}/10 · <Box as="span" color={`${cabalaTxt}99`}>{POLARIDAD_LABEL[n.polaridad]}</Box></Text>
                        : <Text color={`${cabalaTxt}66`} fontSize="xs" fontStyle="italic">sin responder</Text>}
                    </Flex>
                    {n.completo ? <BarraNivel nivel={n.nivel} /> : <Box w="100%" h="7px" borderRadius="full" bg={`${cabalaTxt}12`} />}
                  </Box>
                ))}
              </Flex>
            </Caja>
          </Reveal>

          {/* Senderos */}
          <Reveal direction="up" distance={18} delay={0.26} duration={0.6} w="100%">
            <Caja>
              <Titulo>Tus senderos · {sendCompletos}/{senderoRes.length}</Titulo>
              {senderosPrioritarios.length > 0 && (
                <Box mb={5}>
                  <Text color={`${cabalaTxt}99`} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase" mb={2} style={{ textShadow: INK_SHADOW }}>
                    Senderos prioritarios
                  </Text>
                  <Flex direction="column" gap={3}>
                    {senderosPrioritarios.map(({ s, band }) => (
                      <Box key={s.num} bg={`${cabalaTxt}0d`} border={`1px solid ${cabalaTxt}33`} borderRadius="xl" p={{ base: 3.5, md: 4 }}>
                        <Text color={cabalaTxt} fontWeight="700" fontSize={{ base: "lg", md: "xl" }} mb={1} style={{ textShadow: INK_SHADOW }}>
                          {s.letra} · {NOMBRE_SEFIRA[s.from]} → {NOMBRE_SEFIRA[s.to]}
                          <Box as="span" color={`${cabalaTxt}88`} fontSize="sm" fontWeight="400"> · {band?.titulo}</Box>
                        </Text>
                        <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>{band?.texto}</Text>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              )}
              <Flex direction="column" gap={2.5}>
                {senderoRes.map(({ s, band, total }) => (
                  <Flex key={s.num} align="baseline" justify="space-between" gap={3} wrap="wrap"
                        borderBottom={`1px solid ${cabalaTxt}1c`} pb={2}>
                    <Text color={`${cabalaTxt}dd`} fontSize={{ base: "md", md: "lg" }} style={{ textShadow: INK_SHADOW }}>
                      <Box as="span" color={`${cabalaTxt}77`} fontWeight="700" mr={1.5}>{s.orden}.</Box>
                      {s.letra} <Box as="span" color={`${cabalaTxt}77`}>· {NOMBRE_SEFIRA[s.from]} → {NOMBRE_SEFIRA[s.to]}</Box>
                    </Text>
                    <Text color={band ? cabalaTxt : `${cabalaTxt}66`} fontSize="xs" fontWeight={band ? "700" : "400"} fontStyle={band ? "normal" : "italic"}>
                      {band ? `${band.titulo} · ${total}` : "sin responder"}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Caja>
          </Reveal>
        </Flex>
      </Flex>

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />
      <IndiceCabala />
    </Box>
  );
}
