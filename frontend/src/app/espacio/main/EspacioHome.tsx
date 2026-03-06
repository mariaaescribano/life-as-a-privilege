import { Box, Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import SiteHeader from "../../../components/global/SiteHeader";
import React, { useEffect, useState } from "react";
import {
  API_URL,
  astrologiaBg, AstrologiaIcon, astrologiaNom,
  astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom,
  ayurvedaTxt,
  fitoterapiaBg, FitoterapiaIcon, fitoterapiaNom,
  fitoterapiaTxt,
  cabalaBg, CabalaIcon, cabalaNom,
  cabalaTxt,
  EspacioPersonalIcon,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom,
  fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom,
  neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom,
  nutricionTxt,
  tcmBg, TCMIcon,
  tcmNomLink,
  tcmTxt,
} from "../../../GlobalVariables";
import { useNavigate } from "react-router-dom";
import SpinnerTurquesa from "../../../components/global/Spinner";

const EspacioHome = () => {
  const navigate = useNavigate();

  const photos = [
    { bg: fisiologiaBg,      icon: <FisiologiaIcon size="58px" />,                              link: "/espacio/questions/" + fisiologiaNom,      cursor: "not-allowed" , txt: fisiologiaTxt},
    { bg: neuropsicologiaBg, icon: <NeuropsicologiaIcon size={{ base: "58px", md: "58px" }} />, link: "/espacio/questions/" + neuropsicologiaNom, cursor: "pointer"  , txt: neuropsicologiaTxt   },
    { bg: astrologiaBg,      icon: <AstrologiaIcon size="58px" />,                              link: "/espacio/questions/" + astrologiaNom,      cursor: "not-allowed" , txt: astrologiaTxt},
    { bg: tcmBg,             icon: <TCMIcon size={{ base: "58px", md: "58px" }}/>,              link: "/espacio/questions/" + tcmNomLink,         cursor: "pointer" , txt: tcmTxt},
    { bg: nutricionBg,       icon: <NutricionIcon size="58px" />,                               link: "/espacio/questions/" + nutricionNom,       cursor: "not-allowed", txt: nutricionTxt },
    { bg: ayurvedaBg,        icon: <AyurvedaIcon size="58px" />,                                link: "/espacio/questions/" + ayurvedaNom,        cursor: "not-allowed" , txt: ayurvedaTxt},
    { bg: fitoterapiaBg,     icon: <FitoterapiaIcon size={{ base: "58px", md: "58px" }} />,     link: "/espacio/questions/" + fitoterapiaNom,     cursor: "pointer" , txt: fitoterapiaTxt},
    { bg: cabalaBg,          icon: <CabalaIcon size="58px" />,                                  link: "/espacio/questions/" + cabalaNom,          cursor: "not-allowed" , txt: cabalaTxt},
  ];

  const angleStep = (2 * Math.PI) / photos.length;

  const radius        = useBreakpointValue({ base: 105, sm: 130, md: 165, lg: 210, xl: 240 });
  const containerSize = useBreakpointValue({ base: "290px", sm: "350px", md: "440px", lg: "540px", xl: "620px" });
  const centerSize    = useBreakpointValue({ base: "110px", md: "145px", lg: "180px", xl: "210px" });
  const circleSize    = useBreakpointValue({ base: "58px", md: "76px", lg: "90px" });

  const [img, setimg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (img == null) {
      const stored = sessionStorage.getItem("img");
      setimg(stored);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const userId = sessionStorage.getItem("userId");
    const token  = sessionStorage.getItem("token");
    if (userId && token) {
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
          setimg(freshUrl);
        }
      } finally {
        setUploading(false);
      }
    } else {
      navigate("/home");
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      {/* ── HEADER ── */}
      <SiteHeader variant="private" userImg={img ?? undefined} />

      {/* ── MAIN ── */}
      <Box flex="1">
        {img != null && (
          <Flex
            direction="column"
            alignItems="center"
            pt={{ base: 6, md: 8 }}
            pb={{ base: 6, md: 8 }}
          >
            {/* Título */}
            <Flex align="center" gap={3} mb={{ base: 4, md: 6 }}>
              <EspacioPersonalIcon color="rgba(255,255,255,0.9)" size="52px" />
              <Text
                color="white"
                fontSize={{ base: "4xl", md: "4xl", lg: "5xl" }}
                fontWeight="700"
                letterSpacing="0.05em"
                style={{
                  filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
                }}
              >
                Mi Espacio
              </Text>
            </Flex>

            {/* Mandala directo, sin card */}
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
                  backgroundImage: "url('/img/life.png')",
                  backgroundSize: "100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  opacity: 0.12,
                  zIndex: 0,
                },
              }}
            >
              {/* Centro — clic para cambiar foto */}
              <Box
                position="absolute"
                w={centerSize}
                h={centerSize}
                borderRadius="full"
                overflow="hidden"
                boxShadow="0 8px 32px rgba(0,0,0,0.4), 0 0 45px rgba(107,196,200,1), 0 0 90px rgba(107,196,200,0.55), 0 0 140px rgba(107,196,200,0.25)"
                border="5px solid rgba(255,255,255,0.85)"
                zIndex={10}
              >
                <Image src={img} alt="Centro" w="100%" h="100%" objectFit="cover" />
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
                {/* Spinner overlay durante la subida */}
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

              {/* Disciplinas alrededor */}
              {photos.map((photo, index) => {
                const angle = angleStep * index - Math.PI / 2;
                const x = Math.cos(angle) * (radius ?? 150);
                const y = Math.sin(angle) * (radius ?? 150);
                return (
                  <Box
                    key={index}
                    cursor={photo.cursor}
                    position="absolute"
                    w={circleSize}
                    h={circleSize}
                    borderRadius="full"
                    overflow="hidden"
                    boxShadow="0 4px 20px rgba(0,0,0,0.35), 0 0 32px rgba(107,196,200,0.95), 0 0 65px rgba(107,196,200,0.5), 0 0 100px rgba(107,196,200,0.2)"
                    onClick={() => photo.cursor === "pointer" && navigate(photo.link)}
                    border={"6px solid "+ photo.txt}
                    transform={`translate(${x}px, ${y}px)`}
                    transition="all 0.3s ease"
                    _hover={
                      photo.cursor === "pointer"
                        ? { transform: `translate(${x}px, ${y}px) scale(1.18)`, border: ("6px solid " + photo.txt) }
                        : {}
                    }
                  >
                    <Box w="100%" h="100%" bg={photo.bg} display="flex" alignItems="center" justifyContent="center">
                      {photo.icon}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Flex>
        )}

        {img == null && <SpinnerTurquesa />}
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.15)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
};

export default EspacioHome;
