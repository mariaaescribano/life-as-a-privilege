import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, useBreakpointValue, type FlexProps } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Reveal } from "../../components/global/Reveal";
import { MetodoStepHeader, glowHeaderDisciplina } from "../../components/metodo/MetodoStepHeader";
import { BotonBarra } from "../../components/programas/BotonBarra";
import { disciplinaCursoBySlug } from "../../data/disciplinasCurso";
import {
  programaAnterior,
  programaPorSlug,
  programaSiguiente,
} from "../../hardCoded/programas/programas";
import { useT } from "../../i18n";

/**
 * UN PROGRAMA (/programas/:slug).
 *
 * Aquí solo se MIRA: la cabecera de siempre (número + título, y en medio los
 * saltos a anterior / todos los programas / siguiente) y debajo la diapositiva
 * a lo grande con sus dos flechas. Nada más: ni descripción repetida ni una
 * segunda fila de botones al fondo — todo eso ya está arriba.
 *
 * El podcast del mismo programa vive en /programas/:slug/podcast y se entra a
 * él desde el índice: se escucha con la pantalla apagada, y mezclarlo con el
 * pase de diapositivas obligaba a elegir.
 */
export default function ProgramaPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const t = useT();
  const programa = programaPorSlug(slug);
  const [i, setI] = useState(0);
  // En el móvil manda la diapositiva: la cabecera va con el título resumido
  // (tituloCorto) y los saltos de programa se quedan en la flecha sola, sin la
  // palabra. Todo lo que ahorre la cabecera es diapositiva más grande.
  const esMovil = useBreakpointValue({ base: true, md: false }) ?? false;
  // La proporción REAL de la diapositiva, medida de la primera foto que carga
  // (todas las de una presentación miden igual). 16:9 mientras no se sabe, que
  // es lo que exporta PowerPoint por defecto. Con ella el hueco de la foto se
  // ajusta clavado al PowerPoint: ni franjas a los lados ni el halo separado
  // del borde de la imagen.
  const [proporcion, setProporcion] = useState(16 / 9);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setI(0);
  }, [slug]);

  // Flechas del teclado para pasar diapositiva.
  useEffect(() => {
    const total = programa?.diapositivas.length ?? 0;
    if (total < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((n) => Math.min(n + 1, total - 1));
      if (e.key === "ArrowLeft") setI((n) => Math.max(n - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [programa]);

  if (!programa) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Flex flex={1} direction="column" align="center" justify="center" gap={6} px={5}>
          <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center">
            {t("programas.noExiste")}
          </Text>
          <BotonBarra texto={t("programas.volver")} icono="«" onClick={() => navigate("/programas")} />
        </Flex>
        <SiteFooter />
      </Box>
    );
  }

  const disciplina = disciplinaCursoBySlug(programa.disciplina);
  const Icono = disciplina?.Icon;
  const bg = disciplina?.bg ?? "#0d4f4f";
  const color = disciplina?.color ?? "#ffffff";
  const total = programa.diapositivas.length;
  const anterior = programaAnterior(programa);
  const siguiente = programaSiguiente(programa);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Flex
        flex={1}
        direction="column"
        align="center"
        px={{ base: 4, md: 10, lg: 16 }}
        pt={{ base: 5, md: 12 }}
        pb={{ base: 10, md: 24 }}
        gap={{ base: 5, md: 10 }}
      >
        {/* ── LA CABECERA DE SIEMPRE ──
            El número abre el título («1. El origen del universo»), a media
            tinta para que se lea como el índice que es. Y los tres saltos
            —anterior · todos los programas · siguiente— en su fila del medio.
            `multiline` porque aquí el título es una frase: antes que encogerla
            hasta lo diminuto, preferimos que baje de línea.
            Anterior y siguiente llevan su flecha en el propio texto («← / →»,
            como en el resto del recorrido) y se quedan apagados en los extremos
            de la disciplina en vez de desaparecer: así la fila no baila. */}
        <Reveal direction="down" distance={18} duration={0.7} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={Icono ? <Icono size={{ base: "38px", md: "52px" }} /> : null}
            title={
              <>
                <Box as="span" opacity={0.55}>{programa.numero}.</Box>{" "}
                {esMovil ? (programa.tituloCorto ?? programa.titulo) : programa.titulo}
              </>
            }
            multiline
            bgColor={`${bg}dd`}
            color={color}
            nom={disciplina?.nom}
            maxW="1000px"
            mb={0}
            prev={{
              // En el móvil, solo la flecha: «← Anterior» y «Siguiente →» se
              // comían la fila entera y hacían crecer la cabecera.
              label: esMovil ? "←" : `← ${t("programas.anterior")}`,
              disabled: !anterior,
              onClick: () => anterior && navigate(`/programas/${anterior.slug}`),
            }}
            extra={{
              label: t("programas.volver"),
              onClick: () => navigate("/programas"),
            }}
            next={{
              label: esMovil ? "→" : `${t("programas.siguiente")} →`,
              disabled: !siguiente,
              onClick: () => siguiente && navigate(`/programas/${siguiente.slug}`),
            }}
          />
        </Reveal>

        {/* ── LA DIAPOSITIVA ──
            Sin caja: la diapositiva se apoya directa sobre el turquesa, con sus
            dos flechas a los lados. El PowerPoint ya trae su propio fondo y su
            propio marco; meterlo dentro de un panel de la disciplina era un
            marco encima de otro. Por eso, además, todo lo que la rodea (flechas
            y cuenta) va en BLANCO: ya no está dentro de un box. */}
        <Reveal direction="up" distance={22} duration={0.7} w="100%" display="flex" justifyContent="center">
          <Box w="100%" maxW="1100px">
            {total === 0 ? (
              <Flex align="center" justify="center" minH={{ base: "180px", md: "260px" }} px={5}>
                <Text color="white" fontStyle="italic" textAlign="center">
                  {t("programas.sinDiapositivas")}
                </Text>
              </Flex>
            ) : (
              <>
                <Flex align="center" gap={{ base: 0, md: 5 }}>
                  {total > 1 && (
                    <Flecha
                      direccion="izq"
                      disabled={i === 0}
                      onClick={() => setI((n) => Math.max(n - 1, 0))}
                      // En el móvil las flechas van DEBAJO (la fila de más
                      // abajo): a los lados le robaban ~90px de ancho a la
                      // diapositiva, que es justo a lo que se viene.
                      display={{ base: "none", md: "flex" }}
                    />
                  )}
                  <Flex flex={1} minW={0} justify="center">
                    <Image
                      src={programa.diapositivas[i]}
                      alt={`${programa.titulo} — ${i + 1}`}
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (img.naturalWidth && img.naturalHeight) {
                          setProporcion(img.naturalWidth / img.naturalHeight);
                        }
                      }}
                      w="100%"
                      // El alto se limita por el ANCHO, no con `maxH`. Con
                      // `maxH` la caja se quedaba más baja que la foto y
                      // `objectFit: contain` metía franjas vacías a los lados:
                      // el halo se pintaba en el borde de la caja, lejos de la
                      // diapositiva. Aquí el tope de alto (76vh) se traduce a
                      // ancho multiplicándolo por la proporción, así la caja
                      // ES la diapositiva.
                      // MÓVIL: la diapositiva ocupa TODO el ancho, el mismo que
                      // la cabecera de arriba (ya no hay flechas a los lados
                      // quitándole sitio). El tope de alto solo entra en juego
                      // con diapositivas verticales.
                      maxW={{
                        base: `min(100%, calc(78vh * ${proporcion}))`,
                        md: `min(1100px, calc(76vh * ${proporcion}))`,
                      }}
                      sx={{ aspectRatio: String(proporcion) }}
                      objectFit="contain"
                      borderRadius="lg"
                      // El mismo halo que el header, para que las dos piezas de
                      // la página se lean como una sola.
                      boxShadow={glowHeaderDisciplina(color)}
                    />
                  </Flex>
                  {total > 1 && (
                    <Flecha
                      direccion="der"
                      disabled={i === total - 1}
                      onClick={() => setI((n) => Math.min(n + 1, total - 1))}
                      display={{ base: "none", md: "flex" }}
                    />
                  )}
                </Flex>

                {/* MÓVIL: las dos flechas debajo de la diapositiva, con la
                    cuenta en medio. Así la diapositiva se lleva el ancho entero
                    y pasar página queda donde está el pulgar. */}
                {total > 1 && (
                  <Flex
                    display={{ base: "flex", md: "none" }}
                    align="center"
                    justify="center"
                    gap={6}
                    pt={4}
                  >
                    <Flecha
                      direccion="izq"
                      disabled={i === 0}
                      onClick={() => setI((n) => Math.max(n - 1, 0))}
                    />
                    <Text color="white" fontSize="xs" opacity={0.8} letterSpacing="0.14em" whiteSpace="nowrap">
                      {t("programas.diapositiva", { n: i + 1, total })}
                    </Text>
                    <Flecha
                      direccion="der"
                      disabled={i === total - 1}
                      onClick={() => setI((n) => Math.min(n + 1, total - 1))}
                    />
                  </Flex>
                )}

                {/* Por dónde vas. Una línea fina, sin la fila de puntos: en un
                    programa de veinte diapositivas eran veinte bolitas. */}
                {total > 1 && (
                  <Text
                    display={{ base: "none", md: "block" }}
                    color="white"
                    fontSize="xs"
                    opacity={0.8}
                    letterSpacing="0.14em"
                    textAlign="center"
                    pt={5}
                  >
                    {t("programas.diapositiva", { n: i + 1, total })}
                  </Text>
                )}
              </>
            )}
          </Box>
        </Reveal>
      </Flex>

      <SiteFooter />
    </Box>
  );
}

/** Flecha de pasar diapositiva. Va sobre el turquesa de la página, así que en
 *  blanco: el color de la disciplina se queda para lo que va dentro de cajas. */
function Flecha({
  direccion, disabled, onClick, display,
}: {
  direccion: "izq" | "der";
  disabled: boolean;
  onClick: () => void;
  /** En qué anchuras se ve: a los lados en escritorio, debajo en móvil. */
  display?: FlexProps["display"];
}) {
  return (
    <Flex
      as="button"
      display={display}
      onClick={onClick}
      aria-label={direccion === "izq" ? "anterior" : "siguiente"}
      align="center"
      justify="center"
      // En móvil son el mando principal (van debajo de la diapositiva), así
      // que se hacen del tamaño de un dedo.
      w={{ base: "44px", md: "46px" }}
      h={{ base: "44px", md: "46px" }}
      flexShrink={0}
      borderRadius="full"
      border="1px solid rgba(255,255,255,0.75)"
      color="white"
      fontSize={{ base: "2xl", md: "2xl" }}
      lineHeight="1"
      opacity={disabled ? 0.25 : 1}
      cursor={disabled ? "default" : "pointer"}
      pointerEvents={disabled ? "none" : "auto"}
      transition="all 0.2s ease"
      _hover={{ bg: "rgba(255,255,255,0.14)" }}
    >
      {direccion === "izq" ? "‹" : "›"}
    </Flex>
  );
}
