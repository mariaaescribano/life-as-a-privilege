import React, { useLayoutEffect, useRef, useState } from "react";
import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { astrologiaNom, tcmNom } from "../../GlobalVariables";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";

interface StepButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  /** Texto que aparece al pasar el ratón cuando está deshabilitado. */
  disabledTooltip?: string;
}

interface MetodoStepHeaderProps {
  icon: React.ReactNode;
  title: string;
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
}

const StepBtn = ({ label, color, onClick, disabled, icon, disabledTooltip, whiteBg }: StepButton & { color: string; bgColor: string; whiteBg?: boolean }) => {
  const btn = (
    <Box
      as="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      px={{ base: 2, sm: 4, md: 7 }}
      py={{ base: 1.5, md: 2.5 }}
      borderRadius="full"
      bg={whiteBg ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}
      border={`1px solid ${disabled ? color + "22" : `${color}66`}`}
      color={disabled ? `${color}44` : color}
      fontFamily="'EB Garamond', serif"
      fontSize={{ base: "xs", sm: "sm", md: "md" }}
      letterSpacing={{ base: "0.02em", md: "0.05em" }}
      fontStyle="italic"
      cursor={disabled ? "not-allowed" : "pointer"}
      // transition mucho más rápida (80ms) para que el feedback visual sea
      // casi instantáneo al pulsar. background/border/box-shadow son las
      // propiedades que pintan el "pressed".
      transition="background 0.08s ease, border-color 0.08s ease, box-shadow 0.08s ease, color 0.08s ease, transform 0.08s ease"
      boxShadow={disabled ? "none" : `0 0 6px rgba(255,255,255,0.1), 0 0 13px ${color}24`}
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
        bg: "rgba(255,255,255,0.12)",
        borderColor: `${color}cc`,
        boxShadow: `0 0 14px rgba(255,255,255,0.35), 0 0 30px ${color}33, 0 0 30px ${color}44`,
      }}
      // _active: feedback inmediato al pulsar (móvil y desktop).
      _active={disabled ? undefined : {
        bg: "rgba(255,255,255,0.18)",
        borderColor: color,
        transform: "scale(0.96)",
        boxShadow: `0 0 22px rgba(255,255,255,0.5), 0 0 42px ${color}66`,
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
      {icon}
      {label}
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
}: MetodoStepHeaderProps) {
  // Si pasas `nom` y esa disciplina tiene fondo propio, lo usamos. El antiguo
  // prop `space` se mantiene como alias para Astrología.
  const headerNom = nom ?? (space ? astrologiaNom : undefined);
  const useDiscBg = !!headerNom && hasDisciplinaBg(headerNom);
  // En el header de Medicina China los botones llevan un fondo blanco mínimo
  // (casi transparente) para que el texto se lea sobre su fondo.
  const btnWhiteBg = headerNom === tcmNom;
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
  }, [title]);
  return (
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
        useDiscBg
          ? `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`
          : `0 4px 20px rgba(0,0,0,0.22), 0 0 12px rgba(255,255,255,0.14), 0 0 26px rgba(255,255,255,0.07), 0 0 16px ${color}2b`
      }
    >
      {useDiscBg && <DisciplinaBgLayer nom={headerNom!} borderRadius="2xl" />}

      <Box position="relative" zIndex={1} px={{ base: 4, md: 14 }} py={{ base: 3, md: 4 }}>
        {/* Cabecera: icono + título */}
        <Flex direction="row" align="center" justify="center" gap={5}>
          <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center">
            {icon}
          </Box>
          <Flex align="baseline" gap={{ base: 1.5, md: 2.5 }} minW={0} flexShrink={1}>
            <Box ref={titleWrapperRef} minW={0} flexShrink={1}>
              <Text
                color={color}
                fontSize={
                  compact
                    ? (titleWraps ? { base: "md", md: "2xl" } : { base: "xl", md: "3xl" })
                    : (titleWraps ? { base: "lg", md: "4xl" } : { base: "2xl", md: "5xl" })
                }
                fontWeight="700"
                letterSpacing="0.05em"
                lineHeight="1.3"
                textAlign="center"
                whiteSpace="nowrap"
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
        {(prev || next || extra) && <Box h={{ base: 2.5, md: 3 }} />}

        {/* Botones contextuales — siempre en una sola fila horizontal,
            tanto en móvil como en desktop. Si no caben, los botones se
            encogen (gracias al flex:0 1 auto + minW:0 del StepBtn) en lugar
            de saltar a una segunda fila. */}
        {(prev || next || extra) && (
          <Flex
            justify="center"
            align="center"
            gap={{ base: 2, md: 3 }}
            direction="row"
            wrap="nowrap"
          >
            {prev && <StepBtn {...prev} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
            {extra && <StepBtn {...extra} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
            {next && <StepBtn {...next} color={color} bgColor={bgColor} whiteBg={btnWhiteBg} />}
          </Flex>
        )}
      </Box>
    </Box>
  );
}
