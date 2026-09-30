import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { TcmComicModal } from "../../components/metodo/QigongComicModal";
import { CINCO_ANIMALES_VINETAS, HISTORIA_QIGONG_VINETAS } from "../../components/metodo/tcmQigongContenido";
import { useComic } from "../../i18n/comics";
import { Reveal, RevealStagger, RevealItem, Pop } from "../../components/global/Reveal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, elementoMasCargado, type DatosTcm, type Elemento,
} from "../../components/metodo/tcmRecorrido";
import { ICONO_ELEMENTO, FOTO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";
import { FOTO_COCINA, type Coccion } from "../../components/metodo/tcmCocinaContenido";
import { useCocina, useCocinaNota } from "../../components/metodo/tcmCocinaEn";
import { useContenidoElemento } from "../../components/metodo/tcmElementosEn";
import { useT } from "../../i18n";

// Sombra del texto DENTRO de las cajas: NEGRA, no del turquesa de la disciplina.
// Las cajas llevan detrás la acuarela del elemento (clara en Tierra y Metal), y
// una sombra de color no separaba la letra del fondo: se leía a medias. Negra
// funciona con las cinco.
const INK_SHADOW = "0 1px 3px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.8)";
// Glow discreto: un halo blanco corto y nada más (antes sumaba cinco capas, con
// menta y tinta, y las cajas se veían envueltas en una nube turquesa).
const CAJA_GLOW = `0 0 12px rgba(255,255,255,0.10), 0 0 28px rgba(255,255,255,0.05)`;

// Toda la página vive dentro del mismo ancho que el header del recorrido
// (MetodoStepHeader va a 850px): ningún box se sale de esa columna.
const ANCHO = "850px";

/** Hoy en aaaa-mm-dd (hora local, no UTC: a las 23:00 de aquí sigue siendo hoy). */
function hoyISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function MetodoTcmRecetas() {
  const t = useT();
  // La línea del tiempo del Qigong, en el idioma activo.
  const historiaVinetas = useComic("tcm-qigong-historia", HISTORIA_QIGONG_VINETAS);
  const animalesVinetas = useComic("tcm-cinco-animales", CINCO_ANIMALES_VINETAS);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Se abre por el elemento que hoy más te pide atención; luego el usuario elige.
  const [elActivo, setElActivo] = useState<Elemento>("madera");
  // El blob ENTERO del recorrido: hay que devolverlo completo en cada PATCH,
  // porque el backend reemplaza `data` de una pieza.
  const [datos, setDatos] = useState<DatosTcm>({});
  // La cocina del elemento activo y su nota al pie, en el idioma activo. Son
  // hooks, así que van AQUÍ ARRIBA: por debajo hay un return temprano con el
  // loader y no se pueden llamar después de él.
  const cocina = useCocina(elActivo);
  const cocinaNota = useCocinaNota();
  // Solo para el antetítulo del cómic: el nombre del elemento traducido.
  const nombreElemento = useContenidoElemento(elActivo)?.nombre ?? ELEMENTOS[elActivo].nombre;
  // El paso de aquí a Qigong son DOS cómics seguidos, en este orden:
  //   1. «historia»  → el ORIGEN del Qigong (veintitrés siglos en nueve viñetas).
  //   2. «animales»  → los CINCO ANIMALES de Hua Tuo, uno por elemento.
  // Van juntos a propósito: los animales nacen de esa historia (Hua Tuo es uno
  // de sus hitos), así que se leen del tirón antes de entrar en Qigong. Antes
  // los animales se veían al SALIR de Qigong hacia Cursos; se han mudado aquí
  // para no verlos dos veces en la misma visita.
  // null = ningún cómic abierto.
  const [comicPaso, setComicPaso] = useState<"historia" | "animales" | null>(null);
  // Cómic de las FORMAS DE COCINAR del elemento activo: guarda por qué cocción
  // se ha abierto (null = cerrado). Dentro se pasa de una a otra con las flechas
  // del visor, así que basta con recordar la de entrada.
  const [coccionAbierta, setCoccionAbierta] = useState<number | null>(null);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        // Las dos peticiones a la vez, no en cascada: la página suelta antes el loader.
        // El recorrido guarda un blob único; si aún no hay datos, se abre en Madera.
        const [me, res] = await Promise.all([
          getUserMe(),
          axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        const d: DatosTcm = res.data?.data ?? {};
        setDatos(d);
        setElActivo(elementoMasCargado(d));
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Guarda el estado del gesto del elemento activo (qué gesto y si está hecho
  // hoy). Autoguardado, como el resto del recorrido: no hay botón de guardar.
  const guardarGesto = async (el: Elemento, cambio: { i?: number; hecho?: string }) => {
    const next: DatosTcm = {
      ...datos,
      cocinaGesto: {
        ...(datos.cocinaGesto ?? {}),
        [el]: { ...(datos.cocinaGesto?.[el] ?? {}), ...cambio },
      },
    };
    setDatos(next);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    try {
      await axios.patch(`${API_URL}/metodo-tcm/${userId}`, { data: next },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* el estado local ya refleja el cambio */ }
  };

  // Igual que en el resto del recorrido: no quitamos el loader hasta tener los
  // iconos y los fondos de los elementos descargados.
  const imagenesListas = usePrecargarImagenes([
    ...ORDEN_ELEMENTOS.map((el) => ICONO_ELEMENTO[el]),
    ...ORDEN_ELEMENTOS.map((el) => FOTO_ELEMENTO[el]),
  ]);

  if (loading || !imagenesListas) {
    return <TcmLoading />;
  }

  // Las viñetas del cómic de las cocciones: una por forma de cocinar, en el
  // mismo orden que las tarjetas (por eso el índice de la tarjeta vale como
  // `initialIndex`). El antetítulo es el elemento, para no perder de vista de
  // quién es esta cocina mientras se lee a pantalla completa.
  const coccionVinetas = cocina.cocciones.map((c, i) => ({
    src: FOTO_COCINA(elActivo, i),
    eyebrow: nombreElemento,
    titulo: c.nombre,
    paragraphs: [c.como, c.porque],
  }));

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW={ANCHO} gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title={t("metodo.tcm.cocina.titulo")}
            pageLabel="9/12"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            maxW={ANCHO}
            mb={0}
            prev={{ label: `← ${t("metodo.tcm.paso.taoismo")}`, onClick: () => navigate("/metodo/tcm/taoismo") }}
            extra={ilustracionesBtn}
            next={{ label: `${t("metodo.tcm.paso.qigong")} →`, onClick: () => setComicPaso("historia") }}
          />
          </Reveal>

          {/* Cita bajo el header · sin sombra (va sobre el turquesa limpio) */}
          {/* La cita entra primero y el autor llega un instante después. */}
          <Flex direction="column" align="center" gap={2} maxW="700px">
            <Reveal direction="up" distance={20} blur delay={0.12} duration={0.75}>
            <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  textAlign="center">
              {t("metodo.tcm.cocina.cita")}
            </Text>
            </Reveal>
            <Reveal direction="up" distance={12} delay={0.5} duration={0.65}>
            <Text color="white" fontSize={{ base: "sm", md: "md" }} textAlign="center" opacity={0.85}>
              {t("metodo.tcm.cocina.citaAutor")} <Box as="span" fontStyle="italic">{t("metodo.tcm.cocina.citaObra")}</Box>
            </Text>
            </Reveal>
          </Flex>

          {/* ── SELECTOR · los cinco elementos ──
              Dentro de un box con la pintura de TCM de fondo (velos finos,
              hex-alpha), como el resto de cajas del recorrido: los círculos
              flotando sobre el turquesa quedaban sueltos. */}
          <Reveal direction="up" distance={22} delay={0.2} duration={0.68} w="100%">
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Box position="absolute" inset={0} bg={`${tcmBg}66`} />
            <Box position="absolute" inset={0} bg="#00000040" />
            {/* En móvil los CINCO en una sola línea (círculos más pequeños y sin
                wrap: con el tamaño grande, el Agua se caía a una segunda fila). */}
            {/* Los cinco florecen uno tras otro (pop con rebote). */}
            <RevealStagger stagger={0.1} delayChildren={0.35} position="relative"
                  display="flex" justifyContent="center" flexWrap={{ base: "nowrap", md: "wrap" }} gap={{ base: 2, md: 6 }}
                  w="100%" px={{ base: 3, md: 6 }} py={{ base: 5, md: 6 }}>
              {ORDEN_ELEMENTOS.map((el) => (
                <RevealItem key={el} direction="up" distance={18} scaleFrom={0.6}>
                  <BotonElemento elemento={el} activo={el === elActivo} onClick={() => setElActivo(el)} />
                </RevealItem>
              ))}
            </RevealStagger>
          </Box>
          </Reveal>

          {/* ── UN GESTO PARA HOY ──
              Lo único de la página que se HACE en vez de leerse. Enseña un solo
              gesto de `cadaDia` (hay cinco por elemento), con «dame otro» para
              rotar y un tick que se apaga solo al día siguiente. */}
          <GestoDeHoy
            elemento={elActivo}
            gestos={cocina.cadaDia}
            estado={datos.cocinaGesto?.[elActivo]}
            onCambiar={(cambio) => void guardarGesto(elActivo, cambio)}
          />

          {/* ── CÓMO SE COCINA PARA ESTE ELEMENTO · una sola línea ──
              Antes esto era una caja entera («La cocina de la X», con el sabor y
              los órganos) y, debajo, el título «Ingredientes que aportar» con
              cuatro cajas de alimentos. Los ingredientes ya no están en la
              página —ni aquí ni dentro de «Un gesto para hoy»—, así que de todo
              aquello queda solo esta frase. Va FUERA de las cajas: blanca y sin
              sombra, como el resto del texto sobre el turquesa. */}
          <Reveal key={`principio-${elActivo}`} inView direction="up" distance={12} duration={0.6} amount={0.4}
                  display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.85"
                  textAlign="center" maxW="720px">
              {cocina.principio}
            </Text>
          </Reveal>

          {/* ── FORMAS DE COCINAR ──
              Solo las tarjetas: foto de la cocción arriba, título abajo y el
              botón «Ver» a la derecha. El texto (el cómo y el por qué) ya no se
              lee aquí: se abre en el cómic inmersivo del elemento, por la
              cocción que se haya pulsado, y allí se pasa de una a otra con las
              flechas. La página se queda mirable de un vistazo. */}
          <Seccion>{t("metodo.tcm.cocina.formas")}</Seccion>
          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
               gap={{ base: 5, md: 6 }} w="100%">
            {cocina.cocciones.map((c, i) => (
              <Reveal key={`${elActivo}-${c.key}`} inView direction="up" distance={24} scaleFrom={0.98}
                      duration={0.68} amount={0.12} delay={(i % 2) * 0.1} w="100%" h="100%">
                <CoccionBox coccion={c} elemento={elActivo} numero={i} onVer={() => setCoccionAbierta(i)} />
              </Reveal>
            ))}
          </Box>

          {/* ── NOTA FINAL ── */}
          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="680px"
                lineHeight="1.7">
            {cocinaNota} {t("metodo.tcm.cocina.aviso")}
          </Text>
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* Las formas de cocinar del elemento, en el cómic inmersivo: una viñeta
          por cocción (foto + el cómo y el por qué). Se abre por la que se ha
          pulsado y desde ahí se navega adelante y atrás con las flechas. El
          fondo —pantalla completa y box— es la acuarela DEL ELEMENTO activo,
          como en el cómic de los elementos, no la foto genérica de TCM. */}
      <TcmComicModal
        isOpen={coccionAbierta !== null}
        vinetas={coccionVinetas}
        initialIndex={coccionAbierta ?? 0}
        onClose={() => setCoccionAbierta(null)}
        bgImage={FOTO_ELEMENTO[elActivo]}
        color={ELEMENTOS[elActivo].color}
      />

      {/* 1 · Cómic del ORIGEN del Qigong: veintitrés siglos en nueve viñetas.
          Antes se leía dentro de la página de Qigong (línea del tiempo + cómic
          por hito); ahora se ve entero al salir de aquí, como paso intercalado.
          Al terminarlo (o con «Los animales →») NO se navega todavía: empieza
          el segundo cómic. La X sí cierra del todo y deja la página como
          estaba. */}
      <ComicPasoModal
        isOpen={comicPaso === "historia"}
        onClose={() => setComicPaso(null)}
        onContinue={() => setComicPaso("animales")}
        vinetas={historiaVinetas}
        continueLabel="Los animales"
        themeColor={tcmTxt}
        textColor={tcmTxt}
        disciplinaBgImage="/img/fondos/tcm.webp"
        disciplinaBgColor={tcmBg}
        textShadow={INK_SHADOW}
      />

      {/* 2 · Los CINCO ANIMALES de Hua Tuo, justo detrás de la historia: un
          animal por viñeta y por elemento. Este sí desemboca en Qigong. */}
      <ComicPasoModal
        isOpen={comicPaso === "animales"}
        onClose={() => setComicPaso(null)}
        onContinue={() => navigate("/metodo/tcm/qigong")}
        vinetas={animalesVinetas}
        continueLabel="Qigong"
        themeColor={tcmTxt}
        textColor={tcmTxt}
        disciplinaBgImage="/img/fondos/tcm.webp"
        disciplinaBgColor={tcmBg}
        textShadow={INK_SHADOW}
      />

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ── «Un gesto para hoy» ──────────────────────────────────────────────────────
// La tarjeta de acción de la página: los CINCO gestos del elemento a la vista,
// en filas finas, y se ELIGE uno (radio). El tick «Lo hago hoy» va compacto en
// la cabecera. Antes se veía un solo gesto grande con «dame otro» para rotar:
// la caja era altísima y los otros cuatro no se veían.
//
// El tick guarda el DÍA, no un sí/no: mañana vuelve a estar por hacer. Es la
// diferencia entre un hábito diario y una casilla que se marca una vez y ya.
//
// Se persiste igual que siempre (`cocinaGesto[el] = { i, hecho }`): elegir una
// fila guarda su índice, así que lo ya guardado de cada usuaria sigue valiendo.
function GestoDeHoy({ elemento, gestos, estado, onCambiar }: {
  elemento: Elemento;
  gestos: string[];
  estado?: { i?: number; hecho?: string };
  onCambiar: (cambio: { i?: number; hecho?: string }) => void;
}) {
  const t = useT();
  const E = ELEMENTOS[elemento];
  if (!gestos.length) return null;

  const i = ((estado?.i ?? 0) % gestos.length + gestos.length) % gestos.length;
  const hecho = estado?.hecho === hoyISO();

  return (
    // `key={elemento}`: al cambiar de elemento, la caja y sus filas VUELVEN a
    // entrar en cascada, en vez de cambiar de texto de golpe.
    <Reveal key={elemento} direction="up" distance={22} delay={0.26} duration={0.68} w="100%">
      <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
           border={`1.5px solid ${E.color}`}
           boxShadow={CAJA_GLOW}>
        <FondoElemento elemento={elemento} />

        <Flex position="relative" zIndex={1} direction="column" gap={3}
              px={{ base: 4, md: 7 }} py={{ base: 4, md: 5 }}>
          {/* Cabecera: rótulo · línea · tick de hecho, todo en una fila */}
          <Flex align="center" gap={3} wrap="wrap">
            <Text color="white" fontSize="xs" fontWeight={700} letterSpacing="0.1em"
                  textTransform="uppercase" style={{ textShadow: INK_SHADOW }}>
              {t("metodo.tcm.cocina.gestoHoy")}
            </Text>
            <Box h="1px" flex="1" minW="40px" bgGradient={`linear(to-r, ${E.color}88, transparent)`} />
            <Pop levanta={2}>
            <Flex as="button"
                  onClick={() => onCambiar({ hecho: hecho ? "" : hoyISO() })}
                  align="center" gap={2}
                  px={3.5} py={1.5} borderRadius="full"
                  border={`1.5px solid ${hecho ? E.color : "rgba(255,255,255,0.45)"}`}
                  bg={hecho ? `${E.color}55` : "rgba(0,0,0,0.28)"}
                  cursor="pointer" transition="all 0.18s"
                  sx={{ backdropFilter: "blur(4px)" }}
                  _hover={{ borderColor: E.color, transform: "translateY(-1px)" }}
                  aria-pressed={hecho}>
              <Flex flexShrink={0} align="center" justify="center" w="16px" h="16px" borderRadius="full"
                    border={`2px solid ${hecho ? E.color : "rgba(255,255,255,0.6)"}`}
                    bg={hecho ? E.color : "transparent"} transition="all 0.18s">
                {hecho && (
                  // El tick BROTA al marcarlo (giro + rebote): es el momento de
                  // recompensa de la página.
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="11px" h="11px" fill="#ffffff"
                       sx={{
                         "@keyframes tickBrota": {
                           "0%": { transform: "scale(0) rotate(-50deg)", opacity: 0 },
                           "65%": { transform: "scale(1.35) rotate(6deg)", opacity: 1 },
                           "100%": { transform: "scale(1) rotate(0)", opacity: 1 },
                         },
                         animation: "tickBrota 0.45s cubic-bezier(0.34,1.56,0.64,1)",
                       }}>
                    <path d="M382-200 154-428l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                )}
              </Flex>
              <Text color="white" fontSize={{ base: "xs", md: "sm" }} fontWeight={700}
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                {hecho ? t("metodo.tcm.cocina.hechoHoy") : t("metodo.tcm.cocina.loHagoHoy")}
              </Text>
            </Flex>
            </Pop>
          </Flex>

          {/* Los cinco gestos, en filas finas. Se elige UNO: la fila marcada
              lleva el color del elemento; el resto esperan, atenuadas. */}
          <RevealStagger stagger={0.08} delayChildren={0.5} display="flex" flexDirection="column" gap={1.5}>
            {gestos.map((g, idx) => {
              const sel = idx === i;
              return (
                <RevealItem key={idx} direction="left" distance={16}>
                <Flex as="button" onClick={() => onCambiar({ i: idx })}
                      align="center" gap={2.5} textAlign="left" w="100%"
                      px={{ base: 3, md: 3.5 }} py={{ base: 1.5, md: 2 }} borderRadius="lg"
                      border={`1px solid ${sel ? E.color : "rgba(255,255,255,0.16)"}`}
                      bg={sel ? "rgba(0,0,0,0.42)" : "rgba(0,0,0,0.2)"}
                      opacity={sel ? 1 : 0.7}
                      cursor="pointer" transition="all 0.18s"
                      _hover={{ opacity: 1, borderColor: `${E.color}aa` }}
                      aria-pressed={sel}>
                  <Box flexShrink={0} w="13px" h="13px" borderRadius="full"
                       border={`2px solid ${sel ? E.color : "rgba(255,255,255,0.5)"}`}
                       bg={sel ? E.color : "transparent"}
                       boxShadow={sel ? `0 0 8px ${E.color}` : "none"}
                       transition="all 0.18s" />
                  <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                        fontWeight={sel ? 600 : 400} lineHeight="1.5"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                    {g}
                  </Text>
                </Flex>
                </RevealItem>
              );
            })}
          </RevealStagger>

          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic"
                style={{ textShadow: INK_SHADOW }}>
            {hecho
              ? "Mañana vuelve a estar por hacer: de eso va."
              : "Uno solo. Los otros cuatro seguirán aquí mañana."}
          </Text>

        </Flex>
      </Box>
    </Reveal>
  );
}

// ── Botón de un elemento en el selector (icono + nombre) ─────────────────────
function BotonElemento({ elemento, activo, onClick }: {
  elemento: Elemento; activo: boolean; onClick: () => void;
}) {
  const E = ELEMENTOS[elemento];
  return (
    <Pop levanta={4} hunde={0.94}>
    <Flex as="button" onClick={onClick} direction="column" align="center" gap={1.5} cursor="pointer">
      {/* El elegido late con el color de SU elemento (halo que se abre y se
          recoge); los demás esperan, atenuados, y se encienden al pasar. */}
      <Box w={{ base: "50px", md: "76px" }} h={{ base: "50px", md: "76px" }} borderRadius="full"
           overflow="hidden" border={`${activo ? 3 : 2}px solid ${activo ? "#ffffff" : `${E.color}aa`}`}
           opacity={activo ? 1 : 0.62}
           transition="opacity 0.25s ease, border-color 0.25s ease"
           _hover={{ opacity: 1 }}
           sx={activo ? {
             "@keyframes elementoLatido": {
               "0%, 100%": { boxShadow: `0 0 10px ${E.color}99, 0 0 0 0 ${E.color}55` },
               "50%": { boxShadow: `0 0 22px ${E.color}, 0 0 0 8px ${E.color}00` },
             },
             animation: "elementoLatido 2.6s ease-in-out infinite",
           } : undefined}>
        <img src={ICONO_ELEMENTO[elemento]} alt={E.nombre}
             style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Box>
      <Text color="white" fontSize={{ base: "xs", md: "sm" }} fontWeight={activo ? 800 : 600}
            opacity={activo ? 1 : 0.75} style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
        {E.nombre}
      </Text>
    </Flex>
    </Pop>
  );
}

// ── Tarjeta de una forma de cocinar ──────────────────────────────────────────
// La tarjeta de la casa para las cosas con foto (la de FotoBox): ilustración
// CUADRADA arriba a sangre, línea a todo el ancho y el título en el pie.
//
// Aquí no se lee nada más: el cómo y el por qué se leen en el cómic inmersivo,
// que se abre por esta cocción. Antes cada tarjeta traía los dos textos al lado
// de la foto y la página era un muro.
//
// SIN botón «Ver»: la tarjeta entera ya es el botón, así que el rótulo solo
// repetía. Lo que invita a pulsar es el zoom lento de la foto al pasar el
// puntero por encima. Si la foto todavía no existe, se cae a la acuarela del
// elemento, que ya está detrás.
function CoccionBox({ coccion, elemento, numero, onVer }: {
  coccion: Coccion; elemento: Elemento; numero: number; onVer: () => void;
}) {
  const [sinFoto, setSinFoto] = useState(false);

  return (
    <Box as="button" onClick={onVer} textAlign="left" position="relative" w="100%" h="100%"
         display="flex" flexDirection="column" borderRadius="2xl" overflow="hidden" cursor="pointer"
         fontFamily="'EB Garamond', serif" boxShadow={CAJA_GLOW} transition="all 0.22s ease"
         role="group"
         _hover={{ transform: "translateY(-4px)" }}
         _active={{ transform: "translateY(-1px)" }}>
      <FondoElemento elemento={elemento} />

      {/* Ilustración cuadrada, a sangre */}
      <Box position="relative" zIndex={1} w="100%" flexShrink={0} overflow="hidden"
           bg={`${tcmBg}88`} sx={{ aspectRatio: "1" }}>
        {!sinFoto && (
          <Image src={encodeURI(FOTO_COCINA(elemento, numero))} alt={coccion.nombre}
                 w="100%" h="100%" objectFit="cover" onError={() => setSinFoto(true)}
                 transition="transform 0.55s cubic-bezier(0.22,1,0.36,1)"
                 _groupHover={{ transform: "scale(1.06)" }} />
        )}
      </Box>

      {/* Línea separadora a todo el ancho */}
      <Box position="relative" zIndex={1} h="1px" flexShrink={0} bg="rgba(255,255,255,0.35)" />

      {/* Pie: solo el título. */}
      <Flex position="relative" zIndex={1} flex="1" align="center"
            px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}>
        <Text color="white" fontWeight={800} fontSize={{ base: "md", md: "lg" }} lineHeight="1.3"
              letterSpacing="0.02em" noOfLines={1} style={{ textShadow: INK_SHADOW }}>
          {coccion.nombre}
        </Text>
      </Flex>
    </Box>
  );
}

// ── Título de sección · va FUERA de las cajas: blanco y sin sombra ───────────
function Seccion({ children }: { children: React.ReactNode }) {
  return (
    <Reveal inView direction="up" distance={12} duration={0.55} amount={0.5} display="flex" justifyContent="center">
      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} letterSpacing="0.04em"
            textAlign="center">
        {children}
      </Text>
    </Reveal>
  );
}

// ── Fondo de caja · la foto DEL ELEMENTO, no la de la disciplina ─────────────
// Cada elemento tiñe su página entera: las cajas llevan su acuarela de fondo
// con un velo negro encima para que el texto se lea sin pelearse con la foto.
function FondoElemento({ elemento }: { elemento: Elemento }) {
  return (
    <>
      <Box key={`bg-${elemento}`} position="absolute" inset={0}
           bgImage={`url('${encodeURI(FOTO_ELEMENTO[elemento])}')`} bgSize="cover" bgPosition="center"
           sx={{ "@keyframes bgIn": { from: { opacity: 0 }, to: { opacity: 1 } } }}
           style={{ animation: "bgIn 0.5s ease" }} />
      <Box position="absolute" inset={0} bg="rgba(0,0,0,0.66)" />
    </>
  );
}

// Aquí vivía `Panel`, el box común de las cuatro cajas de ingredientes. Ya no
// hace falta: los ingredientes se pintan dentro de «Un gesto para hoy».
