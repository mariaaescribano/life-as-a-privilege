import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../GlobalVariables";
import { useIdioma } from "../../i18n";
import { Reveal } from "../global/Reveal";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { EnlaceBaja } from "../global/EnlaceBaja";
import { focoBlanco } from "../global/foco";
import { arenaBg, arenaTinta } from "../../data/landingProyectos";

/**
 * Cabecera de la portada: a la izquierda la frase (una sola línea, sin caja, para
 * que respire) con el formulario de nombre + email debajo; a la derecha la foto
 * de María y, debajo, lo que hace. En móvil se apila: frase, formulario, foto.
 *
 * El formulario apunta a la misma lista que `SubscribeBox` (POST /subscribe) y
 * además manda el nombre. Fuera de cajas todo el texto es blanco y sin sombra;
 * la luz la ponen el halo de los campos, el del botón y el de la foto.
 */
const HALO_CAMPO = "0 0 10px rgba(255,255,255,0.04)";
const HALO_BOTON = "0 0 10px rgba(255,255,255,0.10), 0 0 22px rgba(180,255,245,0.05)";
const HALO_BOTON_HOVER = "0 0 14px rgba(255,255,255,0.16), 0 0 30px rgba(180,255,245,0.08)";
const HALO_FOTO = "0 0 16px rgba(255,255,255,0.11), 0 0 34px rgba(255,255,255,0.06), 0 0 60px rgba(180,255,245,0.06)";

type Estado = "idle" | "loading" | "ok" | "invalid" | "error";

const campo = (invalido: boolean) => ({
  w: "100%",
  bg: "rgba(0,40,40,0.28)",
  border: invalido ? "1px solid rgba(255,150,150,0.7)" : "1px solid rgba(255,255,255,0.32)",
  borderRadius: "full",
  color: "white",
  fontFamily: "'EB Garamond', serif",
  fontSize: { base: "md", md: "lg" },
  px: 6,
  py: 3,
  h: "auto",
  boxShadow: HALO_CAMPO,
  _placeholder: { color: "rgba(255,255,255,0.55)" },
  _hover: { borderColor: "rgba(255,255,255,0.5)" },
  _focus: { borderColor: "white", boxShadow: HALO_BOTON },
  _focusVisible: { borderColor: "white", boxShadow: HALO_BOTON },
});

/** Los iconos de las ocho disciplinas: solo para dar estilo, no se pulsan. */
export type IconoDisciplina = {
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
};

const WelcomeHero = ({ activo, iconos = [] }: { activo: boolean; iconos?: IconoDisciplina[] }) => {
  const { t, idioma } = useIdioma();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");

  const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const enviar = async () => {
    if (estado === "loading") return;
    if (!emailValido(email.trim())) {
      setEstado("invalid");
      return;
    }
    setEstado("loading");
    try {
      await axios.post(`${API_URL}/subscribe`, { email: email.trim(), nombre: nombre.trim(), origen: "portada", idioma });
      setEstado("ok");
      setNombre("");
      setEmail("");
    } catch {
      setEstado("error");
    }
  };

  // Tras el «Registrado correctamente», el formulario vuelve a los 4 s.
  useEffect(() => {
    if (estado !== "ok") return;
    const id = setTimeout(() => setEstado("idle"), 4000);
    return () => clearTimeout(id);
  }, [estado]);

  return (
    <Flex
      w="100%"
      maxW="1240px"
      mx="auto"
      px={{ base: 6, md: 10, lg: 16 }}
      pt={{ base: 10, md: 14, lg: 20 }}
      pb={0}
      direction={{ base: "column", lg: "row" }}
      align={{ base: "stretch", lg: "center" }}
      justify="center"
      gap={{ base: 10, lg: 14 }}
    >
      {/* ── Izquierda: frase + formulario ── */}
      <Flex direction="column" align={{ base: "center", lg: "stretch" }} textAlign={{ base: "center", lg: "left" }} flex={{ base: "1", lg: "0 1 620px" }} minW={0} gap={{ base: 8, md: 10 }}>
        {/* ── Los ocho iconos en una línea: círculo con la foto de su disciplina y
            su halo. Decorativo (aria-hidden): entran de uno en uno, de izquierda
            a derecha. */}
        {iconos.length > 0 && (
          <Flex
            aria-hidden="true"
            justify={{ base: "center", lg: "flex-start" }}
            gap={{ base: "7px", sm: "10px", md: "12px" }}
            flexWrap="nowrap"
          >
            {iconos.map((d, i) => {
              const conFondo = hasDisciplinaBg(d.name);
              return (
                <Reveal key={d.name} activo={activo} direction="up" distance={14} scaleFrom={0.7} duration={0.7} delay={0.1 + i * 0.09}>
                  <Box
                    position="relative"
                    w={{ base: "34px", sm: "40px", md: "50px" }}
                    h={{ base: "34px", sm: "40px", md: "50px" }}
                    borderRadius="full"
                    border={`2px solid ${d.txt}`}
                    bg={conFondo ? "transparent" : d.bg}
                    boxShadow={`0 0 10px ${d.txt}66, 0 0 22px ${d.txt}33`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    flexShrink={0}
                  >
                    {conFondo && <DisciplinaBgLayer nom={d.name} borderRadius="full" />}
                    {/* El icono se pinta a 30 px y se escala con el círculo. */}
                    <Box
                      position="relative"
                      zIndex={1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transform={{ base: "scale(0.62)", sm: "scale(0.78)", md: "scale(1)" }}
                    >
                      {d.renderIcon("30px")}
                    </Box>
                  </Box>
                </Reveal>
              );
            })}
          </Flex>
        )}

        <Flex direction="column" align={{ base: "center", lg: "stretch" }} gap={{ base: 4, md: 5 }}>
          <Reveal activo={activo} direction="up" distance={22} duration={0.9} delay={0.1}>
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "3xl", md: "4xl", lg: "clamp(2rem, 3.1vw, 3.1rem)" }}
              letterSpacing="0.01em"
              lineHeight="1.2"
              maxW="640px"
              textAlign={{ base: "center", lg: "left" }}
            >
              {t("welcome.hero.frase")}
            </Text>
          </Reveal>
          {/* Rayita que se dibuja + etiqueta: la «introducción gratuita» se lee
              como un detalle fino, no como parte del titular. */}
          <Reveal activo={activo} direction="none" duration={0.8} delay={0.45}>
            <Flex align="center" justify={{ base: "center", lg: "flex-start" }} gap={4}>
              <Box
                h="1px"
                w={{ base: "44px", md: "64px" }}
                bgGradient="linear(to-r, rgba(255,255,255,0.8), rgba(255,255,255,0))"
                sx={{
                  transformOrigin: "left center",
                  "@keyframes rayaCrece": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
                  animation: activo ? "rayaCrece 1s cubic-bezier(0.22,1,0.36,1) 0.7s both" : "none",
                  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                }}
              />
              <Text
                color="white"
                opacity={0.9}
                fontFamily="'EB Garamond', serif"
                fontStyle="italic"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing={{ base: "0.2em", md: "0.28em" }}
                textTransform="uppercase"
              >
                {t("welcome.hero.gratis")}
              </Text>
            </Flex>
          </Reveal>
        </Flex>

        <Reveal activo={activo} direction="up" distance={18} duration={0.8} delay={0.6} w="100%" maxW={{ base: "400px", md: "540px" }}>
          {estado === "ok" ? (
            <Flex direction="column" gap={2} w="100%" minH="200px" justify="center" textAlign={{ base: "center", lg: "left" }}>
              <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700">
                {t("suscribir.ok")}
              </Text>
              <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic">
                {t("suscribir.gracias")}
              </Text>
            </Flex>
          ) : (
            <Flex
              as="form"
              direction="column"
              gap={4}
              w="100%"
              onSubmit={(e: React.FormEvent) => { e.preventDefault(); void enviar(); }}
              noValidate
            >
              {/* Nombre y email en la misma línea (en móvil, uno bajo otro). */}
              <Flex direction={{ base: "column", md: "row" }} gap={4}>
              <Input
                {...campo(false)}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={t("welcome.hero.nombre")}
                aria-label={t("welcome.hero.nombre")}
                autoComplete="name"
                maxLength={120}
              />
              <Input
                {...campo(estado === "invalid")}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (estado === "invalid") setEstado("idle"); }}
                placeholder={t("suscribir.placeholder")}
                aria-label={t("suscribir.placeholder")}
                type="email"
                autoComplete="email"
              />
              </Flex>
              {estado === "invalid" && (
                <Text color="rgba(255,190,190,0.95)" fontSize="sm">{t("suscribir.invalido")}</Text>
              )}
              {estado === "error" && (
                <Text color="rgba(255,190,190,0.95)" fontSize="sm">{t("suscribir.error")}</Text>
              )}
              <Box
                as="button"
                type="submit"
                disabled={estado === "loading"}
                alignSelf={{ base: "center", lg: "flex-start" }}
                mt={1}
                px={{ base: 8, md: 10 }}
                py="12px"
                borderRadius="full"
                bg={arenaBg}
                border="1.5px solid rgba(255,255,255,0.9)"
                color={arenaTinta}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="700"
                letterSpacing="0.16em"
                textTransform="uppercase"
                whiteSpace="nowrap"
                cursor={estado === "loading" ? "not-allowed" : "pointer"}
                opacity={estado === "loading" ? 0.6 : 1}
                boxShadow={HALO_BOTON}
                _hover={estado === "loading" ? {} : { bg: "white", boxShadow: HALO_BOTON_HOVER, transform: "translateY(-2px)" }}
                _focusVisible={focoBlanco}
                transition="all 0.25s ease"
                sx={estado === "idle" && activo ? {
                  "@keyframes botonLate": { "0%, 100%": { boxShadow: HALO_BOTON }, "50%": { boxShadow: HALO_BOTON_HOVER } },
                  animation: "botonLate 4.5s ease-in-out 2s infinite",
                  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                } : undefined}
              >
                {estado === "loading" ? t("comun.enviando") : (<>{t("comun.enviar")}<Box as="span" ml={3} fontSize="1.15em" display="inline-block" transition="transform 0.25s ease" sx={{ "button:hover > &": { transform: "translateX(4px)" } }}>→</Box></>)}
              </Box>
              <Box w="fit-content" alignSelf={{ base: "center", lg: "flex-start" }}>
                <EnlaceBaja mt={1} />
              </Box>
            </Flex>
          )}
        </Reveal>
      </Flex>

      {/* ── Derecha: foto (cuadrada, junto al texto) + lo que hago ── */}
      <Flex direction="column" align="center" flexShrink={0} gap={{ base: 5, md: 6 }} w={{ base: "100%", lg: "340px" }} mx={{ base: "auto", lg: 0 }}>
        <Reveal activo={activo} direction="left" distance={28} scaleFrom={0.94} duration={1} delay={0.25}>
            <Box
              as="button"
              type="button"
              onClick={() => navigate("/quienSoy")}
              aria-label="María Escribano"
              position="relative"
              display="block"
              cursor="pointer"
              borderRadius="22px"
              w={{ base: "250px", md: "300px", lg: "340px" }}
              role="group"
              _focusVisible={focoBlanco}
            >
              {/* Aura que respira detrás de la foto */}
              <Box
                position="absolute"
                inset="-34px"
                borderRadius="full"
                bg="radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(180,255,245,0.1) 45%, rgba(255,255,255,0) 70%)"
                pointerEvents="none"
                sx={{
                  "@keyframes auraRespira": { "0%, 100%": { opacity: 0.55, transform: "scale(0.96)" }, "50%": { opacity: 1, transform: "scale(1.06)" } },
                  animation: "auraRespira 6s ease-in-out infinite",
                  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                }}
              />
              {/* Filo fino desplazado: da elegancia al marco */}
              <Box position="absolute" inset="-9px" borderRadius="30px" border="1px solid rgba(255,255,255,0.35)" pointerEvents="none" />
              <Box
                position="relative"
                borderRadius="22px"
                overflow="hidden"
                boxShadow={HALO_FOTO}
                sx={{ aspectRatio: "1 / 1" }}
              >
                <Image
                  src="/img/me/me.webp"
                  alt="María Escribano"
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  objectPosition="center 18%"
                  display="block"
                  transition="transform 0.9s cubic-bezier(0.22,1,0.36,1)"
                  _groupHover={{ transform: "scale(1.06)" }}
                />
              </Box>
            </Box>
        </Reveal>
        <Reveal activo={activo} direction="up" distance={14} duration={0.8} delay={0.8}>
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.6"
            letterSpacing="0.03em"
            textAlign="center"
            maxW="320px"
          >
            {t("welcome.hero.foto")}
          </Text>
        </Reveal>
      </Flex>
    </Flex>
  );
};

export default WelcomeHero;
