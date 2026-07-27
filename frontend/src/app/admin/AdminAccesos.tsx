// ─────────────────────────────────────────────────────────────────────────────
// Panel de ACCESOS — regalar «El Recorrido» a una cuenta sin cobrarle.
//
// El pago falso (modo test) está cerrado en producción, así que esta es la única
// forma de abrir disciplinas sin un cobro real de Stripe. Todo pasa por
// /user/admin/acceso, que exige el token de admin desbloqueado (email en
// ADMIN_EMAILS + contraseña).
//
// Como el recorrido va en orden, conceder una disciplina concede también todas
// las anteriores. «Quitar acceso» cierra las ocho.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Text, Image } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { ADMIN_DISCIPLINAS, disciplinaByKey } from "../../data/adminDisciplinas";
import { API_URL } from "../../GlobalVariables";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

/** scope de pago ↔ disciplina del panel, en el orden del recorrido. */
const DISCIPLINAS = [
  { scope: "metodo", adminKey: "astrologia" },
  { scope: "psicologia", adminKey: "psicologia" },
  { scope: "ayurveda", adminKey: "ayurveda" },
  { scope: "tcm", adminKey: "tcm" },
  { scope: "fisiologia", adminKey: "fisiologia" },
  { scope: "nutricion", adminKey: "nutricion" },
  { scope: "cabala", adminKey: "cabala" },
  { scope: "cultura", adminKey: "cultura" },
].map((d) => {
  const disc = disciplinaByKey(d.adminKey) ?? ADMIN_DISCIPLINAS[0];
  return { ...d, nombre: disc.nombre, txt: disc.txt, bg: disc.bg };
});

interface CuentaAdmin {
  id: string;
  name: string;
  email: string;
  img?: string | null;
  acceso_libre?: boolean;
  [flag: string]: any;
}

export default function AdminAccesos() {
  const navigate = useNavigate();
  const { verificando } = useAdminGuard();

  const [usuarios, setUsuarios] = useState<CuentaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const res = await axios.get<CuentaAdmin[]>(`${API_URL}/user/admin/todos`, {
        headers: adminHeaders(),
      });
      setUsuarios(res.data ?? []);
    } catch {
      setUsuarios([]);
      setAviso("No se pudo cargar la lista de cuentas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (verificando) return;
    cargar();
  }, [verificando, cargar]);

  // La búsqueda se hace en el cliente sobre las cuentas ya traídas (el endpoint
  // devuelve hasta 200, suficiente por ahora y así el filtro es instantáneo).
  const t = q.trim().toLowerCase();
  const filtrados = !t
    ? usuarios
    : usuarios.filter(
        (u) => (u.name ?? "").toLowerCase().includes(t) || (u.email ?? "").toLowerCase().includes(t),
      );

  const conceder = async (userId: string, hasta: string) => {
    setGuardando(userId);
    setAviso(null);
    try {
      const { data } = await axios.post<CuentaAdmin>(
        `${API_URL}/user/admin/acceso`,
        { userId, hasta },
        { headers: adminHeaders() },
      );
      setUsuarios((prev) => prev.map((u) => (u.id === userId ? { ...u, ...data } : u)));
    } catch {
      setAviso("No se pudo conceder el acceso.");
    } finally {
      setGuardando(null);
    }
  };

  const revocar = async (u: CuentaAdmin) => {
    if (!window.confirm(`¿Quitar TODAS las disciplinas a ${u.name}? Si había pagado, también las pierde.`)) return;
    setGuardando(u.id);
    setAviso(null);
    try {
      const { data } = await axios.post<CuentaAdmin>(
        `${API_URL}/user/admin/acceso/revocar`,
        { userId: u.id },
        { headers: adminHeaders() },
      );
      setUsuarios((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...data } : x)));
    } catch {
      setAviso("No se pudo quitar el acceso.");
    } finally {
      setGuardando(null);
    }
  };

  if (verificando) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="760px">
          <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.06em"
                textTransform="uppercase" textAlign="center"
                textShadow="0 0 14px rgba(255,255,255,0.55), 0 0 30px rgba(180,255,245,0.28)">
            Accesos
          </Text>
          <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                textAlign="center" mt={2} mb={{ base: 6, md: 8 }}>
            Regala el recorrido a una cuenta sin que pase por el pago.
          </Text>

          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o email…"
            mb={5}
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(255,255,255,0.28)"
            color="white"
            borderRadius="full"
            fontFamily="'EB Garamond', serif"
            _placeholder={{ color: "rgba(255,255,255,0.45)" }}
            _hover={{ borderColor: "rgba(255,255,255,0.5)" }}
            _focus={{ borderColor: "white", boxShadow: "0 0 0 1px rgba(255,255,255,0.3)" }}
          />

          {aviso && (
            <Text color="#ffd9a0" fontSize="sm" fontStyle="italic" textAlign="center" mb={4}>
              {aviso}
            </Text>
          )}

          {loading ? (
            <Flex justify="center" py={10}><SpinnerTurquesa /></Flex>
          ) : (
            <Flex direction="column" gap={2}>
              {filtrados.map((u) => {
                const desplegado = abierto === u.id;
                const ocupado = guardando === u.id;
                return (
                  <Box
                    key={u.id}
                    borderRadius="xl"
                    bg="rgba(255,255,255,0.06)"
                    border="1px solid rgba(255,255,255,0.18)"
                    overflow="hidden"
                  >
                    {/* cabecera de la cuenta */}
                    <Flex
                      as="button"
                      onClick={() => setAbierto(desplegado ? null : u.id)}
                      align="center"
                      gap={3}
                      w="100%"
                      textAlign="left"
                      px={4}
                      py={3}
                      cursor="pointer"
                      transition="background 0.18s"
                      _hover={{ bg: "rgba(255,255,255,0.09)" }}
                    >
                      <Box w="40px" h="40px" borderRadius="full" overflow="hidden" flexShrink={0}
                           border="1px solid rgba(255,255,255,0.3)" bg="rgba(255,255,255,0.08)">
                        <Image src={u.img || "/img/icono/noImg.png"} w="100%" h="100%" objectFit="cover" alt="" />
                      </Box>
                      <Box minW={0} flex="1">
                        <Text color="white" fontWeight="600" noOfLines={1}>{u.name}</Text>
                        <Text color="rgba(255,255,255,0.6)" fontSize="sm" noOfLines={1}>{u.email}</Text>
                      </Box>

                      {/* puntitos: una disciplina abierta = punto encendido */}
                      <Flex gap="3px" flexShrink={0}>
                        {DISCIPLINAS.map((d) => (
                          <Box
                            key={d.scope}
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg={u[`${d.scope}_suscrito`] ? d.txt : "rgba(255,255,255,0.18)"}
                            style={u[`${d.scope}_suscrito`] ? { boxShadow: `0 0 6px ${d.txt}` } : undefined}
                          />
                        ))}
                      </Flex>
                      <Text color="rgba(255,255,255,0.7)" fontSize="lg" ml={1}>{desplegado ? "▾" : "▸"}</Text>
                    </Flex>

                    {/* panel de concesión */}
                    {desplegado && (
                      <Box px={4} pb={4} pt={1} borderTop="1px solid rgba(255,255,255,0.12)">
                        {u.acceso_libre && (
                          <Text color="#ffe3b0" fontSize="sm" fontStyle="italic" mb={3}>
                            Esta cuenta ya tiene acceso libre por ACCESO_LIBRE_EMAILS: lo ve todo aunque
                            aquí figure cerrado.
                          </Text>
                        )}
                        <Text color="rgba(255,255,255,0.7)" fontSize="sm" mb={3}>
                          Abre hasta la disciplina que elijas (incluye las anteriores):
                        </Text>

                        <Flex wrap="wrap" gap={2} mb={4}>
                          {DISCIPLINAS.map((d) => {
                            const abiertaYa = !!u[`${d.scope}_suscrito`];
                            return (
                              <Box
                                key={d.scope}
                                as="button"
                                onClick={() => conceder(u.id, d.scope)}
                                disabled={ocupado}
                                px={3}
                                py={1.5}
                                borderRadius="full"
                                bg={abiertaYa ? d.bg : "rgba(255,255,255,0.06)"}
                                border={`1px solid ${abiertaYa ? d.txt : "rgba(255,255,255,0.28)"}`}
                                color={abiertaYa ? d.txt : "rgba(255,255,255,0.8)"}
                                fontSize="sm"
                                fontWeight="600"
                                cursor={ocupado ? "wait" : "pointer"}
                                opacity={ocupado ? 0.6 : 1}
                                transition="all 0.18s"
                                _hover={{ transform: ocupado ? "none" : "translateY(-1px)", borderColor: d.txt }}
                              >
                                {abiertaYa ? "✓ " : ""}{d.nombre}
                              </Box>
                            );
                          })}
                        </Flex>

                        <Flex gap={3} wrap="wrap">
                          <Box
                            as="button"
                            onClick={() => conceder(u.id, "all")}
                            disabled={ocupado}
                            px={5}
                            py={2}
                            borderRadius="full"
                            bg="rgba(255,255,255,0.12)"
                            border="1.5px solid rgba(255,255,255,0.5)"
                            color="white"
                            fontWeight="700"
                            fontSize="sm"
                            cursor={ocupado ? "wait" : "pointer"}
                            opacity={ocupado ? 0.6 : 1}
                            transition="all 0.2s"
                            _hover={{ bg: ocupado ? undefined : "rgba(255,255,255,0.2)" }}
                          >
                            ✦ Todo el recorrido gratis
                          </Box>
                          <Box
                            as="button"
                            onClick={() => revocar(u)}
                            disabled={ocupado}
                            px={5}
                            py={2}
                            borderRadius="full"
                            bg="transparent"
                            border="1.5px solid rgba(255,190,190,0.5)"
                            color="rgba(255,205,205,0.95)"
                            fontWeight="600"
                            fontSize="sm"
                            cursor={ocupado ? "wait" : "pointer"}
                            opacity={ocupado ? 0.6 : 1}
                            transition="all 0.2s"
                            _hover={{ bg: ocupado ? undefined : "rgba(255,190,190,0.14)" }}
                          >
                            Quitar acceso
                          </Box>
                        </Flex>
                      </Box>
                    )}
                  </Box>
                );
              })}

              {filtrados.length === 0 && (
                <Text color="rgba(255,255,255,0.6)" fontStyle="italic" textAlign="center" py={8}>
                  {usuarios.length === 0 ? "No hay cuentas todavía." : "Ninguna cuenta coincide con la búsqueda."}
                </Text>
              )}
            </Flex>
          )}

          {/* Volver — abajo a la derecha, fuera de la lista */}
          <Flex justify="flex-end" mt={{ base: 8, md: 10 }}>
            <Box as="button" onClick={() => navigate("/admin")}
                 px={6} py={2.5} borderRadius="full" bg="rgba(255,255,255,0.1)"
                 border="1.5px solid rgba(255,255,255,0.45)" color="white" fontWeight="700"
                 fontSize={{ base: "sm", md: "md" }} cursor="pointer" transition="all 0.2s"
                 _hover={{ bg: "rgba(255,255,255,0.18)", transform: "translateY(-2px)" }}>
              Volver
            </Box>
          </Flex>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
