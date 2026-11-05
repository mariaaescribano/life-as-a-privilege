import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { API_URL } from "../../GlobalVariables";
import { adminHeaders, useAdminGuard } from "./useAdminGuard";
import { BotonPildora, MandalaTurquesa } from "./PildorasAdmin";
import { abrirCaminoDe } from "../../api/persona";

// Asesorías: las personas que María acompaña. Ella da de alta cada cuenta
// (CREAR USUARIO) y a la persona le llega un correo para activarla. De cada fila
// salen dos botones: «Datos» (/admin/asesorias/:userId/datos: sus datos personales,
// la carta astral, la activación, su acceso, su diario y eliminar la cuenta) y el del
// mandala, que te mete en el espacio de los dos (su home): la cuenta de cada persona
// es de ella y tuya, no un producto aparte. Ves y andas la web igual que ella, con lo
// que solo tienes tú: abrirle pasos y escribirle notas. Aquí NO hay botones de borrar: un clic de más en una lista
// es demasiado fácil.
interface Persona {
  id: string;
  name: string;
  email: string;
  en_sesiones?: boolean;
  /** false = aún no ha elegido contraseña (cuenta sin activar). */
  email_confirmado?: boolean;
}

export default function AdminHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verificando } = useAdminGuard();

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  // El aviso (cuenta creada o eliminada) llega por el estado de la ruta.
  const [aviso, setAviso] = useState<string | null>((location.state as { aviso?: string } | null)?.aviso ?? null);
  // La persona a cuya cuenta se está entrando ahora mismo (el botón del mandala).
  const [entrando, setEntrando] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const res = await axios.get<Persona[]>(`${API_URL}/user/admin/todos`, { headers: adminHeaders() });
      setPersonas((res.data ?? []).filter((u) => u.en_sesiones === true));
    } catch {
      setPersonas([]);
      setAviso("No se pudo cargar la lista.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (verificando) return;
    cargar();
  }, [verificando, cargar]);

  // Gastado el aviso, se quita del historial para que no vuelva al recargar.
  useEffect(() => {
    if ((location.state as { aviso?: string } | null)?.aviso) navigate(location.pathname, { replace: true, state: null });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // El mandala: abre el camino de esa persona (María sigue con su sesión) y va a su home.
  // Recarga entera a propósito: así no queda en memoria ni un dato del camino anterior.
  const entrar = async (p: Persona) => {
    if (entrando) return;
    setEntrando(p.id);
    setAviso(null);
    try {
      await abrirCaminoDe(p.id);
      window.location.assign("/home");
    } catch {
      setAviso(`No se pudo abrir el camino de ${p.name}.`);
      setEntrando(null);
    }
  };

  if (verificando || loading) {
    return <LifeLoading variant="private" />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="920px">
          {/* ── Título + CREAR USUARIO ── */}
          <Flex align="center" justify="space-between" gap={4} wrap="wrap" mb={{ base: 6, md: 8 }}>
            <Box>
              <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em"
                    textTransform="uppercase" lineHeight="1.15"
                    textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)">
                Asesorías
              </Text>
              <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}>
                {personas.length} {personas.length === 1 ? "persona" : "personas"}
              </Text>
            </Box>
            <BotonPildora solido onClick={() => navigate("/admin/asesorias/nueva")}>CREAR USUARIO</BotonPildora>
          </Flex>

          {aviso && (
            <Text role="status" color="#ffe7bd" fontSize="md" fontStyle="italic" textAlign="center" mb={5}>{aviso}</Text>
          )}

          {/* ── Lista ── */}
          {personas.length === 0 ? (
            <Text color="rgba(255,255,255,0.8)" fontSize="lg" fontStyle="italic" textAlign="center" pt={10}>
              Todavía no hay nadie. Crea la primera cuenta con el botón de arriba.
            </Text>
          ) : (
            <Flex direction="column" gap={3}>
              {personas.map((p) => (
                <Flex
                  key={p.id}
                  align="center"
                  justify="space-between"
                  gap={4}
                  px={{ base: 5, md: 6 }}
                  py={{ base: 4, md: 5 }}
                  borderRadius="2xl"
                  // El mármol de María, a resolución completa, con la letra en turquesa oscuro.
                  bgColor="#efe5cf"
                  bgImage="url('/img/fondos/marmolfondo-crema.webp')"
                  bgSize="cover"
                  bgPosition="center"
                  border="1px solid rgba(255,255,255,0.65)"
                  boxShadow="0 0 30px rgba(255,255,255,0.28), 0 0 70px rgba(180,255,245,0.14)"
                >
                  <Box minW={0}>
                    <Text color="#004f4f" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.03em" noOfLines={1}>
                      {p.name}
                    </Text>
                    {p.email_confirmado === false && (
                      <Text color="#7a5200" fontSize="xs" fontStyle="italic">Pendiente de activar</Text>
                    )}
                  </Box>
                  <Flex gap={3} flexShrink={0}>
                    <BotonPildora marmol titulo={`Datos de ${p.name}`} onClick={() => navigate(`/admin/asesorias/${p.id}/datos`)}>Datos</BotonPildora>
                    <BotonPildora marmol solido ocupado={entrando === p.id} titulo={`Abrir el camino de ${p.name}`} onClick={() => entrar(p)}>
                      <MandalaTurquesa tam="22px" color="white" />
                      <Text as="span" fontSize="lg" lineHeight="1" aria-hidden>→</Text>
                    </BotonPildora>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
