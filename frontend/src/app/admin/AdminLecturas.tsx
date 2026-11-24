// ─────────────────────────────────────────────────────────────────────────────
// Panel de LECTURAS — los pedidos de la carta de la lectura (Astrología → Adquirir).
//
// Cada pedido nace cuando Stripe confirma el pago e incluye los datos de nacimiento (todos obligatorios).
// La persona recibe un correo de «registro confirmado» y NO tiene cuenta: es una persona de LECTURA (tablas propias,
// aparte de `user`). Cuando la carta está escrita, desde aquí se le manda el correo con el enlace para entrar a leerla
// («Enviar acceso»): el texto lo escribe María antes de enviarlo. Entra a un front de solo lectura, sin foto ni cuenta.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { API_URL, FONDO_PAGINA_BEIGE as BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { fechaDMA, mascaraDMA, dmaAIso } from "../../utils/fechas";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";
import { CorreoEditable } from "../../components/admin/CorreoEditable";
import { MandalaTurquesa } from "./PildorasAdmin";
import { Reveal } from "../../components/global/Reveal";

interface Pedido {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  servicio: string;
  precio_centimos: number;
  fecha_nacimiento: string;
  hora_nacimiento: string;
  lugar_nacimiento: string;
  pagado: boolean;
  /** La persona de lectura (tabla `lectura_cliente`): sin ella no hay carta que escribir ni acceso que mandar. */
  cliente_id: string | null;
  estado: "recibido" | "en_proceso" | "lista";
  acceso_enviado_at: string | null;
}

const SERVICIOS: Record<string, string> = {
  pdf_parcial: "Carta en pdf parcial",
  pdf_completo: "Carta pdf completa",
  plataforma: "Carta a través de la plataforma",
};
const ESTADOS: { clave: Pedido["estado"]; etiqueta: string }[] = [
  { clave: "recibido", etiqueta: "Recibido" },
  { clave: "en_proceso", etiqueta: "En proceso" },
  { clave: "lista", etiqueta: "Lista" },
];

const pildora = (activo = false) => ({
  px: 4,
  py: "6px",
  borderRadius: "full",
  border: `1.5px solid ${T}`,
  bg: activo ? T : "transparent",
  color: activo ? BEIGE : T,
  fontWeight: "700" as const,
  fontSize: "sm",
  cursor: "pointer",
  transition: "all 0.2s",
  _hover: { bg: activo ? T : `${T}14` },
});

const campo = {
  w: "100%",
  bg: "#F7EBD9",
  border: `1.5px solid ${T}66`,
  borderRadius: "full",
  color: T,
  fontFamily: "'EB Garamond', serif",
  fontSize: { base: "md", md: "lg" },
  px: 5,
  py: 3,
  h: "auto",
  _placeholder: { color: `${T}8c` },
  _hover: { borderColor: `${T}aa` },
  _focus: { borderColor: T, boxShadow: "none" },
} as const;

const Etiqueta = ({ children }: { children: React.ReactNode }) => (
  <Text color={T} fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.06em" mb={1} ml={2}>
    {children}
  </Text>
);

export default function AdminLecturas() {
  const navigate = useNavigate();
  const { verificando } = useAdminGuard();
  const [lista, setLista] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  // El pedido al que se va a mandar el acceso (popup de confirmación).
  const [confirmando, setConfirmando] = useState<Pedido | null>(null);

  // Crear una carta a mano (clientes que no la pidieron por la web).
  const NUEVA_VACIA = { nombre: "", email: "", servicio: "plataforma", fecha: "", hora: "", pais: "", region: "", ciudad: "" };
  const [abierta, setAbierta] = useState(false);
  const [nueva, setNueva] = useState(NUEVA_VACIA);
  const [creando, setCreando] = useState(false);
  const [errorNueva, setErrorNueva] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const r = await axios.get<Pedido[]>(`${API_URL}/lectura/admin`, { headers: adminHeaders() });
      setLista(r.data ?? []);
    } catch {
      setLista([]);
      setAviso("No se pudo cargar la lista de pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (verificando) return;
    cargar();
  }, [verificando, cargar]);

  const cambiarEstado = async (p: Pedido, estado: Pedido["estado"]) => {
    if (estado === p.estado) return;
    setOcupado(p.id);
    try {
      await axios.post(`${API_URL}/lectura/admin/estado`, { id: p.id, estado }, { headers: adminHeaders() });
      setLista((l) => l.map((x) => (x.id === p.id ? { ...x, estado } : x)));
    } catch {
      setAviso("No se pudo cambiar el estado.");
    }
    setOcupado(null);
  };

  const borrar = async (p: Pedido) => {
    if (!window.confirm(`¿Borrar el pedido de ${p.nombre} y, si no tiene más, también su carta y su acceso? No se puede deshacer.`)) return;
    setOcupado(p.id);
    try {
      await axios.post(`${API_URL}/lectura/admin/borrar`, { id: p.id }, { headers: adminHeaders() });
      setAviso(`Pedido de ${p.nombre} borrado.`);
      await cargar();
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setAviso(msg ?? "No se pudo borrar.");
    }
    setOcupado(null);
  };

  const crear = async () => {
    if (creando) return;
    setErrorNueva(null);
    const n = nueva;
    if (![n.nombre, n.email, n.fecha, n.hora, n.pais, n.region, n.ciudad].every((v) => v.trim())) {
      setErrorNueva("Faltan datos: todos son obligatorios.");
      return;
    }
    const fechaIso = dmaAIso(n.fecha);
    if (!fechaIso) {
      setErrorNueva("La fecha de nacimiento no es válida: día/mes/año.");
      return;
    }
    setCreando(true);
    try {
      await axios.post(
        `${API_URL}/lectura/admin/crear`,
        {
          servicio: n.servicio, nombre: n.nombre.trim(), email: n.email.trim(), fecha: fechaIso, hora: n.hora,
          lugar: [n.ciudad, n.region, n.pais].map((v) => v.trim()).join(", "),
        },
        { headers: adminHeaders() },
      );
      setAviso(`Carta creada para ${n.nombre.trim()}. Cuando esté escrita, envíale el acceso.`);
      setNueva(NUEVA_VACIA);
      setAbierta(false);
      await cargar();
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setErrorNueva(Array.isArray(msg) ? msg.join(" ") : msg ?? "No se pudo crear la carta.");
    }
    setCreando(false);
  };

  const t = q.trim().toLowerCase();
  const filtrados = !t ? lista : lista.filter((p) => `${p.nombre} ${p.email} ${p.lugar_nacimiento}`.toLowerCase().includes(t));

  if (verificando) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={BEIGE} fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="860px">
          <Reveal direction="down" distance={18}>
            <Flex justify="center" mb={{ base: 4, md: 5 }}><MandalaTurquesa tam="64px" /></Flex>
          </Reveal>
          <Text color={T} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.06em" textTransform="uppercase" textAlign="center">
            Lecturas
          </Text>
          <Text color={T} opacity={0.8} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center" mt={2} mb={{ base: 6, md: 8 }}>
            Los pedidos de la carta, con sus datos de nacimiento. Cuando la carta esté escrita, envíales el acceso a su cuenta.
          </Text>

          <Flex justify="center" mb={4}>
            <Box as="button" type="button" onClick={() => { setAbierta((v) => !v); setErrorNueva(null); }} {...pildora(abierta)} px={6} py="10px" fontSize={{ base: "sm", md: "md" }}>
              {abierta ? "Cerrar" : "+ Nueva carta"}
            </Box>
          </Flex>

          {abierta && (
            <Box border={`1.5px solid ${T}`} borderRadius="3xl" px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }} mb={6} color={T}>
              <Flex direction="column" gap={{ base: 4, md: 5 }}>
                <Flex gap={{ base: 4, md: 5 }} direction={{ base: "column", md: "row" }}>
                  <Box flex="1"><Etiqueta>Nombre</Etiqueta><Input {...campo} value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} maxLength={120} /></Box>
                  <Box flex="1"><Etiqueta>Email</Etiqueta><Input {...campo} type="email" value={nueva.email} onChange={(e) => setNueva({ ...nueva, email: e.target.value })} /></Box>
                </Flex>
                <Box>
                  <Etiqueta>Tipo de carta</Etiqueta>
                  <Flex gap={2} wrap="wrap">
                    {Object.entries(SERVICIOS).map(([clave, nombre]) => (
                      <Box key={clave} as="button" type="button" onClick={() => setNueva({ ...nueva, servicio: clave })} {...pildora(nueva.servicio === clave)}>
                        {nombre}
                      </Box>
                    ))}
                  </Flex>
                </Box>
                <Flex gap={{ base: 4, md: 5 }} direction={{ base: "column", md: "row" }}>
                  <Box flex="1"><Etiqueta>Fecha de nacimiento</Etiqueta><Input {...campo} inputMode="numeric" placeholder="día/mes/año" maxLength={10} value={nueva.fecha} onChange={(e) => setNueva({ ...nueva, fecha: mascaraDMA(e.target.value) })} /></Box>
                  <Box flex="1"><Etiqueta>Hora de nacimiento</Etiqueta><Input {...campo} type="time" value={nueva.hora} onChange={(e) => setNueva({ ...nueva, hora: e.target.value })} /></Box>
                </Flex>
                <Flex gap={{ base: 3, md: 4 }} direction={{ base: "column", md: "row" }}>
                  <Box flex="1"><Etiqueta>País</Etiqueta><Input {...campo} value={nueva.pais} onChange={(e) => setNueva({ ...nueva, pais: e.target.value })} maxLength={60} /></Box>
                  <Box flex="1"><Etiqueta>Región</Etiqueta><Input {...campo} value={nueva.region} onChange={(e) => setNueva({ ...nueva, region: e.target.value })} maxLength={60} /></Box>
                  <Box flex="1"><Etiqueta>Ciudad</Etiqueta><Input {...campo} value={nueva.ciudad} onChange={(e) => setNueva({ ...nueva, ciudad: e.target.value })} maxLength={60} /></Box>
                </Flex>
                {errorNueva && <Text color="#b3261e" fontWeight="600" textAlign="center">{errorNueva}</Text>}
                <Flex justify="center">
                  <Box as="button" type="button" onClick={crear} disabled={creando} {...pildora(true)} px={8} py="10px" opacity={creando ? 0.6 : 1}>
                    {creando ? "Creando…" : "Crear carta"}
                  </Box>
                </Flex>
              </Flex>
            </Box>
          )}

          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, correo o lugar…"
            mb={4}
            bg="#F7EBD9"
            border={`1px solid ${T}55`}
            color={T}
            borderRadius="full"
            fontFamily="'EB Garamond', serif"
            _placeholder={{ color: `${T}8c` }}
            _hover={{ borderColor: `${T}aa` }}
            _focus={{ borderColor: T, boxShadow: "none" }}
          />

          <Text color={T} opacity={0.8} fontSize="sm" mb={3}>
            {filtrados.length} {filtrados.length === 1 ? "pedido" : "pedidos"}
          </Text>
          {aviso && <Text color={T} fontSize="sm" fontStyle="italic" textAlign="center" mb={4}>{aviso}</Text>}

          {loading ? (
            <Flex justify="center" py={10}><LifeLoader /></Flex>
          ) : (
            <Flex direction="column" gap={4}>
              {filtrados.map((p) => (
                <Flex key={p.id} align="stretch" borderRadius="2xl" border={`1.5px solid ${T}55`} color={T} overflow="hidden">
                  <Box flex="1" minW={0} px={{ base: 5, md: 6 }} py={5}>
                  <Flex justify="space-between" align="baseline" gap={3} wrap="wrap">
                    <Text fontWeight="700" fontSize={{ base: "lg", md: "xl" }}>{p.nombre}</Text>
                    <Text fontSize="sm" opacity={0.75}>{fechaDMA(p.created_at) ?? ""}</Text>
                  </Flex>
                  <Text fontSize={{ base: "md", md: "lg" }}>{p.email}</Text>
                  <Text mt={2} fontWeight="600">
                    {SERVICIOS[p.servicio] ?? p.servicio} · {(p.precio_centimos / 100).toLocaleString("es-ES")} €{p.pagado ? " · pagado" : " · sin pagar"}
                  </Text>
                  <Box mt={3} px={4} py={3} borderRadius="xl" bg={`${T}10`}>
                    <Text fontSize={{ base: "md", md: "lg" }}>
                      <b>Nacimiento:</b> {fechaDMA(p.fecha_nacimiento) ?? p.fecha_nacimiento} · {p.hora_nacimiento} · {p.lugar_nacimiento}
                    </Text>
                  </Box>

                  <Flex mt={4} gap={2} wrap="wrap" align="center">
                    {ESTADOS.map((e) => (
                      <Box key={e.clave} as="button" onClick={() => cambiarEstado(p, e.clave)} disabled={ocupado === p.id} {...pildora(p.estado === e.clave)}>
                        {e.etiqueta}
                      </Box>
                    ))}
                    <Box flex="1" />
                    {p.acceso_enviado_at ? (
                      <Text fontSize="sm" fontStyle="italic">Acceso enviado el {fechaDMA(p.acceso_enviado_at) ?? ""}</Text>
                    ) : null}
                    <Box as="button" onClick={() => borrar(p)} disabled={ocupado === p.id} {...pildora(false)}>
                      Borrar
                    </Box>
                    <Box as="button" onClick={() => setConfirmando(p)} disabled={ocupado === p.id || !p.cliente_id} {...pildora(false)} opacity={p.cliente_id ? 1 : 0.5}>
                      {p.acceso_enviado_at ? "Reenviar acceso" : "Enviar acceso"}
                    </Box>
                  </Flex>
                  </Box>

                  {/* Ir a escribir la carta: todo el alto de la tarjeta, solo una flecha. */}
                  <Box
                    as="button"
                    type="button"
                    onClick={() => navigate(`/admin/astrologia/${p.cliente_id}`)}
                    disabled={!p.cliente_id}
                    aria-label="Escribir la carta"
                    title="Escribir la carta"
                    flexShrink={0}
                    w={{ base: "64px", md: "96px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={T}
                    color={BEIGE}
                    fontSize={{ base: "3xl", md: "4xl" }}
                    cursor={p.cliente_id ? "pointer" : "not-allowed"}
                    opacity={p.cliente_id ? 1 : 0.4}
                    transition="all 0.2s"
                    _hover={p.cliente_id ? { opacity: 0.9, w: { base: "72px", md: "112px" } } : {}}
                    _focusVisible={{ outline: `2px solid ${BEIGE}`, outlineOffset: "-6px" }}
                  >
                    →
                  </Box>
                </Flex>
              ))}

              {filtrados.length === 0 && (
                <Text color={T} opacity={0.8} fontStyle="italic" textAlign="center" py={8}>
                  {lista.length === 0 ? "Todavía no hay pedidos." : "Ningún pedido coincide con la búsqueda."}
                </Text>
              )}
            </Flex>
          )}

        </Box>
      </Flex>

      <SiteFooter />

      {/* El correo de acceso: lo escribe María (con su texto de siempre ya puesto) y sale con el botón-llave. */}
      {confirmando && (
        <CorreoEditable
          abierto
          titulo={`Correo para ${confirmando.nombre}`}
          para={confirmando.email}
          asuntoInicial="Tu carta ya está lista"
          textoInicial={`Hola ${confirmando.nombre},\n\nTu carta ya está lista. Entra con el botón de abajo para leerla. No necesitas contraseña: este correo es tu llave, así que no lo pierdas.\n\nUn abrazo,\nMaría`}
          etiquetaBoton="Entrar a mi carta"
          onEnviar={async (d) => {
            const r = await axios.post<{ correoEnviado: boolean }>(`${API_URL}/lectura/admin/acceso`, { id: confirmando.id, ...d }, { headers: adminHeaders() });
            if (r.data?.correoEnviado) { await cargar(); return { ok: true, mensaje: `Acceso enviado a ${confirmando.email}.` }; }
            return { ok: false, mensaje: "El correo no ha salido. Inténtalo de nuevo." };
          }}
          onCerrar={() => setConfirmando(null)}
        />
      )}
    </Box>
  );
}
