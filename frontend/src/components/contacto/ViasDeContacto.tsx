import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import { AgendarLlamada } from "../global/AgendarLlamada";
import { BookCallModal } from "../global/BookCallModal";
import { IconoWhatsapp } from "../metodo/LlamadaCta";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { INSTAGRAM_URL, whatsappUrl } from "../../GlobalVariables";
import { useT } from "../../i18n";

/* ──────────────────────────────────────────────────────────────────────────
 * Las vías de contacto, ordenadas por lo que la persona QUIERE hacer y no por
 * el canal: primero hablar conmigo (la llamada, los 20 minutos de conocernos y
 * el correo), después estar cerca sin hablar (WhatsApp, Instagram y la
 * comunidad).
 *
 * Ninguna de las dos llamadas monta nada nuevo: la de una hora abre el mismo
 * calendario que el botón flotante del recorrido (AgendarLlamada, con su precio
 * puesto por el backend) y la de conocernos abre la que ya existía sin coste
 * (BookCallModal, la de /elMetodo). Así la agenda es una sola.
 * ────────────────────────────────────────────────────────────────────────── */

const Icono = ({ children }: { children: React.ReactNode }) => (
  <Box
    as="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    width="30px"
    height="30px"
    fill="currentColor"
    flexShrink={0}
  >
    {children}
  </Box>
);

const IconoLlamada = (
  <Icono>
    <path d="M640-520v-120H520v-80h120v-120h80v120h120v80H720v120h-80Zm158 400q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z" />
  </Icono>
);

const IconoEmail = (
  <Icono>
    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
  </Icono>
);

const IconoInstagram = (
  <Icono>
    <path d="M480-320q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm200-248q17 0 28.5-11.5T720-688q0-17-11.5-28.5T680-728q-17 0-28.5 11.5T640-688q0 17 11.5 28.5T680-648ZM280-120q-66 0-113-47t-47-113v-400q0-66 47-113t113-47h400q66 0 113 47t47 113v400q0 66-47 113t-113 47H280Zm0-80h400q33 0 56.5-23.5T760-280v-400q0-33-23.5-56.5T680-760H280q-33 0-56.5 23.5T200-680v400q0 33 23.5 56.5T280-200Z" />
  </Icono>
);

const TINTA = "#004f4f";
const ORO = "#b08d3f";

/** Una tarjeta: icono, título y una línea de para qué sirve. Va sobre el mármol:
 *  transparente, con filo y letra turquesa oscuro y un halo dorado muy suave. */
function Via({
  icono, titulo, texto, href, onClick, apagada, nota, i = 0, activo,
}: {
  /** Con valor, la entrada la manda la banda de mármol; sin él, al asomar. */
  activo?: boolean;
  /** Posición en la rejilla: marca el retraso de entrada de la tarjeta. */
  i?: number;
  icono: React.ReactNode;
  titulo: string;
  texto: string;
  href?: string;
  onClick?: () => void;
  /** Sin destino todavía (la comunidad, mientras no exista el enlace). */
  apagada?: boolean;
  nota?: string;
}) {
  const comun = {
    align: "flex-start" as const,
    gap: 4,
    px: { base: 5, md: 6 },
    py: { base: 5, md: 6 },
    w: "100%",
    textAlign: "left" as const,
    borderRadius: "2xl",
    border: `1.5px solid ${TINTA}55`,
    bg: "transparent",
    color: TINTA,
    textDecoration: "none",
    boxShadow: `0 0 16px ${ORO}22, 0 0 36px ${ORO}12`,
    opacity: apagada ? 0.45 : 1,
    cursor: apagada ? "not-allowed" : "pointer",
    role: "group",
    transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
    _active: apagada ? {} : { transform: "translateY(0) scale(0.985)" },
    _hover: apagada ? {} : {
      transform: "translateY(-4px)",
      bg: `${TINTA}12`,
      borderColor: `${TINTA}aa`,
    },
  };

  const dentro = (
    <>
      <Box mt="2px" flexShrink={0}
           transition="transform 0.4s cubic-bezier(0.22,1,0.36,1)"
           _groupHover={apagada ? undefined : { transform: "scale(1.14)" }}>
        {icono}
      </Box>
      <Box>
        <Text
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "md", md: "lg" }}
          letterSpacing="0.12em"
          textTransform="uppercase"
        >
          {titulo}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.5" mt={1} color={TINTA}>
          {apagada && nota ? nota : texto}
        </Text>
      </Box>
    </>
  );

  // Cada tarjeta entra sola al asomar (sube + enfoca); la segunda columna
  // llega un pelín después. La entrada va en el envoltorio para no pisar el
  // transform del hover de la tarjeta.
  const entra = (nodo: React.ReactNode) => (
    <Reveal {...(activo === undefined ? { inView: true, amount: 0.1 } : { activo })} direction="up" distance={26} scaleFrom={0.97} duration={0.75}
            delay={activo === undefined ? i * 0.1 : 0.1 + i * 0.15} h="100%">
      {nodo}
    </Reveal>
  );
  if (apagada) return entra(<Flex {...comun} h="100%">{dentro}</Flex>);
  if (href) {
    return entra(
      <Flex as="a" href={href} target="_blank" rel="noopener noreferrer" {...comun} h="100%">
        {dentro}
      </Flex>
    );
  }
  return entra(
    <Flex as="button" onClick={onClick} {...comun} h="100%">
      {dentro}
    </Flex>
  );
}

export function ViasDeContacto({ onEscribir, activo }: { onEscribir: () => void; activo?: boolean }) {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const [llamadaAbierta, setLlamadaAbierta] = useState(false);
  // La de CONOCERNOS es otra cosa: 20 minutos sin coste. Ya existía montada
  // (BookCallModal, la misma de /elMetodo), así que se abre esa y no se
  // duplica ni el calendario ni la reserva.
  //
  // `/contacto?conocernos=1` la abre sola: es el destino del botón del correo
  // de bienvenida, que invita a la llamada sin coste. Sin el parámetro habría
  // que aterrizar en la página y encontrar la tarjeta, y ahí se pierde media
  // gente.
  const [conocernosAbierta, setConocernosAbierta] = useState(
    () => params.get("conocernos") === "1",
  );
  useLockBodyScroll(llamadaAbierta);

  // Al cerrarla se quita el parámetro: si no, recargar o volver atrás la
  // vuelve a abrir.
  const cerrarConocernos = () => {
    setConocernosAbierta(false);
    if (params.has("conocernos")) {
      const limpio = new URLSearchParams(params);
      limpio.delete("conocernos");
      setParams(limpio, { replace: true });
    }
  };

  return (
    <>
      <Box>
        <Grid templateColumns="1fr" gap={{ base: 4, md: 5 }}>
          <Via
            i={0}
            activo={activo}
            icono={IconoLlamada}
            titulo={t("contacto.via.llamada")}
            texto={t("contacto.via.llamadaTexto")}
            onClick={() => setLlamadaAbierta(true)}
          />
          <Via
            i={1}
            activo={activo}
            icono={IconoEmail}
            titulo={t("contacto.via.email")}
            texto={t("contacto.via.emailTexto")}
            onClick={onEscribir}
          />
          <Via
            i={2}
            activo={activo}
            icono={<IconoWhatsapp size="30px" />}
            titulo={t("contacto.via.whatsapp")}
            texto={t("contacto.via.whatsappTexto")}
            href={whatsappUrl()}
          />
          <Via
            i={3}
            activo={activo}
            icono={IconoInstagram}
            titulo={t("contacto.via.instagram")}
            texto={t("contacto.via.instagramTexto")}
            href={INSTAGRAM_URL}
          />
        </Grid>
      </Box>

      {/* ── LOS 20 MINUTOS DE CONOCERNOS ── */}
      <BookCallModal isOpen={conocernosAbierta} onClose={cerrarConocernos} />

      {/* ── POPUP DE LA LLAMADA ──
          El mismo calendario del recorrido, sin disciplina: aquí no estamos
          dentro de ninguna, así que va en blanco sobre el turquesa. */}
      {llamadaAbierta && (
        <Flex
          position="fixed"
          inset="0"
          zIndex={500}
          align="center"
          justify="center"
          px={{ base: 3, md: 6 }}
          py={{ base: 6, md: 10 }}
          bg="rgba(0,0,0,0.55)"
          onClick={() => setLlamadaAbierta(false)}
        >
          <Box
            position="relative"
            w="100%"
            maxW="620px"
            maxH="90vh"
            overflowY="auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Flex
              as="button"
              onClick={() => setLlamadaAbierta(false)}
              aria-label={t("comun.cerrar")}
              position="absolute"
              top="10px"
              right="10px"
              zIndex={2}
              w="34px"
              h="34px"
              align="center"
              justify="center"
              borderRadius="full"
              border="1px solid rgba(255,255,255,0.5)"
              bg="rgba(0,0,0,0.35)"
              color="white"
              fontSize="lg"
              lineHeight="1"
            >
              ✕
            </Flex>
            <AgendarLlamada
              color="#ffffff"
              bgColor="#008080"
              disciplinaNom=""
              titulo={t("contacto.via.llamada")}
              subtitulo={t("contacto.via.llamadaTexto")}
            />
          </Box>
        </Flex>
      )}
    </>
  );
}

export default ViasDeContacto;
