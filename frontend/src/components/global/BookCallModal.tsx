import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Flex, Grid, Text, Input, Textarea,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS_AHEAD = 14;
const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 21; // último slot empieza a las 20:30
const SLOT_MINUTES = 30;
const MIN_LEAD_HOURS = 2; // no permitir reservas con menos de 2h de antelación

const BG = "#008080";
const FG = "#ffffff";

type TakenSlot = { fecha: string; slot: string };

function buildDays(): Date[] {
  const out: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}

function buildSlots(): string[] {
  const out: string[] = [];
  for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
}

function toIsoDate(d: Date): string {
  // YYYY-MM-DD en horario local (no UTC, para evitar desfase)
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
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function slotIsPast(day: Date, slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const slotDate = new Date(day);
  slotDate.setHours(h, m, 0, 0);
  const minAllowed = new Date();
  minAllowed.setHours(minAllowed.getHours() + MIN_LEAD_HOURS);
  return slotDate.getTime() < minAllowed.getTime();
}

export function BookCallModal({ isOpen, onClose }: BookCallModalProps) {
  const days = useMemo(buildDays, []);
  const slots = useMemo(buildSlots, []);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tema, setTema] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [taken, setTaken] = useState<Set<string>>(new Set());

  // Carga los slots ocupados cada vez que se abre el modal
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    axios
      .get<{ taken: TakenSlot[] }>(`${API_URL}/booking/taken`)
      .then((res) => {
        if (cancelled) return;
        const s = new Set<string>();
        (res.data?.taken ?? []).forEach((t) => s.add(`${t.fecha}|${t.slot}`));
        setTaken(s);
      })
      .catch(() => {
        // si falla, se permiten reservas y el backend rechazará duplicados
      });
    return () => { cancelled = true; };
  }, [isOpen]);

  const reset = () => {
    setStep(1);
    setSelectedDay(null);
    setSelectedSlot(null);
    setNombre(""); setEmail(""); setTema("");
    setSent(false); setErrorMsg(null); setSending(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handlePickDay = (d: Date) => {
    setSelectedDay(d);
    setSelectedSlot(null);
    setStep(2);
  };

  const handlePickSlot = (s: string) => {
    setSelectedSlot(s);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || !email.trim() || !selectedDay || !selectedSlot) return;
    setSending(true); setErrorMsg(null);

    try {
      await axios.post(`${API_URL}/booking`, {
        nombre: nombre.trim(),
        email: email.trim(),
        fecha: toIsoDate(selectedDay),
        slot: selectedSlot,
        tema: tema.trim() || undefined,
      });
      setSent(true);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        // alguien reservó el mismo slot antes — refrescamos y volvemos al paso 2
        setErrorMsg("Ese horario se acaba de reservar. Por favor, elige otro.");
        setTaken((prev) => new Set(prev).add(`${toIsoDate(selectedDay)}|${selectedSlot}`));
        setSelectedSlot(null);
        setStep(2);
      } else {
        setErrorMsg("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    bg: "rgba(255,255,255,0.08)",
    border: `1px solid ${FG}55`,
    color: FG,
    borderRadius: "xl",
    fontFamily: "'EB Garamond', serif",
    fontSize: { base: "md", md: "lg" },
    _placeholder: { color: `${FG}66` },
    _focus: { borderColor: FG, boxShadow: `0 0 0 1px ${FG}55` },
    _hover: { borderColor: `${FG}aa` },
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={{ base: "full", md: "xl" }} isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.65)" sx={{ backdropFilter: "blur(6px)" }} />
      <ModalContent
        bg={BG}
        border={`1px solid ${FG}33`}
        borderRadius={{ base: "0", md: "2xl" }}
        boxShadow={`0 16px 60px rgba(0,0,0,0.5), 0 0 50px ${FG}22`}
        mx={{ base: 0, md: 0 }}
        fontFamily="'EB Garamond', serif"
        maxH={{ base: "100vh", md: "90vh" }}
        overflow="hidden"
      >
        <ModalCloseButton color={`${FG}cc`} top={4} right={4} zIndex={2} />
        <ModalBody px={{ base: 5, md: 8 }} py={{ base: 7, md: 8 }} overflowY="auto">
          {sent ? (
            <Flex direction="column" align="center" gap={4} py={6}>
              <Text fontSize="4xl" color={FG}>✓</Text>
              <Text
                color={FG}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                textAlign="center"
                letterSpacing="0.04em"
                textShadow={`0 0 14px ${FG}55`}
              >
                ¡Reserva confirmada!
              </Text>
              <Text
                color={`${FG}cc`}
                fontSize={{ base: "md", md: "lg" }}
                textAlign="center"
                lineHeight="1.7"
                maxW="420px"
              >
                Te he reservado el{" "}
                <Box as="span" color={FG} fontWeight="600">
                  {selectedDay && formatDayFullEs(selectedDay)} a las {selectedSlot}
                </Box>
                . Muy pronto recibirás un email con los detalles. Gracias por tu confianza.
              </Text>
              <Box
                as="button"
                onClick={handleClose}
                mt={3}
                px={8} py={2.5}
                borderRadius="full"
                border={`1.5px solid ${FG}66`}
                bg="transparent"
                color={FG}
                fontFamily="'EB Garamond', serif"
                fontSize="md"
                fontWeight="600"
                letterSpacing="0.06em"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: `${FG}18` }}
              >
                Cerrar
              </Box>
            </Flex>
          ) : (
            <Flex direction="column" gap={5}>
              {/* ── Cabecera ── */}
              <Box>
                <Text
                  color={FG}
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="900"
                  letterSpacing="0.04em"
                  lineHeight="1.2"
                  textShadow={`1px 2px 10px ${FG}55`}
                >
                  Agenda una llamada
                </Text>
                <Text
                  color={`${FG}cc`}
                  fontSize={{ base: "sm", md: "md" }}
                  fontStyle="italic"
                  mt={1}
                >
                  20 minutos, sin coste · horario peninsular España
                </Text>
              </Box>

              {/* ── Stepper ── */}
              <Flex align="center" gap={2} mt={1}>
                {[1, 2, 3].map((n) => (
                  <React.Fragment key={n}>
                    <Box
                      w="22px"
                      h="22px"
                      borderRadius="full"
                      bg={step >= (n as 1 | 2 | 3) ? FG : "transparent"}
                      border={`1.5px solid ${FG}aa`}
                      color={step >= (n as 1 | 2 | 3) ? BG : `${FG}aa`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xs"
                      fontWeight="700"
                      transition="all 0.25s"
                    >
                      {n}
                    </Box>
                    {n < 3 && (
                      <Box
                        flex="1"
                        h="1px"
                        bg={step > (n as 1 | 2 | 3) ? FG : `${FG}33`}
                        transition="background 0.25s"
                      />
                    )}
                  </React.Fragment>
                ))}
              </Flex>

              <Box h="1px" bg={`${FG}22`} borderRadius="full" />

              {/* ── PASO 1: Elegir día ── */}
              {step === 1 && (
                <Flex direction="column" gap={4}>
                  <Text color={FG} fontSize={{ base: "md", md: "lg" }} fontWeight="600">
                    Elige un día
                  </Text>
                  <Grid
                    templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }}
                    gap={{ base: 2, md: 3 }}
                  >
                    {days.map((d, i) => {
                      const { weekday, day, month } = formatDayLabel(d);
                      const isSelected = selectedDay?.toDateString() === d.toDateString();
                      return (
                        <Box
                          key={i}
                          as="button"
                          onClick={() => handlePickDay(d)}
                          bg={isSelected ? FG : "rgba(255,255,255,0.06)"}
                          color={isSelected ? BG : FG}
                          border={`1px solid ${isSelected ? FG : `${FG}33`}`}
                          borderRadius="xl"
                          py={{ base: 2.5, md: 3 }}
                          px={2}
                          cursor="pointer"
                          transition="all 0.2s"
                          _hover={{ bg: isSelected ? FG : "rgba(255,255,255,0.14)", borderColor: `${FG}88` }}
                          textAlign="center"
                        >
                          <Text fontSize="xs" opacity={0.75} textTransform="uppercase" letterSpacing="0.1em">
                            {weekday}
                          </Text>
                          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.2">
                            {day}
                          </Text>
                          <Text fontSize="xs" opacity={0.75} textTransform="lowercase">
                            {month}
                          </Text>
                        </Box>
                      );
                    })}
                  </Grid>
                </Flex>
              )}

              {/* ── PASO 2: Elegir hora ── */}
              {step === 2 && selectedDay && (
                <Flex direction="column" gap={4}>
                  <Flex justify="space-between" align="center" gap={3}>
                    <Box>
                      <Text color={FG} fontSize={{ base: "md", md: "lg" }} fontWeight="600">
                        Elige una hora
                      </Text>
                      <Text color={`${FG}aa`} fontSize="sm" textTransform="capitalize">
                        {formatDayFullEs(selectedDay)}
                      </Text>
                    </Box>
                    <Box
                      as="button"
                      onClick={() => setStep(1)}
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      border={`1px solid ${FG}55`}
                      bg="transparent"
                      color={`${FG}cc`}
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.05em"
                      cursor="pointer"
                      _hover={{ bg: `${FG}14`, color: FG }}
                      transition="all 0.2s"
                      flexShrink={0}
                    >
                      ← Cambiar día
                    </Box>
                  </Flex>
                  {errorMsg && (
                    <Box
                      bg="rgba(255,90,90,0.18)"
                      border="1px solid rgba(255,120,120,0.7)"
                      borderRadius="lg"
                      px={4}
                      py={3}
                    >
                      <Text color="#ffd4d4" fontSize={{ base: "sm", md: "md" }} textAlign="center" fontWeight="500">
                        {errorMsg}
                      </Text>
                    </Box>
                  )}
                  <Grid
                    templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }}
                    gap={{ base: 2, md: 2.5 }}
                  >
                    {slots.map((s) => {
                      const past = slotIsPast(selectedDay, s);
                      const isTaken = taken.has(`${toIsoDate(selectedDay)}|${s}`);
                      const disabled = past || isTaken;
                      const isSelected = selectedSlot === s;
                      return (
                        <Box
                          key={s}
                          as="button"
                          onClick={() => !disabled && handlePickSlot(s)}
                          disabled={disabled}
                          bg={isSelected ? FG : "rgba(255,255,255,0.06)"}
                          color={isSelected ? BG : (disabled ? `${FG}44` : FG)}
                          border={`1px solid ${isSelected ? FG : (disabled ? `${FG}22` : `${FG}33`)}`}
                          borderRadius="lg"
                          py={2.5}
                          fontWeight="600"
                          fontSize={{ base: "sm", md: "md" }}
                          cursor={disabled ? "not-allowed" : "pointer"}
                          opacity={disabled ? 0.5 : 1}
                          textDecoration={disabled ? "line-through" : "none"}
                          transition="all 0.18s"
                          _hover={disabled ? {} : { bg: isSelected ? FG : "rgba(255,255,255,0.14)", borderColor: `${FG}88` }}
                          textAlign="center"
                          title={isTaken ? "Ya reservado" : undefined}
                        >
                          {s}
                        </Box>
                      );
                    })}
                  </Grid>
                </Flex>
              )}

              {/* ── PASO 3: Datos ── */}
              {step === 3 && selectedDay && selectedSlot && (
                <Flex direction="column" gap={4}>
                  <Flex justify="space-between" align="center" gap={3}>
                    <Box>
                      <Text color={FG} fontSize={{ base: "md", md: "lg" }} fontWeight="600">
                        Tus datos
                      </Text>
                      <Text color={`${FG}aa`} fontSize="sm" textTransform="capitalize">
                        {formatDayFullEs(selectedDay)} · {selectedSlot}
                      </Text>
                    </Box>
                    <Box
                      as="button"
                      onClick={() => setStep(2)}
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      border={`1px solid ${FG}55`}
                      bg="transparent"
                      color={`${FG}cc`}
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.05em"
                      cursor="pointer"
                      _hover={{ bg: `${FG}14`, color: FG }}
                      transition="all 0.2s"
                      flexShrink={0}
                    >
                      ← Cambiar hora
                    </Box>
                  </Flex>

                  <Input
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    {...inputStyle}
                  />
                  <Input
                    placeholder="Tu email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    {...inputStyle}
                  />
                  <Textarea
                    placeholder="¿De qué te gustaría hablar? (opcional)"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    rows={3}
                    resize="none"
                    {...inputStyle}
                  />

                  {errorMsg && (
                    <Box
                      bg="rgba(255,90,90,0.18)"
                      border="1px solid rgba(255,120,120,0.7)"
                      borderRadius="lg"
                      px={4}
                      py={3}
                    >
                      <Text color="#ffd4d4" fontSize={{ base: "sm", md: "md" }} textAlign="center" fontWeight="500">
                        {errorMsg}
                      </Text>
                    </Box>
                  )}

                  <Box
                    as="button"
                    onClick={handleSubmit}
                    disabled={sending || !nombre.trim() || !email.trim()}
                    mt={1}
                    px={8} py={3}
                    borderRadius="full"
                    bg={FG}
                    color={BG}
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="700"
                    letterSpacing="0.07em"
                    cursor={sending || !nombre.trim() || !email.trim() ? "not-allowed" : "pointer"}
                    opacity={sending || !nombre.trim() || !email.trim() ? 0.5 : 1}
                    transition="all 0.22s"
                    boxShadow={`0 4px 20px ${FG}44`}
                    _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
                  >
                    {sending ? "Reservando..." : "Confirmar reserva"}
                  </Box>
                </Flex>
              )}
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
