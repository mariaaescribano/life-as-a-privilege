// RecuperarPassword.tsx
//
// Una sola ruta (/recuperar) con dos caras:
//   · sin ?token=  → formulario para pedir el email de recuperación
//   · con ?token=  → formulario para elegir la contraseña nueva
//
// Antes no existía nada de esto: quien se registraba con email y contraseña y la
// olvidaba perdía el acceso a un recorrido ya pagado.
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import { API_URL } from "../../GlobalVariables";
import { gestionaError } from "../../GlobalHelper";
import { CampoContrasena, inputAuthStyles } from "../../components/global/CampoContrasena";

// El estilo de los campos vive en CampoContrasena, para que el campo con ojo y
// los normales no puedan quedar distintos.
const inputStyles = inputAuthStyles;

const Etiqueta = ({ children }: { children: React.ReactNode }) => (
  <Text
    color="rgba(255,255,255,0.78)"
    fontSize="sm"
    letterSpacing="0.18em"
    mb={2.5}
    fontWeight="600"
    textAlign="center"
    textShadow="0 0 8px rgba(255,255,255,0.35)"
  >
    {children}
  </Text>
);

const BotonPrincipal = ({
  texto,
  onClick,
  bloqueado,
  loading,
}: {
  texto: string;
  onClick: () => void;
  bloqueado: boolean;
  loading: boolean;
}) => (
  <Flex justify="center" pt={{ base: 8, md: 10 }}>
    <Flex
      as="button"
      onClick={bloqueado ? undefined : onClick}
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
      _hover={
        bloqueado
          ? {}
          : {
              bg: "rgba(255,255,255,0.2)",
              borderColor: "white",
              boxShadow:
                "0 0 28px rgba(255,255,255,0.55), 0 0 58px rgba(180,255,245,0.35), 0 6px 18px rgba(0,0,0,0.22)",
              transform: "translateY(-1px)",
            }
      }
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
        {texto}
      </Text>
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
);

export default function RecuperarPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const conToken = token !== "";

  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [message, setMessage] = useState<SuccessErrorMessageDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [hecho, setHecho] = useState(false);
  const [mounted, setMounted] = useState(false);
  const redirigido = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Tras cambiar la contraseña, al login.
  useEffect(() => {
    if (hecho && conToken && !redirigido.current) {
      redirigido.current = true;
      const t = setTimeout(() => navigate("/logIn", { replace: true }), 2600);
      return () => clearTimeout(t);
    }
  }, [hecho, conToken, navigate]);

  const pedirEnlace = async () => {
    if (!email.trim()) {
      setMessage({ soy: 2, title: "Falta el email", description: "Escribe el email de tu cuenta" });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await axios.post(`${API_URL}/user/password/forgot`, { email: email.trim() });
      // El servidor responde igual exista o no la cuenta, así que el mensaje
      // tiene que ser igual de neutro: no delatamos quién está registrado.
      setHecho(true);
      setMessage({
        soy: 1,
        title: "Mira tu correo",
        description:
          "Si ese email tiene una cuenta, te acabamos de enviar un enlace para elegir una contraseña nueva. Caduca en una hora.",
      });
    } catch (err: any) {
      setMessage(gestionaError(err));
    } finally {
      setLoading(false);
    }
  };

  const cambiarPassword = async () => {
    if (pass1.length < 6) {
      setMessage({
        soy: 2,
        title: "Contraseña muy corta",
        description: "Tiene que tener al menos 6 caracteres",
      });
      return;
    }
    if (pass1 !== pass2) {
      setMessage({ soy: 2, title: "No coinciden", description: "Las dos contraseñas tienen que ser iguales" });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await axios.post(`${API_URL}/user/password/reset`, { token, password: pass1 });
      setHecho(true);
      setMessage({
        soy: 1,
        title: "Contraseña cambiada",
        description: "Ya puedes entrar con la nueva. Te llevamos al inicio de sesión…",
      });
    } catch (err: any) {
      setMessage(gestionaError(err));
    } finally {
      setLoading(false);
    }
  };

  const bloqueado = loading || hecho;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="public" />

      <Box flex="1" display="flex" flexDirection="column" transform="scale(0.8)" transformOrigin="top center">
        {/* ── MANDALA ── */}
        <Flex justify="center" pt={{ base: 10, md: 14 }}>
          <Image
            src="/img/icono/life.png"
            alt=""
            h={{ base: "60px", md: "80px" }}
            objectFit="contain"
            style={{
              filter:
                "drop-shadow(0 0 11px rgba(255,255,255,0.78)) drop-shadow(0 0 26px rgba(255,255,255,0.42)) drop-shadow(0 0 52px rgba(180,255,245,0.32))",
            }}
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
            {conToken ? "Nueva contraseña" : "Recuperar contraseña"}
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
            {conToken
              ? "Elige la contraseña con la que entrarás a partir de ahora"
              : "Te enviamos un enlace al email de tu cuenta"}
          </Text>
        </Flex>

        {/* ── FORMULARIO ── */}
        <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }}>
          <VStack w={{ base: "100%", sm: "440px" }} spacing={5} align="stretch">
            {conToken ? (
              <>
                <CampoContrasena
                  label="NUEVA CONTRASEÑA"
                  value={pass1}
                  onChange={setPass1}
                  isDisabled={bloqueado}
                  autoComplete="new-password"
                />
                <CampoContrasena
                  label="REPÍTELA"
                  value={pass2}
                  onChange={setPass2}
                  isDisabled={bloqueado}
                  onEnter={cambiarPassword}
                  autoComplete="new-password"
                />
              </>
            ) : (
              <Box>
                <Etiqueta>EMAIL</Etiqueta>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isDisabled={bloqueado}
                  onKeyDown={(e) => { if (e.key === "Enter" && !bloqueado) pedirEnlace(); }}
                  {...inputStyles}
                />
              </Box>
            )}

            {message && (
              <SuccessErrorMessage
                soy={message.soy}
                title={message.title}
                description={message.description}
                onClick={() => setMessage(null)}
              />
            )}

            {!hecho && (
              <BotonPrincipal
                texto={conToken ? "Guardar" : "Enviar enlace"}
                onClick={conToken ? cambiarPassword : pedirEnlace}
                bloqueado={bloqueado}
                loading={loading}
              />
            )}

            <Flex justify="center" pt={2}>
              <Text
                as="button"
                onClick={() => navigate("/logIn")}
                color="rgba(255,255,255,0.78)"
                fontSize="sm"
                letterSpacing="0.06em"
                bg="transparent"
                cursor="pointer"
                textShadow="0 0 8px rgba(255,255,255,0.35)"
                _hover={{ color: "white", textShadow: "0 0 12px rgba(255,255,255,0.6), 0 0 24px rgba(255,255,255,0.35)" }}
                transition="all 0.22s ease"
              >
                Volver a iniciar sesión
              </Text>
            </Flex>
          </VStack>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
