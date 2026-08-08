import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { ComicModal } from "../../components/metodo/ComicModal";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { useT } from "../../i18n";

// Página /ilustraciones — galería con TODAS las series de viñetas de todas las
// disciplinas. Al pulsar una, se abre el popup inmersivo con el estilo de su
// disciplina (ComicModal). Grid: 4 por fila en escritorio, 1 en móvil.

export default function Ilustraciones() {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  // La galería no se muestra hasta que TODAS las portadas están descargadas:
  // entra ya completa (nada de imágenes cargando a trozos).
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Precarga de todas las portadas de la galería.
  useEffect(() => {
    const urls = ILUSTRACIONES
      .map((e) => e.cover)
      .filter((src): src is string => Boolean(src))
      .map((src) => encodeURI(src));

    if (urls.length === 0) {
      setImagesReady(true);
      return;
    }

    let cancelled = false;
    let done = 0;
    const marcarUna = () => {
      done += 1;
      if (!cancelled && done >= urls.length) setImagesReady(true);
    };

    urls.forEach((src) => {
      const img = new window.Image();
      img.onload = marcarUna;
      img.onerror = marcarUna; // una portada rota no debe colgar la página
      img.src = src;
    });

    // Red de seguridad: si alguna imagen nunca resuelve, mostramos igualmente.
    const failSafe = setTimeout(() => { if (!cancelled) setImagesReady(true); }, 10000);

    return () => { cancelled = true; clearTimeout(failSafe); };
  }, []);

  // Una vez cargadas las imágenes, disparamos la animación de entrada.
  useEffect(() => {
    if (!imagesReady) return;
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, [imagesReady]);

  // Mientras se descargan las portadas: fondo teal con la animación de la
  // ESTRELLA de astrología en blanco, centrada (la misma que el recorrido, en
  // lugar del spinner). El header se pinta ya para que cargue antes.
  if (!imagesReady) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Flex flex="1" align="center" justify="center" overflow="hidden">
          <LifeLoader color="#ffffff" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* Mandala separador */}
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

      {/* Título */}
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
          {t("ilustraciones.titulo")}
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "md", md: "xl" }}
          fontStyle="italic"
          letterSpacing="0.05em"
          lineHeight="1.5"
          textShadow="0 0 10px rgba(255,255,255,0.41), 0 0 21px rgba(255,255,255,0.22)"
          maxW={{ base: "100%", md: "620px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          {t("ilustraciones.subtitulo")}
        </Text>
      </Flex>

      {/* Grid: 4/fila en escritorio, 2 en tablet, 1 en móvil */}
      <Flex flex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 12, md: 16 }} pb={{ base: 20, md: 28 }}>
        <Grid
          w="100%"
          maxW="1180px"
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={{ base: 6, md: 6 }}
        >
          {ILUSTRACIONES.map((entry, i) => (
            <IlustracionCard key={entry.id} entry={entry} i={i} onOpen={() => setAbierta(entry)} />
          ))}
        </Grid>
      </Flex>

      <SiteFooter />

      {/* Popup inmersivo con el estilo de la disciplina */}
      <ComicModal
        isOpen={!!abierta}
        onClose={() => setAbierta(null)}
        vinetas={abierta?.vinetas ?? []}
        themeColor={abierta?.themeColor}
        disciplinaBgImage={abierta?.disciplinaBgImage}
        disciplinaBgColor={abierta?.disciplinaBgColor}
        textShadow={abierta?.textShadow}
        textColor={abierta?.textColor}
      />
    </Box>
  );
}
