// ─────────────────────────────────────────────────────────────────────────────
// Panel de LECTURAS — los pedidos de la carta de la lectura (Astrología → Adquirir).
//
// Cada pedido nace cuando Stripe confirma el pago e incluye los datos de nacimiento (todos obligatorios).
// La persona recibe un correo de «registro confirmado» y NO tiene acceso a su cuenta: cuando la carta está
// escrita, desde aquí se le manda el correo para elegir contraseña («Enviar acceso»).
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
import { fechaDMA } from "../../utils/fechas";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

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
  user_id: string | null;
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

export default function AdminLecturas() {
  const navigate = useNavigate();
  const { verificando } = useAdminGuard();
  const [lista, setLista] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);

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

  const enviarAcceso = async (p: Pedido) => {
    if (!window.confirm(`¿Mandar a ${p.nombre} el correo para entrar en su cuenta? Hazlo cuando su carta esté escrita.`)) return;
    setOcupado(p.id);
    try {
      const r = await axios.post(`${API_URL}/lectura/admin/acceso`, { id: p.id }, { headers: adminHeaders() });
      setAviso(r.data?.correoEnviado ? `Acceso enviado a ${p.email}.` : "El correo no ha salido. Inténtalo de nuevo.");
      await cargar();
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setAviso(msg ?? "No se pudo enviar el acceso.");
    }
    setOcupado(null);
  };

  const t = q.trim().toLowerCase();
  const filtrados = !t ? lista : lista.filter((p) => `${p.nombre} ${p.email} ${p.lugar_nacimiento}`.toLowerCase().includes(t));

  if (verificando) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={BEIGE} fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="860px">
          <Text color={T} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.06em" textTransform="uppercase" textAlign="center">
            Lecturas
          </Text>
          <Text color={T} opacity={0.8} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center" mt={2} mb={{ base: 6, md: 8 }}>
            Los pedidos de la carta, con sus datos de nacimiento. Cuando la carta esté escrita, envíales el acceso a su cuenta.
          </Text>

          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, correo o lugar…"
            mb={4}
            bg="#ffffffb3"
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
                <Box key={p.id} px={{ base: 5, md: 6 }} py={5} borderRadius="2xl" border={`1.5px solid ${T}55`} color={T}>
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
                    <Box as="button" onClick={() => enviarAcceso(p)} disabled={ocupado === p.id || !p.user_id} {...pildora(false)} opacity={p.user_id ? 1 : 0.5}>
                      {p.acceso_enviado_at ? "Reenviar acceso" : "Enviar acceso"}
                    </Box>
                  </Flex>
                </Box>
              ))}

              {filtrados.length === 0 && (
                <Text color={T} opacity={0.8} fontStyle="italic" textAlign="center" py={8}>
                  {lista.length === 0 ? "Todavía no hay pedidos." : "Ningún pedido coincide con la búsqueda."}
                </Text>
              )}
            </Flex>
          )}

          <Flex justify="flex-end" mt={{ base: 8, md: 10 }}>
            <Box as="button" onClick={() => navigate("/admin")} {...pildora(false)} px={6} py="10px" fontSize={{ base: "sm", md: "md" }}>
              Volver
            </Box>
          </Flex>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
