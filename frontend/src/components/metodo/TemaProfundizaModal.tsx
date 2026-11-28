import React, { useEffect, useState } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { FotoBox } from "./FotoBox";
import { FichaExploraModal } from "./FichaExploraModal";
import { ComicTemaModal } from "./ComicTemaModal";
import { BotonCerrarDisciplina } from "./BotonCerrarDisciplina";
import { FisiologiaIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import type { Ficha, TemaProfundiza } from "../../hardCoded/espacio/ProfundizaFisiologia";
import { useT } from "../../i18n";

/**
 * Popup INMERSIVO de un tema de Profundiza (el cerebro, las hormonas…), con el contenido de verdad de la
 * plataforma: las mismas fichas (y el cómic «antes de empezar», si lo tiene) que la página del recorrido.
 * Fondo: la foto de Fisiología a pantalla completa, sin velos.
 *
 * Al pulsar una ficha se abre encima su explicación, con una flecha arriba a la izquierda que VUELVE al tema
 * sin cerrar nada; la X (y solo la X) cierra todo. Aquí no se guarda progreso: es la muestra pública.
 */
export function TemaProfundizaModal({ tema, onClose }: { tema: TemaProfundiza | null; onClose: () => void }) {
  const t = useT();
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [comicAbierto, setComicAbierto] = useState(false);
  const [comicDesde, setComicDesde] = useState(0);

  // Al cambiar de tema (o cerrar) se limpia lo que hubiera abierto dentro.
  useEffect(() => { setFicha(null); setComicAbierto(false); setComicDesde(0); }, [tema?.key]);

  // Bloquea el scroll de la página de fondo; se reafirma al cerrar una ficha o el cómic (restablecen el overflow).
  useEffect(() => {
    if (!tema) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [tema, ficha, comicAbierto]);

  // Escape cierra el popup solo si no hay una ficha ni el cómic encima (ellos gestionan el suyo).
  useEffect(() => {
    if (!tema) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && !ficha && !comicAbierto) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [tema, ficha, comicAbierto, onClose]);

  if (!tema) return null;

  const tieneComic = (tema.comicIntro?.length ?? 0) > 0;
  const comicEnRejilla = !!tema.comicEnRejilla && tieneComic;
  // Temas cuya rejilla SON las viñetas: cada una se pinta como una ficha de mentira y abre el cómic por ella.
  const fichasDelComic: Ficha[] = comicEnRejilla
    ? (tema.comicIntro ?? []).map((v, i) => ({ key: `vineta-${i + 1}`, nombre: v.titulo || `Viñeta ${i + 1}`, eyebrow: v.eyebrow, foto: v.src, explicacion: [] }))
    : [];
  const tieneFichas = tema.fichas.length > 0;

  let desde = 0;
  const zonas = (tema.zonas ?? [])
    .map((z) => ({ ...z, fichas: tema.fichas.filter((f) => f.zona === z.zona) }))
    .filter((z) => z.fichas.length > 0)
    .map((z) => { const inicio = desde; desde += z.fichas.length; return { ...z, inicio }; });

  const tarjetas = (lista: Ficha[], alPulsar: (f: Ficha, i: number) => void) => (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }} w="100%">
      {lista.map((f, i) => (
        <Reveal key={f.key} inView once amount={0.2} direction="up" distance={34} scaleFrom={0.95} duration={0.8} delay={0.06 + (i % 4) * 0.12} display="flex">
          <FotoBox
            vivo
            aspect={4 / 5}
            titulo={f.nombre}
            foto={f.foto}
            nom={fisiologiaNom}
            tinta={fisiologiaTxt}
            bg={fisiologiaBg}
            colorTint={`${f.color || tema.color}22`}
            glow={`0 0 22px ${fisiologiaBg}77, 0 0 50px ${fisiologiaBg}33`}
            onClick={() => alPulsar(f, i)}
          />
        </Reveal>
      ))}
    </SimpleGrid>
  );

  return (
    <Box position="fixed" inset={0} zIndex={1000} bg={fisiologiaBg} fontFamily="'EB Garamond', serif">
      {/* Fondo: la foto de Fisiología a pantalla completa, nítida y sin velos (el lila liso queda debajo mientras carga). */}
      <Box position="absolute" inset={0} zIndex={0} overflow="hidden" pointerEvents="none">
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="0" />
      </Box>
      <BotonCerrarDisciplina onClose={onClose} bg={fisiologiaBg} txt={fisiologiaTxt} zIndex={3} />

      <Box position="absolute" inset={0} zIndex={2} overflowY="auto" px={{ base: 5, md: 10, lg: 16 }} py={{ base: 14, md: 16 }}>
        <Flex direction="column" align="center" gap={{ base: 7, md: 9 }} w="100%" maxW="1180px" mx="auto">
          {/* Título: icono a la izquierda + nombre del tema */}
          <Flex direction="row" align="center" justify="center" gap={{ base: 3, md: 4 }}>
            <FisiologiaIcon size={{ base: "40px", md: "54px" }} />
            <Text color={fisiologiaTxt} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="0.08em" lineHeight="1.1" textAlign="center">
              {tema.label}
            </Text>
          </Flex>

          {tema.intro && (
            <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center" lineHeight="1.8" maxW="720px">
              {tema.intro}
            </Text>
          )}

          {/* Cómic «antes de empezar» (no sale en los temas cuya rejilla ya son las viñetas). */}
          {tieneComic && !comicEnRejilla && (
            <Box
              as="button"
              type="button"
              onClick={() => { setComicDesde(0); setComicAbierto(true); }}
              role="group"
              position="relative"
              overflow="hidden"
              display="inline-flex"
              alignItems="center"
              gap={2.5}
              px={{ base: 5, md: 7 }}
              py={{ base: 2.5, md: 3 }}
              borderRadius="full"
              color={fisiologiaTxt}
              fontWeight="700"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.03em"
              cursor="pointer"
              boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
              transition="transform 0.25s ease, box-shadow 0.25s ease"
              _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88, 0 0 58px ${fisiologiaTxt}44` }}
              _focusVisible={{ boxShadow: `0 0 0 2px ${fisiologiaTxt}` }}
            >
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="full" overlay={`${fisiologiaBg}bb`} />
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" position="relative" zIndex={1} w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor">
                <path d="M320-200v-560l440 280-440 280Z" />
              </Box>
              <Box as="span" position="relative" zIndex={1} style={{ textShadow: `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc` }}>
                Antes de empezar: mira cómo funcionan
              </Box>
            </Box>
          )}

          {comicEnRejilla ? (
            tarjetas(fichasDelComic, (_f, i) => { setComicDesde(i); setComicAbierto(true); })
          ) : tieneFichas ? (
            zonas.length === 0
              ? tarjetas(tema.fichas, (f) => setFicha(f))
              : zonas.map((z) => (
                  <Flex key={z.zona} direction="column" w="100%" gap={{ base: 3, md: 4 }} mt={z.inicio > 0 ? { base: 4, md: 6 } : 0}>
                    <Flex direction="column" align="center" gap={1.5} w="100%">
                      <Flex align="center" gap={{ base: 3, md: 4 }} w="100%">
                        <Box flex="1" h="1px" bg={`${fisiologiaTxt}44`} />
                        <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "md", md: "xl" }} letterSpacing="0.14em" textTransform="uppercase" whiteSpace="nowrap">
                          {z.titulo}
                        </Text>
                        <Box flex="1" h="1px" bg={`${fisiologiaTxt}44`} />
                      </Flex>
                      <Text color={fisiologiaTxt} opacity={0.85} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center" lineHeight="1.7" maxW="600px">
                        {z.entradilla}
                      </Text>
                    </Flex>
                    {tarjetas(z.fichas, (f) => setFicha(f))}
                  </Flex>
                ))
          ) : (
            <Flex direction="column" align="center" gap={3} maxW="520px" textAlign="center" position="relative" w="100%" borderRadius="2xl" overflow="hidden" px={{ base: 6, md: 10 }} py={{ base: 10, md: 12 }}>
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" overlay={`${fisiologiaBg}88`} />
              <Text position="relative" zIndex={1} color={fisiologiaTxt} fontWeight={700} fontSize={{ base: "lg", md: "xl" }}>
                {t("fisiologia.tema.construyendo")}
              </Text>
              <Text position="relative" zIndex={1} color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.7">
                {t("fisiologia.tema.construyendoPie")}
              </Text>
            </Flex>
          )}

          {tema.cierre && (
            <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "xl" }} fontStyle="italic" textAlign="center" lineHeight="1.9" maxW="640px" mt={{ base: 2, md: 4 }}>
              {tema.cierre}
            </Text>
          )}
        </Flex>
      </Box>

      {/* La ficha, encima: la flecha vuelve al tema; la X cierra todo. */}
      <FichaExploraModal
        ficha={ficha}
        fichas={tema.fichas}
        temaColor={tema.color}
        onSelect={setFicha}
        onVolver={() => setFicha(null)}
        onClose={() => { setFicha(null); onClose(); }}
      />

      {tieneComic && (
        <ComicTemaModal
          isOpen={comicAbierto}
          vinetas={tema.comicIntro!}
          initialIndex={comicEnRejilla ? comicDesde : 0}
          onClose={() => setComicAbierto(false)}
        />
      )}
    </Box>
  );
}

export default TemaProfundizaModal;
