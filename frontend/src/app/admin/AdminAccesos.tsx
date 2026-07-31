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
//
// Aquí también se BORRAN cuentas (DELETE /user/admin/usuario/:id). Eso se lleva
// la cuenta y todos sus datos —recorrido, notas, reservas, foto— y no tiene
// vuelta: por eso hay que escribir el email exacto para confirmar. Si solo
// quieres cerrarle las disciplinas, usa «Quitar acceso», no esto.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Flex, Input, Text, Image,
  Modal, ModalOverlay, ModalContent, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { LifeLoader } from "../../components/metodo/comicLoaders";
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
  // Borrado de cuenta: la cuenta señalada y el email tecleado para confirmar.
  const [aBorrar, setABorrar] = useState<CuentaAdmin | null>(null);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [borrando, setBorrando] = useState(false);

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

  // Borrado definitivo. El backend además se niega a borrar tu propia cuenta o
  // una de administración, así que aquí basta con confirmar el email.
  const borrarCuenta = async (u: CuentaAdmin) => {
    setBorrando(true);
    setAviso(null);
    try {
      await axios.delete(`${API_URL}/user/admin/usuario/${u.id}`, { headers: adminHeaders() });
      setUsuarios((prev) => prev.filter((x) => x.id !== u.id));
      if (abierto === u.id) setAbierto(null);
      setABorrar(null);
      setConfirmEmail("");
      setAviso(`Cuenta de ${u.email} borrada con todos sus datos.`);
    } catch (e: any) {
      setAviso(e?.response?.data?.message ?? "No se pudo borrar la cuenta.");
    } finally {
      setBorrando(false);
    }
  };

  const cerrarBorrado = () => {
    if (borrando) return;
    setABorrar(null);
    setConfirmEmail("");
  };

  // La confirmación es el email exacto: así no se borra la fila de al lado.
  const confirmado =
    !!aBorrar && confirmEmail.trim().toLowerCase() === (aBorrar.email ?? "").trim().toLowerCase();

  if (verificando) {
    return <LifeLoading variant="private" />;
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
            <Flex justify="center" py={10}><LifeLoader color="#ffffff" /></Flex>
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

                        {/* Borrar la cuenta: separado del resto, porque no es
                            «cerrarle el recorrido», es que desaparece. */}
                        <Box mt={4} pt={3} borderTop="1px solid rgba(255,255,255,0.12)">
                          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                            <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontStyle="italic" flex="1" minW="200px">
                              Borrar la cuenta se lleva también su recorrido, sus notas y sus reservas.
                              No se puede deshacer.
                            </Text>
                            <Box
                              as="button"
                              onClick={() => { setABorrar(u); setConfirmEmail(""); }}
                              disabled={ocupado}
                              px={4}
                              py={1.5}
                              borderRadius="full"
                              bg="transparent"
                              border="1px solid rgba(255,150,150,0.55)"
                              color="#ffc4c4"
                              fontWeight="600"
                              fontSize="sm"
                              cursor={ocupado ? "wait" : "pointer"}
                              opacity={ocupado ? 0.6 : 1}
                              transition="all 0.2s"
                              _hover={{ bg: ocupado ? undefined : "rgba(224,90,90,0.22)", borderColor: "#ffb0b0" }}
                            >
                              Borrar cuenta
                            </Box>
                          </Flex>
                        </Box>
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

      {/* ── Confirmar borrado: hay que teclear el email exacto ── */}
      <Modal isOpen={!!aBorrar} onClose={cerrarBorrado} isCentered size="md">
        <ModalOverlay bg="rgba(0,0,0,0.8)" sx={{ backdropFilter: "blur(8px)" }} />
        <ModalContent
          bg="#008080"
          color="white"
          fontFamily="'EB Garamond', serif"
          border="1px solid rgba(255,255,255,0.22)"
          borderRadius="2xl"
          boxShadow="0 0 42px rgba(255,140,140,0.18), 0 0 100px rgba(255,255,255,0.08), 0 22px 60px rgba(0,0,0,0.6)"
          mx={4}
          overflow="hidden"
        >
          <ModalCloseButton color="white" />
          <Box p={{ base: 6, md: 8 }} textAlign="center">
            <Image src="/img/icono/life.png" alt="" h="34px" mx="auto" mb={4} objectFit="contain"
                   style={{ filter: "drop-shadow(0 0 7px rgba(255,255,255,0.5)) drop-shadow(0 0 16px rgba(180,255,245,0.3))" }} />
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.06em" mb={2}
                  textShadow="0 0 12px rgba(255,255,255,0.45)">
              ¿Borrar esta cuenta?
            </Text>
            <Text fontSize="md" opacity={0.9} mb={1}>
              {aBorrar?.name || "(sin nombre)"}
            </Text>
            <Text fontSize="sm" opacity={0.7} mb={4}>
              {aBorrar?.email}
            </Text>
            <Text fontSize="sm" opacity={0.75} mb={4} fontStyle="italic">
              Se borra la cuenta y todo lo suyo: recorrido, notas, respuestas, reservas de llamada
              y su foto. No se puede deshacer y no avisa a la persona.
            </Text>
            <Text fontSize="xs" opacity={0.6} mb={2}>
              Escribe su email para confirmar:
            </Text>
            <Input
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={aBorrar?.email ?? ""}
              autoFocus
              mb={5}
              textAlign="center"
              bg="rgba(255,255,255,0.08)"
              border="1px solid rgba(255,255,255,0.28)"
              color="white"
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              _placeholder={{ color: "rgba(255,255,255,0.35)" }}
              _focus={{ borderColor: "white", boxShadow: "0 0 0 1px rgba(255,255,255,0.3)" }}
            />
            <Flex justify="center" gap={3}>
              <Box as="button" onClick={cerrarBorrado} px={6} py="9px" borderRadius="full"
                   border="1px solid rgba(255,255,255,0.45)" color="white" fontWeight="600" fontSize="sm"
                   cursor="pointer" transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.1)" }}>
                Cancelar
              </Box>
              <Box
                as="button"
                onClick={() => confirmado && aBorrar && borrarCuenta(aBorrar)}
                disabled={!confirmado || borrando}
                px={6}
                py="9px"
                borderRadius="full"
                bg={confirmado ? "#e05a5a" : "rgba(255,255,255,0.08)"}
                border={confirmado ? "1px solid #e05a5a" : "1px solid rgba(255,255,255,0.2)"}
                color={confirmado ? "white" : "rgba(255,255,255,0.4)"}
                fontWeight="700"
                fontSize="sm"
                cursor={!confirmado || borrando ? "not-allowed" : "pointer"}
                boxShadow={confirmado ? "0 0 16px rgba(224,90,90,0.55)" : undefined}
                transition="all 0.2s"
                _hover={confirmado && !borrando ? { bg: "#d44b4b", boxShadow: "0 0 24px rgba(224,90,90,0.8)" } : undefined}
              >
                {borrando ? "Borrando…" : "Borrar cuenta"}
              </Box>
            </Flex>
          </Box>
        </ModalContent>
      </Modal>

      <SiteFooter />
    </Box>
  );
}
