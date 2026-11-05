import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Portal, SimpleGrid, Text } from "@chakra-ui/react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { useT, type ClaveTexto } from "../../i18n";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

/**
 * Los diplomas de María. En la página, el título y un botón sobre el mármol
 * («Ver certificados»); al pulsarlo se abre un popup inmersivo: en ordenador, a la
 * izquierda el título y el diploma elegido en grande, y a la derecha los diplomas en
 * miniatura (filas de tres, con scroll, agrupados por tema); en móvil, el diploma
 * arriba y las miniaturas debajo. La lista vive solo aquí.
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

// Lista plana (mismo orden que se muestran)
const certificados: Certificado[] = secciones.flatMap((s) => s.items);

const TQ = "#004f4f";
const ORO = "#b08d3f";

// Entrada de cada pieza del popup: sube y se aclara, con su retraso. Ya con el mármol puesto.
const entra = (delay: number, dur = 0.8) => ({
  "@keyframes certSube": { from: { opacity: 0, transform: "translateY(18px)" }, to: { opacity: 1, transform: "none" } },
  animation: `certSube ${dur}s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});
const MARMOL_DESKTOP = "/img/fondos/marmolfondo.webp";
const MARMOL_MOVIL = "/img/fondos/marmolfondo-crema.webp";

const Certificaciones = () => {
  const t = useT();
  const [abierto, setAbierto] = useState(false);
  const [sel, setSel] = useState(0);
  const reducir = useReducedMotion();
  // El mármol SIEMPRE va primero: se precarga y se funde; solo después entra el contenido.
  const [fondoListo, setFondoListo] = useState(false);
  const [contenido, setContenido] = useState(false);

  useLockBodyScroll(abierto, { fijarFondo: true });

  useEffect(() => {
    if (!abierto) { setFondoListo(false); setContenido(false); return; }
    let vivo = true;
    let t2: number | undefined;
    const img = new window.Image();
    const listo = () => {
      if (!vivo) return;
      setFondoListo(true);
      t2 = window.setTimeout(() => { if (vivo) setContenido(true); }, reducir ? 0 : 750);
    };
    img.onload = listo;
    img.onerror = listo;
    img.src = window.innerWidth >= 768 ? MARMOL_DESKTOP : MARMOL_MOVIL;
    if (img.complete) listo();
    return () => { vivo = false; if (t2) window.clearTimeout(t2); };
  }, [abierto, reducir]);

  // Escape cierra el popup.
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setAbierto(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  const visibles = secciones.filter((s) => s.items.length > 0);
  const actual = certificados[sel];
  const seccionActual = visibles.find((s) => s.items.includes(actual));

  return (
    <>
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

          {/* Botón con el mármol de fondo: abre el popup de los diplomas. */}
          <Reveal inView amount={0.3} direction="up" distance={14} duration={0.8} delay={0.15}>
            <Flex justify="center" mt={{ base: 6, md: 8 }}>
              <Box
                as="button"
                type="button"
                onClick={() => setAbierto(true)}
                px={{ base: 8, md: 10 }}
                py={{ base: "12px", md: "14px" }}
                borderRadius="full"
                color={TQ}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.1em"
                textTransform="uppercase"
                bgImage="url('/img/fondos/marmolfondo.webp')"
                bgSize="cover"
                bgPosition="center"
                border={`1px solid ${TQ}88`}
                boxShadow={`0 0 18px ${ORO}55, 0 0 40px ${ORO}2e`}
                transition="all 0.25s ease"
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 24px ${ORO}88, 0 0 54px ${ORO}44` }}
                _focusVisible={focoBlanco}
              >
                {t("quienSoy.verCertificados")}
              </Box>
            </Flex>
          </Reveal>
        </Box>
      </Box>

      {/* ── POPUP INMERSIVO ── */}
      {abierto && (
        <Portal>
          <Box
            position="fixed"
            inset={0}
            zIndex={2000}
            fontFamily="'EB Garamond', serif"
            display="flex"
            flexDirection={{ base: "column", lg: "row" }}
            gap={{ base: 4, lg: 10 }}
            px={{ base: 4, md: 8, lg: 14 }}
            pt={{ base: 16, lg: 14 }}
            pb={{ base: 4, lg: 10 }}
            role="dialog"
            aria-modal="true"
            aria-label={t("quienSoy.certificados")}
          >
            {/* El mármol: lo primero que sale, con un fundido tranquilo. */}
            <Box
              position="absolute"
              inset={0}
              zIndex={0}
              pointerEvents="none"
              bgImage={{ base: `url('${MARMOL_MOVIL}')`, md: `url('${MARMOL_DESKTOP}')` }}
              bgSize="cover"
              bgPosition="center"
              bgRepeat="no-repeat"
              opacity={fondoListo ? 1 : 0}
              transition={reducir ? "none" : "opacity 0.7s ease"}
            />
            {contenido && (<>
            {/* Cruz arriba a la derecha */}
            <Box
              as="button"
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="✕"
              autoFocus
              position="absolute"
              top={{ base: 3, md: 5 }}
              right={{ base: 3, md: 6 }}
              zIndex={3}
              sx={entra(0.05, 0.6)}
              w="44px"
              h="44px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={TQ}
              bg="rgba(255,255,255,0.35)"
              border={`1px solid ${TQ}88`}
              boxShadow={`0 0 14px ${ORO}55`}
              cursor="pointer"
              transition="background 0.2s"
              _hover={{ bg: "rgba(255,255,255,0.6)" }}
              _focusVisible={focoBlanco}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </Box>

            {/* Izquierda: título + el diploma elegido */}
            <Flex
              direction="column"
              flex={{ base: "0 0 auto", lg: "1.15" }}
              minW={0}
              minH={0}
              gap={{ base: 2, lg: 5 }}
              h={{ base: "42vh", lg: "auto" }}
              position="relative"
              zIndex={1}
            >
              <Text
                color={TQ}
                fontWeight="700"
                fontSize={{ base: "lg", md: "2xl", lg: "4xl" }}
                letterSpacing="0.03em"
                lineHeight="1.25"
                pr={{ base: 12, lg: 0 }}
                sx={entra(0.1)}
              >
                {t("quienSoy.certificados")}
              </Text>
              {seccionActual && (
                <Text color={`${TQ}cc`} fontStyle="italic" fontSize={{ base: "sm", md: "lg" }} display={{ base: "none", lg: "block" }} sx={entra(0.25)}>
                  {t(seccionActual.tituloKey)}
                </Text>
              )}
              <Flex flex="1" minH={0} align="center" justify="center" sx={entra(0.35, 1)}>
                <Image
                  key={actual?.name}
                  src={actual?.img}
                  alt={`${t("quienSoy.certificados")} ${sel + 1}`}
                  maxW="100%"
                  maxH="100%"
                  objectFit="contain"
                  borderRadius="lg"
                  boxShadow={`0 0 22px ${ORO}66, 0 0 56px ${ORO}33`}
                  sx={{
                    "@keyframes certCambia": { from: { opacity: 0, transform: "scale(0.97)" }, to: { opacity: 1, transform: "none" } },
                    animation: "certCambia 0.4s cubic-bezier(0.22,1,0.36,1) both",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                />
              </Flex>
            </Flex>

            {/* Derecha: miniaturas por tema, con scroll */}
            <Box
              flex="1"
              minW={0}
              minH={0}
              overflowY="scroll"
              overscrollBehavior="contain"
              pr={3}
              position="relative"
              zIndex={1}
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: `${TQ}99 ${TQ}22`,
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": { background: `${TQ}22`, borderRadius: "8px" },
                "&::-webkit-scrollbar-thumb": { background: `${TQ}99`, borderRadius: "8px" },
              }}
            >
              {visibles.map((sec, si) => (
                <Box key={sec.tituloKey} mb={{ base: 5, lg: 7 }} sx={entra(0.45 + Math.min(si, 4) * 0.12)}>
                  <Text color={TQ} fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em" mb={3}>
                    {t(sec.tituloKey)}
                  </Text>
                  <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={{ base: 2, md: 3 }}>
                    {sec.items.map((cert) => {
                      const idx = certificados.indexOf(cert);
                      const on = idx === sel;
                      return (
                        <Box
                          key={cert.name}
                          as="button"
                          type="button"
                          onClick={() => setSel(idx)}
                          aria-pressed={on}
                          aria-label={`${t(sec.tituloKey)} ${idx + 1}`}
                          borderRadius="md"
                          overflow="hidden"
                          border={`2px solid ${on ? TQ : "transparent"}`}
                          boxShadow={`0 0 10px ${ORO}33`}
                          opacity={on ? 1 : 0.85}
                          transition="all 0.25s ease"
                          _hover={{ opacity: 1, transform: "translateY(-2px)" }}
                          _focusVisible={focoBlanco}
                        >
                          <Image src={cert.img} alt="" w="100%" display="block" loading="lazy" />
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              ))}
            </Box>
            </>)}
          </Box>
        </Portal>
      )}
    </>
  );
};

export default Certificaciones;
