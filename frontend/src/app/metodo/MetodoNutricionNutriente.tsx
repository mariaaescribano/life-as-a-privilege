import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useT } from "../../i18n";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Breathe, Reveal } from "../../components/global/Reveal";
import { NutrienteIlustracionModal } from "../../components/metodo/NutrienteIlustracionModal";
import { NutrienteCirculo } from "../../components/metodo/NutrienteCirculo";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { comicNutrienteByKey } from "../../components/metodo/comicsNutrientes";
import { useComic } from "../../i18n/comics";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { NUTRIENTES, NUTRIENTES_MACRO, NUTRIENTES_MICRO, NUTRIENTES_QUIMICOS, esMicronutriente, esQuimico, nutrienteAlcanzable, rutaListaNutriente, type NutrienteTarjeta } from "../../hardCoded/espacio/NutrientesNutricion";
import { useNutriente, useNutrientes } from "../../hardCoded/espacio/useNutrientes";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";

// ═════════════════════════════════════════════════════════════════════════
// Página de detalle de UN grupo de nutrientes (Carbohidratos, Grasas…).
// Se llega desde /metodo/nutricion/macronutrientes o /micronutrientes al
// pulsar una tarjeta.
//
// Estructura:
//   1. El cómic del grupo hace de INTRO: se abre solo al entrar (siempre, como
//      los cómics de entrada de las disciplinas; la X lo salta) y al salir por
//      la flecha final aparece la página.
//   2. Header. El título dice el grupo («Macro: Carbohidratos»…) y la
//      navegación va en sus botones: a la izquierda el grupo ANTERIOR de la
//      senda («← Carbohidratos»; en el primero, «← Volver» a su rejilla) y a la
//      derecha el SIGUIENTE («Fibra →»; en el último, la rejilla), apagado
//      hasta revisar este. En móvil el header los deja en la flecha sola.
//   3. Box grande: foto a la izquierda (arriba en móvil) + título y
//      descripción a la derecha, nunca más altos que la foto (scroll propio).
//   4. Tarjetas de subtipos: TODAS visibles siempre (una «revelación
//      progresiva» que las escondía se descartó: parecía una página rota);
//      entran en cascada y la siguiente por descubrir late suavemente.
// ═════════════════════════════════════════════════════════════════════════

// Ilustraciones (cómics) de grupo ya leídas, en metodo_nutricion.data: string[]
// con las keys de los grupos cuyo cómic se ha abierto.
const CAMPO_COMICS = "nutrientes_comics_leidos";

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
  const [comicOpen, setComicOpen] = useState(false); // el cómic-intro del grupo
  // El cómic ya estaba leído ANTES de esta visita: el visor lo dice arriba
  // («✓ Leída»).
  const [comicYaLeido, setComicYaLeido] = useState(false);
  // Fichas de este grupo que ya ha abierto. Es lo que da (o no) el tick.
  const [fichasVistas, setFichasVistas] = useState<number[]>([]);
  // El grupo ya consta como explorado en la BD (aunque `nutrientes_fichas`
  // venga incompleto de datos antiguos): habilita el botón «Siguiente →».
  const [explorado, setExplorado] = useState(false);
  // Último PATCH lanzado: «Siguiente» lo espera antes de navegar, porque la
  // página siguiente bloquea por flag (regla de guardar antes de navegar).
  const patchEnCurso = useRef<Promise<unknown> | null>(null);
  // Mismo dato en un ref: el visor avisa de una ficha leída por cada flecha, y
  // dos avisos seguidos leerían el estado antiguo.
  const vistasRef = useRef<number[]>([]);
  // Fichas que YA estaban leídas al abrir el visor (para el aviso «✓ Leída»).
  const [yaVistas, setYaVistas] = useState<number[]>([]);
  const dataRef = useRef<Record<string, any>>({}); // copia del blob para mergear al guardar

  // El grupo en el idioma activo (del inglés sale solo el texto: la foto, el
  // color y el orden de las tarjetas siguen saliendo del español).
  const n = useNutriente(key || "");
  // Todos los grupos en el idioma activo: para poner el NOMBRE del anterior y
  // del siguiente en los botones del header (las listas macro/micro son la
  // fuente española y sus labels no cambian de idioma).
  const todosNutrientes = useNutrientes();
  // La ilustración del grupo, en el idioma activo. Se pide aquí arriba y no
  // junto a su uso: allí ya se ha pasado por el `return` de la carga, y los
  // hooks van todos antes del primer return.
  const comic = useComic(`nutriente-${n?.key ?? ""}`, comicNutrienteByKey(n?.key ?? "") ?? []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    // ⚠ Al pasar de un grupo a otro con «Fibra →» / «← Carbohidratos» la RUTA
    // cambia pero el componente NO se desmonta (es la misma página con otro
    // :key), así que los estados se quedan como estaban. Sin este reseteo,
    // `loading` seguía en false y la página del grupo nuevo SE VEÍA unos
    // segundos antes de que el cómic-intro saltara encima (el fallo exacto que
    // no puede ocurrir), y las fichas vistas del grupo anterior se colaban en
    // el nuevo. Se vuelve al estado de recién llegado y a esperar con el
    // loading de la disciplina.
    setLoading(true);
    setComicOpen(false);
    setComicYaLeido(false);
    setExplorado(false);
    setFichasVistas([]);
    vistasRef.current = [];
    setFichaIdx(null);
    setYaVistas([]);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!n) { navigate("/metodo/nutricion/macronutrientes", { replace: true }); return; }
    (async () => {
      try {
        const me = await getUserMe();
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }

        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const data = r.data?.data ?? {};
          dataRef.current = data;
          // El camino también se respeta entrando por la URL: si este grupo aún
          // no toca, de vuelta a su rejilla (ver SendaNutrientes).
          const explorados: string[] = Array.isArray(data.nutrientes_explorados) ? data.nutrientes_explorados : [];
          if (!nutrienteAlcanzable(n.key, explorados)) {
            navigate(rutaListaNutriente(n.key), { replace: true });
            return;
          }
          if (explorados.includes(n.key)) setExplorado(true);
          const previas = data.nutrientes_fichas?.[n.key];
          const vistas = Array.isArray(previas) ? previas.map(Number) : [];
          vistasRef.current = vistas;
          setFichasVistas(vistas);
          const comics = data[CAMPO_COMICS];
          if (Array.isArray(comics) && comics.includes(n.key)) setComicYaLeido(true);

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

        // El cómic del grupo hace de INTRO: se abre solo nada más entrar
        // (SIEMPRE, como los cómics de entrada de las disciplinas; la X lo
        // salta). Al salir del visor —por la flecha final o por la X— aparece
        // la página. Se deja marcado como leído aquí mismo, que es lo que
        // hacía antes el botón «Ver ilustración» al pulsarlo.
        if ((comicNutrienteByKey(n.key)?.length ?? 0) > 0) {
          const previos: string[] = Array.isArray(dataRef.current[CAMPO_COMICS])
            ? dataRef.current[CAMPO_COMICS] : [];
          if (!previos.includes(n.key)) guardar(userId, token, { [CAMPO_COMICS]: [...previos, n.key] });
          setComicOpen(true);
        }
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, key]);

  /** Escribe el blob entero (el backend lo reemplaza) partiendo de lo último leído. */
  const guardar = (userId: string, token: string, cambios: Record<string, any>) => {
    const data = { ...dataRef.current, ...cambios };
    dataRef.current = data;
    // Se guarda la promesa: «Siguiente →» la espera antes de navegar, para que
    // el candado de la página siguiente encuentre el tick YA en la BD.
    patchEnCurso.current = axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
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

  if (loading) return <NutricionLoading />;
  if (!n) return null;

  // De qué página viene este grupo (macro, micro o químicos): decide la lista
  // de la senda, la etiqueta del título y a qué rejilla se vuelve.
  const esMicro = esMicronutriente(n.key);
  const esQuim = esQuimico(n.key);
  // La etiqueta corta que precede al nombre en el título del header.
  const clavePrefijo = esQuim ? "metodo.nutri.paso.quimicos"
    : esMicro ? "metodo.nutri.paso.microCorto" : "metodo.nutri.paso.macroCorto";
  // El nombre de la rejilla de esta lista (fallback del next en el último grupo).
  const claveRejilla = esQuim ? "metodo.nutri.paso.quimicos"
    : esMicro ? "metodo.nutri.paso.micro" : "metodo.nutri.paso.macro";

  // La senda en el header, con NOMBRES: a la izquierda el grupo ANTERIOR de su
  // lista («← Carbohidratos»; en el primero no hay y queda «← Volver» a la
  // rejilla), y a la derecha el SIGUIENTE («Fibra →»; en el último, la rejilla,
  // que es donde sigue el recorrido). El siguiente solo se activa cuando este
  // grupo queda revisado (todas las fichas abiertas, o ya constaba como
  // explorado en la BD): la misma condición que abre el candado del destino.
  const lista = esQuim ? NUTRIENTES_QUIMICOS : esMicro ? NUTRIENTES_MICRO : NUTRIENTES_MACRO;
  const idxEnLista = lista.findIndex((x) => x.key === n.key);
  const anteriorNutriente = idxEnLista > 0 ? lista[idxEnLista - 1] : undefined;
  const siguienteNutriente = idxEnLista >= 0 ? lista[idxEnLista + 1] : undefined;
  // El nombre en el idioma activo (la lista es la fuente española).
  const nombreDe = (grupo: { key: string; label: string }) =>
    todosNutrientes.find((x) => x.key === grupo.key)?.label ?? grupo.label;
  const grupoRevisado = explorado || !n.tarjetas?.length || fichasVistas.length >= n.tarjetas.length;
  const irSiguiente = async () => {
    // El tick del grupo viaja en un PATCH que puede estar aún en el aire: se
    // espera antes de navegar o la página siguiente rebotaría a la rejilla.
    try { await patchEnCurso.current; } catch { /* ya reintentará al entrar */ }
    navigate(siguienteNutriente
      ? `/metodo/nutricion/nutrientes/${siguienteNutriente.key}`
      : rutaListaNutriente(n.key));
  };

  // ⚠ Las tarjetas se ven TODAS, SIEMPRE. Hubo una «revelación progresiva»
  // (solo las descubiertas + la siguiente) y se DESCARTÓ el mismo día: en
  // vitaminas (13 tarjetas) la página parecía rota, «no salen todas las
  // cards». La dinámica queda en la entrada en cascada de cada tarjeta y en
  // el latido de la siguiente por descubrir, que es la invitación al clic.
  const primeraNoVista = (n.tarjetas ?? []).findIndex((_, i) => !fichasVistas.includes(i));

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

  // ⚠ ORDEN SAGRADO: el cómic-intro va ANTES que la página, SIEMPRE. Mientras
  // esté abierto, debajo no hay página sino el loading de la disciplina: aunque
  // el velo del modal tardara un suspiro en fundirse, lo que asoma nunca es la
  // página. La página se MONTA al cerrar el cómic (flecha final o X), y estrena
  // en ese momento sus animaciones de entrada. Así es imposible el fallo de
  // «veo la página tres segundos y LUEGO me salta el cómic».
  if (comicOpen) {
    return (
      <>
        <NutricionLoading />
        {comic.length > 0 && (
          <NutrienteIlustracionModal isOpen={comicOpen} vinetas={comic} leida={comicYaLeido}
                                     continueLabel={n.label}
                                     onClose={() => setComicOpen(false)} />
        )}
      </>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          {/* 1 · Header. El título dice el grupo con su etiqueta corta delante
              («Macro: Carbohidratos», «Micro: Vitaminas»…), y la navegación va
              en sus botones con los NOMBRES de la senda: «← Carbohidratos» /
              «Fibra →» (el primero de la lista lleva «← Volver» a su rejilla;
              el último, la rejilla como siguiente). En móvil el propio header
              los deja en la flecha sola. */}
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title={`${t(clavePrefijo)}: ${n.label}`}
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={anteriorNutriente
                ? { label: `← ${nombreDe(anteriorNutriente)}`, onClick: () => navigate(`/metodo/nutricion/nutrientes/${anteriorNutriente.key}`) }
                : { label: `← ${t("comun.volver")}`, onClick: () => navigate(rutaListaNutriente(n.key)) }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{
                label: `${siguienteNutriente ? nombreDe(siguienteNutriente) : t(claveRejilla)} →`,
                onClick: irSiguiente,
                disabled: !grupoRevisado,
              }}
            />
          </Reveal>

          {/* 2 · Box de lectura con la MISMA estética que las ilustraciones
              (ComicViewer en modo disciplina): foto grande `contain` con glow a
              la izquierda (arriba en móvil); a la derecha el título y la
              descripción, que NUNCA son más altos que la foto (si el texto no
              cabe, scroll propio). Sin rayita, líneas de luz arriba/abajo y la
              sombra de la disciplina, para que case 1:1 con el visor. */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
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

              <Flex direction={{ base: "column", md: "row" }} align="center"
                    justify="center" gap={{ base: 5, md: 10 }}
                    // OJO con `pr`: en escritorio va a 0 para que la barra de
                    // scroll del texto quede pegada al borde derecho del box y no
                    // flotando a 40px de él. Ese aire lo recupera la columna de
                    // texto con su propio `pr` (se mueve la barra, no el texto).
                    pl={{ base: 5, md: 10 }} pr={{ base: 5, md: 0 }} py={{ base: 6, md: 9 }}>

                {/* Izquierda (arriba en móvil): la foto del grupo (contain + glow).
                    Su ALTO (= su ancho, es cuadrada) es el tope del box: la
                    columna de texto no puede crecer más que ella. */}
                <Box flexShrink={0} w={{ base: "100%", md: "300px" }} maxW={{ base: "240px", md: "300px" }}
                     aspectRatio={1} position="relative"
                     filter={`drop-shadow(0 0 12px rgba(255,255,255,0.14)) drop-shadow(0 0 30px ${nutricionTxt}33)`}>
                  <Image src={encodeURI(n.img)} alt={n.label} w="100%" h="100%" objectFit="contain" borderRadius="lg"
                         fallback={<FotoPlaceholder label={n.label} color={n.color} />} />
                </Box>

                {/* Derecha: la descripción sola (el título va en el header), al
                    tamaño de letra de las ilustraciones. NUNCA más alta que la
                    foto (300px, lo que mide ella): si no cabe, scroll propio. */}
                <Box flex="1" minW={0} w={{ base: "100%", md: "auto" }}
                     display="flex" flexDirection="column" justifyContent="flex-start"
                     maxH={{ base: "none", md: "300px" }} overflowY={{ base: "visible", md: "auto" }} overflowX="hidden"
                     // 52px = los 12 de antes + los 40 que se le han quitado a la fila.
                     pr={{ base: 0, md: "52px" }}
                     sx={{
                       "&::-webkit-scrollbar": { width: "6px" },
                       "&::-webkit-scrollbar-thumb": { background: `${nutricionTxt}55`, borderRadius: "3px" },
                       "&::-webkit-scrollbar-track": { background: "transparent" },
                       scrollbarWidth: "thin",
                       scrollbarColor: `${nutricionTxt}55 transparent`,
                     }}>
                  {/* SIN título aquí: el nombre del grupo ya lo dice el header
                      («Macro: Carbohidratos»). No volver a ponerlo. */}
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

  

          {/* 4 · Tarjetas (moléculas/tipos). En círculo de colores (vitaminas) o
              en rejilla estilo «Todas tus células». Cada una abre su ficha cómic.
              ⚠ La rejilla NO va envuelta en un Reveal inView: su `amount` es una
              proporción del contenedor ENTERO y en las rejillas altas (minerales
              a una columna) el disparo no llegaba nunca — tarjetas invisibles.
              Cada tarjeta lleva ya su propio Reveal (aviso de Reveal.tsx). */}
          {n.tarjetas && n.tarjetas.length > 0 && (
            <Box w="100%">
              {n.tarjetasCirculo ? (
                <Reveal direction="up" distance={20} delay={0.2} duration={0.6}>
                  <NutrienteCirculo tarjetas={n.tarjetas} tituloCentro={n.label}
                                    onSelect={abrirFicha} />
                </Reveal>
              ) : (
                <Flex direction="column" w="100%" gap={{ base: 6, md: 8 }}>
                  {subgruposTarjetas.map((g, gi) => {
                    return (
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
                          <Reveal direction="right" distance={16} duration={0.5}>
                            <Flex align="center" gap={{ base: 2.5, md: 3 }} w="100%" mb={{ base: 4, md: 5 }}>
                              <Text color="white" fontWeight="800" fontSize={{ base: "md", md: "lg" }}
                                    letterSpacing="0.08em" textTransform="uppercase" whiteSpace="nowrap"
                                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                                {nombre}
                              </Text>
                              <Box flex="1" h="1px" bgGradient="linear(to-r, rgba(255,255,255,0.8), rgba(255,255,255,0))" />
                            </Flex>
                          </Reveal>
                        );
                      })()}
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
                        {g.items.map(({ tar, idx }) => {
                          // La siguiente por descubrir respira despacito: es la
                          // invitación al clic. Las ya vistas se quedan quietas.
                          // El Breathe envuelve SIEMPRE (con amplitud 0 cuando no
                          // toca) para no remontar la tarjeta al cambiar de rol.
                          // ⚠ El Reveal de cada tarjeta anima AL MONTAR, nada de
                          // inView: con whileInView había tarjetas que se
                          // quedaban a opacidad 0. Al montar SIEMPRE acaba
                          // visible; la cascada la pone el delay por índice.
                          const esLaSiguiente = !grupoRevisado && idx === primeraNoVista;
                          return (
                            <Reveal key={tar.key} direction="up" distance={18}
                                    scaleFrom={0.94} duration={0.55}
                                    delay={Math.min(idx * 0.06, 0.5)}>
                              <Breathe scale={esLaSiguiente ? 0.02 : 0} duration={3.5}>
                                <TarjetaNutri titulo={tar.titulo} foto={tar.foto} numero={tar.numero}
                                              visto={fichasVistas.includes(idx)}
                                              onClick={() => abrirFicha(idx)} />
                              </Breathe>
                            </Reveal>
                          );
                        })}
                      </SimpleGrid>
                    </Box>
                    );
                  })}
                </Flex>
              )}
            </Box>
          )}

        </Flex>
      </Flex>

      {/* Ficha tipo cómic de la tarjeta seleccionada. */}
      {n.tarjetas && fichaIdx !== null && (
        <NutrienteFichaModal tarjetas={n.tarjetas} index={fichaIdx}
                             onLeida={marcarFichaVista}
                             leida={(i) => yaVistas.includes(i)}
                             onClose={() => setFichaIdx(null)} onSelect={abrirFicha} />
      )}

      {/* (El cómic-intro se pinta en la rama de ARRIBA, con el loading debajo:
          mientras está abierto esta página ni se monta.) */}

      {/* El Índice de Nutrición, flotando como en las rejillas: es la vuelta a
          cualquier punto del recorrido ahora que el «← Volver» del header solo
          está en el primer grupo de cada senda. */}
      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
