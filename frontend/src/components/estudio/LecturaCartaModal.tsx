import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { SpaceBg } from "../metodo/SpaceBg";
import { EstudioPopup } from "./EstudioPopup";
import { PRECIO_DISCIPLINA_EUR, STRIPE_LINK_DISCIPLINAS } from "../metodo/pagoDisciplinaLink";
import { API_URL, AstrologiaIcon, astrologiaTxt } from "../../GlobalVariables";

/* ─────────────────────────────────────────────────────────────────────────────
 *  «Quiero una lectura de mi carta» — la salida de pago del estudio.
 *
 *  Dos opciones, nunca tres. La de El Mapa NO es un producto nuevo: es
 *  exactamente la primera disciplina de El Mapa (Astrología), que ya cuesta
 *  30 € en Stripe y ya incluye la lectura. Por eso lleva a /elMetodo (la página
 *  de El Mapa, con su propio botón de compra) en lugar de duplicar precio en
 *  otro sitio: dos puertas al mismo sitio con tarifas distintas es como se
 *  acaba cobrando de más a alguien.
 *
 *  La del PDF es una lectura escrita a mano: no hay pago instantáneo porque hay
 *  trabajo detrás. Se pide aquí y llega como correo; María responde con el
 *  enlace de pago y la carta.
 * ───────────────────────────────────────────────────────────────────────────── */

/** Precio del PDF: el mismo que una disciplina, porque se cobra por el mismo
 *  Payment Link. Sale de `pagoDisciplinaLink` para que no haya dos cifras
 *  distintas; el importe real lo fija ese enlace en el panel de Stripe. */
const PRECIO_PDF = PRECIO_DISCIPLINA_EUR;
/** Debe coincidir con `unit_amount: 3000` de createMetodoCheckout. */
const PRECIO_MAPA = PRECIO_DISCIPLINA_EUR;

/**
 * Payment Link de Stripe para la lectura en PDF: el MISMO que el de las
 * disciplinas de El Mapa, porque ahora las dos opciones valen lo mismo (30 €).
 * Un solo enlace = una sola cifra que mantener en Stripe.
 *
 * LA VUELTA A LA WEB NO DEPENDE DE STRIPE. El pago se abre en OTRA PESTAÑA: la
 * web se queda intacta detrás y, al terminar, se cierra la de Stripe y ya se
 * está de vuelta. (Ese enlace tiene configurada su redirección a
 * /home?disciplina_pagada=…, que es lo que necesita El Mapa; quien pague desde
 * aquí acabará en esa pestaña, no en /estudio. No desbloquea nada: sin un
 * `client_reference_id` con la forma «scope__userId», el verify no concede
 * ninguna disciplina.)
 *
 * En este mismo enlace puedes activar BIZUM como método de pago (Stripe →
 * Configuración → Métodos de pago → Bizum): quien pulse el botón elige tarjeta
 * o Bizum en la propia pantalla de Stripe y el cobro te llega solo.
 *
 * Vacío = no se enseña ningún botón de pago.
 */
const LECTURA_PDF_LINK = STRIPE_LINK_DISCIPLINAS;

/**
 * El enlace, con quién paga colgado detrás. Sirve para lo que iba a servir la
 * redirección: saber de quién es cada cobro.
 *
 *   · prefilled_email    → Stripe abre el pago con SU email ya escrito, así que
 *                          el cobro aparece en tu panel con ese mismo correo.
 *   · client_reference_id→ su id del estudio, visible en el pago de Stripe.
 *
 * Stripe solo admite [A-Za-z0-9_-] en client_reference_id; un uuid encaja.
 */
function enlaceDePago(email?: string, participanteId?: string): string {
  const url = new URL(LECTURA_PDF_LINK);
  if (email) url.searchParams.set("prefilled_email", email);
  if (participanteId && /^[A-Za-z0-9_-]{1,200}$/.test(participanteId)) {
    url.searchParams.set("client_reference_id", participanteId);
  }
  return url.toString();
}

/**
 * Teléfono para pagar el PDF por Bizum A MANO (sin Stripe). RELLÉNALO solo si
 * quieres ofrecer también esta vía: el Bizum directo no avisa a la web, así que
 * tendrías que ver el ingreso y mandar la lectura tú.
 *
 * Si activas Bizum dentro del Payment Link de arriba, esto sobra.
 *
 * Solo está en el PDF, que ya es manual: en la opción de 30 € el acceso lo abre
 * Stripe solo, y un Bizum directo obligaría a abrir cuentas a mano desde
 * /admin/accesos.
 */
const BIZUM_TELEFONO = "647 859 892";

interface DatosNacimiento {
  fecha_nacimiento: string;
  hora_nacimiento: string;
  pais: string;
  region: string;
  lugar: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Email con el que participa: se usa para pedir la lectura sin volver a teclearlo. */
  email?: string;
  datos?: DatosNacimiento;
  /** Su id del estudio: viaja hasta Stripe para poder casar el cobro. */
  participanteId?: string;
}

export function LecturaCartaModal({ isOpen, onClose, email, datos, participanteId }: Props) {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [pedido, setPedido] = useState(false);
  const [pagoAbierto, setPagoAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPedido(false);
    setPagoAbierto(false);
    setError(null);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const color = astrologiaTxt;

  const pedirPdf = async () => {
    if (!email) {
      setError("Vuelve a la pantalla de datos y deja tu email para poder pedirla.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const lugar = [datos?.lugar, datos?.region, datos?.pais].filter(Boolean).join(", ");
      await axios.post(`${API_URL}/contact`, {
        nombre: "Participante del estudio de astrología",
        email,
        titulo: `Lectura de carta en PDF (${PRECIO_PDF} €)`,
        mensaje:
          `Pide la lectura de su carta en PDF.\n\n` +
          `Email: ${email}\n` +
          `Nacimiento: ${datos?.fecha_nacimiento ?? "—"} a las ${datos?.hora_nacimiento ?? "—"}\n` +
          `Lugar: ${lugar || "—"}\n\n` +
          `Viene del estudio estadístico (/estudio).`,
      });
      setPedido(true);
    } catch {
      setError("No se ha podido enviar la petición. Inténtalo de nuevo en un rato.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <EstudioPopup onClose={onClose} color={color} overlay="rgba(8,13,30,0.78)">
        <Box position="relative" zIndex={1} flex="1 1 auto" minH={0}
             px={{ base: 5, md: 8 }} py={{ base: 7, md: 8 }} overflowY="auto">
          <Flex direction="column" align="center" gap={2} textAlign="center" mb={6}>
            <AstrologiaIcon size={{ base: "34px", md: "42px" }} />
            <Text color={color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.06em"
                  style={{ textShadow: `0 0 14px rgba(255,255,255,0.5), 0 0 32px ${color}66` }}>
              Tu carta, leída
            </Text>
          </Flex>

          {pedido ? (
            <Flex direction="column" align="center" gap={3} textAlign="center" py={{ base: 4, md: 6 }}>
              <Text color={color} fontSize={{ base: "lg", md: "xl" }} fontWeight="700">
                Pedida ✓
              </Text>
              <Text color={`${color}dd`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" maxW="420px">
                {LECTURA_PDF_LINK || BIZUM_TELEFONO
                  ? <>Ya la tengo apuntada. Te escribo a <b>{email}</b> en cuanto esté lista.</>
                  : <>Te escribo a <b>{email}</b> con la forma de pago y, en cuanto esté, tu lectura. No hace falta que hagas nada más.</>}
              </Text>

              {/* Pago con tarjeta (y Bizum, si está activado en el enlace de
                  Stripe): esto sí es automático, el cobro llega solo. */}
              {LECTURA_PDF_LINK && (
                <>
                  <Box
                    as="a"
                    href={enlaceDePago(email, participanteId)}
                    // En OTRA pestaña a propósito: así la web se queda abierta
                    // detrás y volver es cerrar la de Stripe. No hace falta
                    // configurar ninguna redirección para que nadie se pierda.
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setPagoAbierto(true)}
                    mt={2}
                    px={{ base: 8, md: 10 }}
                    py={{ base: 3.5, md: 4 }}
                    borderRadius="full"
                    bg={`${color}22`}
                    border={`2px solid ${color}`}
                    color={color}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="700"
                    letterSpacing="0.1em"
                    transition="all 0.22s"
                    _hover={{ bg: `${color}33`, boxShadow: `0 0 24px ${color}55` }}
                  >
                    Pagar {PRECIO_PDF} €
                  </Box>

                  <Text color={`${color}99`} fontSize="xs" fontStyle="italic" lineHeight="1.6" maxW="360px">
                    {pagoAbierto
                      ? "El pago se ha abierto en otra pestaña. Cuando termines, ciérrala y estarás de vuelta aquí."
                      : "Se abre en otra pestaña, con tarjeta o Bizum."}
                  </Text>
                </>
              )}

              {/* Bizum: pago a mano, así que las instrucciones tienen que ser
                  imposibles de malinterpretar. El concepto es lo único que me
                  permite cruzar el ingreso con la petición. */}
              {BIZUM_TELEFONO && (
                <Box mt={2} px={{ base: 5, md: 6 }} py={{ base: 4, md: 5 }} borderRadius="xl"
                     bg="rgba(8,13,30,0.55)" border={`1px solid ${color}55`} maxW="440px" w="100%">
                  <Text color={color} fontSize={{ base: "sm", md: "md" }} fontWeight="700"
                        letterSpacing="0.1em" textTransform="uppercase" mb={3}>
                    {LECTURA_PDF_LINK ? "O por Bizum" : "Si prefieres, págala por Bizum"}
                  </Text>
                  <Flex direction="column" gap={2} textAlign="left">
                    <Text color={`${color}dd`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                      Número: <b>{BIZUM_TELEFONO}</b>
                    </Text>
                    <Text color={`${color}dd`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                      Importe: <b>{PRECIO_PDF} €</b>
                    </Text>
                    <Text color={`${color}dd`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                      Concepto: <b>tu nombre completo</b>
                    </Text>
                  </Flex>
                  <Text color={`${color}99`} fontSize="xs" mt={3} fontStyle="italic" lineHeight="1.6" textAlign="left">
                    Pon tu nombre completo en el concepto: es lo que me permite saber que ese Bizum
                    es tuyo. En cuanto lo vea, me pongo con tu carta.
                  </Text>
                </Box>
              )}
            </Flex>
          ) : (
            <Flex direction="column" gap={4}>
              {/* ── Opción 1: PDF ── */}
              <Box
                as="button"
                onClick={() => { if (!enviando) void pedirPdf(); }}
                textAlign="left"
                w="100%"
                px={{ base: 5, md: 6 }}
                py={{ base: 4, md: 5 }}
                borderRadius="xl"
                bg="rgba(8,13,30,0.5)"
                border={`1px solid ${color}55`}
                cursor={enviando ? "wait" : "pointer"}
                opacity={enviando ? 0.6 : 1}
                transition="all 0.22s"
                _hover={enviando ? {} : { borderColor: color, boxShadow: `0 0 22px ${color}44`, transform: "translateY(-2px)" }}
              >
                <Flex align="baseline" justify="space-between" gap={4} mb={1}>
                  <Text color={color} fontSize={{ base: "lg", md: "xl" }} fontWeight="700">
                    Lectura en PDF
                  </Text>
                  <Text color={color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" flexShrink={0}>
                    {PRECIO_PDF} €
                  </Text>
                </Flex>
                <Text color={`${color}aa`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                  Tu carta completa escrita a mano, para leerla y guardarla. Te llega por correo.
                </Text>
                <Text color={`${color}88`} fontSize="xs" mt={2} fontStyle="italic">
                  {enviando
                    ? "Enviando…"
                    : LECTURA_PDF_LINK || BIZUM_TELEFONO
                    ? "Pínchalo y eliges cómo pagarla"
                    : "Pínchalo y te escribo yo"}
                </Text>
              </Box>

              {/* ── Opción 2: El Mapa (el producto que ya existe) ── */}
              <Box
                as="button"
                onClick={() => navigate("/elMetodo")}
                textAlign="left"
                w="100%"
                px={{ base: 5, md: 6 }}
                py={{ base: 4, md: 5 }}
                borderRadius="xl"
                bg={`${color}1a`}
                border={`1px solid ${color}`}
                cursor="pointer"
                transition="all 0.22s"
                boxShadow={`0 0 18px ${color}33`}
                _hover={{ bg: `${color}2a`, boxShadow: `0 0 28px ${color}66`, transform: "translateY(-2px)" }}
              >
                <Flex align="baseline" justify="space-between" gap={4} mb={1}>
                  <Text color={color} fontSize={{ base: "lg", md: "xl" }} fontWeight="700">
                    Lectura por El Mapa
                  </Text>
                  <Text color={color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" flexShrink={0}>
                    {PRECIO_MAPA} €
                  </Text>
                </Flex>
                <Text color={`${color}dd`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                  Tu carta leída en profundidad por mí. No te quedarán dudas. Descubrirás tus dones,
                  conflictos, heridas y tus recursos internos para dejar de sufrir.
                </Text>
                <Text color={`${color}99`} fontSize="xs" mt={2} fontStyle="italic">
                  Es la primera disciplina de El Mapa · míralo aquí
                </Text>
              </Box>

              {error && (
                <Text color="#ffb8b8" fontSize="sm" fontStyle="italic" textAlign="center">{error}</Text>
              )}
            </Flex>
          )}
        </Box>
    </EstudioPopup>
  );
}

/** Botón + su popup. Es lo que se coloca en las pantallas del estudio. */
export function BotonLecturaCarta({
  email, datos, participanteId, variant = "sutil",
}: {
  email?: string;
  datos?: DatosNacimiento;
  participanteId?: string;
  /** "sutil" para no competir con el botón principal; "destacado" al final. */
  variant?: "sutil" | "destacado";
}) {
  const [open, setOpen] = useState(false);
  const destacado = variant === "destacado";

  return (
    <>
      {/* Lleva el cielo de fondo (space.jpg): es lo único de la pantalla que se
          sale del turquesa, así que se ve enseguida sin gritar. */}
      <Box
        as="button"
        onClick={() => setOpen(true)}
        position="relative"
        overflow="hidden"
        px={destacado ? { base: 8, md: 12 } : { base: 7, md: 9 }}
        py={destacado ? { base: 4, md: 5 } : { base: 3, md: 3.5 }}
        borderRadius="full"
        // Contorno marcado: ahora que los boxes no llevan ninguno, la línea es lo
        // que distingue «esto se pulsa» de «esto se lee».
        border={`2px solid ${astrologiaTxt}`}
        cursor="pointer"
        transition="transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease"
        boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 38px ${astrologiaTxt}22`}
        _hover={{
          transform: "translateY(-2px)",
          borderColor: astrologiaTxt,
          boxShadow: `0 0 24px rgba(255,255,255,0.3), 0 0 56px ${astrologiaTxt}3a`,
        }}
      >
        <SpaceBg overlay="rgba(8,13,30,0.55)" />

        {/* El icono de astrología SIEMPRE a la izquierda del texto. */}
        <Flex position="relative" zIndex={1} align="center" justify="center" gap={3}>
          <AstrologiaIcon size={destacado ? { base: "26px", md: "32px" } : { base: "22px", md: "28px" }} />
          <Text
            color={astrologiaTxt}
            fontFamily="'EB Garamond', serif"
            fontSize={destacado ? { base: "md", md: "xl" } : { base: "sm", md: "lg" }}
            fontWeight="700"
            letterSpacing="0.08em"
            whiteSpace="nowrap"
            style={{ textShadow: `0 0 12px rgba(255,255,255,0.45), 0 0 28px ${astrologiaTxt}55` }}
          >
            Quiero profundizar en mi carta
          </Text>
        </Flex>
      </Box>

      <LecturaCartaModal isOpen={open} onClose={() => setOpen(false)}
                         email={email} datos={datos} participanteId={participanteId} />
    </>
  );
}
