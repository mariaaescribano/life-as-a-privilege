import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import PaginaLegal, { Lista, P, Seccion } from "./PaginaLegal";
import { estadoCookies, guardarConsentimiento, revocarConsentimiento } from "../../components/global/cookies";

/** Permite cambiar la decisión desde la propia política, como exige la norma. */
function PanelPreferencias() {
  const [estado, setEstado] = useState(estadoCookies());

  const textoEstado =
    estado === "aceptadas"
      ? "Ahora mismo has ACEPTADO las cookies analíticas."
      : estado === "rechazadas"
      ? "Ahora mismo has RECHAZADO las cookies analíticas."
      : "Todavía no has tomado una decisión.";

  const boton = {
    px: 6,
    py: "10px",
    borderRadius: "full",
    border: "1px solid rgba(255,255,255,0.45)",
    bg: "rgba(255,255,255,0.10)",
    color: "white",
    fontFamily: "'EB Garamond', serif",
    fontSize: "sm",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    transition: "all 0.22s ease",
    _hover: { bg: "rgba(255,255,255,0.22)", borderColor: "white" },
  };

  return (
    <Box
      border="1px solid rgba(255,255,255,0.28)"
      borderRadius="2xl"
      p={{ base: 5, md: 6 }}
      bg="rgba(255,255,255,0.06)"
      mb={{ base: 8, md: 10 }}
    >
      <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2}>
        Tus preferencias
      </Text>
      <Text color="rgba(255,255,255,0.88)" mb={4} lineHeight="1.75">
        {textoEstado} Puedes cambiar de opinión cuando quieras, aquí mismo.
      </Text>
      <Flex gap={3} flexWrap="wrap">
        <Box
          as="button"
          {...boton}
          onClick={() => {
            guardarConsentimiento("aceptadas");
            setEstado("aceptadas");
          }}
        >
          Aceptar analíticas
        </Box>
        <Box
          as="button"
          {...boton}
          onClick={() => {
            guardarConsentimiento("rechazadas");
            setEstado("rechazadas");
          }}
        >
          Rechazar analíticas
        </Box>
        <Box
          as="button"
          {...boton}
          onClick={() => {
            revocarConsentimiento();
            setEstado(null);
          }}
        >
          Volver a preguntarme
        </Box>
      </Flex>
    </Box>
  );
}

export default function Cookies() {
  return (
    <PaginaLegal
      titulo="Política de cookies"
      entradilla="Qué guardamos en tu navegador, para qué, y cómo cambiar tu decisión."
    >
      <PanelPreferencias />

      <Seccion titulo="1. Qué es una cookie">
        <P>
          Una cookie es un pequeño fichero que una web guarda en tu navegador. Sirve, por ejemplo,
          para recordar que has iniciado sesión o para contar cuánta gente visita una página.
        </P>
      </Seccion>

      <Seccion titulo="2. Cookies necesarias">
        <P>
          Son imprescindibles para que el sitio funcione, así que no requieren tu consentimiento
          (artículo 22.2 de la LSSI). Sin ellas no podrías iniciar sesión ni completar un pago.
        </P>
        <Lista
          items={[
            <>
              <strong>Sesión</strong> (almacenamiento local del navegador) — guarda tu identificador
              y tu token de acceso mientras navegas. Se borra al cerrar la pestaña.
            </>,
            <>
              <strong>Preferencia de cookies</strong> (almacenamiento local) — recuerda la decisión
              que tomaste aquí, para no volver a preguntártela en cada visita.
            </>,
            <>
              <strong>Stripe</strong> — durante el pago, para prevenir el fraude. Solo se activan si
              inicias una compra.
            </>,
          ]}
        />
      </Seccion>

      <Seccion titulo="3. Cookies analíticas (opcionales)">
        <P>
          Usamos Google Analytics para saber qué páginas se visitan y cómo se navega por el sitio, y
          así poder mejorarlo. Los datos se tratan de forma agregada y con la IP anonimizada.
        </P>
        <P>
          <strong>
            Estas cookies no se instalan hasta que pulsas «Aceptar». Si rechazas o no eliges nada,
            Google Analytics ni siquiera se carga.
          </strong>
        </P>
        <Lista
          items={[
            <>
              <strong>_ga, _ga_*</strong> — distinguen usuarios. Duración: hasta 2 años.
            </>,
            <>
              <strong>_gid</strong> — distingue usuarios. Duración: 24 horas.
            </>,
            <>
              <strong>_gat</strong> — limita la frecuencia de peticiones. Duración: 1 minuto.
            </>,
          ]}
        />
      </Seccion>

      <Seccion titulo="4. Cómo revocar o eliminar las cookies">
        <P>
          Usa el panel del principio de esta página para cambiar tu decisión en cualquier momento.
          Al rechazarlas, borramos también las cookies analíticas que hubiera.
        </P>
        <P>
          Además, puedes eliminar o bloquear cookies desde la configuración de tu navegador (Chrome,
          Firefox, Safari, Edge y el resto ofrecen esta opción en su apartado de privacidad). Ten en
          cuenta que bloquear las necesarias puede impedir que inicies sesión.
        </P>
      </Seccion>
    </PaginaLegal>
  );
}
