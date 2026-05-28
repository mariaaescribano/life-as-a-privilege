import React from "react";
import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { astrologiaNom } from "../../GlobalVariables";
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
}

const StepBtn = ({ label, color, bgColor, onClick, disabled, icon, disabledTooltip }: StepButton & { color: string; bgColor: string }) => {
  // bgColor puede venir con alpha pegado (#RRGGBBaa). Para la sombra del texto
  // queremos solo #RRGGBB y aplicar nuestra propia alpha discreta.
  const bgHex = bgColor.length >= 7 ? bgColor.slice(0, 7) : bgColor;
  const btn = (
    <Box
      as="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      px={{ base: 2.5, sm: 4, md: 7 }}
      py={{ base: 1.5, md: 2.5 }}
      borderRadius="full"
      bg="rgba(255,255,255,0.04)"
      border={`1px solid ${disabled ? color + "22" : `${color}66`}`}
      color={disabled ? `${color}44` : color}
      fontFamily="'EB Garamond', serif"
      fontSize={{ base: "xs", sm: "sm", md: "md" }}
      letterSpacing={{ base: "0.02em", md: "0.05em" }}
      fontStyle="italic"
      cursor={disabled ? "not-allowed" : "pointer"}
      transition="background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease"
      boxShadow={disabled ? "none" : `0 0 8px rgba(255,255,255,0.14), 0 0 18px ${color}33`}
      textShadow={disabled ? "none" : `0 1px 2px ${bgHex}cc, 0 0 8px ${bgHex}99, 0 0 14px ${bgHex}55`}
      _hover={disabled ? undefined : {
        bg: "rgba(255,255,255,0.12)",
        borderColor: `${color}cc`,
        boxShadow: `0 0 14px rgba(255,255,255,0.35), 0 0 30px ${color}33, 0 0 30px ${color}44`,
      }}
      whiteSpace="nowrap"
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
}: MetodoStepHeaderProps) {
  // Si pasas `nom` y esa disciplina tiene fondo propio, lo usamos. El antiguo
  // prop `space` se mantiene como alias para Astrología.
  const headerNom = nom ?? (space ? astrologiaNom : undefined);
  const useDiscBg = !!headerNom && hasDisciplinaBg(headerNom);
  // bgColor suele venir con alpha pegado (#RRGGBBaa). Para el textShadow
  // queremos solo #RRGGBB y aplicar nuestras propias alphas.
  const bgHex = bgColor.length >= 7 ? bgColor.slice(0, 7) : bgColor;
  return (
    <Box
      position="relative"
      w="100%"
      maxW={maxW}
      mb={mb}
      borderRadius="2xl"
      overflow="hidden"
      bg={useDiscBg ? "transparent" : bgColor}
      border={`1px solid ${color}33`}
      boxShadow={
        useDiscBg
          ? `0 0 22px rgba(255,255,255,0.32), 0 0 50px rgba(255,255,255,0.16), 0 0 90px rgba(180,255,245,0.18), 0 0 28px ${color}33, 0 0 72px ${color}1f`
          : `0 4px 20px rgba(0,0,0,0.22), 0 0 18px rgba(255,255,255,0.28), 0 0 40px rgba(255,255,255,0.14), 0 0 22px ${color}55`
      }
    >
      {useDiscBg && <DisciplinaBgLayer nom={headerNom!} borderRadius="2xl" />}

      <Box position="relative" zIndex={1} px={{ base: 8, md: 14 }} py={{ base: 5, md: 7 }}>
        {/* Cabecera: icono + título */}
        <Flex direction="row" align="center" justify="center" gap={5}>
          <Box
            borderRadius="full"
            bg={useDiscBg ? "transparent" : bgColor}
            border={`5px solid ${color}`}
            boxShadow={`0 0 14px rgba(255,255,255,0.5), 0 0 32px rgba(255,255,255,0.25), 0 0 22px ${color}77, 0 0 55px ${color}28`}
            w={{ base: "60px", md: "72px" }}
            h={{ base: "60px", md: "72px" }}
            display="flex"
            p="5px"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            position="relative"
            overflow={useDiscBg ? "hidden" : undefined}
          >
            {useDiscBg && <DisciplinaBgLayer nom={headerNom!} borderRadius="full" />}
            <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
              {icon}
            </Box>
          </Box>
          <Text
            color={color}
            fontSize={{ base: "3xl", md: "6xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            lineHeight="1.15"
            style={{
              textShadow: useDiscBg
                ? `0 1px 3px ${bgHex}f5, 0 0 8px ${bgHex}cc, 0 2px 16px ${bgHex}88`
                : `0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3), 0 0 60px ${color}55`,
            }}
          >
            {title}
          </Text>
        </Flex>

        {/* Raya separadora */}
        {(prev || next || extra) && (
          <Box
            h="1px"
            my={5}
            mx="auto"
            w="80%"
            bgGradient={`linear(to-r, transparent, ${color}66, transparent)`}
          />
        )}

        {/* Botones contextuales — wrap centrado.
            En desktop entran los 3 en una fila; en móvil, si no caben, los que
            sobren bajan a una segunda fila sin recortarse ni descolocarse. */}
        {(prev || next || extra) && (
          <Flex
            justify="center"
            align="center"
            gap={{ base: 2, md: 3 }}
            direction="row"
            wrap="wrap"
          >
            {prev && <StepBtn {...prev} color={color} bgColor={bgColor} />}
            {extra && <StepBtn {...extra} color={color} bgColor={bgColor} />}
            {next && <StepBtn {...next} color={color} bgColor={bgColor} />}
          </Flex>
        )}
      </Box>
    </Box>
  );
}
