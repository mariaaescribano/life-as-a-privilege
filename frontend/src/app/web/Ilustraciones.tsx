import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ComicModal } from "../../components/metodo/ComicModal";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import { StarsLayer } from "../../components/global/StarsLayer";

// Página /ilustraciones — galería con TODAS las series de viñetas de todas las
// disciplinas. Al pulsar una, se abre el popup inmersivo con el estilo de su
// disciplina (ComicModal). Grid: 4 por fila en escritorio, 1 en móvil.

function GaleriaCard({ entry, onOpen }: { entry: IlustracionEntry; onOpen: () => void }) {
  const [coverFailed, setCoverFailed] = useState(false);
  // Color del texto/borde de la tarjeta: `cardColor` si la entrada lo define
  // (p.ej. Nutrición, cuyo acento de cómic es claro e ilegible aquí), si no el
  // acento del cómic (themeColor).
  const c = entry.cardColor ?? entry.themeColor;
  return (
    <Box
      as="button"
      onClick={onOpen}
      position="relative"
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      borderRadius="2xl"
      overflow="hidden"
      border={`1px solid ${c}55`}
      bg="rgba(255,255,255,0.06)"
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      sx={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "all 0.25s ease",
        boxShadow: `0 0 16px ${c}2e, 0 0 40px ${c}1a, inset 0 0 24px rgba(255,255,255,0.04)`,
        _hover: {
          transform: "translateY(-4px)",
          borderColor: c,
          boxShadow: `0 0 26px ${c}99, 0 0 64px ${c}4d, inset 0 0 24px rgba(255,255,255,0.08)`,
        },
        _active: { transform: "translateY(-1px)" },
      }}
    >
      {/* Portada */}
      <Box position="relative" w="100%" aspectRatio={1} flexShrink={0} overflow="hidden" borderBottom="1px solid rgba(255,255,255,0.9)" bg="rgba(0,0,0,0.35)">
        {!coverFailed ? (
          <Box
            as="img"
            src={encodeURI(entry.cover)}
            alt={entry.titulo}
            loading="lazy"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            style={{ objectFit: "cover", objectPosition: "top" }}
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <Flex position="absolute" inset="0" align="center" justify="center">
            <Text fontSize="4xl" opacity={0.6}>✨</Text>
          </Flex>
        )}
      </Box>

      {/* Pie: disciplina + título. Su fondo es la imagen de la disciplina a la
          que pertenece (o el cielo estrellado en Astrología, que no tiene
          imagen), con un velo oscuro para que el texto siga legible. */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        flex="1"
        gap={1}
        py={{ base: 4, md: 4 }}
        px={3}
        position="relative"
        overflow="hidden"
      >
        {/* Fondo de la disciplina */}
        <Box position="absolute" inset="0" zIndex={0} pointerEvents="none">
          {entry.disciplinaBgImage ? (
            <>
              <Box
                position="absolute"
                inset="0"
                bgColor={entry.disciplinaBgColor}
                bgImage={`url('${encodeURI(entry.disciplinaBgImage)}')`}
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
              />
            </>
          ) : (
            <StarsLayer borderRadius="0" overlay="rgba(8,13,30,0.32)" />
          )}
        </Box>

        <Text color={c} fontSize="2xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase" position="relative" zIndex={1}>
          {entry.disciplina}
        </Text>
        <Text
          color={c}
          fontSize={{ base: "md", md: "md" }}
          fontWeight="700"
          letterSpacing="0.04em"
          textAlign="center"
          lineHeight="1.2"
          position="relative"
          zIndex={1}
        >
          {entry.titulo}
        </Text>
        <Flex align="center" gap={1.5} mt={1.5} color={c} fontSize="2xs" letterSpacing="0.18em" textTransform="uppercase"
              position="relative" zIndex={1}>
          <Text as="span">Ver</Text>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="13px" h="13px" fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export default function Ilustraciones() {
  const [mounted, setMounted] = useState(false);
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

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
          Ilustraciones
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
          Todas las ilustraciones del Mapa, reunidas. Pulsa una para leerla.
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
          {ILUSTRACIONES.map((entry) => (
            <GaleriaCard key={entry.id} entry={entry} onOpen={() => setAbierta(entry)} />
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
