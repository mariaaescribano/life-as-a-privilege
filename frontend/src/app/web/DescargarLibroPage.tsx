import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { API_URL } from "../../GlobalVariables";

type VerifyOk = {
  ok: true;
  libroId: string;
  titulo: string;
  pdfLink: string;
};
type VerifyFail = { ok: false; reason?: string };
type VerifyResponse = VerifyOk | VerifyFail;

type Status = "verifying" | "ok" | "error";

export default function DescargarLibroPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<Status>("verifying");
  const [libro, setLibro] = useState<VerifyOk | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const downloadedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMsg("Falta el identificador de sesión.");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/payment/libros/verify?session_id=${encodeURIComponent(sessionId)}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: VerifyResponse = await res.json();
        if (cancelled) return;

        if (!data.ok) {
          setStatus("error");
          setErrorMsg(
            data.reason === "unpaid"
              ? "El pago aún no se ha completado."
              : "No hemos podido verificar la compra."
          );
          return;
        }

        setLibro(data);
        setStatus("ok");

        if (!downloadedRef.current) {
          downloadedRef.current = true;
          triggerDownload(data.pdfLink, data.titulo);
        }
      } catch (err) {
        console.error("Error verificando compra:", err);
        if (cancelled) return;
        setStatus("error");
        setErrorMsg("No hemos podido verificar la compra. Contacta con nosotros si el cobro se hizo.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const reDownload = () => {
    if (libro) triggerDownload(libro.pdfLink, libro.titulo);
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "48px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.78)) drop-shadow(0 0 21px rgba(255,255,255,0.42)) drop-shadow(0 0 42px rgba(180,255,245,0.32))" }}
        />
      </Flex>

      <Flex flex={1} direction="column" align="center" justify="center" textAlign="center" px={{ base: 5, md: 10 }} py={{ base: 12, md: 16 }} gap={{ base: 4, md: 6 }}>
        {status === "verifying" && (
          <>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="700"
              letterSpacing="0.1em"
              textTransform="uppercase"
              textShadow="0 0 14px rgba(255,255,255,0.7), 0 0 30px rgba(180,255,245,0.4)"
            >
              Verificando tu compra…
            </Text>
            <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic">
              Un momento, por favor.
            </Text>
          </>
        )}

        {status === "ok" && libro && (
          <>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="700"
              letterSpacing="0.08em"
              lineHeight="1.2"
              textShadow="0 0 14px rgba(255,255,255,0.85), 0 0 30px rgba(180,255,245,0.45)"
            >
              ¡Gracias por tu compra!
            </Text>
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "xl" }} maxW="640px">
              Tu descarga de <strong>{libro.titulo}</strong> debería haberse iniciado automáticamente. Si no ha ocurrido, pulsa el botón:
            </Text>
            <Flex
              as="button"
              onClick={reDownload}
              mt={2}
              align="center"
              justify="center"
              gap={3}
              px={{ base: 7, md: 10 }}
              py={{ base: 3, md: "14px" }}
              borderRadius="full"
              border="1px solid rgba(255,255,255,0.7)"
              bg="rgba(255,255,255,0.1)"
              color="white"
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.16em"
              textTransform="uppercase"
              cursor="pointer"
              boxShadow="0 0 18px rgba(255,255,255,0.4), 0 0 42px rgba(180,255,245,0.28)"
              _hover={{ bg: "rgba(255,255,255,0.22)", boxShadow: "0 0 24px rgba(255,255,255,0.65), 0 0 54px rgba(180,255,245,0.4)" }}
              transition="all 0.25s ease"
            >
              Descargar PDF ↓
            </Flex>
            <Flex
              as="button"
              onClick={() => navigate("/libros")}
              mt={2}
              color="rgba(255,255,255,0.78)"
              fontSize="sm"
              letterSpacing="0.14em"
              textTransform="uppercase"
              bg="transparent"
              border="none"
              cursor="pointer"
              _hover={{ color: "white" }}
            >
              ← Volver a libros
            </Flex>
          </>
        )}

        {status === "error" && (
          <>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="700"
              letterSpacing="0.08em"
              textShadow="0 0 14px rgba(255,255,255,0.6)"
            >
              No hemos podido completar la descarga
            </Text>
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} maxW="640px">
              {errorMsg}
            </Text>
            <Flex
              as="button"
              onClick={() => navigate("/libros")}
              mt={2}
              align="center"
              justify="center"
              px={{ base: 7, md: 10 }}
              py={3}
              borderRadius="full"
              border="1px solid rgba(255,255,255,0.7)"
              bg="rgba(255,255,255,0.08)"
              color="white"
              fontWeight="600"
              letterSpacing="0.14em"
              textTransform="uppercase"
              cursor="pointer"
              _hover={{ bg: "rgba(255,255,255,0.18)" }}
              transition="all 0.25s ease"
            >
              ← Volver a libros
            </Flex>
          </>
        )}
      </Flex>

      <SiteFooter />
    </Box>
  );
}

function triggerDownload(url: string, titulo: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.download = `${titulo}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
