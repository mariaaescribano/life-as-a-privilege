import React, { useEffect, useState } from "react";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { productos } from "../../data/productos";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";

const FlowerIcon = ({ size = "48px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="rgba(255,255,255,0.92)">
    <path d="M480-200q0-100-70-170t-170-70q0 100 70 170t170 70Zm44-220q18-18 18-44v-6q8 6 16.5 9t19.5 3q26 0 44-18t18-44q0-20-9.5-35T604-576q17-6 26.5-21t9.5-35q0-26-18-44t-44-18q-11 0-19.5 3t-16.5 9v-6q0-26-18-44t-44-18q-26 0-44 18t-18 44v6q-8-6-16.5-9t-19.5-3q-26 0-44 18t-18 44q0 20 9.5 35t26.5 21q-17 6-26.5 21t-9.5 35q0 26 18 44t44 18q11 0 19.5-3t16.5-9v6q0 26 18 44t44 18q26 0 44-18Zm-88-111.5Q418-549 418-576q0-26 18-44t44-18q26 0 44 18t18 44q0 27-18 44.5T480-514q-26 0-44-17.5ZM480-200q100 0 170-70t70-170q-100 0-170 70t-70 170ZM160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Zm0-80h640v-640H160v640Zm0 0v-640 640Z"/>
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px"
    fill={filled ? "#ff6b8a" : "rgba(255,255,255,0.75)"}>
    {filled
      ? <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
      : <path d="M480-120 422-172q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
    }
  </svg>
);

const glassCard = {
  bg: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.38)",
  sx: { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" },
  borderRadius: "2xl",
  boxShadow: "0 8px 40px rgba(107,196,200,0.45)",
};

const Productos = () => {
  const navigate = useNavigate();
  const isRegistered = !!sessionStorage.getItem("userId");
  const [favoritos, setFavoritos] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("favoritos") || "[]")); }
    catch { return new Set(); }
  });

  const toggleFavorito = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoritos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("favoritos", JSON.stringify([...next]));
      return next;
    });
  };

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
      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />

      {/* ── MAIN ── */}
      <Box flex="1">
        <Flex
          direction="column"
          gap={{ base: 10, md: 14 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >

          {/* ── TÍTULO (fuera de card) ── */}
          <Flex align="center" gap={4} justify="center">
            <FlowerIcon size="44px" />
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "2xl", lg: "4xl" }}
              fontWeight="700"
              letterSpacing="0.06em"
              textShadow="0 2px 10px rgba(0,100,90,0.4)"
              lineHeight="1.1"
            >
              Productos Naturales
            </Text>
          </Flex>

          {/* ── CARD DESCRIPCIÓN ── */}
          <Box
            {...glassCard}
            px={{ base: 8, md: 16 }}
            py={{ base: 8, md: 10 }}
            textAlign="center"
          >
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "lg", md: "xl" }}
              fontStyle="italic"
              lineHeight="1.95"
              letterSpacing="0.03em"
            >
              Cada producto nace de un proceso artesanal, con ingredientes seleccionados por su pureza y su poder sanador.
              Porque cuidarse es un acto de Amor propio, y mereces lo mejor que la madre tierra tiene para ofrecerte.
            </Text>
          </Box>

          {/* ── TARJETAS DE PRODUCTOS ── */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
            {productos.map((p, i) => (
              <Box
                key={i}
                {...glassCard}
                overflow="hidden"
                display="flex"
                flexDirection="column"
                position="relative"
                transition="transform 0.22s ease, box-shadow 0.22s ease"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 18px 50px rgba(107,196,200,0.65)",
                }}
              >
                {/* Corazón favorito — solo si está registrado */}
                {isRegistered && (
                  <Box
                    as="button"
                    position="absolute"
                    top={3}
                    right={3}
                    zIndex={2}
                    w="36px"
                    h="36px"
                    borderRadius="full"
                    bg={favoritos.has(p.id) ? "rgba(255,107,138,0.18)" : "rgba(0,0,0,0.25)"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    border={favoritos.has(p.id) ? "1.5px solid rgba(255,107,138,0.6)" : "1.5px solid rgba(255,255,255,0.25)"}
                    _hover={{ bg: favoritos.has(p.id) ? "rgba(255,107,138,0.3)" : "rgba(255,255,255,0.15)" }}
                    transition="all 0.18s"
                    onClick={(e: React.MouseEvent) => toggleFavorito(p.id, e)}
                    title={favoritos.has(p.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                  >
                    <HeartIcon filled={favoritos.has(p.id)} />
                  </Box>
                )}

                {/* Imagen — solo si el producto tiene alguna. Sin este guardado,
                    un producto sin fotos pintaba el icono de «imagen rota». */}
                {p.imgs[0] && (
                  <Box h={{ base: "220px", md: "240px" }} overflow="hidden" flexShrink={0}>
                    <Image
                      src={p.imgs[0]}
                      alt={p.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      objectPosition="center"
                      transition="transform 0.35s ease"
                      _groupHover={{ transform: "scale(1.04)" }}
                    />
                  </Box>
                )}

                {/* Contenido */}
                <Box
                  p={{ base: 5, md: 6 }}
                  flex="1"
                  display="flex"
                  flexDirection="column"
                  gap={3}
                >
                  <Text
                    color="white"
                    fontWeight="700"
                    fontSize={{ base: "xl", md: "2xl" }}
                    letterSpacing="0.03em"
                    lineHeight="1.2"
                  >
                    {p.title}
                  </Text>

                  <Text
                    color="rgba(255,255,255,0.75)"
                    fontSize={{ base: "md", md: "lg" }}
                    fontFamily="'EB Garamond', serif"
                    lineHeight="1.75"
                    flex="1"
                  >
                    {p.desc}
                  </Text>

                  <Flex justify="flex-end">
                    <Box
                      as="button"
                      onClick={() => navigate(`/productos/${p.id}`)}
                      color="white"
                      fontFamily="'EB Garamond', serif"
                      fontWeight="600"
                      fontSize={{ base: "sm", md: "md" }}
                      letterSpacing="0.07em"
                      px={5}
                      py="8px"
                      borderRadius="full"
                      border="1.5px solid rgba(255,255,255,0.5)"
                      bg="rgba(255,255,255,0.1)"
                      cursor="pointer"
                      _hover={{ bg: "rgba(255,255,255,0.22)", borderColor: "white" }}
                      transition="all 0.2s"
                    >
                      Ver más →
                    </Box>
                  </Flex>
                </Box>
              </Box>
            ))}
          </SimpleGrid>

        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
};

export default Productos;
