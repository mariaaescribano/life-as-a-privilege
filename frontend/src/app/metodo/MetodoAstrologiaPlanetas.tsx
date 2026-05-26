import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Glifo } from "../../components/metodo/Glifo";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";

const EyeIcon = () => (
  <Box
    as="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    w="16px"
    h="16px"
    fill="currentColor"
    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
  >
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);
import {
  ZODIAC_SIGNS,
  CASAS,
  CUERPOS,
  type CuerpoKey,
  type Cuerpo,
} from "../../components/metodo/astrologiaData";
import {
  API_URL,
  astrologiaBg,
  astrologiaTxt,
  AstrologiaIcon,
} from "../../GlobalVariables";

/* ─────────── Tipos y helpers ─────────── */

interface Valor {
  signo?: string;
  casa?: number;
  profundizadoSigno?: boolean;
  profundizadoCasa?: boolean;
}

type CartaData = Partial<Record<CuerpoKey, Valor>>;

const valorOf = (carta: CartaData, key: CuerpoKey): Valor => carta[key] || {};

function esCuerpoCompleto(c: Cuerpo, v: Valor): boolean {
  if (!v.signo) return false;
  if (!v.profundizadoSigno) return false;
  if (c.conCasa) {
    if (v.casa == null) return false;
    if (!v.profundizadoCasa) return false;
  }
  return true;
}

// Índice del primer cuerpo no completado (-1 si todos completados)
function siguienteCuerpoIndex(carta: CartaData): number {
  for (let i = 0; i < CUERPOS.length; i++) {
    if (!esCuerpoCompleto(CUERPOS[i], valorOf(carta, CUERPOS[i].key))) return i;
  }
  return -1;
}

/* Glifo zodiacal para los símbolos de signo dentro del selector */
const ZodiacGlyph = ({ symbol, size = 22, color = "currentColor" }: { symbol: string; size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ flexShrink: 0 }}>
    <text x="12" y="19" textAnchor="middle" fontSize="19"
          fontFamily="'Times New Roman', Georgia, 'DejaVu Serif', serif">
      {symbol}{"︎"}
    </text>
  </svg>
);

/* Fondo espacial reutilizado */
const SpaceBg = ({ overlay = "rgba(8,13,30,0.55)" }: { overlay?: string }) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius="inherit"
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
    }}
  >
    <Box
      as="img"
      src="/img/astrologia/space.jpg"
      alt=""
      loading="eager"
      position="absolute"
      inset="0"
      w="100%"
      h="100%"
      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.85 }}
    />
    <Box position="absolute" inset="0" style={{ background: overlay }} />
  </Box>
);

type PickerState = { key: CuerpoKey; campo: "signo" | "casa" } | null;

/* Botón "Profundizar" */
const ProfundizarBtn = ({
  label,
  color,
  enabled,
  onClick,
  align = "left",
}: {
  label: string;
  color: string;
  enabled: boolean;
  onClick: () => void;
  align?: "left" | "right";
}) => (
  <Box
    as="button"
    onClick={enabled ? onClick : undefined}
    disabled={!enabled}
    px={5}
    py={2.5}
    borderRadius="lg"
    bg="transparent"
    border={`1px solid ${enabled ? color + "77" : color + "22"}`}
    color={enabled ? color : `${color}55`}
    fontFamily="'EB Garamond', serif"
    fontSize={{ base: "md", md: "lg" }}
    letterSpacing="0.06em"
    fontStyle="italic"
    cursor={enabled ? "pointer" : "not-allowed"}
    display="flex"
    alignItems="center"
    justifyContent={align === "right" ? "flex-end" : "flex-start"}
    gap={2}
    transition="all 0.2s"
    boxShadow={enabled ? `0 0 10px rgba(255,255,255,0.2), 0 0 22px ${color}33` : "none"}
    textShadow={enabled ? `0 0 10px rgba(255,255,255,0.45), 0 0 22px ${color}55` : "none"}
    _hover={enabled ? { borderColor: color, boxShadow: `0 0 16px rgba(255,255,255,0.4), 0 0 30px ${color}66`, color: color } : undefined}
    title={enabled ? undefined : "Elige primero para profundizar"}
  >
    <Text as="span">{label}</Text>
    <Box as="span" display="inline-flex" alignItems="center" style={{ filter: enabled ? `drop-shadow(0 0 6px rgba(255,255,255,0.45))` : "none" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </Box>
  </Box>
);

/* ─────────── PÁGINA ─────────── */

export default function MetodoAstrologiaPlanetas() {
  const navigate = useNavigate();
  const [carta, setCarta] = useState<CartaData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<PickerState>(null);
  const [comicOpen, setComicOpen] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingData = useRef<CartaData | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId) {
      navigate("/welcome");
      return;
    }

    (async () => {
      try {
        const res = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.data?.link_carta) {
          navigate("/metodo/astrologia", { replace: true });
          return;
        }
        if (res.data?.data) setCarta(res.data.data);
      } catch {
        navigate("/metodo/astrologia", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const actualizar = (key: CuerpoKey, campo: "signo" | "casa", valor: string) => {
    setCarta((prev) => {
      const next: CartaData = {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [campo]: campo === "casa" ? (valor ? Number(valor) : undefined) : (valor || undefined),
        },
      };
      const entry = next[key];
      if (entry && !entry.signo && entry.casa == null && !entry.profundizadoSigno && !entry.profundizadoCasa) {
        delete next[key];
      }

      pendingData.current = next;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        if (pendingData.current) {
          void guardarEnBd(pendingData.current);
          pendingData.current = null;
        }
      }, 1500);

      return next;
    });
  };

  const guardarEnBd = async (data: CartaData) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    setSaving(true);
    try {
      await axios.patch(
        `${API_URL}/metodo-astrologia/${userId}`,
        { data },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch {
      // Silencioso
    } finally {
      setSaving(false);
    }
  };

  // Antes de salir, manda el PATCH pendiente
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (pendingData.current) {
        void guardarEnBd(pendingData.current);
        pendingData.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <Box minH="100vh" bg="#008080">
        <SpinnerTurquesa />
      </Box>
    );
  }

  const siguienteIdx = siguienteCuerpoIndex(carta);
  const todoCompletado = siguienteIdx === -1;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* ── CABECERA ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }}>
        <MetodoStepHeader
          icon={<AstrologiaIcon size={{ base: "40px", md: "56px" }} />}
          title="Astrología"
          bgColor={`${astrologiaBg}dd`}
          color={astrologiaTxt}
          space
          mb={0}
          prev={{ label: "← Mi carta 3D", onClick: () => navigate("/metodo/astrologia/cartaAstral") }}
          extra={{ label: "Cómic", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
          next={{
            label: todoCompletado ? "Continuar a Psicología →" : "Completa primero la carta",
            onClick: () => navigate("/metodo/psicologia"),
            disabled: !todoCompletado,
          }}
        />
      </Flex>

      {/* ── GRID DE PLANETAS ── */}
      <Box px={{ base: 5, md: 10, lg: 16 }} py={{ base: 8, md: 12 }}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={{ base: 5, md: 6 }}
        >
          {CUERPOS.map((c, index) => {
            const valor = valorOf(carta, c.key);
            const desbloqueado = index <= siguienteIdx || (todoCompletado);
            const esActual = index === siguienteIdx;
            const bloqueado = !desbloqueado;
            const completo = esCuerpoCompleto(c, valor);

            // Glow intensificado cuando es el cuerpo "actual"
            const borderColor = bloqueado
              ? `${c.color}22`
              : esActual
              ? c.color
              : `${c.color}66`;
            const boxShadow = bloqueado
              ? "none"
              : esActual
              ? `0 0 36px ${c.color}cc, 0 0 80px ${c.color}88, 0 0 140px ${c.color}55`
              : `0 0 22px ${c.color}55, 0 0 60px ${c.color}33`;

            return (
              <Box
                key={c.key}
                position="relative"
                borderRadius="2xl"
                overflow="hidden"
                border={`${esActual ? 2 : 1.5}px solid ${borderColor}`}
                boxShadow={boxShadow}
                opacity={bloqueado ? 0.4 : 1}
                filter={bloqueado ? "grayscale(0.45)" : "none"}
                pointerEvents={bloqueado ? "none" : "auto"}
                transition="all 0.3s ease"
              >
                <SpaceBg overlay="rgba(8,13,30,0.65)" />

                <Box position="relative" zIndex={1} px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }}>

                  {/* Cabecera del box: icono + nombre + número de orden */}
                  <Flex align="center" gap={3} mb={3}>
                    <Box
                      w="44px"
                      h="44px"
                      borderRadius="full"
                      bg={`${c.color}1f`}
                      border={`1px solid ${c.color}55`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Glifo symbol={c.symbol} color={c.color} size={28} />
                    </Box>
                    <Text
                      color={c.color}
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="700"
                      letterSpacing="0.06em"
                      style={{ textShadow: `0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.32), 0 0 56px ${c.color}66` }}
                      flex="1"
                    >
                      {c.label}
                    </Text>
                    {completo && (
                      <Box
                        as="span"
                        color={c.color}
                        fontSize="lg"
                        title="Completado"
                        opacity={0.85}
                      >
                        ✓
                      </Box>
                    )}
                  </Flex>

                  <Box h="1px" mb={4} bgGradient={`linear(to-r, ${c.color}66, transparent)`} />

                  {/* Selectores */}
                  <Flex direction={c.conCasa ? { base: "column", sm: "row" } : "column"} gap={3}>
                    <Box flex="1">
                      <Text
                        color={`${c.color}cc`}
                        fontSize="xs"
                        letterSpacing="0.16em"
                        mb={1.5}
                        fontWeight="600"
                        style={{ textShadow: `0 0 8px rgba(255,255,255,0.35), 0 0 16px ${c.color}55` }}
                      >
                        SIGNO
                      </Text>
                      <Box
                        as="button"
                        onClick={() => setPicker({ key: c.key, campo: "signo" })}
                        w="100%"
                        px={4}
                        py={2.5}
                        borderRadius="lg"
                        bg="rgba(8,13,30,0.55)"
                        border={`1px solid ${c.color}55`}
                        color={valor.signo ? c.color : `${c.color}88`}
                        fontFamily="'EB Garamond', serif"
                        fontSize="lg"
                        letterSpacing="0.04em"
                        textAlign="left"
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={2}
                        transition="all 0.2s"
                        boxShadow={`0 0 16px ${c.color}22, inset 0 0 12px ${c.color}10`}
                        textShadow={valor.signo ? `0 0 10px rgba(255,255,255,0.45), 0 0 22px ${c.color}55` : "none"}
                        _hover={{ borderColor: `${c.color}aa`, boxShadow: `0 0 22px ${c.color}44, inset 0 0 12px ${c.color}18` }}
                      >
                        <Flex align="center" gap={2}>
                          {valor.signo && (
                            <ZodiacGlyph
                              symbol={ZODIAC_SIGNS.find((s) => s.name === valor.signo)?.symbol || ""}
                              size={22}
                              color={c.color}
                            />
                          )}
                          <Text as="span">{valor.signo || "Elegir…"}</Text>
                        </Flex>
                        <Text as="span" fontSize="xs" opacity={0.7}>▾</Text>
                      </Box>
                    </Box>

                    {c.conCasa && (
                      <Box w={{ base: "100%", sm: "130px" }}>
                        <Text
                          color={`${c.color}cc`}
                          fontSize="xs"
                          letterSpacing="0.16em"
                          mb={1.5}
                          fontWeight="600"
                          style={{ textShadow: `0 0 8px rgba(255,255,255,0.35), 0 0 16px ${c.color}55` }}
                        >
                          CASA
                        </Text>
                        <Box
                          as="button"
                          onClick={() => setPicker({ key: c.key, campo: "casa" })}
                          w="100%"
                          px={4}
                          py={2.5}
                          borderRadius="lg"
                          bg="rgba(8,13,30,0.55)"
                          border={`1px solid ${c.color}55`}
                          color={valor.casa != null ? c.color : `${c.color}88`}
                          fontFamily="'EB Garamond', serif"
                          fontSize="lg"
                          letterSpacing="0.04em"
                          textAlign="left"
                          cursor="pointer"
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          gap={2}
                          transition="all 0.2s"
                          boxShadow={`0 0 16px ${c.color}22, inset 0 0 12px ${c.color}10`}
                          textShadow={valor.casa != null ? `0 0 10px rgba(255,255,255,0.45), 0 0 22px ${c.color}55` : "none"}
                          _hover={{ borderColor: `${c.color}aa`, boxShadow: `0 0 22px ${c.color}44, inset 0 0 12px ${c.color}18` }}
                        >
                          <Text as="span">{valor.casa != null ? `Casa ${valor.casa}` : "—"}</Text>
                          <Text as="span" fontSize="xs" opacity={0.7}>▾</Text>
                        </Box>
                      </Box>
                    )}
                  </Flex>

                  {/* Botones profundizar */}
                  <Flex mt={5} gap={3} justify={c.conCasa ? "space-between" : "center"} direction={{ base: "column", sm: "row" }}>
                    <ProfundizarBtn
                      label={valor.profundizadoSigno ? "Ver signo ✓" : "Ver signo"}
                      color={c.color}
                      enabled={!!valor.signo}
                      onClick={() => navigate(`/metodo/astrologia/${c.key}/signo`)}
                    />
                    {c.conCasa && (
                      <ProfundizarBtn
                        label={valor.profundizadoCasa ? "Ver casa ✓" : "Ver casa"}
                        color={c.color}
                        enabled={valor.casa != null}
                        onClick={() => navigate(`/metodo/astrologia/${c.key}/casa`)}
                        align="right"
                      />
                    )}
                  </Flex>

                </Box>
              </Box>
            );
          })}
        </Grid>

        <Flex justify="center" mt={6}>
          <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.1em" fontStyle="italic">
            {saving ? "Guardando…" : "Tus cambios se guardan automáticamente."}
          </Text>
        </Flex>
      </Box>

      {/* ── MODAL DE SELECCIÓN ── */}
      {picker && (() => {
        const cuerpo = CUERPOS.find((c) => c.key === picker.key)!;
        const color = cuerpo.color;
        const esSigno = picker.campo === "signo";
        return (
          <Box
            position="fixed"
            inset="0"
            zIndex={1000}
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={4}
            onClick={() => setPicker(null)}
          >
            <Box position="absolute" inset="0" bg="rgba(0,0,0,0.78)" />

            <Box
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              w="100%"
              maxW="520px"
              maxH="88vh"
              display="flex"
              flexDirection="column"
              border={`1px solid ${color}66`}
              boxShadow={`0 0 32px ${color}55, 0 0 80px ${color}22, 0 12px 60px rgba(0,0,0,0.6)`}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <SpaceBg overlay="rgba(8,13,30,0.7)" />

              <Box position="absolute" top={3} right={3} zIndex={2}>
                <Box
                  as="button"
                  onClick={() => setPicker(null)}
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="rgba(0,0,0,0.5)"
                  border={`1px solid ${color}55`}
                  color={`${color}aa`}
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{ color: color, borderColor: color, bg: "rgba(0,0,0,0.7)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                  </svg>
                </Box>
              </Box>

              <Box position="relative" zIndex={1} px={6} py={7} display="flex" flexDirection="column" gap={4} overflowY="auto">
                <Flex align="center" gap={3}>
                  <Box
                    w="48px"
                    h="48px"
                    borderRadius="full"
                    bg={`${color}1f`}
                    border={`1px solid ${color}66`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    boxShadow={`0 0 18px ${color}44`}
                  >
                    <Glifo symbol={cuerpo.symbol} color={color} size={28} />
                  </Box>
                  <Text
                    color={color}
                    fontSize="xl"
                    fontWeight="700"
                    letterSpacing="0.05em"
                    style={{ textShadow: `0 0 10px ${color}88` }}
                  >
                    {cuerpo.label} — {esSigno ? "elige signo" : "elige casa"}
                  </Text>
                </Flex>

                <Box h="1px" bgGradient={`linear(to-r, ${color}66, transparent)`} />

                {esSigno && (
                  <Box maxH="56vh" overflowY="auto" px={1}>
                    {ZODIAC_SIGNS.map((s) => {
                      const elegido = valorOf(carta, picker.key).signo === s.name;
                      return (
                        <Flex
                          key={s.name}
                          as="button"
                          align="center"
                          gap={3}
                          w="100%"
                          px={3}
                          py={2.5}
                          borderRadius="lg"
                          cursor="pointer"
                          transition="all 0.14s"
                          bg={elegido ? `${color}1c` : "transparent"}
                          border={`1px solid ${elegido ? color + "66" : "transparent"}`}
                          _hover={{ bg: `${color}14`, borderColor: `${color}44` }}
                          onClick={() => {
                            actualizar(picker.key, "signo", s.name);
                            setPicker(null);
                          }}
                        >
                          <Box
                            w="38px"
                            h="38px"
                            borderRadius="full"
                            bg={`${color}12`}
                            border={`1px solid ${color}44`}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color={color}
                            flexShrink={0}
                            boxShadow={`0 0 10px ${color}33`}
                          >
                            <ZodiacGlyph symbol={s.symbol} size={20} />
                          </Box>
                          <Text color={color} fontSize="lg" fontFamily="'EB Garamond', serif" letterSpacing="0.04em">
                            {s.name}
                          </Text>
                        </Flex>
                      );
                    })}
                  </Box>
                )}

                {!esSigno && (
                  <Grid templateColumns="repeat(4, 1fr)" gap={2.5}>
                    {CASAS.map((n) => {
                      const elegida = valorOf(carta, picker.key).casa === n;
                      return (
                        <Box
                          key={n}
                          as="button"
                          py={4}
                          borderRadius="lg"
                          cursor="pointer"
                          transition="all 0.14s"
                          bg={elegida ? `${color}1f` : "rgba(8,13,30,0.55)"}
                          border={`1px solid ${elegida ? color : color + "44"}`}
                          color={color}
                          fontFamily="'EB Garamond', serif"
                          fontSize="lg"
                          fontWeight="600"
                          boxShadow={elegida ? `0 0 18px ${color}66, inset 0 0 12px ${color}22` : `0 0 8px ${color}22`}
                          _hover={{ borderColor: color, boxShadow: `0 0 20px ${color}55, inset 0 0 10px ${color}22` }}
                          onClick={() => {
                            actualizar(picker.key, "casa", String(n));
                            setPicker(null);
                          }}
                        >
                          {n}
                        </Box>
                      );
                    })}
                  </Grid>
                )}

                {(esSigno ? !!valorOf(carta, picker.key).signo : valorOf(carta, picker.key).casa != null) && (
                  <Flex justify="flex-end">
                    <Box
                      as="button"
                      onClick={() => {
                        actualizar(picker.key, picker.campo, "");
                        setPicker(null);
                      }}
                      color={`${color}88`}
                      fontSize="sm"
                      fontStyle="italic"
                      cursor="pointer"
                      _hover={{ color: "#ff8a7a" }}
                    >
                      Limpiar
                    </Box>
                  </Flex>
                )}
              </Box>
            </Box>
          </Box>
        );
      })()}

      <ComicAstrologiaModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
      />

      <SiteFooter />
    </Box>
  );
}
