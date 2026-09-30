import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LibrosIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";
import { Float } from "../../components/global/Reveal";

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

type Cajita = {
  titulo: string;
  delay: number;
  link: string;
  renderIcon: () => React.ReactNode;
};

export default function MaterialesGratuitos() {
  const navigate = useNavigate();
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const cardsReveal = useReveal(0.1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Orden: Ilustraciones · Cursos · Libros.
  const cajitas: Cajita[] = [
    // ── «Vídeos» comentado a petición: se oculta el box y su página (la ruta
    // /aprendizaje/todosVideos queda comentada en App.tsx). Se conserva por si
    // se quiere restaurar en el futuro.
    // {
    //   titulo: "Vídeos",
    //   delay: 0.15,
    //   link: "/aprendizaje/todosVideos",
    //   renderIcon: () => (
    //     <Box
    //       as="svg"
    //       xmlns="http://www.w3.org/2000/svg"
    //       viewBox="0 -960 960 960"
    //       width="52px"
    //       height="52px"
    //       fill="white"
    //     >
    //       <path d="M320-200v-560l440 280-440 280Z" />
    //     </Box>
    //   ),
    // },
    {
      titulo: t("materiales.ilustraciones"),
      delay: 0.15,
      link: "/ilustraciones",
      renderIcon: () => (
        <Box
          as="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          width="52px"
          height="52px"
          fill="white"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
        </Box>
      ),
    },
    {
      titulo: t("header.cursos"),
      delay: 0.3,
      link: "/aprendizaje/aprendizajeHome",
      renderIcon: () => (
        <Image
          src="/img/icono/life.webp"
          alt=""
          h="54px"
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.52)) drop-shadow(0 0 18px rgba(255,255,255,0.26))" }}
        />
      ),
    },
    {
      titulo: t("materiales.libros"),
      delay: 0.45,
      link: "/libros",
      renderIcon: () => <LibrosIcon color="white" size="52px" shadow={false} />,
    },
    // ── «Programas» comentado: la sección se aparca. Lo que ofrecía —una
    // charla con diapositivas y su podcast— ya cabe en un curso (una lección
    // «video» es un enlace de YouTube pegado tal cual), y de 43 programas del
    // índice solo 7 llegaron a publicarse. Se conserva entero, igual que
    // «Vídeos», por si se quiere restaurar: aquí y las rutas de App.tsx.
    // {
    // // Programas: la diapositiva y su podcast. Icono = el atril con la
    // // presentación y el play al lado: lo que se mira y lo que se escucha.
    // titulo: t("materiales.programas"),
    // delay: 0.6,
    // link: "/programas",
    // renderIcon: () => (
    // <Box
    // as="svg"
    // xmlns="http://www.w3.org/2000/svg"
    // viewBox="0 -960 960 960"
    // width="52px"
    // height="52px"
    // fill="white"
    // >
    // <path d="M160-80q-17 0-28.5-11.5T120-120v-558q0-15 6-25.5t20-16.5l400-160q20-8 37 5.5t17 34.5v120h40q17 0 28.5 11.5T680-680v120h-80v-80H200v480h207l80 80H160Zm200-640h160v-62l-160 62Zm178.5 581.5Q480-197 480-280t58.5-141.5Q597-480 680-480t141.5 58.5Q880-363 880-280t-58.5 141.5Q763-80 680-80t-141.5-58.5ZM630-180l160-100-160-100v200Zm-430 20v-480 480Z" />
    // </Box>
    // ),
    // },
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      {/* Wrapper con flotación perpetua (vida continua, como en Welcome y
          /elMetodo); la imagen hace la entrada épica (surge girando desde muy
          pequeña y se enfoca). */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Box
          sx={{
            "@keyframes mandalaFloat": {
              "0%, 100%": { transform: "translateY(0) scale(1)" },
              "50%": { transform: "translateY(-9px) scale(1.03)" },
            },
            animation: "mandalaFloat 5.5s ease-in-out infinite",
          }}
        >
          <Image
            src="/img/icono/life.webp"
            alt=""
            h={{ base: "48px", md: "64px" }}
            objectFit="contain"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "scale(1) rotate(0deg)" : "scale(0.25) rotate(-45deg)",
              // glow (drop-shadow) siempre + blur solo durante la entrada.
              filter:
                "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" +
                (mounted ? "" : " blur(6px)"),
              transition: "opacity 1.1s ease, transform 1.3s cubic-bezier(0.22,1.5,0.36,1), filter 1s ease",
            }}
          />
        </Box>
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 6, md: 8 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.39), 0 0 56px rgba(180,255,245,0.32)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          {t("header.materiales")}
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "md", md: "xl" }}
          fontStyle="italic"
          fontWeight="400"
          letterSpacing="0.05em"
          lineHeight="1.5"
          textShadow="0 0 10px rgba(255,255,255,0.41), 0 0 21px rgba(255,255,255,0.22)"
          maxW={{ base: "100%", md: "580px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          {t("materiales.subtitulo")}
        </Text>
      </Flex>

      {/* ── 4 CAJITAS ── */}
      <Flex
        flex={1}
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 20, md: 24 }}
        pb={{ base: 24, md: 32 }}
      >
        {/* Fila que se parte y va SIEMPRE centrada. Antes era una rejilla de
            cuatro columnas fijas, y como «Vídeos» y «Programas» están
            aparcados solo quedan tres cajitas: la cuarta columna se quedaba
            vacía y las tres se veían escoradas a la izquierda.
            Con `wrap` + `justify="center"` el número de cajitas deja de
            importar: tres van centradas, cuatro llenan la fila, y si en una
            pantalla estrecha la última se queda sola, se queda sola EN MEDIO
            (que es lo que una rejilla no sabe hacer). */}
        <Flex
          ref={cardsReveal.ref}
          w="100%"
          maxW={{ base: "900px", lg: "1120px" }}
          wrap="wrap"
          justify="center"
          gap={{ base: 6, md: 6 }}
        >
          {cajitas.map((c, i) => (
            // La ENTRADA va en este wrapper y el hover en el botón de dentro,
            // para que sus `transform` no se pisen (el de la entrada lleva el
            // retraso de la cascada y dejaría el hover perezoso).
            <Box
              key={c.link}
              display="flex"
              flexDirection="column"
              // Ancho de cada cajita: en móvil una por fila; de ahí arriba, un
              // ancho de partida fijo que puede encoger pero no crecer, para
              // que no se estiren a lo ancho cuando son pocas.
              flex={{ base: "1 1 100%", md: "0 1 300px", lg: "0 1 332px" }}
              opacity={cardsReveal.visible ? 1 : 0}
              transform={cardsReveal.visible ? "translateY(0) scale(1)" : "translateY(26px) scale(0.95)"}
              filter={cardsReveal.visible ? "blur(0px)" : "blur(6px)"}
              // Sube a su sitio y se enfoca, con la curva del sistema Reveal.
              transition={`opacity 0.5s ease ${c.delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${c.delay}s, filter 0.5s ease ${c.delay}s`}
            >
            <Flex
              as="button"
              onClick={() => navigate(c.link)}
              direction="column"
              align="center"
              justify="center"
              flex="1"
              w="100%"
              gap={{ base: 4, md: 5 }}
              bg="rgba(255,255,255,0.08)"
              border="1px solid rgba(255,255,255,0.28)"
              borderRadius="2xl"
              px={{ base: 5, md: 6 }}
              py={{ base: 8, md: 11 }}
              minH={{ base: "180px", md: "224px" }}
              sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
              boxShadow="0 0 16px rgba(255,255,255,0.28), 0 0 40px rgba(255,255,255,0.14), 0 0 72px rgba(180,255,245,0.16), 0 5px 16px rgba(0,0,0,0.18)"
              cursor="pointer"
              transition="background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.28s ease"
              _hover={{
                bg: "rgba(255,255,255,0.16)",
                borderColor: "rgba(255,255,255,0.9)",
                boxShadow: "0 0 24px rgba(255,255,255,0.5), 0 0 52px rgba(180,255,245,0.32), 0 0 88px rgba(255,255,255,0.18), 0 6px 19px rgba(0,0,0,0.22)",
                transform: "translateY(-6px)",
              }}
            >
              {/* Icono superior — con un vaivén perpetuo muy leve (cada cajita
                  al suyo, desfasadas, para que no suban y bajen a la vez). */}
              <Float amplitude={5} duration={5 + i * 0.6} delay={i * 0.5}>
                <Box
                  w={{ base: "74px", md: "86px" }}
                  h={{ base: "74px", md: "86px" }}
                  borderRadius="full"
                  bg="rgba(255,255,255,0.08)"
                  border="1px solid rgba(255,255,255,0.35)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 0 13px rgba(255,255,255,0.35), 0 0 29px rgba(255,255,255,0.18)"
                >
                  {c.renderIcon()}
                </Box>
              </Float>

              {/* Línea decorativa */}
              <Box
                w="40px"
                h="1px"
                bg="rgba(255,255,255,0.5)"
                boxShadow="0 0 6px rgba(255,255,255,0.5)"
              />

              {/* Título */}
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "xl" }}
                letterSpacing="0.16em"
                textTransform="uppercase"
                textAlign="center"
                lineHeight="1.2"
                textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.26), 0 0 40px rgba(180,255,245,0.22)"
              >
                {c.titulo}
              </Text>
            </Flex>
            </Box>
          ))}
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
