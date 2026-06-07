import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea, Spinner } from "@chakra-ui/react";
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
import { API_URL, turquesa } from "../../GlobalVariables";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

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
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (verificando || !userId) return;
    (async () => {
      try {
        const [userRes, cartaRes, rowRes] = await Promise.all([
          axios.get(`${API_URL}/user/${userId}`, { headers: adminHeaders() }),
          axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, { headers: adminHeaders() }),
          axios.get<{ casas_texto?: Record<string, string>; aspectos_texto?: Record<string, string> } | null>(
            `${API_URL}/metodo-astrologia/${userId}`, { headers: adminHeaders() },
          ),
        ]);
        setNombre(userRes.data?.name ?? "");
        setEmail(userRes.data?.email ?? "");
        setCarta(cartaRes.data ?? null);
        setCasas((rowRes.data?.casas_texto ?? {}) as Record<string, string>);
        setAspectos((rowRes.data?.aspectos_texto ?? {}) as Record<string, string>);
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
        { casas_texto: casas, aspectos_texto: aspectos },
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
          <Text as="button" onClick={() => navigate("/admin/astrologia")} color="rgba(255,255,255,0.7)" fontSize="sm" mb={3}
                _hover={{ color: "white" }}>← Usuarios de astrología</Text>

          {/* cabecera usuario + guardar */}
          <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
            <Box>
              <Text color="white" fontSize="2xl" fontWeight="700">{nombre || "Usuario"}</Text>
              <Text color="rgba(255,255,255,0.6)" fontSize="sm">{email}</Text>
            </Box>
            <Flex align="center" gap={3}>
              {guardado && (
                <Flex align="center" gap={1.5} color={turquesa} fontSize="sm" fontStyle="italic" style={{ textShadow: `0 0 10px ${turquesa}88` }}>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill={turquesa}>
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                  Guardado
                </Flex>
              )}
              <Box as="button" onClick={guardando ? undefined : guardar}
                   px={6} py={2.5} borderRadius="full" bg={turquesa} color="#04221f" fontWeight="700" letterSpacing="0.06em"
                   cursor={guardando ? "wait" : "pointer"} opacity={guardando ? 0.7 : 1}
                   boxShadow={`0 0 16px ${turquesa}66`} _hover={{ boxShadow: `0 0 24px ${turquesa}99` }} transition="all 0.2s">
                {guardando ? "Guardando…" : "Guardar"}
              </Box>
            </Flex>
          </Flex>

          {!carta ? (
            <Box bg="rgba(0,0,0,0.18)" borderRadius="xl" border="1px solid rgba(255,255,255,0.18)" p={7}>
              <Text color="rgba(255,200,200,0.9)" fontStyle="italic">
                Este usuario aún no tiene carta natal calculada (no ha pedido su carta o faltan datos de nacimiento).
              </Text>
            </Box>
          ) : (
            <Box bg="rgba(0,0,0,0.18)" borderRadius="xl" border="1px solid rgba(255,255,255,0.18)" p={{ base: 4, md: 7 }}>
              {/* CASAS */}
              <Text color="white" fontSize="lg" fontWeight="700" mb={3} letterSpacing="0.04em">Las 12 casas</Text>
              <Flex direction="column" gap={4} mb={8}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                  const info = cusps.length ? infoCasa(cusps, n) : null;
                  return (
                    <Box key={n}>
                      <Flex align="center" gap={2} mb={1.5}>
                        <Text color={turquesa} fontWeight="700" fontSize="md">Casa {NUMEROS_ROMANOS[n - 1]}</Text>
                        {info && (
                          <>
                            <Text color="rgba(255,255,255,0.85)" fontSize="sm">· {info.signo.symbol} {info.signo.name}</Text>
                            {info.regente && (
                              <Flex align="center" gap={1}>
                                <Text color="rgba(255,255,255,0.5)" fontSize="xs">reg.</Text>
                                <Glifo symbol={info.regente.symbol} color={info.regente.color} size={20} />
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

              {/* ASPECTOS */}
              <Text color="white" fontSize="lg" fontWeight="700" mb={3} letterSpacing="0.04em">
                Aspectos ({listaAspectos.length})
              </Text>
              <Flex direction="column" gap={4}>
                {listaAspectos.map((a, idx) => {
                  const ca = cuerpoByKey(a.a);
                  const cb = cuerpoByKey(a.b);
                  const key = aspectoKey(a);
                  return (
                    <Box key={`${key}-${idx}`}>
                      <Flex align="center" gap={2} mb={1.5}>
                        {ca && <Glifo symbol={ca.symbol} color={ca.color} size={20} />}
                        <Text color="rgba(255,255,255,0.85)" fontSize="md">{ASPECTO_SYMBOL[a.tipo]}</Text>
                        {cb && <Glifo symbol={cb.symbol} color={cb.color} size={20} />}
                        <Text color="rgba(255,255,255,0.7)" fontSize="sm" ml={1}>
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
            </Box>
          )}
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
