// ─────────────────────────────────────────────────────────────────────────────
// USUARIOS (/admin/usuarios) — LA tabla del panel: todas las cuentas, paginadas.
//
// Es el centro de la administración de personas. Cada fila enseña quién es
// (nombre y email, sin foto), su edad, qué disciplinas tiene abiertas y si está
// haciendo sesiones; y desde la propia fila se hace todo lo demás:
//
//   · «Sesiones» — marcar que está en terapia conmigo. Con la marca encendida
//     sale el botón «Diario de terapias» (el diario que también lee en /diario).
//   · «Entrar como» — abrir la web con su sesión de verdad y salir cuando quiera
//     (la barra de abajo a la derecha).
//   · Desplegar la ficha (▸) — regalar o cerrar disciplinas, abrir su contenido,
//     ver sus intereses y borrar la cuenta CON TODOS sus datos.
//
// Esta página absorbió /admin/accesos (regalar y borrar viven ahora aquí); esa
// ruta quedó comentada en App.tsx con el código conservado.
//
// Los datos salen de GET /user/admin/todos, que devuelve cada cuenta con sus
// ocho `<scope>_suscrito`/`<scope>_fecha_compra`, `fecha_nacimiento` (para la
// edad), `en_sesiones` (sql/user-en-sesiones.sql) y `acceso_libre`.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { DISCIPLINAS_PAGO, disciplinaByKey } from "../../data/adminDisciplinas";
import { API_URL } from "../../GlobalVariables";
import { adminHeaders, useAdminGuard } from "./useAdminGuard";
import BotonEntrarComo from "./BotonEntrarComo";

const POR_PAGINA = 15;

interface CuentaAdmin {
  id: string;
  name: string;
  email: string;
  img?: string | null;
  acceso_libre?: boolean;
  fecha_nacimiento?: string | null;
  en_sesiones?: boolean;
  /** `<scope>_suscrito` y `<scope>_fecha_compra`. */
  [flag: string]: any;
}

/** Años cumplidos a partir de `fecha_nacimiento`, o null si no la dio. */
const edadDe = (iso?: string | null): number | null => {
  if (!iso) return null;
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!a || !m || !d) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - a;
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) edad -= 1;
  return edad >= 0 && edad < 130 ? edad : null;
};

/** «12 sept 2026», o null si no hay fecha (accesos antiguos o regalados). */
const fechaCorta = (iso?: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
};

export default function AdminTodosUsuarios() {
  const navigate = useNavigate();
  const { verificando } = useAdminGuard();

  const [usuarios, setUsuarios] = useState<CuentaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [pagina, setPagina] = useState(1);
  /** id de la fila desplegada (regalar, intereses, borrar), o null. */
  const [abierto, setAbierto] = useState<string | null>(null);
  /** id de la cuenta cuyo acceso se está guardando ahora mismo. */
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

  // Buscar cambia el corte, así que devuelve a la primera página.
  useEffect(() => setPagina(1), [q]);

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return usuarios;
    return usuarios.filter(
      (u) => (u.name ?? "").toLowerCase().includes(t) || (u.email ?? "").toLowerCase().includes(t),
    );
  }, [q, usuarios]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaReal = Math.min(pagina, totalPaginas);
  const enPantalla = filtrados.slice((paginaReal - 1) * POR_PAGINA, paginaReal * POR_PAGINA);

  // ── Sesiones conmigo ────────────────────────────────────────────────────────
  // Optimista: se pinta ya y, si el servidor dice que no (columna sin migrar,
  // red caída), se vuelve atrás y se cuenta el porqué.
  const cambiarSesiones = async (u: CuentaAdmin) => {
    const nuevo = !u.en_sesiones;
    setUsuarios((prev) => prev.map((x) => (x.id === u.id ? { ...x, en_sesiones: nuevo } : x)));
    setAviso(null);
    try {
      await axios.post(
        `${API_URL}/user/admin/sesiones`,
        { userId: u.id, enSesiones: nuevo },
        { headers: adminHeaders() },
      );
    } catch (e: any) {
      setUsuarios((prev) => prev.map((x) => (x.id === u.id ? { ...x, en_sesiones: !nuevo } : x)));
      setAviso(e?.response?.data?.message ?? "No se pudo guardar la marca de sesiones.");
    }
  };

  // ── Regalar / cerrar disciplinas (lo que antes hacía /admin/accesos) ───────
  const cambiarAcceso = async (userId: string, disciplina: string, abierta: boolean) => {
    setGuardando(userId);
    setAviso(null);
    try {
      const { data } = await axios.post<CuentaAdmin>(
        `${API_URL}/user/admin/acceso`,
        { userId, disciplina, abierta },
        { headers: adminHeaders() },
      );
      setUsuarios((prev) => prev.map((u) => (u.id === userId ? { ...u, ...data } : u)));
    } catch {
      setAviso(abierta ? "No se pudo conceder el acceso." : "No se pudo cerrar la disciplina.");
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

  // ── Borrado definitivo ──────────────────────────────────────────────────────
  // El backend además se niega a borrar tu propia cuenta o una de administración,
  // así que aquí basta con confirmar el email exacto.
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

  if (verificando) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="1080px">
          {/* ── TÍTULO ── */}
          <Flex direction="column" align="center" textAlign="center" gap={2} mb={{ base: 6, md: 8 }}>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              lineHeight="1.15"
              textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)"
            >
              Usuarios
            </Text>
            <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
              {loading
                ? "Todas las cuentas, con sus disciplinas y sus sesiones."
                : `${filtrados.length} ${filtrados.length === 1 ? "cuenta" : "cuentas"} · página ${paginaReal} de ${totalPaginas}`}
            </Text>
          </Flex>

          {/* ── BUSCADOR ── */}
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o email…"
            mb={4}
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(255,255,255,0.3)"
            color="white"
            borderRadius="full"
            fontFamily="'EB Garamond', serif"
            _placeholder={{ color: "rgba(255,255,255,0.55)" }}
            _hover={{ borderColor: "rgba(255,255,255,0.55)" }}
            _focus={{ borderColor: "white", boxShadow: "none" }}
            _focusVisible={{ boxShadow: "none" }}
          />

          {aviso && (
            <Text color="#ffd9a0" fontSize="sm" fontStyle="italic" textAlign="center" mb={4}>
              {aviso}
            </Text>
          )}

          {loading ? (
            <Flex justify="center" py={12}><LifeLoader color="#ffffff" /></Flex>
          ) : (
            <>
              {/* ── CABECERA DE LA TABLA (solo en ordenador) ── */}
              <Flex
                display={{ base: "none", md: "flex" }}
                align="center"
                gap={4}
                px={5}
                pb={2}
                color="rgba(255,255,255,0.55)"
                fontSize="xs"
                letterSpacing="0.12em"
                textTransform="uppercase"
              >
                <Text minW="230px" maxW="230px">Quién</Text>
                <Text minW="44px" textAlign="center">Edad</Text>
                <Text flex="1">Disciplinas</Text>
                <Text textAlign="right">Sesiones · acciones</Text>
              </Flex>

              {/* ── LAS FILAS ── */}
              <Flex direction="column" gap={2}>
                {enPantalla.map((u) => {
                  const desplegado = abierto === u.id;
                  const ocupado = guardando === u.id;
                  const suyas = DISCIPLINAS_PAGO.filter((d) => u[`${d.scope}_suscrito`]);
                  const edad = edadDe(u.fecha_nacimiento);
                  return (
                    <Box
                      key={u.id}
                      borderRadius="xl"
                      bg="rgba(255,255,255,0.06)"
                      border={`1px solid ${desplegado ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)"}`}
                      transition="border-color 0.18s"
                      _hover={{ borderColor: "rgba(255,255,255,0.45)" }}
                    >
                      {/* la fila */}
                      <Flex
                        align={{ base: "flex-start", md: "center" }}
                        direction={{ base: "column", md: "row" }}
                        gap={{ base: 3, md: 4 }}
                        px={{ base: 4, md: 5 }}
                        py={{ base: 4, md: 3 }}
                      >
                        {/* quién — nombre y email, sin foto */}
                        <Box minW={{ md: "230px" }} maxW={{ md: "230px" }}>
                          <Text color="white" fontWeight="600" noOfLines={1}>{u.name || "(sin nombre)"}</Text>
                          <Text color="rgba(255,255,255,0.6)" fontSize="sm" noOfLines={1}>{u.email}</Text>
                        </Box>

                        {/* edad */}
                        <Text
                          color={edad === null ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)"}
                          minW={{ md: "44px" }}
                          textAlign={{ md: "center" }}
                          fontSize="sm"
                          title={edad === null ? "No dio su fecha de nacimiento" : `Nació el ${fechaCorta(u.fecha_nacimiento)}`}
                        >
                          {edad === null ? "—" : `${edad}`}
                          <Box as="span" display={{ md: "none" }} color="rgba(255,255,255,0.45)"> años</Box>
                        </Text>

                        {/* disciplinas — un puntito encendido por disciplina abierta */}
                        <Flex flex="1" align="center" gap="4px" minW={0}>
                          {DISCIPLINAS_PAGO.map((d) => (
                            <Box
                              key={d.scope}
                              w="9px"
                              h="9px"
                              borderRadius="full"
                              flexShrink={0}
                              bg={u[`${d.scope}_suscrito`] ? d.txt : "rgba(255,255,255,0.16)"}
                              title={`${d.nombre}: ${u[`${d.scope}_suscrito`] ? "abierta" : "cerrada"}`}
                              style={u[`${d.scope}_suscrito`] ? { boxShadow: `0 0 6px ${d.txt}` } : undefined}
                            />
                          ))}
                          <Text color="rgba(255,255,255,0.55)" fontSize="xs" ml={1.5} whiteSpace="nowrap">
                            {suyas.length}/{DISCIPLINAS_PAGO.length}
                          </Text>
                        </Flex>

                        {/* sesiones + acciones */}
                        <Flex align="center" gap={2.5} flexShrink={0} flexWrap="wrap"
                              alignSelf={{ base: "flex-end", md: "center" }}>
                          {/* la marca de «está haciendo sesiones conmigo» */}
                          <Flex
                            as="button"
                            onClick={() => cambiarSesiones(u)}
                            align="center"
                            gap={1.5}
                            px={3}
                            py="4px"
                            borderRadius="full"
                            bg={u.en_sesiones ? "rgba(180,255,245,0.14)" : "rgba(255,255,255,0.06)"}
                            border={`1px solid ${u.en_sesiones ? "rgba(180,255,245,0.8)" : "rgba(255,255,255,0.3)"}`}
                            cursor="pointer"
                            transition="all 0.18s"
                            title={u.en_sesiones ? "Está haciendo sesiones contigo (tocar para apagar)" : "Marcar que está haciendo sesiones contigo"}
                            _hover={{ borderColor: u.en_sesiones ? "#b4fff5" : "rgba(255,255,255,0.6)" }}
                          >
                            <Box
                              w="8px"
                              h="8px"
                              borderRadius="full"
                              bg={u.en_sesiones ? "#b4fff5" : "rgba(255,255,255,0.25)"}
                              style={u.en_sesiones ? { boxShadow: "0 0 6px #b4fff5" } : undefined}
                            />
                            <Text color={u.en_sesiones ? "#d9fffa" : "rgba(255,255,255,0.7)"} fontSize="xs" fontWeight="600">
                              Sesiones
                            </Text>
                          </Flex>

                          {/* el diario solo sale para quien está en sesiones */}
                          {u.en_sesiones && (
                            <Box
                              as="button"
                              onClick={() => navigate(`/admin/diario/${u.id}`)}
                              px={3}
                              py="4px"
                              borderRadius="full"
                              bg="rgba(255,255,255,0.1)"
                              border="1px solid rgba(255,255,255,0.4)"
                              color="white"
                              fontSize="xs"
                              fontWeight="600"
                              whiteSpace="nowrap"
                              cursor="pointer"
                              transition="all 0.15s"
                              _hover={{ bg: "rgba(255,255,255,0.2)", borderColor: "white", transform: "translateY(-1px)" }}
                              title={`Diario de terapias de ${u.name}`}
                            >
                              Diario de terapias
                            </Box>
                          )}

                          {/* Ver la web como esa persona: su sesión de verdad, con
                              la barra de abajo a la derecha para volver. */}
                          <BotonEntrarComo usuario={u} />

                          {/* desplegar la ficha: regalar, contenido, intereses, borrar */}
                          <Box
                            as="button"
                            onClick={() => setAbierto(desplegado ? null : u.id)}
                            w="28px"
                            h="28px"
                            borderRadius="full"
                            bg="rgba(255,255,255,0.08)"
                            border="1px solid rgba(255,255,255,0.35)"
                            color="rgba(255,255,255,0.85)"
                            fontSize="sm"
                            cursor="pointer"
                            transition="all 0.15s"
                            title={desplegado ? "Cerrar la ficha" : "Abrir la ficha (regalar, contenido, borrar)"}
                            _hover={{ bg: "rgba(255,255,255,0.16)", borderColor: "white" }}
                          >
                            {desplegado ? "▾" : "▸"}
                          </Box>
                        </Flex>
                      </Flex>

                      {/* ── LA FICHA DESPLEGADA ── */}
                      {desplegado && (
                        <Box px={{ base: 4, md: 5 }} pb={4} pt={3} borderTop="1px solid rgba(255,255,255,0.12)">
                          {u.acceso_libre && (
                            <Text color="#ffe3b0" fontSize="sm" fontStyle="italic" mb={3}>
                              Esta cuenta tiene acceso libre por ACCESO_LIBRE_EMAILS: lo ve todo aunque
                              aquí figure cerrado.
                            </Text>
                          )}

                          {/* regalar / cerrar — lo que antes vivía en /admin/accesos */}
                          <Text color="rgba(255,255,255,0.7)" fontSize="sm" mb={2}>
                            Toca una disciplina para regalársela; tócala otra vez para cerrarla. Van
                            sueltas: abrir una no abre las anteriores.
                          </Text>
                          <Flex wrap="wrap" gap={2} mb={3}>
                            {DISCIPLINAS_PAGO.map((d) => {
                              const abiertaYa = !!u[`${d.scope}_suscrito`];
                              const fecha = fechaCorta(u[`${d.scope}_fecha_compra`]);
                              return (
                                <Box
                                  key={d.scope}
                                  as="button"
                                  onClick={() => cambiarAcceso(u.id, d.scope, !abiertaYa)}
                                  title={abiertaYa ? `Cerrar ${d.nombre}${fecha ? ` (abierta el ${fecha})` : ""}` : `Regalar ${d.nombre}`}
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

                          <Flex gap={3} wrap="wrap" mb={4}>
                            <BotonFicha ocupado={ocupado} onClick={() => cambiarAcceso(u.id, "all", true)} principal>
                              Todo el recorrido gratis
                            </BotonFicha>
                            <BotonFicha ocupado={ocupado} onClick={() => revocar(u)} peligro>
                              Quitar acceso
                            </BotonFicha>
                          </Flex>

                          {/* su contenido y sus intereses */}
                          <Flex gap={2} wrap="wrap" align="center" mb={1}>
                            <Text color="rgba(255,255,255,0.6)" fontSize="xs" letterSpacing="0.1em" textTransform="uppercase" mr={1}>
                              Su información
                            </Text>
                            {suyas.map((d) => {
                              const admin = disciplinaByKey(d.adminKey);
                              if (!admin) return null;
                              return (
                                <Box
                                  key={d.scope}
                                  as="button"
                                  onClick={() => navigate(`/admin/${d.adminKey}/${u.id}`)}
                                  px={3}
                                  py="3px"
                                  borderRadius="full"
                                  bg="rgba(255,255,255,0.06)"
                                  border={`1px solid ${d.txt}88`}
                                  color={d.txt}
                                  fontSize="xs"
                                  fontWeight="600"
                                  cursor="pointer"
                                  transition="all 0.15s"
                                  title={`Abrir ${d.nombre} de ${u.name}`}
                                  _hover={{ borderColor: d.txt, transform: "translateY(-1px)" }}
                                >
                                  {d.nombre}
                                </Box>
                              );
                            })}
                            <Box
                              as="button"
                              onClick={() => navigate(`/admin/actividad/${u.id}`, { state: { name: u.name, email: u.email } })}
                              px={3}
                              py="3px"
                              borderRadius="full"
                              bg="rgba(255,255,255,0.06)"
                              border="1px solid rgba(255,255,255,0.4)"
                              color="white"
                              fontSize="xs"
                              fontWeight="600"
                              cursor="pointer"
                              transition="all 0.15s"
                              title={`Qué recursos gratuitos ha abierto ${u.name}`}
                              _hover={{ borderColor: "white", transform: "translateY(-1px)" }}
                            >
                              Intereses
                            </Box>
                          </Flex>

                          {/* Borrar la cuenta: separado del resto, porque no es
                              «cerrarle el recorrido», es que desaparece. */}
                          <Box mt={4} pt={3} borderTop="1px solid rgba(255,255,255,0.12)">
                            <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                              <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontStyle="italic" flex="1" minW="200px">
                                Borrar la cuenta se lleva también su recorrido, sus notas, su diario y
                                sus reservas. No se puede deshacer.
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

                {enPantalla.length === 0 && (
                  <Text color="rgba(255,255,255,0.6)" fontStyle="italic" textAlign="center" py={8}>
                    {usuarios.length === 0 ? "No hay cuentas todavía." : "Ninguna cuenta coincide con la búsqueda."}
                  </Text>
                )}
              </Flex>

              {/* ── PAGINACIÓN ── */}
              {totalPaginas > 1 && (
                <Flex justify="center" align="center" gap={4} mt={{ base: 6, md: 8 }}>
                  <BotonPagina
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={paginaReal <= 1}
                  >
                    ← Anterior
                  </BotonPagina>
                  <Text color="rgba(255,255,255,0.75)" fontSize="sm" whiteSpace="nowrap">
                    Página {paginaReal} de {totalPaginas}
                  </Text>
                  <BotonPagina
                    onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                    disabled={paginaReal >= totalPaginas}
                  >
                    Siguiente →
                  </BotonPagina>
                </Flex>
              )}
            </>
          )}
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
            <Image src="/img/icono/life.webp" alt="" h="34px" mx="auto" mb={4} objectFit="contain"
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
              Se borra la cuenta y todo lo suyo: recorrido, notas, diario, respuestas, reservas de
              llamada y su foto. No se puede deshacer y no avisa a la persona.
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

// ── Piezas sueltas de la tabla ───────────────────────────────────────────────

const BotonFicha = ({
  onClick,
  ocupado,
  principal,
  peligro,
  children,
}: {
  onClick: () => void;
  ocupado: boolean;
  principal?: boolean;
  peligro?: boolean;
  children: React.ReactNode;
}) => (
  <Box
    as="button"
    onClick={onClick}
    disabled={ocupado}
    px={5}
    py={2}
    borderRadius="full"
    bg={principal ? "rgba(255,255,255,0.12)" : "transparent"}
    border={`1.5px solid ${peligro ? "rgba(255,190,190,0.5)" : "rgba(255,255,255,0.5)"}`}
    color={peligro ? "rgba(255,205,205,0.95)" : "white"}
    fontWeight={principal ? "700" : "600"}
    fontSize="sm"
    cursor={ocupado ? "wait" : "pointer"}
    opacity={ocupado ? 0.6 : 1}
    transition="all 0.2s"
    _hover={{ bg: ocupado ? undefined : peligro ? "rgba(255,190,190,0.14)" : "rgba(255,255,255,0.2)" }}
  >
    {children}
  </Box>
);

const BotonPagina = ({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) => (
  <Box
    as="button"
    onClick={onClick}
    disabled={disabled}
    px={5}
    py={2}
    borderRadius="full"
    bg="rgba(255,255,255,0.08)"
    border="1px solid rgba(255,255,255,0.4)"
    color="white"
    fontWeight="600"
    fontSize="sm"
    whiteSpace="nowrap"
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.4 : 1}
    transition="all 0.18s"
    _hover={disabled ? undefined : { bg: "rgba(255,255,255,0.18)", borderColor: "white" }}
  >
    {children}
  </Box>
);
