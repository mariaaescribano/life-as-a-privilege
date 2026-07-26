import React, { useLayoutEffect, useRef, useState } from "react";
import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { astrologiaNom, cabalaNom, culturaNom, fisiologiaNom, neuropsicologiaNom, nutricionNom, tcmNom } from "../../GlobalVariables";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { CursosPsicologiaModal } from "./CursosPsicologiaModal";

interface StepButton {
  label: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  /** Texto que aparece al pasar el ratón cuando está deshabilitado. */
  disabledTooltip?: string;
  /** Botón más compacto (menos padding y letra), p.ej. «Volver al curso». */
  small?: boolean;
  /** Pinta una flecha SVG de verdad (no el carácter «→/←»): a la derecha del
   *  texto si es «next», a la izquierda si es «prev». Usa la etiqueta sin flecha. */
  arrow?: "prev" | "next";
  /** Color propio de texto/borde del botón (sobreescribe el color del header).
   *  Útil para un botón que lleva a otra disciplina y quiere lucir su color. */
  btnColor?: string;
  /** Fondo sólido propio del botón (p.ej. el bg de la disciplina de destino). */
  btnBg?: string;
}

/** Flecha SVG (chevron) para los botones prev/next del header. */
const ArrowIcon = ({ dir }: { dir: "prev" | "next" }) => (
  <Box
    as="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    w={{ base: "15px", md: "17px" }}
    h={{ base: "15px", md: "17px" }}
    fill="currentColor"
    flexShrink={0}
    style={{ transform: dir === "prev" ? "scaleX(-1)" : undefined }}
  >
    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
  </Box>
);

interface MetodoStepHeaderProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  bgColor: string;     // color sólido del círculo del icono (y fondo si no hay disciplinaBg)
  color: string;       // color del título, botones, borde, glow
  maxW?: string;
  mb?: any;
  /** Nombre de la disciplina (Astrología, Hinduismo, Medicina China...).
   *  Si tiene fondo propio definido en DisciplinaBgLayer, se usa para el box
   *  cuadrado y el círculo del icono. Sustituye al antiguo prop `space`. */
  nom?: string;
  /** Legacy: equivalente a nom={astrologiaNom}. Mantener para no romper páginas. */
  space?: boolean;
  prev?: StepButton;
  next?: StepButton;
  extra?: StepButton;  // botón opcional adicional (ej: "Cómic")
  /** Título más pequeño (p.ej. en los tests, cuyos nombres son largos y deben
   *  caber en el header). */
  compact?: boolean;
  /** Indicador de progreso: paso actual / total. Pinta una fila de puntos. */
  step?: { current: number; total: number };
  /** Etiqueta libre de número de página junto al título (p.ej. "2/"). */
  pageLabel?: string;
  /** Título un poco más grande y con más alto de línea (~15-20px extra),
   *  p.ej. en la página de lección. No afecta a las páginas que no lo pasen. */
  tallTitle?: boolean;
  /** Oculta el botón "Cursos" que Psicología añade por defecto. Útil en páginas
   *  donde ya se está dentro de un curso (lección, módulos). */
  hideCursos?: boolean;
  /** El título va SIEMPRE en una sola línea: si a su tamaño natural no cabe,
   *  se encoge (paso a paso) hasta que quepa. Nunca salta a dos líneas ni se
   *  trunca. Ignora el modo `tituloUniforme` de las disciplinas (que sí
   *  permite dos líneas). Usado en la página de lección (/aprendizaje/leccion). */
  fitTitle?: boolean;
  /** Sombra/glow del box completo. Si se pasa, sustituye al glow por defecto
   *  (útil para darle un brillo propio a una página, p.ej. dorado). */
  boxShadow?: string;
}

const StepBtn = ({ label, color, onClick, disabled, icon, disabledTooltip, whiteBg, small, arrow, btnColor, btnBg }: StepButton & { color: string; bgColor: string; whiteBg?: boolean }) => {
  // Colores efectivos: si el botón trae los suyos (p.ej. lleva a otra disciplina),
  // mandan sobre los del header. `c` = texto/borde; `fillBg` = fondo.
  const c = btnColor ?? color;
  // Interior del botón teñido con el color de la disciplina (no blanco neutro):
  // sobre fondos cálidos (Cábala, TCM…) un velo blanco se percibe azulado por
  // contraste. TCM mantiene su blanco a propósito (whiteBg).
  const baseBg = btnBg ?? (whiteBg ? "rgba(255,255,255,0.14)" : `${c}1a`);
  const hoverBg = btnBg ?? (whiteBg ? "rgba(255,255,255,0.12)" : `${c}2b`);
  const activeBg = btnBg ?? (whiteBg ? "rgba(255,255,255,0.18)" : `${c}38`);
  const btn = (
    <Box
      as="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      px={small ? { base: 2, md: 3.5 } : { base: 3, sm: 5, md: 8 }}
      py={small ? { base: 1, md: 1.5 } : { base: 2, md: 3 }}
      borderRadius="full"
      bg={disabled ? (whiteBg ? "rgba(255,255,255,0.14)" : `${c}12`) : baseBg}
      border={`1.5px solid ${disabled ? c + "22" : `${c}aa`}`}
      color={disabled ? `${c}44` : c}
      fontFamily="'EB Garamond', serif"
      fontSize={small ? { base: "2xs", md: "xs" } : { base: "sm", sm: "md", md: "md" }}
      letterSpacing={{ base: "0.02em", md: "0.05em" }}
      fontStyle="italic"
      cursor={disabled ? "not-allowed" : "pointer"}
      // transition mucho más rápida (80ms) para que el feedback visual sea
      // casi instantáneo al pulsar. background/border/box-shadow son las
      // propiedades que pintan el "pressed".
      transition="background 0.08s ease, border-color 0.08s ease, box-shadow 0.08s ease, color 0.08s ease, transform 0.08s ease"
      boxShadow={disabled ? "none" : `0 0 10px rgba(255,255,255,0.16), 0 0 22px ${c}44, inset 0 0 12px ${c}22`}
      // En el header de TCM (whiteBg) el texto lleva una sombra granate oscura
      // para contrastar con el fondo de la disciplina.
      textShadow={whiteBg && !disabled ? "0 1px 4px rgba(58,10,10,0.95), 0 2px 10px rgba(58,10,10,0.85), 0 0 5px rgba(58,10,10,0.8)" : undefined}
      // touch-action: manipulation elimina el delay de 300ms del navegador
      // móvil (que estaba esperando un posible double-tap zoom). user-select
      // none + WebkitTapHighlightColor transparente quitan el rectángulo gris
      // de highlight de iOS/Android que da sensación de "delay".
      sx={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
      _hover={disabled ? undefined : {
        bg: hoverBg,
        borderColor: `${c}cc`,
        boxShadow: `0 0 14px rgba(255,255,255,0.35), 0 0 30px ${c}33, 0 0 30px ${c}44`,
      }}
      // _active: feedback inmediato al pulsar (móvil y desktop).
      _active={disabled ? undefined : {
        bg: activeBg,
        borderColor: c,
        transform: "scale(0.96)",
        boxShadow: `0 0 22px rgba(255,255,255,0.5), 0 0 42px ${c}66`,
      }}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      display="inline-flex"
      alignItems="center"
      gap={{ base: 1, md: 2 }}
      minW={0}
      flex="0 1 auto"
    >
      {arrow === "prev" && <ArrowIcon dir="prev" />}
      {icon}
      {label}
      {arrow === "next" && <ArrowIcon dir="next" />}
    </Box>
  );

  if (disabled && disabledTooltip) {
    return (
      <Tooltip
        label={disabledTooltip}
        placement="top"
        hasArrow
        bg="rgba(8,13,30,0.95)"
        color="white"
        fontFamily="'EB Garamond', serif"
        fontSize="sm"
        fontStyle="italic"
        px={3}
        py={2}
        borderRadius="md"
        border={`1px solid ${color}55`}
        boxShadow={`0 0 14px ${color}55, 0 6px 20px rgba(0,0,0,0.5)`}
        sx={{ "--popper-arrow-bg": "rgba(8,13,30,0.95)" }}
        openDelay={120}
      >
        {/* span necesario porque Tooltip no funciona en elementos disabled */}
        <Box as="span" display="inline-flex" tabIndex={0}>
          {btn}
        </Box>
      </Tooltip>
    );
  }

  return btn;
};

export function MetodoStepHeader({
  icon,
  title,
  bgColor,
  color,
  maxW = "850px",
  mb = { base: 10, md: 12 },
  nom,
  space = false,
  prev,
  next,
  extra,
  compact = false,
  step,
  pageLabel,
  boxShadow,
  tallTitle = false,
  hideCursos = false,
  fitTitle = false,
}: MetodoStepHeaderProps) {
  // Si pasas `nom` y esa disciplina tiene fondo propio, lo usamos. El antiguo
  // prop `space` se mantiene como alias para Astrología.
  const headerNom = nom ?? (space ? astrologiaNom : undefined);
  const useDiscBg = !!headerNom && hasDisciplinaBg(headerNom);
  // En el header de Medicina China los botones llevan un fondo blanco mínimo
  // (casi transparente) para que el texto se lea sobre su fondo.
  const btnWhiteBg = headerNom === tcmNom;
  // En TCM queremos que TODOS los títulos del recorrido salgan igual de grandes:
  // desactivamos el auto-encogido (que hacía más pequeños los títulos largos como
  // «Los Cinco Elementos») y, si no cabe en una línea, dejamos que envuelva.
  const tituloUniforme = headerNom === tcmNom || headerNom === fisiologiaNom || headerNom === nutricionNom || headerNom === cabalaNom || headerNom === culturaNom;
  // En todo el recorrido de Psicología, el header lleva un botón "Cursos" que
  // abre la pantalla completa con los cursos orientativos de la disciplina.
  const isPsico = headerNom === neuropsicologiaNom;
  // El botón "Cursos" de Psicología puede ocultarse en páginas concretas.
  const showPsicoCursos = isPsico && !hideCursos;
  const [cursosOpen, setCursosOpen] = useState(false);
  // bgColor suele venir con alpha pegado (#RRGGBBaa). Para el textShadow
  // queremos solo #RRGGBB y aplicar nuestras propias alphas.
  const bgHex = bgColor.length >= 7 ? bgColor.slice(0, 7) : bgColor;

  // Auto-shrink del título: el título va SIEMPRE en una sola línea
  // (whiteSpace:nowrap). Si su ancho natural supera el ancho del wrapper,
  // bajamos un escalón de fontSize para que quepa entero sin truncar.
  // Solo cambiamos a true (nunca volvemos atrás) para evitar el loop infinito
  // que hubo cuando medíamos sobre el propio <Text> y el observer disparaba
  // con cada cambio de fontSize.
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const [titleWraps, setTitleWraps] = useState(false);
  useLayoutEffect(() => {
    if (fitTitle) return; // en modo fitTitle manda la medición px de abajo
    setTitleWraps(false); // empezamos midiendo con el tamaño grande
    const wrapper = titleWrapperRef.current;
    if (!wrapper) return;
    const id = requestAnimationFrame(() => {
      const el = titleWrapperRef.current?.querySelector("p, .chakra-text") as HTMLElement | null;
      if (!el) return;
      // overflow horizontal: el texto natural es más ancho que su contenedor.
      const overflows = el.scrollWidth > el.clientWidth + 1;
      if (overflows) setTitleWraps(true);
    });
    return () => cancelAnimationFrame(id);
  }, [title, fitTitle]);
  // ── Modo `fitTitle` (página de lección) ────────────────────────────────
  // El título va SIEMPRE en una sola línea y, SOLO si a su tamaño natural no
  // cabe, lo encogemos px a px hasta que quepa. Nunca dos líneas, nunca "…".
  // Es un fontSize numérico controlado por medición (no los tokens de Chakra),
  // así que ignora `tituloUniforme`/`compact`. Solo se activa donde se pide.
  const [fitPx, setFitPx] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (!fitTitle) { setFitPx(null); return; }
    const wrapper = titleWrapperRef.current;
    if (!wrapper) return;
    const fit = () => {
      const el = wrapper.querySelector("p, .chakra-text") as HTMLElement | null;
      if (!el) return;
      const desktop = window.innerWidth >= 768;
      const max = tallTitle ? (desktop ? 60 : 34) : (desktop ? 48 : 30);
      const min = desktop ? 22 : 18;
      let size = max;
      el.style.fontSize = `${size}px`;
      // Encogemos mientras el ancho natural supere el del contenedor (una línea).
      while (size > min && el.scrollWidth > el.clientWidth + 1) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
      setFitPx(size);
    };
    const raf = requestAnimationFrame(fit);
    window.addEventListener("resize", fit);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", fit); };
  }, [fitTitle, title, tallTitle]);

  // Con título uniforme (TCM) no encogemos nunca: el título mantiene su tamaño
  // grande y, si hace falta, envuelve a dos líneas (whiteSpace:normal).
  const titleWrapsEff = tituloUniforme ? false : titleWraps;
  // TCM quiere sus títulos igual de GRANDES que el resto de disciplinas, así que
  // ignoramos el `compact` que traen sus páginas (era el que los encogía). Fuera
  // de TCM, `compact` sigue funcionando igual (tests con nombres largos).
  const compactEff = tituloUniforme ? false : compact;
  return (
    <>
    <Box
      position="relative"
      w="100%"
      maxW={maxW}
      mb={mb}
      borderRadius="2xl"
      overflow="hidden"
      bg={useDiscBg ? "transparent" : bgColor}
      border={useDiscBg ? "none" : `1px solid ${color}33`}
      boxShadow={
        boxShadow ??
        (useDiscBg
          ? `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`
          : `0 4px 20px rgba(0,0,0,0.22), 0 0 12px rgba(255,255,255,0.14), 0 0 26px rgba(255,255,255,0.07), 0 0 16px ${color}2b`)
      }
    >
      {useDiscBg && <DisciplinaBgLayer nom={headerNom!} borderRadius="2xl" />}

      <Box position="relative" zIndex={1} px={{ base: 4, md: 14 }} py={{ base: 3, md: 4 }}>
        {/* Cabecera: icono + título. Un pequeño margen superior baja el título
            para que quede ópticamente más centrado dentro del box (detalle de
            calidad; afecta a todos los headers). */}
        <Flex direction="row" align="center" justify="center" gap={5} mt={{ base: 1.5, md: 2 }}>
          <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center">
            {icon}
          </Box>
          <Flex align="baseline" gap={{ base: 1.5, md: 2.5 }} minW={0} flexShrink={1}
                mt={{ base: "2px", md: "4px" }}>
            <Box ref={titleWrapperRef} minW={0} flexShrink={1}>
              <Text
                color={color}
                fontSize={
                  fitTitle
                    // En modo fitTitle el tamaño lo controla la medición (px);
                    // hasta la 1ª medición usamos el tamaño grande como base.
                    ? (tallTitle ? { base: "34px", md: "60px" } : { base: "30px", md: "48px" })
                    : tallTitle
                    ? (compactEff
                        ? (titleWrapsEff ? { base: "xl", md: "3xl" } : { base: "3xl", md: "4xl" })
                        : (titleWrapsEff ? { base: "2xl", md: "5xl" } : { base: "4xl", md: "6xl" }))
                    : (compactEff
                        ? (titleWrapsEff ? { base: "lg", md: "2xl" } : { base: "2xl", md: "3xl" })
                        : (titleWrapsEff ? { base: "xl", md: "4xl" } : { base: "3xl", md: "5xl" }))
                }
                fontWeight="700"
                letterSpacing="0.05em"
                lineHeight={tallTitle ? "1.75" : "1.3"}
                textAlign="center"
                whiteSpace={fitTitle ? "nowrap" : tituloUniforme ? "normal" : "nowrap"}
                overflow="hidden"
                textOverflow="ellipsis"
                // El rabito de la "g" (descendente) baja por debajo de la línea
                // base; con overflow:hidden se recortaría. Este padding inferior
                // entra dentro de la zona visible y deja espacio para que se vea
                // entero (Fisiología, Astrología…).
                pb="0.18em"
                style={{
                  textShadow: useDiscBg
                    ? `0 1px 3px ${bgHex}f5, 0 0 8px ${bgHex}cc, 0 2px 16px ${bgHex}88`
                    : `0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3), 0 0 60px ${color}55`,
                  // fitTitle: el tamaño medido (px) manda sobre el token de Chakra.
                  ...(fitTitle && fitPx != null ? { fontSize: `${fitPx}px` } : {}),
                }}
              >
                {title}
              </Text>
            </Box>
            {step && step.total > 1 && (
              <Text flexShrink={0} color={`${color}aa`} fontSize={{ base: "xs", md: "lg" }} fontWeight="600"
                    letterSpacing="0.06em" whiteSpace="nowrap">
                {step.current}/{step.total}
              </Text>
            )}
            {pageLabel && (
              <Text flexShrink={0} color={`${color}aa`} fontSize={{ base: "xs", md: "lg" }} fontWeight="600"
                    letterSpacing="0.06em" whiteSpace="nowrap">
                {pageLabel}
              </Text>
            )}
          </Flex>
        </Flex>

        {/* Espacio entre título y botones (antes había una raya separadora) */}
        {(prev || next || extra || showPsicoCursos) && <Box h={{ base: 5, md: 7 }} />}

        {/* Botones contextuales — siempre en una sola fila horizontal,
            tanto en móvil como en desktop. Si no caben, los botones se
            encogen (gracias al flex:0 1 auto + minW:0 del StepBtn) en lugar
            de saltar a una segunda fila. */}
        {(prev || next || extra || showPsicoCursos) && (
          <Flex
            justify="center"
            align="center"
            gap={{ base: 3, md: 6 }}
            direction="row"
            wrap="nowrap"
          >
            {prev && <StepBtn {...prev} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
            {extra && <StepBtn {...extra} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
            {showPsicoCursos && <StepBtn label="Cursos" onClick={() => setCursosOpen(true)} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
            {next && <StepBtn {...next} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
          </Flex>
        )}
      </Box>
    </Box>
    {showPsicoCursos && <CursosPsicologiaModal isOpen={cursosOpen} onClose={() => setCursosOpen(false)} />}
    </>
  );
}
