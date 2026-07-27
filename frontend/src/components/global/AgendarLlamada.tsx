import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Grid, Text, Input, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";
import { DisciplinaBgLayer, hasDisciplinaBg } from "./DisciplinaBgLayer";
import { PRECIO_LLAMADA, type LlamadaTipo } from "./llamadaPrecios";

/* ──────────────────────────────────────────────────────────────────────────
 * AgendarLlamada — componente INLINE y REUTILIZABLE para reservar una llamada
 * de pago (de momento el pago se simula). Se tematiza por props (color, fondo y
 * disciplina), así que puede parecer "de astrología" o de cualquier disciplina.
 *
 * Flujo: Día → Hora → Datos → Pago (simulado) → reserva guardada en /booking.
 * ────────────────────────────────────────────────────────────────────────── */

interface AgendarLlamadaProps {
  /** Color de acento/texto (normalmente el color de la disciplina). */
  color: string;
  /** Color de fondo de la disciplina (para el velo sobre la imagen). */
  bgColor: string;
  /** Nombre de la disciplina, para pintar su imagen de fondo (DisciplinaBgLayer). */
  disciplinaNom: string;
  /** Tipo de llamada: decide el importe QUE COBRA EL BACKEND. Por defecto la suelta. */
  tipo?: LlamadaTipo;
  /** Precio en € solo para MOSTRAR. Por defecto, el del tipo. */
  precio?: number;
  /** Duración en minutos. Por defecto 60. */
  duracionMin?: number;
  titulo?: string;
  subtitulo?: string;
}

const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 21; // último slot empieza a las 20:00 (1h → acaba 21:00)
const MIN_LEAD_HOURS = 2;

type TakenSlot = { fecha: string; slot: string };

// Días disponibles: desde HOY hasta el domingo de LA SEMANA QUE VIENE, y nada
// más. Semana europea (empieza lunes, termina domingo). Ejemplo: si hoy es
// martes, se ve el resto de esta semana (mar→dom) + toda la siguiente (lun→dom).
function buildDays(): Date[] {
  const out: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();               // 0=domingo, 1=lunes … 6=sábado
  const diasHastaDomingo = (7 - dow) % 7;   // días hasta el domingo de ESTA semana
  const fin = new Date(today);
  fin.setDate(today.getDate() + diasHastaDomingo + 7); // domingo de la semana que viene
  for (const d = new Date(today); d.getTime() <= fin.getTime(); d.setDate(d.getDate() + 1)) {
    out.push(new Date(d));
  }
  return out;
}

// Slots de 1 hora (en punto).
function buildSlots(): string[] {
  const out: string[] = [];
  for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
  }
  return out;
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDayLabel(d: Date) {
  const w = d.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "");
  const day = d.getDate();
  const month = d.toLocaleDateString("es-ES", { month: "short" }).replace(".", "");
  return { weekday: w, day, month };
}

function formatDayFullEs(d: Date) {
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

// Parsea "YYYY-MM-DD" a Date local (sin desfase de zona horaria) — para
// reconstruir la fecha de la reserva al volver del pago de Stripe.
function parseIsoDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function slotIsPast(day: Date, slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const slotDate = new Date(day);
  slotDate.setHours(h, m, 0, 0);
  const minAllowed = new Date();
  minAllowed.setHours(minAllowed.getHours() + MIN_LEAD_HOURS);
  return slotDate.getTime() < minAllowed.getTime();
}

export function AgendarLlamada({
  color,
  bgColor,
  disciplinaNom,
  tipo = "estandar",
  precio = PRECIO_LLAMADA[tipo],
  duracionMin = 60,
  titulo = "Reserva tu llamada",
  subtitulo,
}: AgendarLlamadaProps) {
  const days = useMemo(buildDays, []);
  const slots = useMemo(buildSlots, []);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  // Prerrellenamos el nombre con el de la sesión para no pedirlo de nuevo.
  const [nombre, setNombre] = useState(() => localStorage.getItem("name") || "");
  const [email, setEmail] = useState("");
  const [tema, setTema] = useState("");
  const [pagando, setPagando] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  // Datos de la reserva confirmada tras volver del pago de Stripe (la selección
  // en memoria se pierde con la redirección, así que la reconstruimos del verify).
  const [confirmado, setConfirmado] = useState<{ fecha: string; slot: string } | null>(null);
  // Verificando el pago al volver de Stripe (muestra un panel "confirmando…").
  const [verificando, setVerificando] = useState(false);

  const hasBg = hasDisciplinaBg(disciplinaNom);
  const sub = subtitulo ?? `Sesión de ${duracionMin} min · ${precio} € · horario peninsular España`;

  // Al volver del pago de Stripe: verifica el pago y confirma la reserva. Si el
  // pago fue OK, guarda la reserva en el back (idempotente) y muestra el éxito.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pagadaId = params.get("llamada_pagada");
    const cancelada = params.get("llamada_cancelada");

    const limpiarUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("llamada_pagada");
      url.searchParams.delete("llamada_cancelada");
      window.history.replaceState({}, "", url.pathname + url.search);
    };

    if (pagadaId) {
      setVerificando(true);
      axios
        .get(`${API_URL}/payment/llamada/verify`, { params: { session_id: pagadaId } })
        .then((res) => {
          if (res.data?.ok) {
            setConfirmado({ fecha: res.data.fecha, slot: res.data.slot });
            setSent(true);
          } else if (res.data?.reason === "slot-taken") {
            setErrorMsg("Ese horario se reservó mientras se procesaba el pago. Escríbeme y te reubico la llamada o te devuelvo el importe.");
          } else if (res.data?.reason === "unpaid") {
            setErrorMsg("El pago no llegó a completarse. Puedes intentarlo de nuevo.");
          } else {
            setErrorMsg("No se pudo confirmar la reserva. Escríbeme y lo resolvemos.");
          }
        })
        .catch(() => setErrorMsg("No se pudo confirmar la reserva. Escríbeme y lo resolvemos."))
        .finally(() => { setVerificando(false); limpiarUrl(); });
    } else if (cancelada) {
      setErrorMsg("Has cancelado el pago. Tu llamada no se ha reservado.");
      limpiarUrl();
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    axios
      .get<{ taken: TakenSlot[] }>(`${API_URL}/booking/taken`)
      .then((res) => {
        if (cancelled) return;
        const s = new Set<string>();
        (res.data?.taken ?? []).forEach((t) => s.add(`${t.fecha}|${t.slot}`));
        setTaken(s);
      })
      .catch(() => {});

    // Prerrellena nombre/email con los datos del usuario (si ha iniciado sesión),
    // para que no tenga que volver a escribirlos.
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          if (cancelled) return;
          if (res.data?.name) setNombre((prev) => prev || res.data.name);
          if (res.data?.email) setEmail((prev) => prev || res.data.email);
        })
        .catch(() => {});
    }
    return () => { cancelled = true; };
  }, []);

  const reset = () => {
    setStep(1);
    setSelectedDay(null);
    setSelectedSlot(null);
    setNombre(""); setEmail(""); setTema("");
    setSent(false); setErrorMsg(null); setPagando(false);
    setConfirmado(null); setVerificando(false);
  };

  const handlePickDay = (d: Date) => { setSelectedDay(d); setSelectedSlot(null); setErrorMsg(null); setStep(2); };
  const handlePickSlot = (s: string) => { setSelectedSlot(s); setStep(3); };

  // Inicia el pago REAL de Stripe: pide el checkout al backend y redirige a la
  // pasarela. La reserva NO se guarda aquí — se confirma al volver (verify), solo
  // si el pago se completó.
  const handlePagar = async () => {
    if (!nombre.trim() || !email.trim() || !selectedDay || !selectedSlot) return;
    setPagando(true); setErrorMsg(null);

    try {
      const res = await axios.post(`${API_URL}/payment/llamada/checkout`, {
        nombre: nombre.trim(),
        email: email.trim(),
        fecha: toIsoDate(selectedDay),
        slot: selectedSlot,
        tema: tema.trim() || undefined,
        // Solo el tipo: el importe lo pone el backend.
        tipo,
        disciplinaNom,
        // Volver a ESTA misma página tras el pago (donde se reservó).
        returnPath: window.location.pathname,
      });
      if (res.data?.url) {
        window.location.href = res.data.url; // → pasarela de Stripe
        return;
      }
      setErrorMsg("No se pudo iniciar el pago. Inténtalo de nuevo.");
      setPagando(false);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        setErrorMsg("Ese horario se acaba de reservar. Por favor, elige otro.");
        setTaken((prev) => new Set(prev).add(`${toIsoDate(selectedDay)}|${selectedSlot}`));
        setSelectedSlot(null);
        setStep(2);
      } else {
        setErrorMsg("No se pudo iniciar el pago. Inténtalo de nuevo.");
      }
      setPagando(false);
    }
  };

  const inputStyle = {
    bg: "rgba(255,255,255,0.08)",
    border: `1px solid ${color}55`,
    color,
    borderRadius: "xl",
    fontFamily: "'EB Garamond', serif",
    fontSize: { base: "md", md: "lg" },
    _placeholder: { color: `${color}66` },
    _focus: { borderColor: color, boxShadow: `0 0 0 1px ${color}55` },
    _hover: { borderColor: `${color}aa` },
  };

  const tsh = `0 0 10px ${bgColor}, 0 0 22px ${bgColor}`;

  // Datos a mostrar en la pantalla de éxito: los confirmados por el verify de
  // Stripe (si venimos de la pasarela) o, si no, la selección en memoria.
  const successDate = confirmado ? parseIsoDate(confirmado.fecha) : selectedDay;
  const successSlot = confirmado?.slot ?? selectedSlot;

  const BackBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <Box as="button" onClick={onClick} px={3} py={1.5} borderRadius="full"
      border={`1px solid ${color}55`} bg="transparent" color={`${color}cc`}
      fontSize="xs" fontWeight="600" letterSpacing="0.05em" cursor="pointer"
      _hover={{ bg: `${color}14`, color }} transition="all 0.2s" flexShrink={0}>
      {label}
    </Box>
  );

  return (
    <Box
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={`0 0 22px rgba(255,255,255,0.12), 0 0 50px rgba(255,255,255,0.06), 0 0 30px ${color}1a`}
      fontFamily="'EB Garamond', serif"
    >
      {hasBg && <DisciplinaBgLayer nom={disciplinaNom} borderRadius="2xl" />}
      <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 7, md: 9 }}>
        {sent ? (
          <Flex direction="column" align="center" gap={4} py={4} textAlign="center">
            <Text fontSize="4xl" color={color} style={{ textShadow: `0 0 16px ${color}88` }}>✓</Text>
            <Text color={color} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em"
                  style={{ textShadow: `0 0 16px ${color}66, 0 0 36px ${color}33` }}>
              ¡Llamada reservada!
            </Text>
            <Text color={`${color}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" maxW="440px"
                  style={{ textShadow: tsh }}>
              Te he reservado el{" "}
              <Box as="span" color={color} fontWeight="700">
                {successDate && formatDayFullEs(successDate)} a las {successSlot}
              </Box>
              . Me llegará tu solicitud y te escribiré para confirmar los detalles. ¡Gracias por tu confianza!
            </Text>
            <Box as="button" onClick={reset} mt={2} px={7} py={2.5} borderRadius="full"
              border={`1.5px solid ${color}66`} bg="transparent" color={color}
              fontSize="md" fontWeight="600" letterSpacing="0.06em" cursor="pointer"
              _hover={{ bg: `${color}18` }} transition="all 0.2s">
              Reservar otra
            </Box>
          </Flex>
        ) : verificando ? (
          <Flex direction="column" align="center" gap={4} py={10} textAlign="center">
            <Text color={color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em"
                  style={{ textShadow: `0 0 16px ${color}66` }}>
              Confirmando tu pago…
            </Text>
            <Text color={`${color}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" style={{ textShadow: tsh }}>
              Un momento, estamos confirmando tu reserva.
            </Text>
          </Flex>
        ) : (
          <Flex direction="column" gap={5}>
            {/* Cabecera */}
            <Box textAlign="center">
              <Text color={color} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em"
                    lineHeight="1.2" style={{ textShadow: `0 0 14px ${color}77, 0 0 34px ${color}44` }}>
                {titulo}
              </Text>
              <Text color={`${color}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                    style={{ textShadow: tsh }}>
                {sub}
              </Text>
            </Box>

            {/* Stepper */}
            <Flex align="center" gap={2} mt={1}>
              {[1, 2, 3, 4].map((n) => (
                <React.Fragment key={n}>
                  <Box w="22px" h="22px" borderRadius="full"
                    bg={step >= (n as 1 | 2 | 3 | 4) ? color : "transparent"}
                    border={`1.5px solid ${color}aa`}
                    color={step >= (n as 1 | 2 | 3 | 4) ? bgColor : `${color}aa`}
                    display="flex" alignItems="center" justifyContent="center"
                    fontSize="xs" fontWeight="700" transition="all 0.25s" flexShrink={0}>
                    {n}
                  </Box>
                  {n < 4 && <Box flex="1" h="1px" bg={step > (n as 1 | 2 | 3 | 4) ? color : `${color}33`} transition="background 0.25s" />}
                </React.Fragment>
              ))}
            </Flex>

            <Box h="1px" bg={`${color}22`} borderRadius="full" />

            {/* Zona de pasos con alto fijo: así el box no crece/encoge al avanzar
                de un paso a otro (evita el «salto» que marea al usuario). El paso
                más alto es el 1 (rejilla de días), así que reservamos ese alto y
                los demás pasos se alinean arriba dentro del mismo espacio. */}
            <Box minH={{ base: "420px", md: "340px" }}>

            {/* PASO 1: Día */}
            {step === 1 && (
              <Flex direction="column" gap={4}>
                {errorMsg && (
                  <Box bg="rgba(255,90,90,0.18)" border="1px solid rgba(255,120,120,0.7)" borderRadius="lg" px={4} py={3}>
                    <Text color="#ffd4d4" fontSize={{ base: "sm", md: "md" }} textAlign="center" fontWeight="500">{errorMsg}</Text>
                  </Box>
                )}
                <Text color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="600" style={{ textShadow: tsh }}>Elige un día</Text>
                <Grid templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: 2, md: 3 }}>
                  {days.map((d, i) => {
                    const { weekday, day, month } = formatDayLabel(d);
                    const isSelected = selectedDay?.toDateString() === d.toDateString();
                    return (
                      <Box key={i} as="button" onClick={() => handlePickDay(d)}
                        bg={isSelected ? color : "rgba(255,255,255,0.06)"}
                        color={isSelected ? bgColor : color}
                        border={`1px solid ${isSelected ? color : `${color}33`}`}
                        borderRadius="xl" py={{ base: 2.5, md: 3 }} px={2} cursor="pointer" transition="all 0.2s"
                        _hover={{ bg: isSelected ? color : "rgba(255,255,255,0.14)", borderColor: `${color}88` }} textAlign="center">
                        <Text fontSize="xs" opacity={0.8} textTransform="uppercase" letterSpacing="0.1em">{weekday}</Text>
                        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.2">{day}</Text>
                        <Text fontSize="xs" opacity={0.8} textTransform="lowercase">{month}</Text>
                      </Box>
                    );
                  })}
                </Grid>
              </Flex>
            )}

            {/* PASO 2: Hora */}
            {step === 2 && selectedDay && (
              <Flex direction="column" gap={4}>
                <Flex justify="space-between" align="center" gap={3}>
                  <Box>
                    <Text color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="600" style={{ textShadow: tsh }}>Elige una hora</Text>
                    <Text color={`${color}aa`} fontSize="sm" textTransform="capitalize">{formatDayFullEs(selectedDay)}</Text>
                  </Box>
                  <BackBtn onClick={() => setStep(1)} label="← Cambiar día" />
                </Flex>
                {errorMsg && (
                  <Box bg="rgba(255,90,90,0.18)" border="1px solid rgba(255,120,120,0.7)" borderRadius="lg" px={4} py={3}>
                    <Text color="#ffd4d4" fontSize={{ base: "sm", md: "md" }} textAlign="center" fontWeight="500">{errorMsg}</Text>
                  </Box>
                )}
                <Grid templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: 2, md: 2.5 }}>
                  {slots.map((s) => {
                    const past = slotIsPast(selectedDay, s);
                    const isTaken = taken.has(`${toIsoDate(selectedDay)}|${s}`);
                    const disabled = past || isTaken;
                    const isSelected = selectedSlot === s;
                    return (
                      <Box key={s} as="button" onClick={() => !disabled && handlePickSlot(s)} disabled={disabled}
                        bg={isSelected ? color : "rgba(255,255,255,0.06)"}
                        color={isSelected ? bgColor : (disabled ? `${color}44` : color)}
                        border={`1px solid ${isSelected ? color : (disabled ? `${color}22` : `${color}33`)}`}
                        borderRadius="lg" py={2.5} fontWeight="600" fontSize={{ base: "sm", md: "md" }}
                        cursor={disabled ? "not-allowed" : "pointer"} opacity={disabled ? 0.5 : 1}
                        textDecoration={disabled ? "line-through" : "none"} transition="all 0.18s"
                        _hover={disabled ? {} : { bg: isSelected ? color : "rgba(255,255,255,0.14)", borderColor: `${color}88` }}
                        textAlign="center" title={isTaken ? "Ya reservado" : undefined}>
                        {s}
                      </Box>
                    );
                  })}
                </Grid>
              </Flex>
            )}

            {/* PASO 3: Datos */}
            {step === 3 && selectedDay && selectedSlot && (
              <Flex direction="column" gap={4}>
                <Flex justify="space-between" align="center" gap={3}>
                  <Box>
                    <Text color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="600" style={{ textShadow: tsh }}>Tus datos</Text>
                    <Text color={`${color}aa`} fontSize="sm" textTransform="capitalize">{formatDayFullEs(selectedDay)} · {selectedSlot}</Text>
                  </Box>
                  <BackBtn onClick={() => setStep(2)} label="← Cambiar hora" />
                </Flex>
                <Input placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} {...inputStyle} />
                <Input placeholder="Tu email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} {...inputStyle} />
                <Textarea placeholder="¿De qué te gustaría hablar? (opcional)" value={tema} onChange={(e) => setTema(e.target.value)} rows={3} resize="none" {...inputStyle} />
                <Box as="button" onClick={() => setStep(4)}
                  disabled={!nombre.trim() || !email.trim()}
                  mt={1} px={8} py={3} borderRadius="full" bg={color} color={bgColor}
                  fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.07em"
                  cursor={!nombre.trim() || !email.trim() ? "not-allowed" : "pointer"}
                  opacity={!nombre.trim() || !email.trim() ? 0.5 : 1} transition="all 0.22s"
                  boxShadow={`0 4px 20px ${color}44`} _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}>
                  Continuar al pago →
                </Box>
              </Flex>
            )}

            {/* PASO 4: Pago (simulado) */}
            {step === 4 && selectedDay && selectedSlot && (
              <Flex direction="column" gap={4}>
                <Flex justify="space-between" align="center" gap={3}>
                  <Text color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="600" style={{ textShadow: tsh }}>Pago</Text>
                  <BackBtn onClick={() => setStep(3)} label="← Volver" />
                </Flex>

                {/* Resumen */}
                <Box borderRadius="xl" border={`1px solid ${color}33`} bg="rgba(255,255,255,0.06)" px={{ base: 4, md: 5 }} py={4}>
                  <Flex justify="space-between" gap={3} mb={2}>
                    <Text color={`${color}cc`} fontSize="sm">Fecha</Text>
                    <Text color={color} fontSize="sm" fontWeight="600" textAlign="right" textTransform="capitalize">{formatDayFullEs(selectedDay)}</Text>
                  </Flex>
                  <Flex justify="space-between" gap={3} mb={2}>
                    <Text color={`${color}cc`} fontSize="sm">Hora</Text>
                    <Text color={color} fontSize="sm" fontWeight="600">{selectedSlot} · {duracionMin} min</Text>
                  </Flex>
                  <Box h="1px" bg={`${color}22`} my={3} />
                  <Flex justify="space-between" align="center" gap={3}>
                    <Text color={color} fontSize="lg" fontWeight="700">Total</Text>
                    <Text color={color} fontSize="2xl" fontWeight="700" style={{ textShadow: `0 0 12px ${color}66` }}>{precio} €</Text>
                  </Flex>
                </Box>

                <Text color={`${color}99`} fontSize="xs" fontStyle="italic" textAlign="center">
                  Pago seguro con tarjeta a través de Stripe.
                </Text>

                {errorMsg && (
                  <Box bg="rgba(255,90,90,0.18)" border="1px solid rgba(255,120,120,0.7)" borderRadius="lg" px={4} py={3}>
                    <Text color="#ffd4d4" fontSize={{ base: "sm", md: "md" }} textAlign="center" fontWeight="500">{errorMsg}</Text>
                  </Box>
                )}

                <Box as="button" onClick={handlePagar} disabled={pagando}
                  mt={1} px={8} py={3} borderRadius="full" bg={color} color={bgColor}
                  fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.07em"
                  cursor={pagando ? "wait" : "pointer"} opacity={pagando ? 0.6 : 1} transition="all 0.22s"
                  boxShadow={`0 4px 20px ${color}44`} _hover={pagando ? {} : { opacity: 0.88, transform: "translateY(-1px)" }}>
                  {pagando ? "Redirigiendo al pago…" : `Pagar ${precio} € con tarjeta`}
                </Box>
              </Flex>
            )}
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
}

export default AgendarLlamada;
