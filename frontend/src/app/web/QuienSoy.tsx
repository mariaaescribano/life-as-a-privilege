import {
  Box, Flex, Image, Link, SimpleGrid, Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Libro = { title: string; descripcion: string; img: string; link: string };
type Certificado = { img: string };

const GLOW     = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";
const GLOW_HV  = "0 8px 24px rgba(0,0,0,0.28), 0 0 32px rgba(107,196,200,1)";
const glassCard = {
  bg: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.35)",
  sx: { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" },
  borderRadius: "2xl",
  boxShadow: GLOW,
};

const libros: Libro[] = [
  { title: "Life as a Privilege",          descripcion: "Entiende al ser humano, al milagro de la naturaleza y al universo de manera holística.",            img: "/libros/img/book.png",   link: "/libros/pdfs/book.pdf"   },
  { title: "Chinese Medicine", descripcion: "Una recopilación completa y holística de esta medicina, tradición y ciencia.",                       img: "/libros/img/tcm.png",    link: "/libros/pdfs/tcm.pdf"    },
  { title: "The Kabbalah",                 descripcion: "Una recopilación del antiguo misticismo judío enfocado al crecimiento personal.",         img: "/libros/img/cabala.png", link: "/libros/pdfs/cabala.pdf" },
];

const certificados: Certificado[] = [
  { img: "/certificados/1.png"  }, { img: "/certificados/2.png"  }, { img: "/certificados/3.png"  },
  { img: "/certificados/4.png"  }, { img: "/certificados/5.png"  }, { img: "/certificados/6.png"  },
  { img: "/certificados/7.png"  }, { img: "/certificados/8.png"  }, { img: "/certificados/9.png"  },
  { img: "/certificados/10.png" }, { img: "/certificados/11.png" }, { img: "/certificados/12.png" },
  { img: "/certificados/13.png" }, { img: "/certificados/14.png" }, { img: "/certificados/15.png" },
  { img: "/certificados/16.png" },
];

const QuienSoy = () => {
  const navigate = useNavigate();
  const [img, setImg] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setImg(sessionStorage.getItem("img"));
  }, []);

  const closeLightbox = () => setLightboxIdx(null);
  const prevCert = () => setLightboxIdx(i => i !== null ? (i - 1 + certificados.length) % certificados.length : null);
  const nextCert = () => setLightboxIdx(i => i !== null ? (i + 1) % certificados.length : null);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
     <Flex
                  as="header"
                  align="center"
                  justify="space-between"
                  px={{ base: 5, md: 12 }}
                  py={{ base: 3, md: 4 }}
                  bg="#008080"
                  position="sticky"
                  top="0"
                  zIndex="100"
                  borderBottom="1px solid rgba(255,255,255,0.12)"
                >
                  <Image
                    src="/img/life.png"
                    h={{ base: "56px", md: "70px" }}
                    objectFit="contain"
                    cursor="pointer"
                    onClick={() => navigate("/")}
                    _hover={{ opacity: 0.85 }}
                    transition="opacity 0.2s"
                  />
          
                  <Flex align="center" gap={{ base: 3, md: 6 }}>
                    <Link
                      onClick={() => navigate("/logIn")}
                      color="white"
                      fontWeight="600"
                      fontSize={{ base: "md", md: "lg" }}
                      letterSpacing="0.03em"
                      textShadow="0 1px 4px rgba(0,80,70,0.5)"
                      _hover={{ color: "white", textDecoration: "none" }}
                      transition="color 0.2s"
                    >
                      Inicio de sesión
                    </Link>
          
                    <Box
                      as="button"
                      onClick={() => navigate("/signIn")}
                      color="white"
                      fontWeight="600"
                      fontSize={{ base: "md", md: "lg" }}
                      letterSpacing="0.04em"
                      px={{ base: 4, md: 6 }}
                      py={{ base: "8px", md: "10px" }}
                      borderRadius="full"
                      border="1.5px solid rgba(255,255,255,0.6)"
                      bg="rgba(255,255,255,0.12)"
                      cursor="pointer"
                      _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
                      transition="all 0.2s"
                    >
                      Registrarse
                    </Box>
                  </Flex>
                </Flex>

      {/* ── MAIN ── */}
      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          gap={{ base: 10, md: 14 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >

          {/* ── CARD 1: PRESENTACIÓN ── */}
          <Box
            w="100%"
            maxW="900px"
            {...glassCard}
            px={{ base: 7, md: 12 }}
            py={{ base: 8, md: 12 }}
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            alignItems="center"
            gap={{ base: 8, md: 10 }}
          >
            {/* Foto */}
            <Box
              flexShrink={0}
              w={{ base: "160px", md: "200px" }}
              h={{ base: "160px", md: "200px" }}
              borderRadius="full"
              overflow="hidden"
              border="4px solid rgba(255,255,255,0.75)"
              boxShadow="0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(107,196,200,0.9), 0 0 75px rgba(107,196,200,0.45)"
            >
              <Image src="/img/me3.jpg" alt="María Escribano" w="100%" h="100%" objectFit="cover" objectPosition="center 35%" sx={{ transform: "scale(1.18)", transformOrigin: "center 35%" }} />
            </Box>

            {/* Bio */}
            <Box flex="1" textAlign={{ base: "center", md: "left" }}>
              <Text
                color="white"
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight="700"
                letterSpacing="0.04em"
                textShadow="0 2px 10px rgba(0,100,90,0.5)"
                mb={2}
              >
                María Escribano
              </Text>
              <Text color="rgba(255,255,255,0.65)" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.08em" mb={4}>
                Comunicadora · Investigadora · Aprendiz
              </Text>
              <Text
                color="rgba(255,255,255,0.88)"
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight="1.9"
                letterSpacing="0.02em"
              >
                Busco conocer la Verdad profunda del ser humano que va más allá
                de cualquier religión, tradición o percepción. El conocimiento
                y la sabiduría pertenecen al pueblo y esta web tiene como
                propósito compartir aquello que me ha ayudado a crecer.
              </Text>
            </Box>
          </Box>

          {/* ── CARD 2: MIS LIBROS ── */}
          <Box w="100%" maxW="900px" {...glassCard} px={{ base: 6, md: 10 }} py={{ base: 8, md: 12 }}>
            {/* Título sección */}
            <Flex align="center" gap={3} justify="center" mb={{ base: 8, md: 10 }}>
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="34px" h="34px" fill="rgba(255,255,255,0.9)">
                <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z"/>
              </Box>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" letterSpacing="0.05em" textShadow="0 2px 10px rgba(0,100,90,0.4)">
                Mis Libros
              </Text>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
              {libros.map((libro, i) => (
                <Box
                  key={i}
                  borderRadius="2xl"
                  overflow="hidden"
                  bg="rgba(255,255,255,0.1)"
                  border="1px solid rgba(255,255,255,0.28)"
                  boxShadow={GLOW}
                  display="flex"
                  flexDirection="column"
                >
                  <Box overflow="hidden" h={{ base: "280px", md: "340px" }}>
                    <Image
                      src={libro.img}
                      alt={libro.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                  <Box p={5} flex="1" display="flex" flexDirection="column" gap={3}>
                    <Text color="white" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.03em">
                      {libro.title}
                    </Text>
                    <Text color="rgba(255,255,255,0.75)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" flex="1">
                      {libro.descripcion}
                    </Text>
                    <Box
                      as="a"
                      href={libro.link}
                      download
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                      px={5} py={2}
                      borderRadius="full"
                      border="2px solid rgba(255,255,255,0.55)"
                      color="white"
                      fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight="600"
                      bg="transparent"
                      letterSpacing="0.05em"
                      cursor="pointer"
                      _hover={{ bg: "rgba(255,255,255,0.18)", borderColor: "white" }}
                      transition="all 0.2s"
                    >
                      ↓ Descargar
                    </Box>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* ── CARD 3: MIS CERTIFICADOS ── */}
          <Box w="100%" maxW="900px" {...glassCard} px={{ base: 6, md: 10 }} py={{ base: 8, md: 12 }}>
            <Flex align="center" gap={3} justify="center" mb={{ base: 8, md: 10 }}>
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="34px" h="34px" fill="rgba(255,255,255,0.9)">
                <path d="M395-475q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm410-350q70-70 70-170t-70-170q-70-70-170-70t-170 70q-70 70-70 170t70 170q70 70 170 70t170-70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z"/>
              </Box>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" letterSpacing="0.05em" textShadow="0 2px 10px rgba(0,100,90,0.4)">
                Mis Certificados
              </Text>
            </Flex>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }}>
              {certificados.map((cert, i) => (
                <Box
                  key={i}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow={GLOW}
                  transition="all 0.25s"
                  _hover={{ transform: "translateY(-4px)", boxShadow: GLOW_HV }}
                  cursor="pointer"
                  onClick={() => setLightboxIdx(i)}
                >
                  <Image
                    src={cert.img}
                    alt={`Certificado ${i + 1}`}
                    w="100%"
                    h={{ base: "130px", md: "170px" }}
                    objectFit="cover"
                  />
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* ── CARD 4: CIERRE ── */}
          <Box
            w="100%"
            maxW="900px"
            {...glassCard}
            px={{ base: 8, md: 14 }}
            py={{ base: 8, md: 10 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="600"
              letterSpacing="0.06em"
              textShadow="0 2px 8px rgba(0,100,90,0.4)"
            >
              ♊︎ Esto es solo el principio...
            </Text>
          </Box>

        </Flex>
      </Box>

      {/* ── LIGHTBOX ── */}
      {lightboxIdx !== null && (
        <Box
          position="fixed"
          inset={0}
          zIndex={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0, 0, 0, 0.41)"
          sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={closeLightbox}
        >
          {/* X */}
          <Box
            position="absolute"
            top={4}
            right={5}
            as="button"
            onClick={closeLightbox}
            color="white"
            fontSize="2xl"
            fontWeight="300"
            cursor="pointer"
            bg="rgba(0,0,0,0.45)"
            borderRadius="full"
            w="44px"
            h="44px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            transition="background 0.2s"
            zIndex={201}
          >
            ✕
          </Box>

          {/* Prev */}
          <Box
            position="absolute"
            left={4}
            as="button"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); prevCert(); }}
            color="white"
            fontSize="4xl"
            cursor="pointer"
            bg="rgba(0,0,0,0.45)"
            borderRadius="full"
            w="52px"
            h="52px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            transition="background 0.2s"
            zIndex={201}
          >
            ‹
          </Box>

          {/* Image */}
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            maxW={{ base: "90vw", md: "70vw" }}
            maxH="85vh"
          >
            <Image
              src={certificados[lightboxIdx].img}
              alt={`Certificado ${lightboxIdx + 1}`}
              maxW="100%"
              maxH="85vh"
              objectFit="contain"
              borderRadius="xl"
              boxShadow="0 20px 60px rgba(0,0,0,0.6)"
            />
          </Box>

          {/* Next */}
          <Box
            position="absolute"
            right={4}
            as="button"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); nextCert(); }}
            color="white"
            fontSize="4xl"
            cursor="pointer"
            bg="rgba(0,0,0,0.45)"
            borderRadius="full"
            w="52px"
            h="52px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            transition="background 0.2s"
            zIndex={201}
          >
            ›
          </Box>
        </Box>
      )}

      {/* ── FOOTER ── */}
      <Box as="footer" borderTop="1px solid rgba(255,255,255,0.15)" px={{ base: 6, md: 16 }} py={{ base: 8, md: 10 }}>
        <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
};

export default QuienSoy;
