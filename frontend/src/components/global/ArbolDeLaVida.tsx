'use client'
import React, { useState } from 'react'
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

interface Props {
  onSefiraClick?: (sefira: Sefira) => void
  maxWidth?: string
  suppressInternalModal?: boolean
}

const R = 34

const SEFIROT: Sefira[] = [
  {
    key: 'kether', number: 1, spanishName: 'CORONA', hebrewName: 'Kether', x: 200, y: 45,
    description: 'El primer destello de la existencia. Representa la voluntad divina pura, la chispa primordial de consciencia que precede a toda forma y a todo pensamiento.',
  },
  {
    key: 'chokmah', number: 2, spanishName: 'SABIDURÍA', hebrewName: 'Chokmah', x: 340, y: 140,
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
    key: 'geburah', number: 5, spanishName: 'SEVERIDAD', hebrewName: 'Geburah', x: 60, y: 300,
    description: 'La fuerza disciplinada del poder y el juicio. Representa la voluntad de eliminar lo innecesario, la valentía y la capacidad de transformar a través de la claridad.',
  },
  {
    key: 'tipharet', number: 6, spanishName: 'BELLEZA', hebrewName: 'Tipharet', x: 200, y: 370,
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
    key: 'malkuth', number: 10, spanishName: 'REINO', hebrewName: 'Malkuth', x: 200, y: 660,
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
export default function ArbolDeLaVida({ onSefiraClick, maxWidth = '520px', suppressInternalModal = false }: Props) {
  const [hovered, setHovered] = useState<SefiraKey | null>(null)
  const [open, setOpen]       = useState<Sefira | null>(null)

  const handleClick = (sefira: Sefira) => {
    if (!suppressInternalModal) setOpen(sefira)
    onSefiraClick?.(sefira)
  }

  return (
    <>
      <div style={{ width: '100%', maxWidth, margin: '0 auto' }}>
        <svg
          viewBox="-10 0 420 710"
          width="100%"
          style={{ display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
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

          {/* Senderos — solo líneas, sin etiquetas */}
          {PATHS.map(({ num, from, to }) => {
            const s = sefiraMap[from]
            const e = sefiraMap[to]
            return (
              <line
                key={num}
                x1={s.x} y1={s.y}
                x2={e.x} y2={e.y}
                stroke={`${cabalaTxt}55`}
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              />
            )
          })}

          {/* Sefirot */}
          {SEFIROT.map((sefira) => {
            const isOpen    = open?.key === sefira.key
            const isHovered = hovered === sefira.key
            const active    = isOpen || isHovered

            const fillColor   = active ? cabalaTxt : `${cabalaTxt}cc`
            const strokeColor = active ? cabalaTxt : `${cabalaTxt}88`
            const strokeW     = active ? 3 : 2
            const mainColor   = cabalaBg
            const subColor    = `${cabalaBg}dd`

            return (
              <g
                key={sefira.key}
                onClick={() => handleClick(sefira)}
                onMouseEnter={() => setHovered(sefira.key)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
                filter={active ? 'url(#sefira-glow-hover)' : 'url(#sefira-glow)'}
              >
                <circle
                  cx={sefira.x} cy={sefira.y} r={R}
                  fill={fillColor}
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
                  fill={mainColor}
                >
                  {sefira.hebrewName}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {open && <SefiraModal sefira={open} onClose={() => setOpen(null)} />}
    </>
  )
}
