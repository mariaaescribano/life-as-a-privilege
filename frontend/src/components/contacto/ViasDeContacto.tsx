import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { AgendarLlamada } from "../global/AgendarLlamada";
import { BookCallModal } from "../global/BookCallModal";
import { IconoWhatsapp } from "../metodo/LlamadaCta";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { INSTAGRAM_URL, WHATSAPP_COMUNIDAD_URL, whatsappUrl } from "../../GlobalVariables";
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

/** Dos personas con un corazón: los veinte minutos de conocernos. */
const IconoConocernos = (
  <Icono>
    <path d="M40-120v-160q0-34 23.5-57t56.5-23h131q20 0 38 10t29 27q29 39 71.5 61t90.5 22q49 0 91.5-22t70.5-61q13-17 30.5-27t36.5-10h131q34 0 57 23t23 57v160H640v-91q-35 25-75.5 38T480-160q-43 0-84-13.5T320-212v92H40Zm120-280q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T280-520q0 50-34.5 85T160-400Zm640 0q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T920-520q0 50-34.5 85T800-400Zm-320-80q-68-62-111-104.5T302-658q-24-31-33-54.5t-9-47.5q0-50 35-85t86-35q28 0 54 12.5t45 33.5q19-21 45-33.5t54-12.5q51 0 86 35t35 85q0 24-9 47.5T658-658q-24 31-67 73.5T480-480Zm0-108q72-66 106-107.5t34-64.5q0-17-12-28.5T579-800q-12 0-23.5 7T532-772l-51 59-51-57q-14-16-25.5-23t-23.5-7q-17 0-29 11.5T340-760q0 23 34 64.5T480-588Zm0 0Z" />
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

const IconoComunidad = (
  <Icono>
    <path d="M40-160v-160q0-34 23.5-57t56.5-23h131q20 0 38 10t29 27q29 39 71.5 61t90.5 22q49 0 91.5-22t70.5-61q13-17 30.5-27t36.5-10h131q34 0 57 23t23 57v160H640v-91q-35 25-75.5 38T480-200q-43 0-84-13.5T320-252v92H40Zm440-160q-38 0-72-17.5T351-386q-17-25-42.5-39.5T253-440q22-37 93-58.5T480-520q63 0 134 21.5t93 58.5q-29 0-55 14.5T609-386q-22 32-56 49t-73 17ZM160-440q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T280-560q0 50-34.5 85T160-440Zm640 0q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T920-560q0 50-34.5 85T800-440ZM480-560q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-680q0 50-34.5 85T480-560Z" />
  </Icono>
);

/** Una tarjeta: icono, título y una línea de para qué sirve. */
function Via({
  icono, titulo, texto, href, onClick, apagada, nota,
}: {
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
    border: "1px solid rgba(255,255,255,0.28)",
    bg: "rgba(255,255,255,0.08)",
    color: "white",
    textDecoration: "none",
    boxShadow: "0 0 16px rgba(255,255,255,0.22), 0 0 40px rgba(180,255,245,0.12), 0 4px 14px rgba(0,0,0,0.16)",
    sx: { backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" },
    opacity: apagada ? 0.45 : 1,
    cursor: apagada ? "not-allowed" : "pointer",
    transition: "all 0.25s ease",
    _hover: apagada ? {} : {
      bg: "rgba(255,255,255,0.16)",
      borderColor: "rgba(255,255,255,0.9)",
      boxShadow: "0 0 24px rgba(255,255,255,0.45), 0 0 52px rgba(180,255,245,0.3), 0 6px 18px rgba(0,0,0,0.2)",
    },
  };

  const dentro = (
    <>
      <Box mt="2px" flexShrink={0} style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.35))" }}>
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
        <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.5" mt={1} color="rgba(255,255,255,0.85)">
          {apagada && nota ? nota : texto}
        </Text>
      </Box>
    </>
  );

  if (apagada) return <Flex {...comun}>{dentro}</Flex>;
  if (href) {
    return (
      <Flex as="a" href={href} target="_blank" rel="noopener noreferrer" {...comun}>
        {dentro}
      </Flex>
    );
  }
  return (
    <Flex as="button" onClick={onClick} {...comun}>
      {dentro}
    </Flex>
  );
}

export function ViasDeContacto({ onEscribir }: { onEscribir: () => void }) {
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
      <Box px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }}>
        <Grid
          maxW="900px"
          mx="auto"
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={{ base: 4, md: 5 }}
        >
          <Via
            icono={IconoLlamada}
            titulo={t("contacto.via.llamada")}
            texto={t("contacto.via.llamadaTexto")}
            onClick={() => setLlamadaAbierta(true)}
          />
          <Via
            icono={IconoConocernos}
            titulo={t("contacto.via.conocernos")}
            texto={t("contacto.via.conocernosTexto")}
            onClick={() => setConocernosAbierta(true)}
          />
          <Via
            icono={IconoEmail}
            titulo={t("contacto.via.email")}
            texto={t("contacto.via.emailTexto")}
            onClick={onEscribir}
          />
          <Via
            icono={<IconoWhatsapp size="30px" />}
            titulo={t("contacto.via.whatsapp")}
            texto={t("contacto.via.whatsappTexto")}
            href={whatsappUrl(t("contacto.via.whatsappMensaje"))}
          />
          <Via
            icono={IconoInstagram}
            titulo={t("contacto.via.instagram")}
            texto={t("contacto.via.instagramTexto")}
            href={INSTAGRAM_URL}
          />
          <Via
            icono={IconoComunidad}
            titulo={t("contacto.via.comunidad")}
            texto={t("contacto.via.comunidadTexto")}
            href={WHATSAPP_COMUNIDAD_URL || undefined}
            apagada={!WHATSAPP_COMUNIDAD_URL}
            nota={t("contacto.via.comunidadPendiente")}
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
