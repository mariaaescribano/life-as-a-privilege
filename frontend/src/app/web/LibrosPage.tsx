import React, { useEffect } from "react";
import { Box, Flex, Text, Image, SimpleGrid } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LibrosIcon } from "../../GlobalVariables";
import { apuntes, libros, type Apunte, type Libro } from "../../hardCoded/libros/libros";

const GLASS = {
  bg: "rgba(255,255,255,0.22)",
  border: "1px solid rgba(255,255,255,0.45)",
  sx: { backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" },
  borderRadius: "2xl",
  boxShadow: "0 8px 36px rgba(107,196,200,0.45)",
};

function LibrosHeader() {
  return (
    <Box
      {...GLASS}
      px={{ base: 6, md: 10 }}
      py={{ base: 5, md: 7 }}
      w="100%"
      maxW="850px"
      mb={0}
    >
      <Flex direction="row" align="center" justify="center" gap={5}>
        <Box
          borderRadius="full"
          bg="rgba(255,255,255,0.18)"
          border="5px solid rgba(255,255,255,0.7)"
          boxShadow="0 0 22px rgba(255,255,255,0.45), 0 0 55px rgba(107,196,200,0.25)"
          w={{ base: "60px", md: "72px" }}
          h={{ base: "60px", md: "72px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          overflow="hidden"
          p="6px"
        >
          <LibrosIcon color="white" size="44px" />
        </Box>
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "5xl" }}
          fontWeight="700"
          letterSpacing="0.05em"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
          lineHeight="1.15"
        >
          Libros
        </Text>
      </Flex>
    </Box>
  );
}

function LeerButton({ href, size = "md" }: { href: string; size?: "sm" | "md" }) {
  return (
    <Box
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      gap={2}
      px={size === "sm" ? 5 : 7}
      py={size === "sm" ? "8px" : "10px"}
      borderRadius="full"
      border="2px solid rgba(255,255,255,0.55)"
      color="white"
      fontFamily="'EB Garamond', serif"
      fontSize={size === "sm" ? { base: "sm", md: "md" } : { base: "md", md: "lg" }}
      fontWeight="600"
      bg="transparent"
      letterSpacing="0.05em"
      cursor="pointer"
      textDecoration="none"
      _hover={{ bg: "rgba(255,255,255,0.18)", borderColor: "white" }}
      transition="all 0.2s"
    >
      Leer →
    </Box>
  );
}

function ApuntesBox({ items }: { items: Apunte[] }) {
  return (
    <Box
      {...GLASS}
      w="100%"
      maxW="850px"
      px={{ base: 6, md: 10 }}
      py={{ base: 8, md: 10 }}
    >
      <Flex align="center" justify="center" gap={3} mb={{ base: 6, md: 8 }}>
        <LibrosIcon color="white" size="34px" />
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="700"
          letterSpacing="0.05em"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
        >
          Apuntes
        </Text>
      </Flex>

      {items.length === 0 ? (
        <Text color="rgba(255,255,255,0.75)" textAlign="center" fontStyle="italic">
          Próximamente.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
          {items.map((apunte) => (
            <Flex
              key={apunte.id}
              direction="row"
              align="center"
              gap={{ base: 4, md: 5 }}
              bg="rgba(255,255,255,0.10)"
              border="1px solid rgba(255,255,255,0.28)"
              borderRadius="xl"
              boxShadow="0 2px 12px rgba(180,230,235,0.20), 0 0 10px rgba(107,196,200,0.22)"
              p={{ base: 4, md: 5 }}
            >
              {apunte.img && (
                <Box
                  overflow="hidden"
                  w={{ base: "110px", md: "130px" }}
                  aspectRatio={1}
                  flexShrink={0}
                  borderRadius="lg"
                >
                  <Image
                    src={apunte.img}
                    alt={apunte.titulo}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    objectPosition="center"
                  />
                </Box>
              )}
              <Flex direction="column" gap={3} flex="1" minW={0}>
                <Text
                  color="white"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="600"
                  letterSpacing="0.03em"
                  lineHeight="1.3"
                >
                  {apunte.titulo}
                </Text>
                <Box>
                  <LeerButton href={apunte.link} size="sm" />
                </Box>
              </Flex>
            </Flex>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

function MisLibrosBox({ items }: { items: Libro[] }) {
  return (
    <Box
      {...GLASS}
      w="100%"
      maxW="850px"
      px={{ base: 6, md: 10 }}
      py={{ base: 8, md: 10 }}
    >
      <Flex align="center" justify="center" gap={3} mb={{ base: 6, md: 8 }}>
        <LibrosIcon color="white" size="34px" />
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="700"
          letterSpacing="0.05em"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
        >
          Mis Libros
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
        {items.map((libro) => (
          <Flex
            key={libro.id}
            direction="row"
            align="center"
            gap={{ base: 4, md: 5 }}
            bg="rgba(255,255,255,0.10)"
            border="1px solid rgba(255,255,255,0.28)"
            borderRadius="2xl"
            boxShadow="0 2px 12px rgba(180,230,235,0.20), 0 0 12px rgba(107,196,200,0.25)"
            p={{ base: 4, md: 5 }}
          >
            {libro.img && (
              <Box
                overflow="hidden"
                w={{ base: "120px", md: "140px" }}
                aspectRatio={1}
                flexShrink={0}
                borderRadius="lg"
              >
                <Image
                  src={libro.img}
                  alt={libro.titulo}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  objectPosition="center"
                />
              </Box>
            )}
            <Flex direction="column" gap={3} flex="1" minW={0}>
              <Text
                color="white"
                fontWeight="700"
                fontSize={{ base: "lg", md: "xl" }}
                letterSpacing="0.03em"
                lineHeight="1.3"
              >
                {libro.titulo}
              </Text>
              <Box>
                <LeerButton href={libro.link} size="sm" />
              </Box>
            </Flex>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default function LibrosPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
          gap={{ base: 10, md: 12 }}
        >
          <LibrosHeader />
          <ApuntesBox items={apuntes} />
          <MisLibrosBox items={libros} />
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
