import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, Tooltip, useBreakpointValue, useToast } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { AvisoInicialModal } from "../../components/metodo/AvisoInicialModal";
import { PagoMetodoModal } from "../../components/metodo/PagoMetodoModal";
import { PagoExitoModal } from "../../components/metodo/PagoExitoModal";
import { ComicUniversoModal } from "../../components/metodo/ComicUniversoModal";
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
  { bg: cabalaBg,          txt: cabalaTxt,          Icon: CabalaIcon },
  { bg: culturaBg,         txt: culturaTxt,         Icon: CulturaIcon },
];

const Home = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [img, setImg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState<string>("");
  const [avisoOpen, setAvisoOpen] = useState(false);
  const [metodoSuscrito, setMetodoSuscrito] = useState<boolean | null>(null);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [verificandoPago, setVerificandoPago] = useState(false);
  const [pagoExitoOpen, setPagoExitoOpen] = useState(false);
  const [comicOpen, setComicOpen] = useState(false);

  const continuarAstrologia = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
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

  const irAstrologia = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      navigate("/welcome");
      return;
    }
    if (!metodoSuscrito) {
      setPagoOpen(true);
      return;
    }
    await continuarAstrologia();
  };

  const [pagoError, setPagoError] = useState<string | null>(null);

  const pagarMetodo = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/welcome");
      return;
    }
    setPagoLoading(true);
    setPagoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/metodo/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      console.error("[pagarMetodo] respuesta sin url:", res.data);
      setPagoError("No se pudo obtener la URL de pago. Inténtalo de nuevo.");
      setPagoLoading(false);
    } catch (err: any) {
      console.error("[pagarMetodo] error:", err?.response?.status, err?.response?.data || err?.message);
      const status = err?.response?.status;
      const reason =
        status === 404
          ? "Endpoint no encontrado — reinicia el backend para cargar la nueva ruta."
          : status === 401
          ? "Sesión expirada. Vuelve a iniciar sesión."
          : err?.response?.data?.message || err?.message || "Error desconocido";
      setPagoError(reason);
      setPagoLoading(false);
    }
  };

  /* TEST PAGO — START (eliminar antes de producción) */
  const pagarMetodoTest = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/welcome");
      return;
    }
    setPagoLoading(true);
    setPagoError(null);
    try {
      await axios.post(
        `${API_URL}/payment/metodo/test`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMetodoSuscrito(true);
      setPagoOpen(false);
      setPagoExitoOpen(true);
    } catch (err: any) {
      console.error("[pagarMetodoTest] error:", err?.response?.status, err?.response?.data || err?.message);
      setPagoError("No se pudo simular el pago. ¿Reiniciaste el backend?");
    } finally {
      setPagoLoading(false);
    }
  };
  /* TEST PAGO — END */

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

  const radius        = useBreakpointValue({ base: 125, sm: 155, md: 220, lg: 280, xl: 320 });
  const containerSize = useBreakpointValue({ base: "320px", sm: "400px", md: "560px", lg: "700px", xl: "800px" });
  const centerSize    = useBreakpointValue({ base: "115px", sm: "140px", md: "180px", lg: "220px", xl: "260px" });
  const circleSize    = useBreakpointValue({ base: "75px", sm: "89px", md: "108px", lg: "130px" });
  const iconSize      = useBreakpointValue({ base: "38px", sm: "48px", md: "60px", lg: "72px" });
  const numberSize    = useBreakpointValue({ base: "24px", sm: "28px", md: "32px", lg: "38px" });
  const mandalaScale  = useBreakpointValue({ base: "none", md: "scale(0.7)" });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId) {
      navigate("/");
      return;
    }
    if (img == null) {
      const stored = sessionStorage.getItem("img");
      setImg(stored);
    }
    setName(sessionStorage.getItem("name") || "");

    const url = new URL(window.location.href);
    const metodoPagado = url.searchParams.get("metodo_pagado");

    const cargarSuscripcion = async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const suscrito = !!me.data?.metodo_suscrito;
        setMetodoSuscrito(suscrito);
        return suscrito;
      } catch {
        setMetodoSuscrito(false);
        return false;
      }
    };

    if (metodoPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("metodo_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/metodo/verify`, {
          params: { session_id: metodoPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          if (res.data?.ok) {
            setMetodoSuscrito(true);
            setPagoExitoOpen(true);
          } else {
            await cargarSuscripcion();
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else {
      cargarSuscripcion();
    }
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
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.url) throw new Error("Sin URL devuelta");
      const freshUrl = `${data.url}?v=${Date.now()}`;
      sessionStorage.setItem("img", freshUrl);
      setImg(freshUrl);
    } catch (err) {
      toast({
        title: "No se pudo subir la foto",
        description: "Inténtalo de nuevo en un momento.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
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

      <Box flex="1" display="flex" alignItems="flex-start" justifyContent="center" transform={mandalaScale} transformOrigin="top center">
        {img != null ? (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            pt={{ base: 8, md: 10 }}
            pb={{ base: 20, md: 10 }}
            px={{ base: 5, md: 10 }}
            w="100%"
          >
            {/* ── SALUDO ── */}
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="700"
              letterSpacing="0.06em"
              textAlign="center"
              lineHeight="1.15"
              textShadow="0 0 18px rgba(255,255,255,0.75), 0 0 38px rgba(255,255,255,0.45), 0 0 70px rgba(180,255,245,0.35)"
              mb={3}
            >
              Te damos la bienvenida{name ? `, ${name}` : ""}
            </Text>
            <Text
              color="rgba(255,255,255,0.92)"
              fontSize={{ base: "lg", md: "2xl" }}
              fontStyle="italic"
              textAlign="center"
              letterSpacing="0.04em"
              textShadow="0 0 12px rgba(255,255,255,0.55), 0 0 26px rgba(255,255,255,0.3)"
              mb={{ base: 10, md: 8 }}
            >
              Este es «El Recorrido» para empezar el camino de vuelta a ti.
            </Text>

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
                boxShadow="0 8px 32px rgba(0,0,0,0.4), 0 0 32px rgba(255,255,255,0.7), 0 0 70px rgba(255,255,255,0.35), 0 0 110px rgba(180,255,245,0.3)"
                border="2px solid rgba(255,255,255,0.9)"
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

                const disciplinaCircle = (
                  <Box
                    onClick={abierta ? irAstrologia : undefined}
                    cursor={abierta ? "pointer" : "not-allowed"}
                    w="100%"
                    h="100%"
                    borderRadius="full"
                    overflow="visible"
                    position="relative"
                    opacity={abierta ? 1 : 0.5}
                    animation={`${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay} both`}
                    filter={abierta ? "none" : "grayscale(0.35)"}
                    transition="transform 0.2s ease, filter 0.2s ease, opacity 0.2s ease"
                    _hover={abierta ? { transform: "scale(1.06)" } : { opacity: 0.75 }}
                  >
                    {/* Círculo principal con icono */}
                    <Box
                      w="100%"
                      h="100%"
                      borderRadius="full"
                      overflow="hidden"
                      border={`4px solid ${d.txt}`}
                      boxShadow={abierta
                        ? `0 0 22px rgba(255,255,255,0.55), 0 0 50px rgba(255,255,255,0.3), 0 0 90px rgba(180,255,245,0.28), 0 0 60px ${d.txt}88, 0 2px 30px ${d.txt}55`
                        : `0 0 14px rgba(255,255,255,0.22), 0 0 32px rgba(255,255,255,0.12), 0 0 40px ${d.txt}55, 0 2px 24px ${d.txt}33`}
                      bg={d.bg}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                    >
                      <Icon size={{ base: iconSize ?? "44px", md: iconSize ?? "60px" }} />

                      {/* Overlay candado en las disciplinas bloqueadas */}
                      {!abierta && (
                        <Box
                          position="absolute"
                          inset={0}
                          bg="rgba(0,40,40,0.55)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{ backdropFilter: "blur(2px)" }}
                        >
                          <Box
                            as="svg"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            w={{ base: "30px", md: "42px", lg: "50px" }}
                            h={{ base: "30px", md: "42px", lg: "50px" }}
                            fill="white"
                            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.65)) drop-shadow(0 0 18px rgba(255,255,255,0.35))" }}
                          >
                            <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
                          </Box>
                        </Box>
                      )}
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
                      boxShadow={`0 0 10px rgba(255,255,255,0.6), 0 0 22px rgba(255,255,255,0.3), 0 2px 10px ${badgeColor}88, 0 4px 14px rgba(0,0,0,0.25)`}
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
                );

                return (
                  <Box
                    key={index}
                    position="absolute"
                    transform={`translate(${x}px, ${y}px)`}
                    w={circleSize}
                    h={circleSize}
                  >
                    {abierta ? (
                      disciplinaCircle
                    ) : (
                      <Tooltip
                        label="«El Recorrido» se hace en orden — por favor, completa la disciplina anterior."
                        placement="top"
                        hasArrow
                        bg="rgba(0,40,40,0.95)"
                        color="white"
                        fontFamily="'EB Garamond', serif"
                        fontSize="sm"
                        letterSpacing="0.03em"
                        px={4}
                        py={3}
                        maxW="260px"
                        textAlign="center"
                        borderRadius="lg"
                        boxShadow="0 0 18px rgba(255,255,255,0.25), 0 6px 20px rgba(0,0,0,0.35)"
                        openDelay={150}
                      >
                        {disciplinaCircle}
                      </Tooltip>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Flex>
        ) : (
          <SpinnerTurquesa />
        )}
      </Box>

      <SiteFooter />

      <AvisoInicialModal isOpen={avisoOpen} onConfirm={confirmarAviso} />
      <PagoExitoModal isOpen={pagoExitoOpen} onAceptar={() => setPagoExitoOpen(false)} />
      <PagoMetodoModal
        isOpen={pagoOpen}
        onClose={() => { setPagoOpen(false); setPagoError(null); }}
        onPagar={pagarMetodo}
        /* TEST PAGO — START */
        onPagoTest={pagarMetodoTest}
        /* TEST PAGO — END */
        loading={pagoLoading}
        error={pagoError}
      />
      {verificandoPago && <SpinnerTurquesa />}

      {/* Botón flotante "El inicio de todo" — siempre visible */}
      <Box
        as="button"
        onClick={() => setComicOpen(true)}
          position="fixed"
          bottom={{ base: 4, md: 6 }}
          right={{ base: 4, md: 6 }}
          zIndex={50}
          px={{ base: 4, md: 5 }}
          py={{ base: 2.5, md: 3 }}
          borderRadius="full"
          bg="rgba(0,40,40,0.55)"
          border="1px solid rgba(255,255,255,0.55)"
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          letterSpacing="0.04em"
          cursor="pointer"
          boxShadow="0 0 18px rgba(255,255,255,0.25), 0 0 38px rgba(180,255,245,0.18), 0 6px 24px rgba(0,0,0,0.35)"
          transition="all 0.25s ease"
          _hover={{
            transform: "translateY(-2px)",
            bg: "rgba(0,60,60,0.7)",
            boxShadow: "0 0 28px rgba(255,255,255,0.45), 0 0 60px rgba(180,255,245,0.3), 0 8px 28px rgba(0,0,0,0.4)",
          }}
          display="inline-flex"
          alignItems="center"
          gap={3}
          sx={{ backdropFilter: "blur(6px)" }}
        >
          <Image
            src="/img/icono/life.png"
            alt=""
            h={{ base: "22px", md: "26px" }}
            objectFit="contain"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55))" }}
          />
          <Box as="span">El inicio de todo</Box>
          <Box
            as="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            w={{ base: "20px", md: "22px" }}
            h={{ base: "20px", md: "22px" }}
            fill="white"
            style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.55))" }}
          >
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </Box>
        </Box>

      <ComicUniversoModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />
    </Box>
  );
};

export default Home;
