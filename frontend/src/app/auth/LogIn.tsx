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
import { MessagesSquare, CirclePlay } from "lucide-react";
import { CampoContrasena, inputAuthStyles, focoAzul } from "../../components/global/CampoContrasena";
import { useT } from "../../i18n";

// El estilo de los campos vive en CampoContrasena, para que el campo con ojo y
// los normales no puedan quedar distintos.
const inputStyles = inputAuthStyles;

/** Los dos inicios de sesión entre los que se elige primero. */
const OPCIONES = [
  { modo: "asesoria" as const, texto: "auth.login.opcion.asesoria" as const, Icono: MessagesSquare },
  { modo: "premium" as const, texto: "auth.login.opcion.premium" as const, Icono: CirclePlay },
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
  const [modo, setModo] = useState<"asesoria" | "premium" | null>(null);
  // Las dos cajas entran cuando el titular ya está escrito.
  const [cajas, setCajas] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  // Enter en «nombre o email» salta a la contraseña (allí Enter ya entra).
  const contraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    const c = setTimeout(() => setCajas(true), 2300);
    return () => { clearTimeout(t); clearTimeout(c); };
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

      <Box flex="1" display="flex" flexDirection="column" transform="scale(0.8)" transformOrigin="top center">

      {/* ── MANDALA + «INICIAR SESIÓN» (sin frase ni separación horizontal) ── */}
      <WelcomeCabecera
        activo={mounted}
        titulo={t("auth.login.titulo")}
        subtitulo={modo ? t(modo === "asesoria" ? "auth.login.opcion.asesoria" : "auth.login.opcion.premium") : undefined}
        sinFrase={!modo}
        sinSeparador
        mayusculas
      />

      {/* ── PRIMERO, ELEGIR: dos cajas, una por cada inicio de sesión ── */}
      {!modo && (
        <Flex justify="center" px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }}>
          <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 8 }} w="100%" maxW="860px">
            {OPCIONES.map((o, i) => (
              <Reveal key={o.modo} activo={cajas} direction="up" distance={30} scaleFrom={0.95} duration={0.9} delay={i * 0.25} flex="1" display="flex">
                <Flex
                  as="button"
                  type="button"
                  onClick={() => setModo(o.modo)}
                  direction="column"
                  align="center"
                  justify="center"
                  flex="1"
                  gap={{ base: 5, md: 6 }}
                  px={{ base: 6, md: 8 }}
                  py={{ base: 9, md: 12 }}
                  minH={{ base: "200px", md: "260px" }}
                  borderRadius="3xl"
                  bg="rgba(255,255,255,0.06)"
                  border="1px solid rgba(255,255,255,0.3)"
                  boxShadow="0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09)"
                  cursor="pointer"
                  role="group"
                  transition="background 0.3s ease, border-color 0.3s ease, transform 0.3s ease"
                  _hover={{ bg: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.85)", transform: "translateY(-5px)" }}
                  _focusVisible={focoBlanco}
                >
                  <Flex
                    align="center"
                    justify="center"
                    w={{ base: "76px", md: "92px" }}
                    h={{ base: "76px", md: "92px" }}
                    borderRadius="full"
                    border="1.5px solid rgba(255,255,255,0.7)"
                    color="white"
                    boxShadow="0 0 16px rgba(255,255,255,0.32), 0 0 36px rgba(255,255,255,0.14)"
                    transition="transform 0.4s cubic-bezier(0.22,1,0.36,1)"
                    _groupHover={{ transform: "scale(1.08)" }}
                  >
                    <o.Icono size={40} strokeWidth={1.4} />
                  </Flex>
                  <Box h="1px" w="44px" bg="linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent)" />
                  <Text
                    color="white"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "xl", md: "2xl" }}
                    letterSpacing="0.04em"
                    lineHeight="1.25"
                    textAlign="center"
                  >
                    {t(o.texto)}
                  </Text>
                </Flex>
              </Reveal>
            ))}
          </Flex>
        </Flex>
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

          {/* Link a registrarse */}
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
