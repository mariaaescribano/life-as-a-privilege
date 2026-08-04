// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · GENOGRAMA  ·  7/22   (ruta interna /genograma)
//
// El mapa de la familia YA COMPUESTO en la página anterior («Tu familia», paso
// 6), ahora para escribir sobre cada persona. Al tocar una tarjeta se abre su
// FICHA (popup): foto, nombre, parentesco y las preguntas de
// GENOGRAMA_PREGUNTAS. También se puede seguir colocando a quien falte con los
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
import { Box, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { GenogramaMapa } from "../../components/metodo/GenogramaMapa";
import { FotoPersonaBoton } from "../../components/metodo/FotoPersonaBoton";
import { useMapaFamilia } from "../../hooks/useMapaFamilia";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import {
  experienciaById,
  GENOGRAMA,
  GENOGRAMA_PREGUNTAS,
  personaLabel,
  type PersonaGenograma,
} from "../../components/metodo/psicologiaRecorrido";
import { glowHeader } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // #5e2d10 — marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaGenograma() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const { loading, personas, miFoto, añadir, actualizar, actualizarNota, eliminar, flushGuardado } =
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
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title={GENOGRAMA.titulo}
                pageLabel="7/22"
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: "← Tu familia", onClick: () => ir(`/metodo/psicologia/${exp.id}/familia`) }}
                next={{
                  label: "Huellas →",
                  onClick: () => ir(`/metodo/psicologia/${exp.id}/huellas`),
                  disabled: personas.length === 0,
                  disabledTooltip: "Añade al menos a una persona de tu familia para continuar.",
                }}
              />
            </Reveal>

            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>{GENOGRAMA.intro}</IntroRecorrido>
            </Reveal>

            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%">
              <GenogramaMapa
                personas={personas}
                miFoto={miFoto}
                mostrarProgreso
                onAbrir={(p) => setAbiertoId(p.id)}
                onAñadir={(fila, col, dir) => setAbiertoId(añadir(fila, col, dir))}
              />
            </Reveal>

            {personas.length === 0 && (
              <Reveal direction="up" distance={26} scaleFrom={0.97} delay={0.34} duration={0.7} w="100%">
                <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
                  Toca un «+» junto a tu foto para colocar a alguien: arriba tus padres y abuelos, a los lados tus hermanos o tu pareja.
                </Text>
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
  useLockBodyScroll(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  return (
    <Box position="fixed" inset={0} zIndex={2000} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 3, md: 10 }} py={{ base: 4, md: 10 }} bg="rgba(0,0,0,0.82)"
         sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
         onClick={onClose} fontFamily="'EB Garamond', serif">
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}
           position="relative" w="100%" maxW={{ base: "440px", md: "520px" }}
           maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 120px)" }}
           borderRadius="2xl" overflow="hidden" display="flex" flexDirection="column"
           boxShadow={`0 0 40px ${TINTA}66, 0 24px 70px rgba(0,0,0,0.5)`}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

        {/* Cerrar */}
        <Box as="button" onClick={onClose} position="absolute" top={3} right={3} zIndex={3}
             w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
             color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
             _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>
          ✕
        </Box>

        {/* Cabecera: foto + nombre + parentesco */}
        <Box position="relative" zIndex={1} flexShrink={0} borderBottom={`1px solid ${TINTA}55`}
             px={{ base: 5, md: 8 }} pt={{ base: 6, md: 7 }} pb={{ base: 4, md: 5 }}>
          <Flex align="center" gap={{ base: 4, md: 5 }}>
            {/* Foto (se toca para subirla / cambiarla) */}
            <FotoPersonaBoton
              foto={p.foto}
              alt={personaLabel(p)}
              onSubida={(url) => onCampo({ foto: url })}
              onError={setError}
            />

            {/* Nombre + parentesco */}
            <Flex direction="column" gap={2} flex="1" minW={0} pr={9}>
              <Input
                value={p.nombre}
                onChange={(e) => onCampo({ nombre: e.target.value })}
                placeholder="Su nombre…"
                bg="rgba(255,251,243,0.78)" border={`1px solid ${TINTA}3a`} color={TINTA}
                borderRadius="lg" fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                sx={{ caretColor: TINTA }}
                _placeholder={{ color: `${TINTA}66`, fontStyle: "italic", fontWeight: 400 }}
                _hover={{ borderColor: `${TINTA}55` }}
                _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.92)" }}
              />
              <Input
                value={p.parentesco || ""}
                onChange={(e) => onCampo({ parentesco: e.target.value })}
                placeholder="Parentesco (madre, abuelo…)"
                size="sm"
                bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}3a`} color={TINTA}
                borderRadius="lg" fontFamily="'EB Garamond', serif" fontSize={{ base: "sm", md: "md" }}
                sx={{ caretColor: TINTA }}
                _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                _hover={{ borderColor: `${TINTA}55` }}
                _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.9)" }}
              />
            </Flex>
          </Flex>

          {error && (
            <Text color="#8c2f13" fontSize="sm" fontStyle="italic" mt={2.5} style={{ textShadow: INK_SHADOW }}>
              {error}
            </Text>
          )}

          {/* Parentescos sugeridos */}
          <Flex wrap="wrap" gap={1.5} mt={3}>
            {GENOGRAMA.parentescos.map((par) => (
              <Box as="button" key={par} onClick={() => onCampo({ parentesco: par })}
                   px={2.5} py={1} borderRadius="full"
                   bg={p.parentesco === par ? TINTA : "rgba(255,251,243,0.72)"}
                   border={`1px solid ${p.parentesco === par ? TINTA : `${TINTA}33`}`}
                   cursor="pointer" transition="all 0.15s"
                   _hover={{ borderColor: TINTA, transform: "translateY(-1px)" }}>
                <Text color={p.parentesco === par ? PAPEL : TINTA} fontSize="xs" fontWeight="600" lineHeight="1.2" whiteSpace="nowrap">
                  {par}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Cuerpo scrollable: lo que quiera escribir de esta persona */}
        <Box position="relative" zIndex={1} flex="1" overflowY="auto" overscrollBehavior="contain"
             px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}
             sx={{ scrollbarWidth: "thin", "&::-webkit-scrollbar": { width: "8px" },
                   "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "8px" } }}>
          <Flex direction="column" gap={{ base: 5, md: 6 }}>
            {GENOGRAMA_PREGUNTAS.map((q) => (
              <Box key={q.key}>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.35"
                      style={{ textShadow: INK_SHADOW }}>
                  {q.pregunta}
                </Text>
                {q.apoyo && (
                  <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} opacity={0.82} mt={1} lineHeight="1.55"
                        style={{ textShadow: INK_SHADOW }}>
                    {q.apoyo}
                  </Text>
                )}
                <Textarea
                  value={p.notas?.[q.key] || ""}
                  onChange={(e) => onNota(q.key, e.target.value)}
                  placeholder={q.placeholder || "Escribe lo que quieras…"}
                  mt={2}
                  minH={{ base: "90px", md: "104px" }}
                  bg="rgba(255,251,243,0.78)" border={`1px solid ${TINTA}3a`} color={TINTA}
                  borderRadius="lg" px={4} py={3} fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
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

        {/* Footer: quitar del mapa · hecho */}
        <Box position="relative" zIndex={1} flexShrink={0} borderTop={`1px solid ${TINTA}44`}
             px={{ base: 5, md: 8 }} py={{ base: 3.5, md: 4 }}>
          <Flex justify="space-between" align="center" gap={3}>
            {confirmarBorrado ? (
              <Flex align="center" gap={2}>
                <Text color={TINTA} fontSize="sm" fontWeight="600" style={{ textShadow: INK_SHADOW }}>
                  ¿Quitarla del mapa?
                </Text>
                <Box as="button" onClick={onEliminar} px={3} py={1.5} borderRadius="full"
                     bg="#8c2f13" color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="sm"
                     cursor="pointer" _hover={{ filter: "brightness(1.1)" }}>
                  Sí, quitar
                </Box>
                <Box as="button" onClick={() => setConfirmarBorrado(false)} px={3} py={1.5} borderRadius="full"
                     bg="transparent" border={`1.5px solid ${TINTA}88`} color={TINTA}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="sm" cursor="pointer"
                     _hover={{ bg: `${TINTA}14` }}>
                  No
                </Box>
              </Flex>
            ) : (
              <Box as="button" onClick={() => setConfirmarBorrado(true)}
                   px={{ base: 4, md: 5 }} py={2} borderRadius="full" bg="transparent"
                   border={`1.5px solid ${TINTA}66`} color={TINTA}
                   fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                   cursor="pointer" transition="all 0.18s" _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}>
                Quitar
              </Box>
            )}

            <Box as="button" onClick={onClose}
                 px={{ base: 5, md: 6 }} py={2} borderRadius="full" bg={TINTA} color={PAPEL}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                 letterSpacing="0.04em" cursor="pointer"
                 boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                 _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
              Hecho ✓
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
