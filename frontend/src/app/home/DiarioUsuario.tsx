// ─────────────────────────────────────────────────────────────────────────────
// TUS SESIONES · la tarjeta pequeña de /home, hermana de «Tu camino».
//
// Enseña SOLO la última entrada (fecha, disciplina y un par de líneas) y un
// botón para abrir /diario, donde se leen todas. El diario crece con el tiempo
// y aquí no cabe: esta caja es el aviso, no el contenido.
//
// Si la persona no tiene ninguna entrada publicada, NO SE PINTA NADA — la misma
// regla que «Tu camino». Así, para quien nunca ha tenido una sesión, el Home no
// cambia ni un píxel.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { listarMias, type EntradaDiario } from "../../api/diario";
import { caraDeEntrada, fechaCorta } from "./diarioCara";
import { useT, useIdioma } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { cacheDeOtraCuenta } from "../../api/sesion";

// Igual que el progreso del camino: se guarda a nivel de módulo para que al
// volver al Home dentro de la misma sesión la tarjeta salga ya puesta, sin
// parpadeo. `null` = todavía no se ha preguntado.
let diarioCache: EntradaDiario[] | null = null;

/** Para que la página /diario pueda apagar la marca de «nuevo» sin recargar. */
export const olvidarCacheDiario = () => {
  diarioCache = null;
};

export default function DiarioUsuario() {
  // Si se ha cambiado de cuenta en esta pestaña, el diario guardado es de otra persona.
  if (cacheDeOtraCuenta("diario")) diarioCache = null;
  const t = useT();
  const { idioma } = useIdioma();
  const navigate = useNavigate();
  const nombreDisciplina = useNombreDisciplina();
  const [entradas, setEntradas] = useState<EntradaDiario[] | null>(diarioCache);

  useEffect(() => {
    if (diarioCache) return;
    let cancel = false;
    listarMias().then((lista) => {
      diarioCache = lista;
      if (!cancel) setEntradas(lista);
    });
    return () => {
      cancel = true;
    };
  }, []);

  if (!entradas || entradas.length === 0) return null;

  const ultima = entradas[0];
  const sinLeer = entradas.filter((e) => !e.leida_at).length;
  const cara = caraDeEntrada(ultima.disciplina);
  const locale = idioma === "en" ? "en-GB" : "es-ES";
  const etiqueta = cara.nom ? nombreDisciplina(cara.nom, true) : t("diario.sinDisciplina");

  return (
    <Box
      as="button"
      onClick={() => navigate("/diario")}
      display="block"
      textAlign="left"
      w="100%"
      maxW={{ base: "420px", md: "260px" }}
      px={4}
      py={{ base: 4, md: 5 }}
      borderRadius="2xl"
      bg="rgba(255,255,255,0.07)"
      border="1px solid rgba(255,255,255,0.2)"
      fontFamily="'EB Garamond', serif"
      cursor="pointer"
      role="group"
      transition="border-color 0.2s, transform 0.2s"
      _hover={{ borderColor: "rgba(255,255,255,0.55)", transform: "translateY(-2px)" }}
    >
      {/* ── Cabecera: el título y, si las hay, las que no ha leído ── */}
      <Flex align="center" justify="space-between" gap={2}>
        <Text color="white" fontSize="sm" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase">
          {t("diario.titulo")}
        </Text>
        {sinLeer > 0 && (
          <Box
            flexShrink={0}
            w="9px"
            h="9px"
            borderRadius="full"
            bg="white"
            style={{ boxShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(180,255,245,0.6)" }}
          />
        )}
      </Flex>

      {sinLeer > 0 && (
        <Text color="rgba(255,255,255,0.8)" fontSize="xs" mt={1}>
          {t("diario.nuevas", { n: String(sinLeer) })}
        </Text>
      )}

      {/* ── La última entrada ── */}
      <Flex align="center" gap={2} mt={3}>
        <Box
          flexShrink={0}
          px={2}
          py="1px"
          borderRadius="full"
          bg={cara.bg}
          border={`1px solid ${cara.txt}99`}
        >
          <Text color={cara.txt} fontSize="10px" fontWeight="700" letterSpacing="0.06em" noOfLines={1}>
            {etiqueta}
          </Text>
        </Box>
        <Text color="rgba(255,255,255,0.65)" fontSize="xs" noOfLines={1}>
          {fechaCorta(ultima.fecha, locale)}
        </Text>
      </Flex>

      {ultima.titulo && (
        <Text color="white" fontSize="sm" fontWeight="600" mt={1.5} noOfLines={1}>
          {ultima.titulo}
        </Text>
      )}

      <Text color="rgba(255,255,255,0.62)" fontSize="xs" mt={1} lineHeight="1.5" noOfLines={2}>
        {ultima.contenido}
      </Text>

      <Text
        color="rgba(255,255,255,0.85)"
        fontSize="xs"
        fontWeight="600"
        mt={3}
        letterSpacing="0.04em"
        _groupHover={{ color: "white" }}
      >
        {t("diario.verTodas", { n: String(entradas.length) })} →
      </Text>
    </Box>
  );
}
