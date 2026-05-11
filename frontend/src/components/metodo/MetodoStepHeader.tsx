import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

interface StepButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface MetodoStepHeaderProps {
  icon: React.ReactNode;
  title: string;
  bgColor: string;     // color sólido del círculo del icono (y fondo si space=false)
  color: string;       // color del título, botones, borde, glow
  maxW?: string;
  mb?: any;
  space?: boolean;     // true → fondo estrellado (foto + overlay cósmico)
  prev?: StepButton;
  next?: StepButton;
}

const SpaceBg = ({ overlay = "rgba(8,13,30,0.62)" }: { overlay?: string }) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius="inherit"
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
    }}
  >
    <Box
      as="img"
      src="/img/astrologia/space.jpg"
      alt=""
      loading="eager"
      position="absolute"
      inset="0"
      w="100%"
      h="100%"
      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.85 }}
    />
    <Box position="absolute" inset="0" style={{ background: overlay }} />
  </Box>
);

const StepBtn = ({ label, color, onClick, disabled }: StepButton & { color: string }) => (
  <Box
    as="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    px={{ base: 5, md: 7 }}
    py={2.5}
    borderRadius="full"
    bg="transparent"
    border={`1px solid ${disabled ? color + "22" : color + "77"}`}
    color={disabled ? `${color}44` : color}
    fontFamily="'EB Garamond', serif"
    fontSize={{ base: "sm", md: "md" }}
    letterSpacing="0.05em"
    fontStyle="italic"
    cursor={disabled ? "not-allowed" : "pointer"}
    transition="all 0.2s"
    boxShadow={disabled ? "none" : `0 0 14px ${color}33`}
    _hover={disabled ? undefined : { borderColor: color, boxShadow: `0 0 22px ${color}66` }}
    whiteSpace="nowrap"
  >
    {label}
  </Box>
);

export function MetodoStepHeader({
  icon,
  title,
  bgColor,
  color,
  maxW = "850px",
  mb = { base: 10, md: 12 },
  space = false,
  prev,
  next,
}: MetodoStepHeaderProps) {
  return (
    <Box
      position="relative"
      w="100%"
      maxW={maxW}
      mb={mb}
      borderRadius="2xl"
      overflow="hidden"
      bg={space ? "transparent" : bgColor}
      border={`1px solid ${color}33`}
      boxShadow={
        space
          ? `0 0 28px ${color}33, 0 0 72px ${color}1f`
          : `0 4px 20px rgba(0,0,0,0.22), 0 0 22px ${color}55`
      }
    >
      {space && <SpaceBg />}

      <Box position="relative" zIndex={1} px={{ base: 8, md: 14 }} py={{ base: 8, md: 10 }}>
        {/* Cabecera: icono + título */}
        <Flex direction="row" align="center" justify="center" gap={5}>
          <Box
            borderRadius="full"
            bg={bgColor}
            border={`5px solid ${color}`}
            boxShadow={`0 0 22px ${color}77, 0 0 55px ${color}28`}
            w={{ base: "60px", md: "72px" }}
            h={{ base: "60px", md: "72px" }}
            display="flex"
            p="5px"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            {icon}
          </Box>
          <Text
            color={color}
            fontSize={{ base: "2xl", md: "5xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            lineHeight="1.15"
            style={{
              textShadow: space ? `0 0 12px ${color}77` : "1px 1px 3px rgba(0,0,0,0.25)",
            }}
          >
            {title}
          </Text>
        </Flex>

        {/* Raya separadora */}
        {(prev || next) && (
          <Box
            h="1px"
            my={5}
            mx="auto"
            w="80%"
            bgGradient={`linear(to-r, transparent, ${color}66, transparent)`}
          />
        )}

        {/* Botones contextuales */}
        {(prev || next) && (
          <Flex
            justify={prev && next ? "space-between" : "center"}
            gap={3}
            direction={{ base: "column", sm: "row" }}
          >
            {prev && <StepBtn {...prev} color={color} />}
            {next && <StepBtn {...next} color={color} />}
          </Flex>
        )}
      </Box>
    </Box>
  );
}
