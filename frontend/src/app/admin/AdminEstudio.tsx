// ─────────────────────────────────────────────────────────────────────────────
// Panel del ESTUDIO estadístico sobre astrología.
//
// El estudio es público (participar no exige cuenta), así que esta pantalla es
// lo ÚNICO que no lo es: aquí están los emails de quien participa —datos
// personales— y por eso va detrás del token de admin desbloqueado, como el
// resto del panel.
//
// Dos vistas:
//   · PARTICIPANTES → quién se ha dado de alta, cuándo y cuánto lleva
//     respondido. Con buscador, copia de emails y descarga en CSV.
//   · RESULTADOS    → cómo van los números: cada pregunta con su % de «sí»
//     dentro de su grupo (planeta + posición). El texto de la pregunta se
//     resuelve aquí, que es donde vive (estudioPreguntas.ts); el servidor solo
//     manda el recuento.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Select, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { CUERPOS } from "../../components/metodo/astrologiaData";
import { textoPregunta } from "../../data/estudioPreguntas";
import type { ItemEstadistica } from "../../data/estudioApi";
import { API_URL, astrologiaTxt } from "../../GlobalVariables";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

interface ParticipanteAdmin {
  id: string;
  email: string;
  creado: string;
  actualizado: string;
  nacimiento: { fecha: string; hora: string; lugar: string };
  signos: Record<string, string>;
  respuestas: number;
  conCuenta: boolean;
}

interface RespuestaParticipantes {
  participantes: ParticipanteAdmin[];
  totales: { participantes: number; respuestas: number; conRespuestas: number; ultimos7dias: number };
}

const NOMBRE_PLANETA: Record<string, string> = Object.fromEntries(
  CUERPOS.map((c) => [c.key, c.label]),
);
const COLOR_PLANETA: Record<string, string> = Object.fromEntries(
  CUERPOS.map((c) => [c.key, c.color]),
);

const fecha = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/* ── Piezas de la pantalla ──────────────────────────────────────────────── */

const Caja = ({ children, ...rest }: React.ComponentProps<typeof Box>) => (
  <Box bg="rgba(255,255,255,0.08)" border="1px solid rgba(255,255,255,0.22)" borderRadius="2xl"
       px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }} {...rest}>
    {children}
  </Box>
);

const Dato = ({ n, label }: { n: number; label: string }) => (
  <Caja flex="1" minW="130px" textAlign="center">
    <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.1">{n}</Text>
    <Text color="rgba(255,255,255,0.7)" fontSize="xs" letterSpacing="0.1em" textTransform="uppercase" mt={1}>
      {label}
    </Text>
  </Caja>
);

const Pestana = ({ activa, onClick, children }: { activa: boolean; onClick: () => void; children: React.ReactNode }) => (
  <Box as="button" onClick={onClick} px={{ base: 5, md: 7 }} py={{ base: 2, md: 2.5 }} borderRadius="full"
       bg={activa ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.08)"}
       color={activa ? "#00615f" : "white"}
       border={`1.5px solid ${activa ? "white" : "rgba(255,255,255,0.35)"}`}
       fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em"
       cursor="pointer" transition="all 0.2s"
       _hover={activa ? undefined : { bg: "rgba(255,255,255,0.18)" }}>
    {children}
  </Box>
);

const campoSx = {
  bg: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.28)",
  color: "white",
  borderRadius: "full",
  fontFamily: "'EB Garamond', serif",
  _placeholder: { color: "rgba(255,255,255,0.45)" },
  _hover: { borderColor: "rgba(255,255,255,0.5)" },
  _focus: { borderColor: "white", boxShadow: "0 0 0 1px rgba(255,255,255,0.3)" },
};

// ═════════════════════════════════════════════════════════════════════════
export default function AdminEstudio() {
  const navigate = useNavigate();
  const { verificando } = useAdminGuard();

  const [vista, setVista] = useState<"participantes" | "resultados">("participantes");
  const [datos, setDatos] = useState<RespuestaParticipantes | null>(null);
  const [items, setItems] = useState<ItemEstadistica[]>([]);
  const [loading, setLoading] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [planeta, setPlaneta] = useState("");
  const [minimo, setMinimo] = useState(1);

  useEffect(() => {
    if (verificando) return;
    (async () => {
      try {
        const [p, r] = await Promise.all([
          axios.get<RespuestaParticipantes>(`${API_URL}/estudio/admin/participantes`, { headers: adminHeaders() }),
          axios.get<{ items: ItemEstadistica[] }>(`${API_URL}/estudio/admin/resultados`, { headers: adminHeaders() }),
        ]);
        setDatos(p.data);
        setItems(r.data?.items ?? []);
      } catch {
        setAviso("No se han podido cargar los datos del estudio.");
      } finally {
        setLoading(false);
      }
    })();
  }, [verificando]);

  const participantes = datos?.participantes ?? [];

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return participantes;
    return participantes.filter(
      (p) => p.email.toLowerCase().includes(t) || p.nacimiento.lugar.toLowerCase().includes(t),
    );
  }, [q, participantes]);

  const resultados = useMemo(() => {
    return items.filter((i) => (!planeta || i.planeta === planeta) && i.total >= minimo);
  }, [items, planeta, minimo]);

  // Los planetas que de verdad tienen respuestas, en el orden de la carta.
  const planetasConDatos = useMemo(() => {
    const hay = new Set(items.map((i) => i.planeta));
    return CUERPOS.filter((c) => hay.has(c.key));
  }, [items]);

  const copiarEmails = async () => {
    const emails = filtrados.map((p) => p.email).join(", ");
    try {
      await navigator.clipboard.writeText(emails);
      setAviso(`${filtrados.length} emails copiados al portapapeles.`);
    } catch {
      setAviso("El navegador no ha dejado copiar. Descarga el CSV.");
    }
  };

  const descargarCsv = () => {
    const cabecera = "email;alta;respuestas;fecha_nacimiento;hora;lugar";
    const filas = filtrados.map((p) =>
      [p.email, p.creado.slice(0, 10), p.respuestas, p.nacimiento.fecha, p.nacimiento.hora,
       `"${p.nacimiento.lugar.replace(/"/g, "'")}"`].join(";"),
    );
    // BOM al principio: si no, Excel se come los acentos.
    const blob = new Blob(["﻿" + [cabecera, ...filas].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estudio-participantes.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (verificando || loading) return <LifeLoading variant="private" />;

  const t = datos?.totales;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="980px">
          <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.06em"
                textTransform="uppercase" textAlign="center"
                textShadow="0 0 14px rgba(255,255,255,0.55), 0 0 30px rgba(180,255,245,0.28)">
            Estudio de astrología
          </Text>
          <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                textAlign="center" mt={2} mb={{ base: 6, md: 8 }}>
            Quién ha participado y cómo van los resultados.
          </Text>

          {/* ── Resumen ── */}
          <Flex gap={{ base: 3, md: 4 }} wrap="wrap" mb={{ base: 6, md: 8 }}>
            <Dato n={t?.participantes ?? 0} label="Participantes" />
            <Dato n={t?.conRespuestas ?? 0} label="Han respondido" />
            <Dato n={t?.respuestas ?? 0} label="Respuestas" />
            <Dato n={t?.ultimos7dias ?? 0} label="Últimos 7 días" />
          </Flex>

          <Flex justify="center" gap={3} mb={{ base: 5, md: 6 }}>
            <Pestana activa={vista === "participantes"} onClick={() => setVista("participantes")}>
              Participantes
            </Pestana>
            <Pestana activa={vista === "resultados"} onClick={() => setVista("resultados")}>
              Resultados
            </Pestana>
          </Flex>

          {aviso && (
            <Text color="#ffd9a0" fontSize="sm" fontStyle="italic" textAlign="center" mb={4}>{aviso}</Text>
          )}

          {/* ══════════ PARTICIPANTES ══════════ */}
          {vista === "participantes" && (
            <>
              <Flex gap={3} mb={5} wrap="wrap" align="center">
                <Input flex="1" minW="220px" value={q} onChange={(e) => setQ(e.target.value)}
                       placeholder="Buscar por email o lugar…" {...campoSx} />
                <Box as="button" onClick={() => void copiarEmails()} px={5} py={2.5} borderRadius="full"
                     bg="rgba(255,255,255,0.1)" border="1.5px solid rgba(255,255,255,0.45)" color="white"
                     fontWeight="700" fontSize="sm" cursor="pointer" transition="all 0.2s" whiteSpace="nowrap"
                     _hover={{ bg: "rgba(255,255,255,0.18)" }}>
                  Copiar emails
                </Box>
                <Box as="button" onClick={descargarCsv} px={5} py={2.5} borderRadius="full"
                     bg="rgba(255,255,255,0.1)" border="1.5px solid rgba(255,255,255,0.45)" color="white"
                     fontWeight="700" fontSize="sm" cursor="pointer" transition="all 0.2s" whiteSpace="nowrap"
                     _hover={{ bg: "rgba(255,255,255,0.18)" }}>
                  Descargar CSV
                </Box>
              </Flex>

              {filtrados.length === 0 ? (
                <Text color="rgba(255,255,255,0.7)" fontStyle="italic" textAlign="center" py={8}>
                  {participantes.length === 0
                    ? "Todavía no ha participado nadie."
                    : "Ningún participante con esa búsqueda."}
                </Text>
              ) : (
                <Flex direction="column" gap={3}>
                  {filtrados.map((p) => (
                    <Caja key={p.id}>
                      <Flex align={{ base: "flex-start", md: "center" }} gap={3} wrap="wrap"
                            direction={{ base: "column", md: "row" }}>
                        <Box flex="1" minW={0}>
                          <Text color="white" fontWeight="700" fontSize={{ base: "md", md: "lg" }} wordBreak="break-all">
                            {p.email}
                          </Text>
                          <Text color="rgba(255,255,255,0.66)" fontSize="sm" mt={0.5}>
                            {p.nacimiento.fecha} · {p.nacimiento.hora} · {p.nacimiento.lugar || "—"}
                          </Text>
                          {/* Sol y Ascendente: de un vistazo se ve si la carta salió bien. */}
                          <Text color={`${astrologiaTxt}cc`} fontSize="sm" mt={0.5}>
                            Sol en {p.signos?.sol ?? "—"} · Asc en {p.signos?.ascendente ?? "—"}
                          </Text>
                        </Box>
                        <Flex direction="column" align={{ base: "flex-start", md: "flex-end" }} flexShrink={0}>
                          <Text color="white" fontWeight="700">
                            {p.respuestas} {p.respuestas === 1 ? "respuesta" : "respuestas"}
                          </Text>
                          <Text color="rgba(255,255,255,0.6)" fontSize="xs">
                            alta {fecha(p.creado)}{p.conCuenta ? " · con cuenta" : ""}
                          </Text>
                        </Flex>
                      </Flex>
                    </Caja>
                  ))}
                </Flex>
              )}
            </>
          )}

          {/* ══════════ RESULTADOS ══════════ */}
          {vista === "resultados" && (
            <>
              <Flex gap={3} mb={5} wrap="wrap" align="center">
                <Select value={planeta} onChange={(e) => setPlaneta(e.target.value)} maxW="260px" {...campoSx}
                        sx={{ "> option": { background: "#00615f", color: "white" } }}>
                  <option value="">Todos los planetas</option>
                  {planetasConDatos.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </Select>
                <Select value={minimo} onChange={(e) => setMinimo(Number(e.target.value))} maxW="260px" {...campoSx}
                        sx={{ "> option": { background: "#00615f", color: "white" } }}>
                  {[1, 3, 5, 10, 25].map((n) => (
                    <option key={n} value={n}>Desde {n} {n === 1 ? "respuesta" : "respuestas"}</option>
                  ))}
                </Select>
                <Text color="rgba(255,255,255,0.7)" fontSize="sm" fontStyle="italic">
                  {resultados.length} preguntas con datos
                </Text>
              </Flex>

              {resultados.length === 0 ? (
                <Text color="rgba(255,255,255,0.7)" fontStyle="italic" textAlign="center" py={8}>
                  Todavía no hay respuestas suficientes con ese filtro.
                </Text>
              ) : (
                <Flex direction="column" gap={3}>
                  {resultados.map((i) => {
                    const color = COLOR_PLANETA[i.planeta] ?? astrologiaTxt;
                    const posicion = i.eje === "casa" ? `Casa ${i.posicion}` : i.posicion;
                    return (
                      <Caja key={`${i.planeta}|${i.eje}|${i.posicion}|${i.preguntaId}`}>
                        <Flex align="baseline" justify="space-between" gap={3} wrap="wrap" mb={1}>
                          <Text color={color} fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                                letterSpacing="0.06em" textTransform="uppercase">
                            {NOMBRE_PLANETA[i.planeta] ?? i.planeta} · {posicion}
                          </Text>
                          <Text color="rgba(255,255,255,0.6)" fontSize="xs">
                            {i.si} sí de {i.total}
                          </Text>
                        </Flex>
                        <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.5" mb={2}>
                          {textoPregunta(i.preguntaId) || i.preguntaId}
                        </Text>
                        {/* Barra: lo que se ve de un vistazo es el % de «sí». */}
                        <Flex align="center" gap={3}>
                          <Box flex="1" h="8px" borderRadius="full" bg="rgba(255,255,255,0.18)" overflow="hidden">
                            <Box h="100%" borderRadius="full" bg={color} w={`${i.porcentajeSi}%`}
                                 boxShadow={`0 0 10px ${color}aa`} transition="width 0.4s ease" />
                          </Box>
                          <Text color="white" fontWeight="700" fontSize="sm" minW="46px" textAlign="right">
                            {i.porcentajeSi}%
                          </Text>
                        </Flex>
                      </Caja>
                    );
                  })}
                </Flex>
              )}
            </>
          )}

          <Flex justify="center" mt={{ base: 8, md: 10 }}>
            <Box as="button" onClick={() => navigate("/admin")} color="rgba(255,255,255,0.75)" fontSize="sm"
                 bg="transparent" border="none" cursor="pointer" _hover={{ color: "white" }}>
              ← Volver al panel
            </Box>
          </Flex>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
