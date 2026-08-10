import React, { useLayoutEffect, useRef } from "react";
import { Box, Flex, Text, type FlexProps } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { type VideoIntro } from "../../data/recorridoContenido";
import { useT } from "../../i18n";
import { useNombreDisciplinaEnMapa } from "../../i18n/nombreDisciplina";
import { PrecioConAntes } from "./PrecioConAntes";

// ─────────────────────────────────────────────────────────────────────────────
// BOX DE LA DISCIPLINA con su precio — el que va al lado del mandala en
// /elMetodo y, ahora también, arriba en la presentación de la disciplina
// (/d/:disciplina) junto al vídeo.
//
// Fondo = imagen propia de la disciplina. Cabecera «nº. Nombre» + separador y,
// debajo, el texto introductorio (título + puntos con ✓), el botón de muestra y
// el precio abajo a la derecha.
//
// Vive aquí (y no dentro de MandalaRecorrido) porque lo usan DOS páginas y tiene
// que verse EXACTAMENTE igual en las dos: es el box donde se decide la compra.
// ─────────────────────────────────────────────────────────────────────────────

/** Tope del cuerpo de letra (px) del bloque de texto cuando se autoajusta.
 *  Los puntos van a este tamaño y el título a 1,5 veces. Subirlo hace el box más
 *  aparatoso, no más lleno: el hueco que sobra se rellena con aire entre líneas. */
const MAX_LETRA = 20;

/** Envoltura del bloque de texto. Con `activa` (las presentaciones) es la zona
 *  MEDIDA: ocupa el hueco libre del box y recorta lo que sobre, para que el
 *  ajuste de tamaño tenga un alto contra el que medir. Sin ella, el texto se
 *  pinta tal cual (el box de /elMetodo crece con su contenido). */
function ZonaTexto({
  activa,
  zonaRef,
  children,
}: {
  activa: boolean;
  zonaRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  if (!activa) return <>{children}</>;
  return (
    <Box ref={zonaRef} flex="1" minH={0} overflow="hidden" display="flex" flexDirection="column">
      {children}
    </Box>
  );
}

export function DisciplinaVideoBox({
  nom,
  bg,
  txt,
  videoIntro,
  paso,
  renderIcon,
  tieneVideo,
  onVerVideo,
  sinBoton = false,
  sinPrecio = false,
  textoGrande = false,
  onSaberMas,
  ...rest
}: {
  nom: string;
  bg: string;
  txt: string;
  videoIntro: VideoIntro;
  /** Número de paso en el Mapa (1..8). Se pinta antes del nombre. */
  paso: number;
  renderIcon: (size: string) => React.ReactNode;
  /** Si no hay vídeo, en lugar del botón sale «Vídeo próximamente». */
  tieneVideo: boolean;
  onVerVideo: () => void;
  /** Sin el botón de muestra: en /d/:disciplina el vídeo ya está al lado, así que
   *  la fila de cierre se queda solo con el precio. */
  sinBoton?: boolean;
  /** Sin el precio: en el mandala de /elMetodo el visitante todavía no sabe qué
   *  es cada disciplina, y un precio ahí le pone a evaluar antes de tener con
   *  qué comparar. En su hueco va el «Saber más» grande, que es el único paso
   *  que queremos que dé desde el mandala. El precio se ve luego, en el bloque
   *  de compra y dentro de la presentación de la disciplina. */
  sinPrecio?: boolean;
  /** Letra más grande en ordenador, para que el texto llene el box cuando va a
   *  media página (en el mandala de /elMetodo el box es estrecho y no toca). */
  textoGrande?: boolean;
  /** Si se pasa, sale un «Saber más ›» discreto arriba a la derecha del box, que
   *  lleva a la presentación de la disciplina (/d/:disciplina). No se pone en la
   *  propia presentación: allí ya estás dentro. */
  onSaberMas?: () => void;
  // Solo lo que necesitan los dos sitios donde se usa. Aceptar FlexProps entero
  // hace explotar el chequeo de tipos («union type too complex»).
} & Pick<FlexProps, "h" | "minH" | "flex">) {
  const t = useT();
  const nombreEnMapa = useNombreDisciplinaEnMapa();
  const accent = txt;
  const hasBg = hasDisciplinaBg(nom);
  const textGlow = `0 1px 3px ${bg}, 0 0 10px ${bg}, 0 0 20px ${bg}`;

  // ── LA LETRA LLENA EL BOX (solo en `textoGrande`) ──────────────────────
  // Regla: el BOX no cambia de tamaño — es cuadrado, lo fija la rejilla de la
  // presentación — y es la LETRA la que se estira hasta llenarlo. Nunca al
  // revés. Cada disciplina escribe frases de largo distinto, así que con un
  // tamaño fijo a unas les sobraba medio box y a otras no les cabía.
  //
  // El bloque (título + puntos) se pinta en `em` sobre un tamaño base que se
  // mide aquí: se busca el mayor que quepa ENTERO en el hueco. Medición
  // imperativa (se escribe `style.fontSize` directamente), sin estado, así que
  // no hay re-render por píxel ni bucle de «mido → cambio → vuelvo a medir».
  //
  // PERO la letra tiene un TOPE (`MAX_LETRA`). El box es medio ancho de página y
  // cuadrado: llenarlo solo a base de agrandar la letra la dejaba de tamaño
  // cartel. Al llegar al tope, el hueco que sobra se reparte como AIRE entre las
  // líneas (variable `--aire`) y la zona se centra: el box sigue lleno de arriba
  // abajo, pero con un cuerpo de letra que se lee, no que se grita.
  const zonaRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const zona = zonaRef.current;
    if (!textoGrande || !zona) return;
    const bloque = zona.firstElementChild as HTMLElement | null;
    if (!bloque) return;

    // Última geometría con la que se ajustó. La escribe el propio `ajustar` al
    // terminar, así un cambio de tamaño provocado por NOSOTROS (cambiar la
    // letra mueve el contenido) no se confunde con uno de fuera y no hay bucle.
    let anchoPrev = 0;
    let altoPrev = 0;

    const setAire = (px: number) => zona.style.setProperty("--aire", `${px}px`);

    const ajustar = () => {
      const ancho = window.innerWidth;

      // Por debajo de `lg` las dos columnas se apilan y el box crece con su
      // contenido: NO hay hueco fijo contra el que medir (`clientHeight` iría
      // siempre detrás del texto y la búsqueda se dispararía al techo). Ahí,
      // tamaño fijo y sensato, sin autoajuste.
      if (ancho < 992) {
        setAire(0);
        zona.style.justifyContent = "flex-start";
        zona.style.fontSize = ancho >= 768 ? "17px" : "15px";
        const r0 = zona.getBoundingClientRect();
        anchoPrev = r0.width;
        altoPrev = r0.height;
        return;
      }

      // TOPE del cuerpo de letra: llenar el box NO es motivo para agrandarla sin
      // freno (el box mide media página y es cuadrado, así que el hueco es
      // enorme). Lo que sobre se reparte más abajo como aire entre líneas. El
      // suelo es el punto por debajo del cual preferimos que quede justo antes
      // que ilegible.
      const max = MAX_LETRA;
      const min = 13;
      // HOLGURA: el texto no llena el hueco a ras, se le deja un 12 % de aire.
      // Sin esto la letra crecía hasta tocar los bordes y el box quedaba
      // apelmazado —correcto de medidas, pero sin respirar—.
      const hueco = zona.clientHeight * 0.88;
      // Se mide SIN aire: el aire es un premio de después, y si contara aquí la
      // búsqueda mediría contra un bloque ya hinchado por la pasada anterior.
      setAire(0);
      // Búsqueda binaria del mayor tamaño que cabe: 9 medidas en vez de las
      // ~100 que costaba bajar de medio en medio píxel desde el techo.
      let lo = min;
      let hi = max;
      let mejor = min;
      for (let i = 0; i < 9; i++) {
        const m = (lo + hi) / 2;
        zona.style.fontSize = `${m}px`;
        if (bloque.scrollHeight <= hueco + 1) { mejor = m; lo = m; }
        else { hi = m; }
      }
      zona.style.fontSize = `${mejor}px`;

      // El texto ya está al tope y todavía sobra hueco: se reparte entre los
      // huecos del bloque (título↔puntos y punto↔punto). Con su propio tope, que
      // si no las líneas quedan desperdigadas; lo que aún sobre lo absorbe el
      // centrado vertical, así el aire queda arriba Y abajo, no todo al final.
      const huecos = Math.max(1, zona.querySelectorAll("[data-punto]").length);
      const sobra = hueco - bloque.scrollHeight;
      setAire(sobra > 0 ? Math.min(sobra / huecos, mejor * 1.6) : 0);
      zona.style.justifyContent = sobra > 0 ? "center" : "flex-start";

      const r = zona.getBoundingClientRect();
      anchoPrev = r.width;
      altoPrev = r.height;
    };

    const raf = requestAnimationFrame(ajustar);
    // Segunda pasada: en el primer frame el vídeo de al lado puede no haber
    // fijado todavía el alto del box, así que el hueco no es el definitivo.
    const tardia = window.setTimeout(ajustar, 300);
    // Se remide con CUALQUIER cambio de tamaño de la zona, ancho Y ALTO.
    // Mirar solo el ancho era el fallo: el alto de este box lo impone el vídeo
    // cuadrado de al lado, y cuando el vídeo carga y lo fija —casi siempre
    // después de los 300 ms de la pasada tardía— el hueco cambiaba y el texto
    // no se volvía a ajustar. Como la zona recorta (`overflow: hidden`), el
    // último punto se quedaba cortado a media frase.
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      if (Math.abs(r.width - anchoPrev) < 1 && Math.abs(r.height - altoPrev) < 1) return;
      ajustar();
    });
    ro.observe(zona);
    // EB Garamond suele cargar DESPUÉS del primer pintado y el texto cambia de
    // alto: se mide otra vez cuando la tipografía está lista.
    document.fonts?.ready.then(ajustar).catch(() => {});
    return () => { cancelAnimationFrame(raf); window.clearTimeout(tardia); ro.disconnect(); };
  }, [textoGrande, videoIntro]);

  // Tamaños del bloque de texto. Con `textoGrande` van en `em` (los manda el
  // ajuste de arriba); sin él, tokens fijos.
  // Los de /elMetodo subieron un paso: cada disciplina cuenta ahora TRES puntos
  // en lugar de cuatro, y con el tamaño anterior el box se quedaba con letra
  // pequeña y medio vacío. Si algún día vuelven a ser cuatro, hay que bajarlos.
  const fsTitulo = textoGrande ? "1.5em" : { base: "xl", md: "2xl" };
  const fsTick = textoGrande ? "1.15em" : { base: "lg", md: "xl" };
  const fsPunto = textoGrande ? "1em" : { base: "md", md: "lg" };

  return (
    <Flex
      direction="column"
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      bg={bg}
      boxShadow={`0 10px 34px rgba(0,0,0,0.32), 0 0 26px ${accent}44`}
      {...rest}
    >
      {/* Fondo del box: imagen propia de la disciplina */}
      <DisciplinaBgLayer nom={nom} borderRadius="2xl" />

      {/* Cabecera: nº + icono + nombre */}
      <Flex align="center" gap={3} px={{ base: 5, md: 6 }} pt={{ base: 4, md: 5 }} pb={{ base: 3, md: 3 }} position="relative" zIndex={1}>
        <Box
          position="relative"
          w={{ base: "40px", md: "46px" }}
          h={{ base: "40px", md: "46px" }}
          borderRadius="full"
          overflow="hidden"
          flexShrink={0}
          bg={hasBg ? "transparent" : bg}
          border={`2px solid ${accent}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {hasBg && <DisciplinaBgLayer nom={nom} borderRadius="full" />}
          <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
            {renderIcon("28px")}
          </Box>
        </Box>
        <Flex align="baseline" gap={2} minW={0} overflow="hidden">
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xl", md: "2xl" }}
            lineHeight="1.1"
            opacity={0.9}
            textShadow={textGlow}
          >
            {paso}.
          </Text>
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xl", md: "2xl" }}
            lineHeight="1.35"
            letterSpacing="0.02em"
            pb="0.12em"
            whiteSpace="nowrap"
            textShadow={textGlow}
          >
            {nombreEnMapa(nom)}
          </Text>
        </Flex>

        {/* «Saber más ›» — arriba a la derecha. Discreto a propósito: no compite
            con el precio, que es lo que decide abajo.
            Solo cuando HAY precio: sin él, el «Saber más» vive abajo y en
            grande, y tenerlo dos veces en el mismo box parte la mirada. */}
        {onSaberMas && !sinPrecio && (
          <Flex
            as="button"
            onClick={onSaberMas}
            ml="auto"
            flexShrink={0}
            align="center"
            gap={1.5}
            px={{ base: 2.5, md: 3.5 }}
            py={{ base: 1, md: 1.5 }}
            borderRadius="full"
            border={`1px solid ${accent}66`}
            color={accent}
            cursor="pointer"
            sx={{
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.2s ease",
              _hover: { bg: `${accent}22`, borderColor: accent, transform: "translateY(-1px)" },
              _active: { transform: "translateY(0)" },
            }}
          >
            <Text
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "2xs", md: "sm" }}
              fontStyle="italic"
              letterSpacing="0.06em"
              whiteSpace="nowrap"
              textShadow={textGlow}
            >
              {t("elMetodo.saberMas")}
            </Text>
            <Box
              as="svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              w={{ base: "12px", md: "14px" }}
              h={{ base: "12px", md: "14px" }}
              fill="currentColor"
              flexShrink={0}
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Flex>
        )}
      </Flex>

      {/* Separador horizontal */}
      <Box
        mx={{ base: 5, md: 6 }}
        h="1px"
        position="relative"
        zIndex={1}
        bg={`linear-gradient(to right, transparent, ${accent}bb, transparent)`}
      />

      {/* Texto introductorio (título + puntos con ✓) + botón al final */}
      <Flex
        direction="column"
        position="relative"
        zIndex={1}
        // Márgenes generosos: el texto de este box se estira hasta el hueco que
        // le dejan, así que el aire tiene que venir de aquí. Con menos, la
        // letra llegaba a los filos.
        px={{ base: 6, md: 10 }}
        pt={{ base: 5, md: 7 }}
        pb={{ base: 5, md: 7 }}
        gap={{ base: 4, md: 5 }}
        flex="1"
        // `minH={0}` NO se puede quitar. Un item flex tiene `min-height: auto`,
        // que le impide encogerse por debajo de su contenido: sin esto, esta
        // columna crecía con el texto en vez de quedarse en el alto del box, y
        // entonces la ZONA de medida de abajo tampoco tenía un tope real —
        // medía 3038px dentro de un box de 574—. El autoajuste preguntaba
        // «¿cabe?», le decían que sí siempre, y la letra se iba al techo y
        // salía recortada. Es el hermano del `min-width: auto` que rompía las
        // columnas de la rejilla en las presentaciones.
        minH={0}
      >
        {/* Título + puntos. En `textoGrande` van dentro de la ZONA que se mide
            (ver el useLayoutEffect de arriba): ocupa todo el hueco que deja el
            precio y el texto se pinta lo más grande que quepa entero. */}
        <ZonaTexto activa={textoGrande} zonaRef={zonaRef}>
          {/* `--aire` lo pone el ajuste de arriba: es el hueco que sobra cuando
              la letra ya está en su tope, repartido entre las líneas. */}
          <Flex
            direction="column"
            gap={textoGrande ? "calc(0.75em + var(--aire, 0px))" : { base: 4, md: 5 }}
          >
            {/* Título (puede ser una frase larga que introduce el recorrido) */}
            <Text
              color={accent}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={fsTitulo}
              lineHeight="1.3"
              letterSpacing="0.01em"
              textShadow={textGlow}
            >
              {videoIntro.titulo}
            </Text>

            {/* Puntos con ✓ */}
            <Flex
              direction="column"
              gap={textoGrande ? "calc(0.6em + var(--aire, 0px))" : { base: 2.5, md: 3 }}
            >
              {videoIntro.puntos.map((p, i) => (
                // data-punto: el ajuste los cuenta para saber entre cuántos
                // huecos reparte el aire.
                <Flex key={i} data-punto align="flex-start" gap={textoGrande ? "0.55em" : { base: 2.5, md: 3 }}>
                  <Text
                    color={accent}
                    fontWeight="700"
                    fontSize={fsTick}
                    lineHeight="1.4"
                    flexShrink={0}
                    textShadow={textGlow}
                  >
                    ✓
                  </Text>
                  <Text
                    color={accent}
                    fontFamily="'EB Garamond', serif"
                    fontSize={fsPunto}
                    lineHeight="1.4"
                    textShadow={textGlow}
                  >
                    {p}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </ZonaTexto>

        {/* Fila de cierre: a la izquierda el botón (ver una muestra de la
            plataforma); abajo a la derecha, el precio de la disciplina. Así el
            «cuánto cuesta» sale justo donde se decide, sin un box de precio
            aparte. `mt="auto"` la empuja al fondo cuando el box tiene un alto
            impuesto por el vídeo de al lado (en /d/:disciplina). */}
        <Flex
          mt="auto"
          pt={{ base: 1, md: 2 }}
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "flex-end" }}
          justify={sinBoton ? "flex-end" : "space-between"}
          gap={{ base: 4, md: 5 }}
          w="100%"
        >
          {sinBoton ? null : tieneVideo ? (
            <Flex
              as="button"
              onClick={onVerVideo}
              align="center"
              justify="center"
              gap={2.5}
              alignSelf={{ base: "stretch", md: "flex-end" }}
              px={{ base: 5, md: 6 }}
              py={{ base: "10px", md: "11px" }}
              borderRadius="full"
              border={`1.5px solid ${accent}aa`}
              bg={`${accent}1f`}
              color={accent}
              cursor="pointer"
              boxShadow={`0 0 14px ${accent}33, 0 2px 12px rgba(0,0,0,0.25)`}
              sx={{ WebkitTapHighlightColor: "transparent", userSelect: "none", backdropFilter: "blur(4px)" }}
              _hover={{ bg: `${accent}33`, borderColor: accent, boxShadow: `0 0 22px ${accent}55, 0 4px 16px rgba(0,0,0,0.3)`, transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0) scale(0.98)" }}
              transition="all 0.2s ease"
            >
              <Box as="span" fontSize={{ base: "sm", md: "md" }} lineHeight="1" style={{ textShadow: textGlow }}>▶</Box>
              <Text
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.03em"
                textShadow={textGlow}
              >
                {videoIntro.boton ?? t("elMetodo.muestra")}
              </Text>
            </Flex>
          ) : (
            <Text
              color={accent}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.12em"
              textTransform="uppercase"
              opacity={0.8}
              alignSelf={{ base: "center", md: "flex-end" }}
              textShadow={textGlow}
            >
              {t("elMetodo.videoProximamente")}
            </Text>
          )}

          {/* En el hueco del precio: o el precio, o el «Saber más» GRANDE.
              En el mandala de /elMetodo va el botón — es el sitio donde la
              mirada ya se para (esquina de cierre del box), así que es el que
              tiene que llevarse la llamada, no un importe. */}
          {sinPrecio ? (
            onSaberMas && (
              <Flex
                as="button"
                onClick={onSaberMas}
                align="center"
                justify="center"
                gap={2.5}
                alignSelf={{ base: "stretch", md: "flex-end" }}
                flexShrink={0}
                px={{ base: 6, md: 8 }}
                py={{ base: "12px", md: "14px" }}
                borderRadius="full"
                // Relleno y borde más marcados que el de «Muestra»: de los dos
                // botones de la fila, este es el que queremos que se pulse.
                border={`1.5px solid ${accent}`}
                bg={`${accent}33`}
                color={accent}
                cursor="pointer"
                boxShadow={`0 0 20px ${accent}44, 0 3px 14px rgba(0,0,0,0.28)`}
                sx={{ WebkitTapHighlightColor: "transparent", userSelect: "none", backdropFilter: "blur(4px)" }}
                _hover={{ bg: `${accent}4d`, boxShadow: `0 0 30px ${accent}66, 0 5px 18px rgba(0,0,0,0.32)`, transform: "translateY(-2px)" }}
                _active={{ transform: "translateY(0) scale(0.98)" }}
                transition="all 0.2s ease"
              >
                <Text
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "xl" }}
                  letterSpacing="0.04em"
                  whiteSpace="nowrap"
                  textShadow={textGlow}
                >
                  {t("elMetodo.saberMas")}
                </Text>
                <Box
                  as="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  w={{ base: "16px", md: "20px" }}
                  h={{ base: "16px", md: "20px" }}
                  fill="currentColor"
                  flexShrink={0}
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </Box>
              </Flex>
            )
          ) : (
            /* Precio de la disciplina (sale de pagoDisciplinaLink, el mismo sitio
               del que bebe el box de pago: web y cobro no se desincronizan). */
            <Flex direction="column" align={{ base: "center", md: "flex-end" }} gap={0.5} flexShrink={0}>
              <Flex align="baseline" gap={2}>
                <PrecioConAntes
                  color={accent}
                  sombra={textGlow}
                  tamano={{ base: "3xl", md: "4xl" }}
                  tamanoAntes={{ base: "md", md: "lg" }}
                />
                <Text
                  color={accent}
                  fontFamily="'EB Garamond', serif"
                  fontStyle="italic"
                  fontSize={{ base: "sm", md: "md" }}
                  opacity={0.9}
                  textShadow={textGlow}
                >
                  por disciplina
                </Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
