import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { nombreEnMapa } from "../../data/recorridoContenido";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
} from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// EL MAPA QUE SE ARMA — box de la derecha del cómic del origen (/elMetodo).
//
// Empieza vacío: ocho huecos en un anillo alrededor del mandala. Cada vez que el
// cómic pasa a una viñeta de disciplina, ESA disciplina aterriza en su sitio (su
// foto + su icono) y ya no se va. Al llegar a la viñeta de cierre, los ocho se
// unen —senderos al centro y anillo entre ellos— y el mandala se enciende: lo
// que se ha leído como historia acaba de convertirse en el mapa que se compra.
//
// El anillo va en el ORDEN DEL RECORRIDO (el mismo de los ocho círculos de
// /elMetodo y del mandala) y el guion del cómic también, así que el mapa se
// rellena en el sentido del reloj, empezando por Astrología: el usuario ve el
// recorrido tal cual lo va a hacer, sin saltos que despisten.
//
// Todas las medidas se calculan sobre el ancho real del box (ResizeObserver):
// así el mapa es fluido a cualquier tamaño sin listas de breakpoints, y los
// iconos —que piden un tamaño en px— salen siempre proporcionados.
// ─────────────────────────────────────────────────────────────────────────

const aterrizar = keyframes`
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
  60%  { opacity: 1; transform: translate(-50%, -50%) scale(1.12); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

// El `translate(-50%, -50%)` va DENTRO del keyframe: es lo que centra el
// mandala, y como la animación también escribe `transform`, sin repetirlo aquí
// lo pisaría y el mandala se caería media anchura abajo y a la derecha en
// cuanto el mapa se completa (que es justo cuando arranca el latido).
const latir = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50%      { transform: translate(-50%, -50%) scale(1.045); }
`;

const respirarHueco = keyframes`
  0%, 100% { opacity: 0.30; }
  50%      { opacity: 0.55; }
`;

type Pieza = {
  nom: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
};

// Orden del anillo = orden del Mapa (igual que las ocho tarjetas de /elMetodo).
const ANILLO: Pieza[] = [
  { nom: astrologiaNom,       bg: astrologiaBg,       txt: astrologiaTxt,       renderIcon: (s) => <AstrologiaIcon size={s} /> },
  { nom: neuropsicologiaNom,  bg: neuropsicologiaBg,  txt: neuropsicologiaTxt,  renderIcon: (s) => <NeuropsicologiaIcon size={{ base: s, md: s }} /> },
  { nom: ayurvedaNom,         bg: ayurvedaBg,         txt: ayurvedaTxt,         renderIcon: (s) => <AyurvedaIcon size={{ base: s, md: s }} /> },
  { nom: tcmNom,              bg: tcmBg,              txt: tcmTxt,              renderIcon: (s) => <TCMIcon size={{ base: s, md: s }} /> },
  { nom: fisiologiaNom,       bg: fisiologiaBg,       txt: fisiologiaTxt,       renderIcon: (s) => <FisiologiaIcon size={s} /> },
  { nom: nutricionNom,        bg: nutricionBg,        txt: nutricionTxt,        renderIcon: (s) => <NutricionIcon size={{ base: s, md: s }} /> },
  { nom: cabalaNom,           bg: cabalaBg,           txt: cabalaTxt,           renderIcon: (s) => <CabalaIcon size={{ base: s, md: s }} /> },
  { nom: culturaNom,          bg: culturaBg,          txt: culturaTxt,          renderIcon: (s) => <CulturaIcon size={{ base: s, md: s }} /> },
];

export const TOTAL_PIEZAS = ANILLO.length;

interface MapaSeArmaProps {
  /** Disciplinas ya colocadas (los `*Nom`). El orden no importa: cada una tiene
   *  su sitio fijo en el anillo. */
  colocadas: string[];
  /** El cómic ha llegado a la viñeta de cierre: los ocho se unen. */
  completo: boolean;
  /** Última colocada, para nombrarla debajo («Astrología · en su sitio»). */
  ultima?: string;
}

export function MapaSeArma({ colocadas, completo, ultima }: MapaSeArmaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [lado, setLado] = useState(0);

  // Medida real del cuadrado del mapa: de aquí salen TODOS los tamaños.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entradas) => {
      const w = entradas[0]?.contentRect.width ?? 0;
      if (w) setLado(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const puesta = (nom: string) => colocadas.includes(nom);

  // Geometría del anillo, en fracción del lado del cuadrado.
  const R = 0.345;          // radio del anillo
  const dCirculo = 0.20;    // diámetro de cada círculo
  const dCentro = 0.235;    // diámetro del mandala del centro

  const px = (f: number) => `${Math.round(lado * f)}px`;

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="100%"
      h="100%"
      gap={{ base: 3, md: 4 }}
    >
      {/* ── EL ANILLO ──
          Tope corto (420 px) a propósito: es cuadrado, así que su ancho es su
          alto, y con 620 el bloque entero no cabía en la pantalla de un
          portátil. A la izquierda, el box del cómic va con el mismo criterio. */}
      <Box ref={ref} position="relative" w="100%" aspectRatio={1} maxW={{ base: "320px", md: "420px" }}>
        {/* Mandala de fondo, muy tenue: el «papel» del mapa. Se enciende un poco
            más cuando el mapa está completo. */}
        <Box
          position="absolute"
          inset="0"
          backgroundImage="url('/img/icono/life.png')"
          backgroundSize="86%"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          opacity={completo ? 0.16 : 0.07}
          transition="opacity 1.2s ease"
          pointerEvents="none"
        />

        {/* ── SENDEROS ──
            Del centro a cada pieza colocada (se dibujan solos al aterrizar) y,
            cuando el mapa está completo, el anillo que une las ocho entre sí:
            ese es el momento en que las piezas dejan de ser ocho cosas sueltas
            y se ven como un mapa. */}
        <Box
          as="svg"
          viewBox="0 0 100 100"
          position="absolute"
          inset="0"
          w="100%"
          h="100%"
          pointerEvents="none"
          overflow="visible"
        >
          {ANILLO.map((p, i) => {
            const a = (Math.PI * 2 * i) / TOTAL_PIEZAS - Math.PI / 2;
            const x = 50 + Math.cos(a) * R * 100;
            const y = 50 + Math.sin(a) * R * 100;
            const on = puesta(p.nom);
            // Largo del trazo para animar el dibujado con strokeDashoffset.
            const largo = R * 100;
            return (
              <line
                key={p.nom}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.75)"
                strokeWidth={0.35}
                strokeLinecap="round"
                strokeDasharray={largo}
                strokeDashoffset={on ? 0 : largo}
                opacity={on ? (completo ? 0.85 : 0.45) : 0}
                style={{
                  transition: "stroke-dashoffset 0.9s ease 0.25s, opacity 0.7s ease",
                }}
              />
            );
          })}

          {/* Anillo exterior que une las ocho (solo con el mapa completo). Se
              dibuja de una pasada, en sentido del reloj. */}
          <circle
            cx="50"
            cy="50"
            r={R * 100}
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={0.35}
            strokeDasharray={2 * Math.PI * R * 100}
            strokeDashoffset={completo ? 0 : 2 * Math.PI * R * 100}
            opacity={completo ? 0.75 : 0}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 1.6s ease 0.4s, opacity 0.8s ease 0.3s" }}
          />
        </Box>

        {/* ── EL CENTRO ──
            Apagado mientras el mapa se arma; al completarse se enciende y late
            despacio: es «Life as a Privilege» en el medio de las ocho. */}
        <Flex
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          w={px(dCentro)}
          h={px(dCentro)}
          borderRadius="full"
          align="center"
          justify="center"
          bg="rgba(255,255,255,0.06)"
          border={`${Math.max(2, Math.round(lado * 0.006))}px solid ${completo ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)"}`}
          sx={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
          boxShadow={completo
            ? "0 0 26px rgba(255,255,255,0.55), 0 0 60px rgba(180,255,245,0.4), 0 8px 30px rgba(0,0,0,0.3)"
            : "0 4px 18px rgba(0,0,0,0.2)"}
          transition="border-color 0.8s ease, box-shadow 0.8s ease"
          animation={completo ? `${latir} 5s ease-in-out infinite` : undefined}
          zIndex={2}
        >
          <Image
            src="/img/icono/life.png"
            alt=""
            w="68%"
            h="68%"
            objectFit="contain"
            opacity={completo ? 1 : 0.5}
            transition="opacity 0.8s ease"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))" }}
          />
        </Flex>

        {/* ── LAS OCHO PIEZAS ── */}
        {ANILLO.map((p, i) => {
          const a = (Math.PI * 2 * i) / TOTAL_PIEZAS - Math.PI / 2;
          const on = puesta(p.nom);
          const hasBg = hasDisciplinaBg(p.nom);
          return (
            <Box
              key={p.nom}
              position="absolute"
              left={`${50 + Math.cos(a) * R * 100}%`}
              top={`${50 + Math.sin(a) * R * 100}%`}
              w={px(dCirculo)}
              h={px(dCirculo)}
              // El translate va en el propio transform (y también dentro del
              // keyframe de aterrizaje, que si no lo pisa y la pieza se
              // descoloca al animarse).
              transform="translate(-50%, -50%)"
              borderRadius="full"
              overflow="hidden"
              zIndex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={on && !hasBg ? p.bg : "rgba(255,255,255,0.05)"}
              border={on
                ? `${Math.max(2, Math.round(lado * 0.005))}px solid ${p.txt}`
                : "1px dashed rgba(255,255,255,0.35)"}
              boxShadow={on
                ? `0 0 ${px(0.03)} ${p.txt}bb, 0 4px ${px(0.025)} rgba(0,0,0,0.3)`
                : "none"}
              opacity={on ? 1 : 1}
              // Aterrizaje: la pieza cae en su sitio con un pop corto. `key` en
              // la animación para que se dispare justo cuando se coloca.
              animation={on ? `${aterrizar} 0.65s cubic-bezier(0.22,1.2,0.36,1) both` : undefined}
              transition="border-color 0.5s ease, box-shadow 0.5s ease"
              title={on ? nombreEnMapa(p.nom) : undefined}
            >
              {on ? (
                <>
                  {hasBg && <DisciplinaBgLayer nom={p.nom} borderRadius="full" />}
                  <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
                    {p.renderIcon(px(dCirculo * 0.5))}
                  </Box>
                </>
              ) : (
                // Hueco a la espera: solo un punto tenue latiendo en el centro
                // del círculo de puntos. Nada de números ni de nombres: no se
                // adelanta qué disciplina va en cada sitio.
                <Box
                  w="18%"
                  h="18%"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.7)"
                  animation={`${respirarHueco} 3.2s ease-in-out ${i * 0.25}s infinite`}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* ── PIE DEL MAPA ──
          Mientras se arma: qué pieza acaba de colocarse y cuántas van. Al
          cerrarse: el nombre del mapa. */}
      <Flex direction="column" align="center" gap={1} minH={{ base: "46px", md: "50px" }} justify="center">
        {completo ? (
          <>
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "md", md: "xl" }}
              letterSpacing="0.14em"
              textTransform="uppercase"
              textAlign="center"
              textShadow="0 0 14px rgba(255,255,255,0.5), 0 0 30px rgba(180,255,245,0.28)"
            >
              El Mapa
            </Text>
            <Text
              color="rgba(255,255,255,0.85)"
              fontSize={{ base: "xs", md: "sm" }}
              fontStyle="italic"
              textAlign="center"
              textShadow="0 0 10px rgba(255,255,255,0.28)"
            >
              Las ocho miradas, sobre la misma persona.
            </Text>
          </>
        ) : (
          <>
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "sm", md: "md" }}
              textAlign="center"
              minH="1.5em"
              textShadow="0 0 11px rgba(255,255,255,0.32)"
            >
              {ultima ? nombreEnMapa(ultima) : "Tu mapa empieza vacío."}
            </Text>
            <Text
              color="rgba(255,255,255,0.7)"
              fontSize={{ base: "2xs", md: "xs" }}
              fontWeight="700"
              letterSpacing="0.18em"
              textAlign="center"
              textShadow="0 0 10px rgba(255,255,255,0.22)"
            >
              {colocadas.length}/{TOTAL_PIEZAS}
            </Text>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default MapaSeArma;
