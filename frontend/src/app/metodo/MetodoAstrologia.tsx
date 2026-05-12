import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import {
  API_URL,
  astrologiaBg,
  astrologiaTxt,
  AstrologiaIcon,
} from "../../GlobalVariables";

/* Fondo espacial con degradado cósmico de respaldo */
const SpaceBg = ({ overlay = "rgba(8,13,30,0.55)" }: { overlay?: string }) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius="inherit"
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
    }}
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
      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.85 }}
    />
    <Box position="absolute" inset="0" style={{ background: overlay }} />
  </Box>
);

interface Estado {
  fecha_nacimiento?: string | null;
  hora_nacimiento?: string | null;
  pais?: string | null;
  lugar?: string | null;
  region?: string | null;
  solicitud_enviada_at?: string | null;
  link_carta?: string | null;
}

// Convierte un link de "compartir" de Google Drive a URL de descarga directa.
// Si ya es una URL de descarga o no es de Drive, la devuelve tal cual.
function toDriveDownload(url: string): string {
  if (!url) return url;
  // 1) https://drive.google.com/file/d/{ID}/view?...
  const m1 = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return `https://drive.google.com/uc?export=download&id=${m1[1]}`;
  // 2) https://drive.google.com/open?id={ID}
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2 && /drive\.google\.com/.test(url)) return `https://drive.google.com/uc?export=download&id=${m2[1]}`;
  return url;
}

export default function MetodoAstrologia() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState<Estado | null>(null);

  // Form state
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [pais, setPais] = useState("");
  const [lugar, setLugar] = useState("");
  const [region, setRegion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const res = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEstado(res.data ?? null);
      } catch {
        setEstado(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const enviarSolicitud = async () => {
    setError(null);
    if (!fecha || !hora || !pais.trim() || !lugar.trim() || !region.trim()) {
      setError("Rellena todos los campos para continuar.");
      return;
    }
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    setEnviando(true);
    try {
      await axios.post(
        `${API_URL}/metodo-astrologia/solicitud/${userId}`,
        {
          fecha_nacimiento: fecha,
          hora_nacimiento: hora,
          pais: pais.trim(),
          lugar: lugar.trim(),
          region: region.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Refresca estado: ahora estará en "esperando lectura"
      const r = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEstado(r.data ?? null);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || "Error desconocido";
      console.error("[solicitud] error:", status, msg, err?.response?.data);
      setError(`No se pudo enviar (${status || "?"}): ${msg}`);
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="#008080">
        <SpinnerTurquesa />
      </Box>
    );
  }

  const yaSolicitado = !!estado?.solicitud_enviada_at;
  const yaConPdf = !!estado?.link_carta;

  // Etiquetas de los botones del header según estado
  const camposCompletos = !!fecha && !!hora && !!pais.trim() && !!lugar.trim() && !!region.trim();
  const headerPrev = { label: "← Volver al inicio", onClick: () => navigate("/home") };
  const headerNext = yaConPdf
    ? { label: "Continuar a los planetas →", onClick: () => navigate("/metodo/astrologia/planetas") }
    : yaSolicitado
    ? { label: "Esperando lectura…", onClick: () => {}, disabled: true }
    : { label: "Enviar carta →", onClick: () => { void enviarSolicitud(); }, disabled: !camposCompletos || enviando };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          {/* ── Header de disciplina ── */}
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Astrología"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            mb={0}
            prev={headerPrev}
            next={headerNext}
          />

          {/* ── Caja principal con SpaceBg ── */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}44`}
            boxShadow={`0 0 30px ${astrologiaTxt}33, 0 0 80px ${astrologiaTxt}1f`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.65)" />

            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>

              {/* ── ESTADO C — PDF disponible ── */}
              {yaConPdf && (
                <Flex direction="column" align="center" gap={6}>
                  <Text color={astrologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em" textAlign="center"
                        style={{ textShadow: `0 0 12px ${astrologiaTxt}77` }}>
                    Tu carta astral está lista
                  </Text>
                  <Text color={`${astrologiaTxt}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" textAlign="center" maxW="560px">
                    Descárgala, léela con calma y, cuando estés lista, continúa al siguiente paso para indicar tus arquetipos.
                  </Text>
                  <Box
                    as="a"
                    href={toDriveDownload(estado!.link_carta!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    px={10}
                    py={3}
                    borderRadius="full"
                    bg={astrologiaTxt}
                    color={astrologiaBg}
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="700"
                    letterSpacing="0.08em"
                    boxShadow={`0 0 24px ${astrologiaTxt}99, 0 0 56px ${astrologiaTxt}55`}
                    cursor="pointer"
                    transition="all 0.22s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 32px ${astrologiaTxt}, 0 0 80px ${astrologiaTxt}77` }}
                  >
                    Descargar mi carta (PDF)
                  </Box>

                </Flex>
              )}

              {/* ── ESTADO B — solicitud enviada, esperando lectura ── */}
              {!yaConPdf && yaSolicitado && (
                <Flex direction="column" align="center" gap={5} py={4}>
                  <Box
                    w="64px"
                    h="64px"
                    borderRadius="full"
                    bg={`${astrologiaTxt}1f`}
                    border={`1.5px solid ${astrologiaTxt}77`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={`0 0 22px ${astrologiaTxt}55`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill={astrologiaTxt}>
                      <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Z"/>
                    </svg>
                  </Box>
                  <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em" textAlign="center"
                        style={{ textShadow: `0 0 10px ${astrologiaTxt}66` }}>
                    Tu carta está en proceso
                  </Text>
                  <Text color={`${astrologiaTxt}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" textAlign="center" maxW="600px">
                    María personalmente leerá tu carta y te dirá los arquetipos para que puedas continuar. Hasta entonces tienes que esperar, lo sentimos.
                  </Text>
                  <Text color={`${astrologiaTxt}aa`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.75" textAlign="center" fontStyle="italic" maxW="540px">
                    Mientras tanto, recuerda que tienes los cursos y libros gratuitos.
                  </Text>
                </Flex>
              )}

              {/* ── ESTADO A — formulario ── */}
              {!yaConPdf && !yaSolicitado && (
                <Flex direction="column" gap={5}>
                  <Text color={astrologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em" textAlign="center"
                        style={{ textShadow: `0 0 12px ${astrologiaTxt}66` }}>
                    Tu Carta Astral
                  </Text>
                  <Text color={`${astrologiaTxt}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" textAlign="center" maxW="600px" mx="auto">
                    Necesitamos tus datos de nacimiento para que María pueda leer tu carta.
                  </Text>

                  <Box h="1px" my={2} bgGradient={`linear(to-r, transparent, ${astrologiaTxt}55, transparent)`} />

                  <Flex direction={{ base: "column", md: "row" }} gap={4}>
                    <Campo label="Fecha de nacimiento" type="date" value={fecha} onChange={setFecha} color={astrologiaTxt} />
                    <Campo label="Hora de nacimiento" type="time" value={hora} onChange={setHora} color={astrologiaTxt} />
                  </Flex>
                  <Campo label="País" value={pais} onChange={setPais} color={astrologiaTxt} placeholder="Ej: España" />
                  <Flex direction={{ base: "column", md: "row" }} gap={4}>
                    <Campo label="Lugar (ciudad)" value={lugar} onChange={setLugar} color={astrologiaTxt} placeholder="Ej: Madrid" />
                    <Campo label="Región / provincia" value={region} onChange={setRegion} color={astrologiaTxt} placeholder="Ej: Comunidad de Madrid" />
                  </Flex>

                  {error && (
                    <Text color="#ffb8b8" fontSize="sm" textAlign="center" fontStyle="italic">{error}</Text>
                  )}

                  {enviando && (
                    <Text color={`${astrologiaTxt}aa`} fontSize="sm" textAlign="center" fontStyle="italic" mt={2}>
                      Enviando…
                    </Text>
                  )}
                </Flex>
              )}

            </Box>
          </Box>
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}

/* ── Componentes auxiliares ── */

const Campo = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  color,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  color: string;
}) => (
  <Box flex="1">
    <Text color={`${color}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
      {label}
    </Text>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      bg="rgba(8,13,30,0.55)"
      border={`1px solid ${color}44`}
      color={color}
      borderRadius="lg"
      size="md"
      fontFamily="'EB Garamond', serif"
      _placeholder={{ color: `${color}55` }}
      _hover={{ borderColor: `${color}88` }}
      _focus={{
        borderColor: color,
        boxShadow: `0 0 0 1px ${color}55, 0 0 14px ${color}33`,
        bg: "rgba(8,13,30,0.7)",
      }}
      sx={{
        // Iconos de date/time visibles sobre fondo oscuro
        "::-webkit-calendar-picker-indicator": { filter: "invert(0.9)" },
      }}
    />
  </Box>
);

