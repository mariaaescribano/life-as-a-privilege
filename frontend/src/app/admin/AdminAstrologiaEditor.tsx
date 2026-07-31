import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea, Input } from "@chakra-ui/react";
import { AstrologiaLoading } from "../../components/metodo/comicLoaders";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Glifo, GlifoSigno } from "../../components/metodo/Glifo";
import { cuerpoByKey, CUERPOS, ZODIAC_SIGNS, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { CartaAstral3D } from "../../components/metodo/CartaAstral3D/CartaAstral3D";
import { SaberMasModal } from "../../components/metodo/Planetas";
import { glowHeader } from "../../components/metodo/FotoBox";
import type { CartaNatal, Aspecto } from "../../components/metodo/CartaAstral3D/types";
import {
  infoCasa,
  NUMEROS_ROMANOS,
  ASPECTO_LABEL,
  ASPECTO_SYMBOL,
  aspectoKey,
} from "../../components/metodo/casasAspectos";
import { API_URL, turquesa, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";

// Sombra/brillo blanco para texto sobre los boxes estrellados.
const GLOW = `0 1px 3px rgba(0,0,0,0.6), 0 0 10px rgba(255,255,255,0.45), 0 0 22px ${astrologiaTxt}55`;

// Halo ÚNICO de todo el panel: el mismo de la cabecera del recorrido
// (glowHeader). Nada de sombras negras: cajas y botones llevan este glow, y al
// pasar por encima sube de intensidad (GLOW_CAJA_HOVER).
const GLOW_CAJA = glowHeader(astrologiaTxt);
const GLOW_CAJA_HOVER =
  `0 0 22px rgba(255,255,255,0.28), 0 0 44px rgba(255,255,255,0.14), 0 0 70px rgba(180,255,245,0.16), 0 0 30px ${astrologiaTxt}2e, 0 0 62px ${astrologiaTxt}1c`;
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import { AdminDisciplinaHeader } from "./AdminDisciplinaHeader";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

// Un reto = punto importante que el usuario verá como una estrella en su cielo.
interface Reto { id: string; titulo: string; texto: string; }
const genRetoId = () => "r-" + Math.random().toString(36).slice(2, 9);

const Chevron = ({ open, color }: { open: boolean; color: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill={color}
       style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
    <path d="M480-360 280-560h400L480-360Z" />
  </Box>
);

/** Trozo de contenido con su PROPIA capa de cielo estrellado, y una raya
 *  horizontal de separación con el trozo anterior.
 *
 *  Por qué: estos boxes son larguísimos (las 12 casas pasan de 2000px de alto) y
 *  la foto del cielo se pintaba UNA sola vez para todo el box. Con `object-fit:
 *  cover` a esa altura la imagen se amplía tantísimo que se ve deformada y
 *  lavada. Partiendo el contenido en trozos, cada uno pinta la foto entera a un
 *  tamaño razonable y entre trozo y trozo queda la raya de separación.
 *
 *  Los trozos van pegados unos a otros (sin hueco) y a todo el ancho del box:
 *  así tapan por completo el fondo estirado del contenedor, que solo se sigue
 *  viendo detrás de la cabecera (una franja baja, donde no se deforma). */
function Trozo({ children, px = { base: 4, md: 6 }, py = { base: 4, md: 5 } }: {
  children: React.ReactNode; px?: any; py?: any;
}) {
  return (
    <Box position="relative" overflow="hidden" w="100%">
      <DisciplinaBgLayer nom={astrologiaNom} borderRadius="0" talCual />
      {/* Separación horizontal con lo que va justo encima */}
      <Box position="absolute" top={0} left={0} right={0} h="1px" zIndex={2}
           bgGradient="linear(to-r, transparent, rgba(255,255,255,0.3), transparent)" />
      <Box position="relative" zIndex={1} px={px} py={py}>{children}</Box>
    </Box>
  );
}

/** Botón de «mandar este correo». Dice qué correo manda (su propio asunto), y
 *  debajo, si ya se mandó, cuándo fue. */
function BotonAviso({ label, enviado, enviando, onClick }: {
  label: string; enviado?: string; enviando: boolean; onClick: () => void;
}) {
  return (
    <Box as="button" onClick={enviando ? undefined : onClick}
         position="relative" overflow="hidden" flex="1 1 260px" minW="240px" textAlign="left"
         px={{ base: 4, md: 5 }} py={3} borderRadius="xl" border={`1px solid ${astrologiaTxt}66`}
         cursor={enviando ? "wait" : "pointer"} opacity={enviando ? 0.7 : 1}
         boxShadow={GLOW_CAJA} _hover={{ boxShadow: GLOW_CAJA_HOVER, transform: "translateY(-1px)" }}
         transition="all 0.2s">
      <DisciplinaBgLayer nom={astrologiaNom} borderRadius="xl" talCual />
      <Flex position="relative" zIndex={1} align="flex-start" gap={2.5}>
        {/* Sobre: deja claro que esto MANDA un correo, no guarda */}
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="18px" h="18px"
             fill="#ffffff" flexShrink={0} mt="2px">
          <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" />
        </Box>
        <Box minW={0}>
          <Text color="#ffffff" fontWeight="700" fontSize="sm" lineHeight="1.35" style={{ textShadow: GLOW }}>
            {enviando ? "Enviando…" : label}
          </Text>
          <Text color={enviado ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.5)"} fontSize="xs"
                fontStyle="italic" mt={1}>
            {enviado ? `Enviado el ${new Date(enviado).toLocaleString("es-ES")}` : "Sin enviar"}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

function Desplegable({ titulo, count, open, onToggle, accion, children }: {
  titulo: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  /** Botón propio de la sección (p. ej. «+ Añadir»). Va FUERA de la zona que
   *  pliega: un botón dentro de otro botón no es HTML válido y el clic se
   *  robaría entre los dos. */
  accion?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box position="relative" borderRadius="xl" border={`1px solid ${turquesa}44`} mb={5} overflow="hidden"
         boxShadow={GLOW_CAJA}>
      <DisciplinaBgLayer nom={astrologiaNom} borderRadius="xl" talCual />
      <Flex position="relative" zIndex={1} align="center" gap={3} px={{ base: 4, md: 6 }} py={4}
            _hover={{ bg: "rgba(255,255,255,0.05)" }} transition="background 0.15s">
        <Flex as="button" onClick={onToggle} flex="1" minW={0} align="center" textAlign="left" cursor="pointer">
          <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.04em" style={{ textShadow: GLOW }}>
            {titulo}
            {count != null && <Box as="span" color="rgba(255,255,255,0.75)" fontSize="sm"> ({count})</Box>}
          </Text>
        </Flex>
        {accion}
        <Box as="button" onClick={onToggle} flexShrink={0} cursor="pointer"
             aria-label={open ? `Plegar ${titulo}` : `Desplegar ${titulo}`}>
          <Chevron open={open} color="#ffffff" />
        </Box>
      </Flex>
      {/* Sin padding: el cuerpo son `Trozo`s a todo el ancho, cada uno con su
          propia foto y su raya de separación. */}
      {open && <Box position="relative" zIndex={1}>{children}</Box>}
    </Box>
  );
}

export default function AdminAstrologiaEditor() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { verificando } = useAdminGuard();

  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const [casas, setCasas] = useState<Record<string, string>>({});
  const [aspectos, setAspectos] = useState<Record<string, string>>({});
  const [retos, setRetos] = useState<Reto[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorRetos, setErrorRetos] = useState<string | null>(null);
  // Avisos por email: los manda ELLA con los botones, nunca el guardado.
  // `avisadoAt` guarda cuándo se mandó cada uno (para no duplicarlos sin querer).
  const [avisando, setAvisando] = useState<"proceso" | "leida" | null>(null);
  const [avisadoAt, setAvisadoAt] = useState<{ proceso?: string; leida?: string }>({});
  const [avisoMsg, setAvisoMsg] = useState<string | null>(null);
  const [avisoError, setAvisoError] = useState<string | null>(null);
  const [retosOpen, setRetosOpen] = useState(true);
  const [casasOpen, setCasasOpen] = useState(true);
  const [aspectosOpen, setAspectosOpen] = useState(false);
  // Box de consulta: la carta del usuario (rueda + planetas + casas). Abierto
  // por defecto para poder mirarla mientras se escribe la lectura.
  const [cartaOpen, setCartaOpen] = useState(true);
  // Arquetipo abierto en el popup «Saber más» (el mismo que lee el usuario).
  const [saberMasKey, setSaberMasKey] = useState<CuerpoKey | null>(null);

  const disc = disciplinaByKey("astrologia")!;

  useEffect(() => {
    if (verificando || !userId) return;
    (async () => {
      try {
        const [userRes, cartaRes, rowRes] = await Promise.all([
          axios.get(`${API_URL}/user/${userId}`, { headers: adminHeaders() }),
          axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, { headers: adminHeaders() }),
          axios.get<{
            casas_texto?: Record<string, string>;
            aspectos_texto?: Record<string, string>;
            retos?: Reto[];
            data?: { aviso_proceso_at?: string; aviso_leida_at?: string };
          } | null>(
            `${API_URL}/metodo-astrologia/${userId}`, { headers: adminHeaders() },
          ),
        ]);
        setNombre(userRes.data?.name ?? "");
        setEmail(userRes.data?.email ?? "");
        setCarta(cartaRes.data ?? null);
        setCasas((rowRes.data?.casas_texto ?? {}) as Record<string, string>);
        setAspectos((rowRes.data?.aspectos_texto ?? {}) as Record<string, string>);
        setRetos(Array.isArray(rowRes.data?.retos) ? rowRes.data!.retos! : []);
        setAvisadoAt({
          proceso: rowRes.data?.data?.aviso_proceso_at,
          leida: rowRes.data?.data?.aviso_leida_at,
        });
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
  }, [verificando, userId]);

  const guardar = async () => {
    if (!userId) return;

    // ── Validación de puntos clave ──
    // Regla: mínimo 1 punto, y cada uno debe tener título Y descripción.
    const conContenido = retos.filter((r) => r.titulo.trim() || r.texto.trim());
    const incompletos = conContenido.filter((r) => !r.titulo.trim() || !r.texto.trim());
    if (incompletos.length > 0) {
      setErrorRetos("Cada punto clave necesita título y descripción (o bórralo).");
      return;
    }
    if (conContenido.length === 0) {
      setErrorRetos("Añade al menos un punto clave (con título y descripción).");
      return;
    }
    setErrorRetos(null);

    setGuardando(true);
    setGuardado(false);
    try {
      await axios.patch(
        `${API_URL}/metodo-astrologia/admin/${userId}/textos`,
        {
          casas_texto: casas,
          aspectos_texto: aspectos,
          retos: conContenido.map((r) => ({ ...r, titulo: r.titulo.trim(), texto: r.texto.trim() })),
        },
        { headers: adminHeaders() },
      );
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  // Manda uno de los dos correos. Si ese mismo ya se mandó antes, pide
  // confirmación para no repetirlo sin querer.
  const avisar = async (tipo: "proceso" | "leida") => {
    if (!userId) return;
    const yaEnviado = avisadoAt[tipo];
    const queCorreo = tipo === "proceso" ? "«Tu carta está en proceso de ser leída»" : "«Tu carta ya ha sido leída»";
    if (yaEnviado && !window.confirm(
      `Ya se mandó ${queCorreo} a ${nombre || "esta persona"} el ${new Date(yaEnviado).toLocaleString("es-ES")}.\n\n¿Volver a mandarlo?`,
    )) return;

    setAvisando(tipo);
    setAvisoMsg(null);
    setAvisoError(null);
    try {
      const res = await axios.post<{ success: boolean; message?: string; avisado_at?: string }>(
        `${API_URL}/metodo-astrologia/admin/${userId}/avisar/${tipo}`,
        {},
        { headers: adminHeaders() },
      );
      if (res.data?.success) {
        const cuando = res.data.avisado_at ?? new Date().toISOString();
        setAvisadoAt((p) => ({ ...p, [tipo]: cuando }));
        setAvisoMsg(`${tipo === "proceso" ? "«En proceso»" : "«Carta leída»"} enviado${email ? ` a ${email}` : ""}`);
        setTimeout(() => setAvisoMsg(null), 4000);
      } else {
        setAvisoError(res.data?.message ?? "No se pudo enviar el correo.");
      }
    } catch {
      setAvisoError("No se pudo enviar el correo.");
    } finally {
      setAvisando(null);
    }
  };

  if (verificando || loading) {
    return (
      <AstrologiaLoading />
    );
  }

  const cusps = carta?.cusps ?? [];

  // Posición (signo y casa) de cada cuerpo según la carta CALCULADA: es lo que
  // se muestra en el box de consulta y lo que lee el popup de arquetipos.
  const posicionDe = (key: CuerpoKey) => {
    const p = carta?.planetas.find((x) => x.planeta === key);
    if (!p) return null;
    return { signo: ZODIAC_SIGNS[p.signoIdx]?.name, casa: p.casa };
  };
  // Cuerpos en el orden canónico, solo los que la carta tiene calculados.
  const cuerposCarta = CUERPOS.filter((c) => !!posicionDe(c.key));
  const cuerpoSaberMas = saberMasKey ? cuerpoByKey(saberMasKey) : null;
  const posSaberMas = saberMasKey ? posicionDe(saberMasKey) : null;
  const listaAspectos: Aspecto[] = carta?.aspectos ?? [];

  // Mismo agrupado que /metodo/astrologia/aspectos: recorremos el orden canónico
  // de CUERPOS y, por cada planeta, sus aspectos (cada aspecto aparece bajo sus
  // dos planetas). Descartamos los planetas sin aspectos.
  const gruposAspectosPorPlaneta = CUERPOS.map((c) => ({
    cuerpo: c,
    items: listaAspectos
      .filter((a) => a.a === c.key || a.b === c.key)
      .map((a) => ({ aspecto: a, otro: a.a === c.key ? a.b : a.a })),
  })).filter((g) => g.items.length > 0);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
          <Box w="100%" maxW="820px">
            <Text as="button" onClick={() => navigate("/admin/astrologia")} color="rgba(255,255,255,0.75)" fontSize="sm" mb={3}
                  _hover={{ color: "white" }}>← Usuarios de astrología</Text>

            {/* header de disciplina con su imagen */}
            <AdminDisciplinaHeader disc={disc} fotoTalCual
                                   subtitle={`${nombre || "Usuario"}${email ? ` · ${email}` : ""}`} />

            {/* barra de guardar */}
            <Flex justify="flex-end" align="center" gap={3} mb={5} wrap="wrap">
              {errorRetos && (
                <Text color="#ff9a9a" fontSize="sm" fontStyle="italic" style={{ textShadow: GLOW }}>
                  {errorRetos}
                </Text>
              )}
              {guardado && (
                <Flex align="center" gap={1.5} color="#ffffff" fontSize="sm" fontStyle="italic" style={{ textShadow: GLOW }}>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill="#ffffff">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                  Guardado
                </Flex>
              )}
              <Box as="button" onClick={guardando ? undefined : guardar}
                   position="relative" overflow="hidden"
                   px={8} py={2.5} borderRadius="full" border={`1px solid ${astrologiaTxt}88`}
                   cursor={guardando ? "wait" : "pointer"} opacity={guardando ? 0.7 : 1}
                   boxShadow={GLOW_CAJA} _hover={{ boxShadow: GLOW_CAJA_HOVER, transform: "translateY(-1px)" }} transition="all 0.2s">
                <DisciplinaBgLayer nom={astrologiaNom} borderRadius="9999px" talCual />
                <Text position="relative" zIndex={1} color="#ffffff" fontWeight="700" letterSpacing="0.06em" style={{ textShadow: GLOW }}>
                  {guardando ? "Guardando…" : "Guardar"}
                </Text>
              </Box>
            </Flex>

            {/* ── Correos a la persona ──
                  Aparte de «Guardar» a propósito: guardar la lectura no manda
                  nada. El correo de datos registrados sale solo, al enviar ella
                  sus datos; estos dos se mandan desde aquí, cuando tú quieras. */}
            <Box position="relative" borderRadius="xl" border={`1px solid ${turquesa}44`} mb={5} overflow="hidden"
                 boxShadow={GLOW_CAJA}>
              <DisciplinaBgLayer nom={astrologiaNom} borderRadius="xl" talCual />
              <Box position="relative" zIndex={1} p={{ base: 4, md: 5 }}>
                <Text color="#ffffff" fontWeight="700" fontSize="md" style={{ textShadow: GLOW }}>
                  Avisar por email
                </Text>
                <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" mt={1}>
                  Nada de esto se manda al guardar: solo al pulsar. El correo con sus datos de
                  nacimiento le llega automáticamente cuando los envía.
                </Text>
              </Box>

              {/* Los dos botones */}
              <Trozo>
                <Flex gap={3} wrap="wrap">
                  <BotonAviso
                    label="Tu carta está en proceso de ser leída"
                    enviado={avisadoAt.proceso}
                    enviando={avisando === "proceso"}
                    onClick={() => void avisar("proceso")}
                  />
                  <BotonAviso
                    label="Tu carta ya ha sido leída"
                    enviado={avisadoAt.leida}
                    enviando={avisando === "leida"}
                    onClick={() => void avisar("leida")}
                  />
                </Flex>

                {avisoError && (
                  <Text color="#ff9a9a" fontSize="sm" fontStyle="italic" mt={3} style={{ textShadow: GLOW }}>
                    {avisoError}
                  </Text>
                )}
                {avisoMsg && (
                  <Flex align="center" gap={1.5} color="#ffffff" fontSize="sm" fontStyle="italic" mt={3}
                        style={{ textShadow: GLOW }}>
                    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill="#ffffff">
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </Box>
                    {avisoMsg}
                  </Flex>
                )}
              </Trozo>
            </Box>

            {/* ── CONSULTA: la carta de la persona ──
                  La MISMA rueda que ve ella en su recorrido, más sus planetas y
                  sus casas en corto. Sirve para tener la carta delante mientras
                  se escribe la lectura, y para leer los arquetipos (el popup
                  «Saber más» es el mismo que lee ella). Es solo consulta: aquí
                  no se edita nada. */}
            {carta && (
              <Desplegable titulo={`La carta de ${nombre || "esta persona"}`} open={cartaOpen}
                           onToggle={() => setCartaOpen((o) => !o)}>
                {/* Rueda */}
                <Trozo py={{ base: 6, md: 8 }}>
                  <Flex direction="column" align="center">
                    <CartaAstral3D color={astrologiaTxt} carta={carta} onSaberMas={(k) => setSaberMasKey(k)} />
                  </Flex>
                </Trozo>

                {/* Planetas: pulsa uno para leer su arquetipo */}
                <Trozo>
                  <Text color="#ffffff" fontWeight="700" fontSize="sm" letterSpacing="0.1em" textTransform="uppercase"
                        mb={1} style={{ textShadow: GLOW }}>
                    Sus planetas
                  </Text>
                  <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" mb={3}>
                    Pulsa uno para leer su arquetipo (el mismo texto que lee ella).
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {cuerposCarta.map((c) => {
                      const pos = posicionDe(c.key)!;
                      return (
                        <Flex as="button" key={c.key} onClick={() => setSaberMasKey(c.key)}
                              align="center" gap={2} px={3} py={1.5} borderRadius="full"
                              bg="rgba(0,0,0,0.35)" border={`1px solid ${astrologiaTxt}55`}
                              cursor="pointer" transition="all 0.18s"
                              _hover={{ borderColor: astrologiaTxt, boxShadow: GLOW_CAJA_HOVER }}>
                          <Glifo symbol={c.symbol} color={c.color} size={18} />
                          <Text color="#ffffff" fontSize="sm" fontWeight="700" style={{ textShadow: GLOW }}>{c.label}</Text>
                          {pos.signo && (
                            <>
                              <Text color="rgba(255,255,255,0.45)" fontSize="xs">·</Text>
                              <GlifoSigno nombre={pos.signo} color="#ffffff" size={16} />
                              <Text color="rgba(255,255,255,0.9)" fontSize="sm">{pos.signo}</Text>
                            </>
                          )}
                          {c.conCasa && pos.casa != null && (
                            <>
                              <Text color="rgba(255,255,255,0.45)" fontSize="xs">·</Text>
                              <Text color="rgba(255,255,255,0.9)" fontSize="sm">
                                Casa {NUMEROS_ROMANOS[pos.casa - 1]}
                              </Text>
                            </>
                          )}
                        </Flex>
                      );
                    })}
                  </Flex>
                </Trozo>

                {/* Casas: signo en la cúspide y su regente */}
                <Trozo>
                  <Text color="#ffffff" fontWeight="700" fontSize="sm" letterSpacing="0.1em" textTransform="uppercase"
                        mb={3} style={{ textShadow: GLOW }}>
                    Sus casas
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                      const info = cusps.length ? infoCasa(cusps, n) : null;
                      return (
                        <Flex key={n} align="center" gap={2} px={3} py={1.5} borderRadius="full"
                              bg="rgba(0,0,0,0.3)" border="1px solid rgba(255,255,255,0.2)">
                          <Text color="#ffffff" fontSize="sm" fontWeight="700" style={{ textShadow: GLOW }}>
                            {NUMEROS_ROMANOS[n - 1]}
                          </Text>
                          {info && (
                            <>
                              <GlifoSigno nombre={info.signo.name} color="#ffffff" size={16} />
                              <Text color="rgba(255,255,255,0.9)" fontSize="sm">{info.signo.name}</Text>
                              {info.regente && (
                                <>
                                  <Text color="rgba(255,255,255,0.45)" fontSize="xs">reg.</Text>
                                  <Glifo symbol={info.regente.symbol} color={info.regente.color} size={16} />
                                </>
                              )}
                            </>
                          )}
                        </Flex>
                      );
                    })}
                  </Flex>
                </Trozo>
              </Desplegable>
            )}

            {/* ── Retos (estrellas del cielo del usuario) ── */}
            {/* Plegable como las Casas y los Aspectos: con muchas estrellas el
                box se hacía larguísimo. El botón de añadir va en `accion`, así
                que sigue funcionando esté plegado o no (y si está plegado, abre
                la sección para que se vea la estrella nueva). */}
            <Desplegable
              titulo="Puntos clave"
              count={retos.length}
              open={retosOpen}
              onToggle={() => setRetosOpen((o) => !o)}
              accion={
                <Box as="button"
                     onClick={() => {
                       setRetos((p) => [...p, { id: genRetoId(), titulo: "", texto: "" }]);
                       setRetosOpen(true);
                     }}
                     px={4} py={1.5} borderRadius="full" border={`1px solid ${astrologiaTxt}88`}
                     color="#ffffff" fontWeight="700" fontSize="sm" letterSpacing="0.04em" flexShrink={0}
                     cursor="pointer" boxShadow={GLOW_CAJA} _hover={{ boxShadow: GLOW_CAJA_HOVER }} transition="all 0.2s"
                     style={{ textShadow: GLOW }}>
                  + Añadir punto clave
                </Box>
              }
            >
              <Trozo py={{ base: 3, md: 4 }}>
                <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic">
                  Cada punto clave aparece como una estrella en el cielo del usuario; al pulsarla lee su texto. Mínimo 1, y cada uno con título y descripción.
                </Text>
                {retos.length === 0 && (
                  <Text color="rgba(255,255,255,0.55)" fontStyle="italic" fontSize="sm" mt={3}>Sin puntos clave todavía. Añade el primero.</Text>
                )}
              </Trozo>

              {retos.length > 0 && (
                <Box position="relative" zIndex={1}>
                  <Flex direction="column" gap={0}>
                    {retos.map((r, i) => (
                      <Trozo key={r.id}>
                        <Flex align="center" gap={2} mb={1.5} wrap="wrap">
                          <Text color="#ffffff" fontWeight="700" fontSize="sm" style={{ textShadow: GLOW }}>Estrella {i + 1}</Text>
                          <Box as="button" ml="auto"
                               onClick={() => setRetos((p) => p.filter((x) => x.id !== r.id))}
                               color="rgba(255,180,180,0.9)" fontSize="xs" cursor="pointer"
                               _hover={{ color: "#ff8a8a" }}>
                            ✕ Borrar
                          </Box>
                        </Flex>
                        <Input
                          value={r.titulo}
                          onChange={(e) => setRetos((p) => p.map((x) => x.id === r.id ? { ...x, titulo: e.target.value } : x))}
                          placeholder="Título del reto…"
                          mb={2}
                          bg="rgba(0,0,0,0.35)" border="1px solid rgba(255,255,255,0.22)" color="white" borderRadius="lg"
                          fontFamily="'EB Garamond', serif" _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                          _focus={{ borderColor: turquesa, boxShadow: `0 0 0 1px ${turquesa}55` }}
                        />
                        <Textarea
                          value={r.texto}
                          onChange={(e) => setRetos((p) => p.map((x) => x.id === r.id ? { ...x, texto: e.target.value } : x))}
                          placeholder="Texto del reto…"
                          rows={4}
                          bg="rgba(0,0,0,0.3)" border="1px solid rgba(255,255,255,0.22)" color="white" borderRadius="lg"
                          fontFamily="'EB Garamond', serif" _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                          _focus={{ borderColor: turquesa, boxShadow: `0 0 0 1px ${turquesa}55` }}
                        />
                      </Trozo>
                    ))}
                  </Flex>
                </Box>
              )}
            </Desplegable>

            {!carta ? (
              <Box bg="rgba(0,0,0,0.32)" borderRadius="xl" border="1px solid rgba(255,255,255,0.18)" p={7}>
                <Text color="rgba(255,200,200,0.9)" fontStyle="italic">
                  Este usuario aún no tiene carta natal calculada (no ha pedido su carta o faltan datos de nacimiento).
                </Text>
              </Box>
            ) : (
              <>
                {/* ── CASAS (desplegable) ── */}
                <Desplegable titulo="Las 12 Casas" count={12} open={casasOpen} onToggle={() => setCasasOpen((o) => !o)}>
                  <Flex direction="column" gap={0}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                      const info = cusps.length ? infoCasa(cusps, n) : null;
                      return (
                        <Trozo key={n}>
                          <Flex align="center" gap={2} mb={1.5} wrap="wrap">
                            <Text color="#ffffff" fontWeight="700" fontSize="md" style={{ textShadow: GLOW }}>Casa {NUMEROS_ROMANOS[n - 1]}</Text>
                            {info && (
                              <>
                                <Text color="rgba(255,255,255,0.5)">·</Text>
                                <GlifoSigno nombre={info.signo.name} color="#ffffff" size={18} />
                                <Text color="#ffffff" fontSize="sm" style={{ textShadow: GLOW }}>{info.signo.name}</Text>
                                {info.regente && (
                                  <Flex align="center" gap={1} ml={1}>
                                    <Text color="rgba(255,255,255,0.5)" fontSize="xs">reg.</Text>
                                    <Glifo symbol={info.regente.symbol} color={info.regente.color} size={18} />
                                  </Flex>
                                )}
                              </>
                            )}
                          </Flex>
                          <Textarea
                            value={casas[String(n)] ?? ""}
                            onChange={(e) => setCasas((p) => ({ ...p, [String(n)]: e.target.value }))}
                            placeholder={`Lectura de la Casa ${NUMEROS_ROMANOS[n - 1]}…`}
                            rows={3}
                            bg="rgba(0,0,0,0.3)" border="1px solid rgba(255,255,255,0.22)" color="white" borderRadius="lg"
                            fontFamily="'EB Garamond', serif" _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                            _focus={{ borderColor: turquesa, boxShadow: `0 0 0 1px ${turquesa}55` }}
                          />
                        </Trozo>
                      );
                    })}
                  </Flex>
                </Desplegable>

                {/* ── ASPECTOS (desplegable) ── */}
                {/* Agrupados por planeta EXACTAMENTE igual que la página del usuario
                    (/metodo/astrologia/aspectos): cada aspecto une dos planetas, así
                    que aparece en los dos boxes (el del planeta A y el del B). La
                    lectura se comparte por `aspectoKey`, de modo que editarla en un
                    sitio la actualiza en el otro. Así el admin muestra los MISMOS
                    aspectos que ve el usuario, sin que falte ninguno. */}
                <Desplegable titulo="Los aspectos" count={listaAspectos.length} open={aspectosOpen} onToggle={() => setAspectosOpen((o) => !o)}>
                  <Flex direction="column" gap={0}>
                    {gruposAspectosPorPlaneta.map(({ cuerpo, items }) => (
                      <React.Fragment key={cuerpo.key}>
                        {/* Cabecera del planeta: su propio trozo, bajito */}
                        <Trozo py={{ base: 2.5, md: 3 }}>
                          <Flex align="center" gap={2}>
                            <Glifo symbol={cuerpo.symbol} color={cuerpo.color} size={22} />
                            <Text color="#ffffff" fontSize="lg" fontWeight="700" style={{ textShadow: GLOW }}>{cuerpo.label}</Text>
                          </Flex>
                        </Trozo>
                        {items.map(({ aspecto: a, otro }, idx) => {
                          const co = cuerpoByKey(otro);
                          const key = aspectoKey(a);
                          return (
                            <Trozo key={`${cuerpo.key}-${key}-${idx}`} px={{ base: 5, md: 9 }}>
                              <Flex align="center" gap={2} mb={1.5} wrap="wrap">
                                <Text color="#ffffff" fontSize="md" style={{ textShadow: GLOW }}>{ASPECTO_SYMBOL[a.tipo]}{"︎"}</Text>
                                {co && <Glifo symbol={co.symbol} color={co.color} size={18} />}
                                <Text color="#ffffff" fontSize="sm" ml={1} style={{ textShadow: GLOW }}>
                                  {ASPECTO_LABEL[a.tipo]} {co?.label}
                                </Text>
                              </Flex>
                              <Textarea
                                value={aspectos[key] ?? ""}
                                onChange={(e) => setAspectos((p) => ({ ...p, [key]: e.target.value }))}
                                placeholder={`Lectura del aspecto ${cuerpo.label} ${ASPECTO_LABEL[a.tipo].toLowerCase()} ${co?.label}…`}
                                rows={3}
                                bg="rgba(0,0,0,0.3)" border="1px solid rgba(255,255,255,0.22)" color="white" borderRadius="lg"
                                fontFamily="'EB Garamond', serif" _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                                _focus={{ borderColor: turquesa, boxShadow: `0 0 0 1px ${turquesa}55` }}
                              />
                            </Trozo>
                          );
                        })}
                      </React.Fragment>
                    ))}
                    {listaAspectos.length === 0 && (
                      <Trozo>
                        <Text color="rgba(255,255,255,0.6)" fontStyle="italic" fontSize="sm">Esta carta no tiene aspectos calculados.</Text>
                      </Trozo>
                    )}
                  </Flex>
                </Desplegable>
              </>
            )}
          </Box>
      </Flex>

      {/* Arquetipo del cuerpo pulsado: el MISMO popup que lee la persona. */}
      <SaberMasModal
        isOpen={!!cuerpoSaberMas}
        onClose={() => setSaberMasKey(null)}
        cuerpo={cuerpoSaberMas ?? null}
        signo={posSaberMas?.signo}
        casa={posSaberMas?.casa}
      />

      <SiteFooter />
    </Box>
  );
}
