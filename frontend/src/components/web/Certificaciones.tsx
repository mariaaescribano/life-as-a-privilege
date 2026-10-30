import React, { useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
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

/** Diplomas de una sección en una fila que se desliza (deslizar con el dedo o con las flechas). */
const FILA_ALTO = { base: "190px", md: "250px" };

const Certificaciones = () => {
  const t = useT();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activa, setActiva] = useState(0);
  const filaRef = useRef<HTMLDivElement>(null);

  const closeLightbox = () => setLightboxIdx(null);
  const prevCert = () => setLightboxIdx((i) => (i !== null ? (i - 1 + certificados.length) % certificados.length : null));
  const nextCert = () => setLightboxIdx((i) => (i !== null ? (i + 1) % certificados.length : null));

  const visibles = secciones.filter((s) => s.items.length > 0);
  const seccion = visibles[Math.min(activa, visibles.length - 1)];

  const elegir = (i: number) => {
    setActiva(i);
    filaRef.current?.scrollTo({ left: 0, behavior: "auto" });
  };
  const deslizar = (dir: 1 | -1) => {
    const el = filaRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <>
      {/* ── MIS CERTIFICADOS: un título, seis temas para elegir y, debajo, los diplomas del tema
          elegido en una sola fila que se desliza (en vez de seis rejillas una debajo de otra). ── */}
      <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 4, md: 6 }}>
        <Box maxW="1100px" mx="auto">
          <Reveal inView amount={0.5} direction="up" distance={18} duration={0.8}>
            <Text
              textAlign="center"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "2xl", md: "4xl" }}
              letterSpacing="0.03em"
              lineHeight="1.25"
            >
              {t("quienSoy.certificados")}
            </Text>
          </Reveal>

          {/* Los temas, como pastillas. El activo se rellena con luz. */}
          <Reveal inView amount={0.3} direction="up" distance={14} duration={0.8} delay={0.15}>
            <Flex wrap="wrap" justify="center" gap={{ base: 2, md: 3 }} mt={{ base: 6, md: 8 }}>
              {visibles.map((sec, i) => {
                const on = i === activa;
                return (
                  <Box
                    key={sec.tituloKey}
                    as="button"
                    type="button"
                    onClick={() => elegir(i)}
                    aria-pressed={on}
                    px={{ base: 4, md: 5 }}
                    py="8px"
                    borderRadius="full"
                    fontFamily="'EB Garamond', serif"
                    fontWeight={on ? "700" : "500"}
                    fontSize={{ base: "sm", md: "md" }}
                    letterSpacing="0.06em"
                    color={on ? "#004f4f" : "white"}
                    bg={on ? "rgba(255,255,255,0.92)" : "transparent"}
                    border={`1px solid ${on ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)"}`}
                    boxShadow={on ? "0 0 16px rgba(255,255,255,0.4), 0 0 36px rgba(180,255,245,0.22)" : "none"}
                    transition="all 0.3s ease"
                    _focusVisible={focoBlanco}
                  >
                    {t(sec.tituloKey)}
                  </Box>
                );
              })}
            </Flex>
          </Reveal>

          {/* La fila de diplomas del tema elegido. Cambia con un fundido; los diplomas se ven
              ENTEROS (sin recortar), cada uno a su proporción. */}
          <Box position="relative" mt={{ base: 6, md: 8 }}>
            <Flex
              key={seccion.tituloKey}
              ref={filaRef}
              gap={{ base: 4, md: 6 }}
              overflowX="auto"
              px={{ base: 1, md: 2 }}
              py={4}
              align="center"
              sx={{
                scrollSnapType: "x proximity",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                "@keyframes diplomasEntran": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                animation: "diplomasEntran 0.6s cubic-bezier(0.22,1,0.36,1) both",
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            >
              {seccion.items.map((cert, i) => (
                <Box
                  key={cert.name}
                  as="button"
                  type="button"
                  flexShrink={0}
                  onClick={() => setLightboxIdx(certificados.indexOf(cert))}
                  aria-label={`${t(seccion.tituloKey)} ${i + 1}`}
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="0 0 14px rgba(255,255,255,0.2), 0 0 32px rgba(255,255,255,0.1)"
                  sx={{ scrollSnapAlign: "start" }}
                  transition="transform 0.3s ease, box-shadow 0.3s ease"
                  _hover={{ transform: "translateY(-4px)", boxShadow: "0 0 22px rgba(255,255,255,0.4), 0 0 50px rgba(180,255,245,0.25)" }}
                  _focusVisible={focoBlanco}
                >
                  <Image src={cert.img} alt="" h={FILA_ALTO} w="auto" maxW="none" display="block" />
                </Box>
              ))}
            </Flex>

            {/* Flechas (en móvil se desliza con el dedo). */}
            {(["izq", "dcha"] as const).map((lado) => (
              <Box
                key={lado}
                as="button"
                type="button"
                onClick={() => deslizar(lado === "izq" ? -1 : 1)}
                aria-label={lado === "izq" ? "‹" : "›"}
                display={{ base: "none", md: "flex" }}
                position="absolute"
                top="50%"
                {...(lado === "izq" ? { left: "-14px" } : { right: "-14px" })}
                transform="translateY(-50%)"
                w="40px"
                h="40px"
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="2xl"
                lineHeight="1"
                bg="rgba(0,128,128,0.85)"
                border="1px solid rgba(255,255,255,0.6)"
                boxShadow="0 0 14px rgba(255,255,255,0.3)"
                _focusVisible={focoBlanco}
              >
                {lado === "izq" ? "‹" : "›"}
              </Box>
            ))}
          </Box>
        </Box>
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
