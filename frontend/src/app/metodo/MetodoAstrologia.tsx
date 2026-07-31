import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Select, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { ComicAstrologiaModal, VINETAS_SIGNOS } from "../../components/metodo/ComicAstrologiaModal";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { ORIGEN_ESPIRITUALIDAD } from "../../components/metodo/ComicUniversoModal";
import { HISTORIA_ASTROLOGIA } from "../../components/metodo/comicHistoriaAstrologia";
import { PASO_CARTA_TITULO, PASO_CARTA_TITULO_CORTO } from "../../components/metodo/astrologiaRecorrido";
import { glowHeader } from "../../components/metodo/FotoBox";
import { useIntroComic } from "../../hooks/useIntroComic";
import { TextoCartaExplicativo, CARTA_MAPA_IMGS } from "../../components/metodo/TextoCartaExplicativo";
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
const EyeIcon = () => (
  <Box
    as="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    w="16px"
    h="16px"
    fill="currentColor"
    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
  >
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

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

const SPACE_IMG = "/img/astrologia/space.jpg";

// Nombre del paso 2 («Lo primero de tu carta»), abreviado en móvil para que
// quepa de una línea en los botones. Se resuelve por CSS y no con un hook, así
// no hay un primer pintado con el texto equivocado.
const TituloPaso2 = ({ flecha = false }: { flecha?: boolean }) => (
  <>
    <Box as="span" display={{ base: "none", md: "inline" }}>
      {PASO_CARTA_TITULO}{flecha ? " →" : ""}
    </Box>
    <Box as="span" display={{ base: "inline", md: "none" }}>
      {PASO_CARTA_TITULO_CORTO}{flecha ? " →" : ""}
    </Box>
  </>
);

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
}


export default function MetodoAstrologia() {
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
  // Cómic de los signos: se intercala antes de pasar a «Lo primero de tu carta».
  const [comicSignosOpen, setComicSignosOpen] = useState(false);
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
      try {
        const res = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEstado(res.data ?? null);
        solicitado = !!res.data?.solicitud_enviada_at;
        intro.openNow();
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
      ]);
      setLoading(false);
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

  if (loading) {
    return <RecorridoLoading />;
  }

  const yaSolicitado = !!estado?.solicitud_enviada_at;
  const yaConPdf = !!estado?.link_carta;

  // Etiquetas de los botones del header según estado
  const camposCompletos = !!dia && !!mes && !!anio && !!hora && !!pais.trim() && !!lugar.trim() && !!region.trim();
  // «Home» = la casa de quien mira: el panel si es admin, el home del recorrido
  // si no (rutaHome()). Antes iba siempre al del recorrido.
  const headerPrev = { label: "← Home", onClick: () => navigate(rutaHome()) };
  const headerExtra = {
    label: "Ilustraciones",
    onClick: () => setComicAstroOpen(true),
    icon: <EyeIcon />,
  };
  const headerNext = (yaConPdf || yaSolicitado)
    // Antes de pasar a «Lo primero de tu carta» intercalamos el cómic de los signos.
    ? { label: <TituloPaso2 flecha />, onClick: () => setComicSignosOpen(true) }
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
              title="Astrología"
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 1, total: 9 }}
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
                  Cambiar
                </Box>
                </Flex>
              </Box>
            </Reveal>
          )}

          {/* ── Tras enviar la solicitud: cómic "¿Qué es una carta astral?" con la
                MISMA caja que las Ilustraciones (la trae el propio componente, por
                eso aquí NO se envuelve en la caja espacial, para no anidar dos). ── */}
          {yaSolicitado && !editando && (
            <Reveal
              direction="up"
              distance={34}
              scaleFrom={0.97}
              delay={0.12}
              duration={0.75}
              position="relative"
              w="100%"
            >
              <TextoCartaExplicativo color={astrologiaTxt} />
            </Reveal>
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
                    <Text color={astrologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em" textAlign="center"
                          style={{ textShadow: `0 0 14px rgba(255,255,255,0.55), 0 0 30px rgba(255,255,255,0.28), 0 0 60px ${astrologiaTxt}55` }}>
                      {editando ? "Corrige tus datos" : "Tu Carta Astral"}
                    </Text>
                  </RevealItem>
                  <RevealItem>
                    <Text color={`${astrologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" textAlign="center" maxW="600px" mx="auto"
                          style={{ textShadow: `0 0 10px rgba(255,255,255,0.4), 0 0 22px rgba(255,255,255,0.2)` }}>
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
                      Fecha de nacimiento
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
                          placeholder="Día"
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
                          placeholder="Mes"
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
                          placeholder="Año"
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
                      Hora de nacimiento
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
                    <Campo label="País" value={pais} onChange={setPais} color={astrologiaTxt} placeholder="Ej: España" />
                  </RevealItem>
                  <RevealItem display="flex" flexDirection={{ base: "column", md: "row" }} gap={4}>
                    <Campo label="Lugar (ciudad)" value={lugar} onChange={setLugar} color={astrologiaTxt} placeholder="Ej: Madrid" />
                    <Campo label="Región / provincia" value={region} onChange={setRegion} color={astrologiaTxt} placeholder="Ej: Comunidad de Madrid" />
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
                        Cancelar
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

      {/* Cómic de los signos: intercalado antes de «Lo primero de tu carta». */}
      <ComicPasoModal
        isOpen={comicSignosOpen}
        onClose={() => setComicSignosOpen(false)}
        onContinue={() => navigate("/metodo/astrologia/solascendenteluna")}
        vinetas={VINETAS_SIGNOS}
        continueLabel={<TituloPaso2 />}
        themeColor={astrologiaTxt}
      />

      {/* Intro: cómic del Origen según la espiritualidad. Al terminar (o pulsar
          el botón de continuar) encadena el segundo cómic, «La Historia de la
          Astrología». La X salta toda la intro y entra a la disciplina. */}
      <IntroComicModal
        isOpen={intro.open}
        vinetas={ORIGEN_ESPIRITUALIDAD}
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
        vinetas={HISTORIA_ASTROLOGIA}
        onClose={() => setHistoriaOpen(false)}
        continueLabel="Astrología"
        continueBgImage={SPACE_IMG}
        onContinue={() => setHistoriaOpen(false)}
        onComplete={() => setHistoriaOpen(false)}
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
                  ¿Seguro que estos son tus datos?
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
                    Volver a revisar
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
                <Box as="button" onClick={() => setProcesoOpen(false)}
                     px={8} py={2.5} borderRadius="full" bg={astrologiaTxt} color="#0a0a1a"
                     border={`1px solid ${astrologiaTxt}88`} fontFamily="'EB Garamond', serif" fontWeight="700"
                     letterSpacing="0.06em" cursor="pointer" boxShadow={`0 0 18px ${astrologiaTxt}66`}
                     _hover={{ boxShadow: `0 0 28px ${astrologiaTxt}88`, transform: "translateY(-1px)" }} transition="all 0.2s">
                  Aceptar
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      )}

      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom} precio={20}
                     llamadaTitulo="Reserva tu llamada de astrología" queEsEsto={QUE_ES_ESTO} />
      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}

/* ── Componentes auxiliares ── */

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

