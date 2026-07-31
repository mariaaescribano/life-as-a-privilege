// SignIn.tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL } from "../../GlobalVariables";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { CreateUser, Trato } from "../../dtos/user.types";
import { gestionaError } from "../../GlobalHelper";
import SiteFooter from "../../components/global/Footer";
import { CampoContrasena, inputAuthStyles } from "../../components/global/CampoContrasena";

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
    boxShadow={marcada ? "0 0 16px rgba(255,255,255,0.35)" : "none"}
    transition="all 0.2s ease"
    _hover={disabled ? {} : { borderColor: "white", bg: "rgba(255,255,255,0.14)" }}
  >
    <Text
      color="white"
      fontSize={{ base: "md", md: "lg" }}
      letterSpacing="0.08em"
      fontWeight={marcada ? "700" : "400"}
      textShadow="0 0 8px rgba(255,255,255,0.35)"
    >
      {etiqueta}
    </Text>
  </Flex>
);

export default function SignIn() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/home";
  const destinoRef = useRef<string>(next);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contra, setContra] = useState<string>("");
  // Repetir la contraseña es OBLIGATORIO al crear cuenta: una errata al teclearla
  // a ciegas deja a la persona fuera de una cuenta que quizá ya ha pagado, y
  // recuperarla exige pasar por el email.
  const [contra2, setContra2] = useState<string>("");
  // Cómo prefiere que se le hable. null = no lo ha elegido (es opcional).
  const [trato, setTrato] = useState<Trato | null>(null);
  const [message, setMessage] = useState<SuccessErrorMessageDto | null>(null);
  const [loading, setLoading] = useState(false);
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
      const body: CreateUser = { name, email, password: contra, trato };

      const response = await axios.post(`${API_URL}/user/signIn`, body, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data != null) {
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("img", "/img/icono/noImg.png");

        // Si el email es de admin, hace falta la contraseña de administración:
        // lo mandamos a la pantalla de desbloqueo (estar en la lista no basta).
        try {
          const me = await axios.get(`${API_URL}/user/me`, {
            headers: { Authorization: `Bearer ${response.data.token}` },
          });
          localStorage.removeItem("isAdmin");
          if (me.data?.admin_email && next === "/home") {
            destinoRef.current = "/admin/login";
          }
        } catch { /* destino normal */ }

        setMessage({
          soy: 1,
          title: "¡Cuenta creada!",
          description: "Continuamos en un instante...",
        });
      }
    } catch (err: any) {
      setMessage(gestionaError(err));
    } finally {
      setLoading(false);
    }
  };

  const validarRegistro = () => {
    if (name === "" || email === "" || contra === "" || contra2 === "") {
      setMessage({
        soy: 2,
        title: "Faltan datos",
        description: "Rellena todos los campos",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage({
        soy: 2,
        title: "Email no válido",
        description: "Introduce un email correcto",
      });
      return;
    }
    if (contra.length < 4) {
      setMessage({
        soy: 2,
        title: "Contraseña muy corta",
        description: "Usa al menos 4 caracteres",
      });
      return;
    }
    if (contra !== contra2) {
      setMessage({
        soy: 2,
        title: "Las contraseñas no coinciden",
        description: "Repite la misma contraseña en los dos campos",
      });
      return;
    }
    registrar();
  };

  useEffect(() => {
    if (message?.soy === 1) {
      const timer = setTimeout(() => navigate(destinoRef.current, { replace: true }), 1800);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Bloquea el botón mientras carga Y también cuando ya se ha creado la cuenta
  // (mensaje de éxito visible): así no se puede volver a pulsar antes de redirigir.
  const bloqueado = loading || message?.soy === 1;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="public" />

      <Box flex="1" display="flex" flexDirection="column" transform="scale(0.8)" transformOrigin="top center">

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "60px", md: "80px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,0.78)) drop-shadow(0 0 26px rgba(255,255,255,0.42)) drop-shadow(0 0 52px rgba(180,255,245,0.32))" }}
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
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 18px rgba(255,255,255,0.85), 0 0 38px rgba(255,255,255,0.55), 0 0 70px rgba(180,255,245,0.45)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          Crear cuenta
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.7"
          letterSpacing="0.03em"
          maxW={{ base: "100%", md: "560px" }}
          textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.22)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(16px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          Empieza El Mapa de Life as a Privilege
        </Text>
      </Flex>

      {/* ── FORMULARIO (sin caja) ── */}
      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }}>
        <VStack
          ref={formReveal.ref}
          w={{ base: "100%", sm: "440px" }}
          spacing={5}
          align="stretch"
          opacity={formReveal.visible ? 1 : 0}
          transform={formReveal.visible ? "translateY(0)" : "translateY(28px)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          <Box>
            <Text color="rgba(255,255,255,0.78)" fontSize="sm" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
              NOMBRE
            </Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              {...inputStyles}
            />
          </Box>

          <Box>
            <Text color="rgba(255,255,255,0.78)" fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.14em" mb={2.5}
                  fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
              ¿CÓMO PREFIERES QUE ME DIRIJA HACIA TI?
            </Text>
            <Flex gap={3}>
              <CasillaTrato
                etiqueta="Él"
                marcada={trato === "el"}
                disabled={bloqueado}
                onClick={() => setTrato(trato === "el" ? null : "el")}
              />
              <CasillaTrato
                etiqueta="Ella"
                marcada={trato === "ella"}
                disabled={bloqueado}
                onClick={() => setTrato(trato === "ella" ? null : "ella")}
              />
            </Flex>
          </Box>

          <Box>
            <Text color="rgba(255,255,255,0.78)" fontSize="sm" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
              EMAIL
            </Text>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              {...inputStyles}
            />
          </Box>

          <CampoContrasena
            label="CONTRASEÑA"
            value={contra}
            onChange={setContra}
            isDisabled={bloqueado}
            autoComplete="new-password"
          />

          <CampoContrasena
            label="REPITE LA CONTRASEÑA"
            value={contra2}
            onChange={setContra2}
            isDisabled={bloqueado}
            onEnter={validarRegistro}
            autoComplete="new-password"
          />

          {message && (
            <SuccessErrorMessage
              soy={message.soy}
              title={message.title}
              description={message.description}
              onClick={() => setMessage(null)}
            />
          )}

          {/* Botón REGISTRARME */}
          <Flex justify="center" pt={{ base: 8, md: 10 }}>
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
              boxShadow="0 0 18px rgba(255,255,255,0.36), 0 0 40px rgba(255,255,255,0.18), 0 0 70px rgba(180,255,245,0.18), 0 4px 14px rgba(0,0,0,0.18)"
              _hover={bloqueado ? {} : {
                bg: "rgba(255,255,255,0.2)",
                borderColor: "white",
                boxShadow: "0 0 28px rgba(255,255,255,0.55), 0 0 58px rgba(180,255,245,0.35), 0 6px 18px rgba(0,0,0,0.22)",
                transform: "translateY(-1px)",
              }}
              transition="all 0.25s ease"
            >
              <Image
                src="/img/icono/life.png"
                alt=""
                h={{ base: "26px", md: "32px" }}
                objectFit="contain"
                flexShrink={0}
                style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.7)) drop-shadow(0 0 20px rgba(255,255,255,0.35))" }}
              />
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "xl" }}
                letterSpacing="0.2em"
                textTransform="uppercase"
                textShadow="0 0 12px rgba(255,255,255,0.65), 0 0 26px rgba(255,255,255,0.4)"
              >
                Registrarme
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
              textShadow="0 0 8px rgba(255,255,255,0.35)"
              _hover={{ color: "white", textShadow: "0 0 12px rgba(255,255,255,0.6), 0 0 24px rgba(255,255,255,0.35)" }}
              transition="all 0.22s ease"
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </Text>
          </Flex>
        </VStack>
      </Flex>

      </Box>

      <SiteFooter />
    </Box>
  );
}
