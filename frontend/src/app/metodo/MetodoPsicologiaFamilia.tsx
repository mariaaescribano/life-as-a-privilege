// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · TU FAMILIA  ·  6/22   (ruta interna /familia)
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
  type SimboloFamilia,
} from "../../components/metodo/familiaSimbolos";
import { useImagesReady } from "../../hooks/useImagesReady";
import {
  experienciaById,
  FAMILIA,
  GENOGRAMA,
  personaLabel,
  personaSimbolos,
  SIMBOLOS_POR_PERSONA,
  type PersonaGenograma,
} from "../../components/metodo/psicologiaRecorrido";
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
                title={FAMILIA.titulo}
                pageLabel="6/22"
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: "← Línea de Vida", onClick: () => ir(`/metodo/psicologia/${exp.id}`) }}
                next={{
                  label: "Genograma →",
                  onClick: irAlGenograma,
                  disabled: !algunSimbolo,
                  disabledTooltip:
                    personas.length === 0
                      ? "Coloca a tu familia con los «+» y elige el personaje o animal de cada uno."
                      : "Elige el personaje o animal de al menos una persona para continuar.",
                }}
              />
            </Reveal>

            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>{FAMILIA.intro}</IntroRecorrido>
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
                  ? "Toca un «+» junto a tu foto para colocar a alguien: arriba tus padres y abuelos, a los lados tus hermanos o tu pareja."
                  : "Toca a cualquiera de los tuyos para elegir el personaje o el animal que se le parece."}
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

function PopupPersonaje({ p, onCampo, onEliminar, onClose }: {
  p: PersonaGenograma;
  onCampo: (campos: Partial<PersonaGenograma>) => void;
  onEliminar: () => void;
  onClose: () => void;
}) {
  useLockBodyScroll(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  // Solo el catálogo: la foto de la persona NO entra aquí a propósito, o al
  // subir una nueva el popup entero se iría al loader en mitad de la edición.
  const fotosListas = useImagesReady(SIMBOLOS_SRCS);

  const elegidos = personaSimbolos(p);
  const completo = elegidos.length >= SIMBOLOS_POR_PERSONA;

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
        {/* Cerrar */}
        <Box as="button" onClick={onClose} position="absolute" top={3} right={3} zIndex={3}
             w="38px" h="38px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
             color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="lg" cursor="pointer"
             _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>
          ✕
        </Box>

        {/* Cabecera: quién es */}
        <Box position="relative" zIndex={1} flexShrink={0} borderBottom={`1px solid ${TINTA}55`}
             px={{ base: 5, md: 8 }} pt={{ base: 6, md: 7 }} pb={{ base: 4, md: 5 }}>
          <Flex align="center" gap={{ base: 4, md: 5 }}>
            <FotoPersonaBoton
              foto={p.foto}
              alt={personaLabel(p)}
              onSubida={(url) => onCampo({ foto: url })}
              onError={setError}
            />
            <Flex direction="column" gap={2} flex="1" minW={0} pr={9}>
              <Input
                value={p.nombre}
                onChange={(e) => onCampo({ nombre: e.target.value })}
                placeholder="Su nombre…"
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
                placeholder="Parentesco (madre, abuelo…)"
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

          {/* Parentescos sugeridos */}
          <Flex wrap="wrap" gap={1.5} mt={3}>
            {GENOGRAMA.parentescos.map((par) => (
              <Box as="button" key={par} onClick={() => onCampo({ parentesco: par })}
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
        </Box>

        {/* Cuerpo scrollable: el selector de personajes/animales */}
        <Box position="relative" zIndex={1} flex="1" overflowY="auto" overscrollBehavior="contain"
             px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}
             sx={scrollAcuarela(TINTA)}>

          <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.3"
                style={{ textShadow: INK_SHADOW }}>
            {FAMILIA.eligeTitulo}
          </Text>
          <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} opacity={0.85} mt={1} lineHeight="1.6"
                style={{ textShadow: INK_SHADOW }}>
            {FAMILIA.eligeApoyo}
          </Text>

          {/* Cuántas lleva elegidas */}
          <Flex align="center" gap={2} mt={3}>
            <Text color={TINTA} fontSize="xs" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase"
                  opacity={0.7} style={{ textShadow: INK_SHADOW }}>
              {elegidos.length} de {SIMBOLOS_POR_PERSONA} elegidas
            </Text>
            {completo && (
              <Text color={TINTA} fontSize="xs" fontStyle="italic" opacity={0.7} style={{ textShadow: INK_SHADOW }}>
                · toca una elegida para cambiarla
              </Text>
            )}
          </Flex>

          {/* Rejilla por grupos (Animales / Personajes) */}
          <Flex direction="column" gap={{ base: 5, md: 6 }} mt={4}>
            {SIMBOLOS_GRUPOS.map((grupo) => {
              const delGrupo = SIMBOLOS_FAMILIA.filter((s) => s.grupo === grupo);
              if (delGrupo.length === 0) return null;
              return (
                <Box key={grupo}>
                  <Text color={TINTA} fontSize="xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase"
                        opacity={0.65} mb={2.5} style={{ textShadow: INK_SHADOW }}>
                    {grupo}
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

        {/* Footer: quitar del mapa · hecho */}
        <Box position="relative" zIndex={1} flexShrink={0} borderTop={`1px solid ${TINTA}44`}
             px={{ base: 5, md: 8 }} py={{ base: 3.5, md: 4 }}>
          <Flex justify="space-between" align="center" gap={3}>
            {confirmarBorrado ? (
              <Flex align="center" gap={2}>
                <Text color={TINTA} fontSize="md" fontWeight="600" style={{ textShadow: INK_SHADOW }}>
                  ¿Quitarla del mapa?
                </Text>
                <Box as="button" onClick={onEliminar} px={3.5} py={2} borderRadius="full"
                     bg="#8c2f13" color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="md"
                     cursor="pointer" _hover={{ filter: "brightness(1.1)" }}>
                  Sí, quitar
                </Box>
                <Box as="button" onClick={() => setConfirmarBorrado(false)} px={3.5} py={2} borderRadius="full"
                     bg="transparent" border={`1.5px solid ${TINTA}88`} color={TINTA}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="md" cursor="pointer"
                     _hover={{ bg: `${TINTA}14` }}>
                  No
                </Box>
              </Flex>
            ) : (
              <Box as="button" onClick={() => setConfirmarBorrado(true)}
                   px={{ base: 4, md: 5 }} py={2} borderRadius="full" bg="transparent"
                   border={`1.5px solid ${TINTA}66`} color={TINTA}
                   fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                   cursor="pointer" transition="all 0.18s" _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}>
                Quitar
              </Box>
            )}

            <Box as="button" onClick={onClose}
                 px={{ base: 5, md: 6 }} py={2} borderRadius="full" bg={TINTA} color={PAPEL}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                 letterSpacing="0.04em" cursor="pointer"
                 boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                 _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
              Hecho ✓
            </Box>
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
