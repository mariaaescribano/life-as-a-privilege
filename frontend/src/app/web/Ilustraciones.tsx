import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { ComicModal } from "../../components/metodo/ComicModal";
import { ILUSTRACIONES, ILUSTRACIONES_GALERIA, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { useT } from "../../i18n";
import { useParams } from "react-router-dom";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { presentacionPorKey } from "../../data/presentacionDisciplinas";
import { useComic } from "../../i18n/comics";
import { registrarActividad, disciplinaDe } from "../../components/global/RegistroActividad";

// Página /ilustraciones — galería con TODAS las series de viñetas de todas las
// disciplinas. Al pulsar una, se abre el popup inmersivo con el estilo de su
// disciplina (ComicModal). Grid: 4 por fila en escritorio, 1 en móvil.
//
// Con disciplina en la URL (/ilustraciones/:disciplina, la puerta izquierda de
// la portada de cada disciplina) es la MISMA página, pero enseñando solo las
// ilustraciones de esa disciplina y con su nombre de titular. Es un filtro
// sobre la misma lista: una serie nueva aparece en las dos sin tocar nada.

// Cuántas portadas retienen la pantalla de carga: dos filas de cuatro, que es
// lo que cabe sin bajar en escritorio (en móvil, de sobra). Tiene que ir a la
// par con el corte `eager`/`lazy` de IlustracionCard.
const PORTADAS_PRIMERA_PANTALLA = 8;

export default function Ilustraciones() {
  const t = useT();
  // Slug de la URL (/ilustraciones/astrologia). Sin slug → la galería entera.
  const { disciplina: slug } = useParams<{ disciplina?: string }>();
  const nombreDe = useNombreDisciplina();
  const disciplina = presentacionPorKey(slug);
  // Con disciplina: TODAS las suyas, en su orden (el filtro casa por la
  // ETIQUETA de la galería, que no siempre es el nombre interno: Hinduismo se
  // etiqueta "Ayurveda"). Sin disciplina: la selección barajada, que alterna
  // disciplinas y deja fuera media Nutrición (ver ilustracionesGaleria.ts).
  const entradas = useMemo(
    () => (disciplina
      ? ILUSTRACIONES.filter((e) => e.disciplina === disciplina.ilustracionesLabel)
      : ILUSTRACIONES_GALERIA),
    [disciplina],
  );
  const [mounted, setMounted] = useState(false);
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  // La galería no se muestra hasta que están descargadas las portadas de la
  // PRIMERA PANTALLA: lo que se ve sin bajar entra ya completo. Las de más
  // abajo se piden solas al acercarse (`loading="lazy"` en la tarjeta), que es
  // cuando además se encienden con su reveal. Esperar a las 38 eran 4,6 MB de
  // mandala girando.
  const [imagesReady, setImagesReady] = useState(false);
  // El cómic abierto, en el idioma activo. Un cómic sin traducir se lee en
  // español (`useComic` respeta el original viñeta a viñeta), así que no hace
  // falta distinguir aquí cuáles están hechos y cuáles no.
  const vinetasAbierta = useComic(abierta?.comicKey ?? abierta?.id ?? "", abierta?.vinetas ?? []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Qué cómic abre quien tiene cuenta: lo más fino que sabemos de sus gustos.
  useEffect(() => {
    if (!abierta) return;
    registrarActividad({
      recurso: `/ilustraciones#${abierta.id}`,
      tipo: "ilustracion",
      disciplina: disciplinaDe(abierta.disciplina),
      titulo: abierta.titulo,
    });
  }, [abierta]);

  // Precarga de las portadas de la primera pantalla (dos filas de cuatro: el
  // mismo corte que usa la tarjeta para decidir `eager`/`lazy`).
  useEffect(() => {
    const urls = entradas
      .slice(0, PORTADAS_PRIMERA_PANTALLA)
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
  }, [entradas]);

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
          src="/img/icono/life.webp"
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
          {disciplina ? nombreDe(disciplina.nom) : t("ilustraciones.titulo")}
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
          {disciplina ? t("ilustraciones.deDisciplina") : t("ilustraciones.subtitulo")}
        </Text>
      </Flex>

      {/* Grid: 4/fila en escritorio, 2 en tablet, 1 en móvil */}
      <Flex flex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 12, md: 16 }} pb={{ base: 20, md: 28 }}>
        {entradas.length === 0 ? (
          // Una disciplina puede no tener ilustraciones todavía (Cultura). Se
          // dice, en vez de dejar un hueco turquesa sin explicación.
          <Text
            color="rgba(255,255,255,0.88)"
            fontSize={{ base: "md", md: "xl" }}
            fontStyle="italic"
            textAlign="center"
            maxW="560px"
          >
            {t("ilustraciones.vacio")}
          </Text>
        ) : (
          <Grid
            w="100%"
            maxW="1180px"
            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={{ base: 6, md: 6 }}
          >
            {entradas.map((entry, i) => (
              <IlustracionCard key={entry.id} entry={entry} i={i} onOpen={() => setAbierta(entry)} />
            ))}
          </Grid>
        )}
      </Flex>

      <SiteFooter />

      {/* Popup inmersivo con el estilo de la disciplina */}
      <ComicModal
        isOpen={!!abierta}
        onClose={() => setAbierta(null)}
        vinetas={vinetasAbierta}
        themeColor={abierta?.themeColor}
        disciplinaBgImage={abierta?.disciplinaBgImage}
        disciplinaBgColor={abierta?.disciplinaBgColor}
        textShadow={abierta?.textShadow}
        textColor={abierta?.textColor}
      />
    </Box>
  );
}
