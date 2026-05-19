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
    bg="rgba(255,255,255,0.04)"
    border={`1px solid ${disabled ? color + "22" : "rgba(255,255,255,0.4)"}`}
    color={disabled ? `${color}44` : "white"}
    fontFamily="'EB Garamond', serif"
    fontSize={{ base: "sm", md: "md" }}
    letterSpacing="0.05em"
    fontStyle="italic"
    cursor={disabled ? "not-allowed" : "pointer"}
    transition="background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease"
    boxShadow={disabled ? "none" : `0 0 8px rgba(255,255,255,0.14), 0 0 18px ${color}22`}
    textShadow={disabled ? "none" : "0 0 6px rgba(255,255,255,0.3)"}
    _hover={disabled ? undefined : {
      bg: "rgba(255,255,255,0.12)",
      borderColor: "rgba(255,255,255,0.75)",
      boxShadow: `0 0 14px rgba(255,255,255,0.35), 0 0 30px rgba(180,255,245,0.2), 0 0 30px ${color}44`,
    }}
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
          ? `0 0 22px rgba(255,255,255,0.32), 0 0 50px rgba(255,255,255,0.16), 0 0 90px rgba(180,255,245,0.18), 0 0 28px ${color}33, 0 0 72px ${color}1f`
          : `0 4px 20px rgba(0,0,0,0.22), 0 0 18px rgba(255,255,255,0.28), 0 0 40px rgba(255,255,255,0.14), 0 0 22px ${color}55`
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
            boxShadow={`0 0 14px rgba(255,255,255,0.5), 0 0 32px rgba(255,255,255,0.25), 0 0 22px ${color}77, 0 0 55px ${color}28`}
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
              textShadow: `0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3), 0 0 60px ${color}55`,
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
