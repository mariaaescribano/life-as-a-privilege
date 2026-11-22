import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import WelcomeHero from "../../components/welcome/WelcomeHero";
import WelcomePerspectivas from "../../components/welcome/WelcomePerspectivas";
import WelcomeOpiniones from "../../components/welcome/WelcomeOpiniones";
// (botón flotante «Contáctame» quitado) import BotonContactame from "../../components/global/BotonContactame";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { LifeLoading } from "../../components/global/LifeLoading";

/**
 * Portada. POR AHORA solo lleva la apertura (foto de María + titular, frase y «Pedir cita»)
 * y la suscripción. Todo lo demás (separadores, las cuatro cajas, las ocho disciplinas, la
 * tarjeta de María…) está fuera: la versión completa se guardó en `Welcome.completa.tsx.txt`.
 */
const WELCOME_IMGS = ["/img/me/maria-portada.webp"];

const Welcome = () => {
  const [mounted, setMounted] = useState(false);
  const imagenesListas = usePrecargarImagenes(WELCOME_IMGS);
  const [tiempoMin, setTiempoMin] = useState(false);
  // Tipografías listas: sin esto el titular se pinta con la fuente de respaldo
  // (más ancha) y, al llegar la EB Garamond, encoge de golpe.
  const [fuentesListas, setFuentesListas] = useState(false);
  // La página no se revela hasta que la foto y las fuentes estén cargadas Y haya pasado un
  // tiempo mínimo (para que se vea la animación de carga). Mientras, <LifeLoading/>.
  const listo = imagenesListas && tiempoMin && fuentesListas;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setTiempoMin(true), 550);
    // Red de seguridad: si las fuentes no llegan en 2,5 s se sigue igualmente.
    const tope = setTimeout(() => setFuentesListas(true), 2500);
    const fuentes = (document as any).fonts;
    if (fuentes?.load) {
      Promise.all([
        fuentes.load('400 1em "EB Garamond"'),
        fuentes.load('italic 400 1em "EB Garamond"'),
        fuentes.load('700 1em "EB Garamond"'),
        fuentes.ready,
      ]).catch(() => {}).then(() => setFuentesListas(true));
    } else {
      setFuentesListas(true);
    }
    return () => { clearTimeout(t); clearTimeout(tope); };
  }, []);

  // Doble requestAnimationFrame: el contenido se pinta primero OCULTO y, al frame
  // siguiente, cambia a visible → la transición se ejecuta siempre.
  useEffect(() => {
    if (!listo) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setMounted(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [listo]);

  if (!listo) return <LifeLoading variant="public" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="public" />

      <Box flex="1">
        {/* ── La apertura: foto de María a la izquierda; titular, frase y «Pedir cita» a la derecha ── */}
        <WelcomeHero activo={mounted} marmol compacto />

        {/* ── Segundo apartado: «Lo importante eres tú…» y las cuatro fotos ── */}
        <WelcomePerspectivas />

        {/* ── Las experiencias de las personas (todas las opiniones), debajo de las fotos ── */}
        <WelcomeOpiniones />

        {/* ── Suscripción (turquesa oscuro) ── */}
        <Flex justify="center" px={{ base: 5, md: 10 }} pb={{ base: 24, md: 32 }}>
          <SubscribeBox />
        </Flex>
      </Box>

      <SiteFooter />

      {/* Botón flotante «Contáctame» (fuera de cualquier contenedor con zoom). */}
      {/* <BotonContactame /> */}
    </Box>
  );
};

export default Welcome;
