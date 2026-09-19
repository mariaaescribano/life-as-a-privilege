// ─────────────────────────────────────────────────────────────────────────────
// USUARIOS (/admin/usuarios) — todas las cuentas y qué disciplinas tiene cada una.
//
// Es la vista TRANSVERSAL del panel: /admin/<disciplina> mira una disciplina y
// dice quién la ha pagado; esta mira una persona y dice qué tiene. Sirve para
// responder de un vistazo «¿por dónde va fulanita?» sin entrar en las ocho.
//
// Solo LEE. Para abrir o cerrar una disciplina —o para borrar una cuenta— está
// /admin/accesos, que es donde vive esa responsabilidad y donde se confirma.
//
// Los datos salen de GET /user/admin/recorrido, que ya devuelve cada cuenta con
// sus ocho `<scope>_suscrito` y `<scope>_fecha_compra`: no hace falta endpoint
// nuevo. Tope de 500 cuentas (lo pone el backend) y el buscador filtra aquí.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { DISCIPLINAS_PAGO } from "../../data/adminDisciplinas";
import { API_URL } from "../../GlobalVariables";
import { adminHeaders, useAdminGuard } from "./useAdminGuard";
import BotonEntrarComo from "./BotonEntrarComo";

interface CuentaAdmin {
  id: string;
  name: string;
  email: string;
  img?: string | null;
  /** `<scope>_suscrito` y `<scope>_fecha_compra`. */
  [flag: string]: any;
}

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

  useEffect(() => {
    if (verificando) return;
    (async () => {
      try {
        const res = await axios.get<CuentaAdmin[]>(`${API_URL}/user/admin/recorrido`, { headers: adminHeaders() });
        setUsuarios(res.data ?? []);
      } catch {
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [verificando]);

  // Primero quien más lleva recorrido (así se ve arriba a quien hay que
  // atender), y a igualdad de disciplinas, por nombre.
  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    const base = !t
      ? usuarios
      : usuarios.filter(
          (u) => (u.name ?? "").toLowerCase().includes(t) || (u.email ?? "").toLowerCase().includes(t),
        );
    const cuantas = (u: CuentaAdmin) => DISCIPLINAS_PAGO.filter((d) => u[`${d.scope}_suscrito`]).length;
    return [...base].sort((a, b) => {
      const ca = cuantas(a);
      const cb = cuantas(b);
      if (ca !== cb) return cb - ca;
      return (a.name ?? "").localeCompare(b.name ?? "", "es");
    });
  }, [q, usuarios]);

  // Cuántas cuentas tienen al menos una disciplina abierta.
  const conAlguna = useMemo(
    () => usuarios.filter((u) => DISCIPLINAS_PAGO.some((d) => u[`${d.scope}_suscrito`])).length,
    [usuarios],
  );

  if (verificando) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="980px">
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
                ? "Todas las cuentas y las disciplinas que tienen."
                : `${usuarios.length} ${usuarios.length === 1 ? "cuenta" : "cuentas"} · ${conAlguna} con alguna disciplina abierta`}
            </Text>
          </Flex>

          {/* ── BUSCADOR ── */}
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o email…"
            mb={5}
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

          {loading ? (
            <Flex justify="center" py={12}><LifeLoader color="#ffffff" /></Flex>
          ) : (
            <Flex direction="column" gap={3}>
              {filtrados.map((u) => {
                const suyas = DISCIPLINAS_PAGO.filter((d) => u[`${d.scope}_suscrito`]);
                return (
                  <Flex
                    key={u.id}
                    align={{ base: "flex-start", md: "center" }}
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 3, md: 4 }}
                    px={{ base: 4, md: 5 }}
                    py={{ base: 4, md: 4 }}
                    borderRadius="xl"
                    bg="rgba(255,255,255,0.07)"
                    border="1px solid rgba(255,255,255,0.22)"
                    transition="border-color 0.18s"
                    _hover={{ borderColor: "rgba(255,255,255,0.5)" }}
                  >
                    {/* quién */}
                    <Flex align="center" gap={3} minW={{ md: "230px" }} maxW={{ md: "230px" }} flexShrink={0}>
                      <Box
                        w="40px"
                        h="40px"
                        borderRadius="full"
                        overflow="hidden"
                        flexShrink={0}
                        border="1px solid rgba(255,255,255,0.45)"
                      >
                        <Image src={u.img || "/img/icono/noImg.webp"} w="100%" h="100%" objectFit="cover" alt="" />
                      </Box>
                      <Box minW={0}>
                        <Text color="white" fontWeight="600" noOfLines={1}>{u.name}</Text>
                        <Text color="rgba(255,255,255,0.65)" fontSize="sm" noOfLines={1}>{u.email}</Text>
                      </Box>
                    </Flex>

                    {/* qué tiene — una pastilla por disciplina abierta, con su
                        color y la fecha en la que la abrió. Las que NO tiene no
                        se pintan: con ocho apagadas por cuenta la lista era una
                        cuadrícula gris donde no se veía lo que importa. */}
                    <Flex flex="1" minW={0} gap={2} flexWrap="wrap">
                      {suyas.length === 0 ? (
                        <Text color="rgba(255,255,255,0.45)" fontSize="sm" fontStyle="italic">
                          Sin ninguna disciplina todavía
                        </Text>
                      ) : (
                        suyas.map((d) => {
                          const fecha = fechaCorta(u[`${d.scope}_fecha_compra`]);
                          return (
                            <Flex
                              key={d.scope}
                              as="button"
                              onClick={() => navigate(`/admin/${d.adminKey}/${u.id}`)}
                              align="center"
                              gap={1.5}
                              px={3}
                              py="3px"
                              borderRadius="full"
                              whiteSpace="nowrap"
                              bg={d.bg}
                              border={`1px solid ${d.txt}aa`}
                              cursor="pointer"
                              transition="all 0.15s"
                              _hover={{ borderColor: d.txt, transform: "translateY(-1px)" }}
                              title={`Abrir ${d.nombre} de ${u.name}`}
                            >
                              <Text color={d.txt} fontSize="xs" fontWeight="600">{d.nombre}</Text>
                              {fecha && (
                                <Text color={`${d.txt}99`} fontSize="xs" display={{ base: "none", lg: "block" }}>
                                  · {fecha}
                                </Text>
                              )}
                            </Flex>
                          );
                        })
                      )}
                    </Flex>

                    {/* cuántas de ocho + entrar en su cuenta */}
                    <Flex
                      align="center"
                      gap={3}
                      flexShrink={0}
                      alignSelf={{ base: "flex-end", md: "center" }}
                    >
                      <Text color="rgba(255,255,255,0.75)" fontSize="sm" whiteSpace="nowrap">
                        {suyas.length}/{DISCIPLINAS_PAGO.length}
                      </Text>
                      {/* Diario de sesiones: las notas que le escribo tras cada
                          sesión y que lee en su Home. No depende de ninguna
                          disciplina, así que va aquí y no en las pastillas. */}
                      <Box
                        as="button"
                        onClick={() => navigate(`/admin/diario/${u.id}`)}
                        px={3}
                        py="5px"
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
                        title={`Diario de sesiones de ${u.name}`}
                      >
                        Diario
                      </Box>
                      {/* Ver la web como ella: su sesión de verdad, no una copia
                          de solo lectura. Al entrar sale la barra para volver. */}
                      <BotonEntrarComo usuario={u} />
                    </Flex>
                  </Flex>
                );
              })}

              {filtrados.length === 0 && (
                <Text color="rgba(255,255,255,0.6)" fontStyle="italic" textAlign="center" py={8}>
                  {usuarios.length === 0 ? "No hay cuentas todavía." : "Ninguna cuenta coincide con la búsqueda."}
                </Text>
              )}
            </Flex>
          )}
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
