import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { AvisoInicialModal } from "../../components/metodo/AvisoInicialModal";
import axios from "axios";
import {
  API_URL,
  astrologiaBg, AstrologiaIcon, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaTxt,
  cabalaBg, CabalaIcon, cabalaTxt,
  culturaBg, CulturaIcon, culturaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionTxt,
  tcmBg, TCMIcon, tcmTxt,
} from "../../GlobalVariables";

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.2); }
  to   { opacity: 1; transform: scale(1); }
`;

// Orden del Método: Astrología → Psicología → Hinduismo → TCM →
// Fisiología → Nutrición → Cultura → Cábala
const disciplines = [
  { bg: astrologiaBg,      txt: astrologiaTxt,      Icon: AstrologiaIcon },
  { bg: neuropsicologiaBg, txt: neuropsicologiaTxt, Icon: NeuropsicologiaIcon },
  { bg: ayurvedaBg,        txt: ayurvedaTxt,        Icon: AyurvedaIcon },
  { bg: tcmBg,             txt: tcmTxt,             Icon: TCMIcon },
  { bg: fisiologiaBg,      txt: fisiologiaTxt,      Icon: FisiologiaIcon },
  { bg: nutricionBg,       txt: nutricionTxt,       Icon: NutricionIcon },
  { bg: culturaBg,         txt: culturaTxt,         Icon: CulturaIcon },
  { bg: cabalaBg,          txt: cabalaTxt,          Icon: CabalaIcon },
];

const Home = () => {
  const navigate = useNavigate();

  const [img, setImg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState<string>("");
  const [avisoOpen, setAvisoOpen] = useState(false);

  const irAstrologia = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      navigate("/welcome");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.aviso_visto) {
        navigate("/metodo/astrologia");
      } else {
        setAvisoOpen(true);
      }
    } catch {
      // Si la BD falla, mostramos el aviso (camino seguro)
      setAvisoOpen(true);
    }
  };

  const confirmarAviso = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    setAvisoOpen(false);
    if (userId && token) {
      try {
        await axios.patch(
          `${API_URL}/metodo-astrologia/${userId}`,
          { aviso_visto: true },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch {
        // Silencioso: el flag se persistirá la próxima vez si BD vuelve
      }
    }
    navigate("/metodo/astrologia");
  };

  const radius        = useBreakpointValue({ base: 130, sm: 165, md: 220, lg: 280, xl: 320 });
  const containerSize = useBreakpointValue({ base: "340px", sm: "420px", md: "560px", lg: "700px", xl: "800px" });
  const centerSize    = useBreakpointValue({ base: "130px", md: "180px", lg: "220px", xl: "260px" });
  const circleSize    = useBreakpointValue({ base: "80px", md: "108px", lg: "130px" });
  const iconSize      = useBreakpointValue({ base: "44px", md: "60px", lg: "72px" });
  const numberSize    = useBreakpointValue({ base: "26px", md: "32px", lg: "38px" });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }
    if (img == null) {
      const stored = sessionStorage.getItem("img");
      setImg(stored);
    }
    setName(sessionStorage.getItem("name") || "");
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const userId = sessionStorage.getItem("userId");
    const token  = sessionStorage.getItem("token");
    if (!userId || !token) {
      navigate("/");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("userId", userId);
      const res  = await fetch(`${API_URL}/upload/profile-pic`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        const freshUrl = `${data.url}?v=${Date.now()}`;
        sessionStorage.setItem("img", freshUrl);
        setImg(freshUrl);
      }
    } finally {
      setUploading(false);
    }
  };

  const angleStep = (2 * Math.PI) / disciplines.length;

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="private" userImg={img ?? undefined} />

      <Box flex="1" display="flex" alignItems="center" justifyContent="center">
        {img != null ? (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            py={{ base: 8, md: 10 }}
            px={{ base: 5, md: 10 }}
            w="100%"
          >
            {/* ── SALUDO ── */}
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="700"
              letterSpacing="0.05em"
              textAlign="center"
              lineHeight="1.15"
              textShadow="0 2px 14px rgba(0,80,70,0.45)"
              mb={3}
            >
              Te damos la bienvenida{name ? `, ${name}` : ""}
            </Text>
            <Text
              color="rgba(255,255,255,0.88)"
              fontSize={{ base: "lg", md: "2xl" }}
              fontStyle="italic"
              textAlign="center"
              letterSpacing="0.04em"
              textShadow="0 1px 8px rgba(0,60,50,0.35)"
              mb={{ base: 6, md: 8 }}
            >
              Este es el camino de vuelta a ti.
            </Text>

            {/* ── BOX INFORMATIVO ── */}
            <Box
              w={{ base: "100%", md: "78%", lg: "64%" }}
              bg="rgba(255,255,255,0.14)"
              border="1px solid rgba(255,255,255,0.35)"
              sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
              borderRadius="2xl"
              boxShadow="0 8px 36px rgba(107,196,200,0.4)"
              px={{ base: 6, md: 8 }}
              py={{ base: 5, md: 6 }}
              mb={{ base: 10, md: 12 }}
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center"
              gap={{ base: 4, md: 6 }}
            >
              <Box
                flexShrink={0}
                w={{ base: "62px", md: "72px" }}
                h={{ base: "62px", md: "72px" }}
                borderRadius="full"
                bg="rgba(255,255,255,0.2)"
                border="1px solid rgba(255,255,255,0.4)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
              >
                <Image
                  src="/img/icono/life.png"
                  alt="Life as a Privilege"
                  w="100%"
                  h="100%"
                  objectFit="contain"
                  filter="drop-shadow(0 2px 8px rgba(255,255,255,0.35))"
                />
              </Box>
              <Text
                color="rgba(255,255,255,0.92)"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.7"
                letterSpacing="0.015em"
                textAlign={{ base: "center", md: "left" }}
                flex="1"
              >
                Las modalidades se irán abriendo una a una a medida que recorras el camino.
              </Text>
            </Box>

            {/* Mandala */}
            <Box
              position="relative"
              w={containerSize}
              h={containerSize}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "url('/img/icono/life.png')",
                  backgroundSize: "100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  opacity: 0.1,
                  zIndex: 0,
                },
              }}
            >
              {/* Centro: foto del usuario, clic para cambiarla */}
              <Box
                position="absolute"
                w={centerSize}
                h={centerSize}
                borderRadius="full"
                overflow="hidden"
                boxShadow="0 8px 32px rgba(0,0,0,0.4), 0 0 50px rgba(107,196,200,1), 0 0 100px rgba(107,196,200,0.55)"
                border="2px solid rgba(255,255,255,0.85)"
                zIndex={10}
              >
                <Image src={img} alt="Tu foto" w="100%" h="100%" objectFit="cover" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%",
                    opacity: 0, cursor: "pointer",
                  }}
                />
                {uploading && (
                  <Box
                    position="absolute"
                    top={0} left={0}
                    w="100%" h="100%"
                    bg="rgba(0,0,0,0.55)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={20}
                  >
                    <SpinnerTurquesa fullScreen={false} size={44} thickness={4} />
                  </Box>
                )}
              </Box>

              {/* Disciplinas alrededor — solo Astrología abierta */}
              {disciplines.map((d, index) => {
                const angle = angleStep * index - Math.PI / 2;
                const x = Math.cos(angle) * (radius ?? 200);
                const y = Math.sin(angle) * (radius ?? 200);
                const delay = `${index * 0.18}s`;
                const number = index + 1;
                const Icon = d.Icon;
                // Astrología tiene txt muy claro → usar bg para el badge solo en ese caso.
                const badgeColor = d.bg === astrologiaBg ? d.bg : d.txt;
                const abierta = index === 0; // Astrología
                return (
                  <Box
                    key={index}
                    position="absolute"
                    transform={`translate(${x}px, ${y}px)`}
                    w={circleSize}
                    h={circleSize}
                  >
                    <Box
                      onClick={abierta ? irAstrologia : undefined}
                      cursor={abierta ? "pointer" : "not-allowed"}
                      w="100%"
                      h="100%"
                      borderRadius="full"
                      overflow="visible"
                      position="relative"
                      opacity={abierta ? 1 : 0.45}
                      animation={`${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay} both`}
                      filter={abierta ? "none" : "grayscale(0.25)"}
                      transition="transform 0.2s ease, filter 0.2s ease"
                      _hover={abierta ? { transform: "scale(1.06)" } : undefined}
                    >
                      {/* Círculo principal con icono */}
                      <Box
                        w="100%"
                        h="100%"
                        borderRadius="full"
                        overflow="hidden"
                        border={`4px solid ${d.txt}`}
                        boxShadow={`
                          0 0 50px ${d.txt}77,
                          0 2px 30px ${d.txt}55
                        `}
                        bg={d.bg}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon size={{ base: iconSize, md: iconSize }} />
                      </Box>

                      {/* Badge con número */}
                      <Box
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        w={numberSize}
                        h={numberSize}
                        borderRadius="full"
                        bg="white"
                        border={`2px solid ${badgeColor}`}
                        boxShadow={`0 2px 10px ${badgeColor}88, 0 4px 14px rgba(0,0,0,0.25)`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        opacity={1}
                      >
                        <Text
                          color={badgeColor}
                          fontSize={{ base: "sm", md: "md", lg: "lg" }}
                          fontWeight="800"
                          fontFamily="'EB Garamond', serif"
                          lineHeight="1"
                        >
                          {number}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Aviso bajo el mandala */}
            <Text
              mt={{ base: 8, md: 10 }}
              color="rgba(255,255,255,0.8)"
              fontSize={{ base: "md", md: "lg" }}
              textAlign="center"
              fontStyle="italic"
              letterSpacing="0.04em"
              maxW="640px"
              px={6}
              style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}
            >
              Tu camino comenzará pronto. Las disciplinas se irán abriendo en orden a medida que avances en el Método.
            </Text>
          </Flex>
        ) : (
          <SpinnerTurquesa />
        )}
      </Box>

      <SiteFooter />

      <AvisoInicialModal isOpen={avisoOpen} onConfirm={confirmarAviso} />
    </Box>
  );
};

export default Home;
