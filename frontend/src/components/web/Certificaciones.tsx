import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import { useT, type ClaveTexto } from "../../i18n";

/**
 * Los diplomas de María, en secciones, con visor a pantalla completa. Los usan
 * «Quién soy» y «Asesoría 1:1»: la lista vive solo aquí.
 */
type Certificado = { img: string; name: string };

// Auto-detecta todas las imágenes de src/assets/certificados
const certImages = import.meta.glob<string>("../../assets/certificados/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const allCerts: Certificado[] = Object.entries(certImages).map(([path, img]) => ({
  img,
  name: path.split("/").pop()!.replace(/\.\w+$/, ""),
}));

// Los diplomas se agrupan por lo que te aportan (no por el tipo de título ni
// por el prefijo del fichero). Cada grupo lista los NOMBRES de fichero de
// src/assets/certificados, en el orden en que se enseñan. El título se guarda
// como CLAVE, no como texto: este array se calcula una sola vez al cargar el
// módulo, así que un texto ya traducido se quedaría congelado en el idioma de
// ese momento. OJO: un diploma que no esté en ningún grupo NO se enseña (el 21,
// Neuromarketing, se quitó a propósito); al añadir uno nuevo hay que ponerlo aquí.
const GRUPOS: { tituloKey: ClaveTexto; nombres: string[] }[] = [
  { tituloKey: "quienSoy.certif.acompanar", nombres: ["fp0", "fp1", "fp2", "34"] },
  { tituloKey: "quienSoy.certif.mente", nombres: ["2", "26", "e3", "e4", "e7"] },
  { tituloKey: "quienSoy.certif.cuerpo", nombres: ["e1", "e2", "e0", "32", "25", "24", "13", "14", "19", "20", "35", "e5"] },
  { tituloKey: "quienSoy.certif.comes", nombres: ["18", "e6", "11", "7", "3"] },
  { tituloKey: "quienSoy.certif.salud", nombres: ["1", "12", "27", "10"] },
  { tituloKey: "quienSoy.certif.venimos", nombres: ["4", "5", "29", "28", "30", "31", "33"] },
];

const secciones: { tituloKey: ClaveTexto; items: Certificado[] }[] = GRUPOS.map((g) => ({
  tituloKey: g.tituloKey,
  items: g.nombres
    .map((n) => allCerts.find((c) => c.name === n))
    .filter((c): c is Certificado => !!c),
}));

// Lista plana para el visor (mismo orden que se muestran)
const certificados: Certificado[] = secciones.flatMap((s) => s.items);

const Certificaciones = ({ iconoSeparador = "/img/icono/life.webp" }: { iconoSeparador?: string }) => {
  const t = useT();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const closeLightbox = () => setLightboxIdx(null);
  const prevCert = () => setLightboxIdx((i) => (i !== null ? (i - 1 + certificados.length) % certificados.length : null));
  const nextCert = () => setLightboxIdx((i) => (i !== null ? (i + 1) % certificados.length : null));

  return (
    <>
      {/* ── SECCIONES DE CERTIFICADOS ── */}
      <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 12 }} pb={0}>
        <Flex direction="column" gap={{ base: 12, md: 16 }} maxW="1100px" mx="auto">
          {secciones.filter((s) => s.items.length > 0).map((seccion, idx) => (
            <Box key={seccion.tituloKey}>
              {/* Separador horizontal con la flor en medio, encima del título.
                  El contenedor de secciones ya deja `gap` por arriba; con este mb
                  igual, el espacio por arriba y por abajo de la flor es el mismo. */}
              {idx > 0 && (
                <Reveal inView amount={0.5} direction="none" scaleFrom={0.7} duration={0.9} w="100%">
                  <Flex align="center" justify="center" gap={{ base: 4, md: 6 }} w="100%" mx="auto" mb={{ base: 12, md: 16 }}>
                    <Box h="1px" w={{ base: "60px", md: "150px" }} bg="linear-gradient(to right, transparent, rgba(255,255,255,0.55))" />
                    <Image
                      src={iconoSeparador}
                      alt=""
                      h={{ base: "26px", md: "34px" }}
                      objectFit="contain"
                      flexShrink={0}
                      style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.45)) drop-shadow(0 0 18px rgba(255,255,255,0.22))" }}
                    />
                    <Box h="1px" w={{ base: "60px", md: "150px" }} bg="linear-gradient(to left, transparent, rgba(255,255,255,0.55))" />
                  </Flex>
                </Reveal>
              )}

              {/* Subtítulo de la sección */}
              <Reveal inView amount={0.5} direction="up" distance={18} duration={0.8} delay={0.1}>
                <Flex direction="column" align="center" mb={{ base: 6, md: 8 }}>
                  <Text
                    color="white"
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="600"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    textAlign="center"
                    textShadow="0 0 12px rgba(255,255,255,0.4), 0 0 26px rgba(255,255,255,0.2)"
                  >
                    {t(seccion.tituloKey)}
                  </Text>
                </Flex>
              </Reveal>

              {/* Rejilla de la sección · 2 por fila en móvil, 4 en ordenador.
                  Va con flex-wrap CENTRADO y no con una rejilla de columnas
                  fijas: el número de diplomas de cada sección cambia cada vez
                  que se añade uno y casi nunca es múltiplo de 4, así que con
                  columnas la última fila se quedaba pegada a la izquierda con
                  el resto del ancho vacío.
                  Centrando, una fila incompleta parece querida. El ancho de la
                  tarjeta se calcula descontando su parte del hueco, para que
                  sea EXACTAMENTE el mismo que tendría en la rejilla —así todas
                  las secciones siguen teniendo el diploma del mismo tamaño. */}
              <Flex
                wrap="wrap"
                justify="center"
                gap={{ base: 4, md: 6 }}
                sx={{
                  "& > *": {
                    flex: "0 0 auto",
                    // 2 por fila (1 hueco de 16 px → 8 px por tarjeta)
                    width: "calc(50% - 8px)",
                    // 4 por fila (3 huecos de 24 px → 18 px por tarjeta)
                    "@media (min-width: 48em)": { width: "calc(25% - 18px)" },
                  },
                }}
              >
                {seccion.items.map((cert, i) => {
                  const globalIdx = certificados.indexOf(cert);
                  return (
                    // Un Reveal por diploma (no uno para toda la rejilla): cada
                    // uno entra al asomar él, así que al bajar van saliendo de
                    // uno en uno. El retraso (según su sitio en la fila) hace
                    // que, cuando asoma una fila entera, caiga de izquierda a
                    // derecha en cascada y no de golpe.
                    <Reveal key={cert.name} inView amount={0.25} direction="up" distance={28} scaleFrom={0.94} duration={0.75} delay={(i % 4) * 0.14}>
                      <Box
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="0 0 14px rgba(255,255,255,0.22), 0 0 32px rgba(255,255,255,0.12)"
                        transition="transform 0.25s ease, box-shadow 0.25s ease"
                        _hover={{ transform: "translateY(-4px)", boxShadow: "0 0 22px rgba(255,255,255,0.4), 0 0 50px rgba(180,255,245,0.25)" }}
                        cursor="pointer"
                        onClick={() => setLightboxIdx(globalIdx)}
                      >
                        <Image src={cert.img} alt={`${t(seccion.tituloKey)} ${i + 1}`} w="100%" h={{ base: "130px", md: "170px" }} objectFit="cover" display="block" />
                      </Box>
                    </Reveal>
                  );
                })}
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* ── VISOR ── */}
      {lightboxIdx !== null && (
        <Box
          position="fixed"
          inset={0}
          zIndex={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0, 0, 0, 0.41)"
          sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={closeLightbox}
        >
          <Box
            position="absolute"
            top={4}
            right={5}
            as="button"
            onClick={closeLightbox}
            color="white"
            fontSize="2xl"
            fontWeight="300"
            cursor="pointer"
            bg="rgba(0,0,0,0.45)"
            borderRadius="full"
            w="44px"
            h="44px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            transition="background 0.2s"
            zIndex={201}
          >
            ✕
          </Box>

          <Box
            position="absolute"
            left={4}
            as="button"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); prevCert(); }}
            color="white"
            fontSize="4xl"
            cursor="pointer"
            bg="rgba(0,0,0,0.45)"
            borderRadius="full"
            w="52px"
            h="52px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            transition="background 0.2s"
            zIndex={201}
          >
            ‹
          </Box>

          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} maxW={{ base: "90vw", md: "70vw" }} maxH="85vh">
            <Image
              src={certificados[lightboxIdx].img}
              alt={`Certificado ${lightboxIdx + 1}`}
              maxW="100%"
              maxH="85vh"
              objectFit="contain"
              borderRadius="xl"
              boxShadow="0 20px 60px rgba(0,0,0,0.6)"
            />
          </Box>

          <Box
            position="absolute"
            right={4}
            as="button"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); nextCert(); }}
            color="white"
            fontSize="4xl"
            cursor="pointer"
            bg="rgba(0,0,0,0.45)"
            borderRadius="full"
            w="52px"
            h="52px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            transition="background 0.2s"
            zIndex={201}
          >
            ›
          </Box>
        </Box>
      )}
    </>
  );
};

export default Certificaciones;
