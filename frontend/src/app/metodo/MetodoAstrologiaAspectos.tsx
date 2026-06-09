import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg } from "../../components/metodo/SpaceBg";
import { Glifo } from "../../components/metodo/Glifo";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import { cuerpoByKey } from "../../components/metodo/astrologiaData";
import type { CartaNatal, Aspecto } from "../../components/metodo/CartaAstral3D/types";
import { COLOR_ASPECTO } from "../../components/metodo/CartaAstral3D/types";
import { ASPECTO_LABEL, ASPECTO_SYMBOL, aspectoKey } from "../../components/metodo/casasAspectos";
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

function renderParrafos(texto: string, color: string): React.ReactNode {
  return texto
    .split(/\n\s*\n+/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((parrafo, pi) => (
      <Text key={pi} color={`${color}ee`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
            whiteSpace="pre-wrap" mt={pi === 0 ? 0 : 3} style={{ textShadow: `0 0 8px ${color}33` }}>
        {parrafo.split(/(\*\*[^*]+\*\*)/g).map((parte, i) =>
          parte.startsWith("**") && parte.endsWith("**") ? (
            <span key={i} style={{ fontWeight: 700, color, textShadow: `0 0 8px ${color}55` }}>{parte.slice(2, -2)}</span>
          ) : (
            <React.Fragment key={i}>{parte}</React.Fragment>
          ),
        )}
      </Text>
    ));
}

interface Row {
  link_carta?: string | null;
  aspectos_texto?: Record<string, string> | null;
}

export default function MetodoAstrologiaAspectos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [aspectos, setAspectos] = useState<Aspecto[]>([]);
  const [textos, setTextos] = useState<Record<string, string>>({});
  const [comicOpen, setComicOpen] = useState(false);
  const [abierto, setAbierto] = useState<Aspecto | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const rowRes = await axios.get<Row | null>(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!rowRes.data?.link_carta) { navigate("/metodo/astrologia"); return; }
        setTextos((rowRes.data.aspectos_texto ?? {}) as Record<string, string>);

        const cartaRes = await axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAspectos(cartaRes.data?.aspectos ?? []);
      } catch {
        setAspectos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const todosEscritos =
    aspectos.length > 0 && aspectos.every((a) => (textos[aspectoKey(a)] ?? "").trim().length > 0);

  const headerNext = {
    label: todosEscritos ? "Psicología →" : "Lectura de aspectos en proceso…",
    onClick: () => navigate("/metodo/psicologia"),
    disabled: true, // Psicología bloqueada por ahora
    disabledTooltip: "Psicología estará disponible próximamente",
  };

  const textoAbierto = abierto ? (textos[aspectoKey(abierto)] ?? "").trim() : "";

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
            title="Tus aspectos"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            step={{ current: 6, total: 6 }}
            mb={0}
            prev={{ label: "← Mis casas", onClick: () => navigate("/metodo/astrologia/casas") }}
            extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
            next={headerNext}
          />

          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}44`}
            boxShadow={`0 0 22px rgba(255,255,255,0.15), 0 0 50px rgba(255,255,255,0.08), 0 0 30px ${astrologiaTxt}1a`}
          >
            {/* Fondo espacial NÍTIDO (sin la veladura que difuminaba la imagen) */}
            <Box
              position="absolute"
              inset="0"
              pointerEvents="none"
              overflow="hidden"
              borderRadius="inherit"
              style={{ background: "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)" }}
            >
              <Box
                as="img"
                src="/img/astrologia/space.jpg"
                alt=""
                loading="eager"
                position="absolute"
                inset="0"
                w="100%"
                h="100%"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <Box position="absolute" inset="0" style={{ background: "rgba(8,13,30,0.45)" }} />
            </Box>

            <Box position="relative" zIndex={1} px={{ base: 4, md: 8 }} py={{ base: 7, md: 9 }}>
              <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" mb={2}
                    letterSpacing="0.04em" style={{ textShadow: `0 0 12px ${astrologiaTxt}66` }}>
                Los diálogos de tu carta
              </Text>
              <Text color={`${astrologiaTxt}cc`} fontSize={{ base: "sm", md: "md" }} textAlign="center" mb={6} maxW="560px" mx="auto">
                Cada aspecto es una conversación entre dos planetas. Pulsa para leer.
              </Text>

              {aspectos.length === 0 ? (
                <Text color={`${astrologiaTxt}aa`} fontStyle="italic" textAlign="center" py={6}>
                  No hay aspectos calculados todavía.
                </Text>
              ) : (
                <Flex direction="column" gap={3}>
                  {aspectos.map((a, idx) => {
                    const cuerpoA = cuerpoByKey(a.a);
                    const cuerpoB = cuerpoByKey(a.b);
                    const colorAsp = COLOR_ASPECTO[a.tipo];
                    const escrito = (textos[aspectoKey(a)] ?? "").trim().length > 0;
                    return (
                      <Flex
                        key={`${aspectoKey(a)}-${idx}`}
                        as="button"
                        onClick={() => setAbierto(a)}
                        w="100%"
                        textAlign="left"
                        align="center"
                        gap={{ base: 2, md: 4 }}
                        px={{ base: 4, md: 7 }}
                        py={{ base: 3.5, md: 4 }}
                        borderRadius="xl"
                        bg="rgba(8,13,30,0.35)"
                        border={`1px solid ${colorAsp}44`}
                        boxShadow={`0 0 12px ${colorAsp}1f`}
                        cursor="pointer"
                        opacity={escrito ? 1 : 0.6}
                        transition="all 0.18s"
                        _hover={{
                          bg: "rgba(8,13,30,0.5)",
                          borderColor: `${colorAsp}88`,
                          boxShadow: `0 0 20px ${colorAsp}44`,
                          transform: "translateY(-1px)",
                        }}
                      >
                        {/* Planeta A: glifo + nombre a la derecha */}
                        <Flex align="center" gap={{ base: 2, md: 3 }} flexShrink={0}>
                          {cuerpoA && <Glifo symbol={cuerpoA.symbol} color={cuerpoA.color} size={34} />}
                          {cuerpoA && (
                            <Text
                              display={{ base: "none", md: "block" }}
                              w={{ md: "120px" }}
                              flexShrink={0}
                              color={`${cuerpoA.color}ee`}
                              fontSize="lg"
                              fontWeight="600"
                              letterSpacing="0.02em"
                              noOfLines={1}
                              style={{ textShadow: `0 0 8px ${cuerpoA.color}55` }}
                            >
                              {cuerpoA.label}
                            </Text>
                          )}
                        </Flex>

                        {/* Aspecto: símbolo + nombre en una sola línea */}
                        <Flex align="center" gap={{ base: 1.5, md: 2.5 }} justify="center" flex="1" minW={0}>
                          <Text fontSize={{ base: "xl", md: "2xl" }} color={colorAsp} fontFamily="'Times New Roman', serif"
                                style={{ filter: `drop-shadow(0 0 6px ${colorAsp}aa)`, lineHeight: 1 }}>
                            {ASPECTO_SYMBOL[a.tipo]}
                          </Text>
                          <Text fontSize={{ base: "2xs", md: "sm" }} color={`${colorAsp}dd`} letterSpacing="0.08em"
                                textTransform="uppercase" whiteSpace="nowrap">
                            {ASPECTO_LABEL[a.tipo]}
                          </Text>
                        </Flex>

                        {/* Planeta B: glifo + nombre a la derecha */}
                        <Flex align="center" gap={{ base: 2, md: 3 }} flexShrink={0}>
                          {cuerpoB && <Glifo symbol={cuerpoB.symbol} color={cuerpoB.color} size={34} />}
                          {cuerpoB && (
                            <Text
                              display={{ base: "none", md: "block" }}
                              w={{ md: "120px" }}
                              flexShrink={0}
                              color={`${cuerpoB.color}ee`}
                              fontSize="lg"
                              fontWeight="600"
                              letterSpacing="0.02em"
                              noOfLines={1}
                              style={{ textShadow: `0 0 8px ${cuerpoB.color}55` }}
                            >
                              {cuerpoB.label}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                    );
                  })}
                </Flex>
              )}
            </Box>
          </Box>
        </Flex>
      </Flex>

      {/* ── POPUP del aspecto ── */}
      {abierto && (() => {
        const cuerpoA = cuerpoByKey(abierto.a);
        const cuerpoB = cuerpoByKey(abierto.b);
        const colorAsp = COLOR_ASPECTO[abierto.tipo];
        return (
          <Box
            position="fixed" inset={0} zIndex={500}
            display="flex" alignItems="center" justifyContent="center"
            px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}
            bg="rgba(0,0,0,0.72)"
            sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
            onClick={() => setAbierto(null)}
            fontFamily="'EB Garamond', serif"
          >
            <Box
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              position="relative" w="100%" maxW="600px"
              maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 80px)" }}
              borderRadius="2xl" overflow="hidden"
              border={`1px solid ${colorAsp}66`}
              boxShadow={`0 0 32px ${colorAsp}55, 0 0 80px ${colorAsp}28, 0 12px 60px rgba(0,0,0,0.6)`}
              display="flex" flexDirection="column"
            >
              <SpaceBg overlay="rgba(8,13,30,0.74)" />

              <Box as="button" onClick={() => setAbierto(null)} position="absolute" top={3} right={3} zIndex={3}
                   w="36px" h="36px" borderRadius="full" display="flex" alignItems="center" justifyContent="center"
                   bg="rgba(0,0,0,0.6)" border={`1px solid ${colorAsp}66`} color={colorAsp} cursor="pointer"
                   _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: colorAsp }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </Box>

              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}
                   overflowY="auto"
                   sx={{ "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-thumb": { background: `${colorAsp}55`, borderRadius: "8px" } }}>
                <Flex align="center" justify="center" gap={3} mb={5} flexWrap="wrap">
                  {cuerpoA && <Glifo symbol={cuerpoA.symbol} color={cuerpoA.color} size={34} />}
                  <Text fontSize="2xl" color={colorAsp} fontFamily="'Times New Roman', serif"
                        style={{ filter: `drop-shadow(0 0 8px ${colorAsp}aa)` }}>
                    {ASPECTO_SYMBOL[abierto.tipo]}
                  </Text>
                  {cuerpoB && <Glifo symbol={cuerpoB.symbol} color={cuerpoB.color} size={34} />}
                </Flex>
                <Text color={colorAsp} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" textAlign="center" mb={5}
                      letterSpacing="0.04em" style={{ textShadow: `0 0 12px ${colorAsp}66` }}>
                  {cuerpoA?.label} {ASPECTO_LABEL[abierto.tipo].toLowerCase()} {cuerpoB?.label}
                </Text>

                {textoAbierto ? (
                  renderParrafos(textoAbierto, astrologiaTxt)
                ) : (
                  <Text color={`${astrologiaTxt}aa`} fontStyle="italic" textAlign="center" fontSize={{ base: "md", md: "lg" }}>
                    María aún no ha escrito la lectura de este aspecto. Estará disponible pronto.
                  </Text>
                )}
              </Box>
            </Box>
          </Box>
        );
      })()}

      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />
      <SiteFooter />
    </Box>
  );
}
