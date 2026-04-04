import React, { useEffect, useState } from "react";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Brain, Heart, Shield, Droplets, Droplet, Layers, Activity,
  Circle, Moon, Sun,
} from "lucide-react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { DisciplineHeader } from "../../components/global/DisciplineHeader";
import { FisiologiaIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import { celulasCuerpoData, type Celula, type SistemaOrgano } from "../../hardCoded/espacio/CelulasCuerpoData";

const BG  = fisiologiaBg;
const TXT = fisiologiaTxt;

const ICON_SIZE_CARD  = 22;
const ICON_SIZE_MODAL = 26;

const ICON_MAP = (size: number): Record<string, React.ReactNode> => ({
  layers:   <Layers   size={size} />,
  bone:     <Activity size={size} />,
  activity: <Activity size={size} />,
  droplets: <Droplets size={size} />,
  droplet:  <Droplet  size={size} />,
  heart:    <Heart    size={size} />,
  circle:   <Circle   size={size} />,
  shield:   <Shield   size={size} />,
  brain:    <Brain    size={size} />,
  moon:     <Moon     size={size} />,
  sun:      <Sun      size={size} />,
});

/* ─────────────────────────────────────────
   CARD DE CÉLULA
───────────────────────────────────────── */
function CelulaCard({ celula, onClick }: { celula: Celula; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <Box
      cursor="pointer"
      onClick={onClick}
      borderRadius="xl"
      overflow="hidden"
      position="relative"
      h={{ base: "130px", md: "150px" }}
      boxShadow={`0 4px 16px rgba(0,0,0,0.22), 0 0 14px ${TXT}33`}
      border={`1px solid ${TXT}22`}
      transition="all 0.22s ease"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: `0 8px 28px rgba(0,0,0,0.3), 0 0 22px ${TXT}55`,
      }}
    >
      {/* Foto */}
      {!imgErr ? (
        <Image
          src={celula.foto}
          alt={celula.nombre}
          w="100%"
          h="100%"
          objectFit="cover"
          onError={() => setImgErr(true)}
        />
      ) : (
        <Box
          w="100%"
          h="100%"
          bg={TXT + "14"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="28px" opacity={0.35}>🔬</Text>
        </Box>
      )}

      {/* Nombre sobre la foto — gradiente desde abajo */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        background="linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 75%, transparent 100%)"
        px={3}
        pt={6}
        pb={{ base: "8px", md: "10px" }}
      >
        <Text
          color="white"
          fontWeight="700"
          fontSize={{ base: "xs", md: "sm" }}
          textAlign="center"
          lineHeight="1.25"
          letterSpacing="0.03em"
          fontFamily="'EB Garamond', serif"
          style={{ textShadow: "0 1px 5px rgba(0,0,0,0.9)" }}
        >
          {celula.nombre}
        </Text>
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────
   MODAL DE CÉLULA
───────────────────────────────────────── */
function CelulaModal({
  celula,
  sistema,
  onClose,
}: {
  celula: Celula;
  sistema: SistemaOrgano;
  onClose: () => void;
}) {
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

  const iconModal = ICON_MAP(ICON_SIZE_MODAL)[sistema.iconKey];

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
        w={{ base: "95%", md: "500px" }}
        maxH={{ base: "88vh", md: "85vh" }}
        overflowY="auto"
        borderRadius="24px"
        bg={BG}
        boxShadow={`0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${TXT}22`}
        sx={{
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { bg: "transparent" },
          "&::-webkit-scrollbar-thumb": { bg: TXT + "55", borderRadius: "full" },
        }}
      >
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

        <Box px={{ base: 6, md: 8 }} pt={8} pb={8}>
          {/* Título: icono + nombre */}
          <Flex align="center" gap={3} mb={5}>
            <Box
              color={TXT}
              bg={TXT + "18"}
              borderRadius="full"
              w={{ base: "44px", md: "52px" }}
              h={{ base: "44px", md: "52px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              border={`2px solid ${TXT}44`}
              flexShrink={0}
            >
              {iconModal}
            </Box>
            <Text
              color={TXT}
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.03em"
              lineHeight="1.2"
            >
              {celula.nombre}
            </Text>
          </Flex>

          {/* Foto */}
          <Box
            borderRadius="xl"
            overflow="hidden"
            mb={5}
            boxShadow="0 8px 32px rgba(0,0,0,0.3)"
            h={{ base: "200px", md: "230px" }}
            bg={TXT + "12"}
          >
            {!imgErr ? (
              <Image
                src={celula.foto}
                alt={celula.nombre}
                w="100%"
                h="100%"
                objectFit="cover"
                onError={() => setImgErr(true)}
              />
            ) : (
              <Box
                w="100%"
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="48px" opacity={0.3}>🔬</Text>
              </Box>
            )}
          </Box>

          {/* Descripción */}
          <Box
            bg={TXT + "0e"}
            border={`1px solid ${TXT}28`}
            borderRadius="xl"
            px={{ base: 4, md: 5 }}
            py={{ base: 4, md: 5 }}
            boxShadow="inset 0 2px 8px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.06)"
          >
            <Text
              color={TXT}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.85"
              letterSpacing="0.02em"
              fontFamily="'EB Garamond', serif"
              opacity={0.9}
            >
              {celula.descripcion}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────
   PÁGINA PRINCIPAL
───────────────────────────────────────── */
type Selected = { celula: Celula; sistema: SistemaOrgano };

export default function CelulasCuerpoPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Selected | null>(null);

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
          gap={{ base: 6, md: 8 }}
        >
          <DisciplineHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "50px" }} />}
            title={fisiologiaNom}
            subtitle="Las células de tu cuerpo"
            bgColor={BG}
            color={TXT}
            onIconClick={() => navigate("/aprendizaje/cursosModalidad/" + fisiologiaNom)}
          />

          {celulasCuerpoData.map((sistema) => {
            const iconCard = ICON_MAP(ICON_SIZE_CARD)[sistema.iconKey];
            return (
              <Box
                key={sistema.id}
                w="100%"
                maxW="900px"
                bg={BG}
                borderRadius="2xl"
                px={{ base: 5, md: 8 }}
                py={{ base: 5, md: 7 }}
                boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
              >
                {/* Cabecera del sistema */}
                <Flex align="center" gap={3} mb={{ base: 4, md: 5 }}>
                  <Box
                    color={TXT}
                    bg={TXT + "18"}
                    borderRadius="full"
                    w={{ base: "40px", md: "46px" }}
                    h={{ base: "40px", md: "46px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border={`2px solid ${TXT}44`}
                    flexShrink={0}
                  >
                    {iconCard}
                  </Box>
                  <Text
                    color={TXT}
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="700"
                    letterSpacing="0.04em"
                    fontFamily="'EB Garamond', serif"
                  >
                    {sistema.nombre}
                  </Text>
                </Flex>

                {/* Grid de células — 3 por fila */}
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3 }}
                  gap={{ base: 3, md: 4 }}
                >
                  {sistema.celulas.map((celula) => (
                    <CelulaCard
                      key={celula.id}
                      celula={celula}
                      onClick={() => setSelected({ celula, sistema })}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            );
          })}
        </Flex>
      </Box>

      <SiteFooter />

      {selected && (
        <CelulaModal
          celula={selected.celula}
          sistema={selected.sistema}
          onClose={() => setSelected(null)}
        />
      )}
    </Box>
  );
}
