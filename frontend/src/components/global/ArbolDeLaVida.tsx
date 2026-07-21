'use client'
import React, { useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { cabalaBg, cabalaTxt } from '../../GlobalVariables'

export type SefiraKey =
  | 'kether' | 'chokmah' | 'binah'
  | 'chesed' | 'geburah' | 'tipharet'
  | 'netzach' | 'hod' | 'yesod' | 'malkuth'

export interface Sefira {
  key: SefiraKey
  number: number
  spanishName: string
  hebrewName: string
  description: string
  x: number
  y: number
}

export interface Sendero {
  num: number
  from: SefiraKey
  to: SefiraKey
}

interface Props {
  onSefiraClick?: (sefira: Sefira) => void
  maxWidth?: string
  suppressInternalModal?: boolean
  /** 'sefirot' (por defecto): protagonistas las sefirot. 'senderos': protagonistas
   *  los 22 caminos (destacados y clicables), sefirot atenuadas. */
  variant?: 'sefirot' | 'senderos'
  /** En variant 'senderos': se llama al pulsar un camino. */
  onSenderoClick?: (sendero: Sendero) => void
  /** Camino resaltado (num) en variant 'senderos'. */
  selectedSendero?: number | null
  /** Muestra la sefirá oculta Da'at (nodo fantasma entre Chokhmah y Binah).
   *  Solo tiene efecto en variant 'sefirot'. */
  showDaat?: boolean
  /** Se llama al pulsar el nodo de Da'at. */
  onDaatClick?: () => void
  /** Claves de las sefirot ya LEÍDAS (ilustración vista). En esos nodos se pinta
   *  un sello dorado (anillo + tick) arriba a la derecha. Incluye 'daat'. */
  readKeys?: Set<string>
  /** En variant 'senderos': `num` de los senderos ya LEÍDOS (ilustración vista).
   *  Su insignia se enciende en dorado. */
  readSenderos?: Set<number>
}

/* ─── Sello «leída»: anillo dorado alrededor del nodo + tick arriba-derecha ── */
function ReadSeal({ x, y, nodeR = R }: { x: number; y: number; nodeR?: number }) {
  const bx = x + nodeR * 0.72 // insignia arriba a la derecha del nodo
  const by = y - nodeR * 0.72
  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* Anillo dorado que late alrededor del nodo leído */}
      <circle
        cx={x} cy={y} r={nodeR + 5}
        fill="none" stroke={cabalaTxt} strokeWidth={1.4}
        style={{ transformOrigin: `${x}px ${y}px`, animation: 'readRing 3s ease-in-out infinite' }}
      />
      {/* Insignia con el tick */}
      <g style={{ transformOrigin: `${bx}px ${by}px`, animation: 'sealPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        <circle cx={bx} cy={by} r={12} fill={cabalaBg} stroke={cabalaTxt} strokeWidth={2}
                style={{ filter: `drop-shadow(0 0 6px ${cabalaTxt}aa)` }} />
        <polyline
          points={`${bx - 5},${by} ${bx - 1.5},${by + 3.5} ${bx + 5.5},${by - 4.5}`}
          fill="none" stroke={cabalaTxt} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
    </g>
  )
}

const R = 34

const SEFIROT: Sefira[] = [
  {
    key: 'kether', number: 1, spanishName: 'CORONA', hebrewName: 'Keter', x: 200, y: 45,
    description: 'El primer destello de la existencia. Representa la voluntad divina pura, la chispa primordial de consciencia que precede a toda forma y a todo pensamiento.',
  },
  {
    key: 'chokmah', number: 2, spanishName: 'SABIDURÍA', hebrewName: 'Chokhmah', x: 340, y: 140,
    description: 'El primer movimiento de la conciencia, la chispa de la inspiración. Representa la intuición pura, la fuerza creativa masculina y el impulso primordial hacia la existencia.',
  },
  {
    key: 'binah', number: 3, spanishName: 'ENTENDIMIENTO', hebrewName: 'Binah', x: 60, y: 140,
    description: 'La gran madre que da forma a la sabiduría. Representa la comprensión profunda, la capacidad de nutrir y de dar estructura y límite a la energía creativa.',
  },
  {
    key: 'chesed', number: 4, spanishName: 'MISERICORDIA', hebrewName: 'Chesed', x: 340, y: 300,
    description: 'La fuerza expansiva del amor y la generosidad. Representa la compasión, la gracia divina y la abundancia que fluye sin condiciones ni restricciones.',
  },
  {
    key: 'geburah', number: 5, spanishName: 'SEVERIDAD', hebrewName: 'Gevurah', x: 60, y: 300,
    description: 'La fuerza disciplinada del poder y el juicio. Representa la voluntad de eliminar lo innecesario, la valentía y la capacidad de transformar a través de la claridad.',
  },
  {
    key: 'tipharet', number: 6, spanishName: 'BELLEZA', hebrewName: 'Tiferet', x: 200, y: 370,
    description: 'El corazón del árbol y centro del equilibrio. Representa la armonía entre todos los opuestos, la compasión consciente y la conexión con el yo superior.',
  },
  {
    key: 'netzach', number: 7, spanishName: 'VICTORIA', hebrewName: 'Netzach', x: 340, y: 500,
    description: 'La fuerza de los instintos, las emociones y la naturaleza. Representa la energía vital, la creatividad artística y el deseo profundo de conexión y belleza.',
  },
  {
    key: 'hod', number: 8, spanishName: 'ESPLENDOR', hebrewName: 'Hod', x: 60, y: 500,
    description: 'La mente analítica y el lenguaje. Representa la comunicación, la inteligencia racional, la magia del pensamiento y el poder de nombrar la realidad.',
  },
  {
    key: 'yesod', number: 9, spanishName: 'FUNDAMENTO', hebrewName: 'Yesod', x: 200, y: 570,
    description: 'El mundo de los sueños y el inconsciente. Representa los patrones ocultos, la memoria colectiva y el puente sutil entre lo espiritual y lo material.',
  },
  {
    key: 'malkuth', number: 10, spanishName: 'REINO', hebrewName: 'Malkhut', x: 200, y: 660,
    description: 'El mundo material y la experiencia física. Representa la manifestación concreta de todo lo espiritual, el cuerpo, la tierra y la Vidacotidiana.',
  },
]

// 22 senderos (paths 11-32)
const PATHS: Array<{ num: number; from: SefiraKey; to: SefiraKey }> = [
  { num: 11, from: 'kether',   to: 'chokmah'  },
  { num: 12, from: 'kether',   to: 'binah'    },
  { num: 13, from: 'kether',   to: 'tipharet' },
  { num: 14, from: 'chokmah',  to: 'binah'    },
  { num: 15, from: 'chokmah',  to: 'tipharet' },
  { num: 16, from: 'chokmah',  to: 'chesed'   },
  { num: 17, from: 'binah',    to: 'tipharet' },
  { num: 18, from: 'binah',    to: 'geburah'  },
  { num: 19, from: 'chesed',   to: 'geburah'  },
  { num: 20, from: 'chesed',   to: 'tipharet' },
  { num: 21, from: 'chesed',   to: 'netzach'  },
  { num: 22, from: 'geburah',  to: 'tipharet' },
  { num: 23, from: 'geburah',  to: 'hod'      },
  { num: 24, from: 'tipharet', to: 'netzach'  },
  { num: 25, from: 'tipharet', to: 'yesod'    },
  { num: 26, from: 'tipharet', to: 'hod'      },
  { num: 27, from: 'netzach',  to: 'hod'      },
  { num: 28, from: 'netzach',  to: 'yesod'    },
  { num: 29, from: 'netzach',  to: 'malkuth'  },
  { num: 30, from: 'hod',      to: 'yesod'    },
  { num: 31, from: 'hod',      to: 'malkuth'  },
  { num: 32, from: 'yesod',    to: 'malkuth'  },
]

const sefiraMap = Object.fromEntries(SEFIROT.map(s => [s.key, s])) as Record<SefiraKey, Sefira>

/* ─── Modal ────────────────────────────────────────────── */
function SefiraModal({ sefira, onClose }: { sefira: Sefira; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <Box
      position="fixed" inset="0" zIndex={1000}
      display="flex" alignItems="center" justifyContent="center"
      px={4}
      onClick={onClose}
    >
      {/* Fondo oscuro */}
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.80)" />

      {/* Card */}
      <Box
        position="relative" zIndex={1}
        bg={cabalaBg}
        border={`1.5px solid ${cabalaTxt}55`}
        borderRadius="2xl"
        overflow="hidden"
        w="100%" maxW="460px"
        boxShadow={`0 0 60px ${cabalaTxt}44, 0 12px 40px rgba(0,0,0,0.7)`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brillo sutil en el borde superior */}
        <Box
          position="absolute" top={0} left={0} right={0} h="2px"
          style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}88, transparent)` }}
        />

        {/* Botón cerrar */}
        <Box
          as="button"
          onClick={onClose}
          position="absolute" top={3} right={3}
          w="28px" h="28px" borderRadius="full"
          display="flex" alignItems="center" justifyContent="center"
          bg={`${cabalaTxt}18`}
          border={`1px solid ${cabalaTxt}33`}
          color={`${cabalaTxt}88`}
          cursor="pointer"
          transition="all 0.15s"
          _hover={{ color: cabalaTxt, bg: `${cabalaTxt}30` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </Box>

        <Box px={7} pt={7} pb={6}>
          {/* Número */}
          <Text
            color={`${cabalaTxt}55`}
            fontSize="xs" fontFamily="'EB Garamond', serif"
            letterSpacing="0.15em" mb={1}
            textTransform="uppercase"
          >
            Sefirá {sefira.number}
          </Text>

          {/* Nombre hebreo */}
          <Text
            color={cabalaTxt}
            fontSize="3xl" fontWeight="700"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.05em"
            lineHeight="1"
            style={{ textShadow: `0 0 20px ${cabalaTxt}88` }}
            mb={1}
          >
            {sefira.hebrewName}
          </Text>

          {/* Nombre español */}
          <Text
            color={`${cabalaTxt}99`}
            fontSize="sm" fontFamily="'EB Garamond', serif"
            letterSpacing="0.12em" mb={5}
            textTransform="uppercase"
          >
            {sefira.spanishName}
          </Text>

          {/* Separador */}
          <Box
            h="1px" mb={5}
            style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}44, transparent)` }}
          />

          {/* Descripción */}
          <Text
            color={`${cabalaTxt}cc`}
            fontSize="md"
            fontFamily="'EB Garamond', serif"
            lineHeight="1.85"
            letterSpacing="0.02em"
          >
            {sefira.description}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

/* ─── Componente principal ─────────────────────────────── */
export default function ArbolDeLaVida({ onSefiraClick, maxWidth = '520px', suppressInternalModal = false, variant = 'sefirot', onSenderoClick, selectedSendero = null, showDaat = false, onDaatClick, readKeys, readSenderos }: Props) {
  const [hovered, setHovered] = useState<SefiraKey | null>(null)
  const [open, setOpen]       = useState<Sefira | null>(null)
  const [hoveredPath, setHoveredPath] = useState<number | null>(null)
  const [daatHover, setDaatHover] = useState(false)

  const esSenderos = variant === 'senderos'

  const handleClick = (sefira: Sefira) => {
    if (esSenderos) return
    if (!suppressInternalModal) setOpen(sefira)
    onSefiraClick?.(sefira)
  }

  return (
    <>
      <div style={{ width: '100%', maxWidth, margin: '0 auto' }}>
        <svg
          viewBox="-10 -48 420 758"
          width="100%"
          style={{ display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>{`
              @keyframes pathDraw {
                from { stroke-dashoffset: 600; opacity: 0; }
                to   { stroke-dashoffset: 0;   opacity: 1; }
              }
              /* Aparición épica: la sefirá irrumpe desde un punto, sobrepasa su
                 tamaño (destello) y se asienta. */
              @keyframes sefiraAppear {
                0%   { opacity: 0; transform: scale(0.05); }
                55%  { opacity: 1; transform: scale(1.22); }
                78%  { transform: scale(0.94); }
                100% { opacity: 1; transform: scale(1);    }
              }
              /* Variante MÁS ÉPICA (solo el Árbol /arbol): irrumpe desde un punto,
                 sobrepasa más su tamaño (destello mayor) y se asienta más lento. */
              @keyframes sefiraAppearEpic {
                0%   { opacity: 0; transform: scale(0.03); }
                52%  { opacity: 1; transform: scale(1.42); }
                74%  { transform: scale(0.88); }
                100% { opacity: 1; transform: scale(1);    }
              }
              /* Respiración del halo de Keter: SIEMPRE visible (opacidad nunca
                 baja de 0.6), late suavemente. */
              @keyframes keterBreath {
                0%,100% { opacity: 0.6;  transform: scale(0.9);  }
                50%     { opacity: 1;    transform: scale(1.12); }
              }
              @keyframes haloBloom {
                from { opacity: 0; transform: scale(0.2); }
                to   { opacity: 1; transform: scale(1);   }
              }
              /* Haz de luz descendiendo por el pilar central (una sola vez). */
              @keyframes beamDraw {
                from { stroke-dashoffset: 720; opacity: 0;   }
                60%  { opacity: 0.55; }
                to   { stroke-dashoffset: 0;   opacity: 0.4; }
              }
              @keyframes daatAppear {
                0%   { opacity: 0;   transform: scale(0.2); }
                60%  { opacity: 0.95; transform: scale(1.15); }
                100% { opacity: 0.9; transform: scale(1);    }
              }
              @keyframes senderoBadge {
                from { opacity: 0; }
                to   { opacity: 1; }
              }
              /* Sello «leída»: la insignia irrumpe (destello) y se asienta. */
              @keyframes sealPop {
                0%   { opacity: 0; transform: scale(0.2); }
                60%  { opacity: 1; transform: scale(1.25); }
                100% { opacity: 1; transform: scale(1);    }
              }
              /* Anillo dorado del nodo leído: respira suavemente. */
              @keyframes readRing {
                0%,100% { opacity: 0.3; }
                50%     { opacity: 0.7; }
              }
            `}</style>
            {/* Fondo propio de cada sefirá (círculo), tanto en el árbol como en
                el modo senderos (ahí, muy atenuado). */}
            <pattern id="sefira-node-img" width="1" height="1" patternContentUnits="objectBoundingBox">
              <image href="/recorrido/cabala/sefirotfondo.png" width="1" height="1" preserveAspectRatio="xMidYMid slice" />
            </pattern>
            {/* Halo radial dorado de Keter (luz permanente). */}
            <radialGradient id="keter-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={cabalaTxt} stopOpacity="0.9" />
              <stop offset="35%"  stopColor={cabalaTxt} stopOpacity="0.5" />
              <stop offset="100%" stopColor={cabalaTxt} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="pilar-luz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={cabalaTxt} stopOpacity="0.9" />
              <stop offset="100%" stopColor={cabalaTxt} stopOpacity="0.1" />
            </linearGradient>
            {/* Filtro de brillo dorado — reposo */}
            <filter id="sefira-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur" type="matrix"
                values="1.6 0.7 0   0 0
                        1.0 0.5 0   0 0
                        0   0   0.1 0 0
                        0   0   0   1 0"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Filtro de brillo dorado — hover */}
            <filter id="sefira-glow-hover" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="11" result="blur" />
              <feColorMatrix
                in="blur" type="matrix"
                values="2.0 0.9 0   0 0
                        1.3 0.7 0   0 0
                        0   0   0.1 0 0
                        0   0   0   1 0"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Haz de luz descendiendo por el pilar central + halo permanente de
              Keter. Solo en el árbol (variant 'sefirot'), detrás de todo. */}
          {!esSenderos && (
            <g style={{ pointerEvents: 'none' }}>
              <line
                x1={200} y1={45} x2={200} y2={660}
                stroke="url(#pilar-luz)"
                strokeWidth={7}
                strokeLinecap="round"
                filter="url(#sefira-glow)"
                style={{
                  strokeDasharray: 720,
                  strokeDashoffset: 720,
                  animation: 'beamDraw 2.4s ease 0.15s forwards',
                }}
              />
              {/* Halo dorado de Keter — SIEMPRE encendido (respira sin apagarse). */}
              <circle
                cx={200} cy={45} r={74}
                fill="url(#keter-halo)"
                style={{
                  transformOrigin: '200px 45px',
                  opacity: 0,
                  animation: 'haloBloom 1s ease 0.25s both, keterBreath 3.6s ease-in-out 1.25s infinite',
                }}
              />
            </g>
          )}

          {/* Senderos — animados. En variant 'senderos' son los protagonistas:
              destacados, clicables y con su número (11-32). */}
          {PATHS.map(({ num, from, to }, idx) => {
            const s = sefiraMap[from]
            const e = sefiraMap[to]
            const len = Math.hypot(e.x - s.x, e.y - s.y)

            if (!esSenderos) {
              return (
                <line
                  key={num}
                  x1={s.x} y1={s.y}
                  x2={e.x} y2={e.y}
                  stroke={`${cabalaTxt}55`}
                  strokeWidth="2"
                  style={{
                    pointerEvents: 'none',
                    strokeDasharray: len + 4,
                    strokeDashoffset: len + 4,
                    animation: `pathDraw 1.15s ease ${0.15 + idx * 0.085}s forwards`,
                  }}
                />
              )
            }

            const active = hoveredPath === num || selectedSendero === num
            const mx = (s.x + e.x) / 2
            const my = (s.y + e.y) / 2
            return (
              <g
                key={num}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPath(num)}
                onMouseLeave={() => setHoveredPath(null)}
                onClick={() => onSenderoClick?.({ num, from, to })}
              >
                {/* Zona de click ancha (invisible) */}
                <line x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke="transparent" strokeWidth="22" strokeLinecap="round" />
                {/* Línea visible — los senderos son los protagonistas: brillan
                    siempre a plena opacidad (lo que se atenúa son los nodos). */}
                <line
                  x1={s.x} y1={s.y}
                  x2={e.x} y2={e.y}
                  stroke={cabalaTxt}
                  strokeWidth={active ? 6 : 4}
                  strokeLinecap="round"
                  filter={active ? 'url(#sefira-glow-hover)' : 'url(#sefira-glow)'}
                  style={{
                    pointerEvents: 'none',
                    opacity: 1,
                    strokeDasharray: len + 4,
                    strokeDashoffset: len + 4,
                    animation: `pathDraw 0.7s ease ${idx * 0.04}s forwards`,
                    transition: 'stroke-width 0.15s, opacity 0.15s',
                  }}
                />
                {/* Insignia con el número del sendero (1-22 = num − 10). Cuando su
                    ilustración ya se ha visto, la insignia se enciende en dorado. */}
                {(() => {
                  const leido = !!readSenderos?.has(num)
                  // Por defecto (sin ver): círculo relleno de dorado + número en
                  // cabalaBg. Cuando ya se ha visto: al revés (hueco + número dorado).
                  const fillCirculo = leido ? cabalaBg : cabalaTxt
                  const fillNumero = leido ? cabalaTxt : cabalaBg
                  return (
                    <g style={{ pointerEvents: 'none', opacity: 0, animation: `senderoBadge 0.4s ease ${0.7 + idx * 0.04}s forwards` }}>
                      <circle
                        cx={mx} cy={my} r={active ? 12 : 10}
                        fill={fillCirculo}
                        stroke={cabalaTxt} strokeWidth={active ? 2.5 : 1.5}
                        style={!leido ? { filter: `drop-shadow(0 0 5px ${cabalaTxt})` } : undefined}
                      />
                      <text x={mx} y={my + 3} textAnchor="middle" fontSize="9" fontFamily="Georgia, serif"
                            fill={fillNumero} style={{ fill: fillNumero }}>
                        {num - 10}
                      </text>
                    </g>
                  )
                })()}
              </g>
            )
          })}

          {/* Sefirot. En variant 'senderos' quedan atenuadas (secundarias). */}
          {SEFIROT.map((sefira) => {
            const isOpen    = open?.key === sefira.key
            const isHovered = hovered === sefira.key
            const active    = isOpen || isHovered

            // Modo senderos: círculos huecos y tenues, sin interacción.
            if (esSenderos) {
              return (
                <g
                  key={sefira.key}
                  style={{
                    pointerEvents: 'none',
                    opacity: 0,
                    transformOrigin: `${sefira.x}px ${sefira.y}px`,
                    animation: `sefiraAppear 0.55s cubic-bezier(0.34,1.56,0.64,1) ${0.4 + sefira.number * 0.07}s forwards`,
                  }}
                >
                  {/* Fondo del nodo: su foto propia (sefirotfondo) MUY atenuada —
                      los nodos quedan en segundo plano para que los que brillen
                      sean los senderos (las líneas). */}
                  <circle cx={sefira.x} cy={sefira.y} r={R} fill="url(#sefira-node-img)" opacity={0.4} />
                  <circle cx={sefira.x} cy={sefira.y} r={R} fill={`${cabalaBg}99`} />
                  <circle cx={sefira.x} cy={sefira.y} r={R} fill="none" stroke={`${cabalaTxt}44`} strokeWidth={1.2} />
                  <text
                    x={sefira.x} y={sefira.y + 4}
                    textAnchor="middle" fontSize="9" fontFamily="Georgia, serif" fontStyle="italic"
                    fill={`${cabalaTxt}99`} style={{ fill: `${cabalaTxt}99`, textShadow: `0 1px 3px #000` }}
                  >
                    {sefira.hebrewName}
                  </text>
                </g>
              )
            }

            const strokeColor = active ? cabalaTxt : `${cabalaTxt}88`
            const strokeW     = active ? 3 : 2

            return (
              <g
                key={sefira.key}
                onClick={() => handleClick(sefira)}
                onMouseEnter={() => setHovered(sefira.key)}
                onMouseLeave={() => setHovered(null)}
                filter={active ? 'url(#sefira-glow-hover)' : 'url(#sefira-glow)'}
                style={{
                  cursor: 'pointer',
                  opacity: 0,
                  transformOrigin: `${sefira.x}px ${sefira.y}px`,
                  animation: `sefiraAppearEpic 0.95s cubic-bezier(0.34,1.56,0.64,1) ${0.55 + sefira.number * 0.13}s forwards`,
                }}
              >
                {/* Fondo del nodo = imagen propia de las sefirot. Un velo oscuro
                    encima da contraste al nombre dorado; al pasar el ratón, se
                    aclara para resaltar el nodo. */}
                <circle cx={sefira.x} cy={sefira.y} r={R} fill="url(#sefira-node-img)" />
                <circle cx={sefira.x} cy={sefira.y} r={R} fill={active ? `${cabalaBg}44` : `${cabalaBg}80`} />
                <circle
                  cx={sefira.x} cy={sefira.y} r={R}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeW}
                />
                {/* Nombre hebreo centrado */}
                <text
                  x={sefira.x} y={sefira.y + 4}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fill={cabalaTxt}
                  style={{ fill: cabalaTxt, textShadow: `0 1px 3px #000, 0 0 6px ${cabalaBg}` }}
                >
                  {sefira.hebrewName}
                </text>
              </g>
            )
          })}

          {/* Da'at — la sefirá oculta. No tiene nodo "oficial" en el árbol; se
              dibuja como un círculo fantasma (borde discontinuo) en el centro,
              entre Chokhmah y Binah. Clicable → su dimensión del recorrido. */}
          {!esSenderos && showDaat && (
            <g
              onClick={() => onDaatClick?.()}
              onMouseEnter={() => setDaatHover(true)}
              onMouseLeave={() => setDaatHover(false)}
              filter={daatHover ? 'url(#sefira-glow-hover)' : 'url(#sefira-glow)'}
              style={{
                cursor: 'pointer',
                opacity: 0,
                transformOrigin: '200px 140px',
                animation: 'daatAppear 0.9s cubic-bezier(0.34,1.56,0.64,1) 2.1s forwards',
              }}
            >
              <circle
                cx={200} cy={140} r={27}
                fill={`${cabalaBg}dd`}
                stroke={daatHover ? cabalaTxt : `${cabalaTxt}aa`}
                strokeWidth={daatHover ? 2.5 : 1.8}
                strokeDasharray="4 5"
              />
              <text
                x={200} y={144}
                textAnchor="middle"
                fontSize="9"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fill={cabalaTxt}
                style={{ fill: cabalaTxt }}
              >
                Da'at
              </text>
            </g>
          )}

          {/* Sellos «leída» — capa superior, nítida (sin el filtro de brillo de
              los nodos). Se pinta un sello por cada sefirá ya vista. */}
          {!esSenderos && readKeys && (
            <g>
              {SEFIROT.filter((s) => readKeys.has(s.key)).map((s) => (
                <ReadSeal key={`seal-${s.key}`} x={s.x} y={s.y} />
              ))}
              {showDaat && readKeys.has('daat') && <ReadSeal x={200} y={140} nodeR={27} />}
            </g>
          )}
        </svg>
      </div>

      {open && <SefiraModal sefira={open} onClose={() => setOpen(null)} />}
    </>
  )
}
