// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · TU FAMILIA  ·  9/27   (ruta interna /familia)
//
// Aquí la usuaria COMPONE su familia y le pone cara simbólica. Empieza sola en
// el centro (su foto de perfil, etiqueta «Tú») y con los «+» que rodean cada
// foto coloca a los demás: arriba las generaciones anteriores, a los lados la
// suya, abajo sus hijos.
//
// Al tocar a una persona se abre su popup: nombre, parentesco y —lo propio de
// esta página— el SELECTOR de personajes/animales, donde asocia hasta
// SIMBOLOS_POR_PERSONA (2) imágenes con esa persona. El catálogo de imágenes
// está en familiaSimbolos.ts (fotos en /public/recorrido/psicologia/familia).
//
// La familia que compone aquí es la MISMA del «Genograma» (paso 7), donde luego
// escribe la ficha de cada persona: los dos leen y escriben data.genograma.
// El dibujo del mapa es el componente común GenogramaMapa.
// ─────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoader, PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { GenogramaMapa, SimboloImg } from "../../components/metodo/GenogramaMapa";
import { FotoPersonaBoton } from "../../components/metodo/FotoPersonaBoton";
import { useMapaFamilia } from "../../hooks/useMapaFamilia";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { COMIC_HERENCIA } from "../../components/metodo/comicHerencia";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
import {
  simboloSrc,
  SIMBOLOS_FAMILIA,
  SIMBOLOS_GRUPOS,
  useSimbolosFamilia,
  type SimboloFamilia,
} from "../../components/metodo/familiaSimbolos";
import { useImagesReady } from "../../hooks/useImagesReady";
import {
  experienciaById,
  personaLabel,
  personaSimbolos,
  SIMBOLOS_POR_PERSONA,
  type PersonaGenograma,
} from "../../components/metodo/psicologiaRecorrido";
import { useFamilia, useGenograma } from "../../components/metodo/psicologiaRecorrido.en";
import { glowHeader, scrollAcuarela } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // #5e2d10 — marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaFamilia() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");
  const familia = useFamilia();

  const { loading, personas, miFoto, añadir, actualizar, eliminar, flushGuardado } =
    useMapaFamilia(experienciaId);
  const [abiertoId, setAbiertoId] = useState<string | null>(null);
  // Cómic «Lo que se hereda», intercalado antes de pasar al Genograma.
  const [comicOpen, setComicOpen] = useState(false);
  // Las viñetas en el idioma activo (el español manda: fotos y orden salen de él).
  const comicVinetas = useComic("psicologia-herencia", COMIC_HERENCIA);

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  const ir = async (ruta: string) => {
    flushGuardado();
    await flushSaves();
    navigate(ruta);
  };

  // Pasar al Genograma: primero el cómic; al terminarlo (o saltarlo) navega.
  const irAlGenograma = async () => {
    flushGuardado();
    await flushSaves();
    setComicOpen(true);
  };

  const abierta = personas.find((p) => p.id === abiertoId) || null;
  // Para pasar al Genograma basta con que haya elegido el personaje/animal de al
  // menos una persona: es el ejercicio de esta página.
  const algunSimbolo = personas.some((p) => personaSimbolos(p).length > 0);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title={familia.titulo}
                step={{ current: 9, total: 27 }}
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: `← ${t("metodo.psico.lineaDeVida")}`, onClick: () => ir(`/metodo/psicologia/${exp.id}`) }}
                next={{
                  label: `${t("metodo.psico.paso.genograma")} →`,
                  onClick: irAlGenograma,
                  disabled: !algunSimbolo,
                  disabledTooltip:
                    personas.length === 0
                      ? t("metodo.psico.faltaFamiliaVacia")
                      : t("metodo.psico.faltaFamiliaSimbolo"),
                }}
              />
            </Reveal>

            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>{familia.intro}</IntroRecorrido>
            </Reveal>

            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%">
              <GenogramaMapa
                personas={personas}
                miFoto={miFoto}
                onAbrir={(p) => setAbiertoId(p.id)}
                onAñadir={(fila, col, dir) => setAbiertoId(añadir(fila, col, dir))}
              />
            </Reveal>

            <Reveal direction="up" distance={26} scaleFrom={0.97} delay={0.34} duration={0.7} w="100%">
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
                {personas.length === 0
                  ? t("metodo.psico.genogramaIntro")
                  : t("metodo.psico.familiaAyuda")}
              </Text>
            </Reveal>

          </Flex>
        </Flex>
      </Box>

      {/* ── POPUP: quién es + a quién se parece ── */}
      {abierta && (
        <PopupPersonaje
          key={abierta.id}
          p={abierta}
          onCampo={(campos) => actualizar(abierta.id, campos)}
          onEliminar={() => { eliminar(abierta.id); setAbiertoId(null); }}
          onClose={() => { flushGuardado(); setAbiertoId(null); }}
        />
      )}

      <AyudaRecorrido pagina="familia" />

      {/* Cómic «Lo que se hereda» — se muestra entre Tu familia y el Genograma:
          antes de escribir la ficha de cada persona, explica por qué ese mapa
          importa (epigenética, trauma intergeneracional y los patrones que se
          repiten). Al terminarlo (o pulsar «Continuar →») avanza a /genograma. */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/genograma`); }}
        vinetas={comicVinetas}
        continueLabel={t("comun.continuar")}
        botonNitido
        themeColor={neuropsicologiaTxt}
        disciplinaBgImage="/img/fondos/psciologia.webp"
        disciplinaBgColor={neuropsicologiaBg}
        textShadow={INK_SHADOW}
      />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Popup de una persona: su nombre y parentesco arriba, y debajo el selector de
// personajes/animales (hasta dos). Todo se autoguarda.
//
// El popup no se enseña a medias: hasta que TODAS las fotos del catálogo estén
// cargadas solo se ve la neurona de psicología girando dentro de la caja. Son
// varias decenas de miniaturas y, sin esto, la rejilla se iba pintando a
// trozos.
// ─────────────────────────────────────────────────────────────────────────

/** Las fotos del catálogo. Fuera del componente: la lista no cambia nunca, y
 *  así `useImagesReady` no vuelve a esperar en cada render. */
const SIMBOLOS_SRCS = SIMBOLOS_FAMILIA.map((s) => simboloSrc(s.key));

/* El selector de personajes/animales: nombres y grupos en el idioma activo. La
   `key` (lo que se guarda) sigue saliendo del español. */
function PopupPersonaje({ p, onCampo, onEliminar, onClose }: {
  p: PersonaGenograma;
  onCampo: (campos: Partial<PersonaGenograma>) => void;
  onEliminar: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const { simbolos, grupo: grupoRotulo } = useSimbolosFamilia();
  const familia = useFamilia();
  const genograma = useGenograma();
  useLockBodyScroll(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  // Solo el catálogo: la foto de la persona NO entra aquí a propósito, o al
  // subir una nueva el popup entero se iría al loader en mitad de la edición.
  const fotosListas = useImagesReady(SIMBOLOS_SRCS);

  const elegidos = personaSimbolos(p);
  const completo = elegidos.length >= SIMBOLOS_POR_PERSONA;

  // ── El popup tiene DOS pasos, uno debajo del otro, en un solo scroll ──
  //   1 · ¿Quién es?            foto, nombre y parentesco (con sus 18 atajos)
  //   2 · ¿A quién se parece?   el catálogo de personajes y animales
  //
  // El primero se PLIEGA en cuanto se sabe a quién estamos definiendo: la lista
  // de parentescos son cuatro filas de chapas y, una vez elegido el suyo, solo
  // estorban. Plegado deja una línea con la foto, el nombre y el parentesco, y
  // un botón para volver a abrirlo. Así el catálogo —que es a lo que se viene—
  // se lleva el popup entero en vez de un carril de 200 px.
  const [identidadAbierta, setIdentidadAbierta] = useState(!(p.parentesco || "").trim());

  // Tocar una imagen la elige; volver a tocarla la quita. Con las dos ya
  // elegidas, las demás quedan apagadas hasta que quite una (así nunca se
  // sustituye por sorpresa lo que acaba de elegir).
  const toggleSimbolo = (key: string) => {
    if (elegidos.includes(key)) {
      onCampo({ simbolos: elegidos.filter((k) => k !== key) });
      return;
    }
    if (completo) return;
    onCampo({ simbolos: [...elegidos, key] });
  };

  /** Rótulo de paso: «1 · ¿Quién es?». El número ordena la lectura sin gastar
   *  una línea de instrucciones. */
  const Paso = ({ n, titulo }: { n: number; titulo: string }) => (
    <Flex align="center" gap={2.5} minW={0}>
      <Flex flexShrink={0} align="center" justify="center" w="26px" h="26px" borderRadius="full"
            bg={`${TINTA}1f`} border={`1px solid ${TINTA}55`}>
        <Text color={TINTA} fontSize="sm" fontWeight="700" lineHeight="1">{n}</Text>
      </Flex>
      <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.25"
            noOfLines={1} style={{ textShadow: INK_SHADOW }}>
        {titulo}
      </Text>
    </Flex>
  );

  return (
    <Box position="fixed" inset={0} zIndex={2000} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 3, md: 10 }} py={{ base: 4, md: 10 }} bg="rgba(0,0,0,0.82)"
         sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
         onClick={onClose} fontFamily="'EB Garamond', serif">
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}
           position="relative" w="100%" maxW={{ base: "440px", md: "560px" }}
           maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 120px)" }}
           borderRadius="2xl" overflow="hidden" display="flex" flexDirection="column"
           boxShadow={`0 0 40px ${TINTA}66, 0 24px 70px rgba(0,0,0,0.5)`}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

        {!fotosListas ? (
          // Todavía cargando: la caja no enseña nada más que la neurona. Se
          // cierra tocando fuera, como siempre.
          <Flex position="relative" zIndex={1} align="center" justify="center"
                minH={{ base: "320px", md: "380px" }}>
            <PsicologiaLoader color={TINTA} />
          </Flex>
        ) : (
        <>
        {/* Cerrar — flota sobre el contenido, que ahora scrollea entero */}
        <Box as="button" onClick={onClose} position="absolute" top={3} right={3} zIndex={4}
             w="38px" h="38px" borderRadius="full" bg="rgba(255,251,243,0.85)" border={`1px solid ${TINTA}44`}
             color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="lg" cursor="pointer"
             sx={{ backdropFilter: "blur(4px)" }}
             _hover={{ bg: "rgba(255,251,243,1)", borderColor: TINTA }}>
          ✕
        </Box>

        {/* ── UN SOLO scroll vertical para todo el popup ── */}
        <Box position="relative" zIndex={1} flex="1" overflowY="auto" overscrollBehavior="contain"
             sx={scrollAcuarela(TINTA)}>

          {/* ── PASO 1 · ¿Quién es? ── */}
          <Box px={{ base: 5, md: 8 }} pt={{ base: 6, md: 7 }} pb={{ base: 4, md: 5 }}>
            {identidadAbierta ? (
              <>
                <Box pr={10}>
                  <Paso n={1} titulo={t("metodo.psico.familiaQuienEs")} />
                </Box>

                <Flex align="center" gap={{ base: 4, md: 5 }} mt={4}>
                  <FotoPersonaBoton
                    foto={p.foto}
                    alt={personaLabel(p)}
                    onSubida={(url) => onCampo({ foto: url })}
                    onError={setError}
                  />
                  <Flex direction="column" gap={2} flex="1" minW={0}>
                    <Input
                      value={p.nombre}
                      onChange={(e) => onCampo({ nombre: e.target.value })}
                      placeholder={t("metodo.psico.suNombre")}
                      bg="rgba(255,251,243,0.78)" border={`1px solid ${TINTA}3a`} color={TINTA}
                      borderRadius="lg" fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                      sx={{ caretColor: TINTA }}
                      _placeholder={{ color: `${TINTA}66`, fontStyle: "italic", fontWeight: 400 }}
                      _hover={{ borderColor: `${TINTA}55` }}
                      _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.92)" }}
                    />
                    <Input
                      value={p.parentesco || ""}
                      onChange={(e) => onCampo({ parentesco: e.target.value })}
                      placeholder={t("metodo.psico.parentesco")}
                      bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}3a`} color={TINTA}
                      borderRadius="lg" fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }}
                      sx={{ caretColor: TINTA }}
                      _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                      _hover={{ borderColor: `${TINTA}55` }}
                      _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.9)" }}
                    />
                  </Flex>
                </Flex>

                {error && (
                  <Text color="#8c2f13" fontSize="md" fontStyle="italic" mt={2.5} style={{ textShadow: INK_SHADOW }}>
                    {error}
                  </Text>
                )}

                {/* Parentescos sugeridos: al tocar uno ya sabemos a quién
                    estamos definiendo, así que el paso se pliega solo. */}
                <Flex wrap="wrap" gap={1.5} mt={3.5}>
                  {genograma.parentescos.map((par) => (
                    <Box as="button" key={par}
                         onClick={() => { onCampo({ parentesco: par }); setIdentidadAbierta(false); }}
                         px={3} py={1.5} borderRadius="full"
                         bg={p.parentesco === par ? TINTA : "rgba(255,251,243,0.72)"}
                         border={`1px solid ${p.parentesco === par ? TINTA : `${TINTA}33`}`}
                         cursor="pointer" transition="all 0.15s"
                         _hover={{ borderColor: TINTA, transform: "translateY(-1px)" }}>
                      <Text color={p.parentesco === par ? PAPEL : TINTA} fontSize="sm" fontWeight="600" lineHeight="1.2" whiteSpace="nowrap">
                        {par}
                      </Text>
                    </Box>
                  ))}
                </Flex>

                {/* Con el parentesco escrito a mano se puede plegar sin tocar
                    ninguna chapa. */}
                {!!(p.parentesco || "").trim() && (
                  <Flex justify="flex-end" mt={3}>
                    <Box as="button" onClick={() => setIdentidadAbierta(false)}
                         px={4} py={1.5} borderRadius="full" bg="transparent"
                         border={`1px solid ${TINTA}55`} color={TINTA}
                         fontFamily="'EB Garamond', serif" fontSize="sm" fontWeight="700"
                         cursor="pointer" transition="all 0.18s" _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}>
                      {t("metodo.psico.familiaListo")}
                    </Box>
                  </Flex>
                )}
              </>
            ) : (
              // ── Plegado: quién es, en una línea, y el lápiz para corregirlo ──
              <Flex align="center" gap={3} pr={10}>
                <FotoPersonaBoton
                  foto={p.foto}
                  alt={personaLabel(p)}
                  onSubida={(url) => onCampo({ foto: url })}
                  onError={setError}
                  size={{ base: "48px", md: "52px" }}
                />
                <Box flex="1" minW={0}>
                  <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" noOfLines={1}
                        style={{ textShadow: INK_SHADOW }}>
                    {personaLabel(p)}
                  </Text>
                  {!!(p.parentesco || "").trim() && !!(p.nombre || "").trim() && (
                    <Text color={TINTA} fontSize="sm" opacity={0.75} noOfLines={1}
                          style={{ textShadow: INK_SHADOW }}>
                      {p.parentesco}
                    </Text>
                  )}
                </Box>
                <Box as="button" onClick={() => setIdentidadAbierta(true)}
                     flexShrink={0} display="inline-flex" alignItems="center" gap={1.5}
                     px={3} py={1.5} borderRadius="full" bg="rgba(255,251,243,0.72)"
                     border={`1px solid ${TINTA}33`} color={TINTA}
                     fontFamily="'EB Garamond', serif" fontSize="sm" fontWeight="700"
                     cursor="pointer" transition="all 0.18s"
                     _hover={{ borderColor: TINTA, transform: "translateY(-1px)" }}>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                       w="13px" h="13px" fill="currentColor" flexShrink={0}>
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T846-647L319-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                  </Box>
                  {t("metodo.psico.familiaEditar")}
                </Box>
              </Flex>
            )}
          </Box>

          <Box h="1px" mx={{ base: 5, md: 8 }} bg={`${TINTA}44`} />

          {/* ── PASO 2 · ¿A quién se parece? ── */}
          <Box px={{ base: 5, md: 8 }} pt={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }}>
            <Flex align="center" justify="space-between" gap={3} wrap="wrap">
              <Paso n={2} titulo={familia.eligeTitulo} />
              {/* Cuántas lleva elegidas, en una chapa: se lee de un vistazo y no
                  gasta una línea propia. */}
              <Flex flexShrink={0} align="center" px={3} py={1} borderRadius="full"
                    bg={completo ? TINTA : "rgba(255,251,243,0.72)"}
                    border={`1px solid ${completo ? TINTA : `${TINTA}33`}`}>
                <Text color={completo ? PAPEL : TINTA} fontSize="xs" fontWeight="700" letterSpacing="0.1em">
                  {elegidos.length}/{SIMBOLOS_POR_PERSONA}
                </Text>
              </Flex>
            </Flex>

            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} opacity={0.85} mt={2} lineHeight="1.6"
                  style={{ textShadow: INK_SHADOW }}>
              {completo ? t("metodo.psico.tocaParaCambiarla") : familia.eligeApoyo}
            </Text>

            {/* Rejilla por grupos (Animales / Personajes) */}
            <Flex direction="column" gap={{ base: 5, md: 6 }} mt={4}>
              {SIMBOLOS_GRUPOS.map((grupo) => {
                const delGrupo = simbolos.filter((s) => s.grupo === grupo);
                if (delGrupo.length === 0) return null;
                return (
                  <Box key={grupo}>
                    <Text color={TINTA} fontSize="xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase"
                          opacity={0.65} mb={2.5} style={{ textShadow: INK_SHADOW }}>
                      {grupoRotulo(grupo)}
                    </Text>
                    <Box display="grid" gap={{ base: 2.5, md: 3 }}
                         gridTemplateColumns={{ base: "repeat(auto-fill, minmax(76px, 1fr))",
                                                md: "repeat(auto-fill, minmax(88px, 1fr))" }}>
                      {delGrupo.map((s) => (
                        <TarjetaSimbolo
                          key={s.key}
                          s={s}
                          elegido={elegidos.includes(s.key)}
                          apagado={completo && !elegidos.includes(s.key)}
                          onClick={() => toggleSimbolo(s.key)}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </Flex>
          </Box>
        </Box>

        {/* Footer: quitar del mapa · hecho */}
        <Box position="relative" zIndex={1} flexShrink={0} borderTop={`1px solid ${TINTA}44`}
             px={{ base: 5, md: 8 }} py={{ base: 3.5, md: 4 }}>
          <Flex justify="space-between" align="center" gap={3}>
            {confirmarBorrado ? (
              <Flex align="center" gap={2}>
                <Text color={TINTA} fontSize="md" fontWeight="600" style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.quitarDelMapa")}</Text>
                <Box as="button" onClick={onEliminar} px={3.5} py={2} borderRadius="full"
                     bg="#8c2f13" color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="md"
                     cursor="pointer" _hover={{ filter: "brightness(1.1)" }}>{t("metodo.psico.siQuitar")}</Box>
                <Box as="button" onClick={() => setConfirmarBorrado(false)} px={3.5} py={2} borderRadius="full"
                     bg="transparent" border={`1.5px solid ${TINTA}88`} color={TINTA}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="md" cursor="pointer"
                     _hover={{ bg: `${TINTA}14` }}>{t("metodo.psico.no")}</Box>
              </Flex>
            ) : (
              <Box as="button" onClick={() => setConfirmarBorrado(true)}
                   px={{ base: 4, md: 5 }} py={2} borderRadius="full" bg="transparent"
                   border={`1.5px solid ${TINTA}66`} color={TINTA}
                   fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                   cursor="pointer" transition="all 0.18s" _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}>{t("metodo.psico.quitar")}</Box>
            )}

            <Box as="button" onClick={onClose}
                 px={{ base: 5, md: 6 }} py={2} borderRadius="full" bg={TINTA} color={PAPEL}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                 letterSpacing="0.04em" cursor="pointer"
                 boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                 _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>{t("metodo.psico.hecho")}</Box>
          </Flex>
        </Box>
        </>
        )}
      </Box>
    </Box>
  );
}

/** Una imagen del catálogo, pulsable. Elegida = anillo de tinta + ✓. */
function TarjetaSimbolo({ s, elegido, apagado, onClick }: {
  s: SimboloFamilia;
  elegido: boolean;
  apagado: boolean;
  onClick: () => void;
}) {
  return (
    <Box as="button" onClick={onClick} display="flex" flexDirection="column" alignItems="center" gap={1.5}
         opacity={apagado ? 0.4 : 1} cursor={apagado ? "not-allowed" : "pointer"}
         transition="all 0.16s"
         _hover={apagado ? {} : { transform: "translateY(-2px)" }}>
      <Box position="relative" w={{ base: "64px", md: "74px" }} h={{ base: "64px", md: "74px" }}
           borderRadius="full" overflow="hidden" bg="rgba(255,251,243,0.85)"
           border={elegido ? `2.5px solid ${TINTA}` : `1px solid ${TINTA}44`}
           boxShadow={elegido ? `0 0 0 3px ${TINTA}22, 0 4px 14px ${TINTA}44` : `0 2px 8px ${TINTA}22`}>
        <SimboloImg keyName={s.key} />
      </Box>
      <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight={elegido ? "700" : "600"}
            lineHeight="1.2" textAlign="center" noOfLines={1} style={{ textShadow: INK_SHADOW }}>
        {elegido ? `✓ ${s.nombre}` : s.nombre}
      </Text>
    </Box>
  );
}
