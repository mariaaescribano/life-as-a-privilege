import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Select, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { ComicAstrologiaModal, VINETAS_PLANETAS, VINETAS_SIGNOS } from "../../components/metodo/ComicAstrologiaModal";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { SaberMasModal } from "../../components/metodo/Planetas";
import { Glifo, GlifoSigno } from "../../components/metodo/Glifo";
import { ZODIAC_SIGNS, cuerpoByKey, soloClavesPlaneta, type Cuerpo, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { useNombresAstro } from "../../components/metodo/astrologiaNombres";
import type { CartaNatal } from "../../components/metodo/CartaAstral3D/types";
import { TextoRico } from "../../i18n";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { ORIGEN_ESPIRITUALIDAD } from "../../components/metodo/ComicUniversoModal";
import { useComic } from "../../i18n/comics";
import { HISTORIA_ASTROLOGIA } from "../../components/metodo/comicHistoriaAstrologia";
import { glowHeader } from "../../components/metodo/FotoBox";
import { useIntroComic } from "../../hooks/useIntroComic";
import { VINETAS_CARTA, CARTA_MAPA_IMGS } from "../../components/metodo/comicCartaAstral";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { rutaHome } from "../../api/sesion";
import {
  API_URL,
  astrologiaBg,
  astrologiaNom,
  astrologiaTxt,
  AstrologiaIcon,
} from "../../GlobalVariables";

/* Icono ojo para el botón del cómic */
// Contenido del popup «¿Qué es esto?»: explica esta primera pantalla del
// recorrido (qué es, qué se hace aquí y qué pasa después). Edítalo libremente.
const QUE_ES_ESTO: { titulo: string; parrafos: string[] } = {
  titulo: "¿Qué es esto?",
  parrafos: [
    "Rellena tus datos de nacimiento. Si la hora no es exacta, no podré leer correctamente tu carta.",
    "En cuanto lo envías, aparece un cómic que te cuenta qué es una carta astral.",
    "Cuando tu carta esté lista, te llegará un aviso por email.",
    "¿Te has equivocado, o has encontrado la hora buena? Pulsa «Cambiar», corrige lo que haga falta y vuelve a enviarlos. Si tu carta todavía no está en proceso o está escrita, volver a enviarla no se cobra.",
  ],
};

const SPACE_IMG = "/img/astrologia/space.webp";

// Nombre del paso 2 («Lo primero de tu carta»), abreviado en móvil para que
// quepa de una línea en los botones. Se resuelve por CSS y no con un hook, así
// no hay un primer pintado con el texto equivocado.
const TituloPaso2 = ({ flecha = false }: { flecha?: boolean }) => {
  const t = useT();
  return (
    <>
      <Box as="span" display={{ base: "none", md: "inline" }}>
        {t("metodo.astro.paso.loPrimero")}{flecha ? " →" : ""}
      </Box>
      <Box as="span" display={{ base: "inline", md: "none" }}>
        {t("metodo.astro.paso.loPrimeroCorto")}{flecha ? " →" : ""}
      </Box>
    </>
  );
};

// Precarga una imagen; resuelve al cargar o al fallar (para que el spinner
// nunca se quede colgado si la foto no existe).
const precargarImagen = (src: string): Promise<void> =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

/* Fondo espacial con degradado cósmico de respaldo */
const SpaceBg = ({ overlay = "rgba(8,13,30,0.55)" }: { overlay?: string }) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius="inherit"
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
    }}
  >
    <Box
      as="img"
      src={SPACE_IMG}
      alt=""
      loading="eager"
      position="absolute"
      inset="0"
      w="100%"
      h="100%"
      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.85 }}
    />
    <Box position="absolute" inset="0" style={{ background: overlay }} />
  </Box>
);

interface Estado {
  fecha_nacimiento?: string | null;
  hora_nacimiento?: string | null;
  pais?: string | null;
  lugar?: string | null;
  region?: string | null;
  solicitud_enviada_at?: string | null;
  link_carta?: string | null;
  intro_visto?: boolean | null;
  data?: TrioData | null;
}

/* ── El trío Sol · Luna · Ascendente (antes era su propia página,
      /metodo/astrologia/solascendenteluna; ahora vive AQUÍ debajo del
      formulario: una sola página para los datos y lo primero de la carta). ── */

// Orden visual pedido: Luna (izq) · Sol (centro) · Ascendente (dcha).
// En móvil se apila y el Sol queda en medio igualmente.
const TRIO: CuerpoKey[] = ["luna", "sol", "ascendente"];

interface TrioValor { signo?: string; casa?: number; profundizadoSigno?: boolean; profundizadoCasa?: boolean }
type TrioData = Partial<Record<CuerpoKey, TrioValor>>;


export default function MetodoAstrologia() {
  const t = useT();
  // El cómic del Origen, en el idioma activo (mismo cómic que ComicUniversoModal).
  const origenVinetas = useComic("origen-espiritualidad", ORIGEN_ESPIRITUALIDAD);
  // El segundo cómic de intro, «La Historia de la Astrología», también traducido.
  const historiaVinetas = useComic("astrologia-historia", HISTORIA_ASTROLOGIA);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState<Estado | null>(null);

  // Form state — fecha en 3 campos separados para evitar ambigüedades de formato
  // (los date pickers en algunos locales muestran MM/DD/YYYY y se confunde con DD/MM/YYYY).
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [hora, setHora] = useState("");
  const [pais, setPais] = useState("");
  const [lugar, setLugar] = useState("");
  const [region, setRegion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comicAstroOpen, setComicAstroOpen] = useState(false);
  // TERCER cómic de la entrada: «¿Qué es una carta astral?». Va detrás de los
  // otros dos cuando el usuario YA dio sus datos, y detrás del formulario
  // cuando acaba de darlos. En los dos casos desemboca en «Lo primero de tu
  // carta»: es la puerta de entrada a la lectura, no un extra de la página.
  const [comicCartaOpen, setComicCartaOpen] = useState(false);
  const intro = useIntroComic("metodo-astrologia"); // cómic del Origen (espiritualidad), 1ª vez
  // Segundo cómic de intro: «La Historia de la Astrología». Va SEGUIDO del cómic
  // del Origen (son distintos). Solo se encadena si tiene viñetas cargadas.
  const [historiaOpen, setHistoriaOpen] = useState(false);
  const hayHistoria = HISTORIA_ASTROLOGIA.length > 0;

  // Popup de confirmación de datos antes de enviar la solicitud
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [popupError, setPopupError] = useState<string | null>(null);
  // Popup "tu carta está en proceso" que sale tras enviar
  const [procesoOpen, setProcesoOpen] = useState(false);
  // Quien ya envió su solicitud puede volver a abrir el formulario y corregir
  // sus datos de nacimiento: al reenviarlos el backend recalcula la carta y
  // avisa por email. `avisoEdicion` cambia el texto del popup final.
  const [editando, setEditando] = useState(false);
  const [avisoEdicion, setAvisoEdicion] = useState(false);

  // El trío Sol · Luna · Ascendente, en esta misma página.
  const [trio, setTrio] = useState<TrioData>({});
  const [abierto, setAbierto] = useState<CuerpoKey | null>(null);
  // Los DOS cómics que se intercalan antes de «Arquetipos», encadenados: primero
  // los signos (cómo se expresa cada energía) y después los planetas (qué
  // energía es). Ese es el orden en que hacen falta para leer la carta.
  const [comicSignosOpen, setComicSignosOpen] = useState(false);
  const [comicPlanetasOpen, setComicPlanetasOpen] = useState(false);

  // Trae la carta calculada y arma el trío. La CARTA manda para signo y casa:
  // si se corrige la fecha (o la hora, o el lugar) la carta se recalcula, pero
  // el `data` guardado conserva los valores viejos; de ahí solo nos quedamos
  // con lo leído (profundizadoSigno/Casa).
  const cargarTrio = async (userId: string, token: string, dataGuardada?: TrioData | null) => {
    let d: TrioData = soloClavesPlaneta<TrioValor>(dataGuardada ?? undefined);
    try {
      const cartaRes = await axios.get<CartaNatal | null>(
        `${API_URL}/metodo-astrologia/carta-natal/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const carta = cartaRes.data;
      if (carta && Array.isArray(carta.planetas)) {
        for (const k of TRIO) {
          const p = carta.planetas.find((x) => x.planeta === k);
          if (!p) continue;
          d = {
            ...d,
            [k]: {
              ...d[k],
              signo: ZODIAC_SIGNS[p.signoIdx]?.name,
              // El ascendente es la cúspide de la casa 1: no lleva casa.
              ...(k !== "ascendente" ? { casa: p.casa } : {}),
            },
          };
        }
      }
    } catch { /* sin carta aún: las tarjetas salen con «—» */ }
    setTrio(d);
  };

  // Bloquea el scroll del fondo mientras cualquier popup está abierto.
  useLockBodyScroll(confirmOpen || procesoOpen);

  const MESES = [
    { num: "01", nombre: "Enero" },
    { num: "02", nombre: "Febrero" },
    { num: "03", nombre: "Marzo" },
    { num: "04", nombre: "Abril" },
    { num: "05", nombre: "Mayo" },
    { num: "06", nombre: "Junio" },
    { num: "07", nombre: "Julio" },
    { num: "08", nombre: "Agosto" },
    { num: "09", nombre: "Septiembre" },
    { num: "10", nombre: "Octubre" },
    { num: "11", nombre: "Noviembre" },
    { num: "12", nombre: "Diciembre" },
  ];

  // Carga
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      // El cómic del Origen ahora SIEMPRE sale al entrar (se puede saltar con la
      // X, pero vuelve a aparecer). Por eso lo abrimos y precargamos siempre.
      const abrirIntro = true;
      let solicitado = false;
      let trioPendiente: Promise<void> | null = null;
      try {
        const res = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEstado(res.data ?? null);
        solicitado = !!res.data?.solicitud_enviada_at;
        // Con solicitud, el trío se pinta en esta misma página. NO se espera
        // aquí (sería otro viaje en serie): la petición se lanza ya y se
        // espera junto a las precargas de las viñetas, que corren a la vez.
        if (solicitado) {
          trioPendiente = cargarTrio(userId, token, res.data?.data);
        }
        // Viene de «Corregir mis datos» en «Lo primero de tu carta»: se abre
        // directamente el formulario con sus datos puestos, y NADA de cómics
        // (no ha entrado a la disciplina, ha venido a arreglar una fecha).
        if (new URLSearchParams(window.location.search).get("corregir") === "1") {
          rellenarDesdeEstado(res.data ?? null);
          setEditando(true);
        } else {
          intro.openNow();
        }
      } catch {
        setEstado(null);
      }
      // No quitamos el spinner hasta que el fondo espacial esté descargado
      // (para que la página no aparezca con el degradado de respaldo y luego
      // salte la foto), hasta que TODAS las viñetas del cómic del Origen estén
      // descargadas (para que el cómic no aparezca a medio cargar) y, si ya hay
      // solicitud, hasta que las fotos del cómic de la carta también estén listas.
      await Promise.all([
        precargarImagen(SPACE_IMG),
        ...(abrirIntro
          ? ORIGEN_ESPIRITUALIDAD.map((v) => precargarImagen(encodeURI(v.src)))
          : []),
        // Segundo cómic (Historia): lo precargamos también para que aparezca sin
        // saltos justo después del primero.
        ...(abrirIntro
          ? HISTORIA_ASTROLOGIA.map((v) => precargarImagen(encodeURI(v.src)))
          : []),
        ...(solicitado
          ? CARTA_MAPA_IMGS.map((src) => precargarImagen(encodeURI(src)))
          : []),
        // El trío (carta natal) baja a la vez que las viñetas, no después.
        ...(trioPendiente ? [trioPendiente] : []),
      ]);
      setLoading(false);
      // Quien todavía no ha dado sus datos verá el cómic de la carta al
      // enviarlos. No retiene la entrada de la página —aún le queda rellenar el
      // formulario—, pero se pide ya para que llegue descargado.
      if (!solicitado) {
        void Promise.all(CARTA_MAPA_IMGS.map((src) => precargarImagen(encodeURI(src))));
      }
    })();
  }, []);

  // Prerrellena el formulario con los datos ya guardados, para que quien vuelve
  // a abrirlo solo tenga que corregir lo que esté mal (no reescribirlo todo).
  const rellenarDesdeEstado = (e: Estado | null) => {
    if (!e) return;
    const [a, m, d] = (e.fecha_nacimiento ?? "").slice(0, 10).split("-");
    if (a && m && d) {
      setAnio(a);
      setMes(m);
      setDia(String(parseInt(d, 10)));
    }
    if (e.hora_nacimiento) setHora(e.hora_nacimiento.slice(0, 5));
    if (e.pais) setPais(e.pais);
    if (e.lugar) setLugar(e.lugar);
    if (e.region) setRegion(e.region);
  };

  useEffect(() => { rellenarDesdeEstado(estado); }, [estado]);

  // Valida los campos y devuelve la fecha YYYY-MM-DD, o null si hay error (lo deja en `error`).
  const validarFecha = (): string | null => {
    setError(null);
    if (!dia || !mes || !anio || !hora || !pais.trim() || !lugar.trim() || !region.trim()) {
      setError("Rellena todos los campos para continuar.");
      return null;
    }
    const diaN = parseInt(dia, 10);
    const mesN = parseInt(mes, 10);
    const anioN = parseInt(anio, 10);
    if (!Number.isFinite(diaN) || diaN < 1 || diaN > 31) { setError("Día inválido (1-31)."); return null; }
    if (!Number.isFinite(mesN) || mesN < 1 || mesN > 12) { setError("Mes inválido."); return null; }
    if (!Number.isFinite(anioN) || anioN < 1900 || anioN > 2100) { setError("Año inválido (1900-2100)."); return null; }
    return `${anioN.toString().padStart(4, "0")}-${mesN.toString().padStart(2, "0")}-${diaN.toString().padStart(2, "0")}`;
  };

  // Abre el popup de confirmación (no envía todavía).
  const abrirConfirmacion = () => {
    if (!validarFecha()) return;
    setPopupError(null);
    setConfirmOpen(true);
  };

  // Confirma: envía la solicitud y, si va bien, pasa el popup al texto explicativo.
  const confirmarEnvio = async () => {
    const fecha = validarFecha();
    if (!fecha) { setConfirmOpen(false); return; }
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    setEnviando(true);
    setPopupError(null);
    try {
      await axios.post(
        `${API_URL}/metodo-astrologia/solicitud/${userId}`,
        {
          fecha_nacimiento: fecha,
          hora_nacimiento: hora,
          pais: pais.trim(),
          lugar: lugar.trim(),
          region: region.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Refresca estado: ahora estará en "esperando lectura"
      const r = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEstado(r.data ?? null);
      // La carta acaba de calcularse (o recalcularse): el trío de abajo tiene
      // que enseñar los signos nuevos, no los de antes de corregir.
      await cargarTrio(userId, token, r.data?.data);
      setAvisoEdicion(editando); // el popup final cambia si era una corrección
      setEditando(false);
      setConfirmOpen(false);   // cierra el de confirmación
      setProcesoOpen(true);    // abre el de "tu carta está en proceso"
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || "Error desconocido";
      console.error("[solicitud] error:", status, msg, err?.response?.data);
      setPopupError(`No se pudo enviar (${status || "?"}): ${msg}`);
    } finally {
      setEnviando(false);
    }
  };

  // Resumen legible de los datos, para el popup de confirmación.
  const fechaLegible = dia && mes && anio
    ? `${parseInt(dia, 10)} de ${MESES.find((m) => m.num === mes.padStart(2, "0"))?.nombre.toLowerCase() ?? mes} de ${anio}`
    : "";
  const lugarLegible = [lugar.trim(), region.trim(), pais.trim()].filter(Boolean).join(", ");

  // Resumen de los datos YA guardados (los que se enviaron con la solicitud),
  // para poder revisarlos y decidir si hay que corregirlos.
  const [gAnio, gMes, gDia] = (estado?.fecha_nacimiento ?? "").slice(0, 10).split("-");
  const guardadoFecha = gAnio && gMes && gDia
    ? `${parseInt(gDia, 10)} de ${MESES.find((m) => m.num === gMes)?.nombre.toLowerCase() ?? gMes} de ${gAnio}`
    : "";
  const guardadoHora = (estado?.hora_nacimiento ?? "").slice(0, 5);
  const guardadoLugar = [estado?.lugar, estado?.region, estado?.pais]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(", ");

  // Marca un cuerpo como leído (persistente, mismos flags que el resto del recorrido).
  const abrirLectura = (key: CuerpoKey) => {
    setAbierto(key);
    const cuerpo = cuerpoByKey(key);
    if (!cuerpo) return;
    const cur = trio[key] ?? {};
    const yaLeido = cur.profundizadoSigno && (!cuerpo.conCasa || cur.profundizadoCasa);
    if (yaLeido) return;

    const next: TrioData = {
      ...trio,
      [key]: {
        ...cur,
        profundizadoSigno: true,
        ...(cuerpo.conCasa && cur.casa != null ? { profundizadoCasa: true } : {}),
      },
    };
    setTrio(next);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      void axios.patch(`${API_URL}/metodo-astrologia/${userId}`, { data: next },
        { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  };

  const esLeido = (key: CuerpoKey): boolean => {
    const cuerpo = cuerpoByKey(key);
    const v = trio[key] ?? {};
    if (!cuerpo) return false;
    return !!v.profundizadoSigno && (!cuerpo.conCasa || !!v.profundizadoCasa);
  };

  if (loading) {
    return <RecorridoLoading />;
  }

  const yaSolicitado = !!estado?.solicitud_enviada_at;
  const yaConPdf = !!estado?.link_carta;
  const todosLeidos = TRIO.every(esLeido);
  const cuerpoAbierto = abierto ? cuerpoByKey(abierto) : null;
  const valorAbierto = abierto ? trio[abierto] ?? {} : {};

  // Etiquetas de los botones del header según estado
  const camposCompletos = !!dia && !!mes && !!anio && !!hora && !!pais.trim() && !!lugar.trim() && !!region.trim();
  // «Home» = la casa de quien mira: el panel si es admin, el home del recorrido
  // si no (rutaHome()). Antes iba siempre al del recorrido.
  const headerPrev = { label: "← Home", onClick: () => navigate(rutaHome()) };
  const headerExtra = {
    label: t("metodo.ilustraciones"),
    onClick: () => setComicAstroOpen(true),
  };
  // Mientras está CORRIGIENDO, la puerta de delante se cierra: los datos con los
  // que se calculó la carta están mal (por eso los corrige), así que no tiene
  // sentido dejarle seguir leyéndola. Vuelve a abrirse al reenviarlos.
  //
  // Con solicitud, el siguiente paso ya es «Arquetipos»: el trío Sol · Luna ·
  // Ascendente vive en ESTA página, y no se avanza hasta leer los tres. Antes
  // de Arquetipos van los dos cómics encadenados (signos → planetas).
  const headerNext = (yaConPdf || yaSolicitado) && !editando
    ? {
        label: todosLeidos ? `${t("metodo.astro.paso.arquetipos")} →` : t("metodo.astro.trioLeeLosTres"),
        onClick: () => setComicSignosOpen(true),
        disabled: !todosLeidos,
        disabledTooltip: t("metodo.astro.trioLeeLosTresTooltip"),
      }
    : { label: "Leer carta →", onClick: abrirConfirmacion, disabled: !camposCompletos };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          {/* ── Header de disciplina ── */}
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("disciplina.astrologia")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 1, total: 8 }}
              mb={0}
              prev={headerPrev}
              extra={headerExtra}
              next={headerNext}
            />
          </Reveal>

          {/* ── Datos de nacimiento ya enviados ──
                Chapa compacta y centrada, ENCIMA del cómic. Antes era una barra a
                todo el ancho colgando debajo, que pesaba visualmente más que el
                propio cómic siendo un dato secundario. Aquí solo recuerda con qué
                datos se ha calculado la carta y deja corregirlos. */}
          {yaSolicitado && !editando && (
            <Reveal direction="down" distance={14} delay={0.1} duration={0.6}
                    w="100%" display="flex" justifyContent="center">
              <Box
                position="relative"
                overflow="hidden"
                maxW="100%"
                borderRadius="full"
                // Sin línea de borde y con el MISMO halo que la cabecera (y que
                // el box de lectura de abajo): las tres piezas de la página
                // brillan igual, ninguna se recorta contra el turquesa.
                border="none"
                boxShadow={glowHeader(astrologiaTxt)}
              >
                {/* Fondo espacial de Astrología, el mismo que el header. Antes la
                    chapa era translúcida y dejaba pasar el turquesa de la página,
                    así que se veía verdosa y desentonaba con el resto. */}
                <Box position="absolute" inset={0} bgImage={`url('${SPACE_IMG}')`}
                     bgSize="cover" bgPosition="center" pointerEvents="none" />
                {/* Velo: la foto sola no da contraste suficiente para la letra. */}
                <Box position="absolute" inset={0} bg="rgba(8,13,30,0.62)" pointerEvents="none" />

                <Flex
                  position="relative"
                  zIndex={1}
                  align="center"
                  justify="center"
                  gap={{ base: 2.5, md: 3.5 }}
                  wrap="wrap"
                  px={{ base: 4, md: 5 }}
                  py={{ base: 2, md: 2.5 }}
                >
                {/* El icono de la disciplina hace de etiqueta: dice «esto es tu
                    carta» sin gastar una línea de texto en mayúsculas. */}
                <Box flexShrink={0} opacity={0.85} display="flex" alignItems="center">
                  <AstrologiaIcon size={{ base: "16px", md: "18px" }} />
                </Box>

                <Text color={astrologiaTxt} fontSize={{ base: "sm", md: "md" }} fontWeight="600"
                      whiteSpace="nowrap" style={{ textShadow: `0 0 12px ${astrologiaBg}` }}>
                  {guardadoFecha || "—"}{guardadoHora ? ` · ${guardadoHora}` : ""}
                </Text>

                {guardadoLugar && (
                  <>
                    <Box w="4px" h="4px" borderRadius="full" bg={`${astrologiaTxt}55`} flexShrink={0} />
                    <Text color={`${astrologiaTxt}bb`} fontSize={{ base: "xs", md: "sm" }} whiteSpace="nowrap">
                      {guardadoLugar}
                    </Text>
                  </>
                )}

                <Box
                  as="button"
                  onClick={() => {
                    setError(null);
                    rellenarDesdeEstado(estado);
                    setEditando(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  flexShrink={0}
                  display="inline-flex"
                  alignItems="center"
                  gap={1.5}
                  ml={{ base: 0, md: 1 }}
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg="transparent"
                  color={`${astrologiaTxt}cc`}
                  border={`1px solid ${astrologiaTxt}44`}
                  fontFamily="'EB Garamond', serif"
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.05em"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ color: astrologiaTxt, borderColor: astrologiaTxt, boxShadow: `0 0 14px ${astrologiaTxt}44` }}
                >
                  {/* Lápiz vectorial (nada de caracteres tipo «✎»). */}
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                       w="13px" h="13px" fill="currentColor" flexShrink={0}>
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T846-647L319-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                  </Box>
                  {t("metodo.astro.cambiar")}
                </Box>
                </Flex>
              </Box>
            </Reveal>
          )}

          {/* ── Tras enviar la solicitud: la puerta a la lectura ──
                «¿Qué es una carta astral?» ya no se lee aquí metido en un box:
                es un cómic a pantalla completa (el tercero de la entrada) que
                sale solo al entrar y termina en «Lo primero de tu carta». Esta
                caja es para quien vuelve: relee el cómic o sigue adelante. ── */}
          {yaSolicitado && !editando && (
            <Reveal
              direction="up"
              distance={34}
              scaleFrom={0.97}
              delay={0.12}
              duration={0.75}
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={glowHeader(astrologiaTxt)}
            >
              <SpaceBg overlay="rgba(8,13,30,0.65)" />

              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                <RevealStagger display="flex" flexDirection="column" gap={5} stagger={0.09} delayChildren={0.35}>
                  <RevealItem>
                    <Text color={astrologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em" textAlign="center">
                      {t("metodo.astro.queEsCarta")}
                    </Text>
                  </RevealItem>
                  <RevealItem>
                    <Text color={`${astrologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" textAlign="center" maxW="600px" mx="auto">
                      {t("metodo.astro.queEsCartaResumen")}
                    </Text>
                  </RevealItem>
                  <RevealItem>
                    <Box h="1px" my={2} bgGradient={`linear(to-r, transparent, ${astrologiaTxt}55, transparent)`} />
                  </RevealItem>
                  <RevealItem display="flex" justifyContent="center">
                    <Box
                      as="button"
                      onClick={() => setComicCartaOpen(true)}
                      px={8}
                      py={2.5}
                      borderRadius="full"
                      bg="transparent"
                      color={astrologiaTxt}
                      border={`1px solid ${astrologiaTxt}66`}
                      fontFamily="'EB Garamond', serif"
                      fontWeight="700"
                      letterSpacing="0.06em"
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: astrologiaTxt, boxShadow: `0 0 22px ${astrologiaTxt}55` }}
                    >
                      {t("metodo.astro.queEsCartaLeer")}
                    </Box>
                  </RevealItem>
                </RevealStagger>
              </Box>
            </Reveal>
          )}

          {/* ── EL TRÍO: Sol · Luna · Ascendente ──
                Antes era la página siguiente (/solascendenteluna); ahora vive
                aquí debajo: se dan los datos, sale el aviso de «tu carta está
                en proceso» y, en esta MISMA página, lo primero de la carta.
                Mientras se corrigen los datos se esconde (la carta de la que
                salen estos signos está calculada con los datos malos). ── */}
          {yaSolicitado && !editando && (
            <>
              <Reveal direction="up" distance={18} delay={0.16} duration={0.7} w="100%">
                <Text
                  color="#ffffff"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.8"
                  textAlign="center"
                  maxW="620px"
                  mx="auto"
                  fontStyle="italic"
                >
                  <TextoRico>{t("metodo.astro.trioIntro")}</TextoRico>
                </Text>
              </Reveal>

              <Reveal
                direction="up"
                distance={34}
                scaleFrom={0.97}
                delay={0.2}
                duration={0.75}
                position="relative"
                w="100%"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow={glowHeader(astrologiaTxt)}
              >
                <SpaceBg overlay="rgba(8,13,30,0.62)" />

                <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 9, md: 12 }}>
                  <RevealStagger
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    alignItems="center"
                    mt="5px"
                    justifyContent="center"
                    gap={{ base: 7, md: 6 }}
                    stagger={0.14}
                    delayChildren={0.3}
                    amount={0.2}
                  >
                    {TRIO.map((key) => {
                      const cuerpo = cuerpoByKey(key);
                      if (!cuerpo) return null;
                      const v = trio[key] ?? {};
                      const esSol = key === "sol";
                      return (
                        <RevealItem
                          key={key}
                          direction="up"
                          distance={30}
                          scaleFrom={0.9}
                          duration={0.7}
                          w={{ base: "100%", md: "auto" }}
                          display="flex"
                          justifyContent="center"
                        >
                          <TrioCard
                            cuerpo={cuerpo}
                            signo={v.signo}
                            casa={cuerpo.conCasa ? v.casa : undefined}
                            destacado={esSol}
                            leido={esLeido(key)}
                            onLeer={() => abrirLectura(key)}
                          />
                        </RevealItem>
                      );
                    })}
                  </RevealStagger>

                  {/* Si el Sol, la Luna o el Ascendente no le cuadran, casi
                      siempre es que la hora o el lugar están mal: la corrección
                      se hace AQUÍ mismo (el formulario de arriba se reabre).
                      El botón va COMPACTO y centrado (al ancho de su texto,
                      nunca de la caja): es una salida secundaria, no debe pesar
                      como las tarjetas del trío. */}
                  <Text color={`${astrologiaTxt}bb`} fontSize={{ base: "xs", md: "sm" }} lineHeight="1.7"
                        textAlign="center" maxW="620px" mx="auto" mt={{ base: 7, md: 8 }}>
                    {t("metodo.astro.corregirAviso")}
                  </Text>
                  <Flex justify="center" mt={3.5}>
                    <Box
                      as="button"
                      onClick={() => {
                        setError(null);
                        rellenarDesdeEstado(estado);
                        setEditando(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      display="inline-flex"
                      alignItems="center"
                      gap={2}
                      px={5}
                      py={2}
                      borderRadius="full"
                      bg="rgba(8,13,30,0.45)"
                      color={`${astrologiaTxt}cc`}
                      border={`1px solid ${astrologiaTxt}55`}
                      fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="700"
                      letterSpacing="0.05em"
                      whiteSpace="nowrap"
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ color: astrologiaTxt, borderColor: astrologiaTxt, boxShadow: `0 0 18px ${astrologiaTxt}44` }}
                    >
                      {/* Lápiz vectorial (el mismo de la chapa de datos). */}
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                           w="15px" h="15px" fill="currentColor" flexShrink={0}>
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T846-647L319-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                      </Box>
                      {t("metodo.astro.corregirDatos")}
                    </Box>
                  </Flex>
                </Box>
              </Reveal>
            </>
          )}

          {/* ── ESTADO A — formulario dentro de la caja principal con SpaceBg ──
                También es el formulario de corrección: quien ya envió la
                solicitud lo reabre con «Corregir» (la chapa de arriba) y lo
                reenvía. ── */}
          {(!yaSolicitado || editando) && (
            <Reveal
              direction="up"
              distance={34}
              scaleFrom={0.97}
              delay={0.12}
              duration={0.75}
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={glowHeader(astrologiaTxt)}
            >
              <SpaceBg overlay="rgba(8,13,30,0.65)" />

              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                <RevealStagger display="flex" flexDirection="column" gap={5} stagger={0.09} delayChildren={0.35}>
                  <RevealItem>
                    {/* Sin textShadow: el brillo sobre el velo del cielo ensuciaba la letra. */}
                    <Text color={astrologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em" textAlign="center">
                      {editando ? "Corrige tus datos" : "Tu Carta Astral"}
                    </Text>
                  </RevealItem>
                  <RevealItem>
                    <Text color={`${astrologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" textAlign="center" maxW="600px" mx="auto">
                      {editando
                        ? "Cambia lo que haga falta y vuelve a enviarlos: tu carta se calcula de nuevo con los datos corregidos."
                        : "Necesito tus datos de nacimiento para poder leer tu carta."}
                    </Text>
                  </RevealItem>

                  <RevealItem>
                    <Box h="1px" my={2} bgGradient={`linear(to-r, transparent, ${astrologiaTxt}55, transparent)`} />
                  </RevealItem>

                  <RevealItem>
                    <Text color={`${astrologiaTxt}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
                      {t("metodo.astro.fechaNacimiento")}
                    </Text>
                    <Flex gap={3}>
                      <Box flex="1">
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={31}
                          value={dia}
                          onChange={(e) => setDia(e.target.value)}
                          placeholder={t("metodo.astro.dia")}
                          bg="rgba(8,13,30,0.55)"
                          border={`1px solid ${astrologiaTxt}44`}
                          color={astrologiaTxt}
                          borderRadius="lg"
                          size="md"
                          fontFamily="'EB Garamond', serif"
                          _placeholder={{ color: `${astrologiaTxt}55` }}
                          _hover={{ borderColor: `${astrologiaTxt}88` }}
                          _focus={{
                            borderColor: astrologiaTxt,
                            boxShadow: `0 0 0 1px ${astrologiaTxt}55, 0 0 14px ${astrologiaTxt}33`,
                            bg: "rgba(8,13,30,0.7)",
                          }}
                        />
                      </Box>
                      <Box flex="1.6">
                        <Select
                          value={mes}
                          onChange={(e) => setMes(e.target.value)}
                          placeholder={t("metodo.astro.mes")}
                          bg="rgba(8,13,30,0.55)"
                          border={`1px solid ${astrologiaTxt}44`}
                          color={astrologiaTxt}
                          borderRadius="lg"
                          size="md"
                          fontFamily="'EB Garamond', serif"
                          sx={{
                            "> option": { background: "#0c1230", color: astrologiaTxt },
                          }}
                          _hover={{ borderColor: `${astrologiaTxt}88` }}
                          _focus={{
                            borderColor: astrologiaTxt,
                            boxShadow: `0 0 0 1px ${astrologiaTxt}55, 0 0 14px ${astrologiaTxt}33`,
                            bg: "rgba(8,13,30,0.7)",
                          }}
                        >
                          {MESES.map((m) => (
                            <option key={m.num} value={m.num}>{m.nombre}</option>
                          ))}
                        </Select>
                      </Box>
                      <Box flex="1">
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1900}
                          max={2100}
                          value={anio}
                          onChange={(e) => setAnio(e.target.value)}
                          placeholder={t("metodo.astro.anio")}
                          bg="rgba(8,13,30,0.55)"
                          border={`1px solid ${astrologiaTxt}44`}
                          color={astrologiaTxt}
                          borderRadius="lg"
                          size="md"
                          fontFamily="'EB Garamond', serif"
                          _placeholder={{ color: `${astrologiaTxt}55` }}
                          _hover={{ borderColor: `${astrologiaTxt}88` }}
                          _focus={{
                            borderColor: astrologiaTxt,
                            boxShadow: `0 0 0 1px ${astrologiaTxt}55, 0 0 14px ${astrologiaTxt}33`,
                            bg: "rgba(8,13,30,0.7)",
                          }}
                        />
                      </Box>
                    </Flex>
                    {dia && mes && anio && (
                      <Text color={`${astrologiaTxt}aa`} fontSize="xs" mt={2} fontStyle="italic" letterSpacing="0.04em">
                        {dia} de {MESES.find((m) => m.num === mes)?.nombre.toLowerCase()} de {anio}
                      </Text>
                    )}
                  </RevealItem>

                  <RevealItem>
                    <Text color={`${astrologiaTxt}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
                      {t("metodo.astro.horaNacimiento")}
                    </Text>
                    <Input
                      type="time"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      bg="rgba(8,13,30,0.55)"
                      border={`1px solid ${astrologiaTxt}44`}
                      color={astrologiaTxt}
                      borderRadius="lg"
                      size="md"
                      fontFamily="'EB Garamond', serif"
                      _hover={{ borderColor: `${astrologiaTxt}88` }}
                      _focus={{
                        borderColor: astrologiaTxt,
                        boxShadow: `0 0 0 1px ${astrologiaTxt}55, 0 0 14px ${astrologiaTxt}33`,
                        bg: "rgba(8,13,30,0.7)",
                      }}
                      sx={{
                        "::-webkit-calendar-picker-indicator": { filter: "invert(0.9)" },
                      }}
                    />
                  </RevealItem>
                  <RevealItem>
                    <Campo label={t("metodo.astro.pais")} value={pais} onChange={setPais} color={astrologiaTxt} placeholder={t("metodo.astro.paisEj")} />
                  </RevealItem>
                  <RevealItem display="flex" flexDirection={{ base: "column", md: "row" }} gap={4}>
                    <Campo label={t("metodo.astro.lugar")} value={lugar} onChange={setLugar} color={astrologiaTxt} placeholder={t("metodo.astro.lugarEj")} />
                    <Campo label={t("metodo.astro.region")} value={region} onChange={setRegion} color={astrologiaTxt} placeholder={t("metodo.astro.regionEj")} />
                  </RevealItem>

                  {error && (
                    <Text color="#ffb8b8" fontSize="sm" textAlign="center" fontStyle="italic">{error}</Text>
                  )}

                  <RevealItem display="flex" justifyContent="flex-end" alignItems="center" gap={3} mt={4}>
                    {editando && (
                      <Box
                        as="button"
                        onClick={() => { setEditando(false); setError(null); rellenarDesdeEstado(estado); }}
                        px={{ base: 6, md: 7 }}
                        py={{ base: 3, md: 3.5 }}
                        borderRadius="full"
                        bg="transparent"
                        color={`${astrologiaTxt}cc`}
                        border={`1px solid ${astrologiaTxt}55`}
                        fontFamily="'EB Garamond', serif"
                        fontSize={{ base: "md", md: "lg" }}
                        fontWeight="600"
                        letterSpacing="0.06em"
                        cursor="pointer"
                        transition="all 0.22s"
                        _hover={{ borderColor: astrologiaTxt, color: astrologiaTxt }}
                      >
                        {t("comun.cancelar")}
                      </Box>
                    )}
                    <Box
                      as="button"
                      onClick={() => { if (camposCompletos) abrirConfirmacion(); }}
                      disabled={!camposCompletos}
                      px={{ base: 7, md: 9 }}
                      py={{ base: 3, md: 3.5 }}
                      borderRadius="full"
                      bg={camposCompletos ? astrologiaTxt : `${astrologiaTxt}33`}
                      color={camposCompletos ? "#0a0a1a" : `${astrologiaTxt}aa`}
                      border={`1px solid ${astrologiaTxt}88`}
                      fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight="700"
                      letterSpacing="0.08em"
                      cursor={camposCompletos ? "pointer" : "not-allowed"}
                      opacity={camposCompletos ? 1 : 0.6}
                      boxShadow={camposCompletos
                        ? `0 0 18px ${astrologiaTxt}66, 0 0 38px ${astrologiaTxt}33`
                        : "none"}
                      transition="all 0.22s"
                      _hover={camposCompletos ? {
                        transform: "translateY(-2px)",
                        boxShadow: `0 0 28px ${astrologiaTxt}88, 0 0 58px ${astrologiaTxt}44`,
                      } : {}}
                    >
                      {editando ? "Guardar" : "Recibir mi lectura"}
                    </Box>
                  </RevealItem>
                </RevealStagger>
              </Box>
            </Reveal>
          )}
        </Flex>
      </Flex>

      <ComicAstrologiaModal
        isOpen={comicAstroOpen}
        onClose={() => setComicAstroOpen(false)}
      />

      {/* Tercer cómic de la entrada: «¿Qué es una carta astral?». Ya no lleva a
          otra página: «Lo primero de tu carta» (el trío) vive AQUÍ debajo, así
          que al continuar el cómic se cierra y la página queda a la vista. */}
      <ComicPasoModal
        isOpen={comicCartaOpen}
        onClose={() => setComicCartaOpen(false)}
        onContinue={() => setComicCartaOpen(false)}
        vinetas={VINETAS_CARTA}
        continueLabel={<TituloPaso2 />}
        themeColor={astrologiaTxt}
      />

      {/* Ficha de lectura de un cuerpo del trío (Sol, Luna o Ascendente). */}
      <SaberMasModal
        isOpen={!!cuerpoAbierto}
        onClose={() => setAbierto(null)}
        cuerpo={cuerpoAbierto ?? null}
        signo={valorAbierto.signo}
        casa={cuerpoAbierto?.conCasa ? valorAbierto.casa : undefined}
      />

      {/* Cómic de los signos: el primero de los dos de camino a «Arquetipos».
          Su botón de continuar es «Planetas →» (el otro cómic), no la página. */}
      <ComicPasoModal
        isOpen={comicSignosOpen}
        onClose={() => setComicSignosOpen(false)}
        onContinue={() => { setComicSignosOpen(false); setComicPlanetasOpen(true); }}
        vinetas={VINETAS_SIGNOS}
        continueLabel={t("metodo.astro.comicPlanetas")}
        themeColor={astrologiaTxt}
      />

      {/* Cómic de los planetas: el segundo. Ahora sí, desemboca en «Arquetipos». */}
      <ComicPasoModal
        isOpen={comicPlanetasOpen}
        onClose={() => setComicPlanetasOpen(false)}
        onContinue={() => navigate("/metodo/astrologia/cartaAstral")}
        vinetas={VINETAS_PLANETAS}
        continueLabel={t("metodo.astro.paso.arquetipos")}
        themeColor={astrologiaTxt}
      />

      {/* Intro: cómic del Origen según la espiritualidad. Al terminar (o pulsar
          el botón de continuar) encadena el segundo cómic, «La Historia de la
          Astrología». La X salta toda la intro y entra a la disciplina. */}
      <IntroComicModal
        isOpen={intro.open}
        vinetas={origenVinetas}
        onFinish={intro.finish}
        onClose={intro.close}
        continueLabel={hayHistoria ? "Historia" : "Astrología"}
        continueBgImage={SPACE_IMG}
        onContinue={() => { intro.close(); if (hayHistoria) setHistoriaOpen(true); }}
        onComplete={() => { intro.close(); if (hayHistoria) setHistoriaOpen(true); }}
      />

      {/* Segundo cómic de intro: «La Historia de la Astrología» (va seguido del
          Origen). Al terminar / continuar, entra a la disciplina. */}
      <IntroComicModal
        isOpen={historiaOpen}
        vinetas={historiaVinetas}
        onClose={() => setHistoriaOpen(false)}
        continueLabel={yaSolicitado ? t("metodo.astro.queEsCarta") : t("disciplina.astrologia")}
        continueBgImage={SPACE_IMG}
        // Con los datos ya dados, la entrada son los TRES cómics seguidos: aquí
        // encadena el de la carta, que al acabar lleva a «Lo primero de tu
        // carta». Sin datos, se cierra y queda el formulario, que es lo que
        // toca rellenar.
        onContinue={() => { setHistoriaOpen(false); if (yaSolicitado) setComicCartaOpen(true); }}
        onComplete={() => { setHistoriaOpen(false); if (yaSolicitado) setComicCartaOpen(true); }}
        // Volver al cómic anterior de la cadena: el Origen según la espiritualidad.
        onBack={() => { setHistoriaOpen(false); intro.openNow(); }}
      />

      {/* ── POPUP: confirmar datos antes de enviar ── */}
      {confirmOpen && (
        <Box
          position="fixed" inset={0} zIndex={500}
          display="flex" alignItems="center" justifyContent="center"
          px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}
          bg="rgba(0,0,0,0.82)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => { if (!enviando) setConfirmOpen(false); }}
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            position="relative" w="100%" maxW="480px"
            maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 80px)" }}
            borderRadius="2xl" overflow="hidden"
            border={`1px solid ${astrologiaTxt}66`}
            boxShadow={`0 0 32px ${astrologiaTxt}55, 0 0 80px ${astrologiaTxt}28, 0 12px 60px rgba(0,0,0,0.6)`}
            display="flex" flexDirection="column"
          >
            <SpaceBg overlay="rgba(8,13,30,0.78)" />

            <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 9 }}>
              <Flex direction="column" align="center" gap={5}>
                <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
                      letterSpacing="0.03em" style={{ textShadow: `0 0 14px ${astrologiaTxt}66` }}>
                  {t("metodo.astro.seguroDatos")}
                </Text>

                <Flex direction="column" align="center" gap={2} w="100%"
                      bg="rgba(8,13,30,0.5)" borderRadius="xl" border={`1px solid ${astrologiaTxt}33`} px={5} py={5}>
                  <Text color={astrologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" textAlign="center">
                    {fechaLegible}{hora ? ` · ${hora}` : ""}
                  </Text>
                  <Text color={`${astrologiaTxt}cc`} fontSize={{ base: "sm", md: "md" }} textAlign="center">
                    {lugarLegible}
                  </Text>
                </Flex>

                {popupError && (
                  <Text color="#ffb8b8" fontSize="sm" textAlign="center" fontStyle="italic">{popupError}</Text>
                )}

                <Flex gap={3} mt={1} w="100%" justify="center" wrap="wrap">
                  <Box as="button" onClick={() => { if (!enviando) setConfirmOpen(false); }}
                       px={6} py={2.5} borderRadius="full" bg="transparent" color={`${astrologiaTxt}cc`}
                       border={`1px solid ${astrologiaTxt}55`} fontFamily="'EB Garamond', serif" fontWeight="600"
                       cursor={enviando ? "not-allowed" : "pointer"} opacity={enviando ? 0.5 : 1}
                       _hover={enviando ? {} : { borderColor: astrologiaTxt, color: astrologiaTxt }}>
                    {t("metodo.astro.volverRevisar")}
                  </Box>
                  <Box as="button" onClick={() => { if (!enviando) void confirmarEnvio(); }}
                       px={7} py={2.5} borderRadius="full" bg={astrologiaTxt} color="#0a0a1a"
                       border={`1px solid ${astrologiaTxt}88`} fontFamily="'EB Garamond', serif" fontWeight="700"
                       letterSpacing="0.06em" cursor={enviando ? "wait" : "pointer"} opacity={enviando ? 0.7 : 1}
                       boxShadow={`0 0 18px ${astrologiaTxt}66`}
                       _hover={enviando ? {} : { boxShadow: `0 0 28px ${astrologiaTxt}88`, transform: "translateY(-1px)" }}
                       transition="all 0.2s">
                    {enviando ? "Enviando…" : editando ? "Sí, actualizar" : "Sí, confirmar"}
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Box>
      )}

      {/* ── POPUP: tu carta está en proceso (tras enviar) ── */}
      {procesoOpen && (
        <Box
          position="fixed" inset={0} zIndex={500}
          display="flex" alignItems="center" justifyContent="center"
          px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}
          bg="rgba(0,0,0,0.82)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => setProcesoOpen(false)}
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            position="relative" w="100%" maxW="480px"
            borderRadius="2xl" overflow="hidden"
            border={`1px solid ${astrologiaTxt}66`}
            boxShadow={`0 0 32px ${astrologiaTxt}55, 0 0 80px ${astrologiaTxt}28, 0 12px 60px rgba(0,0,0,0.6)`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.8)" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 9 }}>
              <Text color={`${astrologiaTxt}ee`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" textAlign="center"
                    style={{ textShadow: `0 0 10px ${astrologiaTxt}44` }}>
                {avisoEdicion
                  ? "He recibido tus datos corregidos. Tu carta se ha vuelto a calcular con ellos y yo misma la leeré de nuevo. Mientras tanto, puedes continuar para ver tus arquetipos."
                  : "Tu carta está en proceso. Yo misma leeré tu carta. Mientras tanto, puedes continuar para ver tus arquetipos."}
              </Text>
              <Flex justify="flex-end" mt={6}>
                {/* Aceptar = seguir: se cierra el aviso y entra el tercer
                    cómic, que es lo que lleva a «Lo primero de tu carta». */}
                <Box as="button" onClick={() => { setProcesoOpen(false); setComicCartaOpen(true); }}
                     px={8} py={2.5} borderRadius="full" bg={astrologiaTxt} color="#0a0a1a"
                     border={`1px solid ${astrologiaTxt}88`} fontFamily="'EB Garamond', serif" fontWeight="700"
                     letterSpacing="0.06em" cursor="pointer" boxShadow={`0 0 18px ${astrologiaTxt}66`}
                     _hover={{ boxShadow: `0 0 28px ${astrologiaTxt}88`, transform: "translateY(-1px)" }} transition="all 0.2s">
                  {t("comun.aceptar")}
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      )}

      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom}
                     llamadaTitulo="Reserva tu llamada de astrología" queEsEsto={QUE_ES_ESTO} />
      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}

/* ── Componentes auxiliares ── */

const CheckIcon = ({ color }: { color: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill={color} flexShrink={0}>
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </Box>
);

/* ── Tarjeta de un cuerpo del trío (portada de /solascendenteluna, ya fusionada aquí) ── */
function TrioCard({
  cuerpo,
  signo,
  casa,
  destacado,
  leido,
  onLeer,
}: {
  cuerpo: Cuerpo;
  signo?: string;
  casa?: number;
  destacado?: boolean;
  leido: boolean;
  onLeer: () => void;
}) {
  const t = useT();
  const n = useNombresAstro();
  const c = cuerpo.color;
  const signoData = signo ? ZODIAC_SIGNS.find((s) => s.name === signo) : null;
  return (
    <Flex
      direction="column"
      align="center"
      gap={3}
      w={{ base: "100%", md: destacado ? "230px" : "200px" }}
      maxW={{ base: "280px", md: "none" }}
      transform={{ md: destacado ? "translateY(-14px)" : "none" }}
      px={5}
      py={{ base: 6, md: 7 }}
      borderRadius="2xl"
      bg="rgba(8,13,30,0.45)"
      border={`1px solid ${c}${destacado ? "66" : "33"}`}
      boxShadow={destacado ? `0 0 26px ${c}44, 0 0 60px ${c}22` : `0 0 16px ${c}22`}
    >
      {/* icono */}
      <Box style={{ filter: `drop-shadow(0 0 6px ${c}55)` }}>
        <Glifo symbol={cuerpo.symbol} color={c} size={destacado ? 64 : 52} />
      </Box>
      <Text color={c} fontSize={{ base: "lg", md: destacado ? "2xl" : "xl" }} fontWeight="700" letterSpacing="0.04em"
            style={{ textShadow: `0 0 12px ${c}66` }}>
        {n.cuerpo(cuerpo.key)}
      </Text>

      {/* signo · casa */}
      <Flex align="center" gap={2} minH="28px">
        {signoData ? (
          <>
            <GlifoSigno nombre={signoData.name} color={c} size={24} />
            <Text color={`${c}dd`} fontSize={{ base: "sm", md: "md" }}>
              {n.signo(signoData.name)}{casa != null ? ` · ${n.casa(casa)}` : ""}
            </Text>
          </>
        ) : (
          <Text color={`${c}99`} fontSize="sm" fontStyle="italic">—</Text>
        )}
      </Flex>

      {/* botón leer */}
      <Box
        as="button"
        onClick={onLeer}
        mt={1}
        px={6}
        py={2}
        borderRadius="full"
        bg={leido ? `${c}22` : c}
        color={leido ? c : "#0a0a1a"}
        border={`1px solid ${c}88`}
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "sm", md: "md" }}
        fontWeight="700"
        letterSpacing="0.06em"
        cursor="pointer"
        transition="all 0.18s"
        display="inline-flex"
        alignItems="center"
        gap={1.5}
        whiteSpace="nowrap"
        _hover={{ boxShadow: `0 0 18px ${c}88`, transform: "translateY(-1px)" }}
      >
        {leido ? <><CheckIcon color={c} /> {t("metodo.astro.releer")}</> : t("metodo.astro.leer")}
      </Box>
    </Flex>
  );
}

const Campo = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  color,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  color: string;
}) => (
  <Box flex="1">
    <Text color={`${color}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
      {label}
    </Text>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      bg="rgba(8,13,30,0.55)"
      border={`1px solid ${color}44`}
      color={color}
      borderRadius="lg"
      size="md"
      fontFamily="'EB Garamond', serif"
      _placeholder={{ color: `${color}55` }}
      _hover={{ borderColor: `${color}88` }}
      _focus={{
        borderColor: color,
        boxShadow: `0 0 0 1px ${color}55, 0 0 14px ${color}33`,
        bg: "rgba(8,13,30,0.7)",
      }}
      sx={{
        // Iconos de date/time visibles sobre fondo oscuro
        "::-webkit-calendar-picker-indicator": { filter: "invert(0.9)" },
      }}
    />
  </Box>
);

