import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { TcmComicModal } from "../../components/metodo/QigongComicModal";
import { CINCO_ANIMALES_VINETAS, HISTORIA_QIGONG_VINETAS } from "../../components/metodo/tcmQigongContenido";
import { useComic } from "../../i18n/comics";
import { Reveal } from "../../components/global/Reveal";
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
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

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
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        // El recorrido guarda un blob único; si aún no hay datos, se abre en Madera.
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
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

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW={ANCHO} gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title={t("metodo.tcm.cocina.titulo")}
            pageLabel="8/11"
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
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={2} maxW="700px">
            <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  textAlign="center">
              {t("metodo.tcm.cocina.cita")}
            </Text>
            <Text color="white" fontSize={{ base: "sm", md: "md" }} textAlign="center" opacity={0.85}>
              {t("metodo.tcm.cocina.citaAutor")} <Box as="span" fontStyle="italic">{t("metodo.tcm.cocina.citaObra")}</Box>
            </Text>
          </Flex>
          </Reveal>

          {/* ── SELECTOR · los cinco elementos ── */}
          <Reveal direction="up" distance={22} delay={0.2} duration={0.68} w="100%">
          <Flex justify="center" wrap="wrap" gap={{ base: 3, md: 6 }} w="100%">
            {ORDEN_ELEMENTOS.map((el) => (
              <BotonElemento key={el} elemento={el} activo={el === elActivo} onClick={() => setElActivo(el)} />
            ))}
          </Flex>
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
                      duration={0.68} amount={0.12} w="100%" h="100%">
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

      {/* Las formas de cocinar del elemento, en el cómic de la disciplina: una
          viñeta por cocción (foto + el cómo y el por qué). Se abre por la que se
          ha pulsado y desde ahí se navega adelante y atrás con las flechas. */}
      <TcmComicModal
        isOpen={coccionAbierta !== null}
        vinetas={coccionVinetas}
        initialIndex={coccionAbierta ?? 0}
        onClose={() => setCoccionAbierta(null)}
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
// La tarjeta de acción de la página: un solo gesto de los cinco que tiene el
// elemento, con «dame otro» para pasar al siguiente y un tick para marcarlo.
//
// El tick guarda el DÍA, no un sí/no: mañana vuelve a estar por hacer. Es la
// diferencia entre un hábito diario y una casilla que se marca una vez y ya.
//
// Aquí dentro hubo un tiempo la lista de «Ingredientes que aportar» del
// elemento. Se ha quitado (de los cinco elementos): la caja es de HACER una
// cosa hoy, y la lista de la compra la convertía otra vez en algo que leer.
//
// Al cambiar de elemento la tarjeta se remonta (`key` en el padre no hace falta:
// el índice y el «hecho» vienen de `estado`, que ya es del elemento activo).
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
    <Reveal direction="up" distance={22} delay={0.26} duration={0.68} w="100%">
      <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
           border={`1.5px solid ${E.color}`}
           boxShadow={`${CAJA_GLOW}, 0 0 26px ${E.color}44`}>
        <FondoElemento elemento={elemento} />

        <Flex position="relative" zIndex={1} direction="column" gap={4}
              px={{ base: 6, md: 9 }} py={{ base: 6, md: 7 }}>
          <Flex align="center" gap={3}>
            <Rotulo>{t("metodo.tcm.cocina.gestoHoy")}</Rotulo>
            <Box h="1px" flex="1" mb={2.5} bgGradient={`linear(to-r, ${E.color}88, transparent)`} />
          </Flex>

          {/* El gesto. `key` para que cada uno entre en escena al rotar. */}
          <Text key={`${elemento}-${i}`} color="white" fontSize={{ base: "lg", md: "2xl" }}
                fontStyle="italic" lineHeight="1.7" minH={{ base: "auto", md: "5.1em" }}
                sx={{ "@keyframes gestoIn": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)", animation: "gestoIn 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
            {gestos[i]}
          </Text>

          <Flex align="center" justify="space-between" gap={4} wrap="wrap">
            {/* Dame otro */}
            <Flex as="button" onClick={() => onCambiar({ i: i + 1 })} align="center" gap={2}
                  px={{ base: 4, md: 5 }} py={2} borderRadius="full"
                  border={`1.5px solid ${E.color}aa`} bg="rgba(0,0,0,0.28)"
                  cursor="pointer" transition="all 0.18s"
                  sx={{ backdropFilter: "blur(4px)" }}
                  _hover={{ borderColor: E.color, bg: "rgba(0,0,0,0.44)", transform: "translateY(-1px)" }}>
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                   w="17px" h="17px" fill={E.color} flexShrink={0}
                   style={{ filter: `drop-shadow(0 1px 4px rgba(0,0,0,0.9))` }}>
                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
              </Box>
              <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight={700}
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                {t("metodo.tcm.cocina.dameOtro")}
              </Text>
              <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontWeight={700}>
                {i + 1}/{gestos.length}
              </Text>
            </Flex>

            {/* Hecho hoy */}
            <Flex as="button"
                  onClick={() => onCambiar({ hecho: hecho ? "" : hoyISO() })}
                  align="center" gap={2.5}
                  px={{ base: 4, md: 5 }} py={2} borderRadius="full"
                  border={`1.5px solid ${hecho ? E.color : "rgba(255,255,255,0.45)"}`}
                  bg={hecho ? `${E.color}55` : "rgba(0,0,0,0.28)"}
                  cursor="pointer" transition="all 0.18s"
                  sx={{ backdropFilter: "blur(4px)" }}
                  _hover={{ borderColor: E.color, transform: "translateY(-1px)" }}
                  aria-pressed={hecho}>
              <Flex flexShrink={0} align="center" justify="center" w="20px" h="20px" borderRadius="full"
                    border={`2px solid ${hecho ? E.color : "rgba(255,255,255,0.6)"}`}
                    bg={hecho ? E.color : "transparent"} transition="all 0.18s">
                {hecho && (
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="13px" h="13px" fill="#ffffff">
                    <path d="M382-200 154-428l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                )}
              </Flex>
              <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight={700}
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                {hecho ? t("metodo.tcm.cocina.hechoHoy") : t("metodo.tcm.cocina.loHagoHoy")}
              </Text>
            </Flex>
          </Flex>

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
    <Flex as="button" onClick={onClick} direction="column" align="center" gap={1.5} cursor="pointer"
          transition="transform 0.2s ease" _hover={{ transform: "translateY(-3px)" }}>
      <Box w={{ base: "58px", md: "76px" }} h={{ base: "58px", md: "76px" }} borderRadius="full"
           overflow="hidden" border={`${activo ? 3 : 2}px solid ${activo ? "#ffffff" : `${E.color}aa`}`}
           opacity={activo ? 1 : 0.62}
           style={{
             boxShadow: activo ? `0 0 20px ${E.color}, 0 0 34px ${E.color}66` : `0 0 8px ${E.color}66`,
             transition: "all 0.25s ease",
           }}>
        <img src={ICONO_ELEMENTO[elemento]} alt={E.nombre}
             style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Box>
      <Text color="white" fontSize={{ base: "xs", md: "sm" }} fontWeight={activo ? 800 : 600}
            opacity={activo ? 1 : 0.75} style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
        {E.nombre}
      </Text>
    </Flex>
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
  const E = ELEMENTOS[elemento];

  return (
    <Box as="button" onClick={onVer} textAlign="left" position="relative" w="100%" h="100%"
         display="flex" flexDirection="column" borderRadius="2xl" overflow="hidden" cursor="pointer"
         fontFamily="'EB Garamond', serif" boxShadow={CAJA_GLOW} transition="all 0.22s ease"
         role="group"
         _hover={{ transform: "translateY(-4px)", boxShadow: `${CAJA_GLOW}, 0 0 26px ${E.color}44` }}
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

// ── Rótulo de apartado dentro de una caja ────────────────────────────────────
// BLANCO, nunca del color del elemento: en minúsculas de 12px y sobre la
// acuarela, los colores de los cinco elementos (el ocre de la Tierra, el gris
// del Metal) se perdían y el rótulo no se leía. Blanco con sombra negra se lee
// en los cinco.
function Rotulo({ children, mt }: { children: React.ReactNode; mt?: any }) {
  return (
    <Text color="white" fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase"
          mt={mt} mb={2.5} style={{ textShadow: INK_SHADOW }}>
      {children}
    </Text>
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
