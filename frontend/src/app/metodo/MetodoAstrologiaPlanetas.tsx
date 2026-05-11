import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import {
  API_URL,
  astrologiaBg,
  astrologiaTxt,
  AstrologiaIcon,
} from "../../GlobalVariables";

const ZODIAC_SIGNS = [
  { name: "Aries",       symbol: "♈" },
  { name: "Tauro",       symbol: "♉" },
  { name: "Géminis",     symbol: "♊" },
  { name: "Cáncer",      symbol: "♋" },
  { name: "Leo",         symbol: "♌" },
  { name: "Virgo",       symbol: "♍" },
  { name: "Libra",       symbol: "♎" },
  { name: "Escorpio",    symbol: "♏" },
  { name: "Sagitario",   symbol: "♐" },
  { name: "Capricornio", symbol: "♑" },
  { name: "Acuario",     symbol: "♒" },
  { name: "Piscis",      symbol: "♓" },
];

const CASAS = Array.from({ length: 12 }, (_, i) => i + 1);

type CuerpoKey =
  | "ascendente"
  | "sol"        | "luna"      | "mercurio"  | "venus"   | "marte"
  | "jupiter"    | "saturno"   | "urano"     | "neptuno" | "pluton"
  | "quiron"     | "nodoNorte" | "nodoSur";

interface Cuerpo {
  key: CuerpoKey;
  label: string;
  symbol: string;
  color: string;
  conCasa: boolean; // Ascendente define la casa 1, no se elige casa
}

// Símbolos Unicode + colores característicos
const CUERPOS: Cuerpo[] = [
  { key: "ascendente", label: "Ascendente", symbol: "↑", color: "#feffe4", conCasa: false },
  { key: "sol",        label: "Sol",        symbol: "☉", color: "#FFD97D", conCasa: true  },
  { key: "luna",       label: "Luna",       symbol: "☽", color: "#C8C8E8", conCasa: true  },
  { key: "mercurio",   label: "Mercurio",   symbol: "☿", color: "#A8B8C8", conCasa: true  },
  { key: "venus",      label: "Venus",      symbol: "♀", color: "#FFB8D0", conCasa: true  },
  { key: "marte",      label: "Marte",      symbol: "♂", color: "#FF7055", conCasa: true  },
  { key: "jupiter",    label: "Júpiter",    symbol: "♃", color: "#FFBA60", conCasa: true  },
  { key: "saturno",    label: "Saturno",    symbol: "♄", color: "#E0CC80", conCasa: true  },
  { key: "urano",      label: "Urano",      symbol: "♅", color: "#80EFD8", conCasa: true  },
  { key: "neptuno",    label: "Neptuno",    symbol: "♆", color: "#6090FF", conCasa: true  },
  { key: "pluton",     label: "Plutón",     symbol: "♇", color: "#B080E0", conCasa: true  },
  { key: "quiron",     label: "Quirón",     symbol: "⚷", color: "#C8B070", conCasa: true  },
  { key: "nodoNorte",  label: "Nodo Norte", symbol: "☊", color: "#7BB8E0", conCasa: true  },
  { key: "nodoSur",    label: "Nodo Sur",   symbol: "☋", color: "#C8806A", conCasa: true  },
];

type CartaData = Partial<Record<CuerpoKey, { signo?: string; casa?: number }>>;

const valorOf = (carta: CartaData, key: CuerpoKey) => carta[key] || {};

// SVG glifo del planeta (texto Unicode renderizado como serif)
const Glifo = ({ symbol, color, size = 30 }: { symbol: string; color: string; size?: number }) => (
  <svg
    viewBox="0 0 36 36"
    width={size}
    height={size}
    style={{ flexShrink: 0, filter: `drop-shadow(0 0 8px ${color}99)` }}
  >
    <text
      x="18"
      y="27"
      textAnchor="middle"
      fontSize="26"
      fontFamily="'Times New Roman', Georgia, 'DejaVu Serif', serif"
      fill={color}
    >
      {symbol}
      {"︎"}
    </text>
  </svg>
);

// Fondo espacial: degradado cósmico base + foto de estrellas encima + velo translúcido.
// El degradado garantiza un fondo bonito aunque la imagen tarde en cargar.
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

// Glifo zodiacal (texto Unicode como SVG) — para los signos en la lista
const ZodiacGlyph = ({ symbol, size = 22, color = "currentColor" }: { symbol: string; size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ flexShrink: 0 }}>
    <text
      x="12"
      y="19"
      textAnchor="middle"
      fontSize="19"
      fontFamily="'Times New Roman', Georgia, 'DejaVu Serif', serif"
    >
      {symbol}
      {"︎"}
    </text>
  </svg>
);

type PickerState = { key: CuerpoKey; campo: "signo" | "casa" } | null;

// Botón "Profundizar signo / casa" — abre la página de desarrollo
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
    px={4}
    py={2}
    borderRadius="lg"
    bg="transparent"
    border={`1px solid ${enabled ? color + "77" : color + "22"}`}
    color={enabled ? color : `${color}55`}
    fontFamily="'EB Garamond', serif"
    fontSize="sm"
    letterSpacing="0.06em"
    fontStyle="italic"
    cursor={enabled ? "pointer" : "not-allowed"}
    display="flex"
    alignItems="center"
    justifyContent={align === "right" ? "flex-end" : "flex-start"}
    gap={2}
    transition="all 0.2s"
    boxShadow={enabled ? `0 0 14px ${color}22` : "none"}
    _hover={enabled ? { borderColor: color, boxShadow: `0 0 18px ${color}55`, color: color } : undefined}
    title={enabled ? undefined : "Elige primero para profundizar"}
  >
    <Text as="span">{label}</Text>
    <Box as="span" display="inline-flex" alignItems="center">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </Box>
  </Box>
);

export default function MetodoAstrologiaPlanetas() {
  const navigate = useNavigate();
  const [carta, setCarta] = useState<CartaData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<PickerState>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingData = useRef<CartaData | null>(null);

  // Carga inicial: intenta BD, fallback a localStorage
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
        // Gating: si no tiene link_carta aún, esta página está bloqueada.
        if (!res.data?.link_carta) {
          navigate("/metodo/astrologia", { replace: true });
          return;
        }
        if (res.data?.data) setCarta(res.data.data);
      } catch {
        // Si BD falla, mejor mandar a la página principal por seguridad.
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
      // Si los dos campos quedan vacíos, limpia la entrada
      const entry = next[key];
      if (entry && !entry.signo && entry.casa == null) delete next[key];

      // Debounce el PATCH al backend: solo dispara 1.5s después del último cambio
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

  // Si el usuario sale de la página con un PATCH pendiente, lo enviamos antes.
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (pendingData.current) {
        void guardarEnBd(pendingData.current);
        pendingData.current = null;
      }
    };
  }, []);

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
      // Silencioso: la app sigue funcionando con localStorage
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="#008080">
        <SpinnerTurquesa />
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
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
          prev={{ label: "← Volver a mi carta", onClick: () => navigate("/metodo/astrologia") }}
          next={{ label: "Siguiente disciplina →", onClick: () => {}, disabled: true }}
        />
      </Flex>

      {/* Subtítulo */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={4}>
        <Text
          color={`${astrologiaTxt}cc`}
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.7"
          fontStyle="italic"
          letterSpacing="0.015em"
          textAlign="center"
          maxW="700px"
        >
          Indica el signo y la casa de cada planeta para empezar a integrar tus arquetipos.
        </Text>
      </Flex>

      {/* ── GRID DE PLANETAS ── */}
      <Box px={{ base: 5, md: 10, lg: 16 }} py={{ base: 10, md: 14 }}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={{ base: 5, md: 6 }}
        >
          {CUERPOS.map((c) => {
            const valor = carta[c.key] || {};
            return (
              <Box
                key={c.key}
                position="relative"
                borderRadius="2xl"
                overflow="hidden"
                border={`1.5px solid ${c.color}99`}
                boxShadow={`0 0 24px ${c.color}88, 0 0 60px ${c.color}55, 0 0 120px ${c.color}33`}
              >
                <SpaceBg overlay="rgba(8,13,30,0.65)" />

                <Box position="relative" zIndex={1} px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }}>

                {/* Cabecera del box: icono + nombre */}
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
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="700"
                    letterSpacing="0.05em"
                    filter={`drop-shadow(0 1px 4px ${c.color}55)`}
                  >
                    {c.label}
                  </Text>
                </Flex>

                {/* Línea separadora */}
                <Box
                  h="1px"
                  mb={4}
                  bgGradient={`linear(to-r, ${c.color}66, transparent)`}
                />

                {/* Selectores custom */}
                <Flex direction={c.conCasa ? { base: "column", sm: "row" } : "column"} gap={3}>
                  <Box flex="1">
                    <Text color={`${c.color}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600">
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
                      fontSize="md"
                      letterSpacing="0.04em"
                      textAlign="left"
                      cursor="pointer"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={2}
                      transition="all 0.2s"
                      boxShadow={`0 0 16px ${c.color}22, inset 0 0 12px ${c.color}10`}
                      _hover={{ borderColor: `${c.color}aa`, boxShadow: `0 0 22px ${c.color}44, inset 0 0 12px ${c.color}18` }}
                    >
                      <Flex align="center" gap={2}>
                        {valor.signo && (
                          <ZodiacGlyph
                            symbol={ZODIAC_SIGNS.find((s) => s.name === valor.signo)?.symbol || ""}
                            size={18}
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
                      <Text color={`${c.color}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600">
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
                        fontSize="md"
                        letterSpacing="0.04em"
                        textAlign="left"
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={2}
                        transition="all 0.2s"
                        boxShadow={`0 0 16px ${c.color}22, inset 0 0 12px ${c.color}10`}
                        _hover={{ borderColor: `${c.color}aa`, boxShadow: `0 0 22px ${c.color}44, inset 0 0 12px ${c.color}18` }}
                      >
                        <Text as="span">{valor.casa != null ? `Casa ${valor.casa}` : "—"}</Text>
                        <Text as="span" fontSize="xs" opacity={0.7}>▾</Text>
                      </Box>
                    </Box>
                  )}
                </Flex>

                {/* Botones para profundizar (signo / casa) */}
                <Flex
                  mt={5}
                  gap={3}
                  justify={c.conCasa ? "space-between" : "center"}
                  direction={{ base: "column", sm: "row" }}
                >
                  <ProfundizarBtn
                    label="Profundizar signo"
                    color={c.color}
                    enabled={!!valor.signo}
                    onClick={() => navigate(`/metodo/astrologia/${c.key}/signo`)}
                  />
                  {c.conCasa && (
                    <ProfundizarBtn
                      label="Profundizar casa"
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

        {/* Indicador discreto de guardado */}
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

              {/* Botón X */}
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
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                  </svg>
                </Box>
              </Box>

              {/* Contenido */}
              <Box position="relative" zIndex={1} px={6} py={7} display="flex" flexDirection="column" gap={4} overflowY="auto">
                {/* Cabecera del modal */}
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

                {/* Lista de signos */}
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

                {/* Grid de casas */}
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

                {/* Limpiar */}
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

      <SiteFooter />
    </Box>
  );
}
