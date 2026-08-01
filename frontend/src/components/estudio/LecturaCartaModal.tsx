import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { SpaceBg } from "../metodo/SpaceBg";
import { API_URL, AstrologiaIcon, astrologiaTxt } from "../../GlobalVariables";

/* ─────────────────────────────────────────────────────────────────────────────
 *  «Quiero una lectura de mi carta» — la salida de pago del estudio.
 *
 *  Dos opciones, nunca tres: con dos, la barata hace de ancla y la otra parece
 *  razonable. La de 30 € NO es un producto nuevo: es exactamente la primera
 *  disciplina de El Mapa (Astrología), que ya cuesta 30 € en Stripe y ya incluye
 *  la lectura. Por eso lleva al checkout que ya existe, en lugar de duplicar
 *  precio en otro sitio (dos puertas al mismo sitio con tarifas distintas es
 *  como se acaba cobrando de más a alguien).
 *
 *  La de 15 € es una lectura escrita a mano en PDF: no hay pago instantáneo
 *  porque hay trabajo detrás. Se pide aquí y llega como correo; María responde
 *  con el enlace de pago y la carta.
 * ───────────────────────────────────────────────────────────────────────────── */

/** Precio del PDF. El del Mapa vive en el servidor (payment.service.ts), que es
 *  quien cobra: aquí solo se enseña, y por eso se anota de dónde sale. */
const PRECIO_PDF = 15;
/** Debe coincidir con `unit_amount: 3000` de createMetodoCheckout. */
const PRECIO_MAPA = 30;

/**
 * Teléfono para pagar el PDF por Bizum. RELLÉNALO para que aparezca la opción:
 * mientras esté vacío no se enseña nada de Bizum (mejor no ofrecerlo que dar un
 * número equivocado).
 *
 * Ojo: esto es un pago A MANO. El Bizum no avisa a la web, así que la lectura la
 * mandas tú cuando veas el ingreso. Por eso solo está en el PDF, que ya es
 * manual: en la opción de 30 € el acceso lo abre Stripe solo, y un Bizum
 * obligaría a abrir cuentas a mano desde /admin/accesos.
 */
const BIZUM_TELEFONO = "";

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
}

export function LecturaCartaModal({ isOpen, onClose, email, datos }: Props) {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [pedido, setPedido] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPedido(false);
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
    <Box
      position="fixed"
      inset={0}
      zIndex={500}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 10 }}
      py={{ base: 6, md: 10 }}
      bg="rgba(0,0,0,0.82)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="100%"
        maxW="620px"
        maxH={{ base: "calc(100dvh - 48px)", md: "calc(100vh - 80px)" }}
        borderRadius="2xl"
        overflow="hidden"
        border={`1px solid ${color}66`}
        boxShadow={`0 0 32px ${color}55, 0 0 80px ${color}28, 0 12px 60px rgba(0,0,0,0.6)`}
        fontFamily="'EB Garamond', serif"
        display="flex"
        flexDirection="column"
      >
        <SpaceBg overlay="rgba(8,13,30,0.78)" />

        {/* X cerrar */}
        <Box
          position="absolute" top={3} right={3} zIndex={3}
          as="button" onClick={onClose}
          w="36px" h="36px" borderRadius="full"
          display="flex" alignItems="center" justifyContent="center"
          bg="rgba(0,0,0,0.6)" border={`1px solid ${color}66`} color={color}
          cursor="pointer" transition="all 0.15s" boxShadow={`0 0 14px ${color}44`}
          _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: color, boxShadow: `0 0 22px ${color}88` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </Box>

        <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 7, md: 8 }} overflowY="auto">
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
                {BIZUM_TELEFONO
                  ? <>Ya la tengo apuntada. Te escribo a <b>{email}</b> en cuanto esté lista.</>
                  : <>Te escribo a <b>{email}</b> con la forma de pago y, en cuanto esté, tu lectura. No hace falta que hagas nada más.</>}
              </Text>

              {/* Bizum: pago a mano, así que las instrucciones tienen que ser
                  imposibles de malinterpretar. El concepto es lo único que me
                  permite cruzar el ingreso con la petición. */}
              {BIZUM_TELEFONO && (
                <Box mt={2} px={{ base: 5, md: 6 }} py={{ base: 4, md: 5 }} borderRadius="xl"
                     bg="rgba(8,13,30,0.55)" border={`1px solid ${color}55`} maxW="440px" w="100%">
                  <Text color={color} fontSize={{ base: "sm", md: "md" }} fontWeight="700"
                        letterSpacing="0.1em" textTransform="uppercase" mb={3}>
                    Si prefieres, págala por Bizum
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
                    : BIZUM_TELEFONO
                    ? "Pínchalo y te digo cómo pagarla (tarjeta o Bizum)"
                    : "Pínchalo y te escribo yo"}
                </Text>
              </Box>

              {/* ── Opción 2: El Mapa (el producto que ya existe) ── */}
              <Box
                as="button"
                onClick={() => navigate("/checkoutMetodo")}
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
                  Tu carta leída dentro del recorrido interactivo: la rueda, tus planetas uno a uno,
                  tus casas, tus aspectos y tu lectura escrita. Te la recorres tú, a tu ritmo.
                </Text>
                <Text color={`${color}99`} fontSize="xs" mt={2} fontStyle="italic">
                  Es la primera disciplina de El Mapa · acceso inmediato
                </Text>
              </Box>

              {error && (
                <Text color="#ffb8b8" fontSize="sm" fontStyle="italic" textAlign="center">{error}</Text>
              )}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/** Botón + su popup. Es lo que se coloca en las pantallas del estudio. */
export function BotonLecturaCarta({
  email, datos, variant = "sutil",
}: {
  email?: string;
  datos?: DatosNacimiento;
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

        <Text
          position="relative"
          zIndex={1}
          color={astrologiaTxt}
          fontFamily="'EB Garamond', serif"
          fontSize={destacado ? { base: "md", md: "xl" } : { base: "sm", md: "lg" }}
          fontWeight="700"
          letterSpacing="0.08em"
          whiteSpace="nowrap"
          style={{ textShadow: `0 0 12px rgba(255,255,255,0.45), 0 0 28px ${astrologiaTxt}55` }}
        >
          Quiero una lectura de mi carta
        </Text>
      </Box>

      <LecturaCartaModal isOpen={open} onClose={() => setOpen(false)} email={email} datos={datos} />
    </>
  );
}
