// ─────────────────────────────────────────────────────────────────────────────
// TU CAMINO · la columna de la izquierda de /home.
//
// Responde de un vistazo a «¿por dónde voy?»: una disciplina comprada por fila,
// con su paso actual, su barra y su porcentaje, y un hilo vertical que las une
// para que se lea como un camino y no como una lista.
//
// De dónde salen los números: GET /recorrido-progreso (una sola petición con
// TODAS las disciplinas) cruzado con los totales de `data/camino.ts`. Lo que se
// pinta es lo MÁS LEJOS que ha llegado, que nunca baja: si vuelve atrás a releer
// una página, su camino no se encoge.
//
// Solo salen las disciplinas COMPRADAS: enseñar el 0% de lo que no tiene sería
// un escaparate, no un camino. Si no ha comprado ninguna, no se pinta nada.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_URL,
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
} from "../../GlobalVariables";
import { useT } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { CAMINO, DISCIPLINAS_CAMINO, pasosAndados, porcentajeCamino, type CaminoKey } from "../../data/camino";

/** Cara de cada disciplina en el camino (el orden es el del Método). */
// Los iconos de GlobalVariables no declaran todos el mismo `size` (unos
// aceptan una cadena y otros solo el objeto por breakpoint), así que aquí se
// pide lo mínimo común y se les pasa siempre la forma que todos entienden.
type IconoDisciplina = React.ComponentType<{ size?: { base: string; md: string } }>;

const CARA: Record<CaminoKey, { nom: string; bg: string; txt: string; Icon: IconoDisciplina }> = {
  metodo:     { nom: astrologiaNom,      bg: astrologiaBg,      txt: astrologiaTxt,      Icon: AstrologiaIcon },
  psicologia: { nom: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt, Icon: NeuropsicologiaIcon },
  ayurveda:   { nom: ayurvedaNom,        bg: ayurvedaBg,        txt: ayurvedaTxt,        Icon: AyurvedaIcon },
  tcm:        { nom: tcmNom,             bg: tcmBg,             txt: tcmTxt,             Icon: TCMIcon },
  fisiologia: { nom: fisiologiaNom,      bg: fisiologiaBg,      txt: fisiologiaTxt,      Icon: FisiologiaIcon },
  nutricion:  { nom: nutricionNom,       bg: nutricionBg,       txt: nutricionTxt,       Icon: NutricionIcon },
  cabala:     { nom: cabalaNom,          bg: cabalaBg,          txt: cabalaTxt,          Icon: CabalaIcon },
  cultura:    { nom: culturaNom,         bg: culturaBg,         txt: culturaTxt,         Icon: CulturaIcon },
};

// El progreso se guarda a nivel de módulo, igual que hace /home con las
// suscripciones: al volver al home dentro de la misma sesión el camino se pinta
// ya hecho, sin un parpadeo a cero.
let progresoCache: Record<string, number> | null = null;

export interface CaminoUsuarioProps {
  /** Qué disciplinas ha comprado. Las demás no se pintan. */
  suscritas: Partial<Record<CaminoKey, boolean | null>>;
}

export default function CaminoUsuario({ suscritas }: CaminoUsuarioProps) {
  const t = useT();
  const navigate = useNavigate();
  const nombreDisciplina = useNombreDisciplina();
  const [progreso, setProgreso] = useState<Record<string, number> | null>(progresoCache);

  const mias = DISCIPLINAS_CAMINO.filter((k) => suscritas[k]);

  useEffect(() => {
    if (progresoCache || mias.length === 0) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    let cancel = false;
    axios
      .get<Record<string, number>>(`${API_URL}/recorrido-progreso`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => {
        const datos = r.data && typeof r.data === "object" ? r.data : {};
        progresoCache = datos;
        if (!cancel) setProgreso(datos);
      })
      // Sin progreso no se pinta el camino: mejor nada que un 0% que no es verdad.
      .catch(() => { if (!cancel) setProgreso(null); });
    return () => { cancel = true; };
  }, [mias.length]);

  if (mias.length === 0 || !progreso) return null;

  // El porcentaje de arriba es el del recorrido ENTERO que ha comprado: pasos
  // andados entre pasos que tiene. Así una disciplina larga pesa lo que pesa, y
  // no lo mismo que una corta.
  const andadosTotal = mias.reduce((a, k) => a + pasosAndados(progreso, k), 0);
  const pasosTotal = mias.reduce((a, k) => a + CAMINO[k].total, 0);
  const pctTotal = pasosTotal ? Math.round((andadosTotal / pasosTotal) * 100) : 0;

  return (
    <Box
      w="100%"
      maxW={{ base: "420px", md: "260px" }}
      px={{ base: 4, md: 4 }}
      py={{ base: 4, md: 5 }}
      borderRadius="2xl"
      bg="rgba(255,255,255,0.07)"
      border="1px solid rgba(255,255,255,0.2)"
      fontFamily="'EB Garamond', serif"
    >
      {/* ── Cabecera: el total ── */}
      <Text color="white" fontSize="sm" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase">
        {t("home.camino.titulo")}
      </Text>
      <Flex align="baseline" gap={2} mt={1}>
        <Text color="white" fontSize="2xl" fontWeight="700" lineHeight="1">
          {pctTotal}%
        </Text>
        <Text color="rgba(255,255,255,0.7)" fontSize="xs">
          {t("home.camino.andado", { hechos: String(andadosTotal), total: String(pasosTotal) })}
        </Text>
      </Flex>
      <Barra pct={pctTotal} color="white" pista="rgba(255,255,255,0.22)" mt={2} />

      {/* ── Las disciplinas, unidas por el hilo del camino ── */}
      <Box position="relative" mt={5}>
        {/* el hilo: de la primera bolita a la última */}
        {mias.length > 1 && (
          <Box
            position="absolute"
            left="13px"
            top="14px"
            bottom="14px"
            w="2px"
            bg="rgba(255,255,255,0.22)"
            borderRadius="full"
          />
        )}

        <Flex direction="column" gap={4}>
          {mias.map((key) => {
            const cara = CARA[key];
            const def = CAMINO[key];
            const hechos = pasosAndados(progreso, key);
            const pct = porcentajeCamino(progreso, key);
            const Icon = cara.Icon;
            const completa = hechos >= def.total;

            return (
              <Flex
                key={key}
                as="button"
                onClick={() => navigate(def.ruta)}
                align="flex-start"
                gap={3}
                w="100%"
                textAlign="left"
                position="relative"
                cursor="pointer"
                role="group"
                title={nombreDisciplina(cara.nom)}
              >
                {/* la bolita del camino, con el color de su disciplina */}
                <Flex
                  flexShrink={0}
                  align="center"
                  justify="center"
                  w="28px"
                  h="28px"
                  borderRadius="full"
                  bg={cara.bg}
                  border={`2px solid ${completa ? cara.txt : `${cara.txt}99`}`}
                  transition="all 0.2s"
                  _groupHover={{ borderColor: cara.txt, transform: "scale(1.08)" }}
                  style={{ boxShadow: completa ? `0 0 12px ${cara.txt}88` : "none" }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" style={{ filter: `drop-shadow(0 0 4px ${cara.bg})` }}>
                    <Icon size={{ base: "17px", md: "17px" }} />
                  </Box>
                </Flex>

                <Box flex="1" minW={0}>
                  <Flex align="baseline" justify="space-between" gap={2}>
                    <Text color="white" fontSize="sm" fontWeight="600" noOfLines={1}>
                      {nombreDisciplina(cara.nom, true)}
                    </Text>
                    <Text color="rgba(255,255,255,0.75)" fontSize="xs" flexShrink={0}>
                      {pct}%
                    </Text>
                  </Flex>

                  <Text color="rgba(255,255,255,0.62)" fontSize="xs" mt="1px" noOfLines={1}>
                    {completa
                      ? t("home.camino.completa")
                      : hechos === 0
                        ? t("home.camino.sinEmpezar")
                        : def.porPiezas
                          ? t("home.camino.piezas", { hechos: String(hechos), total: String(def.total) })
                          : t("home.camino.paso", { paso: String(hechos), total: String(def.total) })}
                  </Text>

                  <Barra pct={pct} color={cara.txt} pista="rgba(255,255,255,0.18)" mt={1.5} />
                </Box>
              </Flex>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
}

/**
 * Barrita de avance. Arranca a cero y crece hasta su valor en cuanto se pinta:
 * ver cómo se llena es medio motivo de que esta columna exista. Sin ese primer
 * fotograma a cero no habría transición que animar, porque el ancho ya vendría
 * puesto desde el primer render.
 */
function Barra({
  pct,
  color,
  pista,
  mt,
}: {
  pct: number;
  color: string;
  pista: string;
  mt?: number | string;
}) {
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAncho(Math.max(0, Math.min(100, pct))));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <Box mt={mt} w="100%" h="5px" borderRadius="full" bg={pista} overflow="hidden">
      <Box
        h="100%"
        w={`${ancho}%`}
        borderRadius="full"
        bg={color}
        transition="width 0.9s cubic-bezier(0.22, 1, 0.36, 1)"
        style={{ boxShadow: `0 0 10px ${color}99` }}
      />
    </Box>
  );
}
