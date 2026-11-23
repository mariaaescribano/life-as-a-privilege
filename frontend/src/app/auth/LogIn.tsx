// LogIn.tsx
import { MandalaTinte } from "../../components/global/MandalaTinte";
import { olvidarPersona } from "../../api/persona";
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL, FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
// (Premium aparcado) import { recordarSoloPremium } from "../../api/sesion";
import axios from "axios";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { LoginUser } from "../../dtos/user.types";
import { gestionaError } from "../../GlobalHelper";
import TrasCabecera from "../../components/global/TrasCabecera";
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

// Las dos puertas van sobre el mármol: letra turquesa oscuro y oro en el halo (ver DISENO.md).
const TINTA = "#004f4f";
const ORO = "#b08d3f";
const OPCIONES = [
  { modo: "asesoria" as const, texto: "auth.login.opcion.asesoria" as const },
  { modo: "premium" as const, texto: "auth.login.opcion.lectura" as const },
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
    params.get("modo") === "premium" ? "premium" : null,
  );
  const formRef = useRef<HTMLDivElement>(null);
  const [formVisible, setFormVisible] = useState(false);
  // Enter en «nombre o email» salta a la contraseña (allí Enter ya entra).
  const contraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Al elegir una puerta, el formulario se enseña debajo.
    if (!modo) { setFormVisible(false); return; }
    const id = setTimeout(() => {
      setFormVisible(true);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 40);
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

        olvidarPersona(); // un inicio de sesión nuevo nunca mira a otra persona
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
          // Premium APARCADO: la redirección de las cuentas solo-Premium está comentada.
          // const solo = me.data?.solo_premium === true;
          // recordarSoloPremium(solo);
          // if (solo && !next.startsWith("/premium/avisos")) {
          //   const nueva = window.open("/premium/espacio", "_blank");
          //   destinoRef.current = nueva ? "/premium" : "/premium/espacio";
          // }
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

  const etiqueta = { color: T, fontSize: "sm", letterSpacing: "0.18em", mb: 2.5, fontWeight: "600", textAlign: "center" as const, textTransform: "uppercase" as const };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={FONDO_PAGINA_BEIGE} fontFamily="'EB Garamond', serif">
      <SiteHeader variant="public" />

      <Box flex="1" display="flex" flexDirection="column">

      {/* ── MANDALA + «ENTRA A TU CUENTA» ── */}
      <WelcomeCabecera activo={mounted} titulo={t("auth.login.titulo")} sinFrase sinSeparador mayusculas />

      <TrasCabecera flex="1" display="flex" flexDirection="column">
      {/* ── PRIMERO, ELEGIR: dos puertas sobre el mármol ── */}
      <Box mt={{ base: 6, md: 10 }}>
        <BandaMarmol pt={{ base: "104px", md: "84px" }} pb={{ base: "116px", md: "88px" }}>
          {(visible) => (
            <Flex
              w="100%"
              maxW="820px"
              mx="auto"
              px={{ base: 5, md: 10 }}
              direction={{ base: "column", md: "row" }}
              align="stretch"
              justify="center"
              gap={{ base: 6, md: 8 }}
            >
              {OPCIONES.map((o, i) => {
                const elegida = modo === o.modo;
                return (
                  <Reveal key={o.modo} activo={visible} direction="up" distance={26} scaleFrom={0.96} duration={0.9} delay={i * 0.2} flex="1" display="flex">
                    <Flex
                      as="button"
                      type="button"
                      onClick={() => setModo(o.modo)}
                      aria-pressed={elegida}
                      direction="column"
                      align="center"
                      justify="center"
                      gap={{ base: 4, md: 5 }}
                      flex="1"
                      w="100%"
                      px={{ base: 5, md: 6 }}
                      py={{ base: 8, md: 10 }}
                      borderRadius="2xl"
                      bg={elegida ? `${TINTA}14` : "transparent"}
                      border={`${elegida ? 2 : 1.5}px solid ${TINTA}`}
                      boxShadow={`0 0 ${elegida ? 26 : 16}px ${ORO}${elegida ? "77" : "44"}, 0 0 ${elegida ? 56 : 36}px ${ORO}${elegida ? "44" : "22"}`}
                      cursor="pointer"
                      transition="background 0.25s ease, box-shadow 0.3s ease, transform 0.28s ease"
                      _hover={{ bg: `${TINTA}12`, transform: "translateY(-3px)" }}
                      _focusVisible={focoBlanco}
                    >
                      {o.modo === "premium" ? (
                        // «Lectura de mi carta astral»: el icono de las estrellas de Astrología, en turquesa.
                        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={TINTA} w={{ base: "52px", md: "64px" }} h={{ base: "52px", md: "64px" }} aria-hidden="true">
                          <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm457-560 21-89-71-59 94-8 36-84 36 84 94 8-71 59 21 89-80-47-80 47ZM480-481Z" />
                        </Box>
                      ) : (
                        <MandalaTinte h={{ base: "52px", md: "64px" }} color={TINTA} />
                      )}
                      <Box h="1px" w="56px" bg={`linear-gradient(to right, transparent, ${TINTA}99, transparent)`} />
                      <Text
                        color={TINTA}
                        fontFamily="'EB Garamond', serif"
                        fontWeight="700"
                        fontSize={{ base: "lg", md: "xl" }}
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        lineHeight="1.3"
                        textAlign="center"
                      >
                        {t(o.texto)}
                      </Text>
                    </Flex>
                  </Reveal>
                );
              })}
            </Flex>
          )}
        </BandaMarmol>
      </Box>

      {/* ── FORMULARIO, debajo de la puerta elegida ── */}
      {modo && (
      <Flex ref={formRef} flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 6, md: 8 }} pb={{ base: 24, md: 32 }}>
        <VStack
          w={{ base: "100%", sm: "440px" }}
          spacing={5}
          align="stretch"
          opacity={formVisible ? 1 : 0}
          transform={formVisible ? "translateY(0)" : "translateY(28px)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          {modo === "asesoria" && (
            <Text color={T} fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" textAlign="center">
              {t("auth.login.soloYo")}
            </Text>
          )}

          <Box>
            <Text {...etiqueta}>{t("auth.campo.nombreOEmail")}</Text>
            <Input
              value={name}
              onChange={(e) => setname(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") contraRef.current?.focus(); }}
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
                <Text color={T} fontSize="sm" letterSpacing="0.04em" textAlign="center">
                  {t("auth.login.reenviado")}
                </Text>
              ) : (
                <Text
                  as="button"
                  onClick={reenviarConfirmacion}
                  color={T}
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
          <Flex justify="center" pt={{ base: 4, md: 5 }}>
            <Flex
              as="button"
              onClick={bloqueado ? undefined : validarInicioSesion}
              align="center"
              justify="center"
              gap={{ base: 3, md: 4 }}
              px={{ base: 10, md: 14 }}
              py={{ base: "12px", md: "14px" }}
              borderRadius="full"
              border={`1.5px solid ${T}`}
              bg={T}
              cursor={bloqueado ? "not-allowed" : "pointer"}
              opacity={bloqueado ? 0.6 : 1}
              _hover={bloqueado ? {} : { opacity: 0.92, transform: "translateY(-2px)" }}
              _focusVisible={focoAzul}
              transition="all 0.25s ease"
            >
              <Text
                color={FONDO_PAGINA_BEIGE}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.2em"
                textTransform="uppercase"
              >
                {t("auth.login.entrar")}
              </Text>
              {loading && (
                <Spinner size="sm" thickness="2px" speed="0.7s" color={FONDO_PAGINA_BEIGE} emptyColor={`${FONDO_PAGINA_BEIGE}44`} flexShrink={0} />
              )}
            </Flex>
          </Flex>

          {/* Link a recuperar contraseña */}
          <Flex justify="center" pt={2}>
            <Text
              as="button"
              onClick={() => navigate("/recuperar")}
              color={`${T}cc`}
              fontSize="sm"
              letterSpacing="0.06em"
              bg="transparent"
              cursor="pointer"
              textDecoration="underline"
              textUnderlineOffset="3px"
              borderRadius="md"
              px={2}
              _hover={{ color: T }}
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
              color={`${T}cc`}
              fontSize="sm"
              letterSpacing="0.06em"
              bg="transparent"
              cursor="pointer"
              textDecoration="underline"
              textUnderlineOffset="3px"
              borderRadius="md"
              px={2}
              _hover={{ color: T }}
              _focusVisible={focoAzul}
              transition="all 0.22s ease"
            >
              {t("auth.login.sinCuenta")}
            </Text>
          </Flex>
          )}
        </VStack>
      </Flex>
      )}
      </TrasCabecera>

      </Box>

      <TrasCabecera><SiteFooter /></TrasCabecera>
    </Box>
  );
}
