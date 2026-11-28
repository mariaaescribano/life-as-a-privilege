// ─────────────────────────────────────────────────────────────────────────────
// Panel de SUSCRIPTORES — los correos que deja la gente en el formulario y los
// que se apuntan como voluntarios (origen='voluntario').
//
// Antes esto vivía en un fichero de texto dentro del servidor, que se borraba
// en cada despliegue. Ahora sale de la tabla `suscriptor` de Supabase, así que
// la lista de aquí es la de verdad y no se pierde nunca.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { API_URL } from "../../GlobalVariables";
import { fechaDMA } from "../../utils/fechas";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

interface Suscriptor {
  id: string;
  email: string;
  origen: string | null;
  created_at: string;
  /** Enlace de baja ya firmado, listo para pegar en el correo de esa persona. */
  baja?: string;
}

const fecha = (iso: string) => {
  return fechaDMA(iso) ?? "";
};

export default function AdminSuscriptores() {
  const navigate = useNavigate();
  const { verificando } = useAdminGuard();

  const [lista, setLista] = useState<Suscriptor[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const res = await axios.get<Suscriptor[]>(`${API_URL}/subscribe/admin/todos`, {
        headers: adminHeaders(),
      });
      setLista(res.data ?? []);
    } catch {
      setLista([]);
      setAviso("No se pudo cargar la lista de suscriptores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (verificando) return;
    cargar();
  }, [verificando, cargar]);

  const t = q.trim().toLowerCase();
  const filtrados = !t
    ? lista
    : lista.filter(
        (s) => s.email.toLowerCase().includes(t) || (s.origen ?? "").toLowerCase().includes(t),
      );

  // Copiar todos los correos separados por coma: listo para pegar en el gestor
  // de correo cuando quieras escribirles a todos.
  const copiar = async () => {
    const texto = filtrados.map((s) => s.email).join(", ");
    try {
      await navigator.clipboard.writeText(texto);
      setAviso(`Copiados ${filtrados.length} correos al portapapeles.`);
    } catch {
      setAviso("El navegador no ha dejado copiar. Selecciona la lista a mano.");
    }
  };

  // El enlace de baja de una persona (firmado) y el genérico (formulario), que
  // es el que vale para un envío a toda la lista desde el gestor de correo.
  const copiarTexto = async (texto: string, hecho: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setAviso(hecho);
    } catch {
      setAviso("El navegador no ha dejado copiar.");
    }
  };

  const enlaceBajaGenerico = `${window.location.origin}/baja`;

  const descargar = () => {
    const filas = [
      "email,origen,fecha",
      ...filtrados.map((s) => `${s.email},${s.origen ?? ""},${s.created_at}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([filas], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "suscriptores.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (verificando) {
    return <LifeLoading variant="private" />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="760px">
          <Text color="#3B2418" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.06em"
                textTransform="uppercase" textAlign="center">
            Suscriptores
          </Text>
          <Text color="#3B2418cc" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                textAlign="center" mt={2} mb={{ base: 6, md: 8 }}>
            Los correos que ha dejado la gente, del más nuevo al más antiguo.
          </Text>

          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por correo…"
            mb={4}
            bg="#F7EBD9"
            border="1.5px solid #3B241866"
            color="#3B2418"
            borderRadius="full"
            fontFamily="'EB Garamond', serif"
            _placeholder={{ color: "#3B24188c" }}
            _hover={{ borderColor: "#3B2418aa" }}
            _focus={{ borderColor: "#3B2418", boxShadow: "none" }}
          />

          <Flex justify="space-between" align="center" gap={3} wrap="wrap" mb={4}>
            <Text color="#3B2418cc" fontSize="sm">
              {filtrados.length} {filtrados.length === 1 ? "correo" : "correos"}
            </Text>
            <Flex gap={3}>
              <Box as="button" onClick={copiar}
                   px={5} py={2} borderRadius="full" bg="#3B2418"
                   border="1.5px solid #3B2418" color="#F0DCC0" fontWeight="700"
                   fontSize="sm" cursor="pointer" transition="all 0.2s"
                   _hover={{ bg: "#5a3624", transform: "translateY(-2px)" }} _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
                Copiar todos
              </Box>
              <Box as="button"
                   onClick={() => copiarTexto(enlaceBajaGenerico, "Enlace de baja copiado: pégalo al final del correo.")}
                   px={5} py={2} borderRadius="full" bg="transparent"
                   border="1.5px solid #3B2418" color="#3B2418" fontWeight="600"
                   fontSize="sm" cursor="pointer" transition="all 0.2s"
                   _hover={{ bg: "#3B241814", transform: "translateY(-2px)" }} _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
                Copiar enlace de baja
              </Box>
              <Box as="button" onClick={descargar}
                   px={5} py={2} borderRadius="full" bg="transparent"
                   border="1.5px solid #3B2418" color="#3B2418" fontWeight="600"
                   fontSize="sm" cursor="pointer" transition="all 0.2s"
                   _hover={{ bg: "#3B241814", transform: "translateY(-2px)" }} _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
                Descargar CSV
              </Box>
            </Flex>
          </Flex>

          {aviso && (
            <Text color="#b3261e" fontSize="sm" fontStyle="italic" textAlign="center" mb={4}>
              {aviso}
            </Text>
          )}

          {loading ? (
            <Flex justify="center" py={10}><LifeLoader /></Flex>
          ) : (
            <Flex direction="column" gap={2}>
              {filtrados.map((s) => (
                <Flex
                  key={s.id}
                  align="center"
                  gap={3}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  bg="transparent"
                  border="1.5px solid #3B241855"
                >
                  <Box minW={0} flex="1">
                    <Text color="#3B2418" fontWeight="600" noOfLines={1}>{s.email}</Text>
                    {s.origen && (
                      <Text color="#3B2418b3" fontSize="sm" noOfLines={1}>{s.origen}</Text>
                    )}
                  </Box>
                  <Text color="#3B2418a0" fontSize="sm" flexShrink={0}>
                    {fecha(s.created_at)}
                  </Text>
                  {s.baja && (
                    <Box as="button" flexShrink={0}
                         onClick={() => copiarTexto(s.baja!, `Enlace de baja de ${s.email} copiado.`)}
                         title="Copiar el enlace de baja de esta persona"
                         px={3} py={1} borderRadius="full" bg="transparent"
                         border="1px solid #3B241888" color="#3B2418"
                         fontSize="xs" cursor="pointer" transition="all 0.2s"
                         _hover={{ bg: "#3B241814" }} _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
                      Baja
                    </Box>
                  )}
                </Flex>
              ))}

              {filtrados.length === 0 && (
                <Text color="#3B2418b3" fontStyle="italic" textAlign="center" py={8}>
                  {lista.length === 0 ? "No hay suscriptores todavía." : "Ningún correo coincide con la búsqueda."}
                </Text>
              )}
            </Flex>
          )}

          {/* Volver — abajo a la derecha, fuera de la lista */}
          <Flex justify="flex-end" mt={{ base: 8, md: 10 }}>
            <Box as="button" onClick={() => navigate("/admin")}
                 px={6} py={2.5} borderRadius="full" bg="#3B2418"
                 border="1.5px solid #3B2418" color="#F0DCC0" fontWeight="700"
                 fontSize={{ base: "sm", md: "md" }} cursor="pointer" transition="all 0.2s"
                 _hover={{ bg: "#5a3624", transform: "translateY(-2px)" }} _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
              Volver
            </Box>
          </Flex>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
