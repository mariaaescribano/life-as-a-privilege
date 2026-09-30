// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · GENOGRAMA  ·  10/27   (ruta interna /genograma)
//
// El mapa de la familia YA COMPUESTO en la página anterior («Tu familia», paso
// 6), ahora para escribir sobre cada persona. Al tocar una tarjeta se abre su
// FICHA (popup): foto, nombre, parentesco y las preguntas de
// genogramaPreguntas. También se puede seguir colocando a quien falte con los
// «+» que rodean cada foto.
//
// El dibujo del mapa vive en GenogramaMapa (común con «Tu familia») y la carga /
// guardado en el hook useMapaFamilia. Datos: data.genograma (compartido con la
// página anterior). Las fotos se suben al bucket
// (POST /upload/genograma/:userId) y aquí solo se guarda su URL: en el blob no
// caben fotos.
// ─────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Image, Input, SimpleGrid, Text, Textarea } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { FotoPersonaBoton } from "../../components/metodo/FotoPersonaBoton";
import { simboloSrc, useSimbolosFamilia } from "../../components/metodo/familiaSimbolos";
import { useMapaFamilia } from "../../hooks/useMapaFamilia";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import {
  experienciaById,
  personaLabel,
  personaSimbolos,
  type PersonaGenograma,
} from "../../components/metodo/psicologiaRecorrido";
import { useGenograma, useGenogramaPreguntas } from "../../components/metodo/psicologiaRecorrido.en";
import { glowHeader, scrollAcuarela } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";
import { useT } from "../../i18n";

const TINTA = neuropsicologiaTxt; // #5e2d10 — marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaGenograma() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");
  const genograma = useGenograma();

  const { loading, personas, actualizar, actualizarNota, eliminar, flushGuardado } =
    useMapaFamilia(experienciaId);
  const [abiertoId, setAbiertoId] = useState<string | null>(null);

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  // Antes de navegar: se fuerza el guardado pendiente y se espera al flush, para
  // que la página destino no lea datos viejos.
  const ir = async (ruta: string) => {
    flushGuardado();
    await flushSaves();
    navigate(ruta);
  };

  const abierta = personas.find((p) => p.id === abiertoId) || null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
          <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title={genograma.titulo}
                step={{ current: 10, total: 29 }}
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: `← ${t("metodo.psico.paso.familia")}`, onClick: () => ir(`/metodo/psicologia/${exp.id}/familia`) }}
                next={{
                  label: `${t("metodo.psico.paso.huellas")} →`,
                  onClick: () => ir(`/metodo/psicologia/${exp.id}/huellas`),
                  disabled: personas.length === 0,
                  disabledTooltip: t("metodo.psico.faltaPersona"),
                }}
              />
            </Reveal>

            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>{genograma.intro}</IntroRecorrido>
            </Reveal>

            {/* Las tarjetas de la familia: una por persona, 3-4 por fila en
                ordenador y de dos en dos en pantallas medianas. Cada una: foto
                y rol arriba, sus personajes/animales bajo la rayita, y el botón
                de Rellenar que abre su ficha. (El mapa para COLOCAR a la
                familia sigue en la página anterior, «Tu familia».) */}
            {/* Un <Reveal inView> POR tarjeta (la rejilla crece con la familia:
                envolverla entera caería en la trampa del `amount`). */}
            {/* TRES por fila (no cuatro) y la rejilla capada al mismo ancho que
                el header (MetodoStepHeader capa en 850px; la columna mide 900):
                así las filas cierran a plomo con el box de arriba. */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 3, md: 4 }} w="100%" maxW="850px">
              {personas.map((p, i) => (
                <Reveal key={p.id} inView once amount={0.2} direction="up" distance={30} scaleFrom={0.97} duration={0.7}
                        delay={(i % 3) * 0.07} display="flex" flexDirection="column">
                  <TarjetaPersona p={p} onRellenar={() => setAbiertoId(p.id)} />
                </Reveal>
              ))}
            </SimpleGrid>

            {personas.length === 0 && (
              <Reveal direction="up" distance={26} scaleFrom={0.97} delay={0.34} duration={0.7} w="100%">
                <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">{t("metodo.psico.genogramaIntro")}</Text>
              </Reveal>
            )}

          </Flex>
        </Flex>
      </Box>

      {/* ── FICHA DE LA PERSONA (popup) ── */}
      {abierta && (
        <FichaPersona
          key={abierta.id}
          p={abierta}
          onCampo={(campos) => actualizar(abierta.id, campos)}
          onNota={(key, valor) => actualizarNota(abierta.id, key, valor)}
          onEliminar={() => { eliminar(abierta.id); setAbiertoId(null); }}
          onClose={() => { flushGuardado(); setAbiertoId(null); }}
        />
      )}

      <AyudaRecorrido pagina="genograma" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TARJETA de una persona: foto a la izquierda con su rol al lado, la rayita,
// sus personajes/animales y el botón de Rellenar (abre la ficha).
// ─────────────────────────────────────────────────────────────────────────
function TarjetaPersona({ p, onRellenar }: { p: PersonaGenograma; onRellenar: () => void }) {
  const t = useT();
  const { nombre: nombreSimbolo } = useSimbolosFamilia();
  const simbolos = personaSimbolos(p);
  const rol = (p.parentesco || "").trim();
  const nombre = (p.nombre || "").trim();

  return (
    <Flex
      direction="column"
      flex="1" // llena el alto del <Reveal> que la envuelve (columna de la rejilla)
      position="relative"
      overflow="hidden"
      borderRadius="xl"
      border={`1.5px solid ${TINTA}66`}
      boxShadow={`0 0 14px ${TINTA}00`}
      transition="box-shadow 0.2s ease, transform 0.2s ease"
      _hover={{ boxShadow: `0 0 14px ${TINTA}59`, transform: "translateY(-2px)" }}
    >
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="xl" />
      <Flex position="relative" zIndex={1} direction="column" flex="1" p={{ base: 4, md: 4 }} gap={3}>
        {/* Foto a la izquierda, rol (y nombre) al lado */}
        <Flex align="center" gap={3}>
          <Box
            w="52px"
            h="52px"
            flexShrink={0}
            borderRadius="full"
            overflow="hidden"
            border={`1.5px solid ${TINTA}66`}
            bg="rgba(255,251,243,0.6)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {p.foto ? (
              <Image src={p.foto} alt={personaLabel(p)} w="100%" h="100%" objectFit="cover" />
            ) : (
              <Text color={TINTA} fontSize="xl" fontWeight="700" lineHeight="1">
                {personaLabel(p).charAt(0).toUpperCase()}
              </Text>
            )}
          </Box>
          <Box minW={0}>
            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.25"
                  noOfLines={1} style={{ textShadow: INK_SHADOW }}>
              {rol || personaLabel(p)}
            </Text>
            {rol && nombre && (
              <Text color={TINTA} fontSize="sm" opacity={0.75} noOfLines={1} style={{ textShadow: INK_SHADOW }}>
                {nombre}
              </Text>
            )}
          </Box>
        </Flex>

        {/* La rayita de la casa */}
        <Box h="1px" w="100%" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

        {/* Sus personajes/animales (los eligió en «Tu familia») */}
        {simbolos.length > 0 && (
          <Flex justify="center" gap={3}>
            {simbolos.map((k) => (
              <Image
                key={k}
                src={simboloSrc(k)}
                alt={nombreSimbolo(k)}
                title={nombreSimbolo(k)}
                w="46px"
                h="46px"
                borderRadius="lg"
                objectFit="cover"
                border={`1px solid ${TINTA}40`}
              />
            ))}
          </Flex>
        )}

        {/* Rellenar — abre la ficha para escribir sobre su influencia */}
        <Box
          as="button"
          onClick={onRellenar}
          mt="auto"
          w="100%"
          py={2}
          borderRadius="full"
          bg={TINTA}
          color={PAPEL}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "sm", md: "md" }}
          letterSpacing="0.04em"
          cursor="pointer"
          boxShadow={`0 2px 12px rgba(0,0,0,0.2), 0 0 14px ${TINTA}33`}
          transition="transform 0.18s, box-shadow 0.18s"
          _hover={{ transform: "translateY(-1px)", boxShadow: `0 4px 16px rgba(0,0,0,0.26), 0 0 20px ${TINTA}55` }}
        >
          {t("metodo.psico.rellenar")}
        </Box>
      </Flex>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FICHA de una persona: foto, nombre, parentesco y las preguntas para escribir
// sobre ella. Todo se autoguarda; «Hecho ✓» solo cierra (y fuerza el guardado).
// ─────────────────────────────────────────────────────────────────────────
function FichaPersona({ p, onCampo, onNota, onEliminar, onClose }: {
  p: PersonaGenograma;
  onCampo: (campos: Partial<PersonaGenograma>) => void;
  onNota: (key: string, valor: string) => void;
  onEliminar: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const genograma = useGenograma();
  const genogramaPreguntas = useGenogramaPreguntas();
  useLockBodyScroll(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  // A esta ficha se llega con la persona YA definida en «Tu familia», así que
  // la identidad (foto, nombre, parentesco) sale PLEGADA en una línea: volver
  // a enseñar las cuatro filas de chapas de parentesco mareaba y no aportaba.
  // «Editar» la despliega; sin parentesco todavía, sale desplegada.
  const [identidadAbierta, setIdentidadAbierta] = useState(!(p.parentesco || "").trim());

  return (
    <Box position="fixed" inset={0} zIndex={2000} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 3, md: 10 }} py={{ base: 4, md: 10 }} bg="rgba(0,0,0,0.82)"
         sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
         onClick={onClose} fontFamily="'EB Garamond', serif">
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}
           position="relative" w="100%" maxW={{ base: "440px", md: "520px" }}
           // `dvh` en móvil: `vh` no descuenta la barra del navegador y el
           // popup se comía el margen de abajo.
           maxH={{ base: "calc(100dvh - 48px)", md: "calc(100vh - 120px)" }}
           borderRadius="2xl" overflow="hidden" display="flex" flexDirection="column"
           boxShadow={`0 0 40px ${TINTA}66, 0 24px 70px rgba(0,0,0,0.5)`}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

        {/* Cerrar */}
        <Box as="button" onClick={onClose} position="absolute" top={3} right={3} zIndex={3}
             w="38px" h="38px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
             color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="lg" cursor="pointer"
             _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>
          ✕
        </Box>

        {/* ── UN SOLO scroll vertical para todo el popup (como en «Tu
            familia»): identidad plegada arriba y las preguntas debajo, todo
            corriendo junto. ── */}
        <Box position="relative" zIndex={1} flex="1" overflowY="auto" overscrollBehavior="contain"
             sx={scrollAcuarela(TINTA)}>

          {/* Identidad: quién es. Plegada = una línea; desplegada = foto,
              nombre, parentesco y sus chapas (al tocar una se vuelve a plegar). */}
          <Box px={{ base: 5, md: 8 }} pt={{ base: 6, md: 7 }} pb={{ base: 4, md: 5 }}>
            {identidadAbierta ? (
              <>
                <Flex align="center" gap={{ base: 4, md: 5 }} pr={9}>
                  {/* Foto (se toca para subirla / cambiarla) */}
                  <FotoPersonaBoton
                    foto={p.foto}
                    alt={personaLabel(p)}
                    onSubida={(url) => onCampo({ foto: url })}
                    onError={setError}
                  />

                  {/* Nombre + parentesco */}
                  <Flex direction="column" gap={2} flex="1" minW={0}>
                    <Input
                      value={p.nombre}
                      onChange={(e) => onCampo({ nombre: e.target.value })}
                      placeholder={t("metodo.psico.suNombre")}
                      bg="rgba(255,251,243,0.78)" border={`1px solid ${TINTA}3a`} color={TINTA}
                      borderRadius="lg" fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                      sx={{ caretColor: TINTA }}
                      _placeholder={{ color: `${TINTA}66`, fontStyle: "italic", fontWeight: 400 }}
                      _hover={{ borderColor: `${TINTA}55` }}
                      _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.92)" }}
                    />
                    <Input
                      value={p.parentesco || ""}
                      onChange={(e) => onCampo({ parentesco: e.target.value })}
                      placeholder={t("metodo.psico.parentesco")}
                      bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}3a`} color={TINTA}
                      borderRadius="lg" fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }}
                      sx={{ caretColor: TINTA }}
                      _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                      _hover={{ borderColor: `${TINTA}55` }}
                      _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.9)" }}
                    />
                  </Flex>
                </Flex>

                {/* Parentescos sugeridos: al tocar uno ya está dicho quién es
                    y la identidad se pliega sola. */}
                <Flex wrap="wrap" gap={1.5} mt={3}>
                  {genograma.parentescos.map((par) => (
                    <Box as="button" key={par}
                         onClick={() => { onCampo({ parentesco: par }); setIdentidadAbierta(false); }}
                         px={3} py={1.5} borderRadius="full"
                         bg={p.parentesco === par ? TINTA : "rgba(255,251,243,0.72)"}
                         border={`1px solid ${p.parentesco === par ? TINTA : `${TINTA}33`}`}
                         cursor="pointer" transition="all 0.15s"
                         _hover={{ borderColor: TINTA, transform: "translateY(-1px)" }}>
                      <Text color={p.parentesco === par ? PAPEL : TINTA} fontSize="sm" fontWeight="600" lineHeight="1.2" whiteSpace="nowrap">
                        {par}
                      </Text>
                    </Box>
                  ))}
                </Flex>

                {/* Con el parentesco escrito a mano se puede plegar sin tocar
                    ninguna chapa. */}
                {!!(p.parentesco || "").trim() && (
                  <Flex justify="flex-end" mt={3}>
                    <Box as="button" onClick={() => setIdentidadAbierta(false)}
                         px={4} py={1.5} borderRadius="full" bg="transparent"
                         border={`1px solid ${TINTA}55`} color={TINTA}
                         fontFamily="'EB Garamond', serif" fontSize="sm" fontWeight="700"
                         cursor="pointer" transition="all 0.18s" _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}>
                      {t("metodo.psico.familiaListo")}
                    </Box>
                  </Flex>
                )}
              </>
            ) : (
              // ── Plegada: quién es, en una línea, y el lápiz para corregirlo ──
              <Flex align="center" gap={3} pr={10}>
                <FotoPersonaBoton
                  foto={p.foto}
                  alt={personaLabel(p)}
                  onSubida={(url) => onCampo({ foto: url })}
                  onError={setError}
                  size={{ base: "48px", md: "52px" }}
                />
                <Box flex="1" minW={0}>
                  <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" noOfLines={1}
                        style={{ textShadow: INK_SHADOW }}>
                    {personaLabel(p)}
                  </Text>
                  {!!(p.parentesco || "").trim() && !!(p.nombre || "").trim() && (
                    <Text color={TINTA} fontSize="sm" opacity={0.75} noOfLines={1}
                          style={{ textShadow: INK_SHADOW }}>
                      {p.parentesco}
                    </Text>
                  )}
                </Box>
                <Box as="button" onClick={() => setIdentidadAbierta(true)}
                     flexShrink={0} display="inline-flex" alignItems="center" gap={1.5}
                     px={3} py={1.5} borderRadius="full" bg="rgba(255,251,243,0.72)"
                     border={`1px solid ${TINTA}33`} color={TINTA}
                     fontFamily="'EB Garamond', serif" fontSize="sm" fontWeight="700"
                     cursor="pointer" transition="all 0.18s"
                     _hover={{ borderColor: TINTA, transform: "translateY(-1px)" }}>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                       w="13px" h="13px" fill="currentColor" flexShrink={0}>
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T846-647L319-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                  </Box>
                  {t("metodo.psico.familiaEditar")}
                </Box>
              </Flex>
            )}

            {error && (
              <Text color="#8c2f13" fontSize="md" fontStyle="italic" mt={2.5} style={{ textShadow: INK_SHADOW }}>
                {error}
              </Text>
            )}
          </Box>

          <Box h="1px" mx={{ base: 5, md: 8 }} bg={`${TINTA}44`} />

          {/* Lo que quiera escribir de esta persona */}
          <Box px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
          <Flex direction="column" gap={{ base: 5, md: 6 }}>
            {genogramaPreguntas.map((q) => (
              <Box key={q.key}>
                <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.35"
                      style={{ textShadow: INK_SHADOW }}>
                  {q.pregunta}
                </Text>
                {q.apoyo && (
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} opacity={0.82} mt={1} lineHeight="1.55"
                        style={{ textShadow: INK_SHADOW }}>
                    {q.apoyo}
                  </Text>
                )}
                <Textarea
                  value={p.notas?.[q.key] || ""}
                  onChange={(e) => onNota(q.key, e.target.value)}
                  placeholder={q.placeholder || t("metodo.psico.escribeLoQueQuieras")}
                  mt={2}
                  minH={{ base: "90px", md: "104px" }}
                  bg="rgba(255,251,243,0.78)" border={`1px solid ${TINTA}3a`} color={TINTA}
                  borderRadius="lg" px={4} py={3} fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7"
                  sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                        "&::-webkit-scrollbar": { width: "8px" },
                        "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
                  _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                  _hover={{ borderColor: `${TINTA}55` }}
                  _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.92)" }}
                />
              </Box>
            ))}
          </Flex>
          </Box>
        </Box>

        {/* Footer: quitar del mapa · hecho */}
        <Box position="relative" zIndex={1} flexShrink={0} borderTop={`1px solid ${TINTA}44`}
             px={{ base: 5, md: 8 }} py={{ base: 3.5, md: 4 }}>
          <Flex justify="space-between" align="center" gap={3}>
            {confirmarBorrado ? (
              <Flex align="center" gap={2}>
                <Text color={TINTA} fontSize="md" fontWeight="600" style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.quitarDelMapa")}</Text>
                <Box as="button" onClick={onEliminar} px={3.5} py={2} borderRadius="full"
                     bg="#8c2f13" color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="md"
                     cursor="pointer" _hover={{ filter: "brightness(1.1)" }}>{t("metodo.psico.siQuitar")}</Box>
                <Box as="button" onClick={() => setConfirmarBorrado(false)} px={3.5} py={2} borderRadius="full"
                     bg="transparent" border={`1.5px solid ${TINTA}88`} color={TINTA}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="md" cursor="pointer"
                     _hover={{ bg: `${TINTA}14` }}>{t("metodo.psico.no")}</Box>
              </Flex>
            ) : (
              <Box as="button" onClick={() => setConfirmarBorrado(true)}
                   px={{ base: 4, md: 5 }} py={2} borderRadius="full" bg="transparent"
                   border={`1.5px solid ${TINTA}66`} color={TINTA}
                   fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                   cursor="pointer" transition="all 0.18s" _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}>{t("metodo.psico.quitar")}</Box>
            )}

            <Box as="button" onClick={onClose}
                 px={{ base: 5, md: 6 }} py={2} borderRadius="full" bg={TINTA} color={PAPEL}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                 letterSpacing="0.04em" cursor="pointer"
                 boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                 _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>{t("metodo.psico.hecho")}</Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
