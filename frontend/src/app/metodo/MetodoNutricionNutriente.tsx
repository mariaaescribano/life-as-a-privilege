import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useT } from "../../i18n";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { NutrienteIlustracionModal } from "../../components/metodo/NutrienteIlustracionModal";
import { NutrienteCirculo } from "../../components/metodo/NutrienteCirculo";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { glowHeader } from "../../components/metodo/FotoBox";
import { comicNutrienteByKey } from "../../components/metodo/comicsNutrientes";
import { useComic } from "../../i18n/comics";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { NUTRIENTES, rutaListaNutriente, type NutrienteTarjeta } from "../../hardCoded/espacio/NutrientesNutricion";
import { useNutriente } from "../../hardCoded/espacio/useNutrientes";

// ═════════════════════════════════════════════════════════════════════════
// Página de detalle de UN grupo de nutrientes (Carbohidratos, Grasas…).
// Se llega desde /metodo/nutricion/nutrientes al pulsar una tarjeta.
//
// Estructura (en construcción, se irá rellenando):
//   1. Header.
//   2. Box grande: foto del grupo a la izquierda + título y descripción.
//   3. Box tipo cómic: foto a la izquierda + texto a la derecha.
//   4. Tres tarjetas.
//   5. Botón «← Volver», abajo a la izquierda (regla de la casa: volver se
//      ofrece al FINAL de la página, cuando ya has leído).
// ═════════════════════════════════════════════════════════════════════════

// Ilustraciones (cómics) de grupo ya leídas, en metodo_nutricion.data: string[]
// con las keys de los grupos cuyo cómic se ha abierto.
const CAMPO_COMICS = "nutrientes_comics_leidos";

// Botón «← Volver» en la gama de Nutrición (verde), bajo el header. Lleva la
// foto de la disciplina (nutri.png) de fondo, con un velo claro para que el
// texto verde oscuro (nutricionTxt) se lea, y el MISMO halo que la cabecera.
// Vale para los nutrientes primarios y para los secundarios: los dos se pintan
// con esta página (/metodo/nutricion/nutrientes/:key).
function VolverNutri({ onClick }: { onClick: () => void }) {
  const t = useT();
  return (
    <Box
      as="button"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      alignSelf="flex-start"
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={{ base: 4, md: 5 }}
      py={{ base: 2, md: 2.5 }}
      borderRadius="full"
      // Borde con la tinta de la disciplina, como los botones del header: sin él
      // la pastilla se fundía con el fondo claro y no se leía como botón.
      border={`1.5px solid ${nutricionTxt}aa`}
      color={nutricionTxt}
      fontFamily="'EB Garamond', serif"
      fontWeight="600"
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.03em"
      cursor="pointer"
      // El mismo halo que la cabecera. `glowHeader()` es literalmente la cadena
      // que MetodoStepHeader se pone a sí mismo cuando lleva fondo de
      // disciplina, así que tocando allí cambian los dos a la vez.
      boxShadow={glowHeader(nutricionTxt)}
      transition="all 0.18s"
      _hover={{ transform: "translateY(-1px)", borderColor: nutricionTxt }}
    >
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="full" overlay={`${nutricionBg}55`} />
      <Box as="span" position="relative" zIndex={1} display="inline-flex" alignItems="center" gap={2}>
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
             w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill="currentColor" flexShrink={0}>
          <path d="M480-160 160-480l320-320 56 57-223 223h487v80H313l224 224-57 56Z" />
        </Box>
        {t("comun.volver")}
      </Box>
    </Box>
  );
}

// Marco base de sección con el fondo de Nutrición (nutri.png) visible + un velo
// claro suave para que el texto oscuro (nutricionTxt) se lea. Mismo tratamiento
// que las tarjetas de la lista de nutrientes. Reutilizado por las secciones.
function SeccionBox({ children, ...rest }: React.ComponentProps<typeof Box>) {
  return (
    <Box position="relative" overflow="hidden" w="100%" borderRadius="2xl"
         // Mismo glow que la cabecera (halo blanco + menta con el tinte de la
         // disciplina), en vez del glow suave solo-color.
         boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${nutricionTxt}1a, 0 0 48px ${nutricionTxt}10`}
         {...rest}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}55`} />
      <Box position="relative" zIndex={1}>{children}</Box>
    </Box>
  );
}

// Recuadro de imagen placeholder (mientras no haya foto): un icono suave sobre
// un fondo tenue del color del grupo.
function FotoPlaceholder({ label, color }: { label?: string; color: string }) {
  const t = useT();
  const txt = label ?? t("metodo.nutri.foto");
  return (
    <Flex direction="column" align="center" justify="center" gap={2} w="100%" h="100%"
          minH="160px" bg={`${color}1f`} border={`1px dashed ${nutricionTxt}55`} borderRadius="xl">
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill={`${nutricionTxt}88`}>
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
      </Box>
      <Text color={`${nutricionTxt}99`} fontSize="2xs" fontWeight="700" letterSpacing="0.14em"
            textTransform="uppercase">
        {txt}
      </Text>
    </Flex>
  );
}

export default function MetodoNutricionNutriente() {
  const t = useT();
  const navigate = useNavigate();
  const { key } = useParams<{ key: string }>();
  const [loading, setLoading] = useState(true);

  const [fichaIdx, setFichaIdx] = useState<number | null>(null); // tarjeta abierta
  const [comicOpen, setComicOpen] = useState(false); // ilustración (cómic) del grupo
  // La ilustración de este grupo ya está leída (marquita en el botón).
  const [comicLeido, setComicLeido] = useState(false);
  // Y si ya lo estaba ANTES de abrirla, el visor lo dice arriba («✓ Leída»).
  const [comicYaLeido, setComicYaLeido] = useState(false);
  // Fichas de este grupo que ya ha abierto. Es lo que da (o no) el tick.
  const [fichasVistas, setFichasVistas] = useState<number[]>([]);
  // Mismo dato en un ref: el visor avisa de una ficha leída por cada flecha, y
  // dos avisos seguidos leerían el estado antiguo.
  const vistasRef = useRef<number[]>([]);
  // Fichas que YA estaban leídas al abrir el visor (para el aviso «✓ Leída»).
  const [yaVistas, setYaVistas] = useState<number[]>([]);
  const dataRef = useRef<Record<string, any>>({}); // copia del blob para mergear al guardar

  // El grupo en el idioma activo (del inglés sale solo el texto: la foto, el
  // color y el orden de las tarjetas siguen saliendo del español).
  const n = useNutriente(key || "");
  // La ilustración del grupo, en el idioma activo. Se pide aquí arriba y no
  // junto a su uso: allí ya se ha pasado por el `return` de la carga, y los
  // hooks van todos antes del primer return.
  const comic = useComic(`nutriente-${n?.key ?? ""}`, comicNutrienteByKey(n?.key ?? "") ?? []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!n) { navigate("/metodo/nutricion/nutrientes", { replace: true }); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }

        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const data = r.data?.data ?? {};
          dataRef.current = data;
          const previas = data.nutrientes_fichas?.[n.key];
          const vistas = Array.isArray(previas) ? previas.map(Number) : [];
          vistasRef.current = vistas;
          setFichasVistas(vistas);
          const comics = data[CAMPO_COMICS];
          if (Array.isArray(comics) && comics.includes(n.key)) setComicLeido(true);

          // Un grupo SIN tarjetas no tiene subtipos que descubrir: con leerlo ya
          // está revisado, así que se marca al entrar (si no, nunca tendría tick).
          //
          // Y si LAS TIENE TODAS vistas pero el grupo no quedó marcado, se marca
          // ahora. Esto repara a quien se quedó atascado: antes el tick del grupo
          // se guardaba en un PATCH aparte del de las fichas, y si ese PATCH se
          // perdía (dos escrituras a la vez sobre el mismo blob, o cerrar la
          // pestaña justo después) el candado de la página siguiente no se abría
          // NUNCA MÁS: al volver, todas las fichas constaban como leídas, así que
          // `marcarFichaVista` salía por la primera línea y ya no se volvía a
          // comprobar la condición.
          if (!n.tarjetas?.length || vistas.length >= n.tarjetas.length) {
            marcarExplorado(userId, token, n.key);
          }
        } catch { /* sin fila todavía: se creará al guardar */ }

        // No mostramos la página hasta que sus fotos estén descargadas: la foto
        // del grupo, las viñetas del cómic y las fotos de las tarjetas, para que
        // ninguna aparezca de golpe cuando el resto ya está en pantalla.
        await precargarImagenes([
          n.img,
          ...(comicNutrienteByKey(n.key)?.map((v) => v.src) ?? []),
          ...(n.tarjetas?.map((t) => t.foto) ?? []),
        ]);
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, key]);

  /** Escribe el blob entero (el backend lo reemplaza) partiendo de lo último leído. */
  const guardar = (userId: string, token: string, cambios: Record<string, any>) => {
    const data = { ...dataRef.current, ...cambios };
    dataRef.current = data;
    void axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
      { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => { /* se reintenta al volver a entrar */ });
  };

  /** Los cambios que dan el tick a este grupo. Vacío si ya lo tenía.
   *
   *  Devuelve los cambios en vez de guardarlos para poder mandarlos en el MISMO
   *  PATCH que las fichas: el backend reemplaza el blob entero, así que dos
   *  PATCH lanzados a la vez son una carrera y el que llegue último borra lo del
   *  otro. Ese era el fallo por el que el candado no se abría. */
  const cambiosExplorado = (key: string): Record<string, any> => {
    const explorados: string[] = Array.isArray(dataRef.current.nutrientes_explorados)
      ? dataRef.current.nutrientes_explorados : [];
    if (explorados.includes(key)) return {};
    const nuevos = [...explorados, key];
    return {
      nutrientes_explorados: nuevos,
      nutrientes_hecho: nuevos.length >= NUTRIENTES.length,
    };
  };

  /** Da el tick a este grupo (y recalcula si ya están todos). */
  const marcarExplorado = (userId: string, token: string, key: string) => {
    const cambios = cambiosExplorado(key);
    if (Object.keys(cambios).length > 0) guardar(userId, token, cambios);
  };

  /**
   * Abrir una ficha es lo que cuenta.
   *
   * ANTES el tick se daba nada más entrar en la página: quien llegaba a la
   * rejilla se la encontraba entera marcada sin haber visto un solo subtipo, y
   * el candado de la página siguiente se abría solo. Ahora el grupo queda
   * revisado cuando ha abierto TODAS sus fichas; lo que lleva visto se guarda
   * sobre la marcha, así que puede irse y seguir otro día donde lo dejó.
   *
   * Cuenta CADA ficha leída, no solo la tarjeta pulsada: el visor navega por
   * dentro con las flechas y avisa de cada una (`onLeida`), así que las que se
   * leen de paso también se quedan con su marquita.
   */
  const marcarFichaVista = (idx: number) => {
    if (!n?.tarjetas?.length || vistasRef.current.includes(idx)) return;
    const vistas = [...vistasRef.current, idx];
    vistasRef.current = vistas;
    setFichasVistas(vistas);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    // UN solo PATCH con las dos cosas: la ficha leída y, si con esta se completan
    // todas, el tick del grupo. Antes iban en dos escrituras seguidas y, como el
    // backend reemplaza el blob entero, la que llegaba última se llevaba por
    // delante lo de la otra: las fichas quedaban marcadas y el grupo no.
    const cambios: Record<string, any> = {
      nutrientes_fichas: { ...(dataRef.current.nutrientes_fichas ?? {}), [n.key]: vistas },
    };
    if (vistas.length >= n.tarjetas.length) Object.assign(cambios, cambiosExplorado(n.key));
    guardar(userId, token, cambios);
  };

  /**
   * Abre la ficha pulsada. NO la marca aquí: de eso se encarga el visor por
   * cada viñeta que muestra (`onLeida`). Lo que sí se guarda es la foto de lo
   * que ya venía leído, para el aviso «✓ Leída» de dentro del popup.
   */
  const abrirFicha = (idx: number) => {
    setYaVistas(vistasRef.current);
    setFichaIdx(idx);
  };

  /** Abre la ilustración del grupo y la deja marcada como leída. */
  const abrirComic = () => {
    setComicYaLeido(comicLeido); // foto de antes: el aviso de dentro del visor
    setComicOpen(true);
    if (comicLeido || !n) return;
    setComicLeido(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const previos: string[] = Array.isArray(dataRef.current[CAMPO_COMICS])
      ? dataRef.current[CAMPO_COMICS] : [];
    guardar(userId, token, { [CAMPO_COMICS]: [...previos, n.key] });
  };

  if (loading) return <NutricionLoading />;
  if (!n) return null;

  const esSecundario = rutaListaNutriente(n.key).endsWith("secundarios");

  // Subgrupos de tarjetas (p.ej. «⚡ Electrolitos» / «🧱 Minerales»): agrupamos
  // las tarjetas consecutivas por su `grupo` conservando el índice GLOBAL (el que
  // usa el modal de ficha). Si ninguna define `grupo`, queda un único grupo.
  const subgruposTarjetas: { grupo?: string; items: { tar: NutrienteTarjeta; idx: number }[] }[] = [];
  (n.tarjetas ?? []).forEach((tar, idx) => {
    const ultimo = subgruposTarjetas[subgruposTarjetas.length - 1];
    if (ultimo && ultimo.grupo === tar.grupo) ultimo.items.push({ tar, idx });
    else subgruposTarjetas.push({ grupo: tar.grupo, items: [{ tar, idx }] });
  });
  const hayVariosSubgrupos = subgruposTarjetas.length > 1;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          {/* 1 · Header */}
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title={esSecundario ? "Nutrientes secundarios" : "Los nutrientes"}
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              // «← Volver» a la izquierda, como en los temas de Fisiología: desde
              // el detalle de un grupo se vuelve a SU rejilla (principales o
              // secundarios), sin tener que bajar hasta el final de la página.
              prev={{ label: `← ${t("comun.volver")}`, onClick: () => navigate(rutaListaNutriente(n.key)) }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
            />
          </Reveal>

          {/* 2 · Box de lectura con la MISMA estética que las ilustraciones
              (ComicViewer en modo disciplina): foto grande `contain` con glow a la
              izquierda + botón «Ver ilustración» debajo; a la derecha el título y
              la descripción con su propio scroll. Sin rayita, líneas de luz
              arriba/abajo y la sombra de la disciplina, para que case 1:1 con el
              visor de ilustraciones. */}
          <Reveal inView direction="up" distance={20} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
            {/* Ancho = el del header (maxW 1000). Sin override de sombra: usa el
                glow suave por defecto de SeccionBox (el mismo discreto del header). */}
            <SeccionBox
              maxW="1000px"
              mx="auto"
            >
              {/* Líneas de luz (idénticas a las del visor de ilustraciones) */}
              <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
                   bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />
              <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={2}
                   bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

              <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "stretch" }}
                    justify="center" gap={{ base: 5, md: 10 }}
                    // OJO con `pr`: en escritorio va a 0 para que la barra de
                    // scroll del texto quede pegada al borde derecho del box y no
                    // flotando a 40px de él. Ese aire lo recupera la columna de
                    // texto con su propio `pr` (se mueve la barra, no el texto).
                    pl={{ base: 5, md: 10 }} pr={{ base: 5, md: 0 }} py={{ base: 6, md: 9 }}
                    h={{ base: "auto", md: "420px" }}>

                {/* Izquierda: foto (contain + glow) + botón «Ver ilustración» debajo */}
                <Flex direction="column" gap={{ base: 4, md: 5 }} flexShrink={0} align="center" justify="center"
                      w={{ base: "100%", md: "280px" }} maxW={{ base: "240px", md: "280px" }}>
                  <Box w="100%" aspectRatio={1} position="relative"
                       filter={`drop-shadow(0 0 12px rgba(255,255,255,0.14)) drop-shadow(0 0 30px ${nutricionTxt}33)`}>
                    <Image src={encodeURI(n.img)} alt={n.label} w="100%" h="100%" objectFit="contain" borderRadius="lg"
                           fallback={<FotoPlaceholder label={n.label} color={n.color} />} />
                  </Box>

                  {comic.length > 0 && (
                    <Box as="button" onClick={abrirComic}
                         w="100%" position="relative" overflow="hidden"
                         display="inline-flex" alignItems="center" justifyContent="center" gap={2.5}
                         px={5} py={{ base: 2.5, md: 3 }} borderRadius="xl"
                         color={nutricionTxt}
                         bg="transparent"
                         border={`1.5px solid ${nutricionTxt}`}
                         fontWeight="800" fontSize={{ base: "sm", md: "md" }}
                         letterSpacing="0.08em" textTransform="uppercase" cursor="pointer"
                         boxShadow="none"
                         transition="all 0.25s ease"
                         _hover={{ bg: nutricionTxt, color: nutricionBg, transform: "translateY(-2px)", boxShadow: `0 8px 22px ${nutricionTxt}55` }}
                         _active={{ transform: "translateY(0)", boxShadow: `0 4px 14px ${nutricionTxt}44` }}>
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                           w={{ base: "20px", md: "22px" }} h={{ base: "20px", md: "22px" }} fill="currentColor" flexShrink={0}>
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                      </Box>
                      {t("metodo.nutri.verIlustracion")}
                    </Box>
                  )}
                </Flex>

                {/* Derecha: título (sin rayita) + descripción con scroll propio,
                    al mismo tamaño de letra que las ilustraciones. */}
                <Box flex="1" minW={0} w={{ base: "100%", md: "auto" }} alignSelf={{ base: "auto", md: "stretch" }}
                     display="flex" flexDirection="column" justifyContent="flex-start"
                     maxH={{ base: "none", md: "100%" }} overflowY={{ base: "visible", md: "auto" }} overflowX="hidden"
                     // 52px = los 12 de antes + los 40 que se le han quitado a la fila.
                     pr={{ base: 0, md: "52px" }}
                     sx={{
                       "&::-webkit-scrollbar": { width: "6px" },
                       "&::-webkit-scrollbar-thumb": { background: `${nutricionTxt}55`, borderRadius: "3px" },
                       "&::-webkit-scrollbar-track": { background: "transparent" },
                       scrollbarWidth: "thin",
                       scrollbarColor: `${nutricionTxt}55 transparent`,
                     }}>
                  <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1.25"
                        mb={{ base: 3, md: 4 }} textAlign={{ base: "center", md: "left" }}>
                    {n.label}
                  </Text>
                  {(n.descripcion ?? [n.resumen]).map((parrafo, i) => (
                    <Text key={i} color={nutricionTxt} textAlign={{ base: "center", md: "left" }}
                          fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7" letterSpacing="0.02em"
                          fontWeight="400" mt={i === 0 ? 0 : { base: 4, md: 5 }}>
                      {parrafo}
                    </Text>
                  ))}
                </Box>
              </Flex>
            </SeccionBox>
          </Reveal>

          {/* Cuántos subtipos lleva descubiertos. El grupo no queda revisado (ni
              se abre la página siguiente) hasta abrirlos todos, así que se dice. */}
          {n.tarjetas && n.tarjetas.length > 0 && (
            <Reveal inView direction="up" distance={12} delay={0.2} duration={0.5} display="flex" justifyContent="center">
              <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    textAlign="center" lineHeight="1.8">
                {fichasVistas.length >= n.tarjetas.length
                  ? "Ya los has descubierto todos."
                  : `Toca cada uno para descubrirlo · ${fichasVistas.length}/${n.tarjetas.length}`}
              </Text>
            </Reveal>
          )}

          {/* 4 · Tarjetas (moléculas/tipos). En círculo de colores (vitaminas) o
              en rejilla estilo «Todas tus células». Cada una abre su ficha cómic. */}
          {n.tarjetas && n.tarjetas.length > 0 && (
            <Reveal inView direction="up" distance={20} delay={0.24} duration={0.6} w="100%">
              {n.tarjetasCirculo ? (
                <NutrienteCirculo tarjetas={n.tarjetas} tituloCentro={n.label}
                                  onSelect={abrirFicha} />
              ) : (
                <Flex direction="column" w="100%" gap={{ base: 6, md: 8 }}>
                  {subgruposTarjetas.map((g, gi) => (
                    <Box key={g.grupo ?? gi} w="100%">
                      {/* Encabezado del subgrupo con línea horizontal a los lados
                          (solo si hay más de un subgrupo, p.ej. Electrolitos/Minerales). */}
                      {hayVariosSubgrupos && g.grupo && (() => {
                        // «⚡ Electrolitos» → SOLO el nombre a la izquierda y la
                        // raya blanca ocupando el resto del ancho. Sin icono: el
                        // emoji de los datos no se pinta y tampoco un SVG que lo
                        // sustituya —el rótulo se sostiene solo—.
                        const nombre = g.grupo.split(" ").slice(1).join(" ");
                        return (
                          <Flex align="center" gap={{ base: 2.5, md: 3 }} w="100%" mb={{ base: 4, md: 5 }}>
                            <Text color="white" fontWeight="800" fontSize={{ base: "md", md: "lg" }}
                                  letterSpacing="0.08em" textTransform="uppercase" whiteSpace="nowrap"
                                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                              {nombre}
                            </Text>
                            <Box flex="1" h="1px" bgGradient="linear(to-r, rgba(255,255,255,0.8), rgba(255,255,255,0))" />
                          </Flex>
                        );
                      })()}
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
                        {g.items.map(({ tar, idx }) => (
                          <TarjetaNutri key={tar.key} titulo={tar.titulo} foto={tar.foto} numero={tar.numero}
                                        visto={fichasVistas.includes(idx)}
                                        onClick={() => abrirFicha(idx)} />
                        ))}
                      </SimpleGrid>
                    </Box>
                  ))}
                </Flex>
              )}
            </Reveal>
          )}

          {/* 5 · Botón «← Volver», al final y a la izquierda, como el resto del
              recorrido: cuando terminas de mirar las tarjetas el header se ha
              quedado arriba del todo, y volver se pide DESPUÉS de leer, no antes.
              Va con `inView` porque queda por debajo del pliegue: con `mounted`
              se habría animado sin que nadie lo estuviera mirando. */}
          <Reveal inView direction="up" distance={12} delay={0.06} duration={0.5} w="100%" display="flex"
                  mt={{ base: 2, md: 3 }}>
            <VolverNutri onClick={() => navigate(rutaListaNutriente(n.key))} />
          </Reveal>

        </Flex>
      </Flex>

      {/* Ficha tipo cómic de la tarjeta seleccionada. */}
      {n.tarjetas && fichaIdx !== null && (
        <NutrienteFichaModal tarjetas={n.tarjetas} index={fichaIdx}
                             onLeida={marcarFichaVista}
                             leida={(i) => yaVistas.includes(i)}
                             onClose={() => setFichaIdx(null)} onSelect={abrirFicha} />
      )}

      {/* Ilustración (cómic) del grupo, a pantalla completa (misma estructura que
          las ilustraciones de otras disciplinas). */}
      {comic.length > 0 && (
        <NutrienteIlustracionModal isOpen={comicOpen} vinetas={comic} leida={comicYaLeido}
                                   onClose={() => setComicOpen(false)} />
      )}

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
