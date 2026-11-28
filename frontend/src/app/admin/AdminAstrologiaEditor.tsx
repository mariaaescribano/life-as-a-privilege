import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea, Input } from "@chakra-ui/react";
import { AstrologiaLoading } from "../../components/metodo/comicLoaders";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Glifo, GlifoSigno } from "../../components/metodo/Glifo";
import { cuerpoByKey, CUERPOS, ZODIAC_SIGNS, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { CartaAstral3D } from "../../components/metodo/CartaAstral3D/CartaAstral3D";
import { SaberMasModal } from "../../components/metodo/Planetas";
import type { CartaNatal, Aspecto } from "../../components/metodo/CartaAstral3D/types";
import {
  infoCasa,
  NUMEROS_ROMANOS,
  ASPECTO_LABEL,
  ASPECTO_SYMBOL,
  aspectoKey,
} from "../../components/metodo/casasAspectos";
import { API_URL, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";

const T = "#3B2418";
const FOCO = { outline: "2px solid #3B2418cc", outlineOffset: "2px" } as const;

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
function Trozo({ children, px = { base: 4, md: 6 }, py = { base: 4, md: 5 }, velo }: {
  children: React.ReactNode;
  px?: any;
  py?: any;
  /**
   * Velo oscuro sobre la foto. Normalmente NO se usa: la foto va tal cual.
   * Hace falta solo debajo de la RUEDA 3D, porque ese canvas es transparente y
   * no trae cielo propio — solo oscurece un 15% lo que haya detrás (ver el
   * comentario en CartaAstral3D). Sin velo, la nebulosa a plena luz se cuela
   * entre los trazos de la carta y ese 15% de negro parece un manchón.
   */
  velo?: string;
}) {
  return (
    <Box position="relative" overflow="hidden" w="100%">
      {velo && <DisciplinaBgLayer nom={astrologiaNom} borderRadius="0" overlay={velo} />}
      {/* Separación horizontal con lo que va justo encima */}
      <Box position="absolute" top={0} left={0} right={0} h="1px" zIndex={2}
           bgGradient="linear(to-r, transparent, #3B241855, transparent)" />
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
         px={{ base: 4, md: 5 }} py={3} borderRadius="xl" border="1.5px solid #3B2418"
         cursor={enviando ? "wait" : "pointer"} opacity={enviando ? 0.7 : 1}
         _hover={{ bg: "#3B241814" }} _focusVisible={FOCO}
         transition="all 0.2s">
      <Flex position="relative" zIndex={1} align="flex-start" gap={2.5}>
        {/* Sobre: deja claro que esto MANDA un correo, no guarda */}
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="18px" h="18px"
             fill="#3B2418" flexShrink={0} mt="2px">
          <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" />
        </Box>
        <Box minW={0}>
          <Text color="#3B2418" fontWeight="700" fontSize="sm" lineHeight="1.35">
            {enviando ? "Enviando…" : label}
          </Text>
          <Text color={enviado ? "#3B2418" : "#3B2418b3"} fontSize="xs"
                fontStyle="italic" mt={1}>
            {enviado ? `Enviado el ${new Date(enviado).toLocaleString("es-ES")}` : "Sin enviar"}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

/** Meses para el desplegable de la fecha de nacimiento. */
const MESES_NAC = [
  { num: "01", nombre: "Enero" }, { num: "02", nombre: "Febrero" }, { num: "03", nombre: "Marzo" },
  { num: "04", nombre: "Abril" }, { num: "05", nombre: "Mayo" }, { num: "06", nombre: "Junio" },
  { num: "07", nombre: "Julio" }, { num: "08", nombre: "Agosto" }, { num: "09", nombre: "Septiembre" },
  { num: "10", nombre: "Octubre" }, { num: "11", nombre: "Noviembre" }, { num: "12", nombre: "Diciembre" },
];

/** Estilo común de los campos (nuevo estilo: beige claro, borde turquesa oscuro). */
const campoNac = {
  bg: "#F7EBD9",
  border: "1.5px solid #3B241866",
  color: "#3B2418",
  borderRadius: "lg",
  fontFamily: "'EB Garamond', serif",
  _placeholder: { color: "#3B24188c" },
  _hover: { borderColor: "#3B2418aa" },
  _focus: { borderColor: "#3B2418", boxShadow: "none", outline: "none" },
  _focusVisible: { borderColor: "#3B2418", boxShadow: "none", outline: "none" },
} as const;

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
    <Box position="relative" borderRadius="xl" border="1.5px solid #3B2418" mb={5} overflow="hidden">
      <Flex position="relative" zIndex={1} align="center" gap={3} px={{ base: 4, md: 6 }} py={4}
            _hover={{ bg: "#3B24180d" }} transition="background 0.15s">
        <Flex as="button" onClick={onToggle} flex="1" minW={0} align="center" textAlign="left" cursor="pointer">
          <Text color="#3B2418" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.04em">
            {titulo}
            {count != null && <Box as="span" color="#3B2418" fontSize="sm"> ({count})</Box>}
          </Text>
        </Flex>
        {accion}
        <Box as="button" onClick={onToggle} flexShrink={0} cursor="pointer"
             aria-label={open ? `Plegar ${titulo}` : `Desplegar ${titulo}`}>
          <Chevron open={open} color="#3B2418" />
        </Box>
      </Flex>
      {/* Sin padding: el cuerpo son `Trozo`s a todo el ancho, cada uno con su
          propia foto y su raya de separación. */}
      {open && <Box position="relative" zIndex={1}>{children}</Box>}
    </Box>
  );
}

export default function AdminAstrologiaEditor() {
  const { userId } = useParams<{ userId: string }>();
  const { verificando } = useAdminGuard();

  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const [casas, setCasas] = useState<Record<string, string>>({});
  const [aspectos, setAspectos] = useState<Record<string, string>>({});
  const [sintesis, setSintesis] = useState("");
  const [bienvenida, setBienvenida] = useState("");
  const [areas, setAreas] = useState<Record<string, string>>({});
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
  // Datos de nacimiento, editables desde aquí. La fecha va en tres campos (como
  // en el formulario de la persona) porque un date picker en algunos idiomas
  // muestra MM/DD y se confunde con DD/MM: con la hora de nacimiento, un día
  // mal leído cambia la carta entera.
  const [nac, setNac] = useState({ dia: "", mes: "", anio: "", hora: "", pais: "", lugar: "", region: "" });
  const [nacOpen, setNacOpen] = useState(true);
  const [guardandoNac, setGuardandoNac] = useState(false);
  const [nacMsg, setNacMsg] = useState<string | null>(null);
  const [nacError, setNacError] = useState<string | null>(null);
  // Las tres secciones de escritura arrancan PLEGADAS: abiertas, la página salía
  // kilométrica y había que scrollear un rato para ver qué hay. Se abre la que
  // se vaya a tocar.
  const [retosOpen, setRetosOpen] = useState(false);
  const [casasOpen, setCasasOpen] = useState(false);
  const [aspectosOpen, setAspectosOpen] = useState(false);
  const [sintesisOpen, setSintesisOpen] = useState(false);
  const [bienvenidaOpen, setBienvenidaOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
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
            data?: { aviso_proceso_at?: string; aviso_leida_at?: string; sintesis?: string; bienvenida?: string; areas?: Record<string, string> };
            fecha_nacimiento?: string | null;
            hora_nacimiento?: string | null;
            pais?: string | null;
            lugar?: string | null;
            region?: string | null;
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
        setSintesis(typeof rowRes.data?.data?.sintesis === "string" ? rowRes.data.data.sintesis : "");
        setBienvenida(typeof rowRes.data?.data?.bienvenida === "string" ? rowRes.data.data.bienvenida : "");
        setAreas(rowRes.data?.data?.areas && typeof rowRes.data.data.areas === "object" ? rowRes.data.data.areas : {});
        setAvisadoAt({
          proceso: rowRes.data?.data?.aviso_proceso_at,
          leida: rowRes.data?.data?.aviso_leida_at,
        });
        // Datos de nacimiento: la fecha viene como AAAA-MM-DD y aquí se edita
        // partida en tres campos.
        const f = /^(\d{4})-(\d{2})-(\d{2})/.exec(rowRes.data?.fecha_nacimiento ?? "");
        setNac({
          dia: f ? f[3] : "",
          mes: f ? f[2] : "",
          anio: f ? f[1] : "",
          hora: (rowRes.data?.hora_nacimiento ?? "").slice(0, 5),
          pais: rowRes.data?.pais ?? "",
          lugar: rowRes.data?.lugar ?? "",
          region: rowRes.data?.region ?? "",
        });
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
  }, [verificando, userId]);

  /**
   * Guarda los datos de nacimiento y recalcula la carta. Al terminar recarga la
   * carta para que la rueda y las casas del panel muestren ya lo nuevo (si no,
   * se seguiría viendo la carta vieja y parecería que no ha hecho nada).
   */
  const guardarNacimiento = async () => {
    if (!userId) return;
    setNacMsg(null);
    setNacError(null);

    const { dia, mes, anio, hora, pais, lugar, region } = nac;
    if (!dia || !mes || !anio || !hora) {
      setNacError("Faltan la fecha completa y la hora.");
      return;
    }
    if (!/^\d{1,2}:\d{2}$/.test(hora)) {
      setNacError("La hora va en formato 24h, por ejemplo 04:30.");
      return;
    }
    const d = Number(dia), a = Number(anio);
    if (d < 1 || d > 31 || a < 1900 || a > 2100) {
      setNacError("Revisa el día y el año.");
      return;
    }
    if (!lugar.trim() || !pais.trim()) {
      setNacError("Hacen falta al menos la ciudad y el país para localizar el lugar.");
      return;
    }

    setGuardandoNac(true);
    try {
      const res = await axios.patch<{ success: boolean; message?: string; recalculada: boolean }>(
        `${API_URL}/metodo-astrologia/admin/${userId}/nacimiento`,
        {
          fecha_nacimiento: `${anio}-${mes}-${String(d).padStart(2, "0")}`,
          hora_nacimiento: hora.padStart(5, "0"),
          pais: pais.trim(),
          lugar: lugar.trim(),
          region: region.trim(),
        },
        { headers: adminHeaders() },
      );

      if (!res.data?.success) {
        setNacError(res.data?.message ?? "No se pudo guardar.");
        return;
      }
      // La carta nueva, para verla al momento en el panel.
      const cartaRes = await axios.get<CartaNatal | null>(
        `${API_URL}/metodo-astrologia/carta-natal/${userId}`,
        { headers: adminHeaders() },
      );
      setCarta(cartaRes.data ?? null);
      setNacMsg(res.data.recalculada ? "Guardado y carta recalculada." : (res.data.message ?? "Guardado."));
      if (!res.data.recalculada) setNacError(res.data.message ?? null);
      setTimeout(() => setNacMsg(null), 6000);
    } catch (e: any) {
      setNacError(e?.response?.data?.message ?? "No se pudo guardar.");
    } finally {
      setGuardandoNac(false);
    }
  };

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
          sintesis,
          bienvenida,
          areas,
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
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
          <Box w="100%" maxW="820px">
            {/* header de disciplina con su imagen */}
            <AdminDisciplinaHeader disc={disc} fotoTalCual
                                   subtitle={`${nombre || "Usuario"}${email ? ` · ${email}` : ""}`} />

            {/* barra de guardar */}
            <Flex justify="flex-end" align="center" gap={3} mb={5} wrap="wrap">
              {errorRetos && (
                <Text color="#b3261e" fontSize="sm" fontStyle="italic">
                  {errorRetos}
                </Text>
              )}
              {guardado && (
                <Flex align="center" gap={1.5} color="#3B2418" fontSize="sm" fontStyle="italic">
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill="#3B2418">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                  Guardado
                </Flex>
              )}
              <Box as="button" onClick={guardando ? undefined : guardar}
                   position="relative" overflow="hidden"
                   px={8} py={2.5} borderRadius="full" border="1.5px solid #3B2418"
                   cursor={guardando ? "wait" : "pointer"} opacity={guardando ? 0.7 : 1}
                   bg="#3B2418" _hover={{ bg: "#5a3624" }} _focusVisible={FOCO} transition="all 0.2s">
                <Text position="relative" zIndex={1} color="#F0DCC0" fontWeight="700" letterSpacing="0.06em">
                  {guardando ? "Guardando…" : "Guardar"}
                </Text>
              </Box>
            </Flex>

            {/* ── Correos a la persona ── (DESACTIVADO: ya no hacen falta; el box y los botones se conservan
                  aquí debajo. Para volver a activarlo, cambia `false &&` por `true &&`.)
                  ──
                  Aparte de «Guardar» a propósito: guardar la lectura no manda
                  nada. El correo de datos registrados sale solo, al enviar ella
                  sus datos; estos dos se mandan desde aquí, cuando tú quieras. */}
            {false && (
              <Box position="relative" borderRadius="xl" border="1.5px solid #3B2418" mb={5} overflow="hidden">
                <Box position="relative" zIndex={1} p={{ base: 4, md: 5 }}>
                  <Text color="#3B2418" fontWeight="700" fontSize="md">
                    Avisar por email
                  </Text>
                  <Text color="#3B2418b3" fontSize="xs" fontStyle="italic" mt={1}>
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
                    <Text color="#b3261e" fontSize="sm" fontStyle="italic" mt={3}>
                      {avisoError}
                    </Text>
                  )}
                  {avisoMsg && (
                    <Flex align="center" gap={1.5} color="#3B2418" fontSize="sm" fontStyle="italic" mt={3}
                         >
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill="#3B2418">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </Box>
                      {avisoMsg}
                    </Flex>
                  )}
                </Trozo>
              </Box>
            )}

            {/* ── DATOS DE NACIMIENTO (editables) ──
                  Antes solo podía cambiarlos la propia persona en el paso 1 de su
                  recorrido. Al guardar aquí se recalcula su carta entera, pero NO
                  se le manda ningún correo: los avisos son los botones de arriba. */}
            <Desplegable titulo="Datos de nacimiento" open={nacOpen} onToggle={() => setNacOpen((o) => !o)}>
              <Trozo>
                <Text color="#3B2418b3" fontSize="xs" fontStyle="italic" mb={4}>
                  Con esto se calcula toda su carta. Al guardar se recalcula sola (posiciones,
                  casas y aspectos) y no se le avisa por correo. Sus lecturas escritas se
                  mantienen, pero si cambia la hora pueden cambiarle las casas y los aspectos:
                  revisa después que las lecturas sigan cuadrando.
                </Text>

                <Flex gap={3} wrap="wrap" mb={3}>
                  <Box flex="1 1 90px" minW="80px">
                    <Text color="#3B2418" fontSize="xs" mb={1}>Día</Text>
                    <Input
                      value={nac.dia}
                      onChange={(e) => setNac((p) => ({ ...p, dia: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
                      placeholder="27" {...campoNac}
                    />
                  </Box>
                  <Box flex="1 1 120px" minW="110px">
                    <Text color="#3B2418" fontSize="xs" mb={1}>Mes</Text>
                    <Box as="select"
                         value={nac.mes}
                         onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNac((p) => ({ ...p, mes: e.target.value }))}
                         w="100%" px={3} py="9px" cursor="pointer" {...campoNac}>
                      <option value="">—</option>
                      {MESES_NAC.map((m) => (
                        <option key={m.num} value={m.num} style={{ background: "#F7EBD9", color: "#3B2418" }}>{m.nombre}</option>
                      ))}
                    </Box>
                  </Box>
                  <Box flex="1 1 110px" minW="90px">
                    <Text color="#3B2418" fontSize="xs" mb={1}>Año</Text>
                    <Input
                      value={nac.anio}
                      onChange={(e) => setNac((p) => ({ ...p, anio: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="1998" {...campoNac}
                    />
                  </Box>
                  <Box flex="1 1 110px" minW="90px">
                    <Text color="#3B2418" fontSize="xs" mb={1}>Hora (24h)</Text>
                    <Input
                      value={nac.hora}
                      onChange={(e) => setNac((p) => ({ ...p, hora: e.target.value.slice(0, 5) }))}
                      placeholder="04:30" {...campoNac}
                    />
                  </Box>
                </Flex>

                <Flex gap={3} wrap="wrap" mb={4}>
                  <Box flex="1 1 200px">
                    <Text color="#3B2418" fontSize="xs" mb={1}>Ciudad / pueblo</Text>
                    <Input value={nac.lugar} onChange={(e) => setNac((p) => ({ ...p, lugar: e.target.value }))}
                           placeholder="Alicante" {...campoNac} />
                  </Box>
                  <Box flex="1 1 200px">
                    <Text color="#3B2418" fontSize="xs" mb={1}>Región / provincia</Text>
                    <Input value={nac.region} onChange={(e) => setNac((p) => ({ ...p, region: e.target.value }))}
                           placeholder="Comunidad Valenciana" {...campoNac} />
                  </Box>
                  <Box flex="1 1 200px">
                    <Text color="#3B2418" fontSize="xs" mb={1}>País</Text>
                    <Input value={nac.pais} onChange={(e) => setNac((p) => ({ ...p, pais: e.target.value }))}
                           placeholder="España" {...campoNac} />
                  </Box>
                </Flex>

                <Flex align="center" gap={3} wrap="wrap">
                  <Box as="button"
                       onClick={guardandoNac ? undefined : () => void guardarNacimiento()}
                       px={6} py={2} borderRadius="full" border="1.5px solid #3B2418"
                       color="#3B2418" fontWeight="700" fontSize="sm" letterSpacing="0.04em"
                       cursor={guardandoNac ? "wait" : "pointer"} opacity={guardandoNac ? 0.7 : 1}
                       _hover={{ bg: "#3B241814" }} _focusVisible={FOCO} transition="all 0.2s"
                      >
                    {guardandoNac ? "Recalculando…" : "Guardar y recalcular la carta"}
                  </Box>
                  {nacMsg && (
                    <Text color="#3B2418" fontSize="sm" fontStyle="italic">{nacMsg}</Text>
                  )}
                  {nacError && (
                    <Text color="#b3261e" fontSize="sm" fontStyle="italic">{nacError}</Text>
                  )}
                </Flex>
              </Trozo>
            </Desplegable>

            {/* ── CONSULTA: la carta de la persona ──
                  La MISMA rueda que ve ella en su recorrido, más sus planetas y
                  sus casas en corto. Sirve para tener la carta delante mientras
                  se escribe la lectura, y para leer los arquetipos (el popup
                  «Saber más» es el mismo que lee ella). Es solo consulta: aquí
                  no se edita nada. */}
            {carta && (
              <Desplegable titulo={`La carta de ${nombre || "esta persona"}`} open={cartaOpen}
                           onToggle={() => setCartaOpen((o) => !o)}>
                {/* Rueda. Lleva velo: es el cielo sobre el que se dibuja la carta,
                    no una foto decorativa (ver el prop `velo` de Trozo). */}
                <Trozo py={{ base: 6, md: 8 }} velo="rgba(8,13,30,0.45)">
                  {/* El `& canvas` es a prueba de ZOOM del navegador, y solo se
                      aplica aquí (el de la página del recorrido no se toca).
                      three.js llama a setSize() con el tamaño MEDIDO y eso
                      escribe el ancho del <canvas> en píxeles CSS; dentro de una
                      página con zoom, esos píxeles vuelven a escalarse, así que
                      el zoom se aplicaba dos veces (al 80% → 0,64) y la rueda
                      salía pequeña en medio de su disco. Forzarla al 100% de su
                      caja lo deja igual a cualquier zoom, y al 100% no cambia
                      nada porque ahí ya coincidían. */}
                  <Flex direction="column" align="center"
                        sx={{ "& canvas": { width: "100% !important", height: "100% !important" } }}>
                    <CartaAstral3D color={astrologiaTxt} carta={carta} onSaberMas={(k) => setSaberMasKey(k)} />
                  </Flex>
                </Trozo>

                {/* Planetas: pulsa uno para leer su arquetipo */}
                <Trozo>
                  <Text color="#3B2418" fontWeight="700" fontSize="sm" letterSpacing="0.1em" textTransform="uppercase"
                        mb={1}>
                    Sus planetas
                  </Text>
                  <Text color="#3B2418b3" fontSize="xs" fontStyle="italic" mb={3}>
                    Pulsa uno para leer su arquetipo (el mismo texto que lee ella).
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {cuerposCarta.map((c) => {
                      const pos = posicionDe(c.key)!;
                      return (
                        <Flex as="button" key={c.key} onClick={() => setSaberMasKey(c.key)}
                              align="center" gap={2} px={3} py={1.5} borderRadius="full"
                              border="1.5px solid #3B241855"
                              cursor="pointer" transition="all 0.18s"
                              _hover={{ borderColor: T }} _focusVisible={FOCO}>
                          <Glifo symbol={c.symbol} color={c.color} size={18} />
                          <Text color="#3B2418" fontSize="sm" fontWeight="700">{c.label}</Text>
                          {pos.signo && (
                            <>
                              <Text color="#3B241899" fontSize="xs">·</Text>
                              <GlifoSigno nombre={pos.signo} color="#3B2418" size={16} />
                              <Text color="#3B2418" fontSize="sm">{pos.signo}</Text>
                            </>
                          )}
                          {c.conCasa && pos.casa != null && (
                            <>
                              <Text color="#3B241899" fontSize="xs">·</Text>
                              <Text color="#3B2418" fontSize="sm">
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
                  <Text color="#3B2418" fontWeight="700" fontSize="sm" letterSpacing="0.1em" textTransform="uppercase"
                        mb={3}>
                    Sus casas
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                      const info = cusps.length ? infoCasa(cusps, n) : null;
                      return (
                        <Flex key={n} align="center" gap={2} px={3} py={1.5} borderRadius="full"
                              border="1.5px solid #3B241855">
                          <Text color="#3B2418" fontSize="sm" fontWeight="700">
                            {NUMEROS_ROMANOS[n - 1]}
                          </Text>
                          {info && (
                            <>
                              <GlifoSigno nombre={info.signo.name} color="#3B2418" size={16} />
                              <Text color="#3B2418" fontSize="sm">{info.signo.name}</Text>
                              {info.regente && (
                                <>
                                  <Text color="#3B241899" fontSize="xs">reg.</Text>
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
                     px={4} py={1.5} borderRadius="full" border="1.5px solid #3B2418"
                     color="#3B2418" fontWeight="700" fontSize="sm" letterSpacing="0.04em" flexShrink={0}
                     cursor="pointer" _hover={{ bg: "#3B241814" }} _focusVisible={FOCO} transition="all 0.2s"
                    >
                  + Añadir punto clave
                </Box>
              }
            >
              <Trozo py={{ base: 3, md: 4 }}>
                <Text color="#3B2418b3" fontSize="xs" fontStyle="italic">
                  Cada punto clave aparece como una estrella en el cielo del usuario; al pulsarla lee su texto. Mínimo 1, y cada uno con título y descripción.
                </Text>
                {retos.length === 0 && (
                  <Text color="#3B2418b3" fontStyle="italic" fontSize="sm" mt={3}>Sin puntos clave todavía. Añade el primero.</Text>
                )}
              </Trozo>

              {retos.length > 0 && (
                <Box position="relative" zIndex={1}>
                  <Flex direction="column" gap={0}>
                    {retos.map((r, i) => (
                      <Trozo key={r.id}>
                        <Flex align="center" gap={2} mb={1.5} wrap="wrap">
                          <Text color="#3B2418" fontWeight="700" fontSize="sm">Estrella {i + 1}</Text>
                          <Box as="button" ml="auto"
                               onClick={() => setRetos((p) => p.filter((x) => x.id !== r.id))}
                               color="#b3261e" fontSize="xs" cursor="pointer"
                               _hover={{ color: "#8f1d17" }}>
                            ✕ Borrar
                          </Box>
                        </Flex>
                        <Input
                          value={r.titulo}
                          onChange={(e) => setRetos((p) => p.map((x) => x.id === r.id ? { ...x, titulo: e.target.value } : x))}
                          placeholder="Título del reto…"
                          mb={2}
                          {...campoNac}
                        />
                        <Textarea
                          value={r.texto}
                          onChange={(e) => setRetos((p) => p.map((x) => x.id === r.id ? { ...x, texto: e.target.value } : x))}
                          placeholder="Texto del reto…"
                          rows={4}
                          {...campoNac}
                        />
                      </Trozo>
                    ))}
                  </Flex>
                </Box>
              )}
            </Desplegable>

            {!carta ? (
              <Box borderRadius="xl" border="1.5px solid #3B241855" p={7}>
                <Text color="#b3261e" fontStyle="italic">
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
                            <Text color="#3B2418" fontWeight="700" fontSize="md">Casa {NUMEROS_ROMANOS[n - 1]}</Text>
                            {info && (
                              <>
                                <Text color="#3B2418b3">·</Text>
                                <GlifoSigno nombre={info.signo.name} color="#3B2418" size={18} />
                                <Text color="#3B2418" fontSize="sm">{info.signo.name}</Text>
                                {info.regente && (
                                  <Flex align="center" gap={1} ml={1}>
                                    <Text color="#3B2418b3" fontSize="xs">reg.</Text>
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
                            {...campoNac}
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
                            <Text color="#3B2418" fontSize="lg" fontWeight="700">{cuerpo.label}</Text>
                          </Flex>
                        </Trozo>
                        {items.map(({ aspecto: a, otro }, idx) => {
                          const co = cuerpoByKey(otro);
                          const key = aspectoKey(a);
                          return (
                            <Trozo key={`${cuerpo.key}-${key}-${idx}`} px={{ base: 5, md: 9 }}>
                              {/* El aspecto se lee entero de izquierda a derecha:
                                  ☉ △ ♄ «Sol trígono Saturno». Antes empezaba por
                                  el símbolo del aspecto y faltaba el planeta del
                                  que va el box, así que al bajar por la lista se
                                  perdía de vista de quién se estaba hablando. */}
                              <Flex align="center" gap={2} mb={1.5} wrap="wrap">
                                <Glifo symbol={cuerpo.symbol} color={cuerpo.color} size={18} />
                                <Text color="#3B2418" fontSize="md">{ASPECTO_SYMBOL[a.tipo]}{"︎"}</Text>
                                {co && <Glifo symbol={co.symbol} color={co.color} size={18} />}
                                <Text color="#3B2418" fontSize="sm" ml={1}>
                                  {cuerpo.label} {ASPECTO_LABEL[a.tipo].toLowerCase()} {co?.label}
                                </Text>
                              </Flex>
                              <Textarea
                                value={aspectos[key] ?? ""}
                                onChange={(e) => setAspectos((p) => ({ ...p, [key]: e.target.value }))}
                                placeholder={`Lectura del aspecto ${cuerpo.label} ${ASPECTO_LABEL[a.tipo].toLowerCase()} ${co?.label}…`}
                                rows={3}
                                {...campoNac}
                              />
                            </Trozo>
                          );
                        })}
                      </React.Fragment>
                    ))}
                    {listaAspectos.length === 0 && (
                      <Trozo>
                        <Text color="#3B2418b3" fontStyle="italic" fontSize="sm">Esta carta no tiene aspectos calculados.</Text>
                      </Trozo>
                    )}
                  </Flex>
                </Desplegable>

                {/* ── LAS ÁREAS (desplegable) ── el texto de cada una de las doce áreas PARA ESTA PERSONA. Sale solo, tal
                    cual, en la página de cada área de su camino (la presentación por pasos). Una línea con --- separa bloques. */}
                <Desplegable titulo="Las áreas" open={areasOpen} onToggle={() => setAreasOpen((o) => !o)}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <Trozo key={`area-${n}`}>
                      <Text color="#3B2418" fontWeight="700" fontSize="sm" mb={2}>Área {NUMEROS_ROMANOS[n - 1]}</Text>
                      <Textarea
                        value={areas[String(n)] ?? ""}
                        onChange={(e) => setAreas((a) => ({ ...a, [String(n)]: e.target.value }))}
                        placeholder={`El texto del Área ${NUMEROS_ROMANOS[n - 1]} para esta persona…`}
                        rows={8}
                        {...campoNac}
                      />
                      {n === 1 && (
                        <Text color="#3B2418b3" fontSize="xs" fontStyle="italic" mt={2}>
                          Párrafos separados por una línea en blanco · **negrita** · *cursiva* · una línea con --- es una separación. Un párrafo que empieza por el símbolo de un planeta (☉ ☽ ♄…) sale como su definición. Se guarda con «Guardar».
                        </Text>
                      )}
                    </Trozo>
                  ))}
                </Desplegable>

                {/* ── BIENVENIDA (desplegable) ── el recibimiento a ESTA persona: sale solo, tal cual, justo después
                    de pulsar EMPEZAR en su camino de Astrología. Sin texto, EMPEZAR sigue directo al cómic. */}
                <Desplegable titulo="La bienvenida" open={bienvenidaOpen} onToggle={() => setBienvenidaOpen((o) => !o)}>
                  <Trozo>
                    <Textarea
                      value={bienvenida}
                      onChange={(e) => setBienvenida(e.target.value)}
                      placeholder="Unas palabras de recibimiento para esta persona…"
                      rows={7}
                      {...campoNac}
                    />
                    <Text color="#3B2418b3" fontSize="xs" fontStyle="italic" mt={2}>
                      **negrita** · *cursiva* · --- una raya. Se guarda con «Guardar» y ella lo ve nada más pulsar EMPEZAR.
                    </Text>
                  </Trozo>
                </Desplegable>

                {/* ── SÍNTESIS (desplegable) ── lo que no debe olvidar de su carta. Sale solo, tal cual, en el
                    paso «Síntesis» de su camino de Astrología: no hay que escribirlo allí. */}
                <Desplegable titulo="La despedida" open={sintesisOpen} onToggle={() => setSintesisOpen((o) => !o)}>
                  <Trozo>
                    <Textarea
                      value={sintesis}
                      onChange={(e) => setSintesis(e.target.value)}
                      placeholder="Unas palabras de despedida y lo que no debe olvidar de su carta…"
                      rows={9}
                      {...campoNac}
                    />
                    <Text color="#3B2418b3" fontSize="xs" fontStyle="italic" mt={2}>
                      **negrita** · *cursiva* · --- una raya. Se guarda con «Guardar» y ella lo ve directamente en su camino.
                    </Text>
                  </Trozo>
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
