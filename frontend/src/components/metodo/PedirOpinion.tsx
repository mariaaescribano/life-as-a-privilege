// ─────────────────────────────────────────────────────────────────────────────
// PedirOpinion · la invitación a dejar una reseña, al FINAL de cada recorrido.
//
// Se pide aquí y no antes porque aquí es donde alguien puede contar algo: ha
// terminado. Es una invitación, no un peaje — se puede decir «ahora no» y la
// caja se va.
//
// LA IDA Y LA VUELTA — al aceptar se va a /opiniones llevando en la URL la
// página exacta desde la que salió (`?volver=…`). La página de opiniones pinta
// con eso un botón de vuelta y, al enviar, otro: así se vuelve justo a donde
// estaba, que si no es pedirle a alguien que abandone su recorrido.
//
// Se guarda EN EL NAVEGADOR (no en la BD) si ya dejó una o si dijo «ahora no»:
// es una cortesía para no repetir la petición, no un dato de la cuenta. Si
// cambia de navegador volverá a verla, y tampoco pasa nada.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Reveal } from "../global/Reveal";
import { useT } from "../../i18n";

/** Ya dejó una reseña desde este navegador (lo marca la página de opiniones). */
const CLAVE_ENVIADA = "opinionEnviada";
/** Dijo «ahora no»: no se le vuelve a pedir en este navegador. */
const CLAVE_AHORA_NO = "opinionAhoraNo";

/**
 * Marca que viaja en la ruta de vuelta (`…/cursos#volver-opinion`).
 *
 * Sin ella, volver dejaría a la persona ARRIBA del todo de la página —todas las
 * páginas del recorrido se colocan al principio al abrirse—, y esta caja está al
 * final: tendría que bajar otra vez hasta donde lo dejó. Con ella, la caja se
 * busca a sí misma al volver.
 */
const ANCLA = "volver-opinion";

const leer = (clave: string): boolean => {
  try { return localStorage.getItem(clave) === "1"; } catch { return false; }
};

/** Lo marca Opiniones al enviar, para que la caja deje de pedirlo. */
export function marcarOpinionEnviada() {
  try { localStorage.setItem(CLAVE_ENVIADA, "1"); } catch { /* modo privado */ }
}

export interface PedirOpinionProps {
  /** Color de fondo de la disciplina (disciplinaBg). */
  bg: string;
  /** Color de texto/acento de la disciplina (disciplinaTxt). */
  txt: string;
  /** Nombre de la disciplina, para su imagen de fondo. */
  nom: string;
}

export function PedirOpinion({ bg, txt, nom }: PedirOpinionProps) {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const [oculta, setOculta] = useState(() => leer(CLAVE_ENVIADA) || leer(CLAVE_AHORA_NO));
  const caja = useRef<HTMLDivElement>(null);

  // Vuelve de /opiniones: la página ya se ha colocado arriba del todo, así que
  // la caja se trae de nuevo a la vista. El respiro es para que la página
  // termine de montarse (y de hacer su propio scroll) antes de moverla.
  useEffect(() => {
    if (oculta || location.hash !== `#${ANCLA}`) return;
    const id = setTimeout(() => {
      caja.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 450);
    return () => clearTimeout(id);
  }, [oculta, location.hash]);

  if (oculta) return null;

  const irAOpiniones = () => {
    // La página exacta desde la que sale, con su querystring: hay recorridos
    // cuya ruta lleva el id del recorrido o el doṣha, y volver «al principio de
    // la disciplina» no sería volver a donde estaba. La marca del final es para
    // volver a ESTA altura de la página, no a su principio.
    const desde = `${location.pathname}${location.search}#${ANCLA}`;
    navigate(`/opiniones?volver=${encodeURIComponent(desde)}`);
  };

  const ahoraNo = () => {
    try { localStorage.setItem(CLAVE_AHORA_NO, "1"); } catch { /* modo privado */ }
    setOculta(true);
  };

  return (
    <Reveal inView direction="up" distance={20} duration={0.6} amount={0.2} w="100%" display="flex" justifyContent="center">
      <Flex
        ref={caja}
        direction="column"
        align="center"
        textAlign="center"
        gap={3}
        w="100%"
        maxW="620px"
        position="relative"
        overflow="hidden"
        borderRadius="2xl"
        border={`1px solid ${txt}55`}
        px={{ base: 6, md: 10 }}
        py={{ base: 8, md: 10 }}
      >
        {/* la foto de la disciplina de fondo, con su velo para poder leer */}
        <DisciplinaBgLayer nom={nom} borderRadius="2xl" overlay={`${bg}d9`} />

        <Text
          position="relative"
          zIndex={1}
          color={txt}
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="700"
          letterSpacing="0.04em"
          style={{ textShadow: `0 1px 6px ${bg}, 0 2px 14px ${bg}` }}
        >
          {t("opinion.pedir.titulo")}
        </Text>

        <Text
          position="relative"
          zIndex={1}
          color={`${txt}e0`}
          fontSize={{ base: "sm", md: "md" }}
          fontStyle="italic"
          lineHeight="1.8"
          maxW="480px"
          style={{ textShadow: `0 1px 6px ${bg}` }}
        >
          {t("opinion.pedir.texto")}
        </Text>

        <Flex position="relative" zIndex={1} gap={3} mt={2} wrap="wrap" justify="center">
          <Box
            as="button"
            onClick={irAOpiniones}
            px={{ base: 6, md: 8 }}
            py={{ base: "9px", md: "11px" }}
            borderRadius="full"
            bg={txt}
            color={bg}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.06em"
            cursor="pointer"
            whiteSpace="nowrap"
            transition="all 0.22s"
            style={{ boxShadow: `0 4px 20px ${txt}47` }}
            _hover={{ transform: "translateY(-2px)" }}
          >
            {t("opinion.pedir.boton")}
          </Box>

          <Box
            as="button"
            onClick={ahoraNo}
            px={{ base: 5, md: 6 }}
            py={{ base: "9px", md: "11px" }}
            borderRadius="full"
            bg="transparent"
            color={`${txt}cc`}
            border={`1px solid ${txt}66`}
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.04em"
            cursor="pointer"
            whiteSpace="nowrap"
            transition="all 0.22s"
            _hover={{ borderColor: txt, color: txt }}
          >
            {t("opinion.pedir.ahoraNo")}
          </Box>
        </Flex>
      </Flex>
    </Reveal>
  );
}

export default PedirOpinion;
