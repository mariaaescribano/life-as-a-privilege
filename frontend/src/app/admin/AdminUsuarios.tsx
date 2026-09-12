import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Input, Text, Image } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LoadingDisciplina, loaderDisciplinaBlanco } from "../../components/metodo/comicLoaders";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import { AdminDisciplinaHeader } from "./AdminDisciplinaHeader";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { API_URL, astrologiaNom } from "../../GlobalVariables";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

interface RecorridoUser {
  id: string;
  name: string;
  email: string;
  img?: string | null;
  /** flags de pago: `<scope>_suscrito` y `<scope>_fecha_compra`. */
  [flag: string]: any;
}

/** slug del panel → columna de la cuenta. Solo Astrología cambia de nombre:
 *  su scope de pago es `metodo` (es la primera disciplina, la del Mapa). */
const SCOPE_POR_KEY: Record<string, string> = { astrologia: "metodo" };
const scopeDe = (key: string) => SCOPE_POR_KEY[key] ?? key;

/** «12 sept 2026», o null si no hay fecha guardada (accesos antiguos o regalados). */
const fechaCorta = (iso?: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
};

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const { disciplina } = useParams<{ disciplina: string }>();
  const { verificando } = useAdminGuard();
  const disc = disciplinaByKey(disciplina ?? "");

  const [usuarios, setUsuarios] = useState<RecorridoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (verificando) return;
    if (!disc) { navigate("/admin"); return; }
    (async () => {
      try {
        const res = await axios.get<RecorridoUser[]>(`${API_URL}/user/admin/recorrido`, { headers: adminHeaders() });
        setUsuarios(res.data ?? []);
      } catch {
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [verificando, disc, navigate]);

  // La lista trae TODAS las cuentas, así que arriba van las que tienen pagada
  // la disciplina que se está mirando y debajo el resto (por orden de nombre).
  const scope = scopeDe(disc?.key ?? "");
  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    const base = !t
      ? usuarios
      : usuarios.filter(
          (u) => (u.name ?? "").toLowerCase().includes(t) || (u.email ?? "").toLowerCase().includes(t),
        );
    return [...base].sort((a, b) => {
      const pa = a[`${scope}_suscrito`] ? 0 : 1;
      const pb = b[`${scope}_suscrito`] ? 0 : 1;
      if (pa !== pb) return pa - pb;
      return (a.name ?? "").localeCompare(b.name ?? "", "es");
    });
  }, [q, usuarios, scope]);

  if (verificando || !disc) {
    return <LoadingDisciplina color={disc?.txt} />;
  }

  // Todas las cajas de la página llevan de fondo la imagen de la disciplina
  // (Astrología: el cielo estrellado). Solo el fondo de PÁGINA sigue turquesa.
  // Sobre la foto el texto va en `disc.txt` con halo de `disc.bg`, que es el
  // color opuesto en cada disciplina, así se lee tanto en las oscuras como en
  // las claras.
  const conImg = hasDisciplinaBg(disc.nombre);
  const velo = `${disc.bg}8c`;
  // En Astrología la foto va TAL CUAL: sin velo de color y sin bajarle la
  // opacidad, se ve el cielo con su color real. En las demás disciplinas sigue
  // el velo, que ahí hay fotos claras y el texto se perdería encima.
  const fotoTalCual = disc.nombre === astrologiaNom;
  const glow = `0 1px 3px ${disc.bg}, 0 0 12px ${disc.bg}`;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="720px">
          <AdminDisciplinaHeader disc={disc} subtitle="Cuentas y quién ha pagado" fotoTalCual={fotoTalCual} />

          {!disc.disponible && (
            <Text color="rgba(255,220,180,0.85)" fontSize="sm" fontStyle="italic" mb={4}>
              Esta disciplina aún no tiene panel de administración. Puedes ver la lista, pero la lectura llegará pronto.
            </Text>
          )}

          {/* buscador — la foto va en el envoltorio y el Input se queda
              transparente encima (un <input> no puede llevar capas hijas). */}
          <Box
            position="relative"
            overflow="hidden"
            borderRadius="full"
            mb={5}
            bg={disc.bg}
            border={`1px solid ${disc.txt}55`}
            transition="border-color 0.18s"
            _hover={{ borderColor: `${disc.txt}aa` }}
            _focusWithin={{ borderColor: disc.txt }}
          >
            {conImg && (
              <DisciplinaBgLayer nom={disc.nombre} borderRadius="full" overlay={velo} talCual={fotoTalCual} />
            )}
            <Input
              position="relative"
              zIndex={1}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre o email…"
              bg="transparent"
              border="none"
              color={disc.txt}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              style={{ textShadow: glow }}
              _placeholder={{ color: `${disc.txt}80`, textShadow: glow }}
              _hover={{}}
              _focus={{ boxShadow: "none" }}
              _focusVisible={{ boxShadow: "none" }}
            />
          </Box>

          {loading ? (
            <Flex justify="center" py={10}>{loaderDisciplinaBlanco(disc.txt)}</Flex>
          ) : (
            <Flex direction="column" gap={2}>
              {filtrados.map((u) => (
                <Flex
                  key={u.id}
                  as="button"
                  onClick={() => navigate(`/admin/${disc.key}/${u.id}`)}
                  align="center"
                  gap={3}
                  textAlign="left"
                  px={4}
                  py={3}
                  borderRadius="xl"
                  position="relative"
                  overflow="hidden"
                  bg={disc.bg}
                  border={`1px solid ${disc.txt}55`}
                  cursor="pointer"
                  transition="all 0.18s"
                  _hover={{ borderColor: disc.txt, transform: "translateY(-2px)" }}
                >
                  {conImg && (
                    <DisciplinaBgLayer nom={disc.nombre} borderRadius="xl" overlay={velo} talCual={fotoTalCual} />
                  )}

                  <Box position="relative" zIndex={1} w="40px" h="40px" borderRadius="full" overflow="hidden" flexShrink={0}
                       border={`1px solid ${disc.txt}88`} bg={disc.bg}>
                    <Image src={u.img || "/img/icono/noImg.png"} w="100%" h="100%" objectFit="cover" alt="" />
                  </Box>
                  <Box position="relative" zIndex={1} minW={0} flex="1">
                    <Text color={disc.txt} fontWeight="600" noOfLines={1} style={{ textShadow: glow }}>{u.name}</Text>
                    <Text color={`${disc.txt}b3`} fontSize="sm" noOfLines={1} style={{ textShadow: glow }}>{u.email}</Text>
                  </Box>
                  {/* Pagada o no ESTA disciplina. Ojo: «pagada» significa que la
                      tiene abierta, sea por Stripe o porque se la regalaste desde
                      /admin/accesos; el cobro de verdad se mira en Stripe. */}
                  {(() => {
                    const pagada = !!u[`${scope}_suscrito`];
                    const fecha = fechaCorta(u[`${scope}_fecha_compra`]);
                    return (
                      <Box
                        position="relative"
                        zIndex={1}
                        flexShrink={0}
                        px={2}
                        py="2px"
                        borderRadius="full"
                        whiteSpace="nowrap"
                        border={`1px solid ${pagada ? disc.txt : `${disc.txt}44`}`}
                        bg={pagada ? `${disc.txt}22` : "transparent"}
                      >
                        <Text
                          fontSize="xs"
                          color={pagada ? disc.txt : `${disc.txt}88`}
                          style={{ textShadow: glow }}
                        >
                          {pagada ? "Pagada" : "Sin pagar"}
                          {pagada && fecha && (
                            <Box as="span" display={{ base: "none", md: "inline" }}> · {fecha}</Box>
                          )}
                        </Text>
                      </Box>
                    );
                  })()}

                  <Text position="relative" zIndex={1} color={disc.txt} fontSize="lg" style={{ textShadow: glow }}>→</Text>
                </Flex>
              ))}
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
