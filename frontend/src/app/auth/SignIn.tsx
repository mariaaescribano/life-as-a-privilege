// SignIn.tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Input, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL } from "../../GlobalVariables";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { CreateUser, Trato } from "../../dtos/user.types";
import { gestionaError } from "../../GlobalHelper";
import SiteFooter from "../../components/global/Footer";
import { CampoContrasena, inputAuthStyles, inputFechaSx } from "../../components/global/CampoContrasena";
import { useT } from "../../i18n";
import { MiraTuCorreoModal } from "../../components/global/MiraTuCorreoModal";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

// El estilo de los campos vive en CampoContrasena, para que el campo con ojo y
// los normales no puedan quedar distintos.
const inputStyles = inputAuthStyles;

/**
 * Casilla de «cómo prefieres que me dirija hacia ti». Son dos casillas pero
 * excluyentes: marcar una desmarca la otra, y volver a pulsar la marcada la
 * deja en blanco (el campo es opcional, nadie se queda sin registrarse por no
 * elegir).
 *
 * La píldora ENTERA es la casilla: no lleva dentro un cuadradito de check. Ese
 * cuadrado repetía lo que el propio botón ya dice al marcarse (borde blanco,
 * fondo más claro y halo), y era un box dentro de otro box.
 */
const CasillaTrato = ({
  etiqueta,
  marcada,
  onClick,
  disabled,
}: {
  etiqueta: string;
  marcada: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <Flex
    as="button"
    type="button"
    onClick={disabled ? undefined : onClick}
    // Sin el cuadradito, el estado marcado solo se ve; esto se lo dice también
    // a un lector de pantalla.
    aria-pressed={marcada}
    align="center"
    px={5}
    py={2.5}
    flex="1"
    justify="center"
    borderRadius="full"
    border={`1.5px solid ${marcada ? "white" : "rgba(255,255,255,0.4)"}`}
    bg={marcada ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)"}
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.55 : 1}
    boxShadow={marcada ? "0 0 14px rgba(255,255,255,0.2)" : "none"}
    transition="all 0.2s ease"
    _hover={disabled ? {} : { borderColor: "white", bg: "rgba(255,255,255,0.14)" }}
  >
    <Text
      color="white"
      fontSize={{ base: "md", md: "lg" }}
      letterSpacing="0.08em"
      fontWeight={marcada ? "700" : "400"}
    >
      {etiqueta}
    </Text>
  </Flex>
);

/**
 * Popup de las condiciones: el texto legal completo (art. 13 RGPD) que antes
 * iba en letra pequeña bajo el formulario. Ahora el formulario solo lleva la
 * casilla «Aceptar condiciones» y quien quiera el detalle lo abre desde
 * «saber más»; el detalle largo sigue en /privacidad, enlazada aquí dentro.
 */
const PopupCondiciones = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const t = useT();
  useLockBodyScroll(isOpen, { fijarFondo: true });
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <Flex
      position="fixed"
      inset={0}
      zIndex={2000}
      align="center"
      justify="center"
      px={4}
      py={5}
      bg="rgba(0,0,0,0.72)"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="min(94vw, 520px)"
        maxH="80dvh"
        overflowY="auto"
        borderRadius="22px"
        bg="#008080"
        border="1px solid rgba(255,255,255,0.35)"
        boxShadow="0 26px 80px rgba(0,0,0,0.62)"
        px={{ base: 6, md: 9 }}
        py={{ base: 8, md: 9 }}
        fontFamily="'EB Garamond', serif"
        sx={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.35) transparent",
          "&::-webkit-scrollbar": { width: "6px", background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.35)", borderRadius: "3px" },
        }}
      >
        <Flex
          as="button"
          type="button"
          onClick={onClose}
          aria-label={t("auth.signin.entendido")}
          position="absolute"
          top="12px"
          right="12px"
          w="32px"
          h="32px"
          align="center"
          justify="center"
          borderRadius="full"
          bg="rgba(255,255,255,0.14)"
          border="1px solid rgba(255,255,255,0.35)"
          color="white"
          fontSize="sm"
          cursor="pointer"
          _hover={{ bg: "rgba(255,255,255,0.3)" }}
          transition="background 0.2s ease"
        >
          ✕
        </Flex>
        <Text color="white" fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0.04em" mb={4} pr={9}>
          {t("auth.signin.condiciones.titulo")}
        </Text>
        <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">
          {t("privacidad.infoRegistro")}{" "}
          <Text
            as="a"
            href="/privacidad"
            target="_blank"
            rel="noopener"
            textDecoration="underline"
            textUnderlineOffset="3px"
            _hover={{ color: "white" }}
          >
            {t("privacidad.enlace")}
          </Text>
          .
        </Text>
      </Box>
    </Flex>
  );
};

/** Etiqueta de campo. Sin brillo: dentro de la caja del formulario se lee sola. */
const Etiqueta = ({ children }: { children: React.ReactNode }) => (
  <Text
    color="rgba(255,255,255,0.78)"
    fontSize="sm"
    letterSpacing="0.18em"
    mb={2.5}
    fontWeight="600"
    textAlign="center"
  >
    {children}
  </Text>
);

export default function SignIn() {
  const navigate = useNavigate();
  const t = useT();
  const [params] = useSearchParams();
  const next = params.get("next") || "/home";

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contra, setContra] = useState<string>("");
  // Repetir la contraseña es OBLIGATORIO al crear cuenta: una errata al teclearla
  // a ciegas deja a la persona fuera de una cuenta que quizá ya ha pagado, y
  // recuperarla exige pasar por el email.
  const [contra2, setContra2] = useState<string>("");
  // Cómo prefiere que se le hable. null = no lo ha elegido (es opcional).
  const [trato, setTrato] = useState<Trato | null>(null);
  // Opcionales: teléfono y fecha de nacimiento (para el regalo de cumpleaños).
  const [telefono, setTelefono] = useState<string>("");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>("");
  // Condiciones: casilla obligatoria; el texto completo, en el popup de «saber más».
  const [acepta, setAcepta] = useState(false);
  const [condicionesOpen, setCondicionesOpen] = useState(false);
  const [message, setMessage] = useState<SuccessErrorMessageDto | null>(null);
  const [loading, setLoading] = useState(false);
  // Cuenta creada: ya no se entra directamente, hay que confirmar desde el correo.
  const [correoEnviadoA, setCorreoEnviadoA] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const formReveal = useReveal(0.1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const registrar = async () => {
    setLoading(true);
    try {
      const body: CreateUser = {
        name,
        email,
        password: contra,
        trato,
        telefono: telefono.trim() || null,
        fecha_nacimiento: fechaNacimiento || null,
      };

      const response = await axios.post(`${API_URL}/user/signIn`, body, {
        headers: { "Content-Type": "application/json" },
      });

      // El registro ya no devuelve sesión: la cuenta se activa con el enlace
      // del correo y luego se entra por /logIn con nombre/email y contraseña.
      if (response.data != null) {
        setMessage(null);
        setCorreoEnviadoA(response.data.email ?? email.trim());
      }
    } catch (err: any) {
      setMessage(gestionaError(err));
    } finally {
      setLoading(false);
    }
  };

  const validarRegistro = () => {
    if (!acepta) {
      setMessage({
        soy: 2,
        title: t("auth.error.condiciones"),
        description: t("auth.error.condicionesTexto"),
      });
      return;
    }
    if (name === "" || email === "" || contra === "" || contra2 === "") {
      setMessage({
        soy: 2,
        title: t("auth.error.faltanDatos"),
        description: t("auth.error.rellena"),
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage({
        soy: 2,
        title: t("auth.error.emailInvalido"),
        description: t("auth.error.emailCorrecto"),
      });
      return;
    }
    if (telefono.trim() && !/^\+?\d{6,15}$/.test(telefono.replace(/[\s().-]/g, ""))) {
      setMessage({
        soy: 2,
        title: t("auth.error.telefonoInvalido"),
        description: t("auth.error.telefonoCorrecto"),
      });
      return;
    }
    if (contra.length < 6) {
      setMessage({
        soy: 2,
        title: t("auth.error.contraCorta"),
        description: t("auth.error.contraCorta6"),
      });
      return;
    }
    if (contra !== contra2) {
      setMessage({
        soy: 2,
        title: t("auth.error.noCoinciden"),
        description: t("auth.error.noCoincidenTexto"),
      });
      return;
    }
    registrar();
  };

  // Bloquea el botón mientras carga Y también cuando ya se ha creado la cuenta
  // (popup visible): así no se puede registrar dos veces.
  const bloqueado = loading || correoEnviadoA !== null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="public" />

      <Box flex="1" display="flex" flexDirection="column" transform="scale(0.8)" transformOrigin="top center">

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.webp"
          alt=""
          h={{ base: "60px", md: "80px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,0.42)) drop-shadow(0 0 26px rgba(255,255,255,0.22)) drop-shadow(0 0 52px rgba(180,255,245,0.16))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 8, md: 10 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="700"
          letterSpacing="0.12em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 14px rgba(255,255,255,0.38), 0 0 30px rgba(255,255,255,0.22), 0 0 56px rgba(180,255,245,0.16)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          {t("auth.signin.titulo")}
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.7"
          letterSpacing="0.03em"
          maxW={{ base: "100%", md: "560px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(16px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          {t("auth.signin.subtitulo")}
        </Text>
      </Flex>

      {/* ── FORMULARIO (caja suave; en pantalla ancha, campos a dos columnas) ── */}
      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 10, md: 14 }} pb={{ base: 24, md: 32 }}>
        <VStack
          ref={formReveal.ref}
          w={{ base: "100%", md: "740px" }}
          spacing={6}
          align="stretch"
          bg="rgba(255,255,255,0.05)"
          border="1px solid rgba(255,255,255,0.16)"
          borderRadius="28px"
          px={{ base: 5, md: 10 }}
          py={{ base: 8, md: 10 }}
          boxShadow="0 18px 44px rgba(0,0,0,0.16)"
          opacity={formReveal.visible ? 1 : 0}
          transform={formReveal.visible ? "translateY(0)" : "translateY(28px)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Box>
              <Etiqueta>{t("auth.campo.nombre")}</Etiqueta>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                {...inputStyles}
              />
            </Box>
            <Box>
              <Etiqueta>{t("auth.campo.email")}</Etiqueta>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                {...inputStyles}
              />
            </Box>
          </SimpleGrid>

          <Box>
            <Etiqueta>{t("auth.signin.trato")}</Etiqueta>
            <Flex gap={3}>
              <CasillaTrato
                etiqueta={t("auth.signin.tratoEl")}
                marcada={trato === "el"}
                disabled={bloqueado}
                onClick={() => setTrato(trato === "el" ? null : "el")}
              />
              <CasillaTrato
                etiqueta={t("auth.signin.tratoElla")}
                marcada={trato === "ella"}
                disabled={bloqueado}
                onClick={() => setTrato(trato === "ella" ? null : "ella")}
              />
            </Flex>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} alignItems="start">
            <Box>
              <Etiqueta>{t("auth.campo.telefono")}</Etiqueta>
              <Input
                type="tel"
                autoComplete="tel"
                placeholder="+34 600 000 000"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                {...inputStyles}
              />
            </Box>
            <Box>
              <Etiqueta>{t("auth.campo.fechaNacimiento")}</Etiqueta>
              <Input
                type="date"
                autoComplete="bday"
                max={new Date().toISOString().slice(0, 10)}
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                {...inputStyles}
                sx={inputFechaSx}
              />
              <Text color="rgba(255,255,255,0.72)" fontSize="sm" mt={2} textAlign="center" lineHeight="1.5">
                {t("auth.signin.fechaRegalo")}
              </Text>
            </Box>
          </SimpleGrid>

          {/* Rayita fina: aquí empieza la contraseña. */}
          <Box h="1px" bg="rgba(255,255,255,0.16)" />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <CampoContrasena
              label={t("auth.campo.contrasena")}
              value={contra}
              onChange={setContra}
              isDisabled={bloqueado}
              autoComplete="new-password"
            />

            <CampoContrasena
              label={t("auth.campo.repiteContrasena")}
              value={contra2}
              onChange={setContra2}
              isDisabled={bloqueado}
              onEnter={validarRegistro}
              autoComplete="new-password"
            />
          </SimpleGrid>

          {/* ── ACEPTAR CONDICIONES ──
              La casilla sustituye a la letra pequeña del RGPD: el texto
              completo se abre en el popup de «saber más» (y el detalle largo
              sigue viviendo en /privacidad, enlazada dentro del popup). */}
          <Flex justify="center" align="center" gap={3} pt={1}>
            <Flex
              as="button"
              type="button"
              onClick={bloqueado ? undefined : () => setAcepta((v) => !v)}
              aria-pressed={acepta}
              w="22px"
              h="22px"
              flexShrink={0}
              align="center"
              justify="center"
              borderRadius="6px"
              border={`1.5px solid ${acepta ? "white" : "rgba(255,255,255,0.5)"}`}
              bg={acepta ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.06)"}
              cursor={bloqueado ? "not-allowed" : "pointer"}
              _hover={bloqueado ? {} : { borderColor: "white" }}
              transition="all 0.2s ease"
            >
              {acepta && (
                <Box as="span" color="#008080" fontWeight="700" fontSize="15px" lineHeight="1">
                  ✓
                </Box>
              )}
            </Flex>
            <Text
              as="button"
              type="button"
              onClick={bloqueado ? undefined : () => setAcepta((v) => !v)}
              color="rgba(255,255,255,0.92)"
              fontSize={{ base: "md", md: "lg" }}
              bg="transparent"
              cursor={bloqueado ? "not-allowed" : "pointer"}
              userSelect="none"
            >
              {t("auth.signin.aceptar")}
            </Text>
            <Text
              as="button"
              type="button"
              onClick={() => setCondicionesOpen(true)}
              color="rgba(255,255,255,0.7)"
              fontSize="sm"
              fontStyle="italic"
              bg="transparent"
              cursor="pointer"
              textDecoration="underline"
              textUnderlineOffset="3px"
              _hover={{ color: "white" }}
              transition="color 0.2s ease"
            >
              {t("auth.signin.saberMas")}
            </Text>
          </Flex>

          {message && (
            <SuccessErrorMessage
              soy={message.soy}
              title={message.title}
              description={message.description}
              onClick={() => setMessage(null)}
            />
          )}

          {/* Botón REGISTRARME */}
          <Flex justify="center" pt={{ base: 3, md: 4 }}>
            <Flex
              as="button"
              onClick={bloqueado ? undefined : validarRegistro}
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
                {t("auth.signin.boton")}
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

          {/* Link a iniciar sesión */}
          <Flex justify="center" pt={2}>
            <Text
              as="button"
              onClick={() => navigate(`/logIn${next !== "/home" ? `?next=${encodeURIComponent(next)}` : ""}`)}
              color="rgba(255,255,255,0.78)"
              fontSize="sm"
              letterSpacing="0.06em"
              bg="transparent"
              cursor="pointer"
              textDecoration="underline"
              textUnderlineOffset="3px"
              _hover={{ color: "white" }}
              transition="all 0.22s ease"
            >
              {t("auth.signin.yaTienes")}
            </Text>
          </Flex>
        </VStack>
      </Flex>

      </Box>

      <SiteFooter />

      <PopupCondiciones isOpen={condicionesOpen} onClose={() => setCondicionesOpen(false)} />

      <MiraTuCorreoModal
        isOpen={correoEnviadoA !== null}
        email={correoEnviadoA ?? ""}
        onAceptar={() => navigate(
          `/logIn?pendiente=1${next !== "/home" ? `&next=${encodeURIComponent(next)}` : ""}`,
          { replace: true },
        )}
      />
    </Box>
  );
}
