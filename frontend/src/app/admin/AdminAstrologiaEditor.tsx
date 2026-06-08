import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea, Input, Spinner } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Glifo } from "../../components/metodo/Glifo";
import { cuerpoByKey } from "../../components/metodo/astrologiaData";
import type { CartaNatal, Aspecto } from "../../components/metodo/CartaAstral3D/types";
import {
  infoCasa,
  NUMEROS_ROMANOS,
  ASPECTO_LABEL,
  ASPECTO_SYMBOL,
  aspectoKey,
} from "../../components/metodo/casasAspectos";
import { API_URL, turquesa, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";

// Sombra/brillo blanco para texto sobre los boxes estrellados.
const GLOW = `0 1px 3px rgba(0,0,0,0.6), 0 0 10px rgba(255,255,255,0.45), 0 0 22px ${astrologiaTxt}55`;
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import { AdminDisciplinaHeader } from "./AdminDisciplinaHeader";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

const Chevron = ({ open, color }: { open: boolean; color: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill={color}
       style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
    <path d="M480-360 280-560h400L480-360Z" />
  </Box>
);

function Desplegable({ titulo, count, open, onToggle, children }: {
  titulo: string; count: number; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <Box position="relative" borderRadius="xl" border={`1px solid ${turquesa}44`} mb={5} overflow="hidden"
         boxShadow={`0 0 16px ${turquesa}1f`}>
      <DisciplinaBgLayer nom={astrologiaNom} borderRadius="xl" overlay="rgba(8,13,30,0.82)" />
      <Flex position="relative" zIndex={1} as="button" w="100%" align="center" justify="space-between" px={{ base: 4, md: 6 }} py={4}
            onClick={onToggle} cursor="pointer" _hover={{ bg: "rgba(255,255,255,0.05)" }} transition="background 0.15s">
        <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.04em" style={{ textShadow: GLOW }}>
          {titulo} <Box as="span" color="rgba(255,255,255,0.75)" fontSize="sm">({count})</Box>
        </Text>
        <Chevron open={open} color="#ffffff" />
      </Flex>
      {open && <Box position="relative" zIndex={1} px={{ base: 4, md: 6 }} pt={1} pb={6}>{children}</Box>}
    </Box>
  );
}

export default function AdminAstrologiaEditor() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { verificando } = useAdminGuard();

  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const [casas, setCasas] = useState<Record<string, string>>({});
  const [aspectos, setAspectos] = useState<Record<string, string>>({});
  const [linkCarta, setLinkCarta] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [casasOpen, setCasasOpen] = useState(true);
  const [aspectosOpen, setAspectosOpen] = useState(false);

  const disc = disciplinaByKey("astrologia")!;

  useEffect(() => {
    if (verificando || !userId) return;
    (async () => {
      try {
        const [userRes, cartaRes, rowRes] = await Promise.all([
          axios.get(`${API_URL}/user/${userId}`, { headers: adminHeaders() }),
          axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, { headers: adminHeaders() }),
          axios.get<{ casas_texto?: Record<string, string>; aspectos_texto?: Record<string, string>; link_carta?: string | null } | null>(
            `${API_URL}/metodo-astrologia/${userId}`, { headers: adminHeaders() },
          ),
        ]);
        setNombre(userRes.data?.name ?? "");
        setEmail(userRes.data?.email ?? "");
        setCarta(cartaRes.data ?? null);
        setCasas((rowRes.data?.casas_texto ?? {}) as Record<string, string>);
        setAspectos((rowRes.data?.aspectos_texto ?? {}) as Record<string, string>);
        setLinkCarta(rowRes.data?.link_carta ?? "");
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
  }, [verificando, userId]);

  const guardar = async () => {
    if (!userId) return;
    setGuardando(true);
    setGuardado(false);
    try {
      await axios.patch(
        `${API_URL}/metodo-astrologia/admin/${userId}/textos`,
        { casas_texto: casas, aspectos_texto: aspectos, link_carta: linkCarta },
        { headers: adminHeaders() },
      );
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  if (verificando || loading) {
    return (
      <Flex minH="100vh" bg="#008080" justify="center" align="center">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  const cusps = carta?.cusps ?? [];
  const listaAspectos: Aspecto[] = carta?.aspectos ?? [];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
          <Box w="100%" maxW="820px">
            <Text as="button" onClick={() => navigate("/admin/astrologia")} color="rgba(255,255,255,0.75)" fontSize="sm" mb={3}
                  _hover={{ color: "white" }}>← Usuarios de astrología</Text>

            {/* header de disciplina con su imagen */}
            <AdminDisciplinaHeader disc={disc} subtitle={`${nombre || "Usuario"}${email ? ` · ${email}` : ""}`} />

            {/* barra de guardar */}
            <Flex justify="flex-end" align="center" gap={3} mb={5}>
              {guardado && (
                <Flex align="center" gap={1.5} color="#ffffff" fontSize="sm" fontStyle="italic" style={{ textShadow: GLOW }}>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill="#ffffff">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                  Guardado
                </Flex>
              )}
              <Box as="button" onClick={guardando ? undefined : guardar}
                   position="relative" overflow="hidden"
                   px={8} py={2.5} borderRadius="full" border={`1px solid ${astrologiaTxt}88`}
                   cursor={guardando ? "wait" : "pointer"} opacity={guardando ? 0.7 : 1}
                   boxShadow={`0 0 16px ${astrologiaTxt}66`} _hover={{ boxShadow: `0 0 26px ${astrologiaTxt}99`, transform: "translateY(-1px)" }} transition="all 0.2s">
                <DisciplinaBgLayer nom={astrologiaNom} borderRadius="9999px" overlay="rgba(8,13,30,0.55)" />
                <Text position="relative" zIndex={1} color="#ffffff" fontWeight="700" letterSpacing="0.06em" style={{ textShadow: GLOW }}>
                  {guardando ? "Guardando…" : "Guardar"}
                </Text>
              </Box>
            </Flex>

            {/* Link del PDF de la carta (Google Drive) */}
            <Box position="relative" borderRadius="xl" border={`1px solid ${turquesa}44`} mb={5} overflow="hidden"
                 boxShadow={`0 0 16px ${turquesa}1f`}>
              <DisciplinaBgLayer nom={astrologiaNom} borderRadius="xl" overlay="rgba(8,13,30,0.82)" />
              <Box position="relative" zIndex={1} p={{ base: 4, md: 5 }}>
                <Flex align="center" gap={2} mb={2} wrap="wrap">
                  <Text color="#ffffff" fontWeight="700" fontSize="md" style={{ textShadow: GLOW }}>Link de la carta (PDF)</Text>
                  {linkCarta?.trim() ? (
                    <Text fontSize="xs" color="#7ee0c0">· subido</Text>
                  ) : (
                    <Text fontSize="xs" color="rgba(255,180,180,0.85)">· sin subir (el usuario no puede pasar de los arquetipos)</Text>
                  )}
                </Flex>
                <Input
                  value={linkCarta}
                  onChange={(e) => setLinkCarta(e.target.value)}
                  placeholder="Pega aquí el enlace de Google Drive del PDF…"
                  bg="rgba(0,0,0,0.35)" border="1px solid rgba(255,255,255,0.22)" color="white" borderRadius="lg"
                  fontFamily="'EB Garamond', serif" _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                  _focus={{ borderColor: turquesa, boxShadow: `0 0 0 1px ${turquesa}55` }}
                />
              </Box>
            </Box>

            {!carta ? (
              <Box bg="rgba(0,0,0,0.32)" borderRadius="xl" border="1px solid rgba(255,255,255,0.18)" p={7}>
                <Text color="rgba(255,200,200,0.9)" fontStyle="italic">
                  Este usuario aún no tiene carta natal calculada (no ha pedido su carta o faltan datos de nacimiento).
                </Text>
              </Box>
            ) : (
              <>
                {/* ── CASAS (desplegable) ── */}
                <Desplegable titulo="Las 12 casas" count={12} open={casasOpen} onToggle={() => setCasasOpen((o) => !o)}>
                  <Flex direction="column" gap={4}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                      const info = cusps.length ? infoCasa(cusps, n) : null;
                      return (
                        <Box key={n}>
                          <Flex align="center" gap={2} mb={1.5} wrap="wrap">
                            <Text color="#ffffff" fontWeight="700" fontSize="md" style={{ textShadow: GLOW }}>Casa {NUMEROS_ROMANOS[n - 1]}</Text>
                            {info && (
                              <>
                                <Text color="rgba(255,255,255,0.5)">·</Text>
                                <Glifo symbol={info.signo.symbol} color="#ffffff" size={18} />
                                <Text color="#ffffff" fontSize="sm" style={{ textShadow: GLOW }}>{info.signo.name}</Text>
                                {info.regente && (
                                  <Flex align="center" gap={1} ml={1}>
                                    <Text color="rgba(255,255,255,0.5)" fontSize="xs">reg.</Text>
                                    <Glifo symbol={info.regente.symbol} color={info.regente.color} size={18} />
                                  </Flex>
                                )}
                              </>
                            )}
                          </Flex>
                          <Textarea
                            value={casas[String(n)] ?? ""}
                            onChange={(e) => setCasas((p) => ({ ...p, [String(n)]: e.target.value }))}
                            placeholder={`Lectura de la casa ${NUMEROS_ROMANOS[n - 1]}…`}
                            rows={3}
                            bg="rgba(0,0,0,0.3)" border="1px solid rgba(255,255,255,0.22)" color="white" borderRadius="lg"
                            fontFamily="'EB Garamond', serif" _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                            _focus={{ borderColor: turquesa, boxShadow: `0 0 0 1px ${turquesa}55` }}
                          />
                        </Box>
                      );
                    })}
                  </Flex>
                </Desplegable>

                {/* ── ASPECTOS (desplegable) ── */}
                <Desplegable titulo="Los aspectos" count={listaAspectos.length} open={aspectosOpen} onToggle={() => setAspectosOpen((o) => !o)}>
                  <Flex direction="column" gap={4}>
                    {listaAspectos.map((a, idx) => {
                      const ca = cuerpoByKey(a.a);
                      const cb = cuerpoByKey(a.b);
                      const key = aspectoKey(a);
                      return (
                        <Box key={`${key}-${idx}`}>
                          <Flex align="center" gap={2} mb={1.5} wrap="wrap">
                            {ca && <Glifo symbol={ca.symbol} color={ca.color} size={18} />}
                            <Text color="#ffffff" fontSize="md" style={{ textShadow: GLOW }}>{ASPECTO_SYMBOL[a.tipo]}{"︎"}</Text>
                            {cb && <Glifo symbol={cb.symbol} color={cb.color} size={18} />}
                            <Text color="#ffffff" fontSize="sm" ml={1} style={{ textShadow: GLOW }}>
                              {ca?.label} {ASPECTO_LABEL[a.tipo].toLowerCase()} {cb?.label}
                            </Text>
                          </Flex>
                          <Textarea
                            value={aspectos[key] ?? ""}
                            onChange={(e) => setAspectos((p) => ({ ...p, [key]: e.target.value }))}
                            placeholder={`Lectura del aspecto ${ca?.label} ${ASPECTO_LABEL[a.tipo].toLowerCase()} ${cb?.label}…`}
                            rows={3}
                            bg="rgba(0,0,0,0.3)" border="1px solid rgba(255,255,255,0.22)" color="white" borderRadius="lg"
                            fontFamily="'EB Garamond', serif" _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                            _focus={{ borderColor: turquesa, boxShadow: `0 0 0 1px ${turquesa}55` }}
                          />
                        </Box>
                      );
                    })}
                    {listaAspectos.length === 0 && (
                      <Text color="rgba(255,255,255,0.6)" fontStyle="italic" fontSize="sm">Esta carta no tiene aspectos calculados.</Text>
                    )}
                  </Flex>
                </Desplegable>
              </>
            )}
          </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
