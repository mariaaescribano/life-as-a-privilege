import React, { useEffect } from "react";
import { Box, Flex, Text, Image, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { videos, type Video } from "../../hardCoded/videos/videos";

const VideosIcon = ({ size = "44px", color = "currentColor" }: { size?: string; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color}>
    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z"/>
  </svg>
);

function VideosHeader() {
  return (
    <Box
      bg="rgba(255,255,255,0.22)"
      border="1px solid rgba(255,255,255,0.45)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      borderRadius="2xl"
      boxShadow="0 8px 36px rgba(107,196,200,0.45)"
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
          color="white"
          style={{ filter: "drop-shadow(1px 1px 3px rgba(0,0,0,0.25))" }}
        >
          <VideosIcon color="white" size="44px" />
        </Box>
        <Box>
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "5xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
            lineHeight="1.15"
          >
            Vídeos
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

interface VideoCardProps {
  video: Video;
}

function VideoCard({ video }: VideoCardProps) {
  const navigate = useNavigate();

  const handleVer = () => {
    navigate(`/videos/${video.id}`);
  };

  return (
    <Flex
      bg="rgba(255,255,255,0.22)"
      border="1px solid rgba(255,255,255,0.45)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      borderRadius="2xl"
      boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
      direction="column"
      p={{ base: 5, md: 6 }}
      gap={3}
      h="100%"
    >
      {/* Título arriba a la izquierda — altura fija de 2 líneas para alinear fotos */}
      <Text
        color="white"
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="700"
        letterSpacing="0.04em"
        lineHeight="1.2"
        filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
        alignSelf="flex-start"
        mb={{ base: 3, md: 4 }}
        noOfLines={2}
        minH={{ base: "calc(2 * 1.2 * 1.25rem)", md: "calc(2 * 1.2 * 1.5rem)" }}
        w="100%"
      >
        {video.titulo}
      </Text>

      {/* Foto — aspect ratio fijo 16/9 para que todas ocupen lo mismo */}
      <Box
        borderRadius="xl"
        overflow="hidden"
        boxShadow="0 8px 32px rgba(107,196,200,0.55), 0 3px 14px rgba(107,196,200,0.33)"
        aspectRatio={16 / 9}
        w="100%"
      >
        <Image
          src={video.foto}
          alt={video.titulo}
          w="100%"
          h="100%"
          display="block"
          objectFit="cover"
        />
      </Box>

      {/* Botón abajo a la derecha */}
      <Flex justify="flex-end" mt="auto">
        <Box
          as="button"
          onClick={handleVer}
          color="#008080"
          bg="white"
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize="md"
          letterSpacing="0.08em"
          w="40px"
          h="40px"
          borderRadius="full"
          cursor="pointer"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
          transition="all 0.2s"
          boxShadow="0 4px 16px rgba(255,255,255,0.44)"
          aria-label="Ver vídeo"
        >
          ▶
        </Box>
      </Flex>
    </Flex>
  );
}

export default function VideosPage() {
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
          <VideosHeader />

          <SimpleGrid
            w="100%"
            maxW="850px"
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 5, md: 6 }}
            sx={{
              "@keyframes videoCardIn": {
                from: { opacity: 0, transform: "translateY(40px) scale(0.97)" },
                to: { opacity: 1, transform: "translateY(0) scale(1)" },
              },
            }}
          >
            {videos.map((video, i) => (
              <Box
                key={video.id}
                h="100%"
                style={{
                  opacity: 0,
                  animation: `videoCardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s forwards`,
                }}
              >
                <VideoCard video={video} />
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
