import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ReelsPlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <polygon points="8,5 21,12 8,19" fill="white" opacity="0.9" />
  </svg>
);

const ReelsNavIcon = ({ size = "36px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="#008080">
    <path d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/>
  </svg>
);

const reelTags = [
  { label: "Fisiología",      color: "#6bc4c8" },
  { label: "Neuropsicología", color: "#9b8ec4" },
  { label: "TCM",             color: "#c4916b" },
  { label: "Nutrición",       color: "#6bc48a" },
  { label: "Astrología",      color: "#c4c46b" },
];

const glassCard = {
  bg: "rgba(255,255,255,0.22)",
  border: "1px solid rgba(255,255,255,0.45)",
  sx: { backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" },
  borderRadius: "2xl",
  boxShadow: "0 8px 36px rgba(107,196,200,0.45)",
};

interface ReelsBannerProps {
  maxW?: string | object;
  w?: string | object;
  compact?: boolean;
}

const ReelsBanner = ({ maxW = "900px", w = "100%", compact = false }: ReelsBannerProps) => {
  const navigate = useNavigate();

  if (compact) {
    return (
      <Box
        w={w} maxW={maxW}
        {...glassCard}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        cursor="pointer"
        onClick={() => navigate("/reels")}
        transition="transform 0.22s ease, box-shadow 0.22s ease"
      >
        {/* Zona visual */}
        <Box
          h="150px"
          bg="rgba(0,0,0,0.42)"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={5}
          position="relative"
          overflow="hidden"
          flexShrink={0}
        >
          {/* Glow */}
          <Box
            position="absolute" top="50%" left="50%"
            transform="translate(-50%, -50%)"
            w="140px" h="140px" borderRadius="full"
            bg="rgba(107,196,200,0.15)" filter="blur(30px)"
            pointerEvents="none"
          />

          {/* Marco teléfono */}
          <Box
            w="58px" h="96px"
            borderRadius="12px"
            border="1.5px solid rgba(255,255,255,0.30)"
            bg="rgba(0,0,0,0.55)"
            display="flex" alignItems="center" justifyContent="center"
            zIndex={1}
            boxShadow="0 6px 24px rgba(0,0,0,0.5), 0 0 0 3px rgba(255,255,255,0.05)"
            flexShrink={0}
          >
            <Box
              w="26px" h="26px" borderRadius="full"
              border="1.5px solid rgba(255,255,255,0.5)"
              bg="rgba(255,255,255,0.07)"
              display="flex" alignItems="center" justifyContent="center"
            >
              <ReelsPlayIcon />
            </Box>
          </Box>

          {/* Tags */}
          <Flex direction="column" gap={1.5} zIndex={1} flexShrink={0}>
            {reelTags.slice(0, 4).map((t) => (
              <Box
                key={t.label}
                px={2} py="2px"
                borderRadius="full"
                bg={t.color + "22"}
                border={`1px solid ${t.color}55`}
              >
                <Text color={t.color} fontSize="8px" fontWeight="700" letterSpacing="0.1em">
                  {t.label.toUpperCase()}
                </Text>
              </Box>
            ))}
          </Flex>

          {/* Degradado inferior */}
          <Box
            position="absolute" bottom={0} left={0} right={0} h="50px"
            bgGradient="linear(to-b, transparent, rgba(0,100,90,0.55))"
            pointerEvents="none"
          />
        </Box>

        {/* Contenido */}
        <Box
          px={6} py={5}
          display="flex" flexDirection="column"
          alignItems="center" gap={3}
          textAlign="center"
          flex="1"
        >
          <Flex align="center" gap={2}>
            <Box bg="white" borderRadius="full" p="7px" display="flex" alignItems="center" justifyContent="center" flexShrink={0} boxShadow="0 2px 10px rgba(0,0,0,0.12)">
              <ReelsNavIcon size="34px" />
            </Box>
            <Text
              color="white"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.04em"
              textShadow="0 2px 8px rgba(0,100,90,0.4)"
              lineHeight="1.2"
            >
              Reels
            </Text>
          </Flex>

          <Text
            color="rgba(255,255,255,0.78)"
            fontSize={{ base: "sm", md: "md" }}
            fontFamily="'EB Garamond', serif"
            lineHeight="1.7"
            letterSpacing="0.01em"
          >
            Vídeos cortos y transformadores. Conocimiento que cambia la Vida.
          </Text>

          <Box
            as="button"
            onClick={() => navigate("/reels")}
            cursor="pointer"
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize="sm"
            letterSpacing="0.07em"
            px={5} py="6px"
            borderRadius="full"
            border="1.5px solid rgba(255,255,255,0.5)"
            bg="rgba(255,255,255,0.1)"
            mt="auto"
            _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
            transition="all 0.2s"
          >
            Ver reels →
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      w={w} maxW={maxW}
      {...glassCard}
      overflow="hidden"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "center", md: "stretch" }}
    >
      {/* ── Zona visual izquierda ── */}
      <Box
        flexShrink={0}
        w={{ base: "100%", md: "220px" }}
        minH={{ base: "200px", md: "auto" }}
        bg="rgba(0,0,0,0.38)"
        display="flex" flexDirection="column"
        alignItems="center" justifyContent="center"
        gap={5} px={6} py={8}
        position="relative" overflow="hidden"
      >
        <Box
          position="absolute" top="50%" left="50%"
          transform="translate(-50%, -50%)"
          w="160px" h="160px" borderRadius="full"
          bg="rgba(107,196,200,0.18)" filter="blur(34px)"
          pointerEvents="none"
        />

        <Box
          w="76px" h="126px" borderRadius="16px"
          border="1.5px solid rgba(255,255,255,0.32)"
          bg="rgba(0,0,0,0.55)"
          display="flex" alignItems="center" justifyContent="center"
          position="relative" zIndex={1}
          boxShadow="0 8px 32px rgba(0,0,0,0.45), 0 0 0 4px rgba(255,255,255,0.06)"
        >
          <Box
            w="34px" h="34px" borderRadius="full"
            border="1.5px solid rgba(255,255,255,0.55)"
            bg="rgba(255,255,255,0.07)"
            display="flex" alignItems="center" justifyContent="center"
          >
            <ReelsPlayIcon />
          </Box>
        </Box>

        <Flex wrap="wrap" gap={1.5} justify="center" zIndex={1} position="relative" maxW="160px">
          {reelTags.map((t) => (
            <Box
              key={t.label} px={2} py="2px"
              borderRadius="full"
              bg={t.color + "22"} border={`1px solid ${t.color}55`}
            >
              <Text color={t.color} fontSize="9px" fontWeight="700" letterSpacing="0.1em">
                {t.label.toUpperCase()}
              </Text>
            </Box>
          ))}
        </Flex>

        <Box
          position="absolute"
          bottom={{ base: "0", md: "unset" }}
          top={{ base: "unset", md: "0" }}
          right="0"
          w={{ base: "100%", md: "70px" }}
          h={{ base: "50px", md: "100%" }}
          bgGradient={{
            base: "linear(to-b, transparent, rgba(0,128,128,0.45))",
            md: "linear(to-l, rgba(0,128,128,0.45), transparent)",
          }}
          pointerEvents="none"
        />
      </Box>

      {/* ── Contenido ── */}
      <Box
        flex="1"
        px={{ base: 8, md: 14 }}
        py={{ base: 8, md: 10 }}
        display="flex" flexDirection="column"
        justifyContent="space-between"
        gap={4}
        textAlign={{ base: "center", md: "left" }}
      >
        <Flex align="center" gap={3} justify={{ base: "center", md: "flex-start" }}>
          <Box bg="white" borderRadius="full" p="9px" display="flex" alignItems="center" justifyContent="center" flexShrink={0} boxShadow="0 2px 14px rgba(0,0,0,0.14)">
            <ReelsNavIcon size="48px" />
          </Box>
          <Text
            color="white"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.05em"
            textShadow="0 2px 10px rgba(0,100,90,0.35)"
            lineHeight="1.2"
          >
            Reels
          </Text>
        </Flex>

        <Text
          color="rgba(255,255,255,0.85)"
          fontSize={{ base: "md", md: "xl" }}
          fontFamily="'EB Garamond', serif"
          lineHeight="1.9" letterSpacing="0.02em"
          textShadow="0 1px 5px rgba(0,100,90,0.25)"
        >
          Vídeos cortos y transformadores sobre fisiología, neuropsicología, medicina china y mucho más.
          Conocimiento que transforma, un reel a la vez.
        </Text>

        <Flex justify={{ base: "center", md: "flex-end" }} mt={1}>
          <Box
            as="button"
            onClick={() => navigate("/reels")}
            color="white" fontFamily="'EB Garamond', serif"
            fontWeight="600" fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.08em" px={7} py="9px"
            borderRadius="full"
            border="1.5px solid rgba(255,255,255,0.6)"
            bg="rgba(255,255,255,0.12)" cursor="pointer"
            _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
            transition="all 0.22s"
          >
            Ver reels →
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ReelsBanner;
