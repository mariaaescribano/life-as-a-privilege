import React, { useEffect, useState } from "react";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { CelulasOrganosIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import { celulas as CELULAS, type Celula } from "../../hardCoded/espacio/CelulasCuerpoData";

const BG = fisiologiaBg;
const TXT = fisiologiaTxt;

/* ─────────────────────────────────────────
   TARJETA DE CÉLULA
   Fondo = foto de Fisiología. Dentro: foto de la célula, una rallita
   elegante, el nombre y "Leer más →" abajo a la derecha.
───────────────────────────────────────── */
function CelulaCard({ celula, onClick }: { celula: Celula; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <Box
      as="button"
      onClick={onClick}
      textAlign="left"
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      border={`1px solid ${TXT}33`}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      boxShadow={`0 4px 18px rgba(0,0,0,0.22), 0 0 16px ${TXT}26`}
      transition="all 0.22s ease"
      _hover={{
        transform: "translateY(-4px)",
        borderColor: `${TXT}88`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 26px ${TXT}55`,
      }}
      _active={{ transform: "translateY(-1px)" }}
    >
      {/* Fondo: misma imagen que el header de Fisiología (sin velo) */}
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

      <Flex direction="column" position="relative" zIndex={1} p={{ base: 4, md: 5 }} gap={3} h="100%">
        {/* Foto de la célula — cuadrada 1:1 (como es la foto real) */}
        <Box
          borderRadius="lg"
          overflow="hidden"
          w="100%"
          aspectRatio={1}
          bg={`${TXT}14`}
          boxShadow="0 4px 16px rgba(0,0,0,0.28)"
          flexShrink={0}
        >
          {!imgErr ? (
            <Image
              src={encodeURI(celula.foto)}
              alt={celula.nombre}
              w="100%"
              h="100%"
              objectFit="cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <Flex w="100%" h="100%" align="center" justify="center">
              <Text fontSize="34px" opacity={0.35}>🔬</Text>
            </Flex>
          )}
        </Box>

        {/* Rallita separadora elegante */}
        <Box
          alignSelf="center"
          w="54px"
          h="1px"
          borderRadius="full"
          bgGradient={`linear(to-r, transparent, ${TXT}, transparent)`}
          my={1}
        />

        {/* Nombre */}
        <Text
          color={TXT}
          fontWeight="700"
          fontSize={{ base: "lg", md: "xl" }}
          textAlign="center"
          lineHeight="1.25"
          letterSpacing="0.02em"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.4)" }}
        >
          {celula.nombre}
        </Text>

        {/* Leer más → */}
        <Flex align="center" justify="flex-end" gap={1.5} mt="auto" pt={2} color={TXT}>
          <Text
            as="span"
            fontSize={{ base: "xs", md: "sm" }}
            fontStyle="italic"
            letterSpacing="0.08em"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          >
            Leer más
          </Text>
          <Box
            as="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            w="14px"
            h="14px"
            fill="currentColor"
          >
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

/* ─────────────────────────────────────────
   MODAL DE CÉLULA — nombre + foto + descripción
───────────────────────────────────────── */
function CelulaModal({ celula, onClose }: { celula: Celula; onClose: () => void }) {
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const scrollbarSx = {
    "&::-webkit-scrollbar": { width: "5px" },
    "&::-webkit-scrollbar-track": { bg: "transparent" },
    "&::-webkit-scrollbar-thumb": { bg: TXT + "55", borderRadius: "full" },
  };

  const Foto = ({ w }: { w: string }) => (
    <Box
      flexShrink={0}
      w={w}
      aspectRatio={1}
      alignSelf="center"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="0 8px 32px rgba(0,0,0,0.3)"
      bg={TXT + "12"}
    >
      {!imgErr ? (
        <Image src={encodeURI(celula.foto)} alt={celula.nombre} w="100%" h="100%" objectFit="cover" onError={() => setImgErr(true)} />
      ) : (
        <Flex w="100%" h="100%" align="center" justify="center">
          <Text fontSize="48px" opacity={0.3}>🔬</Text>
        </Flex>
      )}
    </Box>
  );

  const Seccion = ({ label, texto }: { label: string; texto: string }) => (
    <Box>
      <Text
        color={TXT}
        fontSize="xs"
        fontWeight="700"
        letterSpacing="0.18em"
        textTransform="uppercase"
        opacity={0.75}
        mb={1.5}
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
      >
        {label}
      </Text>
      <Text
        color={TXT}
        fontSize={{ base: "md", md: "lg" }}
        lineHeight="1.8"
        letterSpacing="0.02em"
        fontFamily="'EB Garamond', serif"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
      >
        {texto}
      </Text>
    </Box>
  );

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1000}
      bg="rgba(0,40,20,0.62)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        overflow="hidden"
        w={{ base: "95%", md: "920px" }}
        h={{ base: "auto", md: "380px" }}
        borderRadius="24px"
        border={`1px solid ${TXT}33`}
        boxShadow={`0 32px 80px rgba(0,0,0,0.5), 0 0 26px ${TXT}33`}
      >
        {/* Fondo: foto de Fisiología (velo oscuro suave, sin morado tan fuerte) */}
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="24px" overlay="rgba(20,12,30,0.4)" />

        {/* Botón cerrar */}
        <Box
          as="button"
          position="absolute"
          top="14px"
          right="14px"
          w="34px"
          h="34px"
          borderRadius="full"
          bg={TXT + "18"}
          border={`1px solid ${TXT}33`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={TXT}
          fontSize="16px"
          fontWeight="700"
          cursor="pointer"
          transition="all 0.18s"
          _hover={{ bg: TXT + "33" }}
          onClick={onClose}
          zIndex={2}
        >
          ✕
        </Box>

        {/* ── MÓVIL: título centrado → rallita → foto → textos. La caja crece
              según el texto (con tope de viewport y scroll si hace falta). ── */}
        <Flex
          display={{ base: "flex", md: "none" }}
          position="relative"
          zIndex={1}
          direction="column"
          align="center"
          p={5}
          pt={12}
          gap={3}
          maxH="calc(100dvh - 40px)"
          overflowY="auto"
          sx={scrollbarSx}
        >
          <Text
            color={TXT}
            fontSize="2xl"
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.03em"
            lineHeight="1.2"
            textAlign="center"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            {celula.nombre}
          </Text>

          {/* Mini rallita horizontal debajo del título */}
          <Box
            w="54px"
            h="1px"
            borderRadius="full"
            bgGradient={`linear(to-r, transparent, ${TXT}, transparent)`}
            my={1}
          />

          <Foto w="100%" />

          <Flex direction="column" gap={4} w="100%" mt={2}>
            <Seccion label="Descripción" texto={celula.descripcion} />
            {celula.cuidados && <Seccion label="Cómo cuidarla" texto={celula.cuidados} />}
          </Flex>
        </Flex>

        {/* ── ORDENADOR: foto fija a la izquierda, texto con scroll a la derecha ── */}
        <Flex
          display={{ base: "none", md: "flex" }}
          position="relative"
          zIndex={1}
          h="100%"
          direction="row"
          p={7}
        >
          <Foto w="300px" />

          {/* Rallita vertical entre foto y texto */}
          <Box
            flexShrink={0}
            alignSelf="center"
            w="1px"
            h="76%"
            borderRadius="full"
            bgGradient={`linear(to-b, transparent, ${TXT}, transparent)`}
            mx={6}
          />

          <Flex direction="column" flex="1" minW={0} minH={0}>
            <Text
              color={TXT}
              fontSize="3xl"
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.03em"
              lineHeight="1.2"
              flexShrink={0}
              mb={4}
              pr="40px"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
            >
              {celula.nombre}
            </Text>

            {/* Solo el texto hace scroll (la foto no se mueve) */}
            <Flex direction="column" gap={4} flex="1" minH={0} overflowY="auto" pr={2} sx={scrollbarSx}>
              <Seccion label="Descripción" texto={celula.descripcion} />
              {celula.cuidados && <Seccion label="Cómo cuidarla" texto={celula.cuidados} />}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────
   PÁGINA — "Tus células"
───────────────────────────────────────── */
export default function CelulasCuerpoPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Celula | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
          gap={{ base: 6, md: 8 }}
        >
          <MetodoStepHeader
            icon={<CelulasOrganosIcon size={{ base: "40px", md: "56px" }} />}
            title="Tus células"
            bgColor={`${BG}dd`}
            color={TXT}
            nom={fisiologiaNom}
            mb={{ base: 2, md: 4 }}
            prev={{ label: "← Volver", onClick: () => navigate("/aprendizaje/cursos/" + fisiologiaNom) }}
          />

          {/* Rejilla plana: 4 en ordenador, 1 en móvil */}
          <SimpleGrid
            w="100%"
            maxW="1200px"
            columns={{ base: 1, sm: 2, md: 4 }}
            spacing={{ base: 5, md: 6 }}
          >
            {CELULAS.map((celula) => (
              <CelulaCard
                key={celula.id}
                celula={celula}
                onClick={() => setSelected(celula)}
              />
            ))}
          </SimpleGrid>
        </Flex>
      </Box>

      <SiteFooter />

      {selected && <CelulaModal celula={selected} onClose={() => setSelected(null)} />}
    </Box>
  );
}
