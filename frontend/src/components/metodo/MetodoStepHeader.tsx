import React, { useLayoutEffect, useRef, useState } from "react";
import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { astrologiaNom, cabalaNom, culturaNom, fisiologiaNom, neuropsicologiaNom, nutricionNom, tcmNom } from "../../GlobalVariables";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { CursosPsicologiaModal } from "./CursosPsicologiaModal";
import { useT } from "../../i18n";

interface StepButton {
  label: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  /** Texto que aparece al pasar el ratón cuando está deshabilitado. */
  disabledTooltip?: string;
  /** Botón más compacto (menos padding y letra), p.ej. «Volver al curso». */
  small?: boolean;
  /** Lo pone el header en modo `dense`: botón algo más bajo que el normal,
   *  pero sin llegar a la letra diminuta de `small`. */
  dense?: boolean;
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
  /** Segundo botón central, a la derecha de `extra`. Lo usan las páginas que
   *  necesitan DOS atajos en medio (p.ej. Cábala: «El Árbol» + «Ilustraciones»,
   *  que nunca debe faltar en sus headers). */
  extra2?: StepButton;
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
  /** Multiplica el tamaño NATURAL del título de `fitTitle` (1 = el de siempre).
   *  El auto-encogido sigue funcionando igual: esto solo sube el techo del que
   *  parte. Lo usa la página de lección, que va un 20% más grande que el resto
   *  del recorrido porque ahí el texto es lo único que hay. */
  titleScale?: number;
  /** Sombra/glow del box completo. Si se pasa, sustituye al glow por defecto
   *  (útil para darle un brillo propio a una página, p.ej. dorado). */
  boxShadow?: string;
  /** Header de perfil bajo: menos padding, título más pequeño, menos hueco
   *  antes de los botones y botones algo más bajos. Para páginas donde el
   *  contenido manda y el header solo tiene que orientar (p.ej. «Diseña tu
   *  día»). A diferencia de `compact`, SÍ se aplica en las disciplinas de
   *  título uniforme (TCM, Fisiología, Nutrición, Cábala, Cultura). */
  dense?: boolean;
}

const StepBtn = ({ label, color, onClick, disabled, icon, disabledTooltip, whiteBg, small, dense, arrow, btnColor, btnBg }: StepButton & { color: string; bgColor: string; whiteBg?: boolean }) => {
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
      px={small ? { base: 2, md: 3.5 } : dense ? { base: 2.5, sm: 4, md: 6 } : { base: 3, sm: 5, md: 8 }}
      py={small ? { base: 1, md: 1.5 } : dense ? { base: 1.5, md: 2 } : { base: 2, md: 3 }}
      borderRadius="full"
      bg={disabled ? (whiteBg ? "rgba(255,255,255,0.14)" : `${c}12`) : baseBg}
      border={`1.5px solid ${disabled ? c + "22" : `${c}aa`}`}
      color={disabled ? `${c}44` : c}
      fontFamily="'EB Garamond', serif"
      fontSize={small ? { base: "2xs", md: "xs" } : dense ? { base: "xs", sm: "sm", md: "sm" } : { base: "sm", sm: "md", md: "md" }}
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
  extra2,
  compact = false,
  step,
  pageLabel,
  boxShadow,
  tallTitle = false,
  hideCursos = false,
  fitTitle = false,
  titleScale = 1,
  dense = false,
}: MetodoStepHeaderProps) {
  const t = useT();
  // Tamaño natural del título de `fitTitle`, en px y ya escalado.
  const pxTitulo = (n: number) => `${Math.round(n * titleScale)}px`;
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

  // ── Ajuste del título (TODOS los headers) ─────────────────────────────
  // Regla de la casa: el título va SIEMPRE en UNA sola línea, entero y sin
  // «…». Se pinta a su tamaño natural (el token de Chakra de más abajo) y solo
  // si no cabe se encoge píxel a píxel hasta que quepa. Ni dos líneas, ni
  // recortes: el tamaño se adapta al hueco, no al revés.
  //
  // La medición es imperativa (se escribe `style.fontSize` en el nodo) y NO
  // guarda estado: así no hay re-render por cada píxel ni el bucle infinito de
  // «mido → cambio tamaño → el observer vuelve a medir» que hubo antes.
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const headerBoxRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const wrapper = titleWrapperRef.current;
    if (!wrapper) return;
    const ajustar = () => {
      const el = wrapper.querySelector("p, .chakra-text") as HTMLElement | null;
      if (!el) return;
      el.style.fontSize = ""; // se vuelve al tamaño natural antes de medir
      const natural = parseFloat(window.getComputedStyle(el).fontSize);
      if (!natural) return;
      // Suelo: por muy largo que sea el título no baja de aquí (mejor un pelín
      // apretado que ilegible). Con el 45 % nunca se ha llegado a tocar.
      const min = Math.max(14, Math.round(natural * 0.45));
      let size = natural;
      while (size > min && el.scrollWidth > el.clientWidth + 1) {
        size = Math.max(min, size - 1);
        el.style.fontSize = `${size}px`;
      }
    };
    const raf = requestAnimationFrame(ajustar);
    // Segunda pasada en diferido: en el primer frame los botones del header
    // («Volver al curso», el número de página…) pueden no haber ocupado aún su
    // sitio, así que el hueco del título todavía no es el definitivo. Medir solo
    // una vez es justo lo que dejaba títulos cortados con «…».
    const tardia = window.setTimeout(ajustar, 300);
    // Al cambiar el ancho del header (girar el móvil, redimensionar) se vuelve a
    // medir. Se mira SOLO el ancho: el alto cambia al encoger la letra y
    // reaccionar a eso sería morderse la cola.
    let anchoPrev = headerBoxRef.current?.getBoundingClientRect().width ?? 0;
    const ro = new ResizeObserver((entries) => {
      const ancho = entries[0]?.contentRect.width ?? 0;
      if (Math.abs(ancho - anchoPrev) < 1) return;
      anchoPrev = ancho;
      ajustar();
    });
    if (headerBoxRef.current) ro.observe(headerBoxRef.current);
    // La tipografía (EB Garamond) suele cargar DESPUÉS del primer pintado y el
    // texto cambia de ancho: se mide otra vez cuando esté lista.
    document.fonts?.ready.then(ajustar).catch(() => {});
    return () => { cancelAnimationFrame(raf); window.clearTimeout(tardia); ro.disconnect(); };
  }, [title, fitTitle, tallTitle, titleScale, compact, dense, tituloUniforme]);
  // TCM quiere sus títulos igual de GRANDES que el resto de disciplinas, así que
  // ignoramos el `compact` que traen sus páginas (era el que los encogía). Fuera
  // de TCM, `compact` sigue funcionando igual (tests con nombres largos).
  const compactEff = tituloUniforme ? false : compact;
  return (
    <>
    <Box
      ref={headerBoxRef}
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

      <Box position="relative" zIndex={1} px={{ base: 4, md: dense ? 10 : 14 }}
           py={dense ? { base: 2.5, md: 3 } : { base: 3, md: 4 }}>
        {/* Cabecera: icono + título. Un pequeño margen superior baja el título
            para que quede ópticamente más centrado dentro del box (detalle de
            calidad; afecta a todos los headers). */}
        <Flex direction="row" align="center" justify="center" gap={dense ? 3.5 : 5}
              mt={dense ? { base: 0.5, md: 1 } : { base: 1.5, md: 2 }}>
          <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center">
            {icon}
          </Box>
          <Flex align="baseline" gap={{ base: 1.5, md: 2.5 }} minW={0} flexShrink={1}
                mt={{ base: "2px", md: "4px" }}>
            <Box ref={titleWrapperRef} minW={0} flexShrink={1}>
              <Text
                color={color}
                // Tamaño NATURAL del título (el de «cabe de sobra»). Si no
                // cabe, la medición de arriba lo baja px a px; aquí no hay
                // variantes «por si envuelve»: nunca envuelve.
                fontSize={
                  fitTitle
                    ? (tallTitle
                        ? { base: pxTitulo(34), md: pxTitulo(60) }
                        : { base: pxTitulo(30), md: pxTitulo(48) })
                    : dense
                    // Modo denso: título contenido. Manda sobre `tituloUniforme`,
                    // que es lo que anula el `compact` en estas disciplinas.
                    ? { base: "xl", md: "3xl" }
                    : tallTitle
                    ? (compactEff ? { base: "3xl", md: "4xl" } : { base: "4xl", md: "6xl" })
                    : (compactEff ? { base: "2xl", md: "3xl" } : { base: "3xl", md: "5xl" })
                }
                fontWeight="700"
                letterSpacing="0.05em"
                lineHeight={tallTitle ? "1.75" : "1.3"}
                textAlign="center"
                // SIEMPRE una línea: el ajuste de tamaño se encarga de que
                // quepa, así que ni envuelve ni hace falta cortar con «…».
                whiteSpace="nowrap"
                overflow="hidden"
                // El rabito de la "g" (descendente) baja por debajo de la línea
                // base; con overflow:hidden se recortaría. Este padding inferior
                // entra dentro de la zona visible y deja espacio para que se vea
                // entero (Fisiología, Astrología…).
                pb="0.18em"
                style={{
                  textShadow: useDiscBg
                    ? `0 1px 3px ${bgHex}f5, 0 0 8px ${bgHex}cc, 0 2px 16px ${bgHex}88`
                    : `0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3), 0 0 60px ${color}55`,
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
        {(prev || next || extra || extra2 || showPsicoCursos) && <Box h={dense ? { base: 3, md: 4 } : { base: 5, md: 7 }} />}

        {/* Botones contextuales — siempre en una sola fila horizontal,
            tanto en móvil como en desktop. Si no caben, los botones se
            encogen (gracias al flex:0 1 auto + minW:0 del StepBtn) en lugar
            de saltar a una segunda fila. */}
        {(prev || next || extra || extra2 || showPsicoCursos) && (
          <Flex
            justify="center"
            align="center"
            gap={dense ? { base: 2.5, md: 4 } : { base: 3, md: 6 }}
            direction="row"
            wrap="nowrap"
          >
            {prev && <StepBtn {...prev} dense={dense} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
            {extra && <StepBtn {...extra} dense={dense} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
            {extra2 && <StepBtn {...extra2} dense={dense} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
            {showPsicoCursos && <StepBtn label={t("header.cursos")} onClick={() => setCursosOpen(true)} dense={dense} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
            {next && <StepBtn {...next} dense={dense} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
          </Flex>
        )}
      </Box>
    </Box>
    {showPsicoCursos && <CursosPsicologiaModal isOpen={cursosOpen} onClose={() => setCursosOpen(false)} />}
    </>
  );
}
