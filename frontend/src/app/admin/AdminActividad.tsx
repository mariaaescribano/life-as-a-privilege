// ─────────────────────────────────────────────────────────────────────────────
// INTERESES de una persona — qué recursos gratuitos ha abierto (tabla
// actividad_recurso, la apunta RegistroActividad). Arriba, cuánto pesa cada
// disciplina; abajo, todo lo que ha visto, lo más reciente primero. Es la base
// para escribirle el email semanal con lo que más le puede interesar.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { API_URL } from "../../GlobalVariables";
import { presentacionPorKey } from "../../data/presentacionDisciplinas";
import { useCursosData } from "../../data/cursosApi";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

interface Fila {
  recurso: string;
  tipo: string;
  disciplina: string | null;
  titulo: string | null;
  veces: number;
  primera_vez: string;
  ultima_vez: string;
}

const TIPO_LABEL: Record<string, string> = {
  mapa: "Página de El Mapa",
  portada: "Portada de disciplina",
  presentacion: "Presentación",
  ilustraciones: "Galería de ilustraciones",
  ilustracion: "Ilustración",
  cursos: "Lista de cursos",
  curso: "Curso",
  leccion: "Lección",
  recursos: "Recursos",
  herramienta: "Herramienta",
  test: "Test",
  libros: "Libros",
  libro: "Descarga de libro",
};

const nombreDisciplina = (key: string | null) =>
  !key ? "General" : key === "fitoterapia" ? "Fitoterapia" : presentacionPorKey(key)?.titulo ?? key;

const fecha = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
};

const decode = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };

export default function AdminActividad() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const quien = (useLocation().state ?? {}) as { name?: string; email?: string };
  const { verificando } = useAdminGuard();
  const { cursosData } = useCursosData();

  const [filas, setFilas] = useState<Fila[]>([]);
  const [porDisciplina, setPorDisciplina] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (verificando || !userId) return;
    axios
      .get<{ filas: Fila[]; porDisciplina: Record<string, number> }>(
        `${API_URL}/actividad/admin/${userId}`,
        { headers: adminHeaders() },
      )
      .then((r) => {
        setFilas(Array.isArray(r.data?.filas) ? r.data.filas : []);
        setPorDisciplina(r.data?.porDisciplina ?? {});
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [verificando, userId]);

  /** El nombre legible del recurso: el título guardado, el del curso si es un
   *  curso o una lección, o la ruta tal cual. */
  const titulo = (f: Fila): string => {
    if (f.titulo) return f.titulo;
    const [, , tipoRuta, mod, cursoId] = f.recurso.split("/");
    if ((tipoRuta === "modulosPage" || tipoRuta === "leccion") && mod && cursoId) {
      const curso = cursosData[decode(mod)]?.cursos.find((c) => String(c.id) === cursoId);
      if (curso) return curso.titulo;
    }
    return decode(f.recurso);
  };

  const ranking = Object.entries(porDisciplina).sort((a, b) => b[1] - a[1]);
  const maximo = ranking[0]?.[1] ?? 1;

  if (verificando) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="760px">
          <Box as="button" onClick={() => navigate("/admin/usuarios")} color="white" fontSize="sm" mb={4}
               opacity={0.8} _hover={{ opacity: 1 }}>
            ← Todas las cuentas
          </Box>
          <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.06em"
                textTransform="uppercase" textAlign="center">
            Intereses
          </Text>
          <Text color="rgba(255,255,255,0.8)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                textAlign="center" mt={2} mb={{ base: 6, md: 8 }}>
            {quien.name ? `${quien.name}${quien.email ? ` · ${quien.email}` : ""}` : "Lo que ha abierto de los recursos gratuitos"}
          </Text>

          {loading ? (
            <Flex justify="center" py={10}><LifeLoader /></Flex>
          ) : error ? (
            <Text color="white" textAlign="center">No se pudo cargar su actividad.</Text>
          ) : filas.length === 0 ? (
            <Text color="rgba(255,255,255,0.7)" fontStyle="italic" textAlign="center" py={8}>
              Todavía no ha abierto ningún recurso gratuito con la sesión iniciada.
            </Text>
          ) : (
            <>
              {ranking.length > 0 && (
                <Box bg="rgba(0,0,0,0.12)" borderRadius="16px" p={{ base: 4, md: 5 }} mb={6}>
                  <Text color="white" fontWeight="700" mb={3}>Lo que más le interesa</Text>
                  <Flex direction="column" gap={2}>
                    {ranking.map(([d, n]) => (
                      <Flex key={d} align="center" gap={3}>
                        <Text color="white" fontSize="sm" w="120px" flexShrink={0}>{nombreDisciplina(d)}</Text>
                        <Box flex="1" h="8px" bg="rgba(255,255,255,0.12)" borderRadius="full" overflow="hidden">
                          <Box h="100%" w={`${(n / maximo) * 100}%`} bg="white" borderRadius="full" />
                        </Box>
                        <Text color="rgba(255,255,255,0.8)" fontSize="sm" w="70px" textAlign="right">
                          {n} {n === 1 ? "visita" : "visitas"}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              )}

              <Flex direction="column" gap={2}>
                {filas.map((f) => (
                  <Flex key={f.recurso} bg="rgba(0,0,0,0.12)" borderRadius="12px" px={4} py={3}
                        justify="space-between" align="center" gap={3}>
                    <Box minW={0}>
                      <Text color="white" fontWeight="600" noOfLines={1}>{titulo(f)}</Text>
                      <Text color="rgba(255,255,255,0.65)" fontSize="sm" noOfLines={1}>
                        {TIPO_LABEL[f.tipo] ?? f.tipo} · {nombreDisciplina(f.disciplina)}
                      </Text>
                    </Box>
                    <Box textAlign="right" flexShrink={0}>
                      <Text color="white" fontSize="sm">{f.veces} {f.veces === 1 ? "vez" : "veces"}</Text>
                      <Text color="rgba(255,255,255,0.65)" fontSize="xs">{fecha(f.ultima_vez)}</Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </>
          )}
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
