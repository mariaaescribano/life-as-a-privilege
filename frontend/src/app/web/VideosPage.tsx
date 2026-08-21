import React, { useEffect, useRef, useState } from "react";
import {
  Box, Flex, Image, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { glowHeader } from "../../components/metodo/FotoBox";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { RevealStagger, RevealItem } from "../../components/global/Reveal";
import { useSinBarraDeScroll } from "../../components/global/sinBarraDeScroll";
import { disciplinaCursoBySlug } from "../../data/disciplinasCurso";
import { portadaDe, youtubeId, useVideos, type VideoApi } from "../../data/videosApi";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { useT } from "../../i18n";

// ─────────────────────────────────────────────────────────────────────────
// VisorShort — el short se ve AQUÍ, no en YouTube.
//
// Un popup con el reproductor incrustado en vertical (9:16, lo que mide un
// short). El alto manda: el ancho sale de él, y `maxH` impide que en una
// pantalla estrecha se salga por los lados. El <iframe> solo existe mientras el
// popup está abierto — al cerrarlo se desmonta y el vídeo para solo.
// ─────────────────────────────────────────────────────────────────────────
function VisorShort({ video, onClose }: { video: VideoApi | null; onClose: () => void }) {
  const cuerpoRef = useRef<HTMLDivElement>(null);
  useSinBarraDeScroll(cuerpoRef, !!video);

  const id = video ? youtubeId(video.url) : "";
  const disc = video ? disciplinaCursoBySlug(video.disciplina) : undefined;
  const tinta = disc?.color ?? "#ffffff";

  return (
    // `blockScrollOnMount` + `useSinBarraDeScroll`: con el visor abierto, la
    // página de detrás NO se mueve. Y `scrollBehavior="inside"`, no "outside":
    // el de fuera pone `overflow: auto` en el contenedor del diálogo y bastaba
    // un píxel de más para que apareciera su propia barra.
    <Modal
      isOpen={!!video}
      onClose={onClose}
      isCentered
      size="full"
      scrollBehavior="inside"
      blockScrollOnMount
      preserveScrollBarGap
    >
      <ModalOverlay bg="rgba(0,0,0,0.86)" sx={{ backdropFilter: "blur(10px)" }} />
      <ModalContent bg="transparent" boxShadow="none" m={0} maxW="100vw" overflow="hidden">
        <ModalCloseButton
          color="white"
          size="lg"
          top={{ base: 3, md: 5 }}
          right={{ base: 3, md: 5 }}
          zIndex={2}
          _hover={{ bg: "rgba(255,255,255,0.14)" }}
        />
        <ModalBody ref={cuerpoRef} display="flex" alignItems="center" justifyContent="center" p={0} h="100dvh" overflow="hidden">
          <Box
            position="relative"
            aspectRatio={9 / 16}
            h={{ base: "82dvh", md: "88dvh" }}
            // Sin esto, en una pantalla estrecha el alto manda y el ancho se
            // sale por los lados: aquí el alto cede para que quepa a lo ancho.
            maxH="calc(92vw * 16 / 9)"
            borderRadius="2xl"
            overflow="hidden"
            bg="#000"
            // El halo de siempre (el del header), no una sombra oscura.
            boxShadow={glowHeader(tinta)}
          >
            {id && (
              <Box
                as="iframe"
                src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
                title={video?.titulo ?? ""}
                w="100%"
                h="100%"
                border="none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TarjetaVideo — el box de un vídeo:
//
//   ┌─────────────────────┐
//   │                     │
//   │       Portada       │  ← en VERTICAL (retrato), como el propio short
//   │                     │
//   ├─────────────────────┤
//   │ (o)  Título         │  ← a la IZQUIERDA el icono de su disciplina
//   │      Disciplina     │
//   └─────────────────────┘
//
// La tarjeta entera es el botón (nada de «Ver», ni triángulo de play encima de
// la foto): lo que invita a pulsar es el zoom lento de la portada al pasar el
// puntero. Al pulsar se abre el visor, sin salir de la web.
// ─────────────────────────────────────────────────────────────────────────
function TarjetaVideo({ video, onAbrir }: { video: VideoApi; onAbrir: () => void }) {
  const nombreDisciplina = useNombreDisciplina();
  const [imgErr, setImgErr] = useState(false);

  const disc = disciplinaCursoBySlug(video.disciplina);
  const tinta = disc?.color ?? "#ffffff";
  const bg = disc?.bg ?? "#00696b";
  const Icon = disc?.Icon;
  const foto = portadaDe(video);
  const hayFoto = !!foto && !imgErr;

  return (
    <Box
      as="button"
      onClick={onAbrir}
      role="group"
      textAlign="left"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      w="100%"
      h="100%"
      borderRadius="2xl"
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      // El halo del header (glowHeader), NO un glow hecho solo con el acento:
      // hay disciplinas cuyo `<disc>Txt` es oscuro —Psicología es un marrón
      // #5e2d10— y con él la tarjeta no se rodeaba de luz, sino de una sombra
      // sucia. Este halo es blanco/menta con un punto del acento, así que se ve
      // igual de bien con las ocho.
      boxShadow={glowHeader(tinta)}
      transition="transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s ease"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "0 0 22px rgba(255,255,255,0.26), 0 0 48px rgba(255,255,255,0.14), 0 0 80px rgba(180,255,245,0.16)",
      }}
      _active={{ transform: "translateY(-2px) scale(0.985)" }}
    >
      {/* Fondo temático de la disciplina: se ve en el pie, bajo el título. */}
      {disc && <DisciplinaBgLayer nom={disc.nom} borderRadius="2xl" overlay={`${bg}55`} />}

      {/* ── Portada, con el título incrustado abajo ── */}
      <Box
        position="relative"
        zIndex={1}
        w="100%"
        // Vertical (retrato), como el short al que lleva.
        aspectRatio={3 / 4}
        overflow="hidden"
        flexShrink={0}
        bg={`${tinta}12`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {hayFoto && (
          <Image
            src={foto}
            alt=""
            w="100%"
            h="100%"
            objectFit="cover"
            onError={() => setImgErr(true)}
            transition="transform 0.55s cubic-bezier(0.22,1,0.36,1)"
            _groupHover={{ transform: "scale(1.07)" }}
          />
        )}

        {/* Velo que oscurece SOLO la franja de abajo, para que el título se lea
            sobre cualquier foto. Mismo degradado que el cómic de /elMetodo: va
            corto y con la parte alta transparente, para comerse lo menos
            posible de la imagen. Hex-alpha y NO rgba(): las comas del rgba()
            rompen el `bgGradient` de Chakra. */}
        <Box
          position="absolute"
          left={0}
          right={0}
          bottom={0}
          h="52%"
          pointerEvents="none"
          bgGradient="linear(to-t, #000000d6, #0000009e 42%, #00000047 74%, #00000000)"
        />

        {/* El título, sobre la foto. Sombra OSCURA (no el glow blanco del resto
            de la página): sobre las zonas claras de la foto un halo blanco lo
            dejaría ilegible. */}
        <Text
          position="absolute"
          left={0}
          right={0}
          bottom={0}
          px={{ base: 3.5, md: 4 }}
          pb={{ base: 3, md: 3.5 }}
          color="white"
          fontWeight="700"
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="1.3"
          letterSpacing="0.01em"
          noOfLines={2}
          textShadow="0 1px 4px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.8), 0 0 18px rgba(0,0,0,0.6)"
          transition="transform 0.3s cubic-bezier(0.22,1,0.36,1)"
          _groupHover={{ transform: "translateY(-2px)" }}
        >
          {video.titulo}
        </Text>
      </Box>

      {/* ── Pie: la disciplina a la izquierda y la flecha a la derecha del todo.
             El título ya no vive aquí (está sobre la foto): esta franja solo
             dice de qué es y que se puede pulsar. ── */}
      <Flex
        position="relative"
        zIndex={1}
        flex="1"
        align="center"
        gap={2.5}
        px={{ base: 3, md: 3.5 }}
        py={{ base: 2.5, md: 3 }}
      >
        {Icon && (
          <Flex
            flexShrink={0}
            align="center"
            justify="center"
            w={{ base: "30px", md: "34px" }}
            h={{ base: "30px", md: "34px" }}
            borderRadius="full"
            bg={`${tinta}1c`}
            border={`1.5px solid ${tinta}`}
            boxShadow={`0 0 10px ${tinta}66`}
          >
            <Icon size={{ base: "18px", md: "20px" }} />
          </Flex>
        )}
        {disc && (
          <Text
            color={tinta}
            fontWeight="700"
            fontSize={{ base: "xs", md: "sm" }}
            letterSpacing="0.06em"
            noOfLines={1}
            minW={0}
          >
            {nombreDisciplina(disc.nom)}
          </Text>
        )}
        {/* La flecha: «pulsa y se abre». Se desplaza un poco al pasar por
            encima, que es lo que la convierte en una invitación. */}
        <Text
          ml="auto"
          flexShrink={0}
          color={tinta}
          fontSize={{ base: "lg", md: "xl" }}
          lineHeight="1"
          transition="transform 0.3s cubic-bezier(0.22,1,0.36,1)"
          _groupHover={{ transform: "translateX(4px)" }}
        >
          →
        </Text>
      </Flex>
    </Box>
  );
}

export default function VideosPage() {
  const t = useT();
  const { videos, cargando } = useVideos();
  const [mounted, setMounted] = useState(false);
  // El vídeo que se está viendo en el popup (null = ninguno).
  const [viendo, setViendo] = useState<VideoApi | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "48px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex direction="column" align="center" textAlign="center" px={{ base: 5, md: 10 }} pt={{ base: 6, md: 8 }} gap={{ base: 3, md: 4 }}>
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 14px rgba(255,255,255,0.64), 0 0 30px rgba(255,255,255,0.41), 0 0 56px rgba(180,255,245,0.34)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          {t("header.videos")}
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "md", md: "xl" }}
          fontStyle="italic"
          letterSpacing="0.05em"
          lineHeight="1.5"
          maxW={{ base: "100%", md: "620px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          {t("videos.subtitulo")}
        </Text>
      </Flex>

      {/* ── LOS VÍDEOS ── */}
      <Flex flex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 12, md: 16 }} pb={{ base: 20, md: 28 }}>
        <Box w="100%" maxW="1120px">
          {cargando ? (
            <LifeLoader color="#ffffff" />
          ) : videos.length === 0 ? (
            <Text color="rgba(255,255,255,0.8)" fontStyle="italic" textAlign="center" fontSize={{ base: "md", md: "lg" }}>
              {t("videos.vacio")}
            </Text>
          ) : (
            <RevealStagger
              display="grid"
              gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
              gap={{ base: 4, md: 6 }}
              stagger={0.08}
            >
              {videos.map((v) => (
                <RevealItem key={v.id} scaleFrom={0.96}>
                  <TarjetaVideo video={v} onAbrir={() => setViendo(v)} />
                </RevealItem>
              ))}
            </RevealStagger>
          )}
        </Box>
      </Flex>

      <SiteFooter />

      {/* El short, dentro de la web. */}
      <VisorShort video={viendo} onClose={() => setViendo(null)} />
    </Box>
  );
}
