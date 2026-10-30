// LogIn.tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL } from "../../GlobalVariables";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { LoginUser } from "../../dtos/user.types";
import { gestionaError } from "../../GlobalHelper";
import SiteFooter from "../../components/global/Footer";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";
import BandaMarmol from "../../components/global/BandaMarmol";
import { CampoContrasena, inputAuthStyles, focoAzul } from "../../components/global/CampoContrasena";
import { useT } from "../../i18n";

// El estilo de los campos vive en CampoContrasena, para que el campo con ojo y
// los normales no puedan quedar distintos.
const inputStyles = inputAuthStyles;

const TINTA = "#004f4f";
const ORO = "#b08d3f";

/** Los dos inicios de sesión entre los que se elige primero: asesoría con la foto de María,
 *  premium con el mandala sobre turquesa. */
const OPCIONES = [
  { modo: "asesoria" as const, texto: "auth.login.opcion.asesoria" as const },
  { modo: "premium" as const, texto: "auth.login.opcion.premium" as const },
];

export default function LogIn() {
  const navigate = useNavigate();
  const t = useT();
  const [params] = useSearchParams();
  const next = params.get("next") || "/home";
  // Destino tras login: si la cuenta es admin, va al panel.
  const destinoRef = useRef<string>(next);

  const [name, setname] = useState<string>("");
  const [contra, setcontra] = useState<string>("");
  const [message, setmessage] = useState<SuccessErrorMessageDto | null>(null);
  // Sesión iniciada: redirige en 3 s y bloquea el botón mientras tanto.
  const [entrando, setEntrando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  // El login ha rebotado porque la cuenta aún no está confirmada: se ofrece
  // volver a mandar el correo.
  const [sinConfirmar, setSinConfirmar] = useState(false);
  const [reenviado, setReenviado] = useState(false);
  // Qué inicio de sesión se ha elegido (null = todavía se está eligiendo).
  // `?modo=premium` (el botón EMPEZAR de Premium) llega con la puerta ya elegida.
  const [modo, setModo] = useState<"asesoria" | "premium" | null>(
    params.get("modo") === "premium" ? "premium" : params.get("modo") === "asesoria" ? "asesoria" : null,
  );
  const [formVisible, setFormVisible] = useState(false);
  // Enter en «nombre o email» salta a la contraseña (allí Enter ya entra).
  const contraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!modo) { setFormVisible(false); return; }
    const id = setTimeout(() => setFormVisible(true), 40);
    return () => clearTimeout(id);
  }, [modo]);

  // Llegada desde el enlace del correo de bienvenida: /logIn?confirmar=<token>.
  // Se confirma la cuenta y se deja el email puesto para que solo falte la
  // contraseña. El token se quita de la barra para no reenviarlo al recargar.
  const tokenConfirmar = params.get("confirmar");
  const confirmadoRef = useRef(false);
  useEffect(() => {
    if (!tokenConfirmar || confirmadoRef.current) return;
    confirmadoRef.current = true;
    const limpia = new URL(window.location.href);
    limpia.searchParams.delete("confirmar");
    window.history.replaceState(null, "", limpia.pathname + limpia.search);
    axios
      .post(`${API_URL}/user/confirmar`, { token: tokenConfirmar })
      .then((res) => {
        if (res.data?.email) setname(res.data.email);
        setmessage({ soy: 1, title: t("auth.login.confirmada"), description: t("auth.login.confirmadaTexto") });
      })
      .catch((err) => setmessage(gestionaError(err)));
  }, [tokenConfirmar]);

  // Recién creada la cuenta (viene del popup de /signIn): recordatorio.
  useEffect(() => {
    if (params.get("pendiente") === "1") {
      setmessage({ soy: 1, title: t("auth.signin.miraCorreo"), description: t("auth.login.pendienteTexto") });
    }
  }, []);

  const reenviarConfirmacion = async () => {
    try {
      await axios.post(`${API_URL}/user/confirmar/reenviar`, { name });
      setReenviado(true);
    } catch (err: any) {
      setmessage(gestionaError(err));
    }
  };

  const inicioSesion = async () => {
    setLoading(true);
    try {
      let body: LoginUser = {
        name: name,
        password: contra,
      };

      const response = await axios.post(
        `${API_URL}/user/logIn`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data != null) {
        localStorage.setItem("userId", response.data?.user.id);
        localStorage.setItem("name", response.data?.user.name);
        localStorage.setItem("token", response.data?.token);

        const res = await fetch(API_URL + `/upload/profile-pic/${response.data?.user.id}`);
        const data = await res.json();

        localStorage.setItem(
          "img",
          data.url && data.url != ""
            ? data.url
            : "/img/icono/noImg.webp"
        );

        // Si el email es de admin, aún NO está desbloqueado (hace falta la
        // contraseña de administración): lo mandamos a la pantalla de desbloqueo.
        // Estar en la lista de emails ya no da acceso por sí solo.
        try {
          const me = await axios.get(`${API_URL}/user/me`, {
            headers: { Authorization: `Bearer ${response.data?.token}` },
          });
          localStorage.removeItem("isAdmin");
          if (me.data?.admin_email && next === "/home") {
            destinoRef.current = "/admin/login";
          }
        } catch { /* si falla, destino normal */ }

        setSinConfirmar(false);
        setmessage({
          soy: 1,
          title: t("auth.login.bienvenido"),
          description: t("auth.login.preparando"),
        });
        setEntrando(true);
      }
    } catch (err: any) {
      const pendiente = err?.response?.data?.code === "EMAIL_SIN_CONFIRMAR";
      setSinConfirmar(pendiente);
      setReenviado(false);
      setmessage(pendiente
        ? { soy: 2, title: t("auth.login.sinConfirmar"), description: t("auth.login.sinConfirmarTexto") }
        : gestionaError(err));
    } finally {
      setLoading(false);
    }
  };

  const validarInicioSesion = () => {
    if (name === "" || contra === "") {
      setmessage({
        soy: 2,
        title: t("auth.error.faltanDatos"),
        description: t("auth.error.rellena"),
      });
    } else {
      inicioSesion();
    }
  };

  useEffect(() => {
    if (entrando) {
      const timer = setTimeout(() => navigate(destinoRef.current, { replace: true }), 3000);
      return () => clearTimeout(timer);
    }
  }, [entrando]);

  // Bloquea el botón "Entrar" mientras carga Y también cuando ya se ha iniciado
  // sesión (mensaje de éxito visible): así no se puede volver a pulsar durante
  // los 3s que tarda en redirigir.
  const bloqueado = loading || entrando;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="public" />

      <Box flex="1" display="flex" flexDirection="column">

      {/* ── MANDALA + «ENTRA A TU CUENTA» + frase en cursiva + separación ──
          Ya elegida una puerta, la frase pasa a ser la elegida y no hay separación. */}
      <WelcomeCabecera
        activo={mounted}
        titulo={t("auth.login.titulo")}
        subtitulo={modo ? t(modo === "asesoria" ? "auth.login.opcion.asesoria" : "auth.login.opcion.premium") : t("auth.login.frase")}
        sinSeparador={!!modo}
        mayusculas
      />

      {/* ── PRIMERO, ELEGIR: dos puertas sobre el mármol, cada una con su foto ── */}
      {!modo && (
        <BandaMarmol>
          {(visible) => (
            <Flex justify="center" px={{ base: 5, md: 10 }}>
              <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "stretch" }} gap={{ base: 12, md: 14 }} w="100%" maxW="860px">
                {OPCIONES.map((o, i) => (
                  <Reveal key={o.modo} activo={visible} direction="up" distance={30} scaleFrom={0.95} duration={0.9} delay={i * 0.25} flex="1" display="flex" w="100%" maxW={{ base: "320px", md: "none" }}>
                    <Flex
                      as="button"
                      type="button"
                      onClick={() => setModo(o.modo)}
                      direction="column"
                      align="center"
                      flex="1"
                      gap={{ base: 5, md: 6 }}
                      bg="transparent"
                      cursor="pointer"
                      role="group"
                      borderRadius="30px"
                      _focusVisible={focoBlanco}
                      sx={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {/* Doble borde: la foto y, por fuera, un filo fino turquesa oscuro desplazado. */}
                      <Box position="relative" w="100%">
                        <Box position="absolute" inset="-9px" borderRadius="30px" border={`1px solid ${TINTA}66`} pointerEvents="none" />
                        <Box
                          position="relative"
                          overflow="hidden"
                          borderRadius="22px"
                          border={`1.5px solid ${TINTA}`}
                          boxShadow={`0 0 18px ${ORO}44, 0 0 40px ${ORO}22`}
                          sx={{ aspectRatio: "1 / 1" }}
                        >
                          {o.modo === "asesoria" ? (
                            <Image
                              src="/img/me/asesora.webp"
                              alt="María Escribano"
                              w="100%"
                              h="100%"
                              objectFit="cover"
                              objectPosition="45% 30%"
                              transition="transform 0.9s cubic-bezier(0.22,1,0.36,1)"
                              _groupHover={{ transform: "scale(1.06)" }}
                            />
                          ) : (
                            <Flex w="100%" h="100%" align="center" justify="center">
                              {/* El mandala (blanco, con transparencia) usado como máscara: se pinta en turquesa oscuro. */}
                              <Box
                                w="62%"
                                bg={TINTA}
                                transition="transform 0.9s cubic-bezier(0.22,1,0.36,1)"
                                _groupHover={{ transform: "scale(1.08)" }}
                                sx={{
                                  aspectRatio: "1 / 1",
                                  WebkitMaskImage: "url('/img/icono/life.webp')",
                                  maskImage: "url('/img/icono/life.webp')",
                                  WebkitMaskSize: "contain",
                                  maskSize: "contain",
                                  WebkitMaskRepeat: "no-repeat",
                                  maskRepeat: "no-repeat",
                                  WebkitMaskPosition: "center",
                                  maskPosition: "center",
                                }}
                              />
                            </Flex>
                          )}
                        </Box>
                      </Box>
                      {/* Un solo renglón: el nombre de la puerta ES el botón. */}
                      <Flex
                        align="center"
                        justify="center"
                        gap={3}
                        mt={2}
                        px={{ base: 6, md: 7 }}
                        py="12px"
                        borderRadius="full"
                        border={`1.5px solid ${TINTA}`}
                        color={TINTA}
                        fontFamily="'EB Garamond', serif"
                        fontWeight="700"
                        fontSize={{ base: "lg", md: "xl" }}
                        letterSpacing="0.03em"
                        transition="background 0.3s ease"
                        _groupHover={{ bg: `${TINTA}14` }}
                      >
                        {t(o.texto)}
                        <Box as="span" display="inline-block" transition="transform 0.3s ease" sx={{ "button:hover &": { transform: "translateX(5px)" } }}>→</Box>
                      </Flex>
                    </Flex>
                  </Reveal>
                ))}
              </Flex>
            </Flex>
          )}
        </BandaMarmol>
      )}

      {/* ── FORMULARIO (sin caja) ── */}
      {modo && (
      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }}>
        <VStack
          w={{ base: "100%", sm: "440px" }}
          spacing={5}
          align="stretch"
          opacity={formVisible ? 1 : 0}
          transform={formVisible ? "translateY(0)" : "translateY(28px)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          {modo === "asesoria" && (
            <Text color="rgba(255,255,255,0.88)" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" textAlign="center">
              {t("auth.login.soloYo")}
            </Text>
          )}

          <Box>
            <Text color="rgba(255,255,255,0.78)" fontSize="sm" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center">
              {t("auth.campo.nombreOEmail")}
            </Text>
            <Input
              value={name}
              onChange={(e) => setname(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") contraRef.current?.focus(); }}
              // Al cargar la página el cursor ya está aquí, como en cualquier
              // programa: se llega para escribir, no para buscar dónde pulsar.
              autoFocus
              {...inputStyles}
            />
          </Box>

          <CampoContrasena
            label={t("auth.campo.contrasena")}
            value={contra}
            onChange={setcontra}
            isDisabled={bloqueado}
            onEnter={validarInicioSesion}
            autoComplete="current-password"
            inputRef={contraRef}
          />

          {message && (
            <SuccessErrorMessage
              soy={message.soy}
              title={message.title}
              description={message.description}
              onClick={() => setmessage(null)}
            />
          )}

          {sinConfirmar && (
            <Flex justify="center">
              {reenviado ? (
                <Text color="white" fontSize="sm" letterSpacing="0.04em" textAlign="center">
                  {t("auth.login.reenviado")}
                </Text>
              ) : (
                <Text
                  as="button"
                  onClick={reenviarConfirmacion}
                  color="white"
                  fontSize="sm"
                  letterSpacing="0.06em"
                  textDecoration="underline"
                  bg="transparent"
                  cursor="pointer"
                  borderRadius="md"
                  px={2}
                  _focusVisible={focoAzul}
                >
                  {t("auth.login.reenviar")}
                </Text>
              )}
            </Flex>
          )}

          {/* Botón ENTRAR */}
          <Flex justify="center" pt={{ base: 8, md: 10 }}>
            <Flex
              as="button"
              onClick={bloqueado ? undefined : validarInicioSesion}
              align="center"
              justify="center"
              gap={{ base: 3, md: 4 }}
              px={{ base: 10, md: 14 }}
              py={{ base: "14px", md: "16px" }}
              borderRadius="full"
              border="1.5px solid rgba(255,255,255,0.6)"
              bg="rgba(255,255,255,0.10)"
              cursor={bloqueado ? "not-allowed" : "pointer"}
              opacity={bloqueado ? 0.55 : 1}
              boxShadow="0 0 14px rgba(255,255,255,0.2), 0 0 32px rgba(255,255,255,0.1), 0 4px 14px rgba(0,0,0,0.18)"
              _hover={bloqueado ? {} : {
                bg: "rgba(255,255,255,0.2)",
                borderColor: "white",
                boxShadow: "0 0 20px rgba(255,255,255,0.32), 0 0 44px rgba(180,255,245,0.18), 0 6px 18px rgba(0,0,0,0.22)",
                transform: "translateY(-1px)",
              }}
              _focusVisible={focoAzul}
              transition="all 0.25s ease"
            >
              <Image
                src="/img/icono/life.webp"
                alt=""
                h={{ base: "26px", md: "32px" }}
                objectFit="contain"
                flexShrink={0}
                style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.42)) drop-shadow(0 0 20px rgba(255,255,255,0.2))" }}
              />
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "xl" }}
                letterSpacing="0.2em"
                textTransform="uppercase"
                textShadow="0 0 10px rgba(255,255,255,0.3)"
              >
                {t("auth.login.entrar")}
              </Text>
              {/* Dentro de un botón sí va el anillo de siempre: el mandala pide
                  demasiado sitio y distrae en una línea de texto. */}
              {loading && (
                <Spinner
                  size="sm"
                  thickness="2px"
                  speed="0.7s"
                  color="white"
                  emptyColor="rgba(255,255,255,0.25)"
                  flexShrink={0}
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55))" }}
                />
              )}
            </Flex>
          </Flex>

          {/* Link a recuperar contraseña */}
          <Flex justify="center" pt={2}>
            <Text
              as="button"
              onClick={() => navigate("/recuperar")}
              color="rgba(255,255,255,0.78)"
              fontSize="sm"
              letterSpacing="0.06em"
              bg="transparent"
              cursor="pointer"
              textDecoration="underline"
              textUnderlineOffset="3px"
              borderRadius="md"
              px={2}
              _hover={{ color: "white" }}
              _focusVisible={focoAzul}
              transition="all 0.22s ease"
            >
              {t("auth.login.olvidada")}
            </Text>
          </Flex>

          {/* Link a registrarse: solo en Premium. Las personas asesoradas no se registran,
              su cuenta la crea María. */}
          {modo === "premium" && (
          <Flex justify="center" pt={2}>
            <Text
              as="button"
              onClick={() => navigate(`/signIn${next !== "/home" ? `?next=${encodeURIComponent(next)}` : ""}`)}
              color="rgba(255,255,255,0.78)"
              fontSize="sm"
              letterSpacing="0.06em"
              bg="transparent"
              cursor="pointer"
              textDecoration="underline"
              textUnderlineOffset="3px"
              borderRadius="md"
              px={2}
              _hover={{ color: "white" }}
              _focusVisible={focoAzul}
              transition="all 0.22s ease"
            >
              {t("auth.login.sinCuenta")}
            </Text>
          </Flex>
          )}
          {/* Volver a elegir el tipo de inicio de sesión. */}
          <Flex justify="center" pt={2}>
            <Text
              as="button"
              onClick={() => { setModo(null); setmessage(null); }}
              color="rgba(255,255,255,0.78)"
              fontSize="sm"
              letterSpacing="0.06em"
              bg="transparent"
              cursor="pointer"
              borderRadius="md"
              px={2}
              _hover={{ color: "white" }}
              _focusVisible={focoAzul}
              transition="all 0.22s ease"
            >
              ‹ {t("comun.volver")}
            </Text>
          </Flex>
        </VStack>
      </Flex>
      )}

      </Box>

      <SiteFooter />
    </Box>
  );
}
