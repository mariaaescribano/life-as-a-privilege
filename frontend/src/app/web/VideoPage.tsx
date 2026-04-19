import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { videos, type Video } from "../../hardCoded/videos/videos";

const VideosIcon = ({ size = "28px", color = "currentColor" }: { size?: string; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color}>
    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z"/>
  </svg>
);

const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";
const BG = "rgba(255,255,255,0.22)";
const COLOR = "white";
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default function VideoPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [datos, setDatos] = useState<Video | null>(null);
  const [speed, setSpeed] = useState(() => {
    const s = parseFloat(sessionStorage.getItem("videoSpeed") ?? "1");
    return isNaN(s) ? 1 : s;
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (videoId) {
      setDatos(videos.find((v) => v.id === videoId) ?? null);
    }
  }, [videoId]);

  useEffect(() => {
    const applySpeed = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "setPlaybackRate", args: [speed] }),
        "*"
      );
    };
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "onReady" || (data.event === "onStateChange" && data.info === 1)) {
          applySpeed();
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [datos, speed]);

  const changeSpeed = (rate: number) => {
    setSpeed(rate);
    sessionStorage.setItem("videoSpeed", String(rate));
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "setPlaybackRate", args: [rate] }),
      "*"
    );
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {datos && (
        <Box flex="1">
          <Flex
            direction="column"
            alignItems="center"
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 10, md: 14 }}
            pb={{ base: 14, md: 20 }}
          >
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
              mb={{ base: 8, md: 10 }}
            >
              <Flex direction="row" align="center" justify="center" gap={4}>
                <Box
                  as="button"
                  onClick={() => navigate("/videos")}
                  borderRadius="full"
                  bg="rgba(255,255,255,0.18)"
                  border="4px solid rgba(255,255,255,0.7)"
                  boxShadow="0 0 22px rgba(255,255,255,0.45), 0 0 55px rgba(107,196,200,0.25)"
                  w={{ base: "44px", md: "54px" }}
                  h={{ base: "44px", md: "54px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  overflow="hidden"
                  p="4px"
                  cursor="pointer"
                  _hover={{ opacity: 0.75, transform: "scale(1.05)" }}
                  transition="all 0.2s"
                  aria-label="Volver a Vídeos"
                >
                  <VideosIcon color="white" size="28px" />
                </Box>
                <Text
                  color="white"
                  fontSize={{ base: "xl", md: "3xl" }}
                  fontWeight="700"
                  letterSpacing="0.05em"
                  filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
                  lineHeight="1.15"
                >
                  {datos.titulo}
                </Text>
              </Flex>
            </Box>

            {/* iframe */}
            <Box
              w="100%"
              maxW={{ base: "100%", md: "85%", xl: "75%" }}
              aspectRatio={16 / 9}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={GLOW}
              mb={{ base: 4, md: 8 }}
            >
              <iframe
                key={datos.video}
                ref={iframeRef}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={`https://www.youtube.com/embed/${datos.video}?enablejsapi=1`}
                title="YouTube video player"
                allowFullScreen
                onLoad={() => {
                  iframeRef.current?.contentWindow?.postMessage(
                    JSON.stringify({ event: "listening" }),
                    "*"
                  );
                }}
              />
            </Box>

            {/* Velocidad */}
            <Flex
              alignSelf="center"
              gap={1}
              mb={{ base: 4, md: 6 }}
              bg="rgba(0,0,0,0.45)"
              borderRadius="full"
              px={3} py="6px"
              border="1px solid rgba(255,255,255,0.18)"
            >
              {SPEEDS.map((rate) => (
                <Box
                  key={rate}
                  as="button"
                  onClick={() => changeSpeed(rate)}
                  px="10px" py="4px"
                  borderRadius="full"
                  fontSize={{ base: "12px", md: "13px" }}
                  fontWeight="700"
                  letterSpacing="0.04em"
                  cursor="pointer"
                  color={speed === rate ? "#1a1a1a" : "rgba(255,255,255,0.80)"}
                  bg={speed === rate ? "white" : "transparent"}
                  transition="all 0.18s ease"
                  _hover={{ color: speed === rate ? "#1a1a1a" : "white", bg: speed === rate ? "white" : "rgba(255,255,255,0.12)" }}
                >
                  {rate === 1 ? "1×" : `${rate}×`}
                </Box>
              ))}
            </Flex>

            {/* Descripción */}
            <Box
              maxW="800px"
              w="100%"
              textAlign="center"
              bg={BG}
              border={`1px solid ${COLOR}44`}
              borderRadius="2xl"
              px={{ base: 6, md: 10 }}
              boxShadow={GLOW}
              py={{ base: 4, md: 6 }}
              mb={{ base: 6, md: 8 }}
            >
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={COLOR}
                lineHeight="1.8"
                fontStyle="italic"
                letterSpacing="0.02em"
              >
                {datos.descripcion}
              </Text>
            </Box>

            <SubscribeBox />
          </Flex>
        </Box>
      )}

      <SiteFooter />
    </Box>
  );
}
