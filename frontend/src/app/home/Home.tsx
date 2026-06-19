import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, Tooltip, useBreakpointValue, useToast } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { PagoMetodoModal } from "../../components/metodo/PagoMetodoModal";
import { PagoPsicologiaModal } from "../../components/metodo/PagoPsicologiaModal";
import { PagoExitoModal } from "../../components/metodo/PagoExitoModal";
import { ComicUniversoModal } from "../../components/metodo/ComicUniversoModal";
import axios from "axios";
import {
  API_URL,
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionNomLink, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
} from "../../GlobalVariables";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.2); }
  to   { opacity: 1; transform: scale(1); }
`;

// Orden del Método: Astrología → Psicología → Hinduismo → TCM →
// Fisiología → Nutrición → Cultura → Cábala
// Astrología tiene flujo propio (/metodo/astrologia con aviso_visto). El resto
// salta directamente a la página del curso correspondiente en aprendizaje.
const disciplines = [
  { name: astrologiaNom,      bg: astrologiaBg,      txt: astrologiaTxt,      Icon: AstrologiaIcon,      link: "/metodo/astrologia" },
  { name: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt, Icon: NeuropsicologiaIcon, link: `/aprendizaje/cursos/${neuropsicologiaNom}` },
  { name: ayurvedaNom,        bg: ayurvedaBg,        txt: ayurvedaTxt,        Icon: AyurvedaIcon,        link: `/aprendizaje/cursos/${ayurvedaNomLink}` },
  { name: tcmNom,             bg: tcmBg,             txt: tcmTxt,             Icon: TCMIcon,             link: `/aprendizaje/cursos/${tcmNomLink}` },
  { name: fisiologiaNom,      bg: fisiologiaBg,      txt: fisiologiaTxt,      Icon: FisiologiaIcon,      link: `/aprendizaje/cursos/${fisiologiaNom}` },
  { name: nutricionNom,       bg: nutricionBg,       txt: nutricionTxt,       Icon: NutricionIcon,       link: `/aprendizaje/cursos/${nutricionNomLink}` },
  { name: cabalaNom,          bg: cabalaBg,          txt: cabalaTxt,          Icon: CabalaIcon,          link: `/aprendizaje/cursos/${cabalaNom}` },
  { name: culturaNom,         bg: culturaBg,         txt: culturaTxt,         Icon: CulturaIcon,         link: `/aprendizaje/cursos/${culturaNom}` },
];

// Astrología lleva candado hasta pagarse (metodo_suscrito), pero su círculo es
// clickable: al pulsarlo abre el pago si aún no está pagada, o entra al recorrido
// si ya lo está. Psicología se abre una vez pagada la primera disciplina
// (metodo_suscrito) — clickable igual: navega si ya está pagada, o abre el pago
// si todavía no. El resto queda con candado.

const Home = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [img, setImg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState<string>("");
  const [metodoSuscrito, setMetodoSuscrito] = useState<boolean | null>(null);
  const [psicologiaSuscrito, setPsicologiaSuscrito] = useState<boolean | null>(null);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [verificandoPago, setVerificandoPago] = useState(false);
  const [pagoExitoOpen, setPagoExitoOpen] = useState(false);
  // Pago de Psicología (2ª disciplina)
  const [pagoPsicoOpen, setPagoPsicoOpen] = useState(false);
  const [pagoPsicoLoading, setPagoPsicoLoading] = useState(false);
  const [pagoPsicoError, setPagoPsicoError] = useState<string | null>(null);
  const [pagoPsicoExitoOpen, setPagoPsicoExitoOpen] = useState(false);
  const [testPagos, setTestPagos] = useState(false);
  const [comicOpen, setComicOpen] = useState(false);

  const continuarAstrologia = async () => {
    navigate("/metodo/astrologia");
  };

  const irAstrologia = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      navigate("/welcome");
      return;
    }
    // El box de pago SOLO debe salir si el usuario NO ha pagado. Si aún no
    // sabemos su estado (carga inicial todavía en curso → metodoSuscrito null),
    // lo consultamos antes de decidir, para no mostrar el pago a quien ya pagó.
    let suscrito = metodoSuscrito;
    if (suscrito === null) {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        suscrito = !!me.data?.metodo_suscrito;
        setMetodoSuscrito(suscrito);
      } catch {
        suscrito = false;
      }
    }
    if (!suscrito) {
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

  // Desbloqueo en modo test (sin Stripe). Solo funciona si el backend lo permite.
  const testUnlock = async (scope: "metodo" | "psicologia") => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    try {
      await axios.post(
        `${API_URL}/payment/test/unlock`,
        { scope },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (scope === "metodo") {
        setMetodoSuscrito(true);
        setPagoOpen(false);
        setPagoExitoOpen(true);
      } else {
        setMetodoSuscrito(true);
        setPsicologiaSuscrito(true);
        setPagoPsicoOpen(false);
        setPagoPsicoExitoOpen(true);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "No se pudo activar el modo test.";
      if (scope === "metodo") setPagoError(msg); else setPagoPsicoError(msg);
    }
  };

  // Psicología (2ª disciplina): clic en su círculo del mandala.
  const irPsicologia = () => {
    if (psicologiaSuscrito) {
      navigate("/metodo/psicologia");
    } else {
      setPagoPsicoError(null);
      setPagoPsicoOpen(true);
    }
  };

  const pagarPsicologia = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoPsicoLoading(true);
    setPagoPsicoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/psicologia/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.url) { window.location.href = res.data.url; return; }
      setPagoPsicoError("No se pudo obtener la URL de pago. Inténtalo de nuevo.");
      setPagoPsicoLoading(false);
    } catch (err: any) {
      const status = err?.response?.status;
      setPagoPsicoError(
        status === 403
          ? "Necesitas completar el pago de Astrología antes de adquirir Psicología."
          : err?.response?.data?.message || err?.message || "Error desconocido",
      );
      setPagoPsicoLoading(false);
    }
  };

  const radius       = useBreakpointValue({ base: 112, sm: 138, md: 196, lg: 248, xl: 284 });
  const containerSize = useBreakpointValue({ base: "286px", sm: "356px", md: "498px", lg: "622px", xl: "712px" });
  const centerSize    = useBreakpointValue({ base: "102px", sm: "124px", md: "160px", lg: "196px", xl: "232px" });
  const circleSize    = useBreakpointValue({ base: "67px", sm: "79px", md: "96px", lg: "116px" });
  const iconSize      = useBreakpointValue({ base: "34px", sm: "43px", md: "53px", lg: "64px" });
  const numberSize    = useBreakpointValue({ base: "22px", sm: "25px", md: "29px", lg: "34px" });
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

    // ¿Modo test de pagos habilitado en el backend? (público)
    axios.get(`${API_URL}/payment/test/enabled`)
      .then((r) => setTestPagos(!!r.data?.enabled))
      .catch(() => setTestPagos(false));

    const url = new URL(window.location.href);
    const metodoPagado = url.searchParams.get("metodo_pagado");
    const psicologiaPagado = url.searchParams.get("psicologia_pagado");

    const cargarSuscripcion = async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const suscrito = !!me.data?.metodo_suscrito;
        setMetodoSuscrito(suscrito);
        setPsicologiaSuscrito(!!me.data?.psicologia_suscrito);
        return suscrito;
      } catch {
        setMetodoSuscrito(false);
        setPsicologiaSuscrito(false);
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
            await cargarSuscripcion();
          } else {
            await cargarSuscripcion();
          }
        })
        .catch(async () => {
          await cargarSuscripcion();
        })
        .finally(() => setVerificandoPago(false));
    } else if (psicologiaPagado) {
      setVerificandoPago(true);
      url.searchParams.delete("psicologia_pagado");
      window.history.replaceState({}, "", url.pathname + url.search);

      axios
        .get(`${API_URL}/payment/psicologia/verify`, {
          params: { session_id: psicologiaPagado },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          await cargarSuscripcion();
          if (res.data?.ok) {
            setPsicologiaSuscrito(true);
            setPagoPsicoExitoOpen(true);
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
      const res  = await fetch(`${API_URL}/upload/profile-pic/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
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
              mb={{ base: 10, md: 8 }}
            >
              Te damos la bienvenida al Recorrido{name ? `, ${name}` : ""}
            </Text>

            {/* <Text
              color="rgba(255,255,255,0.92)"
              // En móvil: clamp() escala el tamaño según el ancho del viewport
              // para que la frase entre siempre en una sola línea, sea cual
              // sea el dispositivo (desde 320px hasta tablet).
              fontSize={{ base: "clamp(0.7rem, 3.4vw, 1.05rem)", md: "2xl" }}
              fontStyle="italic"
              textAlign="center"
              letterSpacing={{ base: "0.02em", md: "0.04em" }}
              whiteSpace={{ base: "nowrap", md: "normal" }}
              textShadow="0 0 12px rgba(255,255,255,0.55), 0 0 26px rgba(255,255,255,0.3)"
              mb={{ base: 10, md: 8 }}
              px={2}
            >
              Este es «El Recorrido» para empezar el camino de vuelta a ti.
            </Text> */}

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

              {/* Disciplinas alrededor — habilitadas según ABIERTAS */}
              {disciplines.map((d, index) => {
                const angle = angleStep * index - Math.PI / 2;
                const x = Math.cos(angle) * (radius ?? 200);
                const y = Math.sin(angle) * (radius ?? 200);
                const delay = `${index * 0.18}s`;
                const number = index + 1;
                const Icon = d.Icon;
                // Astrología tiene txt muy claro → usar bg para el badge solo en ese caso.
                const badgeColor = d.bg === astrologiaBg ? d.bg : d.txt;
                // `abierta` = estado visual desbloqueado (iluminado, sin candado).
                //   · Astrología: cuando está PAGADA (metodo_suscrito). Mientras
                //     se carga el estado (null) la mostramos abierta para no
                //     parpadear el candado a quien ya pagó.
                //   · Psicología: solo cuando está PAGADA (psicologia_suscrito).
                // Ambas siguen con candado hasta que se pague / se pruebe el pago,
                // pero siguen siendo clicables para poder abrir su pago.
                const abierta =
                  (d.name === astrologiaNom && metodoSuscrito !== false) ||
                  (d.name === neuropsicologiaNom && psicologiaSuscrito === true);
                // `clickable` = se puede pulsar. Psicología es pulsable —aunque siga
                //   con candado— si ya se pagó Astrología, para poder abrir su pago.
                const clickable =
                  d.name === astrologiaNom ||
                  (d.name === neuropsicologiaNom && (psicologiaSuscrito === true || metodoSuscrito === true));
                const hasBg = hasDisciplinaBg(d.name);
                // Astrología: flujo propio. Psicología: navega (si pagada) o abre el pago.
                // Las demás abiertas saltarían directamente a su página.
                const handleClick = d.name === astrologiaNom
                  ? irAstrologia
                  : d.name === neuropsicologiaNom
                  ? irPsicologia
                  : () => navigate(d.link);
                // Tooltip al pasar el ratón sobre un círculo bloqueado.
                const tooltipLabel =
                  d.name === astrologiaNom
                    ? "Haz clic en Astrología para empezar tu recorrido."
                    : d.name === neuropsicologiaNom && clickable
                    ? "Desbloquea Psicología para empezar la 2ª disciplina."
                    : "«El Recorrido» se hace en orden — por favor, completa la disciplina anterior.";

                const disciplinaCircle = (
                  <Box
                    onClick={clickable ? handleClick : undefined}
                    cursor={clickable ? "pointer" : "not-allowed"}
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
                      bg={hasBg ? "transparent" : d.bg}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                    >
                      {hasBg && <DisciplinaBgLayer nom={d.name} borderRadius="full" />}
                      <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
                        <Icon size={{ base: iconSize ?? "44px", md: iconSize ?? "60px" }} />
                      </Box>

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
                          zIndex={2}
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
                      boxShadow={`0 2px 6px rgba(0,0,0,0.2)`}
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
                        label={tooltipLabel}
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

      {/* Botón inline "El inicio de todo" — solo en móvil, debajo del mandala.
          En desktop usamos el botón flotante de más abajo (no colisiona con nada). */}
      <Flex
        display={{ base: "flex", md: "none" }}
        justify="center"
        px={5}
        // Separación arriba mínima (el mandala ya tiene su propio margen) y
        // separación abajo amplia para no pegarse al footer.
        mt={{ base: -8, sm: -6 }}
        pb={{ base: 8, sm: 10 }}
      >
        <Box
          as="button"
          onClick={() => setComicOpen(true)}
          px={5}
          py={3}
          borderRadius="full"
          bg="rgba(0,40,40,0.55)"
          border="1px solid rgba(255,255,255,0.55)"
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize="md"
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
            h="22px"
            objectFit="contain"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55))" }}
          />
          <Box as="span">El inicio de todo</Box>
          <Box
            as="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            w="20px"
            h="20px"
            fill="white"
            style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.55))" }}
          >
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </Box>
        </Box>
      </Flex>

      <SiteFooter />

      <PagoExitoModal isOpen={pagoExitoOpen} onAceptar={() => setPagoExitoOpen(false)} />
      <PagoExitoModal
        isOpen={pagoPsicoExitoOpen}
        onAceptar={() => setPagoPsicoExitoOpen(false)}
        titulo="Pago de Psicología realizado"
        mensaje="Ya puedes empezar tu Línea de Vida."
      />
      <PagoMetodoModal
        isOpen={pagoOpen}
        onClose={() => { setPagoOpen(false); setPagoError(null); }}
        onPagar={pagarMetodo}
        loading={pagoLoading}
        error={pagoError}
        onTest={testPagos ? () => testUnlock("metodo") : undefined}
      />
      <PagoPsicologiaModal
        isOpen={pagoPsicoOpen}
        onClose={() => { setPagoPsicoOpen(false); setPagoPsicoError(null); }}
        onPagar={pagarPsicologia}
        loading={pagoPsicoLoading}
        error={pagoPsicoError}
        onTest={testPagos ? () => testUnlock("psicologia") : undefined}
      />
      {verificandoPago && <SpinnerTurquesa />}

      {/* Botón flotante "El inicio de todo" — solo en desktop (en móvil se
          renderiza inline debajo del mandala para no chocar con el footer). */}
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
          display={{ base: "none", md: "inline-flex" }}
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
