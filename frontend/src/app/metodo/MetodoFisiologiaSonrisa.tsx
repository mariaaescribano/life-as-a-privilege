import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { FichaFisioModal } from "../../components/metodo/celulasUi";
import { glowHeader, glowSuave, glowSuaveHover, glowSuaveVisto } from "../../components/metodo/FotoBox";
import { MarcaLeido } from "../../components/metodo/MarcaLeido";
import { Reveal } from "../../components/global/Reveal";
import { useLeidos } from "../../hooks/useLeidos";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon,
  noSelectSx,
} from "../../GlobalVariables";
import {
  ESPEJO_FOTO,
  ORGANOS_SONRISA,
  SONRISA_CAMPO,
  type OrganoSonrisa,
} from "../../hardCoded/espacio/SonrisaFisiologia";

// ── La sonrisa interior ──────────────────────────────────────────────────────
// Práctica que cierra el recorrido de Fisiología (entre Niveles y Cursos). Todo
// lo anterior ha sido mirar el cuerpo «desde fuera»: aquí el usuario se mira en
// un espejo y reconoce que ese hígado, esos riñones y ese corazón son SUYOS.
// Pulsa cada órgano, lee lo que está haciendo por él ahora mismo y le da las
// gracias. Lo agradecido se guarda en metodo_fisiologia.data (useLeidos), así
// que la práctica se puede dejar a medias y retomar.
//
// No bloquea el paso a Cursos: es una práctica, no una prueba.

// Glow de las cajas ÚNICAS de la página (el espejo y el cierre): el mismo que
// pinta la cabecera. Las cajas que van en fila o en rejilla (los tres pasos, los
// chips de los órganos) llevan `glowSuave`: el halo de la cabecera lleva capas
// blancas de hasta 60px y, repetido, funde los halos y pinta un «box clarito»
// sobre el turquesa.
const CAJA_GLOW = glowHeader(fisiologiaTxt);
const CAJA_GLOW_FILA = glowSuave(fisiologiaTxt);

// Latido de los puntos aún sin agradecer: llaman la atención sin marear.
const latido = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.85; }
  50%      { transform: scale(1.28); opacity: 1; }
`;

// Halo que se expande alrededor del punto (la «llamada» del órgano).
const halo = keyframes`
  0%   { transform: scale(0.7); opacity: 0.55; }
  70%  { transform: scale(2.1); opacity: 0; }
  100% { transform: scale(2.1); opacity: 0; }
`;

// Sonrisa (Material Symbols) — el icono de la práctica y del botón «Gracias».
const Sonrisa = ({ size, color = fisiologiaTxt }: { size: any; color?: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={color} flexShrink={0}>
    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-80q68 0 123.5-38.5T684-381h-66q-22 37-58.5 59T480-300q-43 0-79.5-22T342-381h-66q25 62 80.5 100.5T480-242ZM348-490q21 0 35.5-14.5T398-540q0-21-14.5-35.5T348-590q-21 0-35.5 14.5T298-540q0 21 14.5 35.5T348-490Zm264 0q21 0 35.5-14.5T662-540q0-21-14.5-35.5T612-590q-21 0-35.5 14.5T562-540q0 21 14.5 35.5T612-490Z" />
  </Box>
);

// ── Punto pulsable sobre el cuerpo del espejo ────────────────────────────────
function PuntoOrgano({ organo, hecho, onClick }: { organo: OrganoSonrisa; hecho: boolean; onClick: () => void }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      title={organo.nombre}
      aria-label={organo.nombre}
      position="absolute"
      top={`${organo.hotspot.top}%`}
      left={`${organo.hotspot.left}%`}
      transform="translate(-50%, -50%)"
      zIndex={3}
      w="34px"
      h="34px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      cursor="pointer"
      transition="transform 0.2s ease"
      _hover={{ transform: "translate(-50%, -50%) scale(1.22)" }}
      _active={{ transform: "translate(-50%, -50%) scale(1.05)" }}
    >
      {hecho ? (
        <MarcaLeido inline tinta={fisiologiaTxt} bg={fisiologiaBg} size="22px" iconSize="12px"
                    title={`${organo.nombre} · gracias dadas`} />
      ) : (
        <>
          {/* Halo que se expande (solo decorativo) */}
          <Box position="absolute" w="18px" h="18px" borderRadius="full"
               border={`1px solid ${fisiologiaTxt}`} pointerEvents="none"
               animation={`${halo} 2.6s ease-out infinite`} />
          <Box w="13px" h="13px" borderRadius="full" bg="#ffffff"
               boxShadow={`0 0 10px #ffffff, 0 0 20px ${fisiologiaTxt}`}
               animation={`${latido} 2.6s ease-in-out infinite`} />
        </>
      )}
    </Box>
  );
}

// ── Chip con el nombre del órgano (misma acción que el punto) ────────────────
// El cuerpo es bonito pero los puntos son pequeños, sobre todo en el móvil: esta
// fila da la lista completa y deja claro cuántos quedan.
function ChipOrgano({ organo, hecho, onClick }: { organo: OrganoSonrisa; hecho: boolean; onClick: () => void }) {
  return (
    <Flex
      as="button"
      onClick={onClick}
      align="center"
      justify="center"
      gap={2}
      w="100%"
      position="relative"
      overflow="hidden"
      borderRadius="xl"
      px={{ base: 3, md: 4 }}
      py={{ base: 3, md: 3.5 }}
      cursor="pointer"
      boxShadow={hecho ? glowSuaveVisto(fisiologiaTxt) : CAJA_GLOW_FILA}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: "translateY(-3px)", boxShadow: glowSuaveHover(fisiologiaTxt) }}
      _active={{ transform: "translateY(-1px)" }}
    >
      {/* Sin `overlay`, como la cabecera. Antes el velo distinguía además el
          chip agradecido (88) del pendiente (cc); ese aviso lo siguen dando el
          halo `glowSuaveVisto` y la marca de leído, que se ven mucho mejor. */}
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="xl" />
      <Text position="relative" zIndex={1} color={fisiologiaTxt} fontWeight={700}
            fontSize={{ base: "md", md: "lg" }} lineHeight="1.2"
            style={{ textShadow: "0 1px 5px rgba(0,0,0,0.8)" }}>
        {organo.nombre}
      </Text>
      {hecho && (
        <Box position="relative" zIndex={1}>
          <MarcaLeido inline tinta={fisiologiaTxt} bg={fisiologiaBg} size="20px" iconSize="11px"
                      title="Gracias dadas" />
        </Box>
      )}
    </Flex>
  );
}

// ── Los tres pasos de la práctica (mira · respira · agradece) ────────────────
const PASOS: { n: string; titulo: string; texto: string }[] = [
  { n: "1", titulo: "Mira", texto: "Pulsa un órgano y míralo. Eso está dentro de ti ahora mismo." },
  { n: "2", titulo: "Respira", texto: "Toma aire despacio y llévalo, con la atención, hasta ese lugar de tu cuerpo." },
  { n: "3", titulo: "Agradece", texto: "Dale las gracias por lo que lleva haciendo por ti toda tu vida." },
];

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaSonrisa() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [abierto, setAbierto] = useState<OrganoSonrisa | null>(null);
  // ¿Ya le había dado las gracias ANTES de abrir la ficha? (aviso del popup)
  const [yaAgradecido, setYaAgradecido] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const { leido, marcarLeido, snapshot } = useLeidos("metodo-fisiologia");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        // El espejo es LA imagen de la página: no se muestra a medio cargar.
        await precargarImagenes([ESPEJO_FOTO, ...ORGANOS_SONRISA.map((o) => o.foto)].map(encodeURI));
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  const hechos = useMemo(
    () => ORGANOS_SONRISA.filter((o) => leido(SONRISA_CAMPO, o.key)).length,
    [leido],
  );
  const completo = hechos === ORGANOS_SONRISA.length;

  const abrir = (o: OrganoSonrisa) => {
    setYaAgradecido(snapshot(SONRISA_CAMPO).has(o.key));
    setAbierto(o);
  };

  const salta = (d: number) => {
    if (!abierto) return;
    const i = ORGANOS_SONRISA.findIndex((o) => o.key === abierto.key);
    abrir(ORGANOS_SONRISA[(i + d + ORGANOS_SONRISA.length) % ORGANOS_SONRISA.length]);
  };

  // Dar las gracias: se marca (y se guarda) y la práctica sigue sola con el
  // siguiente órgano que quede pendiente. Si no queda ninguno, se cierra la
  // ficha y aparece el cierre de la práctica bajo el espejo.
  const darGracias = (o: OrganoSonrisa) => {
    marcarLeido(SONRISA_CAMPO, o.key);
    const i = ORGANOS_SONRISA.findIndex((x) => x.key === o.key);
    const orden = [...ORGANOS_SONRISA.slice(i + 1), ...ORGANOS_SONRISA.slice(0, i)];
    const siguiente = orden.find((x) => !leido(SONRISA_CAMPO, x.key));
    if (siguiente) abrir(siguiente);
    else setAbierto(null);
  };

  if (loading) return <FisiologiaLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title="La sonrisa interior"
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: "← Niveles", onClick: () => navigate("/metodo/fisiologia/niveles") }}
              extra={celulasBtn}
              next={{ label: "Cursos →", onClick: () => navigate("/metodo/fisiologia/cursos") }}
            />
          </Reveal>

          {/* Texto bajo el header: va sobre el turquesa limpio, SIN sombra. */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%" display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={3} maxW="760px" textAlign="center">
              <Text color="white" fontSize={{ base: "md", md: "xl" }} fontStyle="italic" lineHeight="1.8">
                Has recorrido tu cuerpo de la partícula al organismo. Ahora mírate: todo eso está dentro de ti
                mientras lees esto. Esta práctica es antigua y se llama «la sonrisa interior»: consiste en visitar tus órganos uno a uno
                y darles las gracias.
              </Text>
            </Flex>
          </Reveal>

          {/* ── Los tres pasos ── */}
          <Reveal direction="up" distance={18} delay={0.2} duration={0.6} w="100%" display="flex" justifyContent="center">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 3, md: 4 }} w="100%" maxW="900px">
              {PASOS.map((p) => (
                <Flex key={p.n} direction="column" align="center" textAlign="center" gap={2.5}
                      position="relative" overflow="hidden" borderRadius="2xl" boxShadow={CAJA_GLOW_FILA}
                      px={{ base: 5, md: 5 }} py={{ base: 6, md: 7 }}>
                  {/* Sin `overlay`: la acuarela se ve tal cual, igual que en la
                      cabecera. El texto se sostiene con su sombra negra. */}
                  <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                  {/* El círculo del número sí va en color macizo: es una chapa
                      pequeña y translúcida se ensuciaría con el dibujo de las
                      células por debajo. */}
                  <Flex position="relative" zIndex={1} align="center" justify="center" flexShrink={0}
                        w={{ base: "46px", md: "52px" }} h={{ base: "46px", md: "52px" }} borderRadius="full"
                        border={`2px solid ${fisiologiaTxt}`} bg={fisiologiaBg}>
                    <Text color={fisiologiaTxt} fontWeight={700} fontSize={{ base: "xl", md: "2xl" }} lineHeight="1"
                          style={{ textShadow: `0 1px 6px ${fisiologiaBg}` }}>
                      {p.n}
                    </Text>
                  </Flex>
                  <Text position="relative" zIndex={1} color={fisiologiaTxt} fontWeight={700}
                        fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.04em"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                    {p.titulo}
                  </Text>
                  <Text position="relative" zIndex={1} color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }}
                        fontStyle="italic" lineHeight="1.6"
                        style={{ textShadow: "0 1px 5px rgba(0,0,0,0.8)" }}>
                    {p.texto}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Reveal>

          {/* ── EL ESPEJO ────────────────────────────────────────────────────
              Marco con arco arriba (espejo de pie) y, dentro, la figura
              anatómica en modo `screen`: su fondo negro desaparece y el cuerpo
              queda brillando sobre el fondo de Fisiología. Encima, un punto
              pulsable por órgano. ─────────────────────────────────────────── */}
          <Reveal direction="up" distance={22} delay={0.28} duration={0.7} w="100%" display="flex" justifyContent="center">
            <Box position="relative" w="100%" maxW={{ base: "340px", md: "460px" }}
                 borderRadius="220px 220px 24px 24px" overflow="hidden"
                 border={`1px solid ${fisiologiaTxt}66`} boxShadow={CAJA_GLOW}
                 // `isolate` acota aquí la mezcla del cuerpo (ver abajo): así el
                 // `screen` se hace contra el fondo del espejo y NO contra el
                 // turquesa de la página.
                 sx={{ isolation: "isolate" }}>
              {/* Éste es el ÚNICO box de la página que conserva algo de velo, y
                  es por el `screen` del cuerpo (abajo): `screen` aclara, así que
                  cuanto más oscuro el fondo, más brilla la figura dorada. Sin
                  nada de velo, sobre las manchas rosas claras de la acuarela el
                  cuerpo se lava y pierde el filo. Con 25 % la acuarela se ve de
                  sobra y el cuerpo sigue recortado. */}
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="220px 220px 24px 24px"
                                 overlay={`${fisiologiaBg}40`} />

              {/* Cuerpo. `screen` quita el negro de la ilustración y deja el
                  dorado brillando sobre el fondo. OJO: este contenedor NO puede
                  llevar zIndex — crearía su propio contexto de apilamiento, la
                  mezcla quedaría aislada dentro de él y se vería un rectángulo
                  negro. Sin zIndex se pinta encima del fondo igual (va después
                  en el DOM) y el `screen` sí alcanza al fondo. */}
              <Box position="relative" w="100%" aspectRatio={1024 / 1536}>
                <Box as="img" src={encodeURI(ESPEJO_FOTO)} alt="Tu cuerpo"
                     position="absolute" inset={0} w="100%" h="100%"
                     style={{ objectFit: "contain", mixBlendMode: "screen" }} />

                {/* Reflejo del cristal: una banda de luz diagonal muy suave.
                    En hex-alpha, nunca rgba(): las comas rompen bgGradient. */}
                <Box position="absolute" inset={0} zIndex={2} pointerEvents="none"
                     bgGradient="linear(120deg, #ffffff1a 0%, #ffffff00 38%, #ffffff00 62%, #ffffff0d 100%)" />

                {ORGANOS_SONRISA.map((o) => (
                  <PuntoOrgano key={o.key} organo={o} hecho={leido(SONRISA_CAMPO, o.key)}
                               onClick={() => abrir(o)} />
                ))}
              </Box>

              {/* Progreso, dentro del propio marco del espejo. */}
              <Flex position="relative" zIndex={3} direction="column" align="center" gap={2}
                    px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }} pt={1}>
                <Flex align="center" gap={2.5}>
                  <Sonrisa size={{ base: "22px", md: "26px" }} />
                  <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} fontWeight={700}
                        letterSpacing="0.04em" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>
                    {completo
                      ? "Has sonreído a todo tu cuerpo"
                      : `Has sonreído a ${hechos} de ${ORGANOS_SONRISA.length}`}
                  </Text>
                </Flex>
                <Box w="100%" maxW="260px" h="4px" borderRadius="full" bg={`${fisiologiaTxt}2a`} overflow="hidden">
                  <Box h="100%" borderRadius="full" bg={fisiologiaTxt}
                       boxShadow={`0 0 10px ${fisiologiaTxt}`}
                       transition="width 0.5s ease"
                       w={`${(hechos / ORGANOS_SONRISA.length) * 100}%`} />
                </Box>
              </Flex>
            </Box>
          </Reveal>

          {/* ── Lista de órganos (los mismos que los puntos) ── */}
          <Reveal direction="up" distance={18} delay={0.34} duration={0.6} w="100%" display="flex" justifyContent="center">
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 3, md: 4 }} w="100%" maxW="900px">
              {ORGANOS_SONRISA.map((o) => (
                <ChipOrgano key={o.key} organo={o} hecho={leido(SONRISA_CAMPO, o.key)} onClick={() => abrir(o)} />
              ))}
            </SimpleGrid>
          </Reveal>

          {/* ── Cierre: solo cuando ha agradecido los doce ── */}
          {completo && (
            <Reveal direction="up" distance={20} duration={0.7} w="100%" display="flex" justifyContent="center">
              <Flex direction="column" align="center" textAlign="center" gap={3} maxW="640px" w="100%"
                    position="relative" overflow="hidden" borderRadius="2xl" boxShadow={CAJA_GLOW}
                    px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                <Box position="relative" zIndex={1}>
                  <Sonrisa size={{ base: "40px", md: "48px" }} />
                </Box>
                <Text position="relative" zIndex={1} color={fisiologiaTxt} fontWeight={700}
                      fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.3"
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>
                  Todo tu cuerpo ha recibido tu sonrisa
                </Text>
                <Text position="relative" zIndex={1} color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }}
                      fontStyle="italic" lineHeight="1.8"
                      style={{ textShadow: "0 1px 5px rgba(0,0,0,0.85)" }}>
                  Nada de lo que has leído en este recorrido era teoría: todo estaba pasando dentro de ti mientras lo
                  leías, y sigue pasando ahora. Vuelve a esta página cuando quieras acordarte.
                </Text>
              </Flex>
            </Reveal>
          )}

        </Flex>
      </Flex>

      {/* Ficha del órgano: la misma caja de lectura de toda Fisiología, con el
          botón «Gracias» al final del texto. */}
      {abierto && (
        <FichaFisioModal
          foto={abierto.foto}
          alt={abierto.nombre}
          titulo={abierto.titulo}
          claves={abierto.claves}
          parrafos={[
            abierto.texto,
            <Text as="span" fontStyle="italic" color={fisiologiaTxt}>{abierto.gracias}</Text>,
          ]}
          contador={`${ORGANOS_SONRISA.findIndex((o) => o.key === abierto.key) + 1} / ${ORGANOS_SONRISA.length}`}
          leida={yaAgradecido}
          onClose={() => setAbierto(null)}
          onPrev={() => salta(-1)}
          onNext={() => salta(1)}
          acciones={
            leido(SONRISA_CAMPO, abierto.key) ? (
              <Flex align="center" gap={2.5} color={fisiologiaTxt}>
                <MarcaLeido inline tinta={fisiologiaTxt} bg={fisiologiaBg} size="26px" iconSize="15px"
                            title="Gracias dadas" />
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight={700} letterSpacing="0.04em"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
                  Ya le has sonreído
                </Text>
              </Flex>
            ) : (
              <Flex as="button" onClick={() => darGracias(abierto)} align="center" justify="center" gap={2.5}
                    position="relative" overflow="hidden" borderRadius="full" cursor="pointer"
                    px={{ base: 6, md: 7 }} py={{ base: 3, md: 3.5 }}
                    border={`1px solid ${fisiologiaTxt}aa`}
                    boxShadow={`0 0 18px ${fisiologiaTxt}33, 0 2px 12px rgba(0,0,0,0.45)`}
                    transition="transform 0.2s ease, box-shadow 0.2s ease"
                    _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 26px ${fisiologiaTxt}66, 0 2px 14px rgba(0,0,0,0.5)` }}
                    _active={{ transform: "translateY(0)" }}>
                <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="full" overlay={`${fisiologiaBg}cc`} />
                <Box position="relative" zIndex={1}>
                  <Sonrisa size={{ base: "22px", md: "25px" }} />
                </Box>
                <Text position="relative" zIndex={1} color={fisiologiaTxt} fontWeight={700}
                      fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.04em"
                      style={{ textShadow: "0 1px 5px rgba(0,0,0,0.8)" }}>
                  Gracias
                </Text>
              </Flex>
            )
          }
          fotoFallback={
            <Text color={fisiologiaTxt} fontWeight="800" fontSize={{ base: "4xl", md: "5xl" }}
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              {abierto.nombre.charAt(0)}
            </Text>
          }
        />
      )}

      {celulasModal}
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
