// Los DATOS de una persona asesorada (/admin/asesorias/:userId/datos): los
// personales y generales, con los de nacimiento de la carta astral, el estado de
// su cuenta y, al final, eliminarla. María los escribe y los edita aquí; la
// persona los ve en «Mi cuenta» pero no puede modificarlos.
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Grid, Image, Input, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { Reveal } from "../../components/global/Reveal";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";
import { dmaAIso, fechaDMA, mascaraDMA } from "../../utils/fechas";
import { ADMIN_DISCIPLINAS } from "../../data/adminDisciplinas";
import { IconoDiarioTerapia } from "../../components/global/IconoDiarioTerapia";
import { adminHeaders, useAdminGuard } from "./useAdminGuard";
import AccesoPersona from "./AccesoPersona";
import { BotonPildora } from "./PildorasAdmin";

interface Persona {
  id: string;
  name: string;
  email: string;
  telefono?: string | null;
  fecha_nacimiento?: string | null;
  created_at?: string | null;
  /** false = aún no ha elegido contraseña (cuenta sin activar). */
  email_confirmado?: boolean;
  acceso_libre?: boolean;
  /** `<disciplina>_suscrito` y `<disciplina>_fecha_compra`: qué tiene abierto. */
  [flag: string]: any;
}

/** Lo que guarda la carta astral de la persona (puede no haberla empezado). */
interface NacimientoCarta {
  fecha_nacimiento?: string | null;
  hora_nacimiento?: string | null;
  lugar?: string | null;
  region?: string | null;
  pais?: string | null;
}

/** Teléfono con prefijo de país: «+34 600 11 22 33» (el + y entre 6 y 15 cifras). */
const telefonoConPrefijo = (t: string) => /^\+\d{6,15}$/.test(t.replace(/[\s().-]/g, ""));

// ── Cómo se ve: dos materiales, como en el resto de la web ─────────────────────
//   · el MÁRMOL crema (con sus vetas doradas) para los datos y la activación, con
//     la letra en turquesa oscuro, igual que los correos;
//   · el CIELO estrellado de Astrología para la carta astral;
//   · el vidrio turquesa de siempre para eliminar, que es lo serio y va callado.
// Las fotos van a resolución completa, sin velo ni desenfoque.
const TINTA = "#004f4f";
const MARMOL = "url('/img/fondos/marmolfondo-crema.webp')";
const CIELO = "url('/img/astrologia/space.webp')";

const CAJA_BASE = {
  position: "relative",
  px: { base: 5, md: 9 },
  py: { base: 6, md: 8 },
  borderRadius: "28px",
  overflow: "hidden",
} as const;

const CAJA_MARMOL = {
  ...CAJA_BASE,
  bgColor: "#efe5cf",
  bgImage: MARMOL,
  bgSize: "cover",
  bgPosition: "center",
  color: TINTA,
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow: "0 0 30px rgba(255,255,255,0.28), 0 0 70px rgba(180,255,245,0.14)",
} as const;

const CAJA_CIELO = {
  ...CAJA_BASE,
  bgColor: "#050a1c",
  bgImage: CIELO,
  bgSize: "cover",
  bgPosition: "center",
  color: "white",
  border: `1px solid ${astrologiaTxt}77`,
  boxShadow: `0 0 30px ${astrologiaTxt}55, 0 0 70px ${astrologiaTxt}22`,
} as const;

const CAJA_VIDRIO = {
  ...CAJA_BASE,
  bg: "rgba(255,255,255,0.07)",
  color: "white",
  border: "1px solid rgba(255,200,200,0.5)",
  boxShadow: "0 0 24px rgba(255,255,255,0.12)",
} as const;

/** Un campo que se escribe, sobre el mármol. */
const ESTILO_CAMPO = {
  h: "50px",
  fontSize: "lg",
  bg: "rgba(255,255,255,0.62)",
  border: "1px solid rgba(0,79,79,0.4)",
  color: TINTA,
  borderRadius: "full",
  px: 5,
  fontFamily: "'EB Garamond', serif",
  _placeholder: { color: "rgba(0,79,79,0.45)" },
  _hover: { borderColor: "rgba(0,79,79,0.7)" },
  _focus: { borderColor: TINTA, bg: "rgba(255,255,255,0.85)", boxShadow: "0 0 0 2px rgba(0,79,79,0.35)", outline: "none" },
  _focusVisible: { borderColor: TINTA, bg: "rgba(255,255,255,0.85)", boxShadow: "0 0 0 2px rgba(0,79,79,0.35)", outline: "none" },
} as const;

/** El campo de confirmar el borrado, sobre el vidrio. */
const ESTILO_CAMPO_VIDRIO = {
  h: "50px",
  fontSize: "md",
  bg: "rgba(255,255,255,0.09)",
  border: "1px solid rgba(255,200,200,0.6)",
  color: "white",
  borderRadius: "full",
  px: 5,
  fontFamily: "'EB Garamond', serif",
  _focus: { borderColor: "white", boxShadow: "0 0 0 2px rgba(255,255,255,0.55)", outline: "none" },
  _focusVisible: { borderColor: "white", boxShadow: "0 0 0 2px rgba(255,255,255,0.55)", outline: "none" },
} as const;

/** Botón en píldora para las cajas de mármol: turquesa oscuro, o solo el contorno. */
function PildoraMarmol({ children, onClick, contorno, off, titulo }: {
  children: React.ReactNode;
  onClick: () => void;
  contorno?: boolean;
  off?: boolean;
  titulo?: string;
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={off ? undefined : onClick}
      title={titulo}
      px={7}
      py="10px"
      borderRadius="full"
      border={`1.5px solid ${TINTA}`}
      bg={contorno ? "rgba(255,255,255,0.45)" : TINTA}
      color={contorno ? TINTA : "white"}
      fontWeight="700"
      fontSize="md"
      letterSpacing="0.05em"
      cursor={off ? "not-allowed" : "pointer"}
      opacity={off ? 0.5 : 1}
      transition="all 0.2s ease"
      _hover={off ? undefined : { transform: "translateY(-1px)", boxShadow: `0 0 18px ${TINTA}55` }}
      _focusVisible={{ outline: `2px solid ${TINTA}`, outlineOffset: "2px" }}
    >
      {children}
    </Box>
  );
}

export default function AdminDatosUsuario() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { verificando } = useAdminGuard();

  const [persona, setPersona] = useState<Persona | null>(null);
  const [carta, setCarta] = useState<NacimientoCarta | null>(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [enlace, setEnlace] = useState<string | null>(null);
  // Los campos editables (la fecha se escribe día/mes/año).
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [guardando, setGuardando] = useState(false);
  // Eliminar: primero se abre el bloque, luego hay que teclear el email de la cuenta.
  const [eliminando, setEliminando] = useState(false);
  const [emailConfirma, setEmailConfirma] = useState("");

  const cargar = useCallback(async () => {
    try {
      const [todos, cartaRes] = await Promise.all([
        axios.get<Persona[]>(`${API_URL}/user/admin/todos`, { headers: adminHeaders() }),
        axios.get<NacimientoCarta | null>(`${API_URL}/metodo-astrologia/${userId}`, { headers: adminHeaders() })
          .catch(() => ({ data: null })),
      ]);
      const p = (todos.data ?? []).find((u) => u.id === userId) ?? null;
      setPersona(p);
      setCarta(cartaRes.data ?? null);
      setNombre(p?.name ?? "");
      setTelefono(p?.telefono ?? "");
      setNacimiento(fechaDMA(p?.fecha_nacimiento) ?? "");
    } catch {
      setPersona(null);
      setAviso("No se pudo cargar la cuenta.");
    } finally {
      setCargando(false);
    }
  }, [userId]);

  useEffect(() => {
    if (verificando) return;
    cargar();
  }, [verificando, cargar]);

  const sinCambios = !!persona
    && nombre.trim() === persona.name
    && telefono.trim() === (persona.telefono ?? "")
    && nacimiento.trim() === (fechaDMA(persona.fecha_nacimiento) ?? "");

  const guardar = async () => {
    if (!persona || guardando || sinCambios) return;
    if (!nombre.trim()) { setAviso("El nombre no puede quedar vacío."); return; }
    if (!telefono.trim() || !telefonoConPrefijo(telefono)) {
      setAviso("El teléfono es obligatorio y tiene que llevar el prefijo del país, por ejemplo +34 600 11 22 33.");
      return;
    }
    const iso = nacimiento.trim() ? dmaAIso(nacimiento) : null;
    if (nacimiento.trim() && iso === null) {
      setAviso("La fecha de nacimiento tiene que ser día/mes/año, por ejemplo 17/05/1990.");
      return;
    }
    setGuardando(true);
    setAviso(null);
    try {
      await axios.patch(
        `${API_URL}/user/${persona.id}`,
        { name: nombre.trim(), telefono: telefono.trim(), fecha_nacimiento: iso },
        { headers: adminHeaders() },
      );
      await cargar();
      setAviso("Guardado.");
    } catch (e: any) {
      setAviso(e?.response?.data?.message ?? "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const reenviar = async () => {
    if (!persona) return;
    setOcupado(true);
    setAviso(null);
    try {
      const { data } = await axios.post<{ correoEnviado: boolean }>(
        `${API_URL}/user/admin/reenviar-invitacion`,
        { userId: persona.id },
        { headers: adminHeaders() },
      );
      setAviso(data.correoEnviado
        ? `Correo de activación reenviado a ${persona.email}.`
        : `El correo a ${persona.email} NO ha salido. Inténtalo de nuevo en un rato.`);
    } catch (e: any) {
      setAviso(e?.response?.data?.message ?? "No se pudo reenviar el correo.");
    } finally {
      setOcupado(false);
    }
  };

  // El enlace del correo, para pasárselo por otra vía si el correo no le llega.
  const copiarEnlace = async () => {
    if (!persona) return;
    setOcupado(true);
    setAviso(null);
    try {
      const { data } = await axios.get<{ enlace: string }>(
        `${API_URL}/user/admin/usuario/${persona.id}/activacion`,
        { headers: adminHeaders() },
      );
      setEnlace(data.enlace);
      try {
        await navigator.clipboard.writeText(data.enlace);
        setAviso("Enlace copiado. Vale 14 días y sirve una sola vez.");
      } catch {
        setAviso("No he podido copiarlo solo: cópialo del cuadro de abajo.");
      }
    } catch (e: any) {
      setAviso(e?.response?.data?.message ?? "No se pudo generar el enlace.");
    } finally {
      setOcupado(false);
    }
  };

  const emailCoincide = !!persona && emailConfirma.trim().toLowerCase() === persona.email.trim().toLowerCase();

  // Borra la cuenta entera y todo lo suyo (no tiene vuelta atrás).
  const eliminar = async () => {
    if (!persona || !emailCoincide) return;
    setOcupado(true);
    setAviso(null);
    try {
      await axios.delete(`${API_URL}/user/admin/usuario/${persona.id}`, { headers: adminHeaders() });
      navigate("/admin/asesorias", { state: { aviso: `Cuenta de ${persona.name} eliminada con todos sus datos.` } });
    } catch (e: any) {
      setAviso(e?.response?.data?.message ?? "No se pudo eliminar la cuenta.");
      setOcupado(false);
    }
  };

  if (verificando || cargando) {
    return <LifeLoading variant="private" />;
  }

  if (!persona) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="private" />
        <Flex flex="1" direction="column" align="center" justify="center" gap={5} px={5}>
          <Text color="white" fontSize="xl" fontStyle="italic">{aviso ?? "Esa cuenta no existe (¿ya la has eliminado?)."}</Text>
          <BotonPildora onClick={() => navigate("/admin/asesorias")}>Volver a Asesorías</BotonPildora>
        </Flex>
        <SiteFooter />
      </Box>
    );
  }

  const pendiente = persona.email_confirmado === false;
  const activada = persona.email_confirmado === true;

  /** Etiqueta pequeña de un campo (sobre el mármol). */
  const etiqueta = (texto: string, para?: string) => {
    const estilo = { display: "block", fontSize: "xs", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: "700", color: TINTA, opacity: 0.8, mb: 2, ml: 2 } as const;
    return para
      ? <Text as="label" htmlFor={para} {...estilo}>{texto}</Text>
      : <Text {...estilo}>{texto}</Text>;
  };

  const campo = (id: string, texto: string, valor: string, cambiar: (v: string) => void, ayuda?: string, extra?: object) => (
    <Box>
      {etiqueta(texto, id)}
      <Input id={id} value={valor} onChange={(e) => { cambiar(e.target.value); setAviso(null); }}
             placeholder={ayuda} autoComplete="off" {...ESTILO_CAMPO} {...extra} />
    </Box>
  );

  /** Un dato que solo se mira, sobre el mármol. */
  const dato = (texto: string, valor?: string | null) => (
    <Box>
      {etiqueta(texto)}
      <Flex align="center" minH="50px" px={5} borderRadius="full" bg="rgba(255,255,255,0.4)" border="1px solid rgba(0,79,79,0.22)">
        <Text fontSize="lg" fontWeight="600" noOfLines={1} wordBreak="break-all">{valor || "—"}</Text>
      </Flex>
    </Box>
  );

  const tituloMarmol = (texto: string) => (
    <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.12em" textTransform="uppercase" color={TINTA}>
      {texto}
    </Text>
  );

  const lugarCarta = [carta?.lugar, carta?.region, carta?.pais].filter(Boolean).join(", ");

  /** Un dato de la carta astral, sobre el cielo. */
  const datoCielo = (texto: string, valor?: string | null) => (
    <Box textAlign="center" flex="1" minW={0}>
      <Text fontSize="xs" letterSpacing="0.22em" textTransform="uppercase" fontWeight="700" color={astrologiaTxt}
            style={{ textShadow: sombraTexto(astrologiaNom, astrologiaBg) }}>
        {texto}
      </Text>
      <Text mt={2} fontSize={{ base: "xl", md: "2xl" }} fontWeight="600" lineHeight="1.25" color={valor ? "white" : "rgba(255,255,255,0.4)"}
            style={{ textShadow: "0 0 14px rgba(0,0,40,0.8)" }} wordBreak="break-word">
        {valor || "—"}
      </Text>
    </Box>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="860px">
          {/* ── Cabecera: mandala, nombre y email ── */}
          <Reveal direction="down" distance={16}>
            <Flex direction="column" align="center" textAlign="center" mb={{ base: 7, md: 9 }}>
              <Image
                src="/img/icono/life.webp"
                alt=""
                h={{ base: "48px", md: "62px" }}
                objectFit="contain"
                mb={4}
                style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" }}
              />
              <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em"
                    textTransform="uppercase" lineHeight="1.15"
                    textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)">
                {persona.name}
              </Text>
              <Text color="rgba(255,255,255,0.8)" fontSize="lg" fontStyle="italic" mt={1}>{persona.email}</Text>
            </Flex>
          </Reveal>

          {aviso && (
            <Text role="status" color="#ffe7bd" fontSize="md" fontStyle="italic" textAlign="center" mb={5}>{aviso}</Text>
          )}

          {/* ── Datos personales ── */}
          <Reveal direction="up" distance={22} delay={0.15} mb={{ base: 5, md: 7 }}>
            <Box {...CAJA_MARMOL}>
              <Flex align="center" justify="space-between" gap={3} wrap="wrap" mb={6}>
                {tituloMarmol("Datos personales")}
                <Flex align="center" gap={2} px={4} py="5px" borderRadius="full" bg="rgba(255,255,255,0.55)" border="1px solid rgba(0,79,79,0.3)">
                  <Box w="9px" h="9px" borderRadius="full" bg={pendiente ? "#d99a2b" : activada ? "#1f9d8f" : "#9aa"}
                       boxShadow={pendiente ? "0 0 8px #d99a2b" : activada ? "0 0 8px #1f9d8f" : "none"} />
                  <Text fontSize="md" fontWeight="700">
                    {pendiente ? "Pendiente de activar" : activada ? "Activada" : "—"}
                  </Text>
                </Flex>
              </Flex>

              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 4, md: 5 }}>
                {campo("datos-nombre", "Nombre", nombre, setNombre)}
                {campo("datos-telefono", "Teléfono", telefono, setTelefono, "+34 600 11 22 33", { type: "tel" })}
                {campo("datos-nacimiento", "Fecha de nacimiento", nacimiento, (v) => setNacimiento(mascaraDMA(v)), "dd/mm/aaaa", { inputMode: "numeric" })}
                {dato("Alta", fechaDMA(persona.created_at))}
              </Grid>

              <Flex justify="flex-end" mt={7}>
                <PildoraMarmol off={guardando || sinCambios} onClick={guardar}>
                  {guardando ? "Guardando…" : "Guardar"}
                </PildoraMarmol>
              </Flex>
            </Box>
          </Reveal>

          {/* ── Carta astral: el cielo de Astrología ── */}
          <Reveal direction="up" distance={22} delay={0.3} mb={{ base: 5, md: 7 }}>
            <Box {...CAJA_CIELO}>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.12em" textTransform="uppercase" color={astrologiaTxt}
                    mb={7} style={{ textShadow: sombraTexto(astrologiaNom, astrologiaBg) }}>
                Carta astral
              </Text>
              <Flex direction={{ base: "column", md: "row" }} gap={{ base: 6, md: 8 }} align="stretch">
                {datoCielo("Fecha", fechaDMA(carta?.fecha_nacimiento))}
                {datoCielo("Hora", carta?.hora_nacimiento ? carta.hora_nacimiento.slice(0, 5) : null)}
                {datoCielo("Lugar", lugarCarta)}
              </Flex>
              <Flex justify="flex-end" mt={8}>
                <BotonPildora solido onClick={() => navigate(`/admin/astrologia/${persona.id}`)}>Abrir su carta astral</BotonPildora>
              </Flex>
            </Box>
          </Reveal>

          {/* ── Activación (solo mientras no la haya activado) ── */}
          {pendiente && (
            <Reveal direction="up" distance={22} delay={0.4} mb={{ base: 5, md: 7 }}>
              <Box {...CAJA_MARMOL}>
                <Box mb={5}>{tituloMarmol("Activación")}</Box>
                <Flex gap={3} wrap="wrap">
                  <PildoraMarmol off={ocupado} onClick={reenviar}>Reenviar correo de activación</PildoraMarmol>
                  <PildoraMarmol contorno off={ocupado} onClick={copiarEnlace}>Copiar enlace de activación</PildoraMarmol>
                </Flex>
                {enlace && (
                  <Input readOnly value={enlace} aria-label="Enlace de activación" onFocus={(e) => e.currentTarget.select()}
                         mt={5} {...ESTILO_CAMPO} h="46px" fontSize="sm" />
                )}
              </Box>
            </Reveal>
          )}

          {/* ── Acceso: qué disciplinas tiene abiertas (el camino de cada una se abre además entrando en su home) ── */}
          <Reveal direction="up" distance={22} delay={0.5} mb={{ base: 5, md: 7 }}>
            <Box {...CAJA_VIDRIO} border="1px solid rgba(255,255,255,0.4)">
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.12em" textTransform="uppercase" mb={4}>
                Acceso
              </Text>
              <AccesoPersona
                persona={persona}
                onCambio={(nuevos) => setPersona((p) => (p ? { ...p, ...nuevos } : p))}
                onAviso={setAviso}
              />
            </Box>
          </Reveal>

          {/* ── Lo suyo: sus lecturas por disciplina, su diario y sus intereses ── */}
          <Reveal direction="up" distance={22} delay={0.55} mb={{ base: 5, md: 7 }}>
            <Box {...CAJA_VIDRIO} border="1px solid rgba(255,255,255,0.4)">
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.12em" textTransform="uppercase" mb={4}>
                Su contenido
              </Text>
              <Flex gap={3} wrap="wrap" mb={4}>
                {ADMIN_DISCIPLINAS.map((d) => (
                  <Box
                    key={d.key}
                    as="button"
                    type="button"
                    onClick={() => navigate(`/admin/${d.key}/${persona.id}`)}
                    px={4}
                    py="7px"
                    borderRadius="full"
                    bg={d.bg}
                    border={`1px solid ${d.txt}`}
                    color={d.txt}
                    fontSize="sm"
                    fontWeight="700"
                    cursor="pointer"
                    transition="all 0.18s"
                    _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 14px ${d.txt}66` }}
                    _focusVisible={{ outline: "2px solid white", outlineOffset: "2px" }}
                  >
                    {d.nombre}
                  </Box>
                ))}
              </Flex>
              <Flex gap={3} wrap="wrap">
                <BotonPildora onClick={() => navigate(`/admin/diario/${persona.id}`)}>
                  <IconoDiarioTerapia size="16px" />
                  Diario de terapias
                </BotonPildora>
                <BotonPildora onClick={() => navigate(`/admin/actividad/${persona.id}`, { state: { name: persona.name, email: persona.email } })}>
                  Intereses
                </BotonPildora>
              </Flex>
            </Box>
          </Reveal>

          {/* ── Eliminar la cuenta: al final, apartado y con confirmación ── */}
          <Reveal direction="up" distance={22} delay={0.6} mt={{ base: 9, md: 12 }}>
            <Box {...CAJA_VIDRIO}>
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.12em" textTransform="uppercase" mb={4}>
                Eliminar cuenta
              </Text>
              {!eliminando ? (
                <Flex align="center" justify="space-between" gap={4} wrap="wrap">
                  <Text fontSize="md" opacity={0.85} fontStyle="italic">
                    Se borran su cuenta y todos sus datos. No se puede deshacer.
                  </Text>
                  <BotonPildora peligro onClick={() => { setEliminando(true); setEmailConfirma(""); }}>Eliminar cuenta</BotonPildora>
                </Flex>
              ) : (
                <Box>
                  <Text as="label" htmlFor="eliminar-email" display="block" fontSize="md" opacity={0.9} mb={3}>
                    Para confirmar, escribe su email: <strong>{persona.email}</strong>
                  </Text>
                  <Input id="eliminar-email" type="email" value={emailConfirma} onChange={(e) => setEmailConfirma(e.target.value)}
                         autoComplete="off" autoFocus {...ESTILO_CAMPO_VIDRIO} />
                  <Flex gap={3} mt={4} wrap="wrap">
                    <BotonPildora onClick={() => { setEliminando(false); setEmailConfirma(""); }}>Cancelar</BotonPildora>
                    <BotonPildora peligro ocupado={ocupado || !emailCoincide} onClick={eliminar}>
                      {ocupado ? "Eliminando…" : "Eliminar para siempre"}
                    </BotonPildora>
                  </Flex>
                </Box>
              )}
            </Box>
          </Reveal>

          <Flex mt={{ base: 8, md: 10 }}>
            <BotonPildora onClick={() => navigate("/admin/asesorias")}>Volver</BotonPildora>
          </Flex>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
