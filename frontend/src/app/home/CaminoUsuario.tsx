// ─────────────────────────────────────────────────────────────────────────────
// TU CAMINO · la columna de la izquierda de /home.
//
// Empieza PLEGADO: lo único que se ve es un botón con el avance del conjunto.
// Al abrirlo aparecen los boxes, uno por disciplina comprada y en el orden de la
// portada: icono a la izquierda, el nombre arriba y su línea de progreso debajo.
// Plegado por defecto porque el mandala es el protagonista de /home; esto es
// para cuando se pregunta «¿por dónde voy?», no para mirarlo todo el rato.
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
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { cacheDeOtraCuenta } from "../../api/sesion";

/** Cara de cada disciplina en el camino (el orden es el del Método). */
// Los iconos de GlobalVariables no declaran todos el mismo `size` (unos
// aceptan una cadena y otros solo el objeto por breakpoint), así que aquí se
// pide lo mínimo común y se les pasa siempre la forma que todos entienden.
type IconoDisciplina = React.ComponentType<{ size?: { base: string; md: string } }>;

// `clara`: acuarela CLARA con tinta oscura (psicología): su box va sin velo
// oscuro y sin sombra negra en los textos, que sobre fondo claro lo único que
// hacían era ensuciarlo.
const CARA: Record<CaminoKey, { nom: string; bg: string; txt: string; Icon: IconoDisciplina; clara?: boolean }> = {
  metodo:     { nom: astrologiaNom,      bg: astrologiaBg,      txt: astrologiaTxt,      Icon: AstrologiaIcon },
  psicologia: { nom: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt, Icon: NeuropsicologiaIcon, clara: true },
  fisiologia: { nom: fisiologiaNom,      bg: fisiologiaBg,      txt: fisiologiaTxt,      Icon: FisiologiaIcon },
  nutricion:  { nom: nutricionNom,       bg: nutricionBg,       txt: nutricionTxt,       Icon: NutricionIcon },
  ayurveda:   { nom: ayurvedaNom,        bg: ayurvedaBg,        txt: ayurvedaTxt,        Icon: AyurvedaIcon },
  tcm:        { nom: tcmNom,             bg: tcmBg,             txt: tcmTxt,             Icon: TCMIcon },
  cabala:     { nom: cabalaNom,          bg: cabalaBg,          txt: cabalaTxt,          Icon: CabalaIcon },
  cultura:    { nom: culturaNom,         bg: culturaBg,         txt: culturaTxt,         Icon: CulturaIcon },
};

// El progreso se guarda a nivel de módulo, igual que hace /home con las
// suscripciones: al volver al home dentro de la misma sesión el camino se pinta
// ya hecho, sin un parpadeo a cero.
let progresoCache: Record<string, number> | null = null;

// Si lo ha abierto, sigue abierto al volver al home dentro de la misma sesión
// (pero en una visita nueva vuelve a empezar plegado).
let abiertoCache = false;

export interface CaminoUsuarioProps {
  /** Qué disciplinas ha comprado. Las demás no se pintan. */
  suscritas: Partial<Record<CaminoKey, boolean | null>>;
}

export default function CaminoUsuario({ suscritas }: CaminoUsuarioProps) {
  // Si se ha cambiado de cuenta en esta pestaña, lo guardado es de la otra.
  if (cacheDeOtraCuenta("camino")) {
    progresoCache = null;
    abiertoCache = false;
  }
  const t = useT();
  const navigate = useNavigate();
  const nombreDisciplina = useNombreDisciplina();
  const [progreso, setProgreso] = useState<Record<string, number> | null>(progresoCache);
  const [abierto, setAbierto] = useState(abiertoCache);

  const alternar = () => {
    abiertoCache = !abierto;
    setAbierto(!abierto);
  };

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

  // En `lg` (columna fija a la izquierda) va estrecha, que a ese ancho de
  // pantalla los 320px chocaban con el título centrado; en `xl` recupera
  // su ancho. En móvil (debajo del mandala) sigue a sus anchas.
  return (
    <Box w="100%" maxW={{ base: "420px", md: "320px", lg: "240px", xl: "320px" }} fontFamily="'EB Garamond', serif">
      {/* ── El botón: lo único que se ve de entrada ── */}
      <Flex
        as="button"
        onClick={alternar}
        aria-expanded={abierto}
        direction="column"
        w="100%"
        px={4}
        py={3}
        textAlign="left"
        borderRadius="xl"
        bg="rgba(255,255,255,0.07)"
        // 2px, como los boxes de las disciplinas de abajo: el mismo trazo en
        // toda la columna. Aquí en blanco, que es el color de esta caja.
        border="2px solid rgba(255,255,255,0.32)"
        cursor="pointer"
        transition="background 0.2s ease, border-color 0.2s ease"
        _hover={{ bg: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.38)" }}
      >
        <Flex w="100%" align="center" justify="space-between" gap={2}>
          <Text color="white" fontSize="sm" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase">
            {t("home.camino.titulo")}
          </Text>
          <Flex align="center" gap={2} flexShrink={0}>
            <Text color="white" fontSize="lg" fontWeight="700" lineHeight="1">
              {pctTotal}%
            </Text>
            {/* la punta de flecha: apunta abajo plegado, arriba desplegado */}
            <Box
              as="span"
              w="8px"
              h="8px"
              borderRight="2px solid rgba(255,255,255,0.8)"
              borderBottom="2px solid rgba(255,255,255,0.8)"
              transform={abierto ? "rotate(-135deg) translate(-2px, -2px)" : "rotate(45deg)"}
              transition="transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
            />
          </Flex>
        </Flex>
        <Barra pct={pctTotal} color="white" pista="rgba(255,255,255,0.22)" mt={2} />
      </Flex>

      {/* ── Los boxes: aparecen al desplegar, en cascada ──
          El alto se anima con `grid-template-rows` (de 0fr a 1fr) en vez de con
          un `maxHeight` a ojo: así la transición dura lo mismo tenga una
          disciplina o las ocho, y nunca corta el contenido. */}
      <Box
        display="grid"
        gridTemplateRows={abierto ? "1fr" : "0fr"}
        transition="grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1)"
      >
        <Box overflow="hidden" minH="0">
          <Flex direction="column" gap={2.5} pt={abierto ? 3 : 0} transition="padding-top 0.45s ease">
            {mias.map((key, i) => {
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
                  align="center"
                  gap={3}
                  w="100%"
                  p={3}
                  textAlign="left"
                  borderRadius="lg"
                  // La foto de la disciplina hace de fondo; debajo, su color
                  // sólido, que es lo que se ve mientras la acuarela llega (y en
                  // Astrología, que no tiene foto sino cielo estrellado).
                  bg={cara.bg}
                  // El marco de cada box: 2px del Txt de su disciplina, igual en
                  // todos (antes iba a 1px y casi transparente y cada tarjeta
                  // parecía de una casa distinta).
                  border={`2px solid ${cara.txt}`}
                  // La misma sombra del hover con alfa 0: así el halo es un
                  // fundido del acento y no cruza por negro (ver foco.ts).
                  boxShadow={`0 0 14px ${cara.txt}00`}
                  overflow="hidden"
                  position="relative"
                  cursor="pointer"
                  role="group"
                  title={nombreDisciplina(cara.nom)}
                  // La cascada: cada box entra un pelín después que el de
                  // arriba, y al plegar se van todos a la vez (sin retraso).
                  opacity={abierto ? 1 : 0}
                  transform={abierto ? "translateY(0)" : "translateY(-6px)"}
                  transition={`opacity 0.35s ease ${abierto ? i * 0.05 : 0}s, transform 0.35s ease ${abierto ? i * 0.05 : 0}s, background 0.2s ease, box-shadow 0.2s ease`}
                  // Al pasar por encima el marco no cambia: se enciende un halo
                  // suave con el acento de la disciplina (nunca blanco).
                  _hover={{ boxShadow: `0 0 14px ${cara.txt}59` }}
                >
                  {/* Fondo: la acuarela de la disciplina, BIEN visible — el velo
                      va muy ligero y la legibilidad la ponen las sombras de los
                      textos, no el oscurecido. */}
                  {hasDisciplinaBg(cara.nom) && (
                    <DisciplinaBgLayer nom={cara.nom} borderRadius="lg"
                                       overlay={cara.clara ? "rgba(0,0,0,0)" : "rgba(8,13,30,0.22)"} />
                  )}

                  {/* Icono, a la izquierda, suelto sobre la acuarela: sin cajita
                      y sin sombra, solo el trazo con el color de su disciplina. */}
                  <Box
                    position="relative"
                    zIndex={1}
                    flexShrink={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="transform 0.2s ease"
                    _groupHover={{ transform: "scale(1.12)" }}
                  >
                    <Icon size={{ base: "32px", md: "32px" }} />
                  </Box>

                  {/* El nombre arriba y, debajo, su línea de progreso */}
                  <Box position="relative" zIndex={1} flex="1" minW={0}>
                    {/* Los textos van con el Txt de su disciplina, como dentro
                        de cualquier box de la casa. La sombra oscura da la
                        legibilidad sobre las acuarelas oscuras; sobre una clara
                        (psicología) no hay sombra: la tinta ya se lee sola. */}
                    <Flex align="baseline" justify="space-between" gap={2}>
                      <Text color={cara.txt} fontSize="sm" fontWeight="600" noOfLines={1}
                            textShadow={cara.clara ? "none" : "0 1px 5px rgba(0,0,0,0.85), 0 0 14px rgba(0,0,0,0.5)"}>
                        {nombreDisciplina(cara.nom, true)}
                      </Text>
                      <Text color={cara.txt} opacity={0.9} fontSize="xs" flexShrink={0}
                            textShadow={cara.clara ? "none" : "0 1px 5px rgba(0,0,0,0.85)"}>
                        {pct}%
                      </Text>
                    </Flex>

                    {/* Sobre acuarela clara el carril blanco no se veía: va en
                        la propia tinta, muy tenue. */}
                    <Barra pct={abierto ? pct : 0} color={cara.txt}
                           pista={cara.clara ? `${cara.txt}2b` : "rgba(255,255,255,0.24)"} mt={1.5} />

                    <Text color={cara.txt} opacity={0.82} fontSize="xs" mt="3px" noOfLines={1}
                          textShadow={cara.clara ? "none" : "0 1px 5px rgba(0,0,0,0.85)"}>
                      {completa
                        ? t("home.camino.completa")
                        : hechos === 0
                          ? t("home.camino.sinEmpezar")
                          : def.porPiezas
                            ? t("home.camino.piezas", { hechos: String(hechos), total: String(def.total) })
                            : t("home.camino.paso", { paso: String(hechos), total: String(def.total) })}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Flex>
        </Box>
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
