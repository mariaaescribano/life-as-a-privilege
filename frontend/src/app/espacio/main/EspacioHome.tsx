import { Box, Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import SiteHeader from "../../../components/global/SiteHeader";
import React, { useEffect, useState } from "react";
import {
  API_URL,
  astrologiaBg, AstrologiaIcon, astrologiaNom,
  astrologiaTxt,
  ayurvedaBg, AyurvedaIcon,
  ayurvedaTxt,
  culturaBg, CulturaIcon,
  culturaTxt,
  cabalaBg, CabalaIcon, cabalaNom,
  cabalaTxt,
  EspacioPersonalIcon,
  fisiologiaBg, FisiologiaIcon,
  fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom,
  neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNomLink,
  nutricionTxt,
  tcmBg, TCMIcon,
  tcmNomLink,
  tcmTxt,
  ayurvedaNomLink,
} from "../../../GlobalVariables";
import { useNavigate } from "react-router-dom";
import { LifeLoader } from "../../../components/metodo/comicLoaders";
import SiteFooter from "../../../components/global/Footer";
import { useT } from "../../../i18n";

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const EspacioHome = () => {
  const navigate = useNavigate();
  const t = useT();

  // Orden del Método: Astrología → Psicología → Hinduismo → TCM →
  // Fisiología → Nutrición → Cábala → Cultura
  const photos = [
    { bg: astrologiaBg,      icon: <AstrologiaIcon size={{ base: "38px", md: "58px" }}  />,                              link: "/espacio/questions/" + astrologiaNom,      cursor: "pointer" , txt: astrologiaTxt},
    { bg: neuropsicologiaBg, icon: <NeuropsicologiaIcon size={{ base: "38px", md: "58px" }} />, link: "/espacio/questions/" + neuropsicologiaNom, cursor: "pointer"  , txt: neuropsicologiaTxt   },
    { bg: ayurvedaBg,        icon: <AyurvedaIcon size={{ base: "38px", md: "58px" }} />,             link: "/espacio/questions/" + ayurvedaNomLink,        cursor: "pointer",      txt: ayurvedaTxt},
    { bg: tcmBg,             icon: <TCMIcon size={{ base: "38px", md: "58px" }} />,              link: "/espacio/questions/" + tcmNomLink,         cursor: "pointer" , txt: tcmTxt},
    { bg: fisiologiaBg,      icon: <FisiologiaIcon size={{ base: "38px", md: "58px" }}  />,                              link: "/espacio/fisiologia",                      cursor: "pointer"     , txt: fisiologiaTxt},
    { bg: nutricionBg,       icon: <NutricionIcon size={{ base: "38px", md: "58px" }}  />,                               link: "/espacio/questions/" + nutricionNomLink,   cursor: "pointer",    txt: nutricionTxt },
    { bg: cabalaBg,          icon: <CabalaIcon size={{ base: "38px", md: "58px" }}  />,                                  link: "/espacio/questions/" + cabalaNom,          cursor: "pointer" , txt: cabalaTxt},
    { bg: culturaBg,         icon: <CulturaIcon size={{ base: "38px", md: "58px" }}  />,         link: "/aprendizaje/cursos/cultura",     cursor: "pointer" , txt: culturaTxt},
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
      const stored = localStorage.getItem("img");
      setimg(stored);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const userId = localStorage.getItem("userId");
    const token  = localStorage.getItem("token");
    if (userId && token) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        const res  = await fetch(`${API_URL}/upload/profile-pic/${userId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          const freshUrl = `${data.url}?v=${Date.now()}`;
          localStorage.setItem("img", freshUrl);
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
            sx={{
              "@media (min-width: 768px)": {
                zoom: "0.8",
              },
            }}
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
                {t("espacio.titulo")}
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
                  backgroundImage: "url('/img/icono/life.png')",
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
                border="2px solid rgba(255,255,255,0.85)"
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
                    <LifeLoader color="#ffffff" size="58px" />
                  </Box>
                )}
              </Box>

              {/* Disciplinas alrededor — aparecen una a una en sentido horario */}
              {photos.map((photo, index) => {
                const angle = angleStep * index - Math.PI / 2;
                const x = Math.cos(angle) * (radius ?? 150);
                const y = Math.sin(angle) * (radius ?? 150);
                const delay = `${index * 0.18}s`;
                return (
                  // Capa exterior: solo posicionamiento (translate fijo)
                  <Box
                    key={index}
                    position="absolute"
                    transform={`translate(${x}px, ${y}px)`}
                    w={circleSize}
                    h={circleSize}
                  >
                    {/* Capa interior: animación de entrada + interactiVidad */}
                    <Box
                      cursor={photo.cursor}
                      w="100%"
                      h="100%"
                      borderRadius="full"
                      overflow="hidden"
                      boxShadow={`
                        0 0 80px ${photo.txt}bb,
                        0 2px 44px ${photo.txt}97
                      `}
                      onClick={() => photo.cursor === "pointer" && navigate(photo.link)}
                      border={"4px solid " + photo.txt}
                      animation={`${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay} both`}
                      transition="transform 0.3s ease"
                      _hover={
                        photo.cursor === "pointer"
                          ? { transform: "scale(1.18)" }
                          : {}
                      }
                    >
                      <Box w="100%" h="100%" bg={photo.bg} display="flex" alignItems="center" justifyContent="center">
                        {photo.icon}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Flex>
        )}

        {img == null && (
          <Flex flex="1" align="center" justify="center" py={16}>
            <LifeLoader color="#ffffff" />
          </Flex>
        )}
      </Box>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
};

export default EspacioHome;
