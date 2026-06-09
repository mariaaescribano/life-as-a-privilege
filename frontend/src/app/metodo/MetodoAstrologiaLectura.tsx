import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg } from "../../components/metodo/SpaceBg";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

// Convierte un link de "compartir" de Google Drive a URL de descarga directa.
function toDriveDownload(url: string): string {
  if (!url) return url;
  const m1 = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return `https://drive.google.com/uc?export=download&id=${m1[1]}`;
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2 && /drive\.google\.com/.test(url)) return `https://drive.google.com/uc?export=download&id=${m2[1]}`;
  return url;
}

export default function MetodoAstrologiaLectura() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [linkCarta, setLinkCarta] = useState<string | null>(null);
  const [comicOpen, setComicOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const res = await axios.get<{ link_carta?: string | null } | null>(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data?.link_carta) { navigate("/metodo/astrologia"); return; }
        setLinkCarta(res.data.link_carta);
      } catch {
        navigate("/metodo/astrologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
            title="Tu carta"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            step={{ current: 4, total: 6 }}
            mb={0}
            prev={{ label: "← Arquetipos", onClick: () => navigate("/metodo/astrologia/cartaAstral") }}
            extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
            next={{ label: "Mis casas →", onClick: () => navigate("/metodo/astrologia/casas") }}
          />

          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}44`}
            boxShadow={`0 0 22px rgba(255,255,255,0.15), 0 0 50px rgba(255,255,255,0.08), 0 0 30px ${astrologiaTxt}1a`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.66)" />

            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 12 }}>
              <Flex direction="column" align="center" gap={7}>
                <Text color={astrologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em" textAlign="center"
                      style={{ textShadow: `0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3), 0 0 60px ${astrologiaTxt}55` }}>
                  Tu carta astral está lista
                </Text>
                <Text color={`${astrologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" textAlign="center" maxW="560px"
                      style={{ textShadow: `0 0 10px rgba(255,255,255,0.4)` }}>
                  Ahora que conoces tus arquetipos, accede a tu carta completa. Descárgala, léela con calma y, cuando estés listo, continúa.
                </Text>

                {linkCarta && (
                  <Box
                    as="a"
                    href={toDriveDownload(linkCarta)}
                    target="_blank"
                    rel="noopener noreferrer"
                    px={{ base: 6, md: 10 }}
                    py={3}
                    borderRadius="full"
                    bg={astrologiaTxt}
                    color={astrologiaBg}
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "md", md: "xl" }}
                    fontWeight="700"
                    letterSpacing={{ base: "0.04em", md: "0.08em" }}
                    whiteSpace="nowrap"
                    boxShadow={`0 0 18px ${astrologiaTxt}88, 0 0 42px ${astrologiaTxt}44`}
                    cursor="pointer"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    lineHeight="1"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${astrologiaTxt}aa, 0 0 58px ${astrologiaTxt}55` }}
                  >
                    Descargar mi carta (PDF)
                  </Box>
                )}
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />
      <SiteFooter />
    </Box>
  );
}
