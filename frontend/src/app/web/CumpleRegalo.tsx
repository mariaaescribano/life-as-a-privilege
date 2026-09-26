// CumpleRegalo.tsx — /cumple?t=<token>
//
// Aquí aterriza el botón del correo de felicitación. El token es personal y lo
// comprueba el backend (de esta cuenta, sin caducar, sin gastar); si vale, se
// elige UNA disciplina y se paga a 15 € en un checkout que crea el servidor.
// Al pagar vuelve a /home?disciplina_pagada=…, igual que el pago de siempre.
import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { API_URL } from "../../GlobalVariables";
import { PRECIO_DISCIPLINA_EUR } from "../../components/metodo/pagoDisciplinaLink";
import { gestionaError } from "../../GlobalHelper";
import { useT, type ClaveTexto } from "../../i18n";

const NOMBRE: Record<string, ClaveTexto> = {
  metodo: "disciplina.astrologia",
  psicologia: "disciplina.psicologia",
  ayurveda: "disciplina.hinduismo",
  tcm: "disciplina.medicinaChina",
  fisiologia: "disciplina.fisiologia",
  nutricion: "disciplina.nutricion",
  cabala: "disciplina.cabala",
  cultura: "disciplina.cultura",
};

type Estado =
  | { valido: true; disciplinas: string[]; precio: number }
  | { valido: false; motivo: "invalido" | "otra-cuenta" | "caducado" | "usado" };

export default function CumpleRegalo() {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("t") ?? "";

  const [estado, setEstado] = useState<Estado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagando, setPagando] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    // Sin sesión: primero a iniciar sesión, y de vuelta aquí con el mismo enlace.
    if (!localStorage.getItem("userId")) {
      navigate(`/logIn?next=${encodeURIComponent(`/cumple?t=${token}`)}`, { replace: true });
      return;
    }
    if (!token) { setEstado({ valido: false, motivo: "invalido" }); return; }
    axios
      .get(`${API_URL}/payment/cumple/estado`, { params: { t: token } })
      .then((r) => setEstado(r.data))
      .catch((err) => setError(gestionaError(err).description));
  }, [token]);

  const elegir = async (scope: string) => {
    setPagando(scope);
    setError(null);
    try {
      const r = await axios.post(`${API_URL}/payment/cumple/checkout`, { token, scope });
      window.location.href = r.data.url;
    } catch (err) {
      setError(gestionaError(err).description);
      setPagando(null);
    }
  };

  const motivoTexto: Record<string, ClaveTexto> = {
    invalido: "cumple.motivo.invalido",
    "otra-cuenta": "cumple.motivo.otraCuenta",
    caducado: "cumple.motivo.caducado",
    usado: "cumple.motivo.usado",
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" direction="column" align="center" px={{ base: 5, md: 10 }} pt={{ base: 10, md: 14 }} pb={{ base: 20, md: 28 }} gap={6} textAlign="center">
        <Image src="/img/icono/life.webp" alt="" h={{ base: "60px", md: "80px" }} objectFit="contain"
               style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,0.78)) drop-shadow(0 0 26px rgba(255,255,255,0.42))" }} />
        <Text color="white" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase">
          {t("cumple.titulo")}
        </Text>

        {!estado && !error && <LifeLoader color="#ffffff" />}

        {error && (
          <Text color="white" fontSize={{ base: "md", md: "lg" }} maxW="560px">{error}</Text>
        )}

        {estado && !estado.valido && (
          <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" maxW="560px">
            {t(motivoTexto[estado.motivo] ?? "cumple.motivo.invalido")}
          </Text>
        )}

        {estado?.valido && estado.disciplinas.length === 0 && (
          <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" maxW="560px">
            {t("cumple.todasTuyas")}
          </Text>
        )}

        {estado?.valido && estado.disciplinas.length > 0 && (
          <>
            <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" maxW="600px">
              {t("cumple.subtitulo")}
            </Text>
            <Flex wrap="wrap" justify="center" gap={4} maxW="900px" pt={4}>
              {estado.disciplinas.map((scope) => (
                <Flex
                  key={scope}
                  as="button"
                  onClick={pagando ? undefined : () => elegir(scope)}
                  direction="column"
                  align="center"
                  gap={1}
                  w={{ base: "100%", sm: "200px" }}
                  px={6}
                  py={5}
                  borderRadius="2xl"
                  border="1.5px solid rgba(255,255,255,0.55)"
                  bg="rgba(255,255,255,0.10)"
                  cursor={pagando ? "not-allowed" : "pointer"}
                  opacity={pagando && pagando !== scope ? 0.5 : 1}
                  boxShadow="0 0 18px rgba(255,255,255,0.3)"
                  _hover={pagando ? {} : { bg: "rgba(255,255,255,0.2)", borderColor: "white" }}
                  transition="all 0.22s ease"
                >
                  <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700">
                    {t(NOMBRE[scope] ?? "disciplina.astrologia")}
                  </Text>
                  <Flex align="baseline" gap={2}>
                    <Text color="white" fontSize="2xl" fontWeight="700">{estado.precio} €</Text>
                    <Text color="rgba(255,255,255,0.7)" fontSize="md" textDecoration="line-through">
                      {PRECIO_DISCIPLINA_EUR} €
                    </Text>
                    {pagando === scope && <Spinner size="sm" color="white" />}
                  </Flex>
                </Flex>
              ))}
            </Flex>
            <Text color="rgba(255,255,255,0.8)" fontSize="sm" maxW="560px" pt={2}>
              {t("cumple.nota")}
            </Text>
          </>
        )}
      </Flex>

      <SiteFooter />
    </Box>
  );
}
